describe('Testing Groundtrack settings controller', function () {
    var controller, scope, dashboardService, $interval,sidebarService,sideNavOpenMock,$q;
    var element = angular.element('<div></div>'); //provide element you want to test

    var windowMock = {
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
            $interval = _$interval_;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['sortObject','getLock', 'setLeftLock','getData', 'isEmpty', 'telemetry','displayWidgetAlert']);

            sidebarService = jasmine.createSpyObj('sidebarService',['getVehicleInfo', 'setMenuStatus', 'setTempWidget', 'setOpenLogo']);

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

            dashboardService.telemetry.and.callFake(function() {
                return {"time": "2018-02-16T00:26:41.439Z", "data": { "A1" : {}, "A0" : {} } };
            });
            dashboardService.isEmpty.and.callFake(function() {
                return false;
            });
            $q = _$q_;

            controller = $controller('GroundSettingsCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                $interval: $interval,
                $uibModal : modalInstance,
                sidebarService: sidebarService,
                $element: element

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

    it('should set the settings menu using the telemetry data', function(){
        var vehicles = [{
            'id': 0,
            'label': 'A0'
        }, {
            'id': 1,
            'label': 'A1'
        }];

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
        expect(scope.settings.vehicles).toEqual(vehicles);
        expect(scope.iconstatus).toEqual([true, true]);
        expect(scope.orbitstatus).toEqual([true, true]);
        expect(scope.positionData).toEqual([[], []]);
        expect(scope.velocityData).toEqual([[], []]);
        expect(scope.settings.pdata).toEqual([[], []]);
        expect(scope.settings.vdata).toEqual([[], []]);
        expect(scope.widget.settings.totalPositionArray).toEqual([[], []]);
        expect(scope.widget.settings.totalVelocityArray).toEqual([[], []]);
        expect(scope.settings.orbitstatus).toEqual([true, true]);
        expect(scope.settings.iconstatus).toEqual([true, true]);
        expect(scope.checkedValues).toEqual([{status:false}, {status:false}])
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
        scope.settings.vehicles = [
        {
            "id" : 0,
            "label" : "A0"
        },{
            "id" : 1,
            "label" : "A1"
        }];
        scope.settings.pdata[0] = [{vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}];
        scope.settings.pdata[1] = [];
        scope.settings.vdata[0] = [{vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
                {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
                {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}];
        scope.settings.vdata[1] = [];
        scope.checkedValues = [{"status":true},{"status":false}];

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
    });

    it('should not save settings as widget property on save when all the parameters are not selected for the vehicle', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.settings.vehicles = [
        {
            "id" : 0,
            "label" : "A0"
        },{
            "id" : 1,
            "label" : "A1"
        }];
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

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(false);
        expect(scope.widget.settings.active).toEqual(true);
        expect(scope.widget.settings.vehicles).toEqual([]);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select all parameters for selected vehicle A0!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should save settings as widget property on save(no vehicles checked or all vehicles unchecked)', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.settings.vehicles = [
        {
            "id" : 0,
            "label" : "A0"
        }];
        scope.checkedValues = [{"status":false}];

        scope.saveWidget(scope.widget);
        
        expect(scope.widget.main).toEqual(false);
        expect(scope.widget.settings.active).toEqual(true);
        expect(scope.widget.settings.vehicles).toEqual([]);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select atleast one vehicle before you save!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
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

        scope.widget.settings.totalPositionArray[0] = angular.copy(scope.settings.pdata[0]);
        scope.widget.settings.totalVelocityArray[0] = angular.copy(scope.settings.vdata[0]);
        scope.currentVehicleId = 0;
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
        scope.widget.settings.totalPositionArray[0] = angular.copy(scope.settings.pdata[0]);
        scope.widget.settings.totalVelocityArray[0] = angular.copy(scope.settings.vdata[0]);
        scope.currentVehicleId = 0;
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

    });

    it('should define function getTelemetrydata', function() {
        expect(scope.getTelemetrydata).toBeDefined();
    });

    it('should open the left sidebar/Data Menu when function is called(window width < 1400)', function() {
        scope.getTelemetrydata();

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
        expect(sidebarService.setMenuStatus).toHaveBeenCalledWith(true);
        expect(sidebarService.setOpenLogo).toHaveBeenCalledWith(false);
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
        expect(sidebarService.setOpenLogo).toHaveBeenCalledWith(false);
    });

    it('should define function readValues', function() {
        expect(scope.readValues).toBeDefined();
    });

    it('should show attitude values that the user has selected in input box', function() {
        scope.currentScreenVehicle = 'A0';
        scope.vehicleId = 0;
        scope.currentVehicleId = 0;
        scope.chosenCategory = 'velocity';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalVelocityArray = [[]];
        scope.widget.settings.totalPositionArray = [[]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'});
        scope.getValue(false);


        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);

        expect(scope.readValues('velocity')).toEqual('vx, vy, vz');
    });

    it('should show position values that the user has selected in input box', function() {
        scope.currentScreenVehicle = 'A0';
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'position';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        expect(scope.widget.settings.totalPositionArray[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'},
        ]);
        expect(scope.readValues('position')).toEqual('x, y, z');
    });

    it('should define function getValue', function() {
        expect(scope.getValue).toBeDefined();
    });

    it('should alert the user if the vehicle and id from the left menu are not available', function() {

        scope.widget.settings.dataArray = [];

        scope.getValue('position',0);
        scope.saveParameters(scope.widget);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select the parameters before saving!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);

    });

    it('should store the value of selected velocity parameters for vehicleid 0 when category is velocity and vehicleid is 0', function() {
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

        scope.currentScreenVehicle = 'A0';
        scope.vehicleId = 0;
        scope.chosenCategory = 'velocity';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[]];
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'});
        scope.getValue(false);
        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);
        expect(scope.velocityData[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
    });

    it('should store only the value of last three selected velocity parameters when category is velocity and number of paramters selected is more than 3', function() {
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

        scope.currentScreenVehicle = 'A0';
        scope.vehicleId = 0;
        scope.chosenCategory = 'velocity';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'});
        scope.getValue(false);
        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);
        expect(scope.velocityData[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
    });

    it('should not store the value of selected velocity parameters when category is velocity and number of parameters is not equal to 3', function() {
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

        scope.currentScreenVehicle = 'A0';
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'velocity';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[
            {vehicle: "A0", id: "z", key: "A0.GNC.position.z", category: "position"},
            {vehicle: "A0", id: "x", key: "A0.GNC.position.x", category: "position"},
            {vehicle: "A0", id: "y", key: "A0.GNC.position.y", category: "position"}
        ]];
        scope.widget.settings.totalVelocityArray = [[]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'});
        scope.getValue(false);

        scope.saveParameters(scope.widget);

        expect(scope.velocityData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);
        expect(scope.positionData[0]).toEqual([
            {vehicle: "A0", id: "z", key: "A0.GNC.position.z", category: "position"},
            {vehicle: "A0", id: "x", key: "A0.GNC.position.x", category: "position"},
            {vehicle: "A0", id: "y", key: "A0.GNC.position.y", category: "position"}
        ]);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select all velocity values:vx,vy,vz.");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should not store the value of selected velocity parameters when category is velocity and selected parameters are of different vehicle', function() {
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

        scope.currentScreenVehicle = "Audacy1";
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'velocity';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[
            {vehicle: "Audacy1", id: "z", key: "Audacy1.GNC.position.z", category: "position"},
            {vehicle: "Audacy1", id: "x", key: "Audacy1.GNC.position.x", category: "position"},
            {vehicle: "Audacy1", id: "y", key: "Audacy1.GNC.position.y", category: "position"}
        ]];
        scope.widget.settings.totalVelocityArray = [[]];

        scope.widget.settings.dataArray.push({vehicle: "Audacy2", id: "vx", key: "Audacy2.GNC.velocity.vx", category: "velocity"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy2", id: "vy", key: "Audacy2.GNC.velocity.vy", category: "velocity"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy2", id: "vz", key: "Audacy2.GNC.velocity.vz", category: "velocity"});
        scope.getValue(false);

        scope.saveParameters(scope.widget);

        expect(scope.velocityData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle: "Audacy2", id: "vx", key: "Audacy2.GNC.velocity.vx", category: "velocity"},
            {vehicle: "Audacy2", id: "vy", key: "Audacy2.GNC.velocity.vy", category: "velocity"},
            {vehicle: "Audacy2", id: "vz", key: "Audacy2.GNC.velocity.vz", category: "velocity"}
        ]);
        expect(scope.positionData[0]).toEqual([
            {vehicle: "Audacy1", id: "z", key: "Audacy1.GNC.position.z", category: "position"},
            {vehicle: "Audacy1", id: "x", key: "Audacy1.GNC.position.x", category: "position"},
            {vehicle: "Audacy1", id: "y", key: "Audacy1.GNC.position.y", category: "position"}
        ]);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select all the velocity values:vx,vy,vz from the same vehicle: Audacy1");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should not store the value of selected velocity parameters when category is velocity and selected parameters are of different category', function() {
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

        scope.currentScreenVehicle = "Audacy1";
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'velocity';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[
            {vehicle: "Audacy1", id: "z", key: "Audacy1.GNC.position.z", category: "position"},
            {vehicle: "Audacy1", id: "x", key: "Audacy1.GNC.position.x", category: "position"},
            {vehicle: "Audacy1", id: "y", key: "Audacy1.GNC.position.y", category: "position"}
        ]];
        scope.widget.settings.totalVelocityArray = [[]];

        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "vx", key: "Audacy1.GNC.velocity.vx", category: "velocity"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "x", key: "Audacy1.GNC.position.x", category: "position"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "vz", key: "Audacy1.GNC.velocity.vz", category: "velocity"});
        scope.getValue(false);

        scope.saveParameters(scope.widget);

        expect(scope.velocityData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle: "Audacy1", id: "vx", key: "Audacy1.GNC.velocity.vx", category: "velocity"},
            {vehicle: "Audacy1", id: "x", key: "Audacy1.GNC.position.x", category: "position"},
            {vehicle: "Audacy1", id: "vz", key: "Audacy1.GNC.velocity.vz", category: "velocity"}
        ]);
        expect(scope.positionData[0]).toEqual([
            {vehicle: "Audacy1", id: "z", key: "Audacy1.GNC.position.z", category: "position"},
            {vehicle: "Audacy1", id: "x", key: "Audacy1.GNC.position.x", category: "position"},
            {vehicle: "Audacy1", id: "y", key: "Audacy1.GNC.position.y", category: "position"}
        ]);

        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select all the velocity values:vx,vy,vz from the same category of vehicle: Audacy1");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should not store the value of selected velocity parameters when category is velocity and selected parameters do not have available data', function() {
        scope.currentScreenVehicle = "Audacy1";
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'velocity';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[
            {vehicle: "Audacy1", id: "z", key: "Audacy1.GNC.position.z", category: "position"},
            {vehicle: "Audacy1", id: "x", key: "Audacy1.GNC.position.x", category: "position"},
            {vehicle: "Audacy1", id: "y", key: "Audacy1.GNC.position.y", category: "position"}
        ]];
        scope.widget.settings.totalVelocityArray = [[]];

        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "z", key: "Audacy2.GNC.velocity.z", category: "position"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "x", key: "Audacy2.GNC.velocity.x", category: "position"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "y", key: "Audacy2.GNC.velocity.y", category: "position"});
        scope.getValue(false);
        scope.positionBooleans[0] = true;

        expect(scope.vehicle[0]).toEqual('');

        scope.saveParameters(scope.widget);

        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle: "Audacy1", id: "z", key: "Audacy2.GNC.velocity.z", category: "position"},
            {vehicle: "Audacy1", id: "x", key: "Audacy2.GNC.velocity.x", category: "position"},
            {vehicle: "Audacy1", id: "y", key: "Audacy2.GNC.velocity.y", category: "position"}
        ]);

        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("You have either not selected all velocity values: or there may be no data available for the selected velocity coordinates.");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should store the value of selected position parameters for vehicleid 0 when category is position and vehicleid is 0', function() {
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

        scope.currentScreenVehicle = 'A0';
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'position';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[
            {vehicle: "A0", id: "vx", key: "A0.GNC.velocity.vx", category: "velocity"},
            {vehicle: "A0", id: "vy", key: "A0.GNC.velocity.vy", category: "velocity"},
            {vehicle: "A0", id: "vz", key: "A0.GNC.velocity.vz", category: "velocity"}
        ]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        expect(scope.widget.settings.totalPositionArray[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.positionData[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.velocityData[0]).toEqual([
            {vehicle: "A0", id: "vx", key: "A0.GNC.velocity.vx", category: "velocity"},
            {vehicle: "A0", id: "vy", key: "A0.GNC.velocity.vy", category: "velocity"},
            {vehicle: "A0", id: "vz", key: "A0.GNC.velocity.vz", category: "velocity"}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
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

        scope.currentScreenVehicle = 'A0';
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'position';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[
            {vehicle: "A0", id: "vx", key: "A0.GNC.velocity.vx", category: "velocity"},
            {vehicle: "A0", id: "vy", key: "A0.GNC.velocity.vy", category: "velocity"},
            {vehicle: "A0", id: "vz", key: "A0.GNC.velocity.vz", category: "velocity"}
        ]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        expect(scope.widget.settings.totalPositionArray[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.positionData[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.velocityData[0]).toEqual([
            {vehicle: "A0", id: "vx", key: "A0.GNC.velocity.vx", category: "velocity"},
            {vehicle: "A0", id: "vy", key: "A0.GNC.velocity.vy", category: "velocity"},
            {vehicle: "A0", id: "vz", key: "A0.GNC.velocity.vz", category: "velocity"}
        ]);
        expect(scope.vehicle[0]).toEqual('A0');
    });

    it('should not store the value of selected position parameters when category is position and number of parameters is not equal to 3', function() {
        scope.currentScreenVehicle = 'A0';
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'position';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[
            {vehicle: "A0", id: "vx", key: "A0.GNC.velocity.vx", category: "velocity"},
            {vehicle: "A0", id: "vy", key: "A0.GNC.velocity.vy", category: "velocity"},
            {vehicle: "A0", id: "vz", key: "A0.GNC.velocity.vz", category: "velocity"}
        ]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.vx',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.vy',category:'position'});
        scope.getValue(false);

        scope.saveParameters(scope.widget);

        expect(scope.widget.settings.totalPositionArray[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.vx',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.vy',category:'position'}
        ]);
        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select all position values:x,y,z.");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should not store the value of selected position parameters when category is position and selected parameters are of different vehicle', function() {
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

        scope.currentScreenVehicle = "Audacy1";
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'position';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[
            {vehicle: "A0", id: "vx", key: "A0.GNC.velocity.vx", category: "velocity"},
            {vehicle: "A0", id: "vy", key: "A0.GNC.velocity.vy", category: "velocity"},
            {vehicle: "A0", id: "vz", key: "A0.GNC.velocity.vz", category: "velocity"}
        ]];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        scope.saveParameters(scope.widget);

        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select all the position values:x,y,z from the same vehicle: Audacy1");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should not store the value of selected position parameters when category is position and selected parameters are of different category', function() {
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

        scope.currentScreenVehicle = "Audacy1";
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'position';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[
            {vehicle: "Audacy1", id: "vx", key: "Audacy1.GNC.velocity.vx", category: "velocity"},
            {vehicle: "Audacy1", id: "vy", key: "Audacy1.GNC.velocity.vy", category: "velocity"},
            {vehicle: "Audacy1", id: "vz", key: "Audacy1.GNC.velocity.vz", category: "velocity"}
        ]];

        scope.widget.settings.dataArray.push({vehicle:'Audacy1',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'Audacy1',id:'y',key:'A0.GNC.position.vy',category:'velocity'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'Audacy1',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        scope.saveParameters(scope.widget);

        expect(scope.positionData[0]).toEqual([]);
        expect(scope.widget.settings.totalPositionArray[0]).toEqual([
            {vehicle:'Audacy1',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'Audacy1',id:'y',key:'A0.GNC.position.vy',category:'velocity'},
            {vehicle:'Audacy1',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);

        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please select all the position values:x,y,z from the same category of vehicle: Audacy1");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should not store the value of selected position parameters when category is position and selected parameters do not have available data', function() {
        scope.currentScreenVehicle = "Audacy1";
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        scope.chosenCategory = 'position';

        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalVelocityArray = [[
            {vehicle: "Audacy1", id: "vx", key: "Audacy1.GNC.velocity.vx", category: "velocity"},
            {vehicle: "Audacy1", id: "vy", key: "Audacy1.GNC.velocity.vy", category: "velocity"},
            {vehicle: "Audacy1", id: "vz", key: "Audacy1.GNC.velocity.vz", category: "velocity"}
        ]];

        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "z", key: "Audacy2.GNC.velocity.z", category: "position"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "x", key: "Audacy2.GNC.velocity.x", category: "position"});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle: "Audacy1", id: "y", key: "Audacy2.GNC.velocity.y", category: "position"});
        scope.getValue(false);

        scope.saveParameters(scope.widget);

        expect(scope.positionData[0]).toEqual([]);
        expect(scope.vehicle[0]).toEqual('');
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("You have either not selected all position values:x,y,z or there may be no data available for the selected position coordinates.");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });


    it('should save parameters on second settings screen on click on Save button and clicked yes on confirm', function() {
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });
        scope.iconstatus[0] = true;
        scope.orbitstatus[0] = true;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [4];
        scope.settings.vdata[0] = [4];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.widget.settings = {};
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalPositionArray[0] = [4];
        scope.widget.settings.totalVelocityArray = [[]];
        scope.widget.settings.totalVelocityArray[0] = [4];
        scope.positionBooleans = [true, true, true, true];
        scope.velocityBooleans = [true, true, true, true];
        scope.currentScreenVehicle = "Audacy1";


        var modalResult = scope.settings;
        var mockModalInstance = { result: $q.resolve(modalResult) };
        spyOn(mockModalInstance.result, 'then').and.callThrough();
        spyOn(modalInstance, 'open').and.returnValue(mockModalInstance);

        scope.saveParameters(scope.widget);
        scope.$digest();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.secondScreen).toEqual(false);
        expect(scope.firstScreen).toEqual(true);
        expect(scope.settings.pdata[0]).toEqual([]);
        expect(scope.settings.vdata[0]).toEqual([]);
    });

    it('should should alert the user if both orbit and icon are disabled', function() {
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });
        scope.iconstatus[0] = false;
        scope.orbitstatus[0] = false;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [4];
        scope.settings.vdata[0] = [4];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.widget.settings = {};
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalPositionArray[0] = [4];
        scope.widget.settings.totalVelocityArray = [[]];
        scope.widget.settings.totalVelocityArray[0] = [4];
        scope.positionBooleans = [true, true, true, true];
        scope.velocityBooleans = [true, true, true, true];
        scope.currentScreenVehicle = "Audacy1";
        var modalResult = scope.settings;
        var mockModalInstance = { result: $q.resolve(modalResult) };
        spyOn(mockModalInstance.result, 'then').and.callThrough();
        spyOn(modalInstance, 'open').and.returnValue(mockModalInstance);
        scope.saveParameters(scope.widget);
        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.secondScreen).toEqual(false);
        expect(scope.firstScreen).toEqual(true);
    });

    it('should alert the user if both orbit and icon are disabled and save parameters if its ok on confirm', function() {
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });
        scope.iconstatus[0] = false;
        scope.orbitstatus[0] = false;
        scope.positionData[0] = [];
        scope.velocityData[0] = [];
        scope.settings.pdata[0] = [];
        scope.settings.vdata[0] = [];
        scope.currentVehicleId = 0;
        scope.widget = {};
        scope.widget.settings = {};
        scope.widget.settings.totalPositionArray = [[]];
        scope.widget.settings.totalPositionArray[0] = [];
        scope.widget.settings.totalVelocityArray = [[]];
        scope.widget.settings.totalVelocityArray[0] = [];
        scope.positionBooleans = [true, true, true, true];
        scope.velocityBooleans = [true, true, true, true];
        scope.currentScreenVehicle = "Audacy1";
        var modalResult = scope.settings;
        var mockModalInstance = { result: $q.resolve(modalResult) };
        spyOn(mockModalInstance.result, 'then').and.callThrough();
        spyOn(modalInstance, 'open').and.returnValue(mockModalInstance);
        scope.saveParameters(scope.widget);
        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.secondScreen).toEqual(false);
        expect(scope.firstScreen).toEqual(true);
        expect(scope.settings.pdata[0]).toEqual([]);
        expect(scope.settings.vdata[0]).toEqual([]);
    });


    it('should close the settings menu on close', function() {
        windowMock.innerWidth = 1440;
        scope.currentVehicleId = 0;
        scope.vehicleId = 0;
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        scope.positionData[0] = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];
        scope.velocityData[0] = [
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ];

        scope.settings.pdata[0] = angular.copy(scope.positionData[0]);
        scope.settings.vdata[0] = angular.copy(scope.velocityData[0]);

        scope.widget.settings.vehicle = 'A0';

        scope.closeParameters(scope.widget);
        
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
        expect(scope.widget.settings.totalPositionArray[0]).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.widget.settings.totalVelocityArray[0]).toEqual([
            {vehicle:'A0',id:'vx',key:'A0.GNC.velocity.vx',category:'velocity'},
            {vehicle:'A0',id:'vy',key:'A0.GNC.velocity.vy',category:'velocity'},
            {vehicle:'A0',id:'vz',key:'A0.GNC.velocity.vz',category:'velocity'}
        ]);

    });

    it('should add new vehicle in scope settings if it is there in the telemetry data', function() {
        scope.settings.vehicles = [
        {
            "id" : 0,
            "label" : "A0"
        },{
            "id" : 1,
            "label" : "A1"
        }];
        scope.checkedValues = [{"status":true},{"status":false}];

        var vehicles = [{
            "id" : 0,
            "label" : "A0"
        },{
            "id" : 1,
            "label" : "A1"
        },{
            "id" : 2,
            "label" : "A2"
        }];

        var checkedValues = [{"status":true},{"status":false},{"status":false}];

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
        expect(scope.checkedValues).toEqual(checkedValues);
    });


})