const mongoDB = require("mongodb");
const getDB = require("../util/getDBInstance").getDB;

class Product {
    constructor(item, price, imgURL, description) {
        this.item = item;
        this.price = price;
        this.imgURL = imgURL;
        this.description = description;
    }

    save() {
        const db = getDB();
        return db
            .collection("products")
            .insertOne(this)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDB();
        return db
            .collection("products")
            .find()
            .toArray()
            .then((products) => {
                // console.log("This is the product id", products[0]._id);
                return products;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static fetchById(productId) {
        const db = getDB();
        return db
            .collection("products")
            .find({
                _id: new mongoDB.ObjectID(productId),
            })
            .toArray()
            .then((products) => {
                return products;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static updateById(
        productId,
        updateItem,
        updatedPrice,
        updatedImgURL,
        upadtedDescription
    ) {
        const db = getDB();
        return db
            .collection("products")
            .updateOne(
                {
                    _id: new mongoDB.ObjectID(productId),
                },
                {
                    $set: {
                        item: updateItem,
                        price: updatedPrice,
                        imgURL: updatedImgURL,
                        description: upadtedDescription,
                    },
                }
            )
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static deleteById(productId) {
        const db = getDB();
        return db
            .collection("products")
            .deleteOne({
                _id: new mongoDB.ObjectID(productId),
            })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

module.exports = Product;
