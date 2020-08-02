const Product = require("../models/products.js");

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            console.log("products are as follow", products);
            res.render("shop/shop.ejs", {
                prods: products,
                pageTitle: "Products",
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const product_id = req.params.productId;

    Product.fetchById(product_id)

        .then((products) => {
            console.log("this is the product", products[0]);
            res.render("shop/product-details.ejs", {
                product: products[0],
                pageTitle: products[0].item,
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((products) => {
            console.log("products in the cart are", products);
            res.render("shop/cart.ejs", {
                products: products,
                pageTitle: "My Cart",
                path: "/cart",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postAddToCart = (req, res, next) => {
    const product_id = req.body.productId;
    req.user
        .addToCart(product_id)
        .then((result) => {
            console.log(result);
            res.redirect("/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postDeleteFromCart = (req, res, next) => {
    const product_id = req.body.productId;

    req.user
        .deleteFromCartById(product_id)

        .then((result) => {
            console.log(result);
            res.redirect("/cart");
        })

        .catch((err) => {
            console.log(err);
        });
};

// exports.getIndex = (req, res, next) => {
//     res.render("shop/index.ejs", { pageTitle: "Shop", path: "/index" });
// };

exports.getOrder = (req, res, next) => {
    req.user
        .getOrders()
        .then((orders) => {
            console.log(orders);
            res.render("shop/order.ejs", {
                orders: orders,
                pageTitle: "My Order",
                path: "/order",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postPlaceOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then((result) => {
            console.log(result);
            res.redirect("/products");
        })
        .catch((err) => {
            console.log(err);
        });
};
