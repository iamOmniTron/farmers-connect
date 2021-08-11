const dotenv =require("dotenv")
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: __dirname + "/.env" });
}
const express = require("express");
const favicon = require("serve-favicon");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const sequelizeStore = require("connect-session-sequelize")(session.Store);
const {sequelize} = require("./server/models");
const router = require("./routes");

const app = express();
(async function(){
  try {
    await sequelize.authenticate()
    console.log("Connection to database established");
    await sequelize.sync();
    console.log("database synchronized");
    // console.log(sequelize)
  } catch (error) {
    console.log(error.message)
  }
})()
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "public"));
app.use(favicon(__dirname + "/public/favicon/favicon.ico"));
app.engine(
  "handlebars",
  exphbs({
    defaulLayout: "main",
    partialsDir: __dirname + '/views/partials/'
    // helpers: { truncate, stripTags, year },
  })
);
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      store: new sequelizeStore({
        db:sequelize
      }),
      cookie: { httpOnly: true, maxAge: 43200000, secure: false },
}))
app.use(flash());
app.use("/",router)

app.use((err,req,res,next)=>{
  if(err){
    console.log(err.message)
    return res.render("error/error",{
      success: req.flash("success"),
      error: req.flash("error"),
      error:err,
      backUrl:req.originalUrl
    });
  }
})

module.exports = app;
