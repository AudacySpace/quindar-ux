describe('Testing alarm panel controller', function () {
    var controller, dashboardService, scope, 
        datastatesService, userService, statusboardService, $interval;
    var alarmpanel = {};

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope, _$interval_){
            $interval = _$interval_;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['sortObject', 'telemetry', 'isEmpty']);
            datastatesService = jasmine.createSpyObj('datastatesService', ['getDataColorBound']);
            userService = jasmine.createSpyObj('userService', ['getUserName', 'userRole']);
            statusboardService = jasmine.createSpyObj('statusboardService', 
                ['getStatusTable', 'getMasterAlarmColors', 'saveAlerts', 'setSubSystemColors', 'setAlertsTable']);

            statusboardService.getStatusTable.and.callFake(function() {
                var options = [{
                    "alert": "CAUTION",
                    "bound": "LOW",
                    "vehicle": "A0",
                    "time": "2018-02-16T00:26:41.439Z",
                    "channel": "A0.GNC.velocity.vz",
                    "ack": "",
                    "timestamp": 1518740801,
                    "rowstyle" : { color: '#CFCFD5' }
                }];

                alarmpanel = { statustable : options };
                return alarmpanel;
            });

            userService.getUserName.and.callFake(function(){
                return 'John Smith';
            });

            statusboardService.getMasterAlarmColors.and.callFake(function(){
                return { colorclasses: [ 'buttonNone' ], checkedstatus: [ true ] };
            });

            scope = $rootScope.$new();
            scope.widget = {
                name: "Alarm Panel",
                settings: {
                    active: false
                }
            };

            controller = $controller('AlarmPanelCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                datastatesService: datastatesService,
                userService: userService,
                statusboardService: statusboardService,
                $interval: $interval
            });
        });

    });

    it('should define alarm panel controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define telemetry', function(){
        dashboardService.telemetry.and.callFake(function() {
            return {"time": "2018-02-16T00:26:41.439Z", "data": {"A0" : {}} };
        });
        expect(scope.telemetry).toBeDefined();
        expect(scope.telemetry).toEqual(dashboardService.telemetry);
    });

    it('should define alarmpanel', function(){
        expect(scope.alarmpanel).toBeDefined();
        expect(scope.alarmpanel).toEqual(alarmpanel);
    });

    it('should define name as the user name', function(){
        expect(scope.name).toBeDefined();
        expect(scope.name).toEqual('John Smith');
    });

    it('should define role as the user role', function(){
        expect(scope.role).toBeDefined();
        expect(scope.role).toEqual(userService.userRole);
    });

    it('should define empty default variables', function(){
        expect(scope.contents).toEqual([]);
        expect(scope.class).toEqual([]);
        expect(scope.vehicleColors).toEqual([]);
    });

    it('should define masteralarmstatus', function(){
        expect(scope.masteralarmstatus).toBeDefined();
        expect(scope.masteralarmstatus).toEqual({ 
            colorclasses: [ 'buttonNone' ], 
            checkedstatus: [ true ] 
        });
    });

    it('should get the configuration of the current mission', function(){
        var expectedcolors = [{ vehicle: 'A0', status: false }];
        var expectedContents = [{ 
            vehicle: 'A0', 
            flexprop: 100, 
            categories: [ 'GNC' ], 
            vehicleColor: '', 
            categoryColors: [  ], 
            tableArray: [  ], 
            subCategoryColors: [  ], 
            ackStatus: false 
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
                }
            }
        });

        $interval.flush(1001);

        expect(scope.vehicleColors).toEqual(expectedcolors);
        expect(scope.contents).toEqual(expectedContents);

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
                    },
                    'CMD' : {
                        'Position': {
                            'x' : ""
                        },
                        'Velocity' : {
                            'vx' : ""
                        }
                    }
                },
                'A1' : {
                    'VPR' : {
                        'Position': {
                            'x' : ""
                        },
                        'Velocity' : {
                            'vx' : ""
                        }
                    }
                }
            }
        });

        var expectedcolors_2 = [{ vehicle: 'A0', status: false }, { vehicle: 'A1', status: false }];
        var expectedContents_2 = [{
            vehicle: 'A0',
            flexprop: 50,
            categories: [ 'GNC', 'CMD' ],
            vehicleColor: '',
            categoryColors: [  ],
            tableArray: [  ],
            subCategoryColors: [  ],
            ackStatus: false
        },{
            vehicle: 'A1',
            flexprop: 50,
            categories: [ 'VPR' ],
            vehicleColor: '',
            categoryColors: [  ],
            tableArray: [  ],
            subCategoryColors: [  ],
            ackStatus: false
        }];

        $interval.flush(1001);

        expect(scope.vehicleColors).toEqual(expectedcolors_2);
        expect(scope.contents).toEqual(expectedContents_2);
    });

    it('should define function updateColors', function(){
        expect(scope.updateColors).toBeDefined();
    });

    it('should not call saveAlerts when no alert, but call setAlertsTable when updateColors is called', function(){
        dashboardService.isEmpty.and.callFake(function() {
            return false;
        });
        datastatesService.getDataColorBound.and.callFake(function(){
            return {color: "#12C700", alert: "", bound: "NORMAL"};
        });

        scope.vehicleColors = [{ vehicle: 'A0', status: false }];
        scope.contents = [{ 
            vehicle: 'A0', 
            flexprop: 100, 
            categories: [ 'GNC' ], 
            vehicleColor: '', 
            categoryColors: [  ], 
            tableArray: [  ], 
            subCategoryColors: [  ], 
            ackStatus: false 
        }];
        scope.telemetry = {
            'A0' : {
                'GNC' : {
                    'Velocity' : {
                        'vx' : {
                            "value": -0.3201368817947103,
                            "warn_high": "10",
                            "warn_low": "-10",
                            "alarm_high": "14",
                            "alarm_low": "-14",
                            "units": "km/s",
                            "name": "x velocity component in ECF",
                            "category": "velocity"
                        }
                    },
                    'Attitude': {
                        'q1' : {
                            "value": -0.01067129880293613,
                            "warn_high": "1",
                            "warn_low": "-1",
                            "alarm_high": "1.1",
                            "alarm_low": "-1.1",
                            "units": "",
                            "name": "quaternion q1",
                            "category": "attitude"
                        }
                    }
                }
            },
            "time": "2018-02-16T00:26:41.439Z"
        };

        scope.updateColors();

        expect(statusboardService.saveAlerts).not.toHaveBeenCalled();
        expect(statusboardService.setSubSystemColors).toHaveBeenCalledWith(scope.contents);
        expect(statusboardService.setAlertsTable).toHaveBeenCalled();
    });

    it('should call saveAlerts when an alert is there, and call setAlertsTable when updateColors is called', function(){
        var expectedTable = [{ 
            alert: 'ALARM', 
            bound: 'HIGH', 
            vehicle: 'A0', 
            time: '2018-02-16T00:26:41.439Z',
            channel: 'A0.GNC.Velocity.vx', 
            ack: '', 
            timestamp: 1518740801
        }];

        dashboardService.isEmpty.and.callFake(function() {
            return false;
        });
        datastatesService.getDataColorBound.and.callFake(function(){
            return {color: "#FF0000", alert: "ALARM", bound: "HIGH"};
        });

        scope.vehicleColors = [{ vehicle: 'A0', status: false }];
        scope.contents = [{ 
            vehicle: 'A0', 
            flexprop: 100, 
            categories: [ 'GNC' ], 
            vehicleColor: '', 
            categoryColors: [  ], 
            tableArray: [  ], 
            subCategoryColors: [  ], 
            ackStatus: false 
        }];
        scope.telemetry = {
            'A0' : {
                'GNC' : {
                    'Velocity' : {
                        'vx' : {
                            "value": -0.3201368817947103,
                            "warn_high": "10",
                            "warn_low": "-10",
                            "alarm_high": "14",
                            "alarm_low": "-14",
                            "units": "km/s",
                            "name": "x velocity component in ECF",
                            "category": "velocity"
                        }
                    }
                }
            },
            "time": "2018-02-16T00:26:41.439Z"
        };

        scope.updateColors();

        expect(scope.contents[0].tableArray).toEqual(expectedTable);
        expect(scope.contents[0].subCategoryColors).toEqual([ '#FF0000' ]);
        expect(statusboardService.saveAlerts).toHaveBeenCalled();
        expect(statusboardService.setSubSystemColors).toHaveBeenCalledWith(scope.contents);
        expect(statusboardService.setAlertsTable).toHaveBeenCalled();
    });

    it('should define function addtablerow', function(){
        expect(scope.addtablerow).toBeDefined();
    });

    it('should add a row in statustable when function addtablerow is called', function(){
        var vehicle = 'A0';
        var index = 0;
        var vehicleColor = {
            background : "#FF0000"
        };
        scope.contents = [{ 
            vehicle: 'A0', 
            flexprop: 100, 
            categories: [ 'GNC' ], 
            vehicleColor: '', 
            categoryColors: [  ], 
            tableArray: [ { 
                alert: 'ALARM', 
                bound: 'HIGH', 
                vehicle: 'A0', 
                time: '2018-02-16T00:26:41.439Z',
                channel: 'A0.GNC.Velocity.vx', 
                ack: '', 
                timestamp: 1518740801
            }], 
            subCategoryColors: [  ], 
            ackStatus: false 
        }];
        scope.role = {
            cRole : {
                callsign : 'AAA'
            }
        };
        scope.vehicleColors = [{ vehicle: 'A0', status: false }];

        scope.addtablerow(vehicle, index, vehicleColor);
        expect(scope.contents[0].ackStatus).toEqual(true);
        expect(scope.class[0]).toEqual('buttonNone');
        expect(scope.vehicleColors[0].status).toEqual(true);
        expect(scope.contents[0].tableArray[0].ack).toEqual('John Smith - AAA');
        expect(statusboardService.saveAlerts).toHaveBeenCalled();
    });

    it('should cancel interval when scope is destroyed', function(){
        spyOn($interval, 'cancel');
        scope.$destroy();
        expect($interval.cancel.calls.count()).toBe(2);
    });

});
