
var mongoose = require('mongoose');

// define the schema for our statusboard model
var statusBoardSchema = mongoose.Schema({
	// mission : String,
	// vehiclecolors : Array,
	// statusboard : Array 

	mission : {type: String,required:true},
	vehiclecolors : {type: Array,required:true},
	statusboard : {type:Array,required:true}
});

// create the model for statusboard and expose it to our app
module.exports = mongoose.model('StatusBoard', statusBoardSchema);