var mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"),
	Comment 	= require("./models/comment");

var data = [
	{
		name: "First Landing State Park", 
		image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1452437573/campground-photos/twketcgl0hgodbi32ezg.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut vehicula diam. Donec consequat magna sed justo mollis ornare. Vestibulum magna turpis, sollicitudin ut euismod eget, ultrices ut eros. Donec placerat suscipit justo, in tincidunt neque rutrum vitae. Proin urna felis, tempus a commodo at, dapibus non augue. Ut enim elit, gravida a sollicitudin sed, dapibus eu massa. Aliquam tempor sem id lectus molestie, feugiat cursus erat pretium. Nunc ac semper nunc."
	},
	{
		name: "KOA Campgrounds",
		image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut vehicula diam. Donec consequat magna sed justo mollis ornare. Vestibulum magna turpis, sollicitudin ut euismod eget, ultrices ut eros. Donec placerat suscipit justo, in tincidunt neque rutrum vitae. Proin urna felis, tempus a commodo at, dapibus non augue. Ut enim elit, gravida a sollicitudin sed, dapibus eu massa. Aliquam tempor sem id lectus molestie, feugiat cursus erat pretium. Nunc ac semper nunc."
	}, 
	{
		name: "Salmon Creek",
		image: "https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1353&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ut vehicula diam. Donec consequat magna sed justo mollis ornare. Vestibulum magna turpis, sollicitudin ut euismod eget, ultrices ut eros. Donec placerat suscipit justo, in tincidunt neque rutrum vitae. Proin urna felis, tempus a commodo at, dapibus non augue. Ut enim elit, gravida a sollicitudin sed, dapibus eu massa. Aliquam tempor sem id lectus molestie, feugiat cursus erat pretium. Nunc ac semper nunc."
	}
]

function seedDB() {
	// Remove all Campgrounds
	Campground.remove({}, (err) => {
		
		if(err) {
			console.log(err)
		}
		console.log("Removed campgrounds");
		// Add a few campgrounds
		data.forEach((seed) => {
			Campground.create(seed, (err, campground) => {
				if(err) {
					console.log(err);
				} else {
					console.log("Added a campground");
					// create a comment
					
					Comment.create(
						{text: "This place is great, but I wish there was internet", author: "egg"},
						function(err, comment) {
							if(err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment");
							}
							
						}
					);
				}
			});
			
		});
		
	});


}

module.exports = seedDB;