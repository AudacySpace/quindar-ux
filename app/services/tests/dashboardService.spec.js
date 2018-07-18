describe('Testing dashboardService', function () {
    var gridService, dashboardService, httpBackend, interval;

    var modalInstance = { open: function() {} };

    beforeEach(function () {
        // load the module
        module('app');

        gridService = jasmine.createSpyObj('gridService', ['getDashboard', 'getMissionImage', 'setMissionForLayout']);

        module(function($provide) {
            $provide.value('gridService', gridService);
            $provide.value('$uibModal', modalInstance);
        });

        gridService.getDashboard.and.callFake(function() {
            return { 'current' : {
                mission : { missionName : ""},
                widgets : [],
                name : "Home-2"
            }}
        });

        gridService.getMissionImage.and.callFake(function() {
            return "ABC.svg"
        });

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _dashboardService_, _$interval_) {
            dashboardService = _dashboardService_;
            httpBackend = _$httpBackend_;
            interval = _$interval_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //dashboardService should exist in the application
    it('should define the service dashboardService', function() {
    	expect(dashboardService).toBeDefined();
    });

    it('should define the default locks variable', function() {
        expect(dashboardService.locks).toBeDefined();
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the default icons variable', function() {
        expect(dashboardService.icons).toBeDefined();
        expect(dashboardService.icons).toEqual({ sIcon:"", gIcon:"", pIcon:"",dIcon:"" });
    });

    it('should define the default telemetry and missions variable', function() {
        expect(dashboardService.telemetry).toEqual({});
        expect(dashboardService.missions).toEqual([]);
    });

    it('should get missions and show a modal to select mission', function() {
        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };
        spyOn(modalInstance, 'open').and.returnValue(fakeModal);

        var missionList = [{
            missionName : 'ATest',
            missionImage : 'ABC.svg'
        }, {
            missionName : 'AZero',
            missionImage : 'ABC.svg'
        }];

        var missions = [{mission : 'ATest'}, {mission : 'AZero'}];
        httpBackend.expectGET('/getMissions').respond(200, missions); 

        httpBackend.flush();

        expect(dashboardService.missions).toEqual(missionList);
        expect(modalInstance.open).toHaveBeenCalled();

        gridService.getDashboard.and.callFake(function() {
            return { 'current' : {
                mission : { missionName : "Atest"},
                widgets : [],
                name : "Home-2"
            }}
        });
    });

    it('should define the getLock function', function() {
        expect(dashboardService.getLock).toBeDefined();
    });

    it('should return the locks variable when getLocks is called', function() {
        expect(dashboardService.getLock()).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the setLeftLock function', function() {
        expect(dashboardService.setLeftLock).toBeDefined();
    });

    it('should set the left lock on dashboard when setLeftLock function is called', function() {
        dashboardService.setLeftLock(true);
        expect(dashboardService.locks).toEqual({ lockLeft : true, lockRight : false });
        
        dashboardService.setLeftLock(false);
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the setRightLock function', function() {
        expect(dashboardService.setRightLock).toBeDefined();
    });

    it('should set the right lock on dashboard when setRightLock function is called', function() {
        dashboardService.setRightLock(true);
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : true });
        
        dashboardService.setRightLock(false);
        expect(dashboardService.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define the getTime function', function() {
        expect(dashboardService.getTime).toBeDefined();
    });

    it('should get the default time (time variable undefined) when getTime function is called', function() {
        var result = dashboardService.getTime(0);
        var expected = { 
            today: undefined, 
            days: '000', 
            hours: '00', 
            minutes: '00', 
            seconds: '00', 
            utc: '000.00:00:00 UTC' 
        }

        expect(result).toEqual(expected);
    });

    it('should define the countdown function', function() {
        expect(dashboardService.countdown).toBeDefined();
    });

    it('should get the default countdown (time variable undefined) when countdown function is called', function() {
        var time = "2018-02-01T09:42:01.287Z";
        var result = dashboardService.countdown(time);
        var expected = { 
            days: '000', 
            hours: '00', 
            minutes: '00', 
            seconds: '00', 
            sign : ''
        }

        expect(result).toEqual(expected);
    });

    it('should get the proxy status and update icons', function() {
        var response = {proxytimestamp: 1511291637};

        httpBackend.expectGET('/getProxyStatus').respond(200, response); 
        interval.flush(5010);
        httpBackend.flush();

        //green as previous timestamp not equal to current one
        expect(dashboardService.icons.pIcon).toEqual('green');

        httpBackend.expectGET('/getProxyStatus').respond(200, response); 
        interval.flush(5010);
        httpBackend.flush();

        //red as previous timestamp equal to current one
        expect(dashboardService.icons).toEqual({ sIcon: 'grey', gIcon: 'grey', pIcon: 'red', dIcon: 'green' });
    });

    it('should get the proxy status(empty)', function() {
        var response = "";

        httpBackend.expectGET('/getProxyStatus').respond(200, response); 

        interval.flush(5010);
        httpBackend.flush();
        expect(dashboardService.icons.pIcon).toEqual('grey');
    });

    it('should get the proxy status(error)', function() {
        var response = "";

        httpBackend.expectGET('/getProxyStatus').respond(404, response); 

        interval.flush(5010);
        httpBackend.flush();
        expect(dashboardService.icons).toEqual({ sIcon: 'grey', gIcon: 'grey', pIcon: 'grey', dIcon: 'red' });
    });

    it('should define the isEmpty function', function() {
        expect(dashboardService.isEmpty).toBeDefined();
    });

    it('should return return true if object empty when isEmpty is called', function() {
        var obj = {};
        var result = dashboardService.isEmpty(obj);

        expect(result).toEqual(true);
    });

    it('should return return false if object is non-empty when isEmpty is called', function() {
        var obj = { time : 0 };
        var result = dashboardService.isEmpty(obj);

        expect(result).toEqual(false);
    });

    it('should define the sortObject function', function() {
        expect(dashboardService.sortObject).toBeDefined();
    });

    it('should return return sorted object(alphabetical keys) when sortObject is called', function() {
        var obj = {
            'Velocity' : {},
            'Attitude' : {},
            'Position' : {},
            'Command' : {}
        };
        var result = dashboardService.sortObject(obj);

        expect(result).toEqual({
            'Attitude' : {},
            'Command' : {},
            'Position' : {},
            'Velocity' : {}
        });
    });

    it('should define the getData function', function() {
        expect(dashboardService.getData).toBeDefined();
    });

    it('should define the setCurrentMission function', function() {
        expect(dashboardService.setCurrentMission).toBeDefined();
    });

    it('should define the getCurrentMission function', function() {
        expect(dashboardService.getCurrentMission).toBeDefined();
    });

    it('should define the getConfig function', function() {
        expect(dashboardService.getConfig).toBeDefined();
    });

    it('should be able to retrieve the configurations from database', function () {
        var mission = "ATest";
        var result = {
            'A0' : {
                'GNC' : {
                    'Attitude': {
                        'q1' : ""
                    }
                }
            }
        };
        var config;
 
        httpBackend.expectGET('/getConfig?mission=ATest').respond(200, result);

        dashboardService.getConfig(mission).then( function(response){
            config = response.data;
            expect(response.status).toBe(200);
            expect(config).toBeDefined();
            expect(config).toEqual(result);
        });

        httpBackend.flush();
    });

    it('should define the getTelemetryValues function', function() {
        expect(dashboardService.getTelemetryValues).toBeDefined();
    });
});
