const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const ejs = require('ejs');
const passport = require('passport');


if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const flash = require('express-flash');


mongoose.connect("mongodb+srv://iguta-david:" + process.env.MONGO_ATLAS_PASSWORD + "@nodejs-restful-api.fgmdn.mongodb.net/products?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true}
)
.then(() => console.log('Database connected...'))
.catch(err => {
    console.log(err);
});

//this spins the express app
const app = express();
app.use(morgan('dev'));
app.use(cors());
//url encoded bodies
app.use(bodyParser.urlencoded({extended:false}));
//for parsing json data
app.use(bodyParser.json());

app.use(cors());

//passport authentication
const initializePassport = require('./front-end/config/passport');
initializePassport(passport);
app.use(flash());
app.use(session({secret:process.env.SESSION_SECRET_KEY, resave:false, saveUninitialized:false}));
app.use(passport.initialize())
app.use(passport.session());


//this sets the middleware
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');

const frontEndRoutes = require('./front-end/routes/front-end');



app.set('views', './front-end/public/views');
app.set('view engine', 'ejs');

//api routes
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);






//front-end routes
app.use('/', frontEndRoutes);
app.use('/user', frontEndRoutes);


app.use('/uploads', express.static('uploads'));

app.use(express.static('./front-end/public'));
app.use((req, res, next) => {
    const err = new Error('Not Found...');
    err.status = 404;
    next(err);
});

module.exports = app;