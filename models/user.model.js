const {Schema,Types,mdoel}= require("mongoose");

const UserSchema = new Schema({
  name:{
    type:String,
  },
  role:{
    type:String,
    enum:["user","farmer"]
  },
  password:{
    type:String,
    min:10
  },
  email:{
    type:String,
  },
});


module.exports = model("User",UserSchema);
