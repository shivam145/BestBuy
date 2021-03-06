const express = require("express");
const path = require("path");

const router = express.Router();
const shopController = require("../controllers/shop.js");

// router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/delete-from-cart", shopController.postDeleteFromCart);

router.post("/add-to-cart", shopController.postAddToCart);

router.get("/order", shopController.getOrder);

router.post("/place-order", shopController.postPlaceOrder);

module.exports = router;
