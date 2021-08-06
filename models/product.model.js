const {Schema,Types,mdoel}= require("mongoose");
const Store = require("./store.model");
const Buyer = require("./user.model";)

const ProductSchema = new Schema({
  name:{
    type:String
  },
  isBought:{
    type:Boolean,
  },
  store:{
    type:Types.ObjectId,
    ref:"Store",
  },
  buyer:{
    type:Types.ObjectId,
    ref:"User",
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  boughtOn:{
    type:Date
  }
});

module.exports = model("Product",ProductSchema);
