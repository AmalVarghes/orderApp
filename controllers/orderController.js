const Order = require('../models/Order');

const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 587;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP SERVER READY");
  }
});

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendOrderEmail = async (req, res) => {
  console.log("EMAIL API HIT");
  console.log("Payload:", req.body);
  try {
    const { items = [], total = 0, customerName = '', customerMobile = '', to } = req.body || {};

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ error: 'SMTP credentials not configured' });
    }

    const recipient = to || process.env.ORDER_NOTIFY_EMAIL || process.env.SMTP_USER;

    const itemLines = items
      .map((item, index) => {
        const name = item.name || 'Item';
        const qty = item.quantity || 0;
        const price = item.price != null ? ` - ₹${item.price}` : '';
        return `${index + 1}. ${name} x${qty}${price}`;
      })
      .join('\n');

    const message = [
      'New Prebook Order',
      customerName ? `Customer: ${customerName}` : null,
      customerMobile ? `Phone: ${customerMobile}` : null,
      '',
      'Items:',
      itemLines || 'No items',
      '',
      `Total: ₹${total}`,
    ].filter(Boolean).join('\n');

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      subject: 'New Prebook Order',
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
