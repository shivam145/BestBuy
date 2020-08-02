const mongodb = require("mongodb");
const getDB = require("../util/getDBInstance").getDB;

class Users {
    constructor(username, email, cart, _id) {
        this.username = username;
        this.email = email;
        this.cart = cart; //{ items : [{}]}
        this._id = _id;
    }

    save() {
        const db = getDB();
        return db.collection("users").insertOne(this);
    }

    getCart() {
        const db = getDB();

        if (!this.cart.items) return [];

        let productIds = this.cart.items.map((product) => {
            return product._id;
        });

        return db
            .collection("products")
            .find({
                _id: {
                    $in: productIds,
                },
            })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((o) => {
                            // console.log(typeof o.productId, " ", typeof p._id);
                            return o._id.toString() === p._id.toString();
                        }).quantity,
                    };
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    addToCart(productId) {
        let productIndex = -1;
        var updatedCart = {};
        var newQuantity = 1;
        var updatedCartItems = [];

        if (this.cart.items) {
            updatedCartItems = [...this.cart.items];
            // console.log(typeof productId);
            productIndex = this.cart.items.findIndex((o) => {
                return o._id.toString() === productId.toString();
            });
        }

        if (productIndex >= 0) {
            // console.log("product already exists", productIndex);

            newQuantity = this.cart.items[productIndex].quantity + 1;

            updatedCartItems[productIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                _id: new mongodb.ObjectID(productId),
                quantity: newQuantity,
            });
        }
        updatedCart = {
            items: updatedCartItems,
        };
        const db = getDB();
        return db
            .collection("users")
            .updateOne(
                {
                    _id: new mongodb.ObjectID(this._id),
                },
                {
                    $set: { cart: updatedCart },
                }
            )
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deleteFromCartById(productId) {
        const db = getDB();
        // let updatedCartItems = [...this.cart.items];

        let updatedCartItems = this.cart.items.filter((product) => {
            return product._id.toString() !== productId.toString();
        });

        return db
            .collection("users")
            .updateOne(
                {
                    _id: new mongodb.ObjectID(this._id),
                },
                {
                    $set: {
                        cart: { items: updatedCartItems },
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
    getOrders() {
        const db = getDB();
        return db
            .collection("orders")
            .find({
                "user._id": new mongodb.ObjectID(this._id),
            })
            .toArray()
            .then((orders) => {
                console.log(orders);
                return orders;
            })
            .catch((err) => {
                console.log(err);
            });
    }
    addOrder() {
        const db = getDB();
        let productIds = this.cart.items.map((product) => {
            return product._id;
        });
        return db
            .collection("products")
            .find({
                _id: {
                    $in: productIds,
                },
            })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((o) => {
                            // console.log(typeof o.productId, " ", typeof p._id);
                            return o._id.toString() === p._id.toString();
                        }).quantity,
                    };
                });
            })
            .then((updatedItems) => {
                let order = {
                    user: {
                        _id: this._id,
                        username: this.username,
                        email: this.email,
                    },
                    items: updatedItems,
                };
                this.cart = { items: [] };
                return db
                    .collection("users")
                    .updateOne(
                        {
                            _id: this._id,
                        },
                        {
                            $set: {
                                cart: { items: [] },
                            },
                        }
                    )
                    .then(() => {
                        return db.collection("orders").insertOne(order);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static fetchById(userId) {
        const db = getDB();
        return db
            .collection("users")
            .findOne({
                _id: new mongodb.ObjectID(userId),
            })
            .then((user) => {
                return user;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

module.exports = Users;
