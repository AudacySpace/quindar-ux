var mongoose = require('mongoose');

// define the schema for our user model
var commandSchema = mongoose.Schema({

    // name : String,
    // argument : String,
    // timestamp : Date,
    // user : String,
    // mission : String,
    // response : String,
    // sent_to_satellite : Boolean,
    // time : String,
    // type : String

    name : {type:String,required:false},
    argument : {type:String,required:false},
    timestamp : {type:Date,required:false},
    user : {type:String,required:false},
    mission : {type:String,required:false},
    response : {type:String,required:false},
    sent_to_satellite : {type:Boolean,required:false},
    time : {type:String,required:false},
    type : {type:String,required:false}

});

// create the model for configurations and expose it to our app
module.exports = mongoose.model('command', commandSchema);
