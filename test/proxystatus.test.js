var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var PStatus = require('../server/models/proxystatus');
var proxyquire = require('proxyquire');


describe('Test Suite for Proxy Status Route Controller', function() {
    var pstatusmodule,mongooseStub,mongooseErrStub,pstatusErrmodule;

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
                                        var doc = { proxytimestamp:1000000,status:200};
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

        mongooseErrStub = {
            model: function() {
                return {
                    findOne: function(query,limits) {
                        return {
                            sort: function(qry){
                                return {
                                    exec: function(callback){
                                        var err = {name:"MongoError"};
                                        var doc = {status:400};
                                        callback(err,doc);
                                    }
                                };
                            }
                        };
                    }
                };
            } 
        };
        pstatusErrmodule = proxyquire('../server/controllers/proxystatus.controller', {'mongoose': mongooseErrStub});
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

        var output = { proxytimestamp:1000000,status:200};
    
        var spy = chai.spy.on(pstatusmodule, 'getCurrentStatus');
        pstatusmodule.getCurrentStatus(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get proxy status when error", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = {status:400};
    
        var spy = chai.spy.on(pstatusErrmodule, 'getCurrentStatus');
        pstatusErrmodule.getCurrentStatus(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
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
            expect(err.errors.proxytimestamp.name).toEqual('CastError');
        });
    });
});