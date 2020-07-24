const path = require('path');
const fs = require('fs');
const rootPath = './database/products.json';
const Cart = require('./cart');
module.exports = class Product {
    constructor(item, imgURL, price, description) {
        this.item = item;
        this.imgURL = imgURL;
        this.description = description;
        this.price = price;
    }

    save() {

        this.id = Math.random().toString();
        fs.readFile(rootPath, ((err, data) => {
            var products = [];
            if (!err) {
                products = JSON.parse(data);
            }
            products.push(this);

            fs.writeFile(rootPath, JSON.stringify(products), (err) => {
                console.log(err);
            })

        }));
    }

    static fetchAll(cb) {
        fs.readFile(rootPath, (err, data) => {
            if (err) {
                cb([]);
            } else {
                cb(JSON.parse(data));
            }
        })
    }

    static fetchProductById(id, cb) {

        let product;
        Product.fetchAll(products => {
            product = products.find(p => p.id === id);
            if (product)
                cb(product);
            else
                cb([]);
        });

    }

    static updateProductById(productId, req, cb) {
        let productIndex, product;
        Product.fetchAll(products => {
            productIndex = products.findIndex(prod => prod.id === productId)
            product = products[productIndex];
            // console.log('this is the index' , productIndex);
            product.item = req.body.item;
            product.imgURL = req.body.imgURL;
            product.price = req.body.price;
            product.description = req.body.description;

            products[productIndex] = product;
            fs.writeFile(rootPath, JSON.stringify(products), (err) => {
                    if(!err)
                        cb(200);
                    else
                        cb(0);
            })

        })
    }


    static deleteProductById(productId, cb) {
        Product.fetchAll(products => {
            if(products) {
                let productIndex = products.findIndex(prod => prod.id === productId);
                if(productIndex > -1) {
                    const productPrice = products[productIndex].price;
                    products.splice(productIndex,1);
                    fs.writeFile(rootPath, JSON.stringify(products), (err) => {
                        if(!err) {
                            Cart.deleteFromCart(productId, productPrice , statusCode => {
                                cb(200);
                            });
                        }
                        else
                            cb(0);
                    });
                }
                else
                    cb(200);
            } else {
                cb(200);
            }
        });
    }
}