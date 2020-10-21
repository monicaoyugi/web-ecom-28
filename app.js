const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect("mongodb+srv://iguta-david:" + process.env.MONGO_ATLAS_PASSWORD + "@nodejs-restful-api.fgmdn.mongodb.net/products?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true}
);
//this spins the express app
const app = express();
app.use(morgan('dev'));
//url encoded bodies
app.use(bodyParser.urlencoded({extended:false}));
//for parsing json data
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorzation');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    };
    next(); 
})
//this sets the middleware
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

app.use('/uploads', express.static('uploads'));


app.use((req, res, next) => {
    const err = new Error('Not Found...');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error:{
            message:err.message
        }
    })
})

module.exports = app;