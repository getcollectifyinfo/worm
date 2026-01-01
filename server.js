import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription;
    const customerId = session.customer;

    if (userId) {
      console.log(`Granting PRO access to user: ${userId}`);
      
      // Fetch subscription details to get period end
      let subscriptionEnd = null;
      if (subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        } catch (e) {
            console.error('Error fetching subscription details:', e);
        }
      }

      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { 
            app_metadata: { 
                subscription_status: 'active',
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                subscription_end: subscriptionEnd
            } 
        }
      );

      if (error) {
        console.error('Supabase update error:', error);
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }
    }
  }

  res.json({ received: true });
});

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { returnUrl, userId, userEmail } = req.body;
    const session = await stripe.checkout.sessions.create({
      client_reference_id: userId,
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: {
              name: 'Skytest Paketi (Aylık)',
              description: 'Tüm modüllere sınırsız erişim (VIGI, IPP, Cube Rotation vb.)',
            },
            unit_amount: 50000, // 500.00 TL
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: req.body.returnUrl ? `${req.body.returnUrl}?success=true` : `${req.headers.origin || 'http://localhost:5173'}/?success=true`,
      cancel_url: req.body.returnUrl ? `${req.body.returnUrl}?canceled=true` : `${req.headers.origin || 'http://localhost:5173'}/?canceled=true`,
    });
    
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cancel-subscription', async (req, res) => {
  const { subscriptionId } = req.body;
  
  if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID required' });
  }

  try {
    // Cancel at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    
    // Optionally update Supabase user metadata immediately to reflect 'canceling' state
    // But we can rely on frontend state for now or webhook updates
    
    res.json({ 
        status: 'success', 
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString() 
    });
  } catch (err) {
    console.error('Cancel Subscription Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Local Payment Server running at http://localhost:${port}`);
});
