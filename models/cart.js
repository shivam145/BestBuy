const fs = require('fs');
const path  = require('path');
const filePath = path.join('./database/cart.json');

module.exports = class Cart {
    static addToCart(id, price) {

        // fetching the previous cart
        fs.readFile(filePath, (err , data) => {
            let cart = { products: [] , totalPrice: 0 };
            if(!err) {
                cart = JSON.parse(data);
            }
            // Analysing the cart, if(available)
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            console.log(existingProductIndex);

            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products .push(updatedProduct);
            }

            cart.totalPrice = cart.totalPrice + parseInt(price);

            // updating the cart
            fs.writeFile(filePath, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        });
    }

    static deleteFromCart(id, price, cb) {
        fs.readFile(filePath, (err , data) => {

            if(err) {
                cb(0);
            }
            const cart = JSON.parse(data);
            const product = cart.products.filter(prod => prod.id === id);
            if(product) {
                const qty = product[0].qty;
                const products = cart.products.filter(prod => prod.id !== id);
                console.log(qty, ' ' , price,' ', product);
                cart.totalPrice = cart.totalPrice - qty * price;
                // console.log(typeof qty * price, 'total price= ', typeof cart.totalPrice);
                cart.products = products;
                fs.writeFile(filePath, JSON.stringify(cart), (err) => {
                    if(err)
                        console.log(err);
                    else
                        cb(200);
                });
            } else {
                    cb(0);
            }
        });
    }
}