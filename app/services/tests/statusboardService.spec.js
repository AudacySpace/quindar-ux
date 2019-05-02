describe('Testing statusboardService', function () {
    var dashboardService, datastatesService, statusboardService, httpBackend;

    beforeEach(function () {
        // load the module
        module('app');

        dashboardService = jasmine.createSpyObj('dashboardService', ['getCurrentMission', 'isEmpty']);
        datastatesService = jasmine.createSpyObj('datastatesService', ['colorBoundObj']);

        module(function($provide) {
            $provide.value('dashboardService', dashboardService);
            $provide.value('datastatesService', datastatesService);
        });

        dashboardService.getCurrentMission.and.callFake(function() {
            return { missionName : 'ATest' };
        });

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _statusboardService_) {
            statusboardService = _statusboardService_;
            httpBackend = _$httpBackend_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //statusboardService should exist in the application
    it('should define the service statusboardService', function() {
    	expect(statusboardService).toBeDefined();
    });

    it('should define the saveAlerts function', function() {
        expect(statusboardService.saveAlerts).toBeDefined();
    });

    it('should be able to save the alerts in command history', function () {
        var statusdata = {};
        var vehicleColors = {};

        httpBackend.expectPOST("/saveAlerts").respond(200, {});

        statusboardService.saveAlerts(statusdata, vehicleColors).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should define the loadAlerts function', function() {
        expect(statusboardService.loadAlerts).toBeDefined();
    });

    it('should be able to load alerts from database', function () {
        var result = {
            statusboard : [
            {
                "alert": "CAUTION",
                "bound": "LOW",
                "vehicle": "A0",
                "time": "042.10:34:03 UTC",
                "channel": "A0.GNC.velocity.vz",
                "ack": "",
                "timestamp": 1518345244
            },
            {
                "alert": "CAUTION",
                "bound": "LOW",
                "vehicle": "A0",
                "time": "042.10:33:00 UTC",
                "channel": "A0.GNC.velocity.vx",
                "ack": "",
                "timestamp": 1518345181
            }],
            vehiclecolors : [{
                status: false, 
                vehicle: "A0"
            }]
        };
        var alertsBoard;
 
        httpBackend.expectGET('/loadAlerts?missionname=ATest').respond(200, result);
 
        statusboardService.loadAlerts().then( function(response){
            alertsBoard = response.data;
            expect(response.status).toBe(200);
            expect(alertsBoard).toBeDefined();
            expect(alertsBoard).toEqual(result);
        });

        httpBackend.flush();
    });

    it('should define the setSubSystemColors function', function() {
        expect(statusboardService.setSubSystemColors).toBeDefined();
    });

    it('should set the colors of all alarms(green color) when setSubSystemColors function is called', function() {
        datastatesService.colorBoundObj = { 
            alarm:{
                color:"#FF0000",
                alert:"ALARM",
                bound:"",
            },
            caution:{
                color:"#FFFF00",
                alert:"CAUTION",
                bound:""
            },
            healthy:{
                color:"#12C700",
                alert:"",
                bound:"NORMAL"
            }

        };
        dashboardService.isEmpty.and.callFake(function() {
            return false;
        });
        
        var contents = [{
            ackStatus : false,
            categories : ["GNC"],
            categoryColors : [{background: "#12C700"}],
            flexprop : 100,
            subCategoryColors : ["#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", 
            "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700"],
            tableArray : [],
            vehicle : "A0",
            vehicleColor : {background: "#12C700"}
        }];

        var result = {
            statusboard : [
            {
                "alert": "CAUTION",
                "bound": "LOW",
                "vehicle": "A0",
                "time": "042.10:34:03 UTC",
                "channel": "A0.GNC.velocity.vz",
                "ack": "",
                "timestamp": 1518345244
            }],
            vehiclecolors : [{
                status: false, 
                vehicle: "A0"
            }]
        };
 
        httpBackend.expectGET('/loadAlerts?missionname=ATest').respond(200, result);
        statusboardService.setSubSystemColors(contents);
        httpBackend.flush();
        
        expect(statusboardService.getMasterAlarmColors())
        .toEqual({ colorclasses: [ 'buttonNone' ], checkedstatus: [ true ] });

        statusboardService.setAlertsTable();

        expect(statusboardService.getStatusTable())
        .toEqual({statustable : [
            {
                "alert": "CAUTION",
                "bound": "LOW",
                "vehicle": "A0",
                "time": "042.10:34:03 UTC",
                "channel": "A0.GNC.velocity.vz",
                "ack": "",
                "timestamp": 1518345244,
                "rowstyle" : {color: '#CFCFD5' }
            }] });
    });

    it('should set the colors of all alarms(red color) when setSubSystemColors function is called', function() {
        datastatesService.colorBoundObj = { 
            alarm:{
                color:"#FF0000",
                alert:"ALARM",
                bound:"",
            },
            caution:{
                color:"#FFFF00",
                alert:"CAUTION",
                bound:""
            },
            healthy:{
                color:"#12C700",
                alert:"",
                bound:"NORMAL"
            }

        };
        dashboardService.isEmpty.and.callFake(function() {
            return false;
        });
        
        var contents = [{
            ackStatus : false,
            categories : ["GNC"],
            categoryColors : [{background: "#FF0000"}],
            flexprop : 100,
            subCategoryColors : [["#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", 
            "#12C700", "#12C700", "#12C700", "#FF0000", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700"]],
            tableArray : [],
            vehicle : "A0",
            vehicleColor : {background: "#FF0000"}
        }];

        var result = {
            statusboard : [
            {
                "alert": "ALARM",
                "bound": "LOW",
                "vehicle": "A0",
                "time": "042.10:34:03 UTC",
                "channel": "A0.GNC.velocity.vz",
                "ack": "",
                "timestamp": 1518345244
            }],
            vehiclecolors : [{
                status: false, 
                vehicle: "A0"
            }]
        };
 
        httpBackend.expectGET('/loadAlerts?missionname=ATest').respond(200, result);
        statusboardService.setSubSystemColors(contents);
        httpBackend.flush();
        
        expect(statusboardService.getMasterAlarmColors())
        .toEqual({ colorclasses: [ 'buttonred' ], checkedstatus: [ false ] });
    });

    it('should set the colors of all alarms(yellow color) when setSubSystemColors function is called', function() {
        datastatesService.colorBoundObj = { 
            alarm:{
                color:"#FF0000",
                alert:"ALARM",
                bound:"",
            },
            caution:{
                color:"#FFFF00",
                alert:"CAUTION",
                bound:""
            },
            healthy:{
                color:"#12C700",
                alert:"",
                bound:"NORMAL"
            }

        };
        dashboardService.isEmpty.and.callFake(function() {
            return false;
        });
        
        var contents = [{
            ackStatus : false,
            categories : ["GNC"],
            categoryColors : [{background: "#FFFF00"}],
            flexprop : 100,
            subCategoryColors : [["#12C700", "#FFFF00", "#12C700", "#12C700", "#12C700", "#12C700", 
            "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700"]],
            tableArray : [],
            vehicle : "A0",
            vehicleColor : {background: "#FFFF00"}
        }];

        var result = {
            statusboard : [
            {
                "alert": "CAUTION",
                "bound": "LOW",
                "vehicle": "A0",
                "time": "042.10:34:03 UTC",
                "channel": "A0.GNC.velocity.vz",
                "ack": "",
                "timestamp": 1518345244
            }],
            vehiclecolors : [{
                status: false, 
                vehicle: "A0"
            }]
        };
 
        httpBackend.expectGET('/loadAlerts?missionname=ATest').respond(200, result);
        statusboardService.setSubSystemColors(contents);
        httpBackend.flush();
        
        expect(statusboardService.getMasterAlarmColors())
        .toEqual({ colorclasses: [ 'buttonyellow' ], checkedstatus: [ false ] });
    });

    it('should define the setAlertsTable function', function() {
        expect(statusboardService.setAlertsTable).toBeDefined();
    });

    it('should set the alerts table variable when setAlertsTable function is called', function() {
        datastatesService.colorBoundObj = { 
            alarm:{
                color:"#FF0000",
                alert:"ALARM",
                bound:"",
            },
            caution:{
                color:"#FFFF00",
                alert:"CAUTION",
                bound:""
            },
            healthy:{
                color:"#12C700",
                alert:"",
                bound:"NORMAL"
            }

        };
        dashboardService.isEmpty.and.callFake(function() {
            return false;
        });
        
        var contents = [{
            ackStatus : false,
            categories : ["GNC"],
            categoryColors : [{background: "#12C700"}],
            flexprop : 100,
            subCategoryColors : ["#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", 
            "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700", "#12C700"],
            tableArray : [],
            vehicle : "A0",
            vehicleColor : {background: "#12C700"}
        }];
        var options = [{
            "alert": "CAUTION",
            "bound": "LOW",
            "vehicle": "A0",
            "time": "042.10:34:03 UTC",
            "channel": "A0.GNC.velocity.vz",
            "ack": "",
            "timestamp": 1518345244,
            "rowstyle" : { color: '#CFCFD5' }
        }];

        var result = {
            statusboard : options,
            vehiclecolors : [{
                status: false, 
                vehicle: "A0"
            }]
        };

        var alarmpanel = { statustable : options };
 
        httpBackend.expectGET('/loadAlerts?missionname=ATest').respond(200, result);
        statusboardService.setSubSystemColors(contents);
        httpBackend.flush();

        statusboardService.setAlertsTable();

        expect(statusboardService.getStatusTable()).toEqual(alarmpanel);
    });
});
