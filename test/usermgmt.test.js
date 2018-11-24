var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var Usr = require('../server/models/user');
var configRole = require('../server/config/role');
var proxyquire = require('proxyquire');


describe('Test Suite for Grid Layout Save Route', function() {
    var layoutmodule,mongooseStub,layoutErrmodule,mongooseErrStub;
     var spy,spyErr;
      
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
                            var result = [
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
                        ]
                            cb(err,result);
                        }
                    };
                    callback(err,user); 
                } 
            };
        } 
    };
    layoutmodule = proxyquire('../server/controllers/dashboardlayout.controller', {'mongoose': mongooseStub});

    spy = chai.spy.on(layoutmodule, 'postLayout');

    mongooseErrStub = {
        model: function() {
            return {
                findOne: function(query, callback) {
                    var err = {name:"MongoError"};
                    var user = {
                        "grid": [
                            
                        ],
                        markModified : function(message){},
                        save: function(cb){
                            var err = {name:"MongoError"};
                            var result = {status:400};
                            cb(err,result);
                        }
                    };
                    callback(err,user); 
                } 
            };
        } 
    };
    layoutErrmodule = proxyquire('../server/controllers/dashboardlayout.controller', {'mongoose': mongooseErrStub});
    spyErr = chai.spy.on(layoutErrmodule, 'postLayout');

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
                missionname: 'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        } 

        var output = [
            {
                mission: { 
                    missionImage: "/media/icons/AudacyZero_Logo_White.jpg", 
                    missionName: "AZero" 
                },
                name: "Home",
                widgets: [{
                    col: 0,
                    delete: false,
                    directive: "graph",
                    directiveSettings: "linesettings",
                    icon: { id: "l-plot", type: "fa-line-chart" },
                    id: "addLine",
                    main: true,
                    name: "Line Plot",
                    row: 0,
                    saveLoad: false,
                    settings: {
                        active: false,
                        data: {
                            vehicles: [],
                            value: "",
                            key: ""
                         }
                    },
                    sizeX: 4,
                    sizeY: 3
                },{
                    col: 4,
                    delete: false,
                    directive: "satellite",
                    directiveSettings: "satellitesettings",
                    icon: { id: "l-plot", type: "fa-cube" },
                    id: "satellite",
                    main: true,
                    name: "3D Model",
                    row: 0,
                    saveLoad: false,
                    settings: { active: false, zoom: 1 },
                    sizeX: 4,
                    sizeY: 3
                }]
            }, {
                mission: { 
                    missionImage: "/media/icons/AudacyZero_Logo_White.jpg", 
                    missionName: "AZero" 
                },
                name: "Home - Clock",
                widgets: [{
                    col: 0,
                    delete: false,
                    directive: "clock",
                    directiveSettings: "clocksettings",
                    icon: { id: "clock", type: "fa-clock-o" },
                    id: "clock",
                    main: true,
                    name: "Clock",
                    row: 0,
                    saveLoad: false,
                    settings: { active: false, clocks: [{ name: "UTC", timezone: 0 }] },
                    sizeX: 4,
                    sizeY: 3
                }]
            }
        ]   
        layoutmodule.postLayout(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not update a layout when error", function() {
        var req = {
            body : {
                dashboard:{
                    name:'Home',
                    mission:{
                        missionName:'AZero'
                    }
                },
                missionname: 'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {status:400};

        layoutErrmodule.postLayout(req, res);
         expect(spyErr).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
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
                missionname: 'AZero',
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

    it("should not save a new layout when error", function() {
        var req = {
            body : {
                dashboard:{
                    name:'Layout',
                    mission:{
                        missionName:'AZero'
                    }
                },
                missionname: 'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        } 

        var output = {status:400};
        layoutErrmodule.postLayout(req, res);
        expect(spyErr).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
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
            missionname: 'AZero',
            email:'tgattu@gmail.com'
        },
        query : {
            email:'tgattu@gmail.com',
            missionname: 'AZero'
        }
    }
    var res = {
        send: sinon.spy()
    }

    var output = [
            {
                mission: { 
                    missionImage: "/media/icons/AudacyZero_Logo_White.jpg", 
                    missionName: "AZero" 
                },
                name: "Home",
                widgets: [{
                    col: 0,
                    delete: false,
                    directive: "graph",
                    directiveSettings: "linesettings",
                    icon: { id: "l-plot", type: "fa-line-chart" },
                    id: "addLine",
                    main: true,
                    name: "Line Plot",
                    row: 0,
                    saveLoad: false,
                    settings: {
                        active: false,
                        data: {
                            vehicles: [],
                            value: "",
                            key: ""
                         }
                    },
                    sizeX: 4,
                    sizeY: 3
                },{
                    col: 4,
                    delete: false,
                    directive: "satellite",
                    directiveSettings: "satellitesettings",
                    icon: { id: "l-plot", type: "fa-cube" },
                    id: "satellite",
                    main: true,
                    name: "3D Model",
                    row: 0,
                    saveLoad: false,
                    settings: { active: false, zoom: 1 },
                    sizeX: 4,
                    sizeY: 3
                }]
            }, {
                mission: { 
                    missionImage: "/media/icons/AudacyZero_Logo_White.jpg", 
                    missionName: "AZero" 
                },
                name: "Home - Clock",
                widgets: [{
                    col: 0,
                    delete: false,
                    directive: "clock",
                    directiveSettings: "clocksettings",
                    icon: { id: "clock", type: "fa-clock-o" },
                    id: "clock",
                    main: true,
                    name: "Clock",
                    row: 0,
                    saveLoad: false,
                    settings: { active: false, clocks: [{ name: "UTC", timezone: 0 }] },
                    sizeX: 4,
                    sizeY: 3
                }]
            }
        ]   
        var ispy = chai.spy.on(layoutmodule, 'getLayouts');
        layoutmodule.getLayouts(req, res);
        expect(ispy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get layouts when error", function() {
        var req = {
            body : {
                dashboard:{
                    name:'Home',
                    mission:{
                        missionName:'AZero'
                    }
            },
            missionname: 'AZero',
            email:'tgattu@gmail.com'
        },
        query : {
            email:'tgattu@gmail.com',
            missionname: 'AZero'
        }
    }
    var res = {
        send: sinon.spy()
    }

    var output = [];
       var ispy = chai.spy.on(layoutErrmodule, 'getLayouts');
        layoutErrmodule.getLayouts(req, res);
        expect(ispy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });
});

describe('Test Suite for User Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new Usr();
        m.validate(function(err) {
            expect(err.errors['google.id']).to.exist;
            expect(err.errors['google.token']).to.exist;
            expect(err.errors['google.email']).to.exist;
            expect(err.errors['google.name']).to.exist;
        });
    });

    it('should validate if all of the properties are defined with valid data types', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com' ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

    it('should invalidate if google id is not a string type', function() {
        var m = new Usr({
            google : {
                id : {},
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com' ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.id'].name).to.exist;
            expect(err.errors['google.id'].name).to.equal('CastError');
        });  
    });


    it('should invalidate if google token is not a string type', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: {},
                email:'tgattu@gmail.com' ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.token'].name).to.exist;
            expect(err.errors['google.token'].name).to.equal('CastError');
        });  
    });

    it('should invalidate if google email is not a string type', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:{} ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.email'].name).to.exist;
            expect(err.errors['google.email'].name).to.equal('CastError');
        });  
    });

    it('should invalidate if google name is not a string type', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com',
                name:{}

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.name'].name).to.exist;
            expect(err.errors['google.name'].name).to.equal('CastError');
        });  
    });

    it('should validate if grid is not defined', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com',
                name:'Taruni Gattu'

            },
            missions: [{},{}]
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

    it('should validate if missions is not defined', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com',
                name:'Taruni Gattu'

            },
            grid : [{},{}]
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

});

