var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// New Comment

router.get("/new", middleware.isLoggedIn, (req, res) => {
	// find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground})
		}
	});
});

// Create Comment

router.post("/", middleware.isLoggedIn, (req, res) => {
	// lookup campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err); 
			res.redirect("/campgrounds");
		} else {
			console.log(req.body.comment);
			// create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// redirect to campground show page
					req.flash("success", "Comment added to campground!");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// Edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	
	Comment.findById(req.params.comment_id, (err, comment) => {
		if(err) {
			res.send("ERROR");
		} else {
			if (!comment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
            }
			res.render("comments/edit", {comment: comment, campground_id: req.params.id});
		}
	});
});

// Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
		if(err) {
			res.send("What the heck are you doing");
		} else {
			if (!comment) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
            }
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Destroy Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});




module.exports = router;