const Bcrypt = require("bcrypt");
const {
  testEmail
} = require("../lib/util");
const User = require("../server/models").User;
const Store = require("../server/models").Store;
const Farmer = require("../server/models").Farmer;

module.exports = {

    signup: async(req,res,next)=>{
      try {
        const {name,email,password,confirmPassword,phone,role} = req.body;
        const roles = ["farmer","user"];
        if(!name || !email || !password  || !confirmPassword && !phone && !role){
          req.flash("error","all fields are required for signup");
          return res.redirect(req.originalUrl)
        };
        if(!testEmail(email)){
          req.flash("error","a valid email address is required");
          return res.redirect(req.originalUrl);
        }
        let user = await User.findOne({where:{email}});
        if(user){
          req.flash('error',"user already exists, proceed to login");
          return res.redirect(req.originalUrl)
        }
        if(password !== confirmPassword){
          req.flash("error","password mismatch");
          return res.redirect(req.originalUrl)
        }
        if(!roles.includes(role)){
          req.flash("error","must include a valid role");
          return res.redirect(req.originalUrl);
        }
        const hashedPassword = await Bcrypt.hash(password,10);
        const {dataValues} = await User.create({name,email,password:hashedPassword,phone,role})
        user = dataValues;
        if(!user){
          req.flash("error",`unable to register ${role}`);
          return res.redirect(req.originalUrl)
        }
        req.session.user = {
          id:user.id,
          name:user.name,
          email:user.email,
          role:user.role
        }
        req.flash("success","signup successfull");
        if(role == roles[0]){
          const {dataValues } = await Farmer.create({UserId:user.id})
          req.session.user.farmer = {
            id: dataValues.id
          }
          return res.redirect("/farmer/store/create");
        }
        req.session.user.cart = [];
        res.redirect("/");
      } catch (error) {
        req.flash("error",error.message)
        throw new Error(error.message)
      }
    },
    login: async (req,res,next)=>{
      try {
        const {email,password} = req.body;
        if(!email||!password){
          req.flash("error","email and password are required");
          return res.redirect(req.originalUrl);
        }
        if(!testEmail(email)){
          req.flash("error","invalid email address");
          return res.redirect(req.originalUrl)
        }
        const {dataValues} = await User.findOne({where:{email}});
        if(!dataValues){
          req.flash("error","user/farmer does not exist");
          return res.redirect(req.originalUrl)
        }
        const isPassMatch = await Bcrypt.compare(password,dataValues.password);
        if(!isPassMatch){
          req.flash("error","invalid password");
          return res.redirect(req.originalUrl);
         
        }
        req.session.user = {
          id:dataValues.id,
          name:dataValues.name,
          email:dataValues.email,
          role:dataValues.role
        }
        req.flash("success",`welcome ${dataValues.name}`);
        if(dataValues.role =="farmer"){
          const {dataValues:farmer} = await Farmer.findOne({where:{UserId:dataValues.id}})
          req.session.user.farmer = {
              id:farmer.id
          }
          return res.redirect("/dashboard");
        }
        req.session.user.cart = [];
        res.redirect('/');
      } catch (error) {
        throw new Error(error.message)
      }
    },
    profile:async(req,res,next)=>{
      try {
        const user = req.session.user;
        const {dataValues} = Store.findOne({where:{ownerId:user.id}})
        const userData = await User.findOne({where:{id:req.session.user.id},raw:true})
        console.log(userData)
        res.render("auth/profile",{
          error:req.flash("error"),
          success:req.flash("success"),
          user:user,
          phone:userData.phone,
          store:dataValues,
          isFarmer: user.role === "farmer"?true:false
        });
      } catch (error) {
        throw new Error(error.message)
      }
    },
    logout: async (req,res,next)=>{
      try {
        req.flash("success","logged out successfully");
        req.session.destroy();
        res.redirect("/login");
      } catch (error) {
        throw new Error(error.message)
      }
    }
}
