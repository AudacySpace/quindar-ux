module.exports = function(app, passport) {
        
var mongoose = require('mongoose');

var User = require('./models/user');

var Telemetry = require('./models/telemetry');

var Config = require('./models/configuration');

var ProxyStatus = require('./models/proxystatus');

var configRole = require('./config/role');

var StatusBoard = require('./models/statusboard');

var Imagemap = require('./models/imagemap');

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('login.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // DASHBOARD SECTION =========================
    app.get('/dashboard', isLoggedIn, function(req, res) {
        
        res.render('dashboard.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/dashboard',
            failureRedirect : '/'
        }));

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/dashboard',
            failureRedirect : '/'
        }));

    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/dashboard');
        });
    });


    // -------------------Save and Load Grid Layout ---------------------------------

    //Load Layout from User collection of Quindar database
    app.get('/loadLayout', function(req,res){
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
    });
  
    //Save Layout to User collection of Quindar database
    app.post('/saveLayout',function(req,res){
        var email = req.body.email;
        var dashboard = req.body.dashboard;
        var count = 0;

        //Insert the layout into the user collection
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            //Check if there are layouts stored
            if(user.grid.length != 0){
                for(var i=0; i<user.grid.length; i++){
                    if(dashboard.name == user.grid[i].name){
                        user.grid[i] = dashboard;
                        count ++;
                    }
                }
                //If the new name does not exist in the layout, push the new layout
                if(count == 0){
                    user.grid.push(dashboard);
                }
            } else {
                user.grid.push(dashboard);
            }
            user.markModified('grid');
            user.save(function(err) {
                if (err) throw err;
                
                res.send(user);
            });
        });

    });

    //Get telemetry data for the mission passed as a parameter
    app.get('/getTelemetry', function(req, res){
        var mission = req.query.mission;

        if(mission) {
            Telemetry.findOne( 
                {'mission' : mission }, 
                {}, 
                { sort: { 'timestamp' : -1 }},
                function(err, telemetry) {
                    if(err) throw err;

                    res.send(telemetry);
                }
            );
        }
    });

    //Get Configuration contents for the source name passed as a parameter
    app.get('/getConfig', function(req, res){
        var mission = req.query.mission;

        Config.findOne({ 'mission' : mission }, { '_id': 0 }, function(err, config) {
            if(err){
                console.log(err);
            }

            //splice keys to include tree from platform level
            for (var point in config.contents) {
                var nodes = point.split("_").slice(2);
                var newPoint = nodes.join("_");
                config.contents[newPoint] = config.contents[point];
                delete config.contents[point];
            }

            //create a hierarchial structure to support data menu on UI
            var configuration = convert(config.contents)

            res.send(configuration);
        });
    });

    //Get Proxy Status
    app.get('/getProxyStatus', function(req, res){
        ProxyStatus.findOne({},{ '_id': 0 ,'__v':0}).sort({_id:-1}).exec(function(err,doc){
            if(err){
                console.log(err);
            }
            res.send(doc);
        });
    }); 

    //set user's current role in the database
    app.post('/setUserRole',function(req,res){
        var email = req.body.email;
        var role = req.body.role;

        //update the current role of the user
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            user.currentRole = role;

            user.save(function(err) {
                if (err) throw err;

                res.send(user);
            });
        });

    });

    //Get Users list
    app.get('/getUsers', function(req, res){
        var mission = req.query.mission;
        var allUsers = [];

        User.find( { 'mission' : mission }, { google : 1, allowedRoles : 1, currentRole : 1 }, function(err, users) {
            if(err){ 
                console.log(err);
            }

            for(var i=0; i<users.length; i++){
                allUsers[i] = new Object();
                allUsers[i].google = users[i].google;
                allUsers[i].currentRole = users[i].currentRole;
                var aRoles = {};

                var roles = users[i].allowedRoles;

                for(var j=0; j<roles.length; j++){
                    aRoles[roles[j].callsign] = 1;
                }
                allUsers[i].allowedRoles = aRoles;
            }

            res.send(allUsers);
        });
    });

    //get roles configured in server code
    app.get('/getRoles', function(req,res){
        res.send(configRole);
    });

    //set user's allowed roles in the database
    app.post('/setAllowedRoles',function(req,res){
        var email = req.body.email;
        var roles = req.body.roles;

        //update allowed roles of the user
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            user.allowedRoles = roles;

            user.save(function(err) {
                if (err) throw err;
                res.send(user);
            });
        });

    });

    //get current role of the user
    app.get('/getCurrentRole', function(req,res){
        var email = req.query.email;

        //update the current role of the user
        User.findOne({ 'google.email' : email }, { currentRole : 1 }, function(err, user) {
            if(err){
                console.log(err);
            }

            res.send(user.currentRole);
        });
    });

    //get allowed roles of the user
    app.get('/getAllowedRoles', function(req,res){
        var email = req.query.email;

        //update allowed roles of the user
        User.findOne({ 'google.email' : email }, { allowedRoles : 1 }, function(err, user) {
            if(err){
                console.log(err);
            }

            res.send(user.allowedRoles);
        });
    });

    //Get all existing Missions
    app.get('/getMissions', function(req, res){
        Config.find({},{"mission":1,"_id": false},function(err,missions){
            if(err) throw err;
            res.send(missions);
        });
    });

    //Save Alerts
    app.post('/saveAlerts',function(req,res){

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
    });

    //Load Alerts
    app.get('/loadAlerts', function(req, res){

        var mission = req.query.missionname;

        //Load the alerts and vehicles from the statusboard collection
        StatusBoard.findOne({ 'mission' : mission }, 
            { statusboard : 1, vehiclecolors : 1, _id : 0}, function(err, status) {

                if(err){
                    console.log(err);
                }

                res.send(status);
            });
    });

     //Get systemmaps list
    app.get('/loadSystemMaps', function(req, res){
        var mission =  req.query.mission;
        var allMaps = [];

        Imagemap.findOne({'mission':mission}, function(err, mapdata) {
            if (err) {
                console.log("Error finding map data in DB: " + err);
                throw err;
            }
            if(mapdata){
                for(var i=0;i<mapdata.uploadedfiles.length;i++){
                    allMaps.push(mapdata.uploadedfiles[i]);
                }
                res.send(allMaps);
            }
        });
    });

    //set user's mission property and roles(if needed)
    app.post('/setMissionForUser',function(req,res){
        var email = req.body.email;
        var mission = req.body.mission;

        //count the number of users for this mission
        User.count({ 'mission' : mission }, function(err, count) {
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

                    user.currentRole = userRole;
                    user.allowedRoles.push(userRole);
                }
                user.mission = mission;

                user.save(function(err) {
                    if (err) throw err;
                    res.send(user);
                });
            });
        });
    });

};
   
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log("loggedddd");
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

//Function to convert flat structure object to hierarchial structure
function convert(obj) {
    var result = {};
    eachKeyValue(obj, function(namespace, value) {
        var parts = namespace.split("_");
        var last = parts.pop();
        var node = result;
        parts.forEach(function(key) {
            node = node[key] = node[key] || {};
        });
        node[last] = '';
    });
    return result;
}

function eachKeyValue(obj, fun) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            fun(i, obj[i]);
        }
    }
}

function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}
