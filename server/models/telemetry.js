// load the things we need
var mongoose = require('mongoose');

// define the schema for our telemetry model
var telemetrySchema = mongoose.Schema({
    mission : String,
    timestamp : Date,
    telemetry : Object
}, { collection: 'telemetry' });

// define index on telemetry collection for fast retrieval of data
telemetrySchema.index({ mission: 1 , timestamp: -1 });

// create the model for users and expose it to our app
module.exports = mongoose.model('Telemetry', telemetrySchema);
