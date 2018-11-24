var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var SBoard = require('../server/models/statusboard');
var proxyquire = require('proxyquire');

describe('Test Suite for Status Board Route Controller New Instance', function() {
    beforeEach(function() {
        sinon.stub(SBoard, 'findOne');
        sinon.stub(SBoard.prototype, 'save');
    });
 
 
    afterEach(function() {
        SBoard.findOne.restore();
        SBoard.prototype.save.restore();
    });
 
    it('should add alerts', function() {
        statusboard = require('../server/controllers/statusboard.controller');
        SBoard.findOne.yields(null, null);
        SBoard.prototype.save.yields(null,{"data":"100","status":200});
        var req = { 
            body : {
                "missionname":"AZero",
                "statusdata": [
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy1",
                        "time": "288.22:14:24 UTC",
                        "channel": "Audacy1.GNC.command.time",
                        "ack": "",
                        "timestamp": 1823638464
                    },
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy2",
                        "time": "288.22:14:24 UTC",
                        "channel": "Audacy2.GNC.command.time",
                        "ack": "",
                        "timestamp": 1823638464
                    },
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy3",
                        "time": "288.22:14:24 UTC",
                        "channel": "Audacy3.GNC.command.time",
                        "ack": "",
                        "timestamp": 1823638464
                    }
                ],
                "vehicleColors": [
                    {
                        "vehicle": "Audacy1",
                        "status": false
                     },
                     {
                        "vehicle": "Audacy2",
                        "status": false
                     },
                    {
                        "vehicle": "Audacy3",
                        "status": false
                    }
                ]
            } 
        };
        var res = {
            json: sinon.stub()
        };
 
        statusboard.postAlerts(req, res);
        expect(res.json.calledOnce).to.be.true;
        sinon.assert.calledWith(res.json, {"data":"100","status":200});
    });
});

describe('Test Suite for Status Board Route Controller New Instance when error', function() {
    beforeEach(function() {
        sinon.stub(SBoard, 'findOne');
        sinon.stub(SBoard.prototype, 'save');
    });
 
 
    afterEach(function() {
        SBoard.findOne.restore();
        SBoard.prototype.save.restore();
    });
 
    it('should not add alerts when error', function() {
        statusboard = require('../server/controllers/statusboard.controller');
        SBoard.findOne.yields(null, null);
        SBoard.prototype.save.yields({name:"MongoError"},{"status":400});
        var req = { body : {
            "missionname":"AZero",
            "statusdata": [
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy1",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy1.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy2",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy2.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy3",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy3.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                }
                            ],
                            "vehicleColors": [
                                {
                                    "vehicle": "Audacy1",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy2",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy3",
                                    "status": false
                                }
                            ]
        } };
        var res = {
            json: sinon.stub()
        };
 
        statusboard.postAlerts(req, res);
        expect(res.json.calledOnce).to.be.true;
        sinon.assert.calledWith(res.json, {"status":400});
    });
});


