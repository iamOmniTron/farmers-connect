const express = require("express");
const {signup,login,profile,logout} = require("../controllers/auth");
// const {createProduct,getProduct,getAll,deleteProduct} = require("../controllers/auth");
// const {createStore,getStore,getAllStores} = require("../controllers/store");
// const {ensureAuth,ensureLoggedIn} = require("../middlewares/auth");

const router = express.Router();

router.get("/signup",(req,res,next)=>{
  res.render("auth/signup",{
    success: req.flash("success"),
    error: req.flash("error"),
  });
});
router.post("/signup",signup);

router.get("/login",(req,res,next)=>{
  res.render("auth/login",{
    success: req.flash("success"),
    error: req.flash("error"),
  });
})
router.post("/login",login);

router.get("/profile",profile)

router.get("/logout",logout);

router.get("/dashboard",(req,res,next)=>{
  res.render("farmer/dashboard",{
    success: req.flash("success"),
    error: req.flash("error"),
    username:req.session.user.name
  });
});

router.get("/",(req,res,next)=>{
  res.json(req.session.user)
})

router.get("/farmer/store/add",(req,res,next)=>{
  res.render("farmer/addProduct",{
    success: req.flash("success"),
    error: req.flash("error"),
  })
})


module.exports = router;
