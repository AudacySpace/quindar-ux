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


describe('Test Suite for Grid Layout Save Route', function() {
    var layoutmodule,mongooseStub;
     var spy
      
    before(function() {
        var req = {
            body : {
                dashboard:{
                    name:'Home',
                    mission:{
                        missionName:'AZero'
                    }
            },
            missionname: 'Azero',
            email:'tgattu@gmail.com'
        },
        query : {
            email:'tgattu@gmail.com',
            missionname: 'Azero'
        }
    }
    var res = {
        send: sinon.spy()
    }   
    mongooseStub = {
        model: function() {
            return {
                findOne: function(query, callback) {
                    var err;
                    var user = {
                        "grid": [
                            {
                                "name": "Home",
                                "mission": {
                                    "missionName": "AZero",
                                    "missionImage": "/media/icons/AudacyZero_Logo_White.jpg"
                                },
                                "widgets": [
                                    {
                                        "col": 0,
                                        "row": 0,
                                        "sizeY": 3,
                                        "sizeX": 4,
                                        "name": "Line Plot",
                                        "directive": "graph",
                                        "directiveSettings": "linesettings",
                                        "id": "addLine",
                                        "icon": {
                                            "id": "l-plot",
                                            "type": "fa-line-chart"
                                        },
                                        "main": true,
                                        "settings": {
                                            "active": false,
                                            "data": {
                                                "vehicles": [],
                                                "value": "",
                                                "key": ""
                                            }
                                        },
                                        "saveLoad": false,
                                        "delete": false
                                    },
                                    {
                                        "col": 4,
                                        "row": 0,
                                        "sizeY": 3,
                                        "sizeX": 4,
                                        "name": "3D Model",
                                        "directive": "satellite",
                                        "directiveSettings": "satellitesettings",
                                        "id": "satellite",
                                        "icon": {
                                            "id": "l-plot",
                                            "type": "fa-cube"
                                        },
                                        "main": true,
                                        "settings": {
                                            "active": false,
                                            "zoom": 1
                                        },
                                        "saveLoad": false,
                                        "delete": false
                                    }
                                ]
                            },
                            {
                                "name": "Home - Clock",
                                "mission": {
                                    "missionName": "AZero",
                                    "missionImage": "/media/icons/AudacyZero_Logo_White.jpg"
                                },
                                "widgets": [
                                    {
                                        "sizeY": 3,
                                        "sizeX": 4,
                                        "name": "Clock",
                                        "directive": "clock",
                                        "directiveSettings": "clocksettings",
                                        "id": "clock",
                                        "icon": {
                                            "id": "clock",
                                            "type": "fa-clock-o"
                                        },
                                        "main": true,
                                        "settings": {
                                            "active": false,
                                            "clocks": [
                                                {
                                                    "name": "UTC",
                                                    "timezone": 0
                                                }
                                            ]
                                        },
                                        "saveLoad": false,
                                        "delete": false,
                                        "row": 0,
                                        "col": 0
                                    }
                                ]
                            }
                        ],
                        markModified : function(message){},
                        save: function(cb){
                            cb(err);
                        }
                    };
                    callback(err,user); 
                } 
            };
        } 
    };
    layoutmodule = proxyquire('../server/controllers/dashboardlayout.controller', {'mongoose': mongooseStub});
    spy = chai.spy.on(layoutmodule, 'postLayout');
    });
    it("should update a layout", function() {
        var req = {
            body : {
                dashboard:{
                    name:'Home',
                    mission:{
                        missionName:'AZero'
                    }
                },
                missionname: 'Azero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }    
        layoutmodule.postLayout(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

    it("should save a new layout", function() {
        var req = {
            body : {
                dashboard:{
                    name:'Layout',
                    mission:{
                        missionName:'AZero'
                    }
                },
                missionname: 'Azero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }    
        layoutmodule.postLayout(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });

    it("should get all layouts", function() {
        var req = {
            body : {
                dashboard:{
                    name:'Home',
                    mission:{
                        missionName:'AZero'
                    }
            },
            missionname: 'Azero',
            email:'tgattu@gmail.com'
        },
        query : {
            email:'tgattu@gmail.com',
            missionname: 'Azero'
        }
    }
    var res = {
        send: sinon.spy()
    }    
       var ispy = chai.spy.on(layoutmodule, 'getLayouts');
        layoutmodule.getLayouts(req, res);
        expect(ispy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
    });
});

describe('GET /', function() {
  it('should render the index page', function(done) {
    agent
      .get(host + '/')
      .end(function(err, res) {
        should.not.exist(err);
        res.status.should.equal(200);
        done();
      })
  })
});

describe('GET /random', function() {
  it('should not render index page', function(done) {
    agent
      .get(host + '/random')
      .end(function(err, res) {
        res.status.should.equal(404);
        done();
      })
  })
});

