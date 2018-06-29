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

    it('should save settings as widget property on save(no vehicles checked or all vehicles unchecked)', function() {
        spyOn(windowMock, "alert");
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.selectByGroupData = [];
        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.vehicles).toEqual([]);
        // expect(windowMock.alert).toHaveBeenCalledWith("Please select atleast one vehicle before you save!");
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

    it('should alert the user if the vehicle and id from the left menu are not available', function() {
        spyOn(windowMock, "alert");
        var data = {
            parameters:[]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue('position',0);
        expect(windowMock.alert).toHaveBeenCalledWith("Please select the parameters before apply!");
    });

    it('should store the value of selected velocity parameters for vehicleid 0 when category is velocity and vehicleid is 0', function() {
        windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value": -0.31187798675604184,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            }
        });

        var data = { 
            parameters:[
                {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
                {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
                {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
            ]
        };
        scope.lock = { lockLeft : true, lockRight : false }

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });
        scope.currentScreenVehicle = 'A0';
        scope.getValue('velocity',0);
        expect(scope.velocityData[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
        expect(scope.vdisplay[0]).toEqual('vx,vy,vz');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should store only the value of last three selected velocity parameters when category is velocity and number of paramters selected is more than 3', function() {
        windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value": -0.31187798675604184,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            }
        });
        var data = { 
            parameters:[
                {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'},
                {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
                {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
                {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
                {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
            ]
        };
        scope.lock = { lockLeft : true, lockRight : false }

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });
        scope.currentScreenVehicle = 'A0'
        scope.getValue('velocity',0);
        expect(scope.velocityData[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
        expect(scope.vdisplay[0]).toEqual('vx,vy,vz');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should not store the value of selected velocity parameters when category is velocity and number of parameters is not equal to 3', function() {
        spyOn(windowMock, "alert");

        var data = { 
            parameters:[
                {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
                {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = 'A0';
        scope.getValue('velocity',0);
        expect(scope.velocityData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.vdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all velocity values:vx,vy,vz");
    });

    it('should not store the value of selected velocity parameters when category is velocity and selected parameters are of different vehicle', function() {
        spyOn(windowMock, "alert");
        dashboardService.getData.and.callFake(function(){
            return {
                "value": -0.31187798675604184,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            }
        });
        var data = { 
            parameters:[
                {vehicle: "Audacy2", id: "vx", key: "Audacy2.GNC.velocity.vx", category: "velocity"},
                {vehicle: "Audacy2", id: "vy", key: "Audacy2.GNC.velocity.vy", category: "velocity"},
                {vehicle: "Audacy2", id: "vz", key: "Audacy2.GNC.velocity.vz", category: "velocity"}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = "Audacy1";
        scope.getValue('velocity',0);
        expect(scope.velocityData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.vdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the velocity values:vx,vy,vz from the same vehicle: Audacy1");
    });

    it('should not store the value of selected velocity parameters when category is velocity and selected parameters are of different category', function() {
        spyOn(windowMock, "alert");
        dashboardService.getData.and.callFake(function(){
            return {
                "value": -0.31187798675604184,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "notes": ""
            }
        });
        var data = { 
            parameters:[
                {vehicle: "Audacy1", id: "vx", key: "Audacy2.GNC.velocity.vx", category: "velocity"},
                {vehicle: "Audacy1", id: "x", key: "Audacy2.GNC.velocity.x", category: "position"},
                {vehicle: "Audacy1", id: "vz", key: "Audacy2.GNC.velocity.vz", category: "velocity"}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = "Audacy1";
        scope.getValue('velocity',0);
        expect(scope.velocityData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.vdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the velocity values:vx,vy,vz from the same category of vehicle: Audacy1");
    });

    it('should not store the value of selected velocity parameters when category is velocity and selected parameters do not have available data', function() {
        spyOn(windowMock, "alert");
        var data = { 
            parameters:[
                {vehicle: "Audacy1", id: "z", key: "Audacy2.GNC.velocity.z", category: "position"},
                {vehicle: "Audacy1", id: "x", key: "Audacy2.GNC.velocity.x", category: "position"},
                {vehicle: "Audacy1", id: "y", key: "Audacy2.GNC.velocity.y", category: "position"}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = "Audacy1";
        scope.getValue('velocity',0);
        expect(scope.velocityData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.vdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("You have either not selected all velocity values: or there may be no data available for the selected velocity coordinates.");
    });

    it('should store the value of selected position parameters for vehicleid 0 when category is position and vehicleid is 0', function() {
        windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "notes": ""
            }
        });

        var data = { 
            parameters:[
                {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
            ]
        };
        scope.lock = { lockLeft : true, lockRight : false }

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });
        scope.currentScreenVehicle = 'A0';
        scope.getValue('position',0);
        expect(scope.positionData[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
        expect(scope.pdisplay[0]).toEqual('x,y,z');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should store only the value of last three selected position parameters when category is position and number of paramters selected is more than 3', function() {
        windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "notes": ""            
            }
        });
        var data = { 
            parameters:[
                {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
                {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
                {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
                {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'},
                {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
            ]
        };
        scope.lock = { lockLeft : true, lockRight : false }

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });
        scope.currentScreenVehicle = 'A0'
        scope.getValue('position',0);
        expect(scope.positionData[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
        expect(scope.pdisplay[0]).toEqual('x,y,z');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should not store the value of selected position parameters when category is position and number of parameters is not equal to 3', function() {
        spyOn(windowMock, "alert");

        var data = { 
            parameters:[
                {vehicle:'A0',id:'x',key:'A0.GNC.position.vx',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.vy',category:'position'}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = 'A0';
        scope.getValue('position',0);
        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.pdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all position values:x,y,z");
    });

    it('should not store the value of selected position parameters when category is position and selected parameters are of different vehicle', function() {
        spyOn(windowMock, "alert");
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "notes": ""  
            }
        });
        var data = { 
            parameters:[
                {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = "Audacy1";
        scope.getValue('position',0);
        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.pdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the position values:x,y,z from the same vehicle: Audacy1");
    });

    it('should not store the value of selected position parameters when category is position and selected parameters are of different category', function() {
        spyOn(windowMock, "alert");
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "notes": "" 
            }
        });
        var data = { 
            parameters:[
                {vehicle:'Audacy1',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'Audacy1',id:'y',key:'A0.GNC.position.vy',category:'velocity'},
                {vehicle:'Audacy1',id:'z',key:'A0.GNC.position.z',category:'position'}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = "Audacy1";
        scope.getValue('position',0);
        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.pdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the position values:x,y,z from the same category of vehicle: Audacy1");
    });

    it('should not store the value of selected position parameters when category is position and selected parameters do not have available data', function() {
        spyOn(windowMock, "alert");
        var data = { 
            parameters:[
                {vehicle: "Audacy1", id: "z", key: "Audacy2.GNC.velocity.z", category: "position"},
                {vehicle: "Audacy1", id: "x", key: "Audacy2.GNC.velocity.x", category: "position"},
                {vehicle: "Audacy1", id: "y", key: "Audacy2.GNC.velocity.y", category: "position"}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = "Audacy1";
        scope.getValue('position',0);
        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.pdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("You have either not selected all position values:x,y,z or there may be no data available for the selected position coordinates.");
    });

    it('should not store the value of selected position parameters when category is position and selected parameters do not have available data', function() {
        spyOn(windowMock, "alert");
        var data = { 
            parameters:[
                {vehicle: "Audacy1", id: "z", key: "Audacy2.GNC.velocity.z", category: "position"},
                {vehicle: "Audacy1", id: "x", key: "Audacy2.GNC.velocity.x", category: "position"},
                {vehicle: "Audacy1", id: "y", key: "Audacy2.GNC.velocity.y", category: "position"}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.currentScreenVehicle = "Audacy1";
        scope.getValue('position',0);
        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.pdisplay[0]).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("You have either not selected all position values:x,y,z or there may be no data available for the selected position coordinates.");
    });


    it('should save parameters on second settings screen on click on Save button and clicked ok on confirm', function() {
        windowMock.confirm = function(message){
            return true;
        }

        scope.iconstatus[0] = true;
        scope.orbitstatus[0] = true;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [4];
        scope.settings.vdata[0] = [4];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.currentScreenVehicle = "Audacy1";
        scope.saveParameters(scope.widget);
        expect(scope.secondScreen).toEqual(false);
        expect(scope.firstScreen).toEqual(true);
        expect(scope.settings.pdata[0]).toEqual([]);
        expect(scope.settings.vdata[0]).toEqual([]);
    });

    it('should not save parameters on second settings screen on click on Save button and clicked cancel on confirm', function() {
        windowMock.confirm = function(message){
            return false;
        }

        scope.iconstatus[0] = true;
        scope.orbitstatus[0] = true;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [4];
        scope.settings.vdata[0] = [4];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.currentScreenVehicle = "Audacy1";
        scope.saveParameters(scope.widget);
        expect(scope.secondScreen).toEqual(true);
        expect(scope.firstScreen).toEqual(false);
    });

    it('should should alert the user if both orbit and icon are disabled', function() {
        windowMock.confirm = function(message){
            return true;
        }

        scope.iconstatus[0] = false;
        scope.orbitstatus[0] = false;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [4];
        scope.settings.vdata[0] = [4];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.currentScreenVehicle = "Audacy1";
        scope.saveParameters(scope.widget);
        expect(scope.secondScreen).toEqual(true);
        expect(scope.firstScreen).toEqual(false);
    });

    it('should should alert the user if both orbit and icon are disabled and save parameters if its ok on confirm', function() {
        windowMock.confirm = function(message){
            if(message === 'You have not enabled orbit and icon for this vehicle.Do you want to enable either orbit or icon for the vehicle?'){
                return false;
            }else {
                return true;
            }
            
        }

        scope.iconstatus[0] = false;
        scope.orbitstatus[0] = false;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [4];
        scope.settings.vdata[0] = [4];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.currentScreenVehicle = "Audacy1";
        scope.saveParameters(scope.widget);
        expect(scope.secondScreen).toEqual(false);
        expect(scope.firstScreen).toEqual(true);
        expect(scope.settings.pdata[0]).toEqual([]);
        expect(scope.settings.vdata[0]).toEqual([]);
    });

    it('should should alert the user if both orbit and icon are disabled and not save parameters if its cancel on confirm', function() {
        windowMock.confirm = function(message){
            if(message === 'You have not enabled orbit and icon for this vehicle.Do you want to enable either orbit or icon for the vehicle?'){
                return false;
            }else {
                return false;
            }
            
        }

        scope.iconstatus[0] = false;
        scope.orbitstatus[0] = false;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [4];
        scope.settings.vdata[0] = [4];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.currentScreenVehicle = "Audacy1";
        scope.saveParameters(scope.widget);
        expect(scope.secondScreen).toEqual(true);
        expect(scope.firstScreen).toEqual(false);
    });


})