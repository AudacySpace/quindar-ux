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


describe('Test Suite for Status Board Route Controller', function() {
    var sbmodule,mongooseStub;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query,condition, callback) {
                        var status = {};
                        var err;
                        callback(err,status); 
                    } 
                };
            } 
        };
        sbmodule = proxyquire('../server/controllers/statusboard.controller', {'mongoose': mongooseStub});
    });

    it("should get all alarm panel alerts", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(sbmodule, 'getAlerts');
        sbmodule.getAlerts(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

});

describe('Test Suite for Status Board Model ', function() {
    it('should be invalid if model is empty', function() {
        var m = new SBoard();
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.vehiclecolors).to.exist;
            expect(err.errors.statusboard).to.exist;
        });
    });

    it('should validate when mission is a valid String type and vehiclecolors and statusboard is an array', function() {
        var m = new SBoard({mission: 'AZero',vehiclecolors: [{},{}],statusboard: [{},{},{}] });
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });    

    });

    it('should invalidate when mission is not a string type and vehiclecolors and statusboard is an array', function () {
        var m = new SBoard({mission: {},vehiclecolors: [{},{}],statusboard: [{},{},{}]});

        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).toEqual('CastError');
            assert.isUndefined(err.errors.vehiclecolors);
            assert.isUndefined(err.errors.statusboard);
        });
     
    });

    it('should invalidate when mission is not a string type ,statusboard is an array but vehiclecolors is empty', function () {
        var m = new SBoard({mission: {},vehiclecolors: [],statusboard: [{},{},{}]});

        m.validate(function(err) {

            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).toEqual('CastError');
            expect(err.errors.vehiclecolors).to.exist;
            expect(err.errors.vehiclecolors.name).toEqual('ValidatorError');
            assert.isUndefined(err.errors.statusboard);
        });
     
    });

    it('should invalidate when mission is a string type,statusboard is an array and vehiclecolors is not an array', function () {
        var m = new SBoard({mission: 'AZero',vehiclecolors:'azero',statusboard: [{},{},{}]});
        m.validate(function(err) {
            expect(err.errors.vehiclecolors).to.exist;
            expect(err.error.vehiclecolors.name).toEqual('ValidatorError');
            assert.isUndefined(err.errors.mission);
            assert.isUndefined(err.errors.statusboard);
        });
    });

    it('should invalidate when mission is a string type,vehiclecolors is an array and statusboard is not an array', function () {
        var m = new SBoard({mission: 'AZero',vehiclecolors:[{},{}],statusboard:[]});
        m.validate(function(err) {
            expect(err.errors.statusboard).to.exist;
            expect(err.error.statusboard.name).toEqual('ValidatorError');
            assert.isUndefined(err.errors.mission);
            assert.isUndefined(err.errors.vehiclecolors);
        });
    });
});

