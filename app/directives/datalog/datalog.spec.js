describe('Testing data log controller', function () {
    var controller, dashboardService, scope, datastatesService, $intervalSpy, gridService;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope, $interval){
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['icons', 'telemetry', 'getData']);
            gridService = jasmine.createSpyObj('gridService', ['getDashboard']);
            datastatesService = jasmine.createSpyObj('datastatesService', ['colorValues', 'getDataColor']);
            scope = $rootScope.$new();
            scope.widget = {
                name: "Data Log",
                settings: {
                    active: false
                }
            };
            
            gridService.getDashboard.and.callFake(function() {
                return {
                    current:
                    {
                        name: "",
                        mission: {missionImage: "", missionName: ""},
                        widgets:
                        [
                            {
                                sizeY: 3,
                                sizeX: 4,
                                name: "Data Log",
                                directive: "datalog",
                                directiveSettings: "datalogsettings",
                                id: "datalog",
                                icon: {
                                    id: "d-log",
                                    type: "fa-list-alt"
                                },
                                main: true,
                                settings: {
                                    active: false
                                },
                                saveLoad: false,
                                delete: false
                            }
                        ]
                    }
                };
            });

            controller = $controller('DataLogCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                datastatesService: datastatesService,
                $interval: $intervalSpy,
                gridService: gridService
            });
        });

    });

    it('should define data log controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define dataStatus', function(){
        dashboardService.icons.and.callFake(function() {
            return {sIcon:"green", gIcon:"green", pIcon:"green",dIcon:"green"};
        });
        expect(scope.dataStatus).toBeDefined();
        expect(scope.dataStatus).toEqual(dashboardService.icons);
    });

    it('should define telemetry', function(){
        dashboardService.telemetry.and.callFake(function() {
            return {"time": "2018-02-16T00:26:41.439Z", "data": {} };
        });
        expect(scope.telemetry).toBeDefined();
        expect(scope.telemetry).toEqual(dashboardService.telemetry);
    });

    it('should define logdata to be an empty array', function(){
        expect(scope.logData).toBeDefined();
        expect(scope.logData).toEqual([]);
    });

    it('should define function updateLog', function(){
        expect(scope.updateLog).toBeDefined();
    });

    it('should empty the log data(new id settings) when updateLog is called', function(){
        scope.widget.settings.data = {
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx' 
        };

        scope.logData = [{
            parameter: "vx",
            value: "-0.9412", 
            timestamp: "2018-02-16T00:26:41.439Z",
            vehicle: 'A0'
        },{
            parameter: "vx",
            value: "-0.9432", 
            timestamp: "2018-02-16T00:28:41.439Z",
            vehicle: 'A0'
        }];

        scope.updateLog();
        expect(scope.logData).toEqual([]);
    });

    it('should push new data to log data(new id settings) when updateLog is called', function(){
        scope.widget.settings.data = {
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx'
        };
        scope.telemetry =  {
            "time": "2018-02-16T00:26:41.439Z",
            "data": {},
        };
        dashboardService.getData.and.callFake(function() {
            return {
                "value": -0.3201368817947103,
                "notes": ""
            };
        });
        var result1 = [{ 
            parameter: 'vx',
            value: -0.3201, 
            timestamp: '2018-02-16T00:26:41.439Z', 
            style: undefined,
            vehicle: 'A0'
        }];

        scope.updateLog();
        expect(scope.logData).toEqual(result1);
        expect(scope.logData.length).toEqual(1);

        //one more call for result to be a array of length 2
        scope.telemetry =  {
            "time": "2018-02-16T00:28:41.439Z",
            "data": {},
        };
        dashboardService.getData.and.callFake(function() {
            return {
                "value": -0.3409368817947103,
                "notes": ""
            };
        });
        var result2 = [{ 
            parameter: 'vx',
            value: -0.3201, 
            timestamp: '2018-02-16T00:26:41.439Z', 
            style: undefined,
            vehicle: 'A0'
        },{ 
            parameter: 'vx',
            value: -0.3409, 
            timestamp: '2018-02-16T00:28:41.439Z', 
            style: undefined,
            vehicle: 'A0'
        }]

        scope.updateLog();
        expect(scope.logData).toEqual(result2);
        expect(scope.logData.length).toEqual(2);
    });
    
    it('should define autoScroll', function() {
        expect(scope.autoScroll).toBeDefined();
    });

    it('should call $interval one time', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    });

    it('should call $interval on updateLog function', function(){
        expect($intervalSpy).toHaveBeenCalledWith(scope.updateLog, 1000, 0, false);
    });

    it('should cancel interval when scope is destroyed', function(){
        spyOn($intervalSpy, 'cancel');
        scope.$destroy();
        expect($intervalSpy.cancel.calls.count()).toBe(1);
    });

});
