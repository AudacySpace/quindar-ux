describe('Testing satellite settings controller', function () {
    var controller, scope, dashboardService,sidebarService,sideNavOpenMock,$q;

    var windowMock = {
        innerWidth: 1000
    };
    var modalInstance = { open: function() {} };

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
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getLock', 'setLeftLock','getData']);

            sidebarService = jasmine.createSpyObj('sidebarService',['getVehicleInfo', 'setMenuStatus', 'setTempWidget', 'setOpenLogo']);

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

            $q = _$q_;

            controller = $controller('SatSettingsCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                sidebarService: sidebarService,
                $uibModal : modalInstance
            });
        });

    });

    it('satellite settings controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should define function closeSettings', function() {
        expect(scope.closeSettings).toBeDefined();
    });

    it('should close the settings menu on close', function() {
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.widget.settings.vehicle = 'A0';
        scope.widget.settings.attitudeData = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.widget.settings.positionData = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        scope.closeSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        //selected vehicle equals vehicle in settings when close
       
        expect(scope.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.settings.positionData).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.widget.settings.totalAttitudeArray).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.widget.settings.totalPositionArray).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle).toEqual('A0');
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

    it('should open the left sidebar/Data Menu when function is called(window width > 1440)', function() {
        windowMock.innerWidth = 1441;

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
        scope.chosenCategory = 'attitude';
        scope.widget.settings.dataArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'});
        scope.getValue(false);

        expect(scope.widget.settings.totalAttitudeArray).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.readValues('attitude')).toEqual('q1, q2, q3, qc');
    });

    it('should show position values that the user has selected in input box', function() {
        scope.chosenCategory = 'position';
        scope.widget.settings.dataArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        expect(scope.widget.settings.totalPositionArray).toEqual([
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
        scope.widget.settings.totalAttitudeArray.length = 0;
        scope.widget.settings.totalPositionArray.length = 0;
        scope.getValue();
        scope.saveSettings(scope.widget);
        expect(scope.positionparametersErrMsg).toEqual("Please fill out this field.");
        expect(scope.attitudeparametersErrMsg).toEqual("Please fill out this field.");
    });

    it('should store the value of selected attitude parameters when category is attitude', function() {
        //windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "name": "quaternion q1",
                "category": "attitude",
                "notes": ""
            }
        });

        scope.chosenCategory = 'attitude';
        scope.widget.settings.dataArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'});
        scope.getValue(false);

        //scope.lock = { lockLeft : true, lockRight : false }

        expect(scope.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        expect(scope.widget.settings.totalAttitudeArray).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        //expect(scope.lock.lockLeft).toEqual(false);
        //expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should store only the value of last four selected attitude parameters when category is attitude and number of paramters selected is more than 4', function() {
        //windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "name": "quaternion q1",
                "category": "attitude",
                "notes": ""
            }
        });

        scope.chosenCategory = 'attitude';
        scope.widget.settings.dataArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'});
        scope.getValue(false);

        //scope.lock = { lockLeft : true, lockRight : false }

        expect(scope.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.widget.settings.totalAttitudeArray).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);

        expect(scope.vehicle).toEqual('A0');
        //expect(scope.lock.lockLeft).toEqual(false);
        //expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should not store the value of selected attitude parameters when category is attitude and number of parameters is not equal to 4', function() {
        scope.widget.settings.totalPositionArray = [{vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}];

        scope.chosenCategory = 'attitude';
        scope.widget.settings.dataArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'});
        scope.getValue(false);

        scope.saveSettings(scope.widget);

        expect(scope.widget.settings.totalAttitudeArray).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'}
        ]);
        expect(scope.settings.attitudeData).toEqual([]);
        expect(scope.vehicle).toEqual('');
        expect(scope.positionparametersErrMsg).toEqual("");
        expect(scope.attitudeparametersErrMsg).toEqual("Required: All attitude coordinates(q1,q2,q3,qc)!");
    });

    it('should store the value of selected position parameters when category is position', function() {
        //windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "name": "position x",
                "category": "attitude",
                "notes": ""
            }
        });

        scope.chosenCategory = 'position';
        scope.widget.settings.dataArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        //scope.lock = { lockLeft : true, lockRight : false }

        expect(scope.settings.positionData).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.widget.settings.totalPositionArray).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        //expect(scope.lock.lockLeft).toEqual(false);
        //expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
    });

    it('should store only the value of last three selected position parameters when category is position and number of paramters selected is more than 3', function() {
        //windowMock.innerWidth = 1440;
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "name": "position x",
                "category": "attitude",
                "notes": ""
            }
        });

        scope.chosenCategory = 'position';
        scope.widget.settings.dataArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'});
        scope.getValue(false);

        //scope.lock = { lockLeft : true, lockRight : false }

        expect(scope.settings.positionData).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.widget.settings.totalPositionArray).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        //expect(scope.lock.lockLeft).toEqual(false);
        //expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });


    it('should not store the value of selected position parameters when category is position and number of parameters is not equal to 3', function() {
        dashboardService.getData.and.callFake(function(){
            return {
                "value":0.688,
                "warn_high": "1",
                "warn_low": "-1",
                "alarm_high": "1.1",
                "alarm_low": "-1.1",
                "units": "",
                "name": "position x",
                "category": "attitude",
                "notes": ""
            }
        });

        scope.widget.settings.totalAttitudeArray = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];

        scope.chosenCategory = 'position';
        scope.widget.settings.dataArray = [];
        scope.widget.settings.totalPositionArray = [];

        scope.widget.settings.dataArray.push({vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'});
        scope.getValue(false);
        scope.widget.settings.dataArray.push({vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'});
        scope.getValue(false);

        expect(scope.settings.positionData).toEqual([]);
        expect(scope.widget.settings.totalAttitudeArray).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.widget.settings.totalPositionArray).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'}
        ]);
        expect(scope.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);

        expect(scope.vehicle).toEqual('A0');

        scope.saveSettings(scope.widget);
        expect(scope.positionparametersErrMsg).toEqual("Required: All position coordinates(x,y,z)!");
        expect(scope.attitudeparametersErrMsg).toEqual("");
    });

    it('should not close the settings menu on save if both attitude and position selected is of different vehicles', function() {
        scope.settings.attitudeData = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.settings.positionData = [
            {vehicle:'A1',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A1',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A1',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];

        scope.widget.settings.totalPositionArray = angular.copy(scope.settings.attitudeData);
        scope.widget.settings.totalAttitudeArray = angular.copy(scope.settings.positionData);
        scope.attitudeBooleans = [true, true, true, true];
        scope.positionBooleans = [true, true, true, true];
        scope.widget.main = false;
        scope.widget.settings.active = true;
        scope.saveSettings(scope.widget);
        
        //expect(windowMock.alert).toHaveBeenCalledWith("Both Attitude and Position Values should be of the same vehicle.");
        expect(scope.positionparametersErrMsg).toEqual("Vehicles of both fields do not match! Selected from vehicle: A1");
        expect(scope.attitudeparametersErrMsg).toEqual("Vehicles of both fields do not match! Selected from vehicle: A0");
    });

    it('should properly give values to arrays when close button is clicked on settings menu given that data has already been saved once before', function() {
        windowMock.innerWidth = 1441;
        scope.widget.settings.attitudeData = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.widget.settings.positionData = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];
        scope.widget.settings.vehicle = 'A0';
        scope.widget.main = false;
        scope.widget.settings.active = true;
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        scope.closeSettings(scope.widget);
        
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.widget.settings.totalAttitudeArray).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.settings.positionData).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.widget.settings.totalPositionArray).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);        
    });


    /*it('should not close the settings menu on save if both attitude and position are not selected completely', function() {
        scope.settings.attitudeData = [

        ];
        scope.settings.positionData = [

        ];

        scope.widget.settings.totalPositionArray = [{vehicle:'A1',id:'x',key:'A0.GNC.position.x',category:'position'}];
        scope.widget.settings.totalAttitudeArray = [{vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'}];
        scope.attitudeBooleans = [true, true, true, true];
        scope.positionBooleans = [true, true, true, true];
        scope.widget.main = false;
        scope.widget.settings.active = true;
        spyOn(windowMock, "alert");

        scope.saveSettings(scope.widget);
        
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the quaternion coordinates:q1,q2,q3,qc and position coordinates:x,y,z");
    });*/

    /*it('should not close the settings menu on save if attitude is selected but all position parameters not selected', function() {
        scope.widget.settings.totalPositionArray = [{vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'}];
        scope.widget.settings.totalAttitudeArray = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.attitudeBooleans = [true, true, true, true];
        scope.positionBooleans = [true, true, true, true];
        scope.settings.positionData = [];
        scope.settings.attitudeData = angular.copy(scope.widget.settings.totalAttitudeArray);
        scope.widget.main = false;
        scope.widget.settings.active = true;
        spyOn(windowMock, "alert");

        scope.saveSettings(scope.widget);

        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the position coordinates:x,y,z");
    });*/

    /*it('should not close the settings menu on save if position is selected but all attitude parameters not selected', function() {
        scope.settings.attitudeData = [];
        scope.settings.positionData = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];
        scope.widget.settings.totalAttitudeArray = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'}
        ];
        scope.widget.settings.totalPositionArray = [{vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'}];
        scope.attitudeBooleans = [true, true, true, true];
        scope.positionBooleans = [true, true, true, true];
        scope.widget.main = false;
        scope.widget.settings.active = true;
        spyOn(windowMock, "alert");

        scope.saveSettings(scope.widget);
        
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the quaternion coordinates:q1,q2,q3,qc");
    });*/

    it('should close the settings menu on save if data is selected', function() {
        scope.settings.attitudeData = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.settings.positionData = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];

        scope.widget.settings.totalPositionArray = angular.copy(scope.settings.positionData);
        scope.widget.settings.totalAttitudeArray = angular.copy(scope.settings.attitudeData);
        scope.attitudeBooleans = [true, true, true, true];
        scope.positionBooleans = [true, true, true, true];

        scope.vehicle = 'A0';
        scope.widget.main = false;
        scope.widget.settings.active = true;

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

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

        scope.saveSettings(scope.widget);
        scope.$digest();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.widget.main).toEqual(true);
        expect(scope.widget.settings.active).toEqual(false);
        expect(scope.widget.settings.vehicle).toEqual('A0');
        expect(scope.widget.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.widget.settings.positionData).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
    });

    it('should open quaternion coordinate list on call to openAttitudeList function', function() {
        scope.settings.attitudeData = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.settings.positionData = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];

        scope.widget.settings.totalPositionArray = angular.copy(scope.settings.attitudeData);
        scope.widget.settings.totalAttitudeArray = angular.copy(scope.settings.positionData);
        scope.attitudeBooleans = [true, true, true, true];
        scope.positionBooleans = [true, true, true, true];

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

        scope.openAttitudeList();
        scope.$digest();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
    });

    it('should open position coordinate list on call to openPositionList function', function() {
        scope.settings.attitudeData = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.settings.positionData = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];

        scope.widget.settings.totalPositionArray = angular.copy(scope.settings.attitudeData);
        scope.widget.settings.totalAttitudeArray = angular.copy(scope.settings.positionData);
        scope.attitudeBooleans = [true, true, true, true];
        scope.positionBooleans = [true, true, true, true];

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

        scope.openPositionList();
        scope.$digest();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
    });
})