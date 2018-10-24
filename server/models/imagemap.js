var mongoose = require('mongoose');

// define the schema for our imagemaps model
var imagemapSchema = mongoose.Schema({
	// mission : String,
	// uploadedfiles : Array

	mission : { type:String,required:true},
	uploadedfiles : {type:Array,required:true}
});

// create the model for configurations and expose it to our app
module.exports = mongoose.model('imagemap', imagemapSchema);