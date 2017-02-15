module.exports = function(app, passport) {
        
var mongoose = require('mongoose');

var User = require('./models/user');

var Telemetry = require('./models/telemetry');

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

    //Load Layout from layouts collection of Quindar database
    app.get('/loadlayout', function(req,res){
        var email = req.query.emailaddress;

        //----------------load from user table------------------------------------

          User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }
            res.send(user.grid);

        });
    });
  
  //Save Layout to layouts collection of Quindar database
    app.post('/savelayout',function(req,res){
        var email = req.body.emailaddress;
        var gridarray = req.body.grid;
        console.log(req.body.emailaddress);

        //Insert the grid layout into the user table

        User.findOne({ 'google.email' : email }, function(err, user) {
            if(err){
                console.log(err);
            }
            user.grid = gridarray;
            user.save(function(err) {
                if (err) throw err;
                    console.log("Layout data updated successfully for " + email);
                }); 

        });

    });

    //Get telemetry data for the array of vehicles passed as a parameter
    app.get('/getTelemetry', function(req, res){
        var vehicles = req.query.vehicles;
        var telemetry = {};

        if(vehicles) {
            Telemetry.find( 
                {'vehicleId.value' : { $in: vehicles} }, 
                {}, 
                { sort: { '_id' : -1 }, limit : vehicles.length },
                function(err, result) {
                    if(err) throw err;

                    for(var i=0; i<result.length; i++) {
                        telemetry[result[i].vehicleId.value] = result[i];
                    }
                    res.send(telemetry);
                }
            );
        }
    });

    //get data for table text widget
    app.get('/addtablewidget',function(req,res){
        //Query to get the latest document from the position collection
        Telemetry.findOne({'vehicleId.value':'Audacy1'}, {}, { sort: { '_id' : -1 } }, function(err, post) {
           if(err) throw err;
            res.send(post);
        });
    });

    //get data for ground track widget
    app.get('/getposition',function(req,res){
        Telemetry.find({'vehicleId.value':'Audacy1'},{},{sort:{'_id':-1},limit:1},function(e,docs){
            res.send(docs);
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
