var mongoose = require('mongoose');

// define the schema for our user model
var commandSchema = mongoose.Schema({
    name : {type:String,required:true},
    arguments : {type:String,required:true},
    sent_timestamp : {type:Date,required:true},
    user : {type:String,required:true},
    mission : {type:String,required:true},
    response : {type:Array},
    sent_to_satellite : {type:Boolean,required:true},
    time : {type:String,required:true}
});

// create the model for configurations and expose it to our app
module.exports = mongoose.model('command', commandSchema);
