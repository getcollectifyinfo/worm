import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
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
      success_url: `${req.headers.origin || 'http://localhost:5173'}/?success=true`,
      cancel_url: `${req.headers.origin || 'http://localhost:5173'}/?canceled=true`,
    });
    
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Local Payment Server running at http://localhost:${port}`);
});
