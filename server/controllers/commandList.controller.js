var mongoose = require('mongoose');
var CommandList = mongoose.model('commandList');

module.exports = {
  getCommandList: function(req, res){
        var mission = req.query.mission;

        CommandList.findOne( { 'mission' : mission }, function(err, list) {
            if(err){ 
                console.log(err);
            }

            if(list) {
                res.send(list.commands);
            }
        });
    }
};
