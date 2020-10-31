const express = require('express');
// const csurf = require('csurf');
const { default: fetch } = require('node-fetch');
const passport = require('passport');
const router = express.Router();
global.fetch = require('node-fetch');
const checkAuth = require('../middlewares/checkAuth');

// const csurfProtection = csurf();
// router.use(csurfProtection);

const usersController = require('../../api/controllers/users');

router.post('/search', (req, res) => {
    const product = req.body.product;
    const url = `https://e-foodstore.herokuapp.com/products/search/${product}`;
    fetch(url)
    .then(data => data.json())
    .then(data => {
        res.render('search', {data:data});
    })
    .catch(err => {
        res.status(500).json({
            error:err.message
        });
    })

});
router.get('/signup', (req, res) => {
    let messages = req.flash('error');
    res.render('user/signup', {messages:messages});
});

router.post('/signup', usersController.user_signup);

router.get('/signin', (req, res) => {
    let messages = req.flash('error');
    res.render('user/login', {messages:messages});
});


router.post('/signin', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/user/signin',
    failureFlash:true
}))

router.get('/wishlist', (req, res) => {
 res.status(200).json({
     message:'Wishlist ready....'
 })
});
router.get('/cart', checkAuth, (req, res) => {
    res.render('cartlist');
});
router.get('/profile', (req, res) => {
    res.render('user/profile');
});
router.post('/payment', (req, res) => {

});
router.get('/', (req, res) => {
    const url = 'https://e-foodstore.herokuapp.com/products';
    fetch(url)
    .then(data => data.json()) 
    .then(data => {
        res.render('index', {
            data:data
        })
    })
    .catch(err => console.log(err)); 
});
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    const url = `https://e-foodstore.herokuapp.com/products/${productId}`;
    fetch(url)
    .then(data => data.json())
    .then(data => {
        res.render('product-details', {
            product:data
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            Error:err
        })
    })
});
module.exports = router;

