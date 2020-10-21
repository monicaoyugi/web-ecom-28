const Order = require('../model/order');
const Product = require('../model/products');
const mongoose = require('mongoose');
exports.orders_get_all = (req, res, next) => {
    Order
        .find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: `http://localhost:3000/orders/${doc._id}`
                        }
                    };
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.orders_create_order = (req, res, next) => {
    Product.find({_id:req.body.productId})
        .then(product => {
            if (product.length === 0) {
                return res.status(404).json({
                    message: "No such product was found..."
                })
            };
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save()
            .then(result => {
                res.status(201).json({
                    message: "Order created...",
                    createdOrder: {
                        _id: result.id,
                        product: result.product,
                        quantity: result.quantity,
                        request: {
                            type: "GET",
                            url: `http://localhost:3000/orders/${result._id}`
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });;
        })
}

exports.orders_get_one_order = (req, res, next) => {
    Order
        .findById(req.params.orderId)
        .populate('product', 'name', 'price')
        .select('_id product quantity')
        .exec()
        .then(order => {
            if(!order){
                return res.status(404).json({
                    message:"Order not found..."
                });
            };
            res.status(200).json({
                order: {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_delete_order = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(result => {
            if (result.n == 0) {
                return res.status(404).json({
                    message: "The Order you're trying to delete doesn't exist..."
                });
            };

            res.status(200).json({
                message: "Order deleted...",
                request: {
                    type: "POST",
                    url: 'http://localhost:3000/orders',
                    body: {
                        product: "ID", quantity: "Number"
                    }
                }
            })
        }).
        catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}