describe('Test Suite for User Management Controller', function() {
    var usermgmtmodule,mongooseStub,mongooseErrStub,usermgmtErrmodule,mongoosePostStub,usermgmtPostmodule;
    var mongoosePostErrStub,usermgmtPostErrmodule,mongoosePostStub2,usermgmtPostmodule2;
    var mongoosePostStub3,usermgmtPostmodule3,mongoosePostErrStub2,usermgmtPostErrmodule2;
    var mongoosePostErrStub3,usermgmtPostErrmodule3;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    find: function(query,condition,callback) {
                        var users = [
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ]
                                }
                            
                            ]
                        var err;
                        callback(err,users); 
                    },
                    findOne: function(query,condition,callback) {
                        var err;
                        var user = {
                                google:{},
                                missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                            {callsign:'SYS'},
                                            {callsign:'CC'}
                                        ]
                                    }
                                ]
                            }
                        callback(err,user); 
                    }
                };
            } 
        };
        usermgmtmodule = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongooseStub});

        mongooseErrStub = {
            model: function() {
                return {
                    find: function(query,condition,callback) {
                        var users = { status:400}
                        var err = {name:"MongoError"};
                        callback(err,users); 
                    },
                    findOne: function(query,condition,callback) {
                        var user = {
                                    google:{},
                                    missions:[
                                    {
                                        currentRole:null,
                                        allowedRoles:null
                                    }
                                    ]
                                }
                   
                        var err = {name:"MongoError"};
                        callback(err,user); 
                    } 
                };
            }
         };
        usermgmtErrmodule = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongooseErrStub});

        mongoosePostStub = {
            model: function() {
                return {
                    find: function(query,condition,callback) {
                        var users = [
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ]
                                }
                            
                            ]
                        var err;
                        callback(err,users); 
                    },
                    findOne: function(query,callback) {
                        var err;
                        var user = 
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ],
                                    markModified: function(message){},
                                    save: function(cb){
                                        var result = {"data":{
                                            google:{},
                                            missions:[
                                                {
                                                    name:"AZero",
                                                    currentRole:'SYS',
                                                    allowedRoles:[
                                                        {callsign:'SYS'},
                                                        {callsign:'IT'},
                                                        {callsign:'PROXY'}
                                                    ]
                                                }
                                            ]
                                        },"status":200
                                    };
                                        cb(err,result);}
                                    };
                        callback(err,user); 
                    },
                    count: function(query,callback){
                        var count = 0;
                        var err;
                        callback(err,count);
                    }
                };
            } 
        };
        usermgmtPostmodule = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongoosePostStub});

        mongoosePostErrStub = {
            model: function() {
                return {
                    find: function(query,condition,callback) {
                        var users = [
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ]
                                }
                            
                            ]
                        var err;
                        callback(err,users); 
                    },
                    findOne: function(query,callback) {
                        var err;
                        var user = 
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ],
                                    markModified: function(message){},
                                    save: function(cb){
                                        var err = {name:"MongoError"};
                                        var result = {"data":{
                                        },"status":413
                                    };
                                        cb(err,result);}
                                    };
                        callback(err,user); 
                    },
                    count: function(query,callback){
                        var count = 0;
                        var err = {name:"MongoError"};
                        callback(err,count);
                    }
                };
            } 
        };
        usermgmtPostErrmodule = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongoosePostErrStub});

        mongoosePostStub2 = {
            model: function() {
                return {
                    find: function(query,condition,callback) {
                        var users = [
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ]
                                }
                            
                            ]
                        var err;
                        callback(err,users); 
                    },
                    findOne: function(query,callback) {
                        var err;
                        var user = 
                                {
                                    google:{},
                                    missions:[

                                    ],
                                    markModified: function(message){},
                                    save: function(cb){
                                        var result = {"data":{
                                            google:{},
                                            missions:[
                                                {
                                                    name:"AZero",
                                                    currentRole:'SYS',
                                                    allowedRoles:[
                                                        {callsign:'SYS'},
                                                        {callsign:'IT'},
                                                        {callsign:'PROXY'}
                                                    ]
                                                }
                                            ]
                                        },"status":200
                                    };
                                        cb(err,result);}
                                    };
                        callback(err,user); 
                    },
                    count: function(query,callback){
                        var count = 2;
                        var err;
                        callback(err,count);
                    }
                };
            } 
        };
        usermgmtPostmodule2 = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongoosePostStub2});

        mongoosePostErrStub2 = {
            model: function() {
                return {
                    findOne: function(query,callback) {
                        var err;
                        var user = 
                                {
                                    google:{},
                                    missions:[

                                    ],
                                    markModified: function(message){},
                                    save: function(cb){
                                        var result = {"data":{
                                            google:{},
                                            missions:[
                                                {
                                                    name:"AZero",
                                                    currentRole:'SYS',
                                                    allowedRoles:[
                                                        {callsign:'SYS'},
                                                        {callsign:'IT'},
                                                        {callsign:'PROXY'}
                                                    ]
                                                }
                                            ]
                                        },"status":200
                                    };
                                        cb(err,result);}
                                    };
                        callback(err,user); 
                    },
                    count: function(query,callback){
                        var count = 2;
                        var err = {name:"MongoError"};
                        callback(err,count);
                    }
                };
            } 
        };
        usermgmtPostErrmodule2 = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongoosePostErrStub2});

        mongoosePostStub3 = {
            model: function() {
                return {
                    find: function(query,condition,callback) {
                        var users = [
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ]
                                }
                            
                            ]
                        var err;
                        callback(err,users); 
                    },
                    findOne: function(query,callback) {
                        var err;
                        var user = 
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    },{
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]

                                    }
                                    ],
                                    markModified: function(message){},
                                    save: function(cb){
                                        var result = {"data":{
                                            google:{},
                                            missions:[
                                                {
                                                    name:"AZero",
                                                    currentRole:'SYS',
                                                    allowedRoles:[
                                                        {callsign:'SYS'},
                                                        {callsign:'IT'},
                                                        {callsign:'PROXY'}
                                                    ]
                                                }
                                            ]
                                        },"status":200
                                    };
                                        cb(err,result);}
                                    };
                        callback(err,user); 
                    },
                    count: function(query,callback){
                        var count = 2;
                        var err;
                        callback(err,count);
                    }
                };
            } 
        };
        usermgmtPostmodule3 = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongoosePostStub3});

        mongoosePostErrStub3 = {
            model: function() {
                return {
                    find: function(query,condition,callback) {
                        var users = [
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    }
                                    ]
                                }
                            
                            ]
                        var err;
                        callback(err,users); 
                    },
                    findOne: function(query,callback) {
                        var err;
                        var user = 
                                {
                                    google:{},
                                    missions:[
                                    {
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]
                                    },{
                                        name:"AZero",
                                        currentRole:'MD',
                                        allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'CC'}
                                        ]

                                    }
                                    ],
                                    markModified: function(message){},
                                    save: function(cb){
                                        var result = {"data":{
                                            google:{},
                                            missions:[
                                                {
                                                    name:"AZero",
                                                    currentRole:'SYS',
                                                    allowedRoles:[
                                                        {callsign:'SYS'},
                                                        {callsign:'IT'},
                                                        {callsign:'PROXY'}
                                                    ]
                                                }
                                            ]
                                        },"status":200
                                    };
                                        cb(err,result);}
                                    };
                        callback(err,user); 
                    },
                    count: function(query,callback){
                        var count = 2;
                        var err = {name:"MongoError"};
                        callback(err,count);
                    }
                };
            } 
        };
        usermgmtPostErrmodule3 = proxyquire('../server/controllers/usermgmt.controller', {'mongoose': mongoosePostErrStub3});

    });

    it("should get all Users", function() {
        var req = {
            query : {
                mission:'AZero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = [{ allowedRoles: { CC: 1, SYS: 1 }, currentRole: "MD", google: {  } }];
    
        var spy = chai.spy.on(usermgmtmodule, 'getUsers');
        usermgmtmodule.getUsers(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get all Users when error", function() {
        var req = {
            query : {
                mission:'AZero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = [];
    
        var spy = chai.spy.on(usermgmtErrmodule, 'getUsers');
        usermgmtErrmodule.getUsers(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should get all Roles", function() {
        var req = {
            query : {
                mission:'AZero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = require('../server/config/role');
    
        var spy = chai.spy.on(usermgmtmodule, 'getRoles');
        usermgmtmodule.getRoles(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should get Current Role", function() {
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = 'MD';
    
        var spy = chai.spy.on(usermgmtmodule, 'getCurrentRole');
        usermgmtmodule.getCurrentRole(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get Current Role when error", function() {
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = null;
    
        var spy = chai.spy.on(usermgmtErrmodule, 'getCurrentRole');
        usermgmtErrmodule.getCurrentRole(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should get all allowed Roles", function() {
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = [
                        {callsign:'SYS'},
                        {callsign:'CC'}
                    ];
    
        var spy = chai.spy.on(usermgmtmodule, 'getAllowedRoles');
        usermgmtmodule.getAllowedRoles(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not get all allowed Roles when error", function() {
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        var output = null;
    
        var spy = chai.spy.on(usermgmtErrmodule, 'getAllowedRoles');
        usermgmtErrmodule.getAllowedRoles(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should post role", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:'SYS'
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {
            "data":{
                google:{},
                missions:[{
                    name:"AZero",
                    currentRole:'SYS',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }]
            },
            "status":200
        };
  
    
        var spy = chai.spy.on(usermgmtPostmodule, 'postRole');
        usermgmtPostmodule.postRole(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should not post role when error", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:'SYS'
            }
        }
        var res = {
            send: sinon.spy()
        }
               var output = {"data":{
                                        },"status":413
                                    };
    
        var spy = chai.spy.on(usermgmtPostErrmodule, 'postRole');
        usermgmtPostErrmodule.postRole(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should post roles", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {
            "data":{
                google:{},
                missions:[{
                    name:"AZero",
                    currentRole:'SYS',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }]
            },
            "status":200
        };
  
    
        var spy = chai.spy.on(usermgmtPostmodule, 'postAllowedRoles');
        usermgmtPostmodule.postAllowedRoles(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });


    it("should not post roles when error", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                roles:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {"data":{},"status":413};
    
        var spy = chai.spy.on(usermgmtPostErrmodule, 'postAllowedRoles');
        usermgmtPostErrmodule.postAllowedRoles(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
    });

    it("should set first user as 'MD' and post mission for user when no users are available for that mission", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
                        'name'     : configRole.roles['MD'].name,
                        'callsign' : configRole.roles['MD'].callsign
                    };
        var output = {
            allowedRoles: [{ callsign: "VIP", name: "Observer" }, { callsign: "MD", name: "Mission Director" }],
            currentRole: defaultRole,
            name: "AZero"
        }
  
    
        var spy = chai.spy.on(usermgmtPostmodule, 'postMissionForUser');
        usermgmtPostmodule.postMissionForUser(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
        
    });

    it("should not set first user as 'MD' and post mission for user when no users are available for that mission on error", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
                        'name'     : configRole.roles['MD'].name,
                        'callsign' : configRole.roles['MD'].callsign
                    };
        var output = {
            allowedRoles: [{ callsign: "VIP", name: "Observer" }, { callsign: "MD", name: "Mission Director" }],
            currentRole: defaultRole,
            name: "AZero"
        }
  
        var spy = chai.spy.on(usermgmtPostErrmodule, 'postMissionForUser');
        usermgmtPostErrmodule.postMissionForUser(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;        
    });

    it("should set mission for user when no missions are available", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
                        'name'     : configRole.roles['MD'].name,
                        'callsign' : configRole.roles['MD'].callsign
                    };
        var output = { 
            name: 'AZero',
            currentRole: { name: 'Observer', callsign: 'VIP' },
            allowedRoles: [ { name: 'Observer', callsign: 'VIP' } ] 
        }
  
    
        var spy = chai.spy.on(usermgmtPostmodule2, 'postMissionForUser');
        usermgmtPostmodule2.postMissionForUser(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
        
    });

    it("should not set mission for user when no missions are available on error", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
    
        var spy = chai.spy.on(usermgmtPostErrmodule2, 'postMissionForUser');
        usermgmtPostErrmodule2.postMissionForUser(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;        
    });

    it("should set mission for user when missions are available", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
                        'name'     : configRole.roles['MD'].name,
                        'callsign' : configRole.roles['MD'].callsign
                    };
        var output = {
            allowedRoles: [{ callsign: "SYS" }, { callsign: "CC" }],
            currentRole: { callsign: "VIP", name: "Observer" },
            name: "AZero"
        }
  
    
        var spy = chai.spy.on(usermgmtPostmodule3, 'postMissionForUser');
        usermgmtPostmodule3.postMissionForUser(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
        
    });

    it("should not set mission for user when missions are available on error", function() {
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }

    
        var spy = chai.spy.on(usermgmtPostErrmodule3, 'postMissionForUser');
        usermgmtPostErrmodule3.postMissionForUser(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;        
    });

});


