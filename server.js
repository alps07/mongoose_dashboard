// path module -- try to figure out where and why we use this
var path = require("path");

// require express
var express = require("express");
// create the express app
var app = express();

// require mongoose and create the mongoose variable
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" 
//is the name of our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/mongoose_dash');

var MongSchema = new mongoose.Schema({
 name: String,
 type: String,
 color: String
})
var Mong = mongoose.model('Mong', MongSchema);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
// This is where we would get the users from the database
// and send them to the index view to be displayed.
	Mong.find({}, function(err, mongs){
		if(err){
			console.log(err);
		}else{
			//users = users;
			console.log("sending data");
			res.render("index", {data: mongs});
		}
	})
});

app.get('/mongooses/new', function(req, res){
	res.render("new_mongoose");
})

app.get('/mongooses/:id', function(req, res){
	Mong.findOne({_id: req.params.id}, function(err, mongs){
		if(err){
			console.log(err);
		}else{
			//users = users;
			console.log("sending data to page");
			res.render("mongoose", {data: mongs});
		}
	})
})



app.get('/mongooses/:id/edit', function(req, res){
	Mong.findOne({_id: req.params.id}, function(err, mongs){
		if(err){
			console.log(err);
		}else{
			//users = users;
			console.log("sending data to page");
			res.render("edit_mongoose", {data: mongs});
		}
	})
})

app.post('/mongooses/:id/update', function(req, res){

	Mong.update({_id:req.params.id}, {name: req.body.name,
	 type: req.body.type, color: req.body.color}, function(err, mong){
	 	if(err){
	 		console.log(err);
	 	}else{
	 		console.log('successfully edited a Mongoose!');
		  res.redirect('/');
	 	}
	 })
})
// route for adding a user
// When the user presses the submit button on index.ejs it should send a post request to '/users' and in
// this route we should add the user to the database and then redirect to the root route (index view).
app.post('/mongooses', function(req, res) {
	console.log("POST DATA", req.body);
	// res.render('index');
	// create a new User with the name and age corresponding to those from req.body
	 var mong = new Mong({name: req.body.name, type: req.body.type, color: req.body.color});
	 console.log(mong);
	// try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
	mong.save(function(err) {
	// if there is an error console.log that something went wrong!
		if(err) {
		  console.log('something went wrong');
		} else { // else console.log that we did well and then redirect to the root route
		  console.log('successfully added a Mongoose!');
		  res.redirect('/');
		}
	})
});

app.get('/mongooses/:id/destroy', function(req, res){

	Mong.remove({_id:req.params.id}, function(err, mong){
	 	if(err){
	 		console.log(err);
	 	}else{
	 		console.log('successfully edited a Mongoose!');
		  res.redirect('/');
	 	}
	 })
})
// tell the express app to listen on port 8000
app.listen(6789, function() {
 console.log("listening on port 6789");
});