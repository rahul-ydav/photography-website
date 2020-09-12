var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require('../models/campground');
var comments   = require("../models/comments");
var middleware = require("../middleware");


// comment routes==================================
//new comment route
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.error("error in typing comment: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
			res.redirect("back");
		}
		else{
			res.render("cnew.ejs", {campground: campground});
		}
	})
})

//post(comment) route
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log("finding campground for error: "+ err);
		}
		comments.create(req.body.comment, function(err, comment){
			if(err){
				console.error("error in posting a comment: "+ err);
			}
			else{
				// add username and id to comment.author
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();

				campground.comments.push(comment);
				campground.save();
				req.flash("warning", "Your comment is added");
				res.redirect("/index/" + campground._id);
			}
		})
	})
})

// comment edit route
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
	comments.findById(req.params.comment_id, function(err, searchComment){
		if(err){
			console.error("error in editing comment: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
			res.redirect("back");
		}
		else{
			res.render("cedit.ejs", { campground_id: req.params.id, comment: searchComment});
		}
	})
})

// comment update route
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
	comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err){
			console.log(err);
			res.redirect("back");
		}
		else{
			req.flash("warning", "your comment is updated");
			res.redirect("/index/" + req.params.id);
		}
	})
})

//comment destroy route
router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
	comments.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.error(err);
			res.redirect("back");
		}
		 else{
			 req.flash("error", "Your comment is removed successfully");
			 res.redirect("/index/"+ req.params.id);
		 }
	})
})


module.exports = router;