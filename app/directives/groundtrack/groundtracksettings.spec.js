describe('Testing Groundtrack settings controller', function () {
    var controller, scope, dashboardService, deferredConfig, $interval,sidebarService,sideNavOpenMock,$q;

    var windowMock = {
        alert : function(message) {},
        innerWidth: 1000
    };
    var modalInstance = { open: function() {} };

    beforeEach(function () {
        // load the module
        module('app');
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
            sideNavOpenMock = jasmine.createSpy();
            $provide.factory('$mdSidenav', function() {
                return function(sideNavId){
                    return { open: sideNavOpenMock };
                };
            });
        });

        inject(function($controller, $rootScope, _$q_, _$interval_){
            deferredConfig = _$q_.defer();
            $interval = _$interval_;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getCurrentMission', 'getConfig', 'sortObject','getLock', 'setLeftLock','getData']);

            sidebarService = jasmine.createSpyObj('sidebarService',['getVehicleInfo'
                ]);

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
            $q = _$q_;

            controller = $controller('GroundSettingsCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                $interval: $interval,
                $uibModal : modalInstance,
                sidebarService: sidebarService

            });
        });

    });

    it('groundtrack settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should assign default value to settings variable', function() {
        expect(scope.settings).toBeDefined();
        expect(scope.settings.vehicles).toEqual([]);
        expect(scope.settings.iconstatus).toEqual([]);
        expect(scope.settings.orbitstatus).toEqual([]);
        expect(scope.settings.pdata).toEqual([]);
        expect(scope.settings.vdata).toEqual([]);
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
        expect(scope.settings.vehicles.length).toEqual(2);
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

    it('should save settings as widget property on save', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.settings.pdata[0] = [{vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}];
        scope.settings.pdata[1] = [];
        scope.settings.vdata[0] = [{vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
                {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
                {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}];
        scope.settings.vdata[1] = [];
        scope.checkedValues = [{"status":true},{"status":false}];
        scope.selectByGroupData = ['A0','A1'];


        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should not save settings as widget property on save when all the parameters are not selected for the vehicle', function() {
        spyOn(windowMock, "alert");
        scope.widget.main = false;
        scope.widget.settings.active = true;


        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.settings.pdata[0] = [{vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'}];
        scope.settings.pdata[1] = [];
        scope.settings.vdata[0] = [{vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
                {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
                {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}];
        scope.settings.vdata[1] = [];
        scope.checkedValues = [{"status":true},{"status":false}];
        scope.selectByGroupData = ['A0','A1'];

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(false);
        expect(scope.widget.settings.active).toEqual(true);
        expect(scope.widget.settings.vehicles).toEqual([]);
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all parameters for all the vehicles selected!");
    });

    it('should not save settings as widget property on save(empty settings)', function() {
        spyOn(windowMock, "alert");
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.selectByGroupData = [];
        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(false);
        expect(scope.widget.settings.active).toEqual(true);
        expect(scope.widget.settings.vehicles).toEqual([]);
        expect(windowMock.alert).toHaveBeenCalledWith("Please select atleast one vehicle before you save!");
    });


    it('should open velocity coordinate list on call to openVelocityList function', function() {
        scope.settings.pdata[0] = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];
        scope.settings.vdata[0] = [
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ];
        scope.vehicle = 'A0';
        scope.widget.main = false;
        scope.widget.settings.active = true;

        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };

        var modalResult = scope.settings;
        var mockModalInstance = { result: $q.resolve(modalResult) };
        spyOn(mockModalInstance.result, 'then').and.callThrough();
        spyOn(modalInstance, 'open').and.returnValue(mockModalInstance);

        scope.openVelocityList(0);
        scope.$digest();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.vdisplay[0]).toEqual('vx,vy,vz');

    });

    it('should open position coordinate list on call to openPositionList function', function() {
        scope.settings.pdata[0] = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];
        scope.settings.vdata[0] = [
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ];
        scope.vehicle = 'A0';
        scope.widget.main = false;
        scope.widget.settings.active = true;

        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };

        var modalResult = scope.settings;
        var mockModalInstance = { result: $q.resolve(modalResult) };
        spyOn(mockModalInstance.result, 'then').and.callThrough();
        spyOn(modalInstance, 'open').and.returnValue(mockModalInstance);

        scope.openPositionList(0);
        scope.$digest();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.pdisplay[0]).toEqual('x,y,z');

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
})