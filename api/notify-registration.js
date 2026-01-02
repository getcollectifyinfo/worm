import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { email, userId, provider } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set. Skipping email notification.');
    res.status(200).json({ skipped: true });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ergunakin@gmail.com',
      subject: '[CadetPrep] Yeni Üye Kaydı',
      text: `Yeni bir kullanıcı kayıt oldu.\nEmail: ${email}\nUser ID: ${userId}\nKayıt Yöntemi: ${provider || 'Email'}`,
    });
    console.log(`Registration email sent for ${email}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
