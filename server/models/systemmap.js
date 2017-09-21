var mongoose = require('mongoose');

// define the schema for our systemmaps model
var systemmapSchema = mongoose.Schema({

	imageid : String,
    image : Object,
    mission : String,
    contents : Array

});

// create the model for configurations and expose it to our app
module.exports = mongoose.model('Systemmap', systemmapSchema);