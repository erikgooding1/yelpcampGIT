var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX
router.get("/", (req, res) => {
	// Get all campgrounds from db
	Campground.find({}, (err, allCampgrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds, page: 'campgrounds'});
		}
	});
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res) =>{
	// get data from from and add to campgroudns array
	var campName = req.body.name;
	var campImage = req.body.image;
	var campDescription = req.body.description;
	var campPrice = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: campName, image: campImage, description: campDescription, author: author, price: campPrice};
	// Create a new compground, save to db
	
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page
			req.flash("success", "Campground created!");
			res.redirect("/campgrounds");
		}
	});
	
});

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) =>{
	res.render("campgrounds/new");
});

// SHOW
router.get("/:id", (req, res) => {
	// Find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
		Campground.findById(req.params.id, (err, campground) => {
					res.render("campgrounds/edit", {campground: campground});
		});
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCampground) => {
		if(err) {
			res.send("Error updating content");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;