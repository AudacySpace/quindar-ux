var mongoose = require('mongoose');

// define the schema for our timeline model
var timelineSchema = mongoose.Schema({
	mission : String,
	events : Array,
	filename : String,
	file : String
});

// create the model for timeline and expose it to our app
module.exports = mongoose.model('timeline', timelineSchema);