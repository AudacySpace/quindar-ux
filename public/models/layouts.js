// load the things we need
var mongoose = require('mongoose');

// define the schema for our layouts model
var layoutSchema = mongoose.Schema({
    emailaddress         : String,
    grid                 : Array
});

// create the model for layouts and expose it to our app
module.exports = mongoose.model('Layout', layoutSchema);