import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  try {
    // Check for required environment variables
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

    if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.error('Missing environment variables');
      return res.status(500).json({ 
        error: 'Configuration Error', 
        details: 'Missing environment variables',
        missing: {
          STRIPE_SECRET_KEY: !STRIPE_SECRET_KEY,
          SUPABASE_URL: !SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: !SUPABASE_SERVICE_ROLE_KEY,
          STRIPE_WEBHOOK_SECRET: !STRIPE_WEBHOOK_SECRET
        }
      });
    }

    // Initialize clients inside handler to catch config errors gracefully
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (req.method === 'POST') {
      let event;

      try {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(buf, sig, STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        if (userId) {
          console.log(`Granting PRO access to user: ${userId}`);
          const { error } = await supabase.auth.admin.updateUserById(
            userId,
            { app_metadata: { subscription_status: 'active' } }
          );

          if (error) {
            console.error('Supabase update error:', error);
            return res.status(500).json({ error: 'Failed to update user', details: error.message });
          }
        }
      }

      return res.json({ received: true });
    } else {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
  } catch (err) {
    console.error('Unexpected Server Error:', err);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: err.message 
    });
  }
}
