var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use('/public', express.static('public'))

app.get('/', function(request, response) {
	response.writeHead(301, {location: '/public/html/login.html'});
	response.end();
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at port " + app.get('port'))
})
