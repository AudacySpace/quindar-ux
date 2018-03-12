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


describe('Test Suite for Command List Route Controller', function() {
    var clistmodule,mongooseStub;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var list = {commands:{}};
                        var err;
                        callback(err,list); 
                    } 
                };
            } 
        };
        clistmodule = proxyquire('../server/controllers/commandList.controller', {'mongoose': mongooseStub});
    });

    it("should get command list", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(clistmodule, 'getCommandList');
        clistmodule.getCommandList(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

});

describe('Test Suite for Command List Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new CList();
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.commands).to.exist;
        });
    });

    it('should validate mission is a valid string type and commands is an object type', function() {
        var m = new CList({mission: 'AZero',commands:{}});
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });  
    });

    it('should invalidate when mission is not a string type and commands is an object type', function () {
        var m = new CList({mission: {},commands:{}});
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.error.mission.name).toEqual('CastError');
        });
    });

    it('should validate if mission is defined and commands are not as required is false for it', function () {
        var m = new CList({mission:'AZero'});
        m.validate(function(err) {
            assert.isUndefined(err.errors);
        });
    });
});