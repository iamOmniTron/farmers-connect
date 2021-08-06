const {Schema,Types,mdoel}= require("mongoose");
const User = require("./user.model");
const Product = require("./product.model")

const StoreSchema = new Schema({
  owner:{
    type:Types.ObjectId,
    ref:"User"
  },
  products:[{
    type:Types.ObjectId,
    ref:"Product"
  }],
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = model("Store",StoreSchema);
