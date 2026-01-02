
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Vercel specific config to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

// Helper to read raw body
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
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

      // Send email notification for new subscription
      await sendNotificationEmail(
        'Yeni Abonelik!',
        `Kullanıcı (ID: ${userId}) yeni bir abonelik başlattı.\nSubscription ID: ${subscriptionId}\nBitiş Tarihi: ${subscriptionEnd}`
      );
    }
  }

  res.json({ received: true });
}
