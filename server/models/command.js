var mongoose = require('mongoose');

// define the schema for our user model
var commandSchema = mongoose.Schema({
    name : {type:String,required:true},
    arguments : {type:String,required:true},
    sent_timestamp : {type:Date,required:false},
    user : {type:String,required:true},
    mission : {type:String,required:true},
    response : {type:Array},
    sent_to_satellite : {type:Boolean,required:false},
    time : {type:String,required:false},
    entered : {type:Boolean,required:true},
    locked : {type:Boolean,required:true},
    sent : {type:Boolean,required:true}
});

// create the model for configurations and expose it to our app
module.exports = mongoose.model('command', commandSchema);
