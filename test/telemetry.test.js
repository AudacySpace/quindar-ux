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


describe('Test Suite for Telemetry Route Controller', function() {
    var telemetrymodule,mongooseStub;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query,condition,sortorder,callback) {
                        var telemetry = {};
                        var err;
                        callback(err,telemetry); 
                    } 
                };
            } 
        };
        telemetrymodule = proxyquire('../server/controllers/telemetry.controller', {'mongoose': mongooseStub});
    });

    it("should get telemetry data of the mission requested", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(telemetrymodule, 'getTelemetry');
        telemetrymodule.getTelemetry(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

});

describe('Test Suite for Telemetry Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new TM();
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.timestamp).to.exist;
            expect(err.errors.telemetry).to.exist;
        });
    });

    it('should validate mission is a valid string type and telemetry is an object type and timestamp is date type', function() {
        var m = new TM({mission: 'AZero',timestamp:'2018-02-01T09:42:01.287Z',telemetry:{}});
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });  
    });

    it('should invalidate when mission is not a string type', function () {
        var m = new TM({mission: {},timestamp:'2018-02-01T09:42:01.287Z',telemetry:{}});
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.error.mission.name).toEqual('CastError');
        });
    });

    it('should invalidate when timestamp is not defined', function () {
        var m = new TM({mission: 'AZero',telemetry:{}});
        m.validate(function(err) {
            expect(err.errors.timestamp).to.exist;
            expect(err.error.timestamp.name).toEqual('ValidatorError');
        });
    });

    it('should invalidate when telemetry is not defined', function () {
        var m = new TM({mission: 'AZero',timestamp:'2018-02-01T09:42:01.287Z'});
        m.validate(function(err) {
            expect(err.errors.telemetry).to.exist;
            expect(err.error.telemetry.name).toEqual('ValidatorError');
        });
    });

});
