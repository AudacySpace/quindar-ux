

module.exports = function(app, passport) {
        
var mongoose = require('mongoose');

// load up the layouts model
var Layout  = require('./models/layouts');

var Position = require('./models/position');

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
        // console.log(email);
        Layout.findOne({'emailaddress':email},function(err,docs){
            console.log("Layout is " + docs +" "+"grid is"+ docs.grid);
            res.send(docs.grid);
        });
    })
  
  //Save Layout to layouts collection of Quindar database
    app.post('/savelayout',function(req,res){
        var email = req.body.emailaddress;
        var gridarray = req.body.grid;
        console.log(req.body.emailaddress);
        Layout.findOne({ 'emailaddress' : email }, function(err, layout) {
            console.log("Layout is " + layout +" " + gridarray);
            if (err)
            console.log("Error saving in DB: " + err);

            if (layout) {
                layout.grid = gridarray;

                layout.save(function(err) {
                    if (err) throw err;
                    console.log("Layout data updated successfully for " + email);
                });                       
            } 
            else {
                var newLayout = new Layout();
                newLayout.grid = gridarray;
                newLayout.emailaddress = email;
                newLayout.save(function(err){
                    if (err) console.log(err);
                    console.log("Data saved");
                })
            }
        });
    });


    // Add Table Text Widget
    app.get('/addtablewidget',function(req,res){
        //Query to get the latest document from the position collection
            Position.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, post) {
               // console.log( post );
                res.send(post);
            });
    });

    //End of Add Table Text Widget
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log("loggedddd");
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

