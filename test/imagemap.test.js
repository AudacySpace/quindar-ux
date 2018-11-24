var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var IMap = require('../server/models/imagemap');
var proxyquire = require('proxyquire');


describe('Test Suite for System Maps Route Controller', function() {
    var mapmodule,mongooseStub,mongooseErrStub,mapErrmodule;
    var ispy;
 
    before(function() {
        mongooseStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var mapdata = {
                            uploadedfiles:[{
                                "contentsfile": "imagedata.json",
                                "imagefile": "image2.1.jpg",
                                "contents": [
                                    {
                                        "id": "solararrayvalue",
                                        "coords": {
                                            "left": "25%",
                                            "top": "5%",
                                            "position": "absolute"
                                        }
                                    }
                                ],
                                "image":"",
                                "imageid":"PowerSystem"
                            }]};
                        var err;
                        callback(err,mapdata); 
                    } 
                };
            } 
        };
        mapmodule = proxyquire('../server/controllers/imagemap.controller', {'mongoose': mongooseStub});

        mongooseErrStub = {
            model: function() {
                return {
                    findOne: function(query, callback) {
                        var mapdata = {uploadedfiles:[]};
                        var err = { name:"MongoError"};
                        callback(err,mapdata); 
                    } 
                };
            } 
        };
        mapErrmodule = proxyquire('../server/controllers/imagemap.controller', {'mongoose': mongooseErrStub});
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
        var output = [{ 
                        "contentsfile": "imagedata.json",
                        "imagefile": "image2.1.jpg",
                        "contents": [
                            {
                                "id": "solararrayvalue",
                                "coords": {
                                    "left": "25%",
                                    "top": "5%",
                                    "position": "absolute"
                                }
                            }
                        ],
                        "image":"",
                        "imageid":"PowerSystem"
                    }];

    
        var spy = chai.spy.on(mapmodule, 'getMaps');
        mapmodule.getMaps(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output)
    });

    it("should not get system maps when error", function() {
        var req = {
            query : {
                mission:'Azero'
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = []
    
        var spy = chai.spy.on(mapErrmodule, 'getMaps');
        mapErrmodule.getMaps(req, res);
        expect(spy).to.have.been.called();
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
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
            assert.isNull(err);
        });    

    });

    it('should invalidate when mission is not a string type and uploadedfiles is an array', function () {
        var m = new IMap({mission:{},uploadedfiles: [{},{}]});

        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).to.equal('CastError');
            assert.isUndefined(err.errors.uploadedfiles);
        });
     
    });

    it('should invalidate when mission is a string type and uploadedfiles is an empty array', function () {
        var m = new IMap({mission: 'AZero',uploadedfiles:[]});
        m.validate(function(err) {
            expect(err.errors.uploadedfiles).to.exist;
            expect(err.errors.uploadedfiles.name).to.equal('ValidatorError');
            assert.isUndefined(err.errors.mission);
        });
    });

    it('should invalidate when mission is not a string type and uploadedfiles is not an array', function () {
        var m = new IMap({mission: {},uploadedfiles: []});
        m.validate(function(err) {
            expect(err.errors.mission).to.exist;
            expect(err.errors.mission.name).to.equal('CastError');
            expect(err.errors.uploadedfiles).to.exist;
            expect(err.errors.uploadedfiles.name).to.equal('ValidatorError');
        });
    });
});
