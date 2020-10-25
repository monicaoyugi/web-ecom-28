const express = require('express');
const router = express.Router();
global.fetch = require('node-fetch');

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
router.post('/signup', (req, res) => {

});
router.get('/login', (req, res) => {

});
router.get('/wishlist', (req, res) => {
 res.status(200).json({
     message:'Wishlist ready....'
 })
});
router.get('/cart', (req, res) => {

});
router.get('/cart', (req, res) => {

});
router.post('/payment', (req, res) => {

});

module.exports = router;

