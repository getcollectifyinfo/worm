import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async (subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set. Skipping email notification.');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ergunakin@gmail.com',
      subject: `[CadetPrep] ${subject}`,
      text: text,
    });
    console.log(`Email sent: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. User updates will fail.');
}

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
            if (subscription.current_period_end) {
                const end = new Date(subscription.current_period_end * 1000);
                if (!isNaN(end.getTime())) {
                    subscriptionEnd = end.toISOString();
                }
            } else if (subscription.billing_cycle_anchor) {
                 const anchor = new Date(subscription.billing_cycle_anchor * 1000);
                 anchor.setMonth(anchor.getMonth() + 1);
                 subscriptionEnd = anchor.toISOString();
            } else {
                 const now = new Date();
                 now.setDate(now.getDate() + 30);
                 subscriptionEnd = now.toISOString();
            }
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
    const { returnUrl, userId, userEmail, locale = 'auto' } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      client_reference_id: userId,
      customer_email: userEmail,
      locale: locale,
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
      success_url: (() => {
        const base = req.body.returnUrl || `${req.headers.origin || 'http://localhost:5173'}/`;
        try {
          const urlObj = new URL(base);
          urlObj.searchParams.append('success', 'true');
          return urlObj.toString();
        } catch (e) {
          // Fallback if base is not a valid URL (e.g. relative path)
          const separator = base.includes('?') ? '&' : '?';
          return `${base}${separator}success=true`;
        }
      })(),
      cancel_url: (() => {
        const base = req.body.returnUrl || `${req.headers.origin || 'http://localhost:5173'}/`;
        try {
            const urlObj = new URL(base);
            urlObj.searchParams.append('canceled', 'true');
            return urlObj.toString();
        } catch (e) {
            const separator = base.includes('?') ? '&' : '?';
            return `${base}${separator}canceled=true`;
        }
      })(),
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
    
    let currentPeriodEndStr = null;
    if (subscription.current_period_end) {
        const end = new Date(subscription.current_period_end * 1000);
        if (!isNaN(end.getTime())) {
            currentPeriodEndStr = end.toISOString();
        }
    }

    res.json({ 
        status: 'success', 
        current_period_end: currentPeriodEndStr 
    });
  } catch (err) {
    console.error('Cancel Subscription Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/verify-subscription', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // 1. Check if already active in Supabase
        // If user is already active AND has stripe_subscription_id, we can skip check
        // BUT if stripe_subscription_id is missing (legacy data), we must verify.
        if (user.app_metadata?.subscription_status === 'active' && user.app_metadata?.stripe_subscription_id) {
            return res.json({ status: 'active', source: 'cache' });
        }

        // 2. Check Stripe directly
        console.log(`[Verify] Verifying subscription for email: ${user.email} (User ID: ${user.id})`);
        
        let activeSubscription = null;

        // STRATEGY A: Search by client_reference_id (Most Reliable)
        try {
            // Note: client_reference_id is stored in the Checkout Session, not Subscription.
            // But we can search for Sessions and get the subscription from there.
            const sessions = await stripe.checkout.sessions.list({
                limit: 5,
                // We cannot filter by client_reference_id in list(), only in search(). 
                // Using search API:
            });
            
            // Actually, let's use search API
            const searchResults = await stripe.checkout.sessions.search({
                query: `client_reference_id:'${user.id}'`,
                limit: 1
            });
            
            if (searchResults.data.length > 0) {
                const session = searchResults.data[0];
                console.log(`[Verify] Found Checkout Session ${session.id} for user ${user.id}`);
                
                if (session.subscription) {
                    const sub = await stripe.subscriptions.retrieve(session.subscription);
                    if (sub.status === 'active' || sub.status === 'trialing') {
                        activeSubscription = sub;
                        console.log(`[Verify] Found active subscription via Session: ${sub.id}`);
                    }
                }
            }
        } catch (searchErr) {
            console.error('[Verify] Session search failed:', searchErr.message);
        }

        // STRATEGY B: Search by Email (Fallback)
        if (!activeSubscription) {
            console.log('[Verify] Falling back to email search...');
            const customers = await stripe.customers.list({
                email: user.email,
                limit: 5
            });

            console.log(`[Verify] Found ${customers.data.length} customers with email ${user.email}`);

            for (const customer of customers.data) {
                const subscriptions = await stripe.subscriptions.list({
                    customer: customer.id,
                    status: 'active',
                    limit: 1
                });
                
                if (subscriptions.data.length > 0) {
                    activeSubscription = subscriptions.data[0];
                    console.log(`[Verify] Found active subscription ${activeSubscription.id} for customer ${customer.id}`);
                    break;
                }
            }
        }

        if (activeSubscription) {
            console.log(`[Verify] Updating Supabase user ${user.id} with active subscription...`);
            
            let subscriptionEnd = null;
            if (activeSubscription.current_period_end) {
                const end = new Date(activeSubscription.current_period_end * 1000);
                if (!isNaN(end.getTime())) {
                    subscriptionEnd = end.toISOString();
                }
            } else if (activeSubscription.billing_cycle_anchor) {
                 // Fallback: assume monthly from anchor
                 const anchor = new Date(activeSubscription.billing_cycle_anchor * 1000);
                 anchor.setMonth(anchor.getMonth() + 1);
                 subscriptionEnd = anchor.toISOString();
            } else {
                 // Ultimate fallback: 30 days from now
                 const now = new Date();
                 now.setDate(now.getDate() + 30);
                 subscriptionEnd = now.toISOString();
            }
            
            // Update Supabase
            const { data, error: updateError } = await supabase.auth.admin.updateUserById(
                user.id,
                { 
                    app_metadata: { 
                        subscription_status: 'active',
                        stripe_subscription_id: activeSubscription.id,
                        stripe_customer_id: activeSubscription.customer,
                        subscription_end: subscriptionEnd
                    } 
                }
            );

            if (updateError) {
                console.error('[Verify] Supabase update error:', updateError);
                return res.status(500).json({ error: 'Failed to update user' });
            }

            console.log('[Verify] Supabase update successful:', data);
            return res.json({ status: 'active', source: 'stripe_sync' });
        }

        console.log('[Verify] No active subscription found for this user.');
        return res.json({ status: 'inactive' });

    } catch (err) {
        console.error('Verify Subscription Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
  console.log(`Local Payment Server running at http://localhost:${port}`);
});
