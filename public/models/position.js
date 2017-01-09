// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var positionSchema = mongoose.Schema({

    timestamp : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Date,
        warn_low: Date,
        value: Date,
        warn_high: Date,
        alarm_high: Date,
        units: String
    },
    vehicleId : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: String,
        warn_low: String,
        value: String,
        warn_high: String,
        alarm_high: String,
        units: String
    }, 
    vx : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    }, 
    vy : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    }, 
    vz : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    }, 
    x : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    }, 
    y : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    }, 
    z : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    },
    r : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    },
    v : {
    	notes: String,
        category: String,
        name: String,
        alarm_low: Number,
        warn_low: Number,
        value: Number,
        warn_high: Number,
        alarm_high: Number,
        units: String
    }

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Position', positionSchema);