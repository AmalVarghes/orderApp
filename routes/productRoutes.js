const express = require('express');
const { createProduct, getProducts } = require('../controllers/productController');

const router = express.Router();

router.post('/products', createProduct);
router.get('/products', getProducts);
router.put('/api/products/:id', updateProduct);      // or patch
router.patch('/api/products/:id', updateProduct); 

module.exports = router;
