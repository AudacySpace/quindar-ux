describe('Testing datalog settings controller', function () {
    var controller, scope, dashboardService, sidebarService, sideNavOpenMock;

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

        inject(function($controller, $rootScope, _$q_){
            sidebarService = jasmine.createSpyObj('sidebarService', ['getVehicleInfo', 'setMenuStatus']);;
            dashboardService = jasmine.createSpyObj('dashboardService', ['getLock', 'setLeftLock','getData']);
            scope = $rootScope.$new();
            scope.widget = {
                name: "Data Log",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                }
            };

            controller = $controller('DataLogSettingsCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                sidebarService: sidebarService
            });
        });

    });

    it('data log settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should assign default value to data variable', function() {
        var expected = {
            id: '',
            vehicle: '',
            key: ''
        };
        expect(scope.data).toEqual(expected);
    });

    it('should define function closeDataLogSettings', function() {
        expect(scope.closeDataLogSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.widget.settings.data = {
            vehicle: "A0", 
            id: "v", 
            key: "A0.GNC.velocity.v"
        }

        scope.closeDataLogSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);

        //scope.data should equal scope.widget.settings.data on close
        expect(scope.data).toEqual(scope.widget.settings.data);
    });

    it('should define function saveDataLogSettings', function() {
        expect(scope.saveDataLogSettings).toBeDefined();
    });

    it('should not close the settings menu on save if data is not selected', function() {
        scope.data = {
            id: '',
            vehicle: '',
            key: ''
        };
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveDataLogSettings(scope.widget);
        
        expect(scope.widget.main).not.toEqual(true);
        expect(scope.widget.settings.active).not.toEqual(false);
    });

    it('should close the settings menu on save if data is selected', function() {
        scope.data = {
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx'
        };
        scope.widget.main = false;
        scope.widget.settings.active = true;

        scope.saveDataLogSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.data).toEqual(scope.data);
    });

    it('should define function getTelemetrydata', function() {
        expect(scope.getTelemetrydata).toBeDefined();
    });

    it('should open the left sidebar/Data Menu when function is called(window width < 1400)', function() {
        scope.getTelemetrydata();

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
        expect(sidebarService.setMenuStatus).toHaveBeenCalledWith(true);
    });

    it('should open the left sidebar/Data Menu when function is called(window width > 1400)', function() {
        windowMock.innerWidth = 1440;

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : false, lockRight : false }
        });

        scope.getTelemetrydata();

        expect(scope.lock).toEqual({ lockLeft : true, lockRight : false });
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(true);
        expect(sidebarService.setMenuStatus).toHaveBeenCalledWith(true);
    });

    it('should define function getValue', function() {
        expect(scope.getValue).toBeDefined();
    });

    it('should alert the user if the vehicle and id from the left menu are not available', function() {
        spyOn(windowMock, "alert");
        var data = {
            parameters: []
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue();

        expect(windowMock.alert).toHaveBeenCalledWith("Vehicle data not set. Please select from Data Menu");
    });

    it('should store the value of selected vehicle and id in scope.data variable', function() {
        windowMock.innerWidth = 1000;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'velocity' 
        };

        var data = {
            parameters:[]
        };

        data.parameters[0] = vehicleInfo;

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        dashboardService.getData.and.callFake(function() {
            return {
                "value": -0.3201368817947103,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            };
        });

        scope.getValue();

        expect(scope.data).toEqual(vehicleInfo);
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
        };

        data.parameters[0] = vehicleInfo;

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        dashboardService.getData.and.callFake(function() {
            return {
                "value": -0.3201368817947103,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            };
        });

        scope.getValue();

        expect(scope.data).toEqual(vehicleInfo);
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
    });
})