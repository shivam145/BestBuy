const Product = require('../models/products.js');
const Cart = require('../models/cart.js');


exports.getProducts = (req,res,next) => {
    Product.fetchAll((products) => {
        res.render('shop/shop.ejs' , {prods: products, pageTitle : 'My Shop' , path : '/products'});
    });
}

exports.getProduct = (req, res, next) => {
    const product_id = req.params.productId;

    Product.fetchProductById(product_id, product => {
        console.log(product);
        res.render('shop/product-details.ejs', { product : product, pageTitle: product.item, path: '/products'});
    })

}

exports.getCart = (req, res, next) => {
    res.render('shop/cart.ejs', { pageTitle : 'My Cart' , path : '/cart'});
}

exports.getAddToCart = (req, res, next) => {
    const product_id = req.body.productId;
    Product.fetchProductById(product_id, (product) => {
        Cart.addToCart(product_id, product.price);
        // console.log(product);
        res.redirect('/');
    });
}

exports.getIndex = (req,res,next) => {
    res.render('shop/index.ejs', { pageTitle : 'Shop', path : '/index'})
}
