var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var CList = require('../server/models/commandList');
var proxyquire = require('proxyquire');


describe('Test Suite for Command List Route Controller', function() {
    var clistmodule,mongooseStub,mongooseStubErr,clistErrmodule;

    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var list = {
                            "commands": [
                                {
                                    "value": "Pointing",
                                    "types": [
                                        {
                                            "value": "Get"
                                        },
                                        {
                                            "value": "Set"
                                        },
                                        {
                                            "value": "Invoke"
                                        }
                                    ]
                                },
                                {
                                    "value": "Echo",
                                    "types": [
                                        {
                                            "value": "Invoke"
                                        }
                                    ]
                                }
                            ]
                        }
                        var err;
                        callback(err,list); 
                    } 
                };
            } 
        };
        clistmodule = proxyquire('../server/controllers/commandList.controller', {'mongoose': mongooseStub});

        mongooseStubErr = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var list = {
                            "commands":null
                        }
                        var err = {name:"MongoError"};
                        callback(err,list); 
                    } 
                };
            } 
        };
        clistErrmodule = proxyquire('../server/controllers/commandList.controller', {'mongoose': mongooseStubErr});
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

        var output = [
            {
                "value": "Pointing",
                "types": [
                    {
                        "value": "Get"
                    },
                    {
                        "value": "Set"
                    },
                    {
                        "value": "Invoke"
                    }
                ]
            },
            {
                "value": "Echo",
                "types": [
                    {
                        "value": "Invoke"
                    }
                 ]
            }
        ];
    
        var spy = chai.spy.on(clistmodule, 'getCommandList');
        clistmodule.getCommandList(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output)
    });

    it("should not get command list if an error and status 400", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = null;

        var spy = chai.spy.on(clistErrmodule, 'getCommandList');
        clistErrmodule.getCommandList(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    
    });

});

describe('Test Suite for Command List Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new CList();
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            // expect(err.errors.commands).to.exist;
        });
    });

    it('should validate mission is a valid string type and commands is an object type', function() {
        var m = new CList({mission: 'AZero',commands:{}});
        m.validate(function(err){
            assert.isUndefined(err);
        });  
    });

    it('should invalidate when mission is not a string type and commands is an object type', function () {
        var m = new CList({mission: {},commands:{}});
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).toEqual('CastError');
        });
    });

    it('should validate if mission is defined and commands are not as required is false for it', function () {
        var m = new CList({mission:'AZero'});
        m.validate(function(err) {
            assert.isUndefined(err);
        });
    });
});