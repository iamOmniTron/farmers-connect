const User = require("../models/user.model");
const Product = require("../models/product.model");

module.exports = {
  createProduct : async (req,res,next)=>{
    try {
      const {name,price,description} = req.body;
      const {storeId} = req.user
      if(!(name|price|description)){
        throw "fields name,price,description required"
      }
      const product = new Product({
        name,price,description,store:storeId
      });
      if(!product){
        throw "couldnt create product";
      }
      res.send("product created successfully");
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getProduct: async(req,res,next)=>{
    try {
        const {productId} = req.query;
        const product = await Product.findById(productId);
        if(!product){
          throw "invalid product"
        }
        res.send(product);
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getAllProducts : async(req,res,next)=>{
    try {
      const products = await Products.find({});
      if(!products){
        throw "no product available"
      }
      res.send(products);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getAllBoughtProducts:async(req,res,next)=>{
    try {
      const products = await Product.find({isBought:true});

      if(!products){
        throw "no products at the moment"
      }
      res.send(products);
    } catch (error) {
      throw new Error(error.message)
    }
  },
  deleteProduct: async(req,res,next)=>{
    try {
      const {storeId} = req.user;
      const {productId} = req.body;
      const isDeleted = await Product.deleteOne({_id:storeId,store:storeId,isBought:false});
      if(!isDeleted){
        throw "cannot delete product"
      }
      res.send("product deleted successfully");

    } catch (error) {
      throw new Error(error.message)
    }
  }
}
