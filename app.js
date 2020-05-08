var express 				= require("express"),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	LocalStrategy 			= require("passport-local"),
	mongoose 				= require("mongoose"),
	flash					= require("connect-flash"),
	methodOverride			= require("method-override"),
	passport 				= require("passport"),
	passportLocalMongoose 	= require("passport-local-mongoose"),
	Campground 				= require("./models/campground"),
	Comment 				= require("./models/comment"),
	User					= require("./models/user"),
	seedDB					= require("./seeds.js");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL,  {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log("ERROR: ", err.message);
});;
/*
mongoose.connect("mongodb+srv://eg5473:26Xjq637!@cluster0-vqcki.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log("ERROR: ", err.message);
});
*/

// mongoose.connect("mongodb://localhost:27017/yelp_camp_v11", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seed the database
// seedDB();

// Passport Config
app.use(require("express-session")({
	secret: "Gordo is a S tier dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// requiring routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("----YelpCamp v11----");
	console.log("Listening on Port 3000");
});













