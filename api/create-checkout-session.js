import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { returnUrl } = req.body;
      const successUrl = returnUrl ? `${returnUrl}?success=true` : `${req.headers.origin}/?success=true`;
      const cancelUrl = returnUrl ? `${returnUrl}?canceled=true` : `${req.headers.origin}/?canceled=true`;

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            // or define price_data inline
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
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      
      res.status(200).json({ url: session.url });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
