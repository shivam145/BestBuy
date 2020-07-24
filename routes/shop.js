const express = require('express');
const path = require('path');

const router = express.Router();
const shopController = require('../controllers/shop.js');

router.get('/', shopController.getIndex);

router.get('/products/:productId', shopController.getProduct);

router.get('/products', shopController.getProducts);



router.get('/cart', shopController.getCart);

router.post('/add-to-cart',shopController.getAddToCart);

module.exports = router;