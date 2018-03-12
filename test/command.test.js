var request = require('superagent');
var should = require('should');
var agent = request.agent();
var host = 'http://localhost';
var chai = require("chai");
var spies = require('chai-spies');

chai.use(spies);
var chaiAsPromised = require("chai-as-promised");
var sinon = require('sinon');
var mongoose = require('mongoose');
var passport = require('passport');
mongoose.Promise = global.Promise;
chai.use(chaiAsPromised);

// // Then either:
var expect = chai.expect;
// or:
var assert = chai.assert;

var PStatus = require('../server/models/proxystatus');
var IMap = require('../server/models/imagemap');
var SBoard = require('../server/models/statusboard');
var CList = require('../server/models/commandList');
var TM = require('../server/models/telemetry');
var CMD = require('../server/models/command');
var CFG = require('../server/models/configuration');
var TL = require('../server/models/timeline');
// var Usr = require('../server/models/user');

var routes = require('../server/routes');

var proxyquire = require('proxyquire');


describe('Test Suite for Command Route Controller', function() {
    var cmdmodule,mongooseStub,cmodule;
    var ispy;
 
    before(function() {
        var 
        mongooseStub = {
            model: function() {
                return {
                    find: function(query, callback) {
                        var list = {commands:{}};
                        var err;
                        callback(err,list); 
                    }, 
                    user: "",
                    name:"",
                    type:"",
                    argument:"",
                    timestamp:"",
                    time:"",
                    mission:"",
                    response:"",
                    sent_to_satellite:"",
                    save: function(cb){
                        var err;
                        cb(err);
                    }

                };
            } 
        };
        cmdmodule = proxyquire('../server/controllers/command.controller', {'mongoose': mongooseStub});
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
    
        var spy = chai.spy.on(cmdmodule, 'getCommandLog');
        cmdmodule.getCommandLog(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

//     it("should post command", function() {
//         var 
//         mongooseStub = {
//             model: function(msg) {
//                 this.user =  "",
//                 this.name = "",
//                 this.type = "",
//                 this.argument = "",
//                 this.timestamp = "",
//                 this.time = "",
//                 this.mission = "",
//                 this.response = "",
//                 this.sent_to_satellite = ""
//         }
//     }
//         cmodule = proxyquire('../server/controllers/command.controller', {'mongoose': mongooseStub});
//         var req = {
//             body : {
//                 mission:'Azero',
//                 command: {
//                     "mission": "AZero",
//                     "time": "040.13:09:17 UTC",
//                     "timestamp": "2018-02-09T13:09:17.471Z",
//                     "argument": "earth",
//                     "type": "Set",
//                     "name": "pointing"
//                 },
//                 email:'tgattu@gmail.com'
//             }
//         }
//         var res = {
//             send: sinon.spy()
//         }

//         var spy = chai.spy.on(cmodule, 'postCommand');
//         cmodule.postCommand(req, res);
//         expect(spy).to.have.been.called();
//         expect(res.send.calledOnce).to.be.true;
//     });

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
            expect(err.errors.response).to.exist;
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
            assert.isUndefined(err.errors);
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
            expect(err.error.name.name).toEqual('ValidatorError');
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
            expect(err.error.timestamp.name).toEqual('ValidatorError');
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
            expect(err.error.argument.name).toEqual('ValidatorError');
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
            expect(err.error.user.name).toEqual('ValidatorError');
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
            expect(err.error.mission.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if response is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.response).to.exist;
            expect(err.error.response.name).toEqual('ValidatorError');
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
            expect(err.error.sent_to_satellite.name).toEqual('ValidatorError');
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
            expect(err.error.time.name).toEqual('ValidatorError');
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
            expect(err.error.type.name).toEqual('ValidatorError');
        });  
    });

});