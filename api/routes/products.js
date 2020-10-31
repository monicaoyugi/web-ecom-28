const express = require('express');
const Product = require('../model/products');
const multer = require('multer');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');

const productsController = require('../controllers/products');


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


router.get('/', productsController.products_get_all);

router.get('/search/:productName', productsController.product_search);


router.post('/', checkAuth, upload.single('productImg'), productsController.products_create_product);


router.get('/:productId', productsController.products_get_product);

router.patch('/:productId', checkAuth, productsController.products_update_product);

router.delete('/:productId', checkAuth, productsController.products_delete_product);

module.exports = router;