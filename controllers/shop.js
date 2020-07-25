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

    Cart.getCartProducts(cartProducts => {

        console.log('this is cart product', cartProducts);
        const finalCartProducts = [];
        if(cartProducts.length === 0) {
            console.log('cart is empty');
            res.render('shop/cart.ejs', { products : finalCartProducts, pageTitle : 'My Cart' , path : '/cart'});
        } else {
            Product.fetchAll(products => {
                for(product of products) {
                    const currentProduct = cartProducts.find(prod => prod.id === product.id);
                    console.log('product found is ', currentProduct);
                    if(currentProduct) {
                        finalCartProducts.push({cartProduct : product, qty : currentProduct.qty});
                    }
                }
                res.render('shop/cart.ejs', { products : finalCartProducts, pageTitle : 'My Cart' , path : '/cart'});
            });
        }

    });

}

exports.getAddToCart = (req, res, next) => {
    const product_id = req.body.productId;
    Product.fetchProductById(product_id, (product) => {
        Cart.addToCart(product_id, product.price);
        // console.log(product);
        res.redirect('/');
    });
}

exports.postDeleteFromCart = (req, res, next) => {
    const productId = req.body.productId;
    const product = Product.fetchProductById(productId, product => {
        const price = product.price;
        Cart.deleteFromCart(productId, price, statusCode => {
            res.redirect('/cart');
        })
    })

}

exports.getIndex = (req,res,next) => {
    res.render('shop/index.ejs', { pageTitle : 'Shop', path : '/index'})
}
