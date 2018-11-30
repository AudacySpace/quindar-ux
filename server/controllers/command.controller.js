var mongoose = require('mongoose');
var Command = mongoose.model('command');

module.exports = {
    getCommandLog: function(req, res){
        var mission = req.query.mission;

        Command.find( { 'mission' : mission,  'entered' : true, 'locked' : true, 'sent' : true}, function(err, commands) {
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
        newCommand.arguments = command.arguments;
        newCommand.mission = mission;
        newCommand.entered = true;
        newCommand.locked = false;
        newCommand.sent = false;

        newCommand.save(function(err,result) {
            if (err){
                console.log(err);
            }

            if(result){
                res.send(result);
            }
        });
    },

    lockCommand: function(req,res){
        var mission = req.body.mission;

        Command.findOne( { 'mission' : mission, 'entered' : true, 'locked' : false, 'sent' : false }, function(err, command) {
            if(err){
                console.log(err);
            }

            command.locked = true;

            command.save(function(err,result) {
                if (err){
                    console.log(err);
                }

                if(result){
                    res.send(result);
                }
            });
        });
    },

    unlockCommand: function(req,res){
        var mission = req.body.mission;

        Command.findOne( { 'mission' : mission, 'entered' : true, 'locked' : true, 'sent' : false }, function(err, command) {
            if(err){
                console.log(err);
            }

            command.locked = false;

            command.save(function(err,result) {
                if (err){
                    console.log(err);
                }

                if(result){
                    res.send(result);
                }
            });
        });
    },

    sendCommand: function(req,res){
        var mission = req.body.mission;
        var timestamp = req.body.timestamp;

        Command.findOne( { 'mission' : mission, 'entered' : true, 'locked' : true, 'sent' : false }, function(err, command) {
            if(err){
                console.log(err);
            }

            command.sent = true;
            command.sent_timestamp = timestamp.sent_timestamp;
            command.time = timestamp.time;
            command.response = [];
            command.sent_to_satellite = false;

            command.save(function(err,result) {
                if (err){
                    console.log(err);
                }

                if(result){
                    res.send(result);
                }
            });
        });
    },

    getCommand: function(req,res){
        var mission = req.query.mission;

        Command.findOne( { 'mission' : mission, 'entered' : true, 'sent' : false }, function(err, command) {
            if(err){
                console.log(err);
            }

            res.send(command);
        });
    },

    removeCommand: function(req,res){
        var mission = req.body.mission;

        Command.findOne( { 'mission' : mission, 'entered' : true, 'sent' : false }, function(err, command) {
            if(err){
                console.log(err);
            }

            if(command){
                command.remove();
                res.json({'message' : 'Configuration deleted successfully'});
            }
        });
    }

};
