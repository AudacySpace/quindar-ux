var mongoose = require('mongoose');
var Command = mongoose.model('command');

module.exports = {
    getCommandLog: function(req, res){
        var mission = req.query.mission;

        Command.find( { 'mission' : mission }, function(err, commands) {
            if(err){ 
                console.log(err);
            }

            res.send(commands);
        });
    },
    postCommand: function(req,res){
        var email = req.body.email;
        var command = req.body.command;
        var mission = req.body.mission;

        var newCommand = new Command();
        
        newCommand.user = email;
        newCommand.name = command.name;
        newCommand.type = command.type;
        newCommand.argument = command.argument;
        newCommand.timestamp = command.timestamp;
        newCommand.time = command.time;
        newCommand.mission = mission;
        newCommand.response = "";
        newCommand.sent_to_satellite = false;

        newCommand.save(function(err) {
            if (err) throw err;

            res.send(newCommand);
        });
    }

};
