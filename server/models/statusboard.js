
var mongoose = require('mongoose');

// define the schema for our statusboard model
var statusBoardSchema = mongoose.Schema({
	mission : String,
	vehiclecolors : Array,
	statusboard : Array 
});

// create the model for statusboard and expose it to our app
module.exports = mongoose.model('StatusBoard', statusBoardSchema);