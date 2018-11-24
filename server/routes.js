module.exports = function(app, passport) {
        
var mongoose = require('mongoose');

var User = require('./models/user');

var Telemetry = require('./models/telemetry');

var Config = require('./models/configuration');

var ProxyStatus = require('./models/proxystatus');

var configRole = require('./config/role');

var StatusBoard = require('./models/statusboard');

var Imagemap = require('./models/imagemap');

var Command = require('./models/command');

var CommandList = require('./models/commandList');

var Timeline = require('./models/timeline');

var imaps = require('./controllers/imagemap.controller');

var layoutops = require('./controllers/dashboardlayout.controller');

var clist = require('./controllers/commandList.controller');

var pstatus = require('./controllers/proxystatus.controller');

var cmd = require('./controllers/command.controller');

var sboard = require('./controllers/statusboard.controller');

var cfg = require('./controllers/configuration.controller');

var tm = require('./controllers/telemetry.controller');

var tl = require('./controllers/timeline.controller');

var usr = require('./controllers/usermgmt.controller');


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
    app.get('/loadLayout',layoutops.getLayouts);
  
    //Save Layout to User collection of Quindar database
    app.post('/saveLayout',layoutops.postLayout);

    //Get telemetry data for the mission passed as a parameter
    app.get('/getTelemetry',tm.getTelemetry);

    //Get Configuration contents for the source name passed as a parameter
    app.get('/getConfig',cfg.getConfiguration);

    //Get Proxy Status
    app.get('/getProxyStatus',pstatus.getCurrentStatus);

    //set user's current role in the database
    app.post('/setUserRole',usr.postRole);

    //Get Users list
    app.get('/getUsers',usr.getUsers);

    //get roles configured in server code
    app.get('/getRoles', usr.getRoles);

    //set user's allowed roles in the database
    app.post('/setAllowedRoles',usr.postAllowedRoles);

    //get current role of the user 
    app.get('/getCurrentRole', usr.getCurrentRole);

    //get allowed roles of the user getAllowedRoles
    app.get('/getAllowedRoles', usr.getAllowedRoles);

    //Get all existing Missions
    app.get('/getMissions',cfg.getMissions);

    //Save Alerts
    app.post('/saveAlerts',sboard.postAlerts);

    //Load Alerts
    app.get('/loadAlerts',sboard.getAlerts);

    //Get systemmaps list 
    app.get('/loadSystemMaps',imaps.getMaps);

    //set user's mission property and roles(if needed). 
    app.post('/setMissionForUser',usr.postMissionForUser);

    //save command in the database
    app.post('/saveCommand',cmd.postCommand);

    //get the command log for a particular mission
    app.get('/getCommandLog',cmd.getCommandLog);

    //get the command list for a particular mission
    app.get('/getCommandList',clist.getCommandList);

    //Get timeline list
    app.get('/loadTimelineEvents',tl.getTimelineEvents);

};
   
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log("loggedddd");
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
