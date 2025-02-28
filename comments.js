// create web server
// npm install express
// npm install body-parser
// npm install ejs
// npm install mongoose
// npm install method-override
var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// connect to mongoDB
mongoose.connect('mongodb://localhost/comment_app', { useNewUrlParser: true });

// define schema
var commentSchema = new mongoose.Schema({
    name: String,
    comment: String,
    created: {type: Date, default: Date.now}
});
var Comment = mongoose.model('Comment', commentSchema);

// create a comment
app.post('/comments', function(req, res) {
    Comment.create(req.body.comment, function(err, newComment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/comments');
        }
    });
});

// show all comments
app.get('/comments', function(req, res) {
    Comment.find({}, function(err, comments) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {comments: comments});
        }
    });
});

// show form to create new comment
app.get('/comments/new', function(req, res) {
    res.render('new');
});

// show a comment
app.get('/comments/:id', function(req, res) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            res.render('show', {comment: comment});
        }
    });
});

// show form to edit a comment
app.get('/comments/:id/edit', function(req, res) {
    Comment.findById(req.params.id, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            res.render('edit', {comment: comment});
        }
    });
});

// update a comment
app.put('/comments/:id', function(req, res) {
    Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/comments/' + req