const Product = require('../models/products.js');

// add a product request
exports.getAddProduct = (req, res, next) => {
    // console.log('Hello World');
    const editMode = false;
    res.render('admin/add-product.ejs', {pageTitle: 'Add Product',product : [], path: '/add-product', editing : editMode})
}

// adding the product details to db
exports.postAddProduct = (req, res, next) => {
    const item = req.body.item;
    const imgURL = req.body.imgURL;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(item, imgURL, price, description);
    product.save();

    res.redirect('/products');

}

// show all products to the admin
exports.getProducts = (req, res, next) => {
    Product.fetchAll((product) => {
        res.render('admin/admin-products.ejs', {prods: product, pageTitle: 'Admin Products', path: '/admin-products'});
    })

}

exports.getEditProduct = (req, res, next) => {

    const productId = req.params.productId;
    console.log(productId);

    Product.fetchProductById(productId, product => {
        if(!product) {
            return res.redirect('/');
        }
        const editMode = true;
        // console.log(product);
        res.render('admin/add-product.ejs', {pageTitle : 'Edit Product' , product : product , editing : editMode, path : '/admin/edit-product'})
    });
}

exports.postEditProduct = (req , res, next) => {
    const productId = req.body.productId;
    Product.updateProductById(productId, req , statusCode => {
        if(!statusCode) {
            console.error(statusCode);
        } else {
            console.log('Success');
            res.redirect('/');
        }
    })
}

exports.postDeleteProduct = (req, res, next) => {

    const productId = req.body.productId;
    // console.log(req.body.productId);
    Product.deleteProductById(productId, statusCode => {
            if(!statusCode) {
                res.error(statusCode);
            }   else {
                console.log('success delete');
                res.redirect('/');
            }
    })

}