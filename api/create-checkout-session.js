
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

  try {
    const { returnUrl, userId, userEmail, locale = 'auto' } = req.body;
    
    // Determine base URL dynamically or fallback
    // In Vercel, req.headers.origin or referer usually works
    const origin = req.headers.origin || 'https://cadetprep.academy'; // Fallback to your likely prod URL or localhost

    const session = await stripe.checkout.sessions.create({
      client_reference_id: userId,
      customer_email: userEmail,
      locale: locale,
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: {
              name: 'Skytest Paketi (Aylık - Test)',
              description: 'Tüm modüllere sınırsız erişim (VIGI, IPP, Cube Rotation vb.)',
            },
            unit_amount: 500, // 5.00 TL for testing
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: (() => {
        const base = returnUrl || `${origin}/`;
        try {
          const urlObj = new URL(base);
          urlObj.searchParams.append('success', 'true');
          return urlObj.toString();
        } catch (e) {
          const separator = base.includes('?') ? '&' : '?';
          return `${base}${separator}success=true`;
        }
      })(),
      cancel_url: (() => {
        const base = returnUrl || `${origin}/`;
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
    
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: err.message });
  }
}
