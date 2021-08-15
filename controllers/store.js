const Store = require("../server/models").Store;
const multer = require("multer");
const path = require("path");
const Product = require("../server/models").Product;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
 
const upload = multer({ storage: storage })


module.exports = {
  upload: upload,
  createStore : async (req,res,next)=>{
    try {
      const {name} = req.body;
      if(!name){
        req.flash("error","a store name is required");
        return res.redirect(req.originalUrl);
      }
      const farmerId = req.session.user.farmer.id;
      const {dataValues} = await Store.create({name,ownerId:farmerId});
      console.log(dataValues)
      if(!dataValues){
        req.flash("error","could not create store at the moment");
        return res.redirect(req.originalUrl)
      }
      req.flash("success","store created successfully");
      res.redirect("/dashboard");
    } catch (error) {
      throw new Error(error.message)
    }
  },
  addProduct : async (req,res,next)=>{
    try {
      const file = req.file;
      const imgUrl = file.path.replace(/\\/g, "/").substring(7);
      const {name,description,price} = req.body;
      const {id} = await Store.findOne({attributes:["id"],where:{ownerId:req.session.user.farmer.id}});
      console.log(id)
      const {dataValues} = await Product.create({name,description,price,StoreId:id,imageUrl:imgUrl});
      if(!dataValues){
        req.flash("error","could not store product");
        return res.redirect(req.originalUrl);
      }
      req.flash("success","product uploaded successfully");
      res.redirect("/dashboard")
    } catch (error) {
      throw new Error(error.message)
    }
  },
  addToCart: async (req,res,next)=>{
    try {
      console.log(req.params.productId)
      const productId = req.params.productId;
      if(!req.session.user.cart || req.session.user.cart == "undefined"){
        req.session.cart = [];
      }
      if(req.session.user.cart.includes(productId)){
        return res.redirect("/")
      }
      req.session.user.cart.push(productId);
      req.flash("success","added to cart");
      res.redirect('/');
    } catch (error) {
      throw new Error(error.message)
    }
  },
  removeFromCart: async (req,res,next)=>{
    try {
      const productId = req.params.productId;
      if(!req.session.user.cart.includes(productId)){
        return res.redirect("/")
      }
      req.session.user.cart = req.session.user.cart.filter((itemId)=>itemId !==productId);
      req.flash("success","removed item from cart");
      res.redirect("/");
    } catch (error) {
      throw new Error(error.message)
    }
  }
}