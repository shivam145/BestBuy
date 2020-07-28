const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const app = express();

const sequelize = require("./util/getDBInstance");
const User = require("./models/Users");
const Product = require("./models/products");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// equivalent to getting the router object of the admin.js
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const pageError = require("./controllers/pageError.js");

app.set("view engine", "ejs");
app.set("views", "views");

// defining the requirements for parsing
app.use(express.static(path.join(__dirname, "static")));
app.use(bodyParser.urlencoded({ extended: false }));

// handling routes/requests

app.use((req, res, next) => {
    User.findAll()
        .then((users) => {
            req.user = users[0];
            next();
        })
        .catch((err) => {
            console.log(err);
        });
});
app.use("/admin/", adminRouter);
app.use(shopRouter);
app.use("/", pageError.pagenotfound);

// database related initalization

//association defination
User.hasMany(Product);
Product.belongsTo(User);

User.hasOne(Cart);
Cart.belongsTo(User);

Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
//Product.belongsToMany(Order, { through: OrderItem });

//syncing the database
sequelize
    // .sync({ force: true })
    .sync()
    .then((result) => {
        User.findAll()
            .then((users) => {
                if (users.length === 0) {
                    return User.create({
                        id: 1,
                        username: "shivam",
                        password: "shivam",
                    });
                }
                return users[0];
            })
            .then((user) => {
                return user.createCart();
            })
            .then(() => {
                app.listen(3005);
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });
