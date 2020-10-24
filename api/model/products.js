const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String, required:true},
    price: {type:Number, required:true},
    discount:{type:Number, default:0},
    rating:{type:Number, default:0},
    description:{type:String, required:true},
    productImg:{type:String, required:true},
    category:{type:String, required:true}
});

module.exports = mongoose.model('Product', productSchema);
