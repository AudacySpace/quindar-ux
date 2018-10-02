var mongoose = require('mongoose');
var Telemetry = mongoose.model('Telemetry');

module.exports = {
  getTelemetry: function(req, res){
        var mission = req.query.mission;

        if(mission) {
            Telemetry.findOne( 
                {'mission' : mission }, 
                {}, 
                { sort: { 'timestamp' : -1 } },
                function(err, telemetry) {
                    if(err){
                        console.log(err);
                    };

                    // res.send(telemetry);
                    res.json(telemetry);
                }
            );
        }
    }
};