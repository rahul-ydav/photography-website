var mongoose = require('mongoose');
var comments = require('./comments');


//SCHEMA SETUP
var CampgroundSchema = new mongoose.Schema({
    name: String,
    price: Number,
	image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    }]
});

var Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;