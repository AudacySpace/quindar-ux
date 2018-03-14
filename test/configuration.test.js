var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var CFG = require('../server/models/configuration');
var proxyquire = require('proxyquire');


describe('Test Suite for Configuration Controller', function() {
    var configurationmodule,mongooseStub,mongooseErrStub,configurationErrmodule;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query,condition,callback) {
                        var config = {
                            "contents": {
                                "GMAT_ATest_Audacy3_GNC_command_time": {
                                    "datatype": "date",
                                    "units": "",
                                    "expression": "",
                                    "alarm_high": "2524593.50",
                                    "warn_high": "2469807.50",
                                    "warn_low": "2444239.5",
                                    "alarm_low": "2415020.5",
                                    "qid": "GMAT_ATest_Audacy3_GNC_command_time",
                                    "name": "command timestamp",
                                    "category": "command",
                                    "notes": ""
                                },
                                "GMAT_ATest_Audacy3_GNC_command_arg": {
                                    "datatype": "string",
                                    "units": "",
                                    "expression": "",
                                    "alarm_high": "",
                                    "warn_high": "",
                                    "warn_low": "",
                                    "alarm_low": "",
                                    "qid": "GMAT_ATest_Audacy3_GNC_command_arg",
                                    "name": "command argument",
                                    "category": "command",
                                    "notes": ""
                                },
                                "GMAT_ATest_Audacy3_GNC_command_name": {
                                    "datatype": "string",
                                    "units": "",
                                    "expression": "",
                                    "alarm_high": "",
                                    "warn_high": "",
                                    "warn_low": "",
                                    "alarm_low": "",
                                    "qid": "GMAT_ATest_Audacy3_GNC_command_name",
                                    "name": "command name",
                                    "category": "command",
                                    "notes": ""
                                }
                            },
                            "status":200
                        };
                        var err;
                        callback(err,config); 
                    },
                    find: function(query,condition,callback){
                        var missions = {data:["ATest","Azero"],status:200};
                        var err;
                        callback(err,missions);
                    } 
                };
            } 
        };
        configurationmodule = proxyquire('../server/controllers/configuration.controller', {'mongoose': mongooseStub});

        mongooseErrStub = {
            model: function() {
                return {
                    findOne: function(query,condition,callback) {
                        var config = {
                            "contents": null,
                            "status":400
                        };
                        var err = {name:"MongoError"};
                        callback(err,config); 
                    },
                    find: function(query,condition,callback){
                        var missions = {"status":400};
                        var err = {name:"MongoError"};
                        callback(err,missions);
                    } 
                };
            } 
        };
        configurationErrmodule = proxyquire('../server/controllers/configuration.controller', {'mongoose': mongooseErrStub});


    });

    it("should get configuration of the mission requested", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = {
            Audacy3: {
                GNC: {
                    command: { 
                        arg: "", 
                        name: "", 
                        time:"" 
                    }
                }
            }
        }
    
        var spy = chai.spy.on(configurationmodule, 'getConfiguration');
        configurationmodule.getConfiguration(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get configuration when error", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = {};
    
        var spy = chai.spy.on(configurationErrmodule, 'getConfiguration');
        configurationErrmodule.getConfiguration(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);

    });

    it("should get all missions", function() {
        var req = {

        }
        var res = {
            send: sinon.spy()
        }

        var output = {data:["ATest","Azero"],status:200}
    
        var spy = chai.spy.on(configurationmodule, 'getMissions');
        configurationmodule.getMissions(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get missions when error", function() {
        var req = {

        }
        var res = {
            send: sinon.spy()
        }

        var output = {"status":400};
    
        var spy = chai.spy.on(configurationErrmodule, 'getMissions');
        configurationErrmodule.getMissions(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

});

describe('Test Suite for Configuration Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new CFG();
        m.validate(function(err) {
            expect(err.errors.source.name).to.exist;
            expect(err.errors.source.ipaddress).to.exist;
            expect(err.errors.source.filename).to.exist;
            expect(err.errors.contents).to.exist;
            expect(err.errors.mission).to.exist;
        });
    });

    it('should validate if all of the properties are defined with valid data types', function() {
        var m = new CFG({
            source : {
                name : 'Julia',
                ipaddress: '34.209.90.133',
                filename:'SIM.xlsx' ,

            },
            contents : {},
            mission: 'Azero'
        });
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });  
    });

    it('should invalidate if source name is not a string type', function() {
        var m = new CFG({
            source : {
                name : {},
                ipaddress: '34.209.90.133',
                filename:'SIM.xlsx' ,

            },
            contents : {},
            mission: 'Azero'
        });
        m.validate(function(err){
            expect(err.errors.source.name.name).to.exist;
            expect(err.errors.source.name.name).toEqual('CastError');
        });  
    });


    it('should invalidate if source ipaddress is not a string type', function() {
        var m = new CFG({
            source : {
                name : 'Julia',
                ipaddress: {},
                filename:'SIM.xlsx' ,

            },
            contents : {},
            mission: 'Azero'
        });
        m.validate(function(err){
            expect(err.errors.source.ipaddress.name).to.exist;
            expect(err.errors.source.ipaddress.name).toEqual('CastError');
        });  
    });

    it('should invalidate if source filename is not a string type', function() {
        var m = new CFG({
            source : {
                name : 'Julia',
                ipaddress: '34.209.90.133',
                filename:{} ,

            },
            contents : {},
            mission: 'Azero'
        });
        m.validate(function(err){
            expect(err.errors.source.filename.name).to.exist;
            expect(err.errors.source.filename.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if contents is not defined', function() {
        var m = new CFG({
            source : {
                name : 'Julia',
                ipaddress: '34.209.90.133',
                filename:'SIM.xlsx' ,

            },
            mission: 'Azero'
        });
        m.validate(function(err){
            expect(err.errors.contents.name).to.exist;
            expect(err.errors.contents.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if mission is not defined', function() {
        var m = new CFG({
            source : {
                name : 'Julia',
                ipaddress: '34.209.90.133',
                filename:'SIM.xlsx' ,

            },
            contents : {}
        });
        m.validate(function(err){
            expect(err.errors.mission.name).to.exist;
            expect(err.errors.mission.name).toEqual('ValidatorError');
        });  
    });

});
