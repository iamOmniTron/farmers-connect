const dotenv =require("dotenv")
const express = require("express");
const bodyParser = require("body-parser");
const {mongoose} = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/.env" });
}
const MONGO_URI = process.env.MONGO_URI

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("connected to mongodb successfully"))
  .catch((err) => console.error("could not connect to mongodb", err));

app.use((err,req,res,next)=>{
  if(err){
    return res.status(err.status||500).send("INTERNAL SERVER ERROR");
  }
})

module.exports = app;
