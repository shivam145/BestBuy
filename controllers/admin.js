const Product = require("../models/products.js");

// add a product request
exports.getAddProduct = (req, res, next) => {
    // console.log('Hello World');
    const editMode = false;
    res.render("admin/add-product.ejs", {
        pageTitle: "Add Product",
        product: [],
        path: "/add-product",
        editing: editMode,
    });
};

// adding the product details to db
exports.postAddProduct = (req, res, next) => {
    const item = req.body.item;
    const imgURL = req.body.imgURL;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(item, price, imgURL, description);
    product
        .save()
        .then((result) => {
            res.redirect("/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

// show all products to the admin
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render("admin/admin-products.ejs", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin-products",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId);

    Product.fetchById(productId)
        .then((products) => {
            const editMode = true;
            res.render("admin/add-product.ejs", {
                pageTitle: "Edit Product",
                product: products[0],
                editing: editMode,
                path: "/admin/edit-product",
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;

    const updatedPrice = req.body.price;
    const updatedItem = req.body.item.trim();
    const updatedDescription = req.body.description.trim();
    const updatedImgURL = req.body.imgURL.trim();

    console.log(productId);
    Product.updateById(
        productId,
        updatedItem,
        updatedPrice,
        updatedImgURL,
        updatedDescription
    )

        .then((result) => {
            // console.log(result);
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    Product.deleteById(productId)
        .then((result) => {
            console.log(result);
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
};
