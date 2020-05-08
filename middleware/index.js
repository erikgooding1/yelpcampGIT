var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, campground) => {
			if(err) {
				req.flash("error", "Campground not found!");
				res.redirect("back");
			} else {
				if (!campground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				// does user own the campground?
				if(campground.author.id.equals(req.user._id)) {
					next();
				} else {
					// otherwise, redirect somewhere else
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
	});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, comment) => {
			if(err) {
				req.flash("error", "Comment not found!");
				res.redirect("/campgrounds");
			} else {
				if (!comment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				if(comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;