const express = require('express');
const { createOrder, getOrders, sendOrderEmail } = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', createOrder);
router.post('/orders/email', sendOrderEmail);
router.get('/orders', getOrders);

module.exports = router;
