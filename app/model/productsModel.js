const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    productImg:{type:String, required:true},
    quantity:{type:String, required:true}
});
module.exports = mongoose.model('product', productSchema);