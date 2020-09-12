// all middleware are placed here
// var Campground = require("../models/campground")
var middlewareObj = {};

// own second middleware
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//if user is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, campground){
			if(err){
				console.error("error in finding for editing: "+ err);
				req.flash("error", "Campground is not able to edit");
				res.redirect("back");
			}
			else{
				//does user on the campground
				if(campground.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "Edit permission denied....");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error", "You need to be logged in");
		res.redirect("back");
	}
}

// own second middleware
middlewareObj.checkCommentsOwnership = function (req, res, next){
	//if user is logged in
	if(req.isAuthenticated()){
		comments.findById(req.params.comment_id, function(err, comment){
			if(err){
				console.error("error in finding for editing: "+ err);
				req.flash("error", "Comment is not able to edit");
				res.redirect("back");
			}
			else{
				//does user on the campground
				if(comment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "Edit permission denied....");
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error", "You need to be logged in");
		res.redirect("back");
	}
}


//own middleware
middlewareObj.isLoggedIn =  function(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Please login first!!!!");
	res.redirect("/login");
}

module.exports = middlewareObj;
