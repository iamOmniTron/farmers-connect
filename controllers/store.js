const User = require("../models/user.model");
const Store = require("../models/store.model");

module.exports = {
  createStore :async (req,res,next)=>{
    try {
      const user = req.user;
      if(req.user.role !== "farmer"){
        throw "unauthorized"
      }
      const store = new Store({
        owner:req.user.id,
      })
      const isSaved = await store.save();
      if(!isSaved){
        throw "couldnt create store"
      }
      req.user.storeId = store._id;
      res.send("store created successfully")
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getStore:async(req,res,next)=>{
    try {
      const storeId = req.params.id;
      const store = await Store.findById(storeId);
      if(!store){
        throw "invalid store"
      }
      res.send(store);
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getAllStores: async(req,res,next)=>{
    try {
      const stores = await Store.find({}).populate("owner");
    } catch (error) {
      throw new Error(error.message)
    }
  }

}
