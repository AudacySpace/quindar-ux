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

    name : {type:String,required:true},
    argument : {type:String,required:true},
    timestamp : {type:Date,required:true},
    user : {type:String,required:true},
    mission : {type:String,required:true},
    response : {type:String,required:false},
    sent_to_satellite : {type:Boolean,required:true},
    time : {type:String,required:true},
    type : {type:String,required:true}

});

// create the model for configurations and expose it to our app
module.exports = mongoose.model('command', commandSchema);
