var express    = require("express"),
	app		   = express();
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),
	flash      = require('connect-flash'),
	passport   = require('passport'),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    Campground = require('./models/campground'),
	comments   = require('./models/comments'),
	User       = require('./models/user')
	seedDB     = require('./seeds.js');
	
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require('./routes/comments.js'),
	indexRoutes      = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/yelp_campv9_6", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

//passport config
app.use(require('express-session')({
	secret: "hi there i am the best",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	next();
});

app.use("/", indexRoutes);
app.use("/index", campgroundRoutes);
app.use("/index/:id/comments", commentRoutes);



app.listen(3000, function(){
    console.log('YelpCamp server on');
});