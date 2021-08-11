module.exports = {
  ensureAuth: (req,res,next)=>{
    if(!req.session.user){
      throw "unauthenticated"
    }
    next();
  },
  ensureLoggedIn:(req,res,next)=>{
    if(req.session.user){
    return  res.redirect(req.originalUrl);
    }
    next();
  },
  isFarmer : (req,res,next)=>{
    if(!req.session.user.role !=="farmer"){
      req.flash("error","unauthorized");
      return res.redirect(req.originalUrl);
    }
    next();
  }
}
