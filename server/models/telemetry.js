// load the things we need
var mongoose = require('mongoose');

// define the schema for our position model
var telemetrySchema = mongoose.Schema({
    mission : String,
    timestamp : Date,
    telemetry : Object
}, { collection: 'telemetry' });

// create the model for users and expose it to our app
module.exports = mongoose.model('Telemetry', telemetrySchema);