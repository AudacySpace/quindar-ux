var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./server/config/database.js');

var fs = require('fs-extra');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app'));

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url, {useMongoClient : true}); // connect to our database

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open\n');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err + '\n');
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

require('./server/config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ilovequindar', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./server/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(app.get('port'), function() {
  console.log("Node app is running at port " + app.get('port'));
});

function copyFile(src, dest){
    if(!fs.existsSync(dest)){
        fs.copy(src, dest, function (err) {
            if (err) return console.error(err);

            console.log('Success!');
        });
    } else {
        var newFile = fs.readFileSync(src);
        var oldFile = fs.readFileSync(dest);

        if(newFile.toString() !== oldFile.toString()) {
            fs.copy(src, dest, function (err) {
                if (err) return console.error(err);

                console.log('Success!');
            });
        }
    }
}

copyFile('./README.md', './app/doc/read.md');
copyFile('./CONTRIBUTING.md', './app/doc/contribute.md');



