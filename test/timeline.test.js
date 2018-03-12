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


describe('Test Suite for Timeline Route Controller', function() {
    var timelinemodule,mongooseStub;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var timelinedata = {events:[]};
                        var err;
                        callback(err,timelinedata); 
                    } 
                };
            } 
        };
        timelinemodule = proxyquire('../server/controllers/timeline.controller', {'mongoose': mongooseStub});
    });

    it("should get timeline event data for the mission requested", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(timelinemodule, 'getTimelineEvents');
        timelinemodule.getTimelineEvents(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

});

describe('Test Suite for Timeline Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new TL();
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.events).to.exist;
            expect(err.errors.filename).to.exist;
            expect(err.errors.file).to.exist;
        });
    });

    it('should validate if all of the properties are defined with valid data types', function() {
        var m = new TL({
            mission:'AZero',
            events: [{},{}],
            filename: 'Timeline',
            file: 'timeline.xlsx'
        });
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });  
    });

    it('should invalidate if mission is not a string type', function() {
        var m = new TL({
            mission:{},
            events: [{},{}],
            filename: 'Timeline',
            file: 'timeline.xlsx'
        });
        m.validate(function(err){
            expect(err.errors.mission.name).to.exist;
            expect(err.error.mission.name).toEqual('CastError');
        });  
    });

    it('should invalidate if events is not defined', function() {
        var m = new TL({
            mission:'AZero',
            filename: 'Timeline',
            file: 'timeline.xlsx'
        });
        m.validate(function(err){
            expect(err.errors.events.name).to.exist;
            expect(err.error.events.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if filename is not defined', function() {
        var m = new TL({
            mission:'AZero',
            events: [{},{}],
            file: 'timeline.xlsx'
        });
        m.validate(function(err){
            expect(err.errors.filename.name).to.exist;
            expect(err.error.filename.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if file is not defined', function() {
        var m = new TL({
            mission:'AZero',
            events: [{},{}],
            filename: 'Timeline'
        });
        m.validate(function(err){
            expect(err.errors.file.name).to.exist;
            expect(err.error.file.name).toEqual('ValidatorError');
        });  
    });
});
