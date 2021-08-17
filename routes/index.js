const express = require("express");
// const {QueryTypes} = require("sequelize");
const {sequelize} = require("../server/models")
const {signup,login,profile,logout} = require("../controllers/auth");
const {createStore,addProduct,upload,addToCart,removeFromCart} = require("../controllers/store");
const {ensureAuth,ensureLoggedIn,isFarmer} = require("../middlewares/auth");
const Store = require("../server/models").Store;
const Product = require("../server/models").Product;
const Transaction = require("../server/models").Transaction;
const Order = require("../server/models").Order;
const { QueryTypes } = require("sequelize");
const { Query } = require("pg");
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

router.get("/dashboard",ensureAuth,isFarmer,async (req,res,next)=>{
  const {dataValues:store} = await Store.findOne({where:{ownerId:req.session.user.farmer.id}});
  const transactions = await Transaction.findAll({raw:true});
  const itemsSold = await Product.findAll({where:{isBought:true,StoreId:store.id},raw:true});
  const total = await sequelize.query('select SUM("price") from "Product" where "isBought" = true and "StoreId" = UUID(?)',{
    type:QueryTypes.SELECT,
    replacements:[store.id]
  })
  const customers = await sequelize.query('select COUNT(*) from "User" inner join "Transaction" on "Transaction"."UserId" = "User"."id" inner join "Sale" on "Sale"."TransactionId" = "Transaction"."id" inner join "Product" on "Sale"."ProductId" = "Product"."id" where "Product"."StoreId" = UUID(?)',{
    type:QueryTypes.SELECT,
    replacements:[store.id]
  })
  res.render("farmer/dashboard",{
    success: req.flash("success"),
    error: req.flash("error"),
    user:req.session.user,
    total:total[0].sum,
    store,
    isUser:req.session.user.role !== "farmer"?true:false,
    customers:customers[0].count,
    itemsSold:itemsSold.length,
    transactions
  });
});

router.get("/farmer/store/add",ensureAuth,isFarmer,(req,res,next)=>{
  res.render("farmer/addProduct",{
    success: req.flash("success"),
    error: req.flash("error"),
  })
});

router.post("/farmer/store/add",ensureAuth,isFarmer,upload.single("image"),addProduct);

router.get("/",ensureAuth,async (req,res,next)=>{
  try {
    const products = await Product.findAll({attributes:["id","name","imageUrl","price","description","StoreId"],where:{isBought:false},raw:true});


    res.render("homepage",{
      error:req.flash("error"),
      success:req.flash("success"),
      products:products,
      user:req.session.user,
      isAdmin:req.session.user.role ==="farmer"?true:false,
      itemCount: req.session.user.role =="farmer"?"":req.session.user.cart.length
    })
  } catch (error) {
    throw new Error(error.message)
  }
});

router.get("/cart",ensureAuth,async(req,res,next)=>{
  try {
    const cartItems = req.session.user.cart;
    const products = await Product.findAll({where:{id:cartItems},raw:true});
    const total = await Product.sum('price',{where:{id:cartItems}});
    console.log(total)
    res.render("cart",{
      error:req.flash('error'),
      success:req.flash("success"),
      products,
      itemCount:cartItems.length,
      total,
      user:req.session.user,
      isAdmin: req.session.user.role ==="farmer"?true:false,
      isEmpty:(total <= 0) || !total?true:false
    });
  } catch (error) {
    throw new Error(error.message)
  }
})

router.post("/cart/add/:productId",ensureAuth,addToCart);

router.post("/cart/remove/:productId",ensureAuth,removeFromCart);

router.get("/product/:id",ensureAuth,async(req,res,next)=>{
  const productId = req.params.id;
  console.log(productId)
  const product = await Product.findOne({where:{id:productId},raw:true})
  const {id,name,imageUrl,price,description} = product;
  res.render("farmer/product",{
    error:req.flash("error"),
      success:req.flash("success"),
      user:req.session.user,
      isAdmin:req.session.user.role ==="farmer"?true:false,
      itemCount: req.session.user.cart.length,
      id,name,imageUrl,price,description
  })
});

