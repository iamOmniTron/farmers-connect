const express = require("express");

const app = express();

app.use((err,req,res,next)=>{
  if(err){
    return res.status(err.status||500).send("INTERNAL SERVER ERROR");
  }
})

module.exports = app;
