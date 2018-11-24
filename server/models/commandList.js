var mongoose = require('mongoose');

// define the schema for our user model
var commandListSchema = mongoose.Schema({

    // mission : String,
    // commands : Object

    mission : {type:String,required:true},
    commands : {type:Object}

}, { collection: 'commandList' });

// create the model for configurations and expose it to our app
module.exports = mongoose.model('commandList', commandListSchema);
