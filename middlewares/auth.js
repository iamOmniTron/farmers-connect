module.exports = {
  ensureAuth: (req,res,next)=>{
    if(!req.session.user){
      req.flash("error","you need to sign in first");
      return res.redirect("/login")
    }
    next();
  },
  ensureLoggedIn:(req,res,next)=>{
    if(req.session.user){
    req.flash("error","you need to logout first");
    if(req.session.user.role == "farmer"){
      return res.redirect("/dashboard");
    }
    res.redirect("/")
    }
    next();
  },
  isFarmer : (req,res,next)=>{
    if(req.session.user.role !=="farmer"){
      req.flash("error","unauthorized");
      return res.redirect(req.originalUrl);
    }
    next();
  }
}
