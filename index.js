'use strict';
// dotenv
require('dotenv').config();
const PORT = process.env.PORT
const mongoUrl = process.env.URL


// express app
const express = require('express');
const app = express();
// because req.body give me undefined
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// routes and DB
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
//auth
const authRoute = require('./routes/auth');
const productsRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');


mongoose.connect(mongoUrl).then(() => console.log("DB Connection Successfull")).catch((err) => console.log(err));

app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/product", productsRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})