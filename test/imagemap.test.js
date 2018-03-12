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


describe('Test Suite for System Maps Route Controller', function() {
    var mapmodule,mongooseStub;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var mapdata = {uploadedfiles:{}};
                        var err;
                        callback(err,mapdata); 
                    } 
                };
            } 
        };
        mapmodule = proxyquire('../server/controllers/imagemap.controller', {'mongoose': mongooseStub});
    });

    it("should get all system maps", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(mapmodule, 'getMaps');
        mapmodule.getMaps(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

});

describe('Test Suite for System Image Map Schema Model ', function() {
    it('should be invalid if model is empty', function() {
        var m = new IMap();
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.uploadedfiles).to.exist;
        });
    });

    it('should validate mission is a valid String type and uploadedfiles is an array', function() {
        var m = new IMap({mission: 'AZero',uploadedfiles: [{},{}]});
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });    

    });

    it('should invalidate when mission is not a string type and uploadedfiles is an array', function () {
        var m = new IMap({mission:{},uploadedfiles: [{},{}]});

        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).toEqual('CastError');
            assert.isUndefined(err.errors.uploadedfiles);
        });
     
    });

    it('should invalidate when mission is a string type and uploadedfiles is an empty array', function () {
        var m = new IMap({mission: 'AZero',uploadedfiles:[]});
        m.validate(function(err) {
            expect(err.errors.uploadedfiles).to.exist;
            expect(err.error.uploadedfiles.name).toEqual('ValidatorError');
            assert.isUndefined(err.errors.mission);
        });
    });

    it('should invalidate when mission is not a string type and uploadedfiles is not an array', function () {
        var m = new IMap({mission: {},uploadedfiles: []});
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.error.mission.name).toEqual('CastError');
            expect(err.errors.uploadedfiles).to.exist;
            expect(err.error.uploadedfiles.name).toEqual('ValidatorError');
        });
    });
});
