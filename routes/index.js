const express = require("express");
const {signup,login,profile,logout} = require("../controllers/auth");
const {Op,fn,col} = require("sequelize")
// const {createProduct,getProduct,getAll,deleteProduct} = require("../controllers/auth");
const {createStore,addProduct,upload,addToCart,removeFromCart} = require("../controllers/store");
const {ensureAuth,ensureLoggedIn,isFarmer} = require("../middlewares/auth");
const Store = require("../server/models").Store;
const Product = require("../server/models").Product;
const Transaction = require("../server/models").Transaction;
const router = express.Router();

router.get("/signup",ensureLoggedIn,(req,res,next)=>{
  res.render("auth/signup",{
    success: req.flash("success"),
    error: req.flash("error"),
  });
});
router.post("/signup",ensureLoggedIn,signup);

router.get("/login",ensureLoggedIn,(req,res,next)=>{
  res.render("auth/login",{
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

router.get("/farmer/store/create",ensureAuth,(req,res,next)=>{
  res.render("farmer/createStore",{
    error:req.flash("error"),
    success:req.flash("success")
  })
});

router.post("/farmer/store/create",ensureAuth,createStore);

router.post("/login",ensureLoggedIn,login);

router.get("/profile",ensureAuth,profile)

router.get("/logout",ensureAuth,logout);

router.get("/dashboard",ensureAuth,async (req,res,next)=>{
  const {dataValues:store} = await Store.findOne({where:{ownerId:req.session.user.farmer.id}});
  const transactions = await Transaction.findAll({raw:true});
  res.render("farmer/dashboard",{
    success: req.flash("success"),
    error: req.flash("error"),
    user:req.session.user,
    store,
    transactions
  });
});

router.get("/farmer/store/add",ensureAuth,(req,res,next)=>{
  res.render("farmer/addProduct",{
    success: req.flash("success"),
    error: req.flash("error"),
  })
});

router.post("/farmer/store/add",ensureAuth,upload.single("image"),addProduct);

router.get("/",ensureAuth,async (req,res,next)=>{
  try {
    const products = await Product.findAll({attributes:["id","name","imageUrl","price","description","StoreId"],where:{isBought:false},raw:true});
    // console.log(req.session.user.cart)

    res.render("homepage",{
      error:req.flash("error"),
      success:req.flash("success"),
      products:products,
      user:req.session.user,
      isAdmin:req.session.user.role ==="farmer"?true:false,
      itemCount: req.session.user.cart.length
    })
  } catch (error) {
    throw new Error(error.message)
  }
});

router.get("/cart",async(req,res,next)=>{
  try {
    const cartItems = req.session.user.cart;
    const products = await Product.findAll({where:{id:cartItems},raw:true});
    const total = await Product.sum('price');
    console.log(total)
    res.render("cart",{
      error:req.flash('error'),
      success:req.flash("success"),
      products,
      itemCount:cartItems.length,
      total,
      user:req.session.user,
      isAdmin: req.session.user.role ==="farmer"?true:false
    });
  } catch (error) {
    throw new Error(error.message)
  }
})

router.post("/cart/add/:productId",addToCart);

router.post("/cart/remove/:productId",removeFromCart);

router.get("/product/:id",async(req,res,next)=>{
  const productId = req.params.id;
  console.log(productId)
  const product = await Product.findOne({where:{id:productId},raw:true})
  const {id,name,imageUrl,price,description} = product
  console.log(imageUrl)
  res.render("farmer/product",{
    error:req.flash("error"),
      success:req.flash("success"),
      user:req.session.user,
      isAdmin:req.session.user.role ==="farmer"?true:false,
      itemCount: req.session.user.cart.length,
      id,name,imageUrl,price,description
  })
})

module.exports = router;
