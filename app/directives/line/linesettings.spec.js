describe('Testing lineplot settings controller', function () {
    var controller, scope, dashboardService, sidebarService,
        sideNavOpenMock, $interval;

    var windowMock = {
        alert : function() {},
        innerWidth: 1000
    };

    beforeEach(function () {
        // load the module
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
            sideNavOpenMock = jasmine.createSpy();
            $provide.factory('$mdSidenav', function() {
                return function(sideNavId){
                    return { open: sideNavOpenMock };
                };
            });
        });

        inject(function($controller, $rootScope, _$interval_){
            $interval = _$interval_;
            sidebarService = jasmine.createSpyObj('sidebarService', ['getVehicleInfo']);;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getLock', 'setLeftLock', 'sortObject','getData', 'isEmpty', 'telemetry']);
            scope = $rootScope.$new();
            scope.widget = {
                name: "Line Plot",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                    data : {
                        vehicles : [],
                        value : "", 
                        key: ""
                    }
                }
            };

            dashboardService.telemetry.and.callFake(function() {
                return {"time": "2018-02-16T00:26:41.439Z", "data": { "A1" : {}, "A0" : {} } };
            });
            dashboardService.isEmpty.and.callFake(function() {
                return false;
            });

            controller = $controller('LineSettingsCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                sidebarService: sidebarService,
                $interval: $interval
            });
        });

    });

    it('line settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should assign default value to settings variable', function() {
        var expected = {
            vehicles : [],
            data : {
                id: '',
                vehicle: '',
                key: ''
            }
        };
        expect(scope.settings).toEqual(expected);
    });

    it('should define interval variable', function() {
        expect(scope.interval).toBeDefined();
    });

    it('should get the configuration of the current mission and set the vehicles', function(){
        var vehicles = [{
            'key': 1,
            'value': 'A0',
            'checked': false,
            'color' : '#0AACCF'
        }, {
            'key': 2,
            'value': 'A1',
            'checked': false,
            'color' : '#FF9100' 
        }];

        dashboardService.sortObject.and.callFake(function(){
            return {
                'A0' : {
                    'GNC' : {
                        'Attitude': {
                            'q1' : ""
                        },
                        'Velocity' : {
                            'vx' : ""
                        }
                    }
                }, 
                'A1' : {
                    'GNC' : {}
                }
            }
        });

        $interval.flush(1001);

        expect(scope.settings.vehicles).toEqual(vehicles);
        $interval.cancel(scope.interval);
    });

    it('should define function closeWidget', function() {
        expect(scope.closeWidget).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.closeWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should define function saveWidget', function() {
        expect(scope.saveWidget).toBeDefined();
    });

    it('should not close the settings menu on save if data is not selected', function() {
        scope.settings.data = {
            id: '',
            vehicle: '',
            key: ''
        };
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).not.toEqual(true);
        expect(scope.widget.settings.active).not.toEqual(false);
    });

    it('should close the settings menu on save if data is selected', function() {
        var expectedVehicles = [{
            'key': 'A0.GNC.velocity.vx',
            'name': 'A0',
            'color' : '#0AACCF'    
        }];
        scope.settings.data = {
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx'
        };
        scope.settings.vehicles = [{
            'key': 1,
            'value': 'A0',
            'checked': true,
            'color' : '#0AACCF'    
        }, {
            'key': 2,
            'value': 'A1',
            'checked': false,
            'color' : '#FF9100' 
        }];
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.data.key).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data.value).toEqual('vx');
        expect(scope.widget.settings.data.vehicles).toEqual(expectedVehicles);
    });

    it('should alert he user on save if data is selected but none of the vehicles is checked', function() {
        spyOn(windowMock, "alert");

        scope.settings.data = {
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx'
        };
        scope.settings.vehicles = [{
            'key': 1,
            'value': 'A0',
            'checked': false,
            'color' : '#0AACCF'    
        }, {
            'key': 2,
            'value': 'A1',
            'checked': false,
            'color' : '#FF9100' 
        }];
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).not.toEqual(true);
        expect(scope.widget.settings.active).not.toEqual(false);
        expect(scope.widget.settings.data.key).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data.value).toEqual('vx');
        expect(scope.widget.settings.data.vehicles).toEqual([]);
        expect(windowMock.alert).toHaveBeenCalledWith("Please select atleast one vehicle and save!");
    });

    it('should define function getTelemetrydata', function() {
        expect(scope.getTelemetrydata).toBeDefined();
    });

    it('should open the left sidebar/Data Menu when function is called(window width < 1400)', function() {
        scope.getTelemetrydata();

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
    });

    it('should open the left sidebar/Data Menu when function is called(window width > 1400)', function() {
        windowMock.innerWidth = 1440;

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : false, lockRight : false }
        });

        scope.getTelemetrydata();

        expect(scope.lock).toEqual({ lockLeft : true, lockRight : false });
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(true);
    });

    it('should define function getValue', function() {
        expect(scope.getValue).toBeDefined();
    });

    it('should alert the user if the vehicle and id from the left menu are not available', function() {
        spyOn(windowMock, "alert");
        var data = {
            parameters:[]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue();

        expect(windowMock.alert).toHaveBeenCalledWith("Vehicle data not set. Please select from Data Menu");
    });

    it('should store the value of selected vehicle and id in scope.settings variable', function() {
        windowMock.innerWidth = 1000;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'velocity' 
        };
        var data = {
            parameters:[]
        }

        data.parameters[0] = vehicleInfo;

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });
        dashboardService.getData.and.callFake(function(){
            return {
                "value": 7.5977371245409495,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            }
        });

        scope.getValue();

        expect(scope.settings.data).toEqual(vehicleInfo);
    });

    it('should close the left menu after storing data into variable(window width>1400)', function() {
        windowMock.innerWidth = 1440;
        scope.lock = { lockLeft : true, lockRight : false }
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'velocity'
        };

        var data = {
            parameters:[]
        }

        data.parameters[0] = vehicleInfo;

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        dashboardService.getData.and.callFake(function(){
            return {
                "value": 7.5977371245409495,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            }
        });

        scope.getValue();

        expect(scope.settings.data).toEqual(vehicleInfo);
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
    });

    it('should mark the vehicle equal to the selected vehicle as checked', function() {
        windowMock.innerWidth = 1000;
        scope.settings.vehicles = [{
            'key': 1,
            'value': 'A0',
            'checked': false,
            'color' : '#0AACCF'    
        }, {
            'key': 2,
            'value': 'A1',
            'checked': false,
            'color' : '#FF9100' 
        }];
        var result = [{
            'key': 1,
            'value': 'A0',
            'checked': true,
            'color' : '#0AACCF'    
        }, {
            'key': 2,
            'value': 'A1',
            'checked': false,
            'color' : '#FF9100' 
        }];

        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'velocity'
        };

        var data = {
            parameters:[]
        }

        data.parameters[0] = vehicleInfo;

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        dashboardService.getData.and.callFake(function(){
            return {
                "value": 7.5977371245409495,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            }
        });

        scope.getValue();

        expect(scope.settings.vehicles).toEqual(result);

    });

    it('should define function createVehicleData', function() {
        expect(scope.createVehicleData).toBeDefined();
    });

    it('should add new vehicle in scope settings if it is there in the telemetry data', function() {
        scope.settings.vehicles = [{
            'key': 1,
            'value': 'A0',
            'checked': true,
            'color' : '#0AACCF'
        }, {
            'key': 2,
            'value': 'A1',
            'checked': false,
            'color' : '#FF9100'
        }];

        var vehicles = [{
            'key': 1,
            'value': 'A0',
            'checked': true,
            'color' : '#0AACCF'
        }, {
            'key': 2,
            'value': 'A1',
            'checked': false,
            'color' : '#FF9100'
        }, {
            'key': 3,
            'value': 'A2',
            'checked': false,
            'color' : '#64DD17'
        }];

        dashboardService.sortObject.and.callFake(function(){
            return {
                'A0' : {
                    'GNC' : {
                        'Attitude': {
                            'q1' : ""
                        },
                        'Velocity' : {
                            'vx' : ""
                        }
                    }
                },
                'A1' : {
                    'GNC' : {}
                },
                'A2' : {
                    'GNC' : {}
                }
            }
        });

        $interval.flush(1001);

        expect(scope.settings.vehicles).toEqual(vehicles);
    });
})