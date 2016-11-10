var express = require('express');
var request = require("request");
var https = require("https");

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));



app.listen(app.get('port'), function() {
  console.log("Node app is running at port " + app.get('port'))
});


