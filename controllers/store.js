const User = require("../models/user.model");
const Store = require("../models/store.model");

module.exports = {
  createStore :async (req,res,next)=>{
    try {
      const user = req.user;
      if(req.user.role !== "farmer"){
        req.flash("error","unauthorized")
        return res.redirect(req.originalUrl);
      }
      const store = new Store({
        owner:req.user.id,
      })
      const isUpdated = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { store:store._id } },
      { new: true, runValidators: true }
    );
    if(!isUpdated){
      req.flash("error","cannot assign store to user");
      return res.redirect(req.originalUrl);
    }
      const isSaved = await store.save();
      if(!isSaved){
        req.flash('error',"couldnt create store");
        return res.redirect(req.originalUrl)
      }
      req.user.storeId = store._id;
      req.flash("success","store created successfully")
      res.redirect("req.originalUrl");
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getStore:async(req,res,next)=>{
    try {
      const storeId = req.params.id;
      const store = await Store.findById(storeId).populate("owner");
      if(!store){
        req.flash("error","invalid store");
        return res.redirect(req.originalUrl)
      }
      res.send(store);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getAllStores: async(req,res,next)=>{
    try {
      const stores = await Store.find({}).populate("owner");
      if(!store){
        req.flash("error","no store available at the moment");
        return res.redirect(req.originalUrl)
      }
      res.send(stores);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  }
