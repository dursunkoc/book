var express = require('express'),
    router = require('./routers/bookRouter'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var app = express();
var connectionURL = "mongodb://localhost/bookDB";
var db = mongoose.connect(connectionURL, function(err){
	if(err) {
		console.log(err);
	}else{
		console.log("Connected to the database using "+connectionURL);
	}
});


app.use(bodyParser.json());

app.use('/api/book', router());

app.get('/', function(req, res) {
    res.send("Hello World");
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Started book on " + port);
});