describe('Test Suite for Status Board Route Controller', function() {
    var sbmodule,mongooseStub,mongooseStubpost,sbpostmodule,mongooseErrStub;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query,condition, callback) {
                        var status = {"statusboard": [
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy1",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy1.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy2",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy2.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy3",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy3.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                }
                            ],
                            "vehiclecolors": [
                                {
                                    "vehicle": "Audacy1",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy2",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy3",
                                    "status": false
                                }
                            ]
                        };
                        var err;
                        callback(err,status); 
                    } 
                };
            } 
        };
        sbmodule = proxyquire('../server/controllers/statusboard.controller', {'mongoose': mongooseStub});

        mongooseErrStub = {
            model: function() {
                return {
                    findOne: function(query,condition, callback) {
                        var status = {status:400};
                        var err = {name:"MongoError"};
                        callback(err,status); 
                    } 
                };
            } 
        };
        sbErrmodule = proxyquire('../server/controllers/statusboard.controller', {'mongoose': mongooseErrStub});

        mongooseStubpost = {
            model: function() {
                return {
                    findOne: function(query,callback) {
                        var status = {
                            markModified : function(message){},
                            save: function(cb,result){
                                var result = {"name":"100"};
                                cb(err,result);
                            },
                            "mission": "ATest",
                            "statusboard": [
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy1",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy1.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy2",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy2.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy3",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy3.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                }
                            ],
                            "vehiclecolors": [
                                {
                                    "vehicle": "Audacy1",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy2",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy3",
                                    "status": false
                                }
                            ],
                        };
                        var err;
                        callback(err,status); 
                    } 
                };
            } 
        };
        sbpostmodule = proxyquire('../server/controllers/statusboard.controller', {'mongoose': mongooseStubpost});


        mongooseErrStubpost = {
            model: function() {
                return {
                    findOne: function(query,callback) {
                        var status = {
                            markModified : function(message){},
                            save: function(cb,result){
                                var result = {status:400};
                                var err = {name:"MongoError"};
                                cb(err,result);
                            },
                            "mission": "ATest",
                            "statusboard": [
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy1",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy1.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy2",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy2.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy3",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy3.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                }
                            ],
                            "vehiclecolors": [
                                {
                                    "vehicle": "Audacy1",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy2",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy3",
                                    "status": false
                                }
                            ],
                        };
                        var err = {name:"MongoError"};
                        callback(err,status); 
                    } 
                };
            } 
        };
        sbpostErrmodule = proxyquire('../server/controllers/statusboard.controller', {'mongoose': mongooseErrStubpost});
    });

    it("should get all alarm panel alerts", function() {
        var req = {
            query : {
                missionname:'Azero'
            }
        }
        var res = {
            json: sinon.stub()
        }

        var output = {"statusboard": [
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy1",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy1.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy2",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy2.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                },
                                {
                                    "alert": "CAUTION",
                                    "bound": "LOW",
                                    "vehicle": "Audacy3",
                                    "time": "288.22:14:24 UTC",
                                    "channel": "Audacy3.GNC.command.time",
                                    "ack": "",
                                    "timestamp": 1823638464
                                }
                            ],
                            "vehiclecolors": [
                                {
                                    "vehicle": "Audacy1",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy2",
                                    "status": false
                                },
                                {
                                    "vehicle": "Audacy3",
                                    "status": false
                                }
                            ]};
    
        var spy = chai.spy.on(sbmodule, 'getAlerts');
        sbmodule.getAlerts(req, res);
        expect(spy).to.have.been.called();
        expect(res.json.calledOnce).to.be.true;
        sinon.assert.calledWith(res.json,output);

    });

    it("should not get all alarm panel alerts when error", function() {
        var req = {
            query : {
                missionname:'Azero'
            }
        }
        var res = {
            json: sinon.stub()
        }
    
        var spy = chai.spy.on(sbErrmodule, 'getAlerts');
        sbErrmodule.getAlerts(req, res);
        expect(spy).to.have.been.called();
        expect(res.json.calledOnce).to.be.true;
        sinon.assert.calledWith(res.json,{status:400});

    });

    it("should update the alerts", function() {
        var req = {
            body : {
                missionname:'Azero',
                statusdata: [
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy2",
                        "time": "139.23:07:44 UTC",
                        "channel": "Audacy2.GNC.command.time",
                        "ack": "Taruni Gattu - VIP",
                        "timestamp": 1558307264
                    },
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy3",
                        "time": "139.23:19:24 UTC",
                        "channel": "Audacy3.GNC.command.time",
                        "ack": "Taruni Gattu - VIP",
                        "timestamp": 1558307964
                    },
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy1",
                        "time": "139.23:21:04 UTC",
                        "channel": "Audacy1.GNC.command.time",
                        "ack": "Taruni Gattu - VIP",
                        "timestamp": 1558308064
                    }
                ],
                vehiclecolors: [
                    {
                        "vehicle": "Audacy1",
                        "status": false
                    },
                    {
                        "vehicle": "Audacy2",
                        "status": false
                    },
                    {
                        "vehicle": "Audacy3",
                        "status": false
                    }
                ]
            }
        }
        var res = {
            json: sinon.spy()
        }

        var output = {

        }
    
        var spy = chai.spy.on(sbpostmodule, 'postAlerts');
        sbpostmodule.postAlerts(req, res);
        expect(spy).to.have.been.called();
        expect(res.json.calledOnce).to.be.true;
        sinon.assert.calledWith(res.json,{"name":"100"});
    });

    it("should not update alerts when error", function() {
        var req = {
            body : {
                missionname:'Azero',
                statusdata: [
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy2",
                        "time": "139.23:07:44 UTC",
                        "channel": "Audacy2.GNC.command.time",
                        "ack": "Taruni Gattu - VIP",
                        "timestamp": 1558307264
                    },
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy3",
                        "time": "139.23:19:24 UTC",
                        "channel": "Audacy3.GNC.command.time",
                        "ack": "Taruni Gattu - VIP",
                        "timestamp": 1558307964
                    },
                    {
                        "alert": "CAUTION",
                        "bound": "LOW",
                        "vehicle": "Audacy1",
                        "time": "139.23:21:04 UTC",
                        "channel": "Audacy1.GNC.command.time",
                        "ack": "Taruni Gattu - VIP",
                        "timestamp": 1558308064
                    }
                ],
                vehiclecolors: [
                    {
                        "vehicle": "Audacy1",
                        "status": false
                    },
                    {
                        "vehicle": "Audacy2",
                        "status": false
                    },
                    {
                        "vehicle": "Audacy3",
                        "status": false
                    }
                ]
            }
        }
        var res = {
            json: sinon.spy()
        }

    
        var spy = chai.spy.on(sbpostErrmodule, 'postAlerts');
        sbpostErrmodule.postAlerts(req, res);
        expect(spy).to.have.been.called();
        expect(res.json.calledOnce).to.be.true;
        sinon.assert.calledWith(res.json,{status:400});
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
            assert.isNull(err);
        });    

    });

    it('should invalidate when mission is not a string type and vehiclecolors and statusboard is an array', function () {
        var m = new SBoard({mission: {},vehiclecolors: [{},{}],statusboard: [{},{},{}]});

        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).to.equal('CastError');
            assert.isUndefined(err.errors.vehiclecolors);
            assert.isUndefined(err.errors.statusboard);
        });
     
    });

    it('should invalidate when mission is not a string type ,statusboard is an array but vehiclecolors is empty', function () {
        var m = new SBoard({mission: {},vehiclecolors: [],statusboard: [{},{},{}]});

        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).to.equal('CastError');
            expect(err.errors.vehiclecolors).to.exist;
            expect(err.errors.vehiclecolors.name).to.equal('ValidatorError');
            assert.isUndefined(err.errors.statusboard);
        });
     
    });

    it('should invalidate when mission is a string type,statusboard is an array and vehiclecolors is empty', function () {
        var m = new SBoard({mission: 'AZero',vehiclecolors:[],statusboard: [{},{},{}]});
        m.validate(function(err) {
            expect(err.errors.vehiclecolors).to.exist;
            expect(err.errors.vehiclecolors.name).to.equal('ValidatorError');
            assert.isUndefined(err.errors.mission);
            assert.isUndefined(err.errors.statusboard);
        });
    });

    it('should invalidate when mission is a string type,vehiclecolors is an array and statusboard is not an array', function () {
        var m = new SBoard({mission: 'AZero',vehiclecolors:[{},{}],statusboard:[]});
        m.validate(function(err) {
            expect(err.errors.statusboard).to.exist;
            expect(err.errors.statusboard.name).to.equal('ValidatorError');
            assert.isUndefined(err.errors.mission);
            assert.isUndefined(err.errors.vehiclecolors);
        });
    });
});

