var express = require("express");
var router = express.Router();
var passport = require("passport"),
    User     = require("../models/user");
    
//landing route
router.get('/', function(req, res){
    res.render('landing.ejs');
});

// Auth routes==========================================================
//show register form
router.get("/register", function(req, res){
	res.render("register.ejs");
});

router.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			// console.log("error in registering the user: "+ err);
			req.flash("error", err.message);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Hi " + req.body.username + ", Welcome to our family. You have succesfully Signed In");
			res.redirect("/index");
		})
	})
});

// show login form
router.get('/login', function(req, res){
	res.render("login.ejs");
})
//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/index",
	failureRedirect: "/"
}), function(req, res){
})

router.get('/logout', function(req, res){
	req.logout();
	req.flash("success", "Logged you out!!!");
	res.redirect("/");
})

//own middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;