var mongoose = require('mongoose');

// define the schema for our user model
var commandSchema = mongoose.Schema({

    name : String,
    argument : String,
    timestamp : Date,
    user : String,
    mission : String,
    response : String,
    sent_to_satellite : Boolean,
    time : String

});

// create the model for configurations and expose it to our app
module.exports = mongoose.model('command', commandSchema);
