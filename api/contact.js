import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS headers
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email ve mesaj zorunludur.' });
  }

  try {
    // Configure transporter
    // Note: User needs to create an App Password if using Gmail
    // https://myaccount.google.com/apppasswords
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your gmail address
        pass: process.env.EMAIL_PASS, // Your App Password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'ergunakin@gmail.com',
      replyTo: email,
      subject: `CadetPrep İletişim: ${subject || 'Yeni Mesaj'}`,
      text: `
        Gönderen: ${name || 'İsimsiz'} (${email})
        Konu: ${subject || 'Genel'}
        
        Mesaj:
        ${message}
      `,
      html: `
        <h3>Yeni İletişim Formu Mesajı</h3>
        <p><strong>Gönderen:</strong> ${name || 'İsimsiz'} (<a href="mailto:${email}">${email}</a>)</p>
        <p><strong>Konu:</strong> ${subject || 'Genel'}</p>
        <hr />
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Mail gönderilemedi: ' + error.message });
  }
}
