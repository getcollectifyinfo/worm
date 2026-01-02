
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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

    // 1. Check if already active in Supabase (and has ID)
    if (user.app_metadata?.subscription_status === 'active' && user.app_metadata?.stripe_subscription_id) {
        return res.json({ status: 'active', source: 'cache' });
    }

    // 2. Check Stripe directly
    let activeSubscription = null;
    let debugInfo = [];

    // STRATEGY A: Search by client_reference_id (Most Reliable)
    try {
        const searchResults = await stripe.checkout.sessions.search({
            query: `client_reference_id:'${user.id}'`,
            limit: 1
        });
        
        if (searchResults.data.length > 0) {
            const session = searchResults.data[0];
            debugInfo.push(`Found session: ${session.id}`);
            if (session.subscription) {
                const sub = await stripe.subscriptions.retrieve(session.subscription);
                if (sub.status === 'active' || sub.status === 'trialing') {
                    activeSubscription = sub;
                    debugInfo.push(`Found active sub via session: ${sub.id}`);
                } else {
                    debugInfo.push(`Sub ${sub.id} status is ${sub.status}`);
                }
            }
        } else {
            debugInfo.push(`No session found for client_reference_id:${user.id}`);
        }
    } catch (searchErr) {
        debugInfo.push(`Search error: ${searchErr.message}`);
    }

    // STRATEGY B: Search by Email (Fallback)
    if (!activeSubscription) {
        const customers = await stripe.customers.list({
            email: user.email,
            limit: 5
        });

        debugInfo.push(`Found ${customers.data.length} customers with email ${user.email}`);

        for (const customer of customers.data) {
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: 'active',
                limit: 1
            });
            
            if (subscriptions.data.length > 0) {
                activeSubscription = subscriptions.data[0];
                debugInfo.push(`Found active sub ${activeSubscription.id} via email`);
                break;
            }
        }
    }

    if (activeSubscription) {
        let subscriptionEnd = null;
        if (activeSubscription.current_period_end) {
            const end = new Date(activeSubscription.current_period_end * 1000);
            if (!isNaN(end.getTime())) {
                subscriptionEnd = end.toISOString();
            }
        } else if (activeSubscription.billing_cycle_anchor) {
             const anchor = new Date(activeSubscription.billing_cycle_anchor * 1000);
             anchor.setMonth(anchor.getMonth() + 1);
             subscriptionEnd = anchor.toISOString();
        } else {
             const now = new Date();
             now.setDate(now.getDate() + 30);
             subscriptionEnd = now.toISOString();
        }
        
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
            console.error('Supabase update error:', updateError);
            return res.status(500).json({ error: 'Failed to update user', details: updateError.message });
        }

        return res.json({ status: 'active', source: 'stripe_sync', debug: debugInfo });
    }

    return res.json({ status: 'inactive', debug: debugInfo });

  } catch (err) {
    console.error('Verify Subscription Error:', err);
    res.status(500).json({ error: err.message });
  }
}
