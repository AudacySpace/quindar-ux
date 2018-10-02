var mongoose = require('mongoose');
var StatusBoard = mongoose.model('StatusBoard');

module.exports = {
    getAlerts: function(req, res){
        var mission = req.query.missionname;
        
        //Load the alerts and vehicles from the statusboard collection
        StatusBoard.findOne({ 'mission' : mission }, 
            { statusboard : 1, vehiclecolors : 1, _id : 0}, function(err, status) {

                if(err){
                    console.log(err);
                }
                res.json(status);
            });
    },
    postAlerts: function(req,res){
        //Save logic
        //If no ack for a channel update
        //If ack for a channel push that;

        var mission = req.body.missionname;
        var statusdata = req.body.statusdata;
        var vehiclecolors = req.body.vehicleColors;

        StatusBoard.findOne({'mission':mission}, function(err, status) {
            if (err)
                console.log("Error finding alerts in DB: " + err);

            if (status) {
                status.mission = mission;
                status.vehiclecolors = vehiclecolors;

                //Save alerts to the database
                for(j=0;j<statusdata.length;j++){
                    for(var i=0;i<status.statusboard.length;i++){
                        if(status.statusboard[i].channel === statusdata[j].channel &&
                            status.statusboard[i].alert === statusdata[j].alert &&
                                status.statusboard[i].bound === statusdata[j].bound &&
                                    status.statusboard[i].ack ===  statusdata[j].ack) {
                            
                            if(status.statusboard[i].ack === ""){
                                status.statusboard[i] = Object.assign({}, statusdata[j]); 
                            } else {
                                status.statusboard[i].time = statusdata[j].time;
                                status.statusboard[i].timestamp = statusdata[j].timestamp;
                            }
                        }
                        else {
                            status.statusboard.push(statusdata[j]);
                        }
                    }
                }

                status.statusboard  = uniqBy(status.statusboard,JSON.stringify);

                status.markModified('statusboard');
                status.markModified('vehiclecolors');

                status.save(function(err,result){
                    if(err){
                        console.log(err);
                    }
                    if(result){
                        res.json(result);
                    }
                });
            }else {
                //create a new document if not document exists
                var statusTable = new StatusBoard();
                statusTable.mission =  mission;
                statusTable.vehiclecolors = vehiclecolors;
                statusTable.statusboard = [];
                for(var k=0;k<statusdata.length;k++){
                    statusTable.statusboard.push(statusdata[k]);
                }
                //statusTable.statusboard = statusdata;
                statusTable.save(function(err,result){
                    if(err){
                        console.log(err);
                    }
                    if(result){
                        res.json(result);
                    }
                });
            }
        });
    }

};

function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}
