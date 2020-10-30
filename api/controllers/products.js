const Product = require('../model/products');
const mongoose = require('mongoose');
exports.products_get_all = (req, res, next) => {
    Product
    .find()
    .select('price name  description productImg  discount rating _id category')
    .exec()
    .then(docs => {
        const response = { 
            count:docs.length,
            products: docs.map(doc =>{
                return {
                    name:doc.name,
                    price:doc.price,
                    description:doc.description,
                    productImg:doc.productImg,
                    rating:doc.rating,
                    discount:doc.discount,
                    category:doc.category,
                    _id:doc._id,
                    request:{
                        type:"GET",
                        url:`http://localhost:3000/products/${doc._id}`
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.json(500).json({err:err});
    });
};

exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category,
        productImg:`http://localhost:3000/${req.file.path.replace(/\\/g, '/')}`,
        discount:req.body.discount
    });
    product
    .save()
    .then((result) => {
        res.status(201).json({
            message:"Product created successfully...",
            createdProduct:{
                name:result.name,
                price:result.price,
                productImg:result.productImg,
                rating:result.rating,
                discount:result.discount,
                category:result.category,
                _id:result._id,
                request:{
                    type:"GET",
                    url:`http://localhost:3000/products/${result._id}`
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('price name description rate discount productImg _id)')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                count:1,
                message:"Product retrieved successfully...",
                product:{
                    name:doc.name,
                    price:doc.price,
                    description:doc.description,
                    productImg:doc.productImg,
                    rating:doc.rating,
                    discount:doc.discount,
                    _id:doc.id,
                }
            });
        }
        else{
            res.status(404).json({message:"No valid entry was provided for this productId"})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
};

exports.products_update_product = (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    };
    Product.update({_id:req.params.productId}, {$set: updateOps})
    .exec()
    .then((result) => {
        res.status(200).json({
            message:"Product updated...",
                request:{
                    type:"GET",
                    url:`http://localhost:3000/products/${req.params.productId}`
                }
        });
    })
    .catch(err => {
        console.log(err);
        res.status.json({error:err});
    });
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    //.remove is deprecated
    Product.deleteOne({_id:id})
    .exec()
    .then(result => {
        if(result.n === 0){
            return res.status(404).json({
                message:"The product you're trying to delete DOESN'T exist"
            })
        }
        res.status(200).json({
            message:"Product deleted...",
            request:{
                type:"POST",
                url:`http://localhost:3000/products`,
                body:{name:"String", price:"Number"}
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({err:err})
    })
}

exports.product_search = (req, res) => {
    let product = req.params.productName;
    Product.find({name:product})
    .select('price name  description productImg  discount rating _id category')
    .exec()
    .then(docs => {
        const response = { 
            count:docs.length,
            products: docs.map(doc =>{
                return {
                    name:doc.name,
                    price:doc.price,
                    description:doc.description,
                    productImg:doc.productImg,
                    rating:doc.rating,
                    discount:doc.discount,
                    category:doc.category,
                    _id:doc._id,
                    request:{
                        type:"GET",
                        url:`http://localhost:3000/products/${doc._id}`
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            Error:err
        });
    });
    
}