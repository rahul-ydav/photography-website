var express = require('express');
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//index route
router.get('/', function(req, res){
	// console.log(req.user);
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.error("error in finding: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
		}
		else{
    		res.render("campgrounds.ejs", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});


//CREATE:-  post(campground) route
router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
    var newCampGrounds = {name: name, image: image, price: price, description: description, author: author};
	Campground.create(newCampGrounds, function(err, newCamp){
		if(err){
			console.error("error during create: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
			res.redirect("back");
		}
		else{
			console.log(newCamp);
			req.flash("success", "Campground Created Successfully");
    		res.redirect('/index');
		}
	});
});


//new route
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('new.ejs');
});

//show route
router.get('/:id', function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, searchCampground){
		if(err){
			console.error("errorrrrrr in findingById: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
			res.redirect("back");
		}
		else{
			res.render("show.ejs", {campgrounds: searchCampground});
		}
	});
});

// EDit Campgorund Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.error("Errorrrr in editing: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
			res.redirect("back");
		}
		else{
			res.render("edit.ejs", {campground: campground});
		}
	})
})

// UPDATE CAMPGROUND Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp){
		if(err){
			console.error("Errorrrr in updating route: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
			res.redirect("back");
		}
		else{
			req.flash("warning", "Your Campground is updated successfully");
			res.redirect("/index/" +req.params.id);
		}
	})
})
//Destory Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.error("error in deleting: "+ err);
			req.flash("error", "Something went wrong. Maybe server down");
			res.redirect("/index/"+ req.params.id);
		}
		else{
			req.flash("error", "Campground successfully removed");
			res.redirect("/index");
		}
	})
})


module.exports = router;
