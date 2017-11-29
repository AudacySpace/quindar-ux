describe('Testing satellite settings controller', function () {
    var controller, scope, dashboardService, deferredConfig, $interval;

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope, _$q_, _$interval_){
            deferredConfig = _$q_.defer();
            $interval = _$interval_;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getCurrentMission', 'getConfig', 'sortObject']);

            scope = $rootScope.$new();
            scope.widget = {
                name: "3D Model",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false
                }
            };

            dashboardService.getCurrentMission.and.callFake(function() {
                return { missionName : 'ATest' };
            });
            dashboardService.getConfig.and.callFake(function() {
                return deferredConfig.promise;
            });

            controller = $controller('SatSettingsCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                $interval: $interval
            });
        });

    });

    it('satellite settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should assign default value to vehicles variable', function() {
        expect(scope.vehicles).toBeDefined();
        expect(scope.vehicles).toEqual([]);
    });

    it('should get the configuration of the current mission and set the vehicles', function(){
        var vehicles = [{
            'key': 1,
            'value': 'A0'  
        }, {
            'key': 2,
            'value': 'A1'
        }];
        var result = {
            'A0' : {
                'GNC' : {
                    'Velocity' : {
                        'vx' : ""
                    },
                    'Attitude': {
                        'q1' : ""
                    }
                }
            }, 
            'A1' : {
                'GNC' : {}
            }
        }
        deferredConfig.resolve({ data : result });

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

        expect(scope.vehicles).toEqual(vehicles);
    });

    it('should set the selected object as empty', function(){
        expect(scope.selected).toEqual({});
    });

    it('should define function closeSettings', function() {
        expect(scope.closeSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.widget.settings.vehicle = 'A0';

        scope.closeSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        //selected vehicle equals vehicle in settings when close
        expect(scope.selected.vehicle).toEqual('A0');
    });

    it('should define function saveSettings', function() {
        expect(scope.saveSettings).toBeDefined();
    });

    it('should not close the settings menu on save if data is not selected', function() {
        scope.selected = {};
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.main).not.toEqual(true);
        expect(scope.widget.settings.active).not.toEqual(false);
    });

    it('should close the settings menu on save if data is selected', function() {
        scope.selected = {
            vehicle : 'A0'
        };
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.vehicle).toEqual('A0');
    });
})