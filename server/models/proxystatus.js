var mongoose = require('mongoose');
// mongoose.Promise = require('bluebird'); //Added this for mocha testing

// define the schema for our user model
var proxyStatusSchema = mongoose.Schema({
	// proxytimestamp : Number
	proxytimestamp : {type: Number,required: true}
});

// create the model for proxystatus and expose it to our app
module.exports = mongoose.model('status', proxyStatusSchema);