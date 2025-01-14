const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String},
  items: [{ name: String, quantity: Number }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Order', orderSchema);
