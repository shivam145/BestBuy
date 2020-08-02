const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const app = express();
const Users = require("./models/Users");

const mongoConnect = require("./util/getDBInstance").mongoConnect;

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
    Users.fetchById("5f22926223cf1f131abc5661")
        .then((user) => {
            // console.log(typeof user._id);
            req.user = new Users(
                user.username,
                user.email,
                user.cart,
                user._id
            );
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

mongoConnect(() => {
    app.listen(3000);
});
