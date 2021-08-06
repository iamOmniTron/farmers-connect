const Bcrypt = require("bcrypt");
const {testEmail} = require("../lib/util");
const User = require("../models/user.model");

module.exports = {
  signup:async(req,res,next)=>{
    try {
      const {name,email,password,confirmPassword,role} = req.body;
      const roles = ["farmer","user"]
        if(!(name|email|password|confirmPassword|role)){
          throw "name,email,password,confirmPassword,role fields required";
        }
        if(password !== confirmPassword){
          throw "passowrds must match";
        }
        const hashedPassword = Bcrypt.hash(password,10);
        const isMatched = testEmail(email);
        if(!isMatched){
          throw "input a valid mail address"
        }
        if
        const user = new User({
          name,email,role,password:hashedPassword
        });
        const isSaved = await user.save();
        if(!isSaved){
          throw "unable to create account"
        }

        res.send("signup complete");

    } catch (error) {
      throw new Error(error.message);
    }
  },
  login: async (req,res,next)=>{
    try {
      const {email,password}= req.body;
      if(!(email|password)){
        throw "invalid email,password fields"
      }
      const user = await User.findOne({email});
      if(!user){
        throw "invalid user"
      }
      const isMatched = await Bcrypt.compare(user.password,password);

      if(!isMatched){
        throw "incorrect password"
      }
      res.send("login successful");
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
