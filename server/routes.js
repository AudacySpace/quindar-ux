module.exports = function(app, passport) {
        
var mongoose = require('mongoose');

var User = require('./models/user');

var Telemetry = require('./models/telemetry');

var Config = require('./models/configuration');

var ProxyStatus = require('./models/proxystatus');

var configRole = require('./config/role');

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

        //Load the layout from the User collection
        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }

            res.send(user.grid);
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
        var allUsers = [];

        User.find( {}, { google : 1, allowedRoles : 1, currentRole : 1 }, function(err, users) {
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

    //Get All existing Missions
    app.get('/getMissions', function(req, res){
        Config.find({ mission: { $exists: true } },
                function(err, missions) {
                    var allMissions = [];
                    if(err) throw err;
                    for(var i=0;i<missions.length;i++){
                        allMissions.push(missions[i].mission);
                    }

                    res.send(allMissions);
                }
            );
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
