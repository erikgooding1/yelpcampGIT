var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// Root Route

router.get("/", (req, res) => {
	res.render("home");
});

//============
// Auth Routes
//============

// Register Form
router.get("/register", (req, res) => {
	res.render("register");
})

// Sign Up Logic
router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if(err) {
			req.flash("error", err.message);
			res.redirect("/");
		} else {
			req.flash("success", "Account registered! Welcome to YelpCamp, " + req.body.username + "!");
			res.redirect("/campgrounds");
		}
	});
});

//Login Form
router.get("/login", (req, res) => {
	res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {});

// Logout 
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;

