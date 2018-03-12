var mongoose = require('mongoose');
var Timeline = mongoose.model('timeline');

module.exports = {
  getTimelineEvents: function(req, res){
        var mission =  req.query.mission;
        var allEvents = [];

        Timeline.findOne({'mission':mission}, function(err, timelinedata) {
            if (err) {
                console.log("Error finding map data in DB: " + err);
                throw err;
            }
            if(timelinedata){
                for(var i=0;i<timelinedata.events.length;i++){
                    allEvents.push(timelinedata.events[i]);
                }
                res.send(allEvents);
            }
        });
    }
};