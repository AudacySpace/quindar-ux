var mongoose = require('mongoose');
var Imagemap = mongoose.model('imagemap');

module.exports = {
  getMaps: function(req, res){
        var mission =  req.query.mission;
        var allMaps = [];
        Imagemap.findOne({'mission':mission}, function(err, mapdata) {
            if (err) {
                console.log("Error finding map data in DB: " + err);
                // throw err;
            }
            if(mapdata){
                for(var i=0;i<mapdata.uploadedfiles.length;i++){
                    allMaps.push(mapdata.uploadedfiles[i]);
                }
                res.send(allMaps);
            }
        });
    }
};
