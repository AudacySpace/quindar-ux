var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
    postLayout: function(req, res){
        var email = req.body.email;
        var dashboard = req.body.dashboard;
        var missionname = req.body.missionname;
        var count = 0;

        //Insert the layout into the user collection
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            if(user.grid.length != 0){
                for(var i=0; i<user.grid.length; i++){
                    if(dashboard.name === user.grid[i].name && dashboard.mission.missionName === user.grid[i].mission.missionName){
                        user.grid[i] = dashboard;
                        count ++;
                    }
                }
                if(count == 0){
                    user.grid.push(dashboard);
                }
            } else {
                user.grid.push(dashboard);
            }
            user.markModified('grid');
            user.save(function(err,result) {
                if (err){console.log(err)};
                res.send(result);
            });
        });
    },
    getLayouts: function(req,res){
        var email = req.query.email;
        var missionname = req.query.missionname;

        //Load the layout from the User collection
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }
            var missionLayouts = [];

            for(var i=0;i<user.grid.length;i++){
                if(user.grid[i].mission){
                    if(user.grid[i].mission.missionName === missionname){
                        missionLayouts.push(user.grid[i]);
                    }
                }
            }
            res.send(missionLayouts);
        });
    }
};

