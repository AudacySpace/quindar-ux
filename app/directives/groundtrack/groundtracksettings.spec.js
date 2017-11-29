describe('Testing Groundtrack settings controller', function () {
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
                name: "Ground Track",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                    vehicles: []
                }
            };

            dashboardService.getCurrentMission.and.callFake(function() {
                return { missionName : 'ATest' };
            });
            dashboardService.getConfig.and.callFake(function() {
                return deferredConfig.promise;
            });

            controller = $controller('GroundSettingsCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                $interval: $interval
            });
        });

    });

    it('groundtrack settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should assign default value to settings variable', function() {
        expect(scope.settings).toBeDefined();
        expect(scope.settings).toEqual([]);
    });

    it('should get the configuration of the current mission and set the settings table', function(){
        var vehicles = [{
            'key': 1,
            'value': 'A0'  
        }, {
            'key': 2,
            'value': 'A1'
        }];
        var result = {
            'A1' : {
                'GNC' : {}
            }, 
            'A0' : {
                'GNC' : {}
            }
        }
        deferredConfig.resolve({ data : result });

        dashboardService.sortObject.and.callFake(function(){
            return {
                'A0' : {
                    'GNC' : {}
                }, 
                'A1' : {
                    'GNC' : {}
                }
            }
        });

        $interval.flush(1001);

        //settings row for each vehicle
        expect(scope.settings.length).toEqual(2);
    });

    it('should define function closeWidget', function() {
        expect(scope.closeWidget).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.widget.settings.vehicle = 'A0';

        scope.closeWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should define function saveWidget', function() {
        expect(scope.saveWidget).toBeDefined();
    });

    it('should close the settings menu on save', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should save settings as widget property on save', function() {
        scope.settings = [
        [
            {   
                "value": 0
            },{   
                "value": 'A0',
            },{   
                "status": true,
            },{   
                "status": false,
            },{   
                "status": true,
            }
        ],[
            {   
                "value": 0
            },{   
                "value": 'A1',
            },{   
                "status": false,
            },{   
                "status": false,
            },{   
                "status": true,
            }
        ]];
        var vehicles = [
        { name: 'A0', dataStatus: true, orbitStatus: false, iconStatus: true, color: '#07D1EA' },
        { name: 'A1', dataStatus: false, orbitStatus: false, iconStatus: true, color: '#0D8DB8' }];

        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.vehicles).toEqual(vehicles);
    });

    it('should save settings as widget property on save(empty settings)', function() {
        scope.settings = [];
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.vehicles).toEqual([]);
    });
})