
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { subscriptionId } = req.body;
  
  if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID required' });
  }

  try {
    // Cancel at period end
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    
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
}
