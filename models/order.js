const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        userID : {type:String, required:true},
        products : [
            {
                productID : {type:String},
                quantity : {type:Number, default:1},
            },
        ],
        amount : {type:String,  required:true},
        address : {type:String, requied:true},
        status : {type:String, default:"Order is in pending.."},
    },
    {timestamps : true}
);

module.exports = mongoose.model("order", orderSchema);
