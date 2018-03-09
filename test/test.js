
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


describe('Test Suite for System Maps Route', function() {
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
        mapmodule = proxyquire('../server/controllers/imaps.controller', {'mongoose': mongooseStub});
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
    layoutmodule = proxyquire('../server/controllers/userops.controller', {'mongoose': mongooseStub});
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


describe('Test Suite for Image Map Schema Model ', function() {
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


describe('Test Suite for Telemetry Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new TM();
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.timestamp).to.exist;
            expect(err.errors.telemetry).to.exist;
        });
    });

    it('should validate mission is a valid string type and telemetry is an object type and timestamp is date type', function() {
        var m = new TM({mission: 'AZero',timestamp:'2018-02-01T09:42:01.287Z',telemetry:{}});
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });  
    });

    it('should invalidate when mission is not a string type', function () {
        var m = new TM({mission: {},timestamp:'2018-02-01T09:42:01.287Z',telemetry:{}});
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.error.mission.name).toEqual('CastError');
        });
    });

    it('should invalidate when timestamp is not defined', function () {
        var m = new TM({mission: 'AZero',telemetry:{}});
        m.validate(function(err) {
            expect(err.errors.timestamp).to.exist;
            expect(err.error.timestamp.name).toEqual('ValidatorError');
        });
    });

    it('should invalidate when telemetry is not defined', function () {
        var m = new TM({mission: 'AZero',timestamp:'2018-02-01T09:42:01.287Z'});
        m.validate(function(err) {
            expect(err.errors.telemetry).to.exist;
            expect(err.error.telemetry.name).toEqual('ValidatorError');
        });
    });

});

describe('Test Suite for Command Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new CMD();
        m.validate(function(err) {
            expect(err.errors.name).to.exist;
            expect(err.errors.argument).to.exist;
            expect(err.errors.timestamp).to.exist;
            expect(err.errors.user).to.exist;
            expect(err.errors.mission).to.exist;
            expect(err.errors.response).to.exist;
            expect(err.errors.sent_to_satellite).to.exist;
            expect(err.errors.time).to.exist;
            expect(err.errors.type).to.exist;
        });
    });

    it('should validate if all of the properties are defined with valid data types', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            assert.isUndefined(err.errors);
        });  
    });

    it('should invalidate if name is not defined', function() {
        var m = new CMD({
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.name).to.exist;
            expect(err.error.name.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if timestamp is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.timestamp).to.exist;
            expect(err.error.timestamp.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if argument is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.argument).to.exist;
            expect(err.error.argument.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if user is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.user).to.exist;
            expect(err.error.user.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if mission is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.mission).to.exist;
            expect(err.error.mission.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if response is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.response).to.exist;
            expect(err.error.response.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if sent_to_satellite is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            time:'040.13:09:17 UTC',
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.sent_to_satellite).to.exist;
            expect(err.error.sent_to_satellite.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if time is not a defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            type:'Set'
        });
        m.validate(function(err){
            expect(err.errors.time).to.exist;
            expect(err.error.time.name).toEqual('ValidatorError');
        });  
    });

    it('should invalidate if type is not defined', function() {
        var m = new CMD({
            name: 'pointing',
            timestamp:'2018-02-09T13:09:17.471Z',
            argument:'earth',
            user:'taruni.gattu@gmail.com',
            mission:'AZero',
            response:'success',
            sent_to_satellite:true,
            time:'040.13:09:17 UTC'
        });
        m.validate(function(err){
            expect(err.errors.type).to.exist;
            expect(err.error.type.name).toEqual('ValidatorError');
        });  
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
            expect(err.error.source.name.name).toEqual('CastError');
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
            expect(err.error.source.ipaddress.name).toEqual('CastError');
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
            expect(err.error.source.filename.name).toEqual('ValidatorError');
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
            expect(err.error.contents.name).toEqual('ValidatorError');
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
            expect(err.error.mission.name).toEqual('CastError');
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
            expect(err.error.events.name).toEqual('ValidatorError');
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
            expect(err.error.filename.name).toEqual('ValidatorError');
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
            expect(err.error.file.name).toEqual('ValidatorError');
        });  
    });
});
























