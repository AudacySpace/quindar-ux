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


describe('Test Suite for Proxy Status Route Controller', function() {
    var pstatusmodule,mongooseStub;
    var ispy;

    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query,limits) {
                        return {
                            sort: function(qry){
                                return {
                                    exec: function(callback){
                                        var err;
                                        var doc = {};
                                        callback(err,doc);
                                    }
                                };
                            }
                        };
                    }
                };
            } 
        };
        pstatusmodule = proxyquire('../server/controllers/proxystatus.controller', {'mongoose': mongooseStub});
    });

    it("should get proxy status", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(pstatusmodule, 'getCurrentStatus');
        pstatusmodule.getCurrentStatus(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

});

describe('Test Suite for Proxy Status Schema Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new PStatus();
        m.validate(function(err) {
            expect(err.errors.proxytimestamp).to.exist;
        });
    });

    it('should validate proxytimestamp is a valid number type', function() {
        var m = new PStatus({proxytimestamp: 156788888});
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });  
    });

    it('should invalidate when proxytimestamp is not a number type', function () {
        var m = new PStatus({proxytimestamp: '123abc'});
        m.validate(function(err) {
            expect(err.errors.proxytimestamp).to.exist;
            expect(err.error.proxytimestamp.name).toEqual('CastError');
        });
    });
});