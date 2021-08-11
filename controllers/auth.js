const Bcrypt = require("bcrypt");
const {
  testEmail
} = require("../lib/util");
const User = require("../server/models").User;

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
         user = await User.create({name,email,password:hashedPassword,phone,role})
        if(!user){
          req.flash("error",`unable to register ${role}`);
          return res.redirect(req.originalUrl)
        }
        //set session here
        req.session.user = {
          id:user.id,
          name:user.name,
          email:user.email,
          role:user.role
        }
        req.flash("success","signup successfull");
        // if(role == roles[0]){
          res.redirect("/farmer/store/create");
        // }
        // res.redirect("/");
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
        const user = await User.findOne({where:{email}});
        if(!user){
          req.flash("error","user/farmer does not exist");
          return res.redirect(req.originalUrl)
        }
        const isPassMatch = await Bcrypt.compare(password,user.password);
        if(!isPassMatch){
          req.flash("error","invalid password");
          return res.redirect(req.originalUrl);
        }
        //set session here
        req.session.user = {
          id:user.id,
          name:user.name,
          email:user.email,
          role:user.role
        }
        req.flash("success",`welcome ${user.name}`);
        // if(user.role =="farmer"){
          // return res.redirect('/farmer/dashboard');
          return res.redirect("/dashboard")
        // }
        // res.redirect('/');
      } catch (error) {
        throw new Error(error.message)
      }
    },
    profile:async(req,res,next)=>{
      try {
        const user = req.session.user;
        res.render("auth/profile",{
          error:req.flash("error"),
          success:req.flash("success"),
          user:user
        });
      } catch (error) {
        throw new Error(error.message)
      }
    },
    logout: async (req,res,next)=>{
      try {
        req.session = null;
        req.session.destroy();
        req.flash("success","logged out successfully");
        res.redirect("/login");
      } catch (error) {
        throw new Error(error.message)
      }
    }
}
