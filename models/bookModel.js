var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var BookSchema = new Schema({
	title:{type:String, required: true},
	author:{type:String, required: true},
	genre:{type:String, required: false},
	read:{type:Boolean, required: true, default: false}
});

module.exports = mongoose.model("Book", BookSchema);