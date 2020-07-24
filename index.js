const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// equivalent to getting the router object of the admin.js

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const pageError = require('./controllers/pageError.js');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({extended: false}));



app.use('/admin/', adminRouter);
app.use(shopRouter);


app.use('/', pageError.pagenotfound);


app.listen(3002);

