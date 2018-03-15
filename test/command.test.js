var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var CMD = require('../server/models/command');
var proxyquire = require('proxyquire');

describe('Test Suite for Command Route Controller New Instance', function() {
    beforeEach(function() {
        sinon.stub(CMD.prototype, 'save');
    });
 
 
    afterEach(function() {
        CMD.prototype.save.restore();
    });
 
    it('should post command', function() {
        command = require('../server/controllers/command.controller');
        CMD.prototype.save.yields(null,{"data":"100","status":200});
               var req = {
            body : {
                mission:'Azero',
                command: {
                    "mission": "AZero",
                    "time": "040.13:09:17 UTC",
                    "timestamp": "2018-02-09T13:09:17.471Z",
                    "argument": "earth",
                    "type": "Set",
                    "name": "pointing"
                },
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        command.postCommand(req, res);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send, {"data":"100","status":200});
    });

    it('should not post command if there is any error', function() {
        command = require('../server/controllers/command.controller');
        var error = {name:"MongoError"};
        var output = {"status":400}
        CMD.prototype.save.yields(error,output);
               var req = {
            body : {
                mission:'Azero',
                command: {
                    "mission": "AZero",
                    "time": "040.13:09:17 UTC",
                    "timestamp": "2018-02-09T13:09:17.471Z",
                    "argument": "earth",
                    "type": "Set",
                    "name": "pointing"
                },
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        command.postCommand(req, res);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });
});


describe('Test Suite for Command Route Controller', function() {
    var cmdmodule,mongooseStub,mongooseStubErr,cmodule,cmdErrmodule;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    find: function(query, callback) {
                        var list = {
                            "data":{
                                "_id": "5a86044641ecd2166aeace46",
                                "sent_to_satellite": true,
                                "response": "success",
                                "mission": "AZero",
                                "time": "040.13:09:17 UTC",
                                "timestamp": "2018-02-09T13:09:17.471Z",
                                "argument": "earth",
                                "type": "Set",
                                "name": "pointing",
                                "user": "tgattu@gmail.com",
                            },
                            "status":200
                        }
                    var err;
                    callback(err,list); 
                    }
                };
            } 
        };
        cmdmodule = proxyquire('../server/controllers/command.controller', {'mongoose': mongooseStub});

        mongooseStubErr = {
            model: function() {
                return {
                    find: function(query, callback) {
                        var list = {
                            "status":400
                        }
                        var err = {"name":"MongoError"};
                        callback(err,list); 
                    }, 
                };
            } 
        };

        cmdErrmodule = proxyquire('../server/controllers/command.controller', {'mongoose': mongooseStubErr});

    });

    it("should get command log", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {
                "data":{
                    "_id": "5a86044641ecd2166aeace46",
                    "sent_to_satellite": true,
                    "response": "success",
                    "mission": "AZero",
                    "time": "040.13:09:17 UTC",
                    "timestamp": "2018-02-09T13:09:17.471Z",
                    "argument": "earth",
                    "type": "Set",
                    "name": "pointing",
                    "user": "tgattu@gmail.com",
                },
                "status":200
            }
    
        var spy = chai.spy.on(cmdmodule, 'getCommandLog');
        cmdmodule.getCommandLog(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should get not get command log on error and return 400 status", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var erroutput = {"status":400};
    
        var spy = chai.spy.on(cmdErrmodule, 'getCommandLog');
        cmdErrmodule.getCommandLog(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,erroutput);
    });

});

describe('Test Suite for Command Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new CMD();
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            expect(err.errors.argument).to.exist;
            expect(err.errors.timestamp).to.exist;
            expect(err.errors.user).to.exist;
            expect(err.errors.mission).to.exist;
            // expect(err.errors.response).to.exist;
            expect(err.errors.sent_to_satellite).to.exist;
            expect(err.errors.time).to.exist;
            expect(err.errors.type).to.exist;
        });
    });

    it('should validate if all of the properties are defined with valid data types', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            assert.isUndefined(err);
        });  
    });

    it('should invalidate if name is not defined', function() {
        var m = new CMD({
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.name).to.exist;
            expect(err.errors.name.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if timestamp is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.timestamp).to.exist;
            expect(err.errors.timestamp.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if argument is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.argument).to.exist;
            expect(err.errors.argument.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if user is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.user).to.exist;
            expect(err.errors.user.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if mission is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).toEqual('ValidatorError');
        });  
    });

    it('should validate if response is empty as required is false', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            assert.isUndefined(err);
        });  
    });

    it('should invalidate if sent_to_satellite is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.sent_to_satellite).to.exist;
            expect(err.errors.sent_to_satellite.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if time is not a defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.time).to.exist;
            expect(err.errors.time.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if type is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC'
        });
        m.validate(function(err){
            expect(err.errors.type).to.exist;
            expect(err.errors.type.name).toEqual('ValidatorError');
        });  
    });

});