router.get("/checkout",ensureAuth,async(req,res,next)=>{
  try {
    const userId = req.session.user.id;
    const cartItems = req.session.user.cart;
    const products = await Product.findAll({where:{id:cartItems}})
    const total = await Product.sum("price",{where:{id:cartItems}});
     const T = await Transaction.create({UserId:userId,total:total});
     const transaction = await T.addProducts(products);
     console.log(transaction)
     if(!transaction){
       req.flash("error","cannot process order at the moment");
       return res.redirect("/cart")
     }
     const updated = await Product.update({isBought:true},{where:{id:cartItems}});
    console.log(transaction);
    req.session.user.cart = [];
    req.flash("success","your orders will be delivered soon...")
    res.redirect("/");
  } catch (error) {
    throw new Error(error.message)
  }
});

router.get("/user/transactions",ensureAuth,async(req,res,next)=>{
  try {
    const transactions = await Transaction.findAll({where:{UserId:req.session.user.id},raw:true});
    const total = await Transaction.sum("total",{where:{UserId:req.session.user.id}});
    const items = await sequelize.query(' select "Product"."name","Product"."price","Transaction"."id" as "TransactionId" from "Product" inner join "Sale" on "Sale"."ProductId" = "Product"."id" inner join "Transaction" on "Transaction"."id" = "Sale"."TransactionId" where "Transaction"."UserId" = ?',{
      type:QueryTypes.SELECT,
      replacements:[req.session.user.id]
    })
    const userTransaction = items.map((i)=>({name:i.name,price:i.price,TransactionId:i.TransactionId.split("-")[0].toString()})
    )
    console.log(userTransaction)
    res.render("user-transactions",{
      error:req.flash("error"),
      success:req.flash("success"),
      user:req.session.user,
      isAdmin:req.session.user.role ==="farmer"?true:false,
      itemCount: req.session.user.cart.length,
      transactions:userTransaction,
      total
    })
  } catch (error) {
    throw new Error(error.message)
  };
})


router.get("/farmer/transactions",ensureAuth,isFarmer,async(req,res,next)=>{
  try {
    const Total = await Transaction.sum("total",{where:{UserId:req.session.user.id}});
    const storeId = await Store.findOne({where:{ownerId:req.session.user.farmer.id}})
    const items = await sequelize.query('select "Product"."name","Product"."price","Transaction"."id" as "TransactionId","User"."id" as "buyerId" from "Transaction","User","Product" inner join "Sale" on "Product"."id" = "Sale"."ProductId" inner join "Transaction" on "Transaction"."id" = "Sale"."TransactionId" inner join "User" on "Transaction"."UserId" = ""User"."id" where "Product"."StoreId" = ?',{
      type:QueryTypes.SELECT,
      replacements:[storeId]
    })
    console.log(items);
    res.render("user-transactions",{
      error:req.flash("error"),
      success:req.flash("success"),
      user:req.session.user,
      isAdmin:req.session.user.role ==="farmer"?true:false,
      itemCount: req.session.user.cart.length,
      transactions:items,
      Total
    })
  } catch (error) {
    throw new Error(error.message)
  };
})


router.get("/farmer/products",ensureAuth,isFarmer,async(req,res,next)=>{
  try {
    const result = await sequelize.query('select "id" from "Store" where "ownerId"=?',{
      type:QueryTypes.SELECT,
      replacements:[req.session.user.farmer.id]
    });
    const products = await sequelize.query('select "id","name","description","price","imageUrl" from "Product" where "isBought" = false and "StoreId" =?',{
      type:QueryTypes.SELECT,
      replacements:[result[0].id]
    })

    res.render("farmer/products",{
      error:req.flash("error"),
      success:req.flash("success"),
      user:req.session.user,
      isAdmin:req.session.user.role ==="farmer"?true:false,
      products
    })
  } catch (error) {
    throw new Error(error.message)
  }
})
module.exports = router;
