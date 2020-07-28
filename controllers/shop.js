const Product = require("../models/products.js");
const Cart = require("../models/cart.js");
const CartItem = require("../models/cart-item.js");
const Order = require("../models/order");
const OrderItem = require("../models/order-item");

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/shop.ejs", {
                prods: products,
                pageTitle: "My Shop",
                path: "/products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const product_id = req.params.productId;

    Product.findAll({
        where: {
            id: product_id,
        },
    })
        .then((products) => {
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
        .then((cart) => {
            if (!cart) return null;
            // console.log("this is the cart", cart);
            return cart.getProducts();
        })
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
    let newQuantity = 1;
    let existingCart;
    // console.log("this is the user", req.user);
    req.user
        .getCart()
        .then((cart) => {
            // console.log("this is the cart", cart);
            existingCart = cart;
            if (!cart) return null;

            return cart.getProducts({
                where: {
                    id: product_id,
                },
            });
        })
        .then((products) => {
            // console.log("this are the products", products[0]);

            if (!products[0]) {
                Product.findAll({
                    where: {
                        id: product_id,
                    },
                })
                    .then((product) => {
                        return existingCart.addProduct(product[0], {
                            through: {
                                quantity: newQuantity,
                            },
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                let oldQuantity = products[0].CartItem.quantity;
                newQuantity = oldQuantity + 1;
                products[0].quantity = newQuantity;
                return existingCart.addProduct(products[0], {
                    through: {
                        quantity: newQuantity,
                    },
                });
            }
        })
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postDeleteFromCart = (req, res, next) => {
    const product_id = req.body.productId;

    req.user
        .getCart()
        .then((cart) => {
            console.log("this is the cart", cart);
            return cart.getProducts({
                where: {
                    id: product_id,
                },
            });
        })
        .then((products) => {
            let product = products[0];

            return product.CartItem.destroy();
        })
        .then((result) => {
            console.log("this is the result", result);
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    res.render("shop/index.ejs", { pageTitle: "Shop", path: "/index" });
};

exports.getOrder = (req, res, next) => {
    req.user
        .getOrders({ include: ["products"] })
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
    let cartProducts, fetchedCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            cartProducts = products;
            return req.user.createOrder();
        })
        .then((order) => {
            return order.addProducts(
                cartProducts.map((product) => {
                    product.OrderItem = { quantity: product.CartItem.quantity };
                    return product;
                })
            );
        })
        .then((result) => {
            fetchedCart.destroy();
            console.log(result);
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err);
        });
};
