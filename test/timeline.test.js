var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var TL = require('../server/models/timeline');
var proxyquire = require('proxyquire');


describe('Test Suite for Timeline Route Controller', function() {
    var timelinemodule,mongooseStub;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var timelinedata = {events:[
                                    {
                                        "eventinfo": "Command to point SG Earth station",
                                        "eventgroup": "SG",
                                        "eventdata": [
                                            {
                                                "content": "",
                                                "end": "",
                                                "start": ""
                                            }
                                        ],
                                        "eventname": "SG_ESPointing"
                                    },
                                    {
                                        "eventinfo": "Command to point Sun",
                                        "eventgroup": "SG",
                                        "eventdata": [
                                            {
                                                "content": "",
                                                "end": "",
                                                "start": ""
                                            }
                                        ],
                                        "eventname": "SG_SunPointing"
                                    }
                                ]
                            };
                        var err;
                        callback(err,timelinedata); 
                    } 
                };
            } 
        };
        timelinemodule = proxyquire('../server/controllers/timeline.controller', {'mongoose': mongooseStub});

        mongooseErrStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var timelinedata = {events:[],status:400};
                        var err= {name:"MongoError"};
                        callback(err,timelinedata); 
                    } 
                };
            } 
        };
        timelineErrmodule = proxyquire('../server/controllers/timeline.controller', {'mongoose': mongooseErrStub});
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

        var output = [
                        {
                            "eventinfo": "Command to point SG Earth station",
                            "eventgroup": "SG",
                            "eventdata": [
                                {
                                    "content": "",
                                    "end": "",
                                    "start": ""
                                }
                            ],
                            "eventname": "SG_ESPointing"
                        },
                        {
                            "eventinfo": "Command to point Sun",
                            "eventgroup": "SG",
                            "eventdata": [
                                {
                                    "content": "",
                                    "end": "",
                                    "start": ""
                                }
                            ],
                            "eventname": "SG_SunPointing"
                        }
                    ]
    
        var spy = chai.spy.on(timelinemodule, 'getTimelineEvents');
        timelinemodule.getTimelineEvents(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get timeline event data when error", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(timelineErrmodule, 'getTimelineEvents');
        timelineErrmodule.getTimelineEvents(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,[]);
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
            expect(err.errors.mission.name).toEqual('CastError');
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
            expect(err.errors.events.name).toEqual('ValidatorError');
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
            expect(err.errors.filename.name).toEqual('ValidatorError');
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
            expect(err.errors.file.name).toEqual('ValidatorError');
        });  
    });
});
