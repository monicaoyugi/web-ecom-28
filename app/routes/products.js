const express = require('express');
const router = express.Router();
const Product = require('../model/productsModel');
const app = express();
const jwt = require('express-jwt');
const jwks= require('jwks-rsa');
require('jsonwebtoken');
const multer = require('multer');


const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, './uploads/');
    },
    filename:(req, file, cb) => {
        cb(null, `${new Date().toISOString().replace(/:/g,"")}${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    //accept file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(new Error('message'), false);
    };
};

const upload = multer({
    storage:storage, 
    limits:{
    fileSize:1024 * 1024 *5
    },
    fileFilter:fileFilter
});

//get all products
router.get('/', async(req, res) => {
   try{
    const products = await Product.find();
    res.status(200).json(products);
   } catch(err){
    res.status(500).json({message:err.message});
   }
})
//getting one product
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});

//authorization not working...will fix this in a moment
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-pa9vplp6.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://products-api',
  issuer: 'https://dev-pa9vplp6.us.auth0.com/',
  algorithms: ['RS256']
});

app.use(jwtCheck);

//creating one product
router.post('/', upload.single('productImg'), async(req, res) => {
    // console.log(req.file);
    const product = new Product({
        title : req.body.title,
        price : req.body.price,
        quantity:req.body.quantity,
        description : req.body.description,
        productImg: `http://localhost:4000/${req.file.path.replace(/\\/g, '/')}`
    })
    try{
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch(err){
        res.status(400).json({message: err.message});
    }
})

//updating one product
router.patch('/:id', getProduct, async(req, res) => {
    if(req.body.name !==null){
        res.product.name = req.body.name;
    }
    if(req.body.price !==null){
        res.product.price = req.body.price;
    }
    if(req.body.description !==null){
        res.product.description = req.body.description;
    }
    try{
        const updatedProduct = await res.product.save();
        res.json(updatedProduct);
    } catch(err){
        res.status(400).json({message:err.message});
    }
})

//deleting one product
router.delete('/:id', getProduct, async(req, res) => {
    try{
        await res.product.remove();
        res.json({message:"Deleted product..."});
    } catch(err){
        res.status(500).json({message:err.message})
    }
    
})

async function getProduct(req, res, next){
    let product;
    try{
        product = await Product.findById(req.params.id);
        if(product == null){
            return res.status(404).json({message:'Cannot find product...'})
        }
    } catch(err){
        return res.status(500).json({message:err.message})
    }
    res.product = product;
    next()
}

module.exports = router;