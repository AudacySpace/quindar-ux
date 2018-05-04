describe('Testing satellite settings controller', function () {
    var controller, scope, dashboardService,sidebarService,sideNavOpenMock,$q;

    var windowMock = {
        alert : function(message) {},
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

            sidebarService = jasmine.createSpyObj('sidebarService',['getVehicleInfo'
                ]);

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
        expect(scope.attitudeDisplay).toEqual("q1,q2,q3,qc");
        expect(scope.positionDisplay).toEqual("x,y,z");
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

        scope.getValue('attitude');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select the parameters before apply!");
    });

    it('should store the value of selected attitude parameters when category is attitude', function() {
        windowMock.innerWidth = 1440;
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

        var data = { 
            parameters:[
                {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
                {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
                {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
                {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
            ]
        };
        scope.lock = { lockLeft : true, lockRight : false }

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue('attitude');
        expect(scope.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        expect(scope.attitudeDisplay).toEqual('q1,q2,q3,qc');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should store only the value of last four selected attitude parameters when category is attitude and number of paramters selected is more than 4', function() {
        windowMock.innerWidth = 1440;
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
        var data = { 
            parameters:[
                {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'},
                {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
                {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
                {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
                {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'},
            ]
        };
        scope.lock = { lockLeft : true, lockRight : false }

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue('attitude');
        expect(scope.settings.attitudeData).toEqual([
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        expect(scope.attitudeDisplay).toEqual('q1,q2,q3,qc');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });

    it('should not store the value of selected attitude parameters when category is attitude and number of parameters is not equal to 4', function() {
        spyOn(windowMock, "alert");
        var data = { 
            parameters:[
                {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
                {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
                {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue('attitude');
        expect(scope.settings.attitudeData).toEqual([]);
        expect(scope.vehicle).toEqual('');
        expect(scope.attitudeDisplay).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all attitude values:q1,q2,q3,qc");
    });

    it('should store the value of selected position parameters when category is position', function() {
        windowMock.innerWidth = 1440;
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

        scope.getValue('position');
        expect(scope.settings.positionData).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
        expect(scope.positionDisplay).toEqual('x,y,z');
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
                "name": "position x",
                "category": "attitude",
                "notes": ""
            }
        });
        var data = { 
            parameters:[
                {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
                {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
                {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
                {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'},
                {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
                {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
            ]
        };
        scope.lock = { lockLeft : true, lockRight : false }

        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue('position');
        expect(scope.settings.positionData).toEqual([
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ]);
        expect(scope.vehicle).toEqual('A0');
        expect(scope.positionDisplay).toEqual('x,y,z');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false); 
    });


    it('should not store the value of selected position parameters when category is position and number of parameters is not equal to 3', function() {
        spyOn(windowMock, "alert");
        var data = { 
            parameters:[
                {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
                {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'}
            ]
        };
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.getValue('position');
        expect(scope.settings.positionData).toEqual([]);
        expect(scope.vehicle).toEqual('');
        expect(scope.positionDisplay).toEqual('Click for data');
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all position values:x,y,z");
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
        scope.widget.main = false;
        scope.widget.settings.active = true;
        spyOn(windowMock, "alert");

        scope.saveSettings(scope.widget);
        
        expect(windowMock.alert).toHaveBeenCalledWith("Both Attitude and Position Values should be of the same vehicle.");
    });


    it('should not close the settings menu on save if both attitude and position are not selected', function() {
        scope.settings.attitudeData = [

        ];
        scope.settings.positionData = [

        ];
        scope.widget.main = false;
        scope.widget.settings.active = true;
        spyOn(windowMock, "alert");

        scope.saveSettings(scope.widget);
        
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the quaternion coordinates:q1,q2,q3,qc and position coordinates:x,y,z");
    });

    it('should not close the settings menu on save if attitude is selected but position parameters not selected', function() {
        scope.settings.attitudeData = [
            {vehicle:'A0',id:'q1',key:'A0.GNC.attitude.q1',category:'attitude'},
            {vehicle:'A0',id:'q2',key:'A0.GNC.attitude.q2',category:'attitude'},
            {vehicle:'A0',id:'q3',key:'A0.GNC.attitude.q3',category:'attitude'},
            {vehicle:'A0',id:'qc',key:'A0.GNC.attitude.qc',category:'attitude'}
        ];
        scope.settings.positionData = [];
        scope.widget.main = false;
        scope.widget.settings.active = true;
        spyOn(windowMock, "alert");

        scope.saveSettings(scope.widget);
        
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the position coordinates:x,y,z");
    });

    it('should not close the settings menu on save if position is selected but attitude parameters not selected', function() {
        scope.settings.attitudeData = [];
        scope.settings.positionData = [
            {vehicle:'A0',id:'x',key:'A0.GNC.position.x',category:'position'},
            {vehicle:'A0',id:'y',key:'A0.GNC.position.y',category:'position'},
            {vehicle:'A0',id:'z',key:'A0.GNC.position.z',category:'position'}
        ];
        scope.widget.main = false;
        scope.widget.settings.active = true;
        spyOn(windowMock, "alert");

        scope.saveSettings(scope.widget);
        
        expect(windowMock.alert).toHaveBeenCalledWith("Please select all the quaternion coordinates:q1,q2,q3,qc");
    });

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
        expect(scope.attitudeDisplay).toEqual('q1,q2,q3,qc');

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
        expect(scope.positionDisplay).toEqual('x,y,z');

    });
})