var mongoose = require('mongoose');
var User = mongoose.model('User');
var configRole = require('../config/role');

module.exports = {
  	postRole: function(req, res){
        var email = req.body.email;
        var role = req.body.role;
        var mission = req.body.mission;

        //update the current role of the user
        User.findOne({ 'google.email' : email, 'missions.name' : mission }, function(err, user) {
            if(err){
                console.log(err);
            }

            for(var i=0; i<user.missions.length; i++) {
                if(user.missions[i].name === mission) {
                    user.missions[i].currentRole = role;
                }
            }

            user.markModified('missions');
            user.save(function(err,result) {
                if (err){
                	console.log(err);
                };
                res.send(result);
            });
        });
     },
     getUsers: function(req,res){
     	var mission = req.query.mission;
        var allUsers = [];

        User.find( { 'missions.name' : mission }, { 'google' : 1, 'missions.$' : 1 }, function(err, users) {
            if(err){ 
                console.log(err);
            }

            for(var i=0; i<users.length; i++){
                allUsers[i] = new Object();
                allUsers[i].google = users[i].google;
                allUsers[i].currentRole = users[i].missions[0].currentRole;
                var aRoles = {};

                var roles = users[i].missions[0].allowedRoles;

                for(var j=0; j<roles.length; j++){
                    aRoles[roles[j].callsign] = 1;
                }
                allUsers[i].allowedRoles = aRoles;
            }

            res.send(allUsers);
        });
     },
     getRoles: function(req,res){
     	 res.send(configRole);
     },
     postAllowedRoles: function(req,res){
     	var email = req.body.email;
        var roles = req.body.roles;
        var mission = req.body.mission;

        //update allowed roles of the user
        User.findOne({ 'google.email' : email, 'missions.name' : mission }, function(err, user) {
            if(err){
                console.log(err);
            }

            for(var i=0; i<user.missions.length; i++) {
                if(user.missions[i].name === mission) {
                    user.missions[i].allowedRoles = roles;
                }
            }

            user.markModified('missions');

            user.save(function(err,result) {
                if (err){
                	console.log(err);
                }	
                res.send(result);
            });
        });

     },
     getCurrentRole:function(req,res){
     	var email = req.query.email;
        var mission = req.query.mission;

        //update the current role of the user
        User.findOne({ 'google.email' : email, 'missions.name' : mission }, { 'missions.$' : 1 }, function(err, user) {
            if(err){
                console.log(err);
            }

            res.send(user.missions[0].currentRole);
        });
     },
     getAllowedRoles:function(req,res){
     	var email = req.query.email;
        var mission = req.query.mission;

        //update allowed roles of the user
        User.findOne({ 'google.email' : email, 'missions.name' : mission }, { 'missions.$' : 1 }, function(err, user) {
            if(err){
                console.log(err);
            }

            res.send(user.missions[0].allowedRoles);
        });
     },
     postMissionForUser:function(req,res){
     	var email = req.body.email;
        var mission = req.body.mission;
        var defaultRole = {
            'name'     : configRole.roles['VIP'].name,
            'callsign' : configRole.roles['VIP'].callsign
        };
        var missionCount = 0;
        var missionObj;

        //count the number of users for this mission
        User.count({ 'missions.name' : mission }, function(err, count) {
            if(err){
                console.log(err);
            }

            User.findOne({ 'google.email' : email }, function(err, user) {
                if(err){
                    console.log(err);
                }

                //If zero users for this mission, then assign user as Mission Director
                if(count == 0){
                    var userRole = {
                        'name'     : configRole.roles['MD'].name,
                        'callsign' : configRole.roles['MD'].callsign
                    };
                    missionObj =  {
                        'name' : mission,
                        'currentRole' : userRole,
                        'allowedRoles' : [],
                        'online' : true
                    };
                    missionObj.allowedRoles.push(defaultRole);
                    missionObj.allowedRoles.push(userRole);

                    user.missions.push(missionObj);
                } else {
                    //check if the mission exists in the user's mission list
                    for(var i=0; i<user.missions.length; i++){
                        if(user.missions[i].name === mission){
                            if(!containsObject(user.missions[i].currentRole, user.missions[i].allowedRoles)){
                                //update current role to default role if current role is not a part of allowed roles
                                user.missions[i].currentRole = defaultRole;
                            }
                            user.missions[i].online = true;
                            missionObj = user.missions[i];
                            missionCount++;
                        }
                    }

                    //If mission does not exist for this user, assign Observer role
                    if(missionCount == 0) {
                        missionObj =  {
                            'name' : mission,
                            'currentRole' : defaultRole,
                            'allowedRoles' : [],
                            'online' : true
                        };

                        missionObj.allowedRoles.push(defaultRole);

                        user.missions.push(missionObj);
                    }
                }

                user.markModified('missions');

                user.save(function(err) {
                    if (err) {
                    	console.log(err)
                    };
                    res.send(missionObj);
                });
            });
        });
    },

    setUserOffline : function(req,res){
        var email = req.body.email;
        var mission = req.body.mission;

        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            for(var i=0; i<user.missions.length; i++){
                if(user.missions[i].name === mission.missionName){
                    user.missions[i].online = false;
                }
            }

            user.markModified('missions');

            user.save(function(err) {
                if (err) {
                    console.log(err)
                };
                res.send(user);
            });
        });
    },

    getOnlineUsers : function(req,res){
        var mission = req.query.mission;
        var userList = [];

        User.find( { 'missions.name' : mission }, { 'google' : 1 , 'missions.$' : 1 }, function(err, users) {
            if(err){
                console.log(err);
            }

            for(var i=0; i<users.length; i++){
                if(users[i].missions[0].online){
                    userList.push(users[i]);
                }
            }

            res.send(userList);
        });
    }

};

//Check if an array list contains an object
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (isEquivalent(list[i], obj)) {
            return true;
        }
    }

    return false;
}

//Equality of Objects
function isEquivalent(a, b) {
    // Create arrays of property names
    var propA = Object.getOwnPropertyNames(a);
    var propB = Object.getOwnPropertyNames(b);

    // If number of properties are different
    if (propA.length != propB.length) {
        return false;
    }

    for (var i = 0; i < propA.length; i++) {
        var property = propA[i];

        // check values of same property
        if (a[property] !== b[property]) {
            return false;
        }
    }

    return true;
}