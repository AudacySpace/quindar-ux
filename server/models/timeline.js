var mongoose = require('mongoose');

// define the schema for our timeline model
var timelineSchema = mongoose.Schema({
	// mission : String,
	// events : Array,
	// filename : String,
	// file : String

	mission : {type:String,required:true},
	events : {type:Array,required:true},
	filename : {type:String,required:true},
	file : {type:String,required:true}
});

// create the model for timeline and expose it to our app
module.exports = mongoose.model('timeline', timelineSchema);