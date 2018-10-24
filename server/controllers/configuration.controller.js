var mongoose = require('mongoose');
var Config = mongoose.model('configuration');

module.exports = {
    getConfiguration: function(req, res){
        var mission = req.query.mission;

        Config.findOne({ 'mission' : mission }, { '_id': 0 }, function(err, config) {
            if(err){
                console.log(err);
            }

            //commented splitting as we receive the QID starting at platform level
            //splice keys to include tree from platform level
            // for (var point in config.contents) {
            //     var nodes = point.split("_").slice(2);
            //     var newPoint = nodes.join("_");
            //     config.contents[newPoint] = config.contents[point];
            //     delete config.contents[point];
            // }

            //create a hierarchial structure to support data menu on UI
            var configuration = convert(config.contents)

            res.send(configuration);
        });
    },
    getMissions: function(req,res){
        Config.find({},{"mission":1, "simulated": 1, "_id": false},function(err,missions){
            if(err){
                console.log(err);
            };
            res.send(missions);
        });
    }

};

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