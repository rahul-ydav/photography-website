var mongoose = require('mongoose');

var commentsSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

var comments = mongoose.model("comments", commentsSchema);

module.exports = comments;
