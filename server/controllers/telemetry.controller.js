var mongoose = require('mongoose');
var Telemetry = mongoose.model('Telemetry');

module.exports = {
  getTelemetry: function(req, res){
        var mission = req.query.mission;

        // if(mission) {
        //     Telemetry.find( 
        //         {'mission' : mission }, 
        //         {}, 
        //         { sort: { 'timestamp' : -1 , 'beaconID': 1 }, limit: 2},
        //         function(err, telemetry) {
        //             if(err){
        //                 console.log(err);
        //             };

        //             console.log(telemetry)
        //             //res.send(telemetry);
        //         }
        //     );
        // }

        if(mission) {
            Telemetry.aggregate([
                { $match: { 'mission': mission } },
                { $sort: { 'timestamp': -1 } },
                { $limit: 100 },
                { $group:
                    {
                        _id : "$beaconID",
                        telemetry: { $first : "$$ROOT" }
                    }
                },
                { $project:
                    {
                        _id : "$telemetry._id",
                        beaconID : "$_id",
                        timestamp : "$telemetry.timestamp",
                        telemetry: "$telemetry.telemetry",
                    }
                }
            ], function(err, telemetry) {
                    if(err){
                        console.log(err);
                    };

                    res.send(telemetry);
                }
            );
        }
    }
};