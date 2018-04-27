describe('Testing data table controller', function () {
    var controller, scope, dashboardService, sidebarService, sideNavOpenMock,
        datastatesService, $intervalSpy;

    var windowMock = {
        alert : function() {},
        innerWidth: 1000
    };

    var ev = {
            target : {
                parentElement : {
                    parentElement : {
                        parentElement : {
                            firstElementChild : {
                                firstElementChild : {
                                    style : {
                                        color : ""
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    var arrow = ev.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;

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

        inject(function($controller, $rootScope, $interval){
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            sidebarService = jasmine.createSpyObj('sidebarService', ['getVehicleInfo']);;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getLock', 'setLeftLock', 'icons', 'getData']);
            datastatesService = jasmine.createSpyObj('datastatesService', ['colorValues', 'getDataColor']);
            scope = $rootScope.$new();
            scope.widget = {
                name: "Data Table",
                main: true,
                saveLoad: false,
                delete: false,
                settings: {
                    active: false,
                    checkedValues:{
                        checkedId: true,
                        checkedName: true,
                        checkedAlow: true,
                        checkedWlow: true,
                        checkedValue: true,
                        checkedWhigh: true,
                        checkedAhigh: true,
                        checkedUnits: true,
                        checkedNotes: true
                    },
                    data : []
                }
            };

            controller = $controller('DataTableCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                sidebarService: sidebarService,
                datastatesService: datastatesService,
                $interval: $intervalSpy
            });
        });

    });

    it('data table controller should be defined', function() {
        expect(controller).toBeDefined();
    });

    it('should define dataStatus', function(){
        dashboardService.icons.and.callFake(function() {
            return {sIcon:"green", gIcon:"green", pIcon:"green",dIcon:"green"};
        });
        expect(scope.dataStatus).toBeDefined();
        expect(scope.dataStatus).toEqual(dashboardService.icons);
    });

    it('should assign default value to checkedValues variable', function() {
        expect(scope.checkedValues).toEqual(scope.widget.settings.checkedValues);
    });

    it('should create 39 table rows in the data table', function() {
        expect(scope.table.rows.length).toEqual(40);
        //each row has nine columns
        expect(scope.table.rows[0].contents.length).toEqual(9);
    });

    it('should define function getTelemetrydata', function() {
        expect(scope.getTelemetrydata).toBeDefined();
    });

    it('should open the left sidebar/Data Menu when function is called(window width < 1400)', function() {
        scope.getTelemetrydata(ev);

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
        expect(arrow.style.color).toEqual('#07D1EA');
    });

    it('should open the left sidebar/Data Menu when function is called(window width > 1400)', function() {
        windowMock.innerWidth = 1440;
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : false, lockRight : false }
        });

        scope.getTelemetrydata(ev);

        expect(scope.lock).toEqual({ lockLeft : true, lockRight : false });
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(true);
        expect(arrow.style.color).toEqual('#07D1EA');
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

        scope.getValue(ev, {}, 1);
        expect(windowMock.alert).toHaveBeenCalledWith("Vehicle data not set. Please select from Data Menu");
        expect(arrow.style.color).toEqual('#07D1EA');
    });

    it('should alert the user if a group(not ID) is selected from the left menu', function() {
        spyOn(windowMock, "alert");
        var data = {
            parameters:[]
        };
        data.parameters[0] = { 
                id: 'velocity',
                vehicle: 'A0',
                key: 'A0.GNC.velocity',
                category: 'GNC'

            }
        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        dashboardService.getData.and.callFake(function() {
            return {
                "v": {},
                "vx": {},
                "vy": {},
                "vz": {}
            };
        });

        scope.getValue(ev, {}, 1);

        expect(windowMock.alert).toHaveBeenCalledWith("Please select telemetry ID(leaf node) from Data Menu");
        expect(arrow.style.color).toEqual('#07D1EA');
    });

    it('should store the value of selected vehicle and id in scope.data variable', function() {
        windowMock.innerWidth = 1000;
        var index = 1;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'category' 
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
                "name": "x velocity component in ECF",
                "category": "velocity",
                "notes": ""
            };
        });

        scope.getValue(ev, {}, index);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.vx');
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should close the left menu after storing data into variable(window width>1400)', function() {
        windowMock.innerWidth = 1440;
        scope.lock = { lockLeft : true, lockRight : false };
        var index = 1;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'category' 
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
                "name": "x velocity component in ECF",
                "category": "velocity",
                "notes": ""
            };
        });

        scope.getValue(ev, {}, index);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should define function applyGroup', function() {
        expect(scope.applyGroup).toBeDefined();
    });

    it('should alert the user if the vehicle and id from the left menu are not available', function() {
        spyOn(windowMock, "alert");

        var data = {
            parameters:[]
        };


        sidebarService.getVehicleInfo.and.callFake(function(){
            return data;
        });

        scope.applyGroup(ev, {}, 1);

        expect(windowMock.alert).toHaveBeenCalledWith("Data not set. Please select from Data Menu");
        expect(arrow.style.color).toEqual('#07D1EA');
    });

    it('should alert the user if an ID(not group) is selected from the left menu', function() {
        spyOn(windowMock, "alert");
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'category' 
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
                "name": "x velocity component in ECF",
                "category": "velocity",
                "notes": ""
            };
        });

        scope.applyGroup(ev, {}, 1);

        expect(windowMock.alert).toHaveBeenCalledWith("Please select group(not ID) from Data Menu");
        expect(arrow.style.color).toEqual('#07D1EA');
    });

    it('should store the value of selected group keys in widget settings variable', function() {
        windowMock.innerWidth = 1000;
        var index = 1;
        var vehicleInfo = { 
            id: 'velocity',
            vehicle: 'A0',
            key: 'A0.GNC.velocity',
            category: 'GNC' 
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
                "v": {},
                "vx": {},
                "vy": {},
                "vz": {}
            };
        });

        scope.applyGroup(ev, {}, index);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.v');
        expect(scope.widget.settings.data[index+1].type).toEqual('data');
        expect(scope.widget.settings.data[index+1].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data[index+2].type).toEqual('data');
        expect(scope.widget.settings.data[index+2].value).toEqual('A0.GNC.velocity.vy');
        expect(scope.widget.settings.data[index+3].type).toEqual('data');
        expect(scope.widget.settings.data[index+3].value).toEqual('A0.GNC.velocity.vz');
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should close the left menu after storing keys of the group into settings variable(window width>1400)', function() {
        windowMock.innerWidth = 1440;
        scope.lock = { lockLeft : true, lockRight : false };
        var index = 1;
        var vehicleInfo = { 
            id: 'velocity',
            vehicle: 'A0',
            key: 'A0.GNC.velocity' 
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
                "v": {},
                "vx": {},
                "vy": {},
                "vz": {}
            };
        });

        scope.applyGroup(ev, {}, index);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.v');
        expect(scope.widget.settings.data[index+1].type).toEqual('data');
        expect(scope.widget.settings.data[index+1].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data[index+2].type).toEqual('data');
        expect(scope.widget.settings.data[index+2].value).toEqual('A0.GNC.velocity.vy');
        expect(scope.widget.settings.data[index+3].type).toEqual('data');
        expect(scope.widget.settings.data[index+3].value).toEqual('A0.GNC.velocity.vz');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should define function addRowAbove', function() {
        expect(scope.addRowAbove).toBeDefined();
    });

    it('should increase the number of rows in table when a row is added with addRowAbove', function() {
        var index = 2;

        scope.addRowAbove(index);

        expect(scope.table.rows.length).toEqual(41);
    });

    it('should alert the user when row limit(80) is reached for the table', function() {
        spyOn(windowMock, 'alert');
        scope.table.rows.length = 80;
        var index = 2;

        scope.addRowAbove(index);

        expect(windowMock.alert).toHaveBeenCalledWith("You have reached the maximum limit for rows!");
    });

    it('should define function addRowBelow', function() {
        expect(scope.addRowBelow).toBeDefined();
    });

    it('should increase the number of rows in table when a row is added with addRowBelow', function() {
        var index = 2;

        scope.addRowBelow(index);

        expect(scope.table.rows.length).toEqual(41);
    });

    it('should alert the user when row limit(80) is reached for the table', function() {
        spyOn(windowMock, 'alert');
        scope.table.rows.length = 80;
        var index = 2;

        scope.addRowBelow(index);

        expect(windowMock.alert).toHaveBeenCalledWith("You have reached the maximum limit for rows!");
    });
    
    it('should define function deleteRow', function() {
        expect(scope.deleteRow).toBeDefined();
    });

    it('should decrease the number of rows by 1 in table when a row is deleted with deleteRow', function() {
        var index = 2;

        scope.deleteRow(index);

        expect(scope.table.rows.length).toEqual(39);
    });

    it('should alert the user when there is a single row in the table for deletion', function() {
        spyOn(windowMock, 'alert');
        scope.table.rows.length = 1;
        var index = 0;

        scope.deleteRow(index);

        expect(windowMock.alert).toHaveBeenCalledWith("Please do not delete this row!Add row above to delete this row.");
    });

    it('should define function moveRowUp', function() {
        expect(scope.moveRowUp).toBeDefined();
    });

    it('should alert the user when the index is 0 in the table when moveRowUp is called', function() {
        spyOn(windowMock, 'alert');
        var index = 0;

        scope.moveRowUp(index);

        expect(windowMock.alert).toHaveBeenCalledWith("This row cannot be moved further up!");
    });

    it('should define function moveRowDown', function() {
        expect(scope.moveRowDown).toBeDefined();
    });

    it('should alert the user when the end of the table is reached when moveRowDown is called', function() {
        spyOn(windowMock, 'alert');
        var index = 39;
        scope.table.rows.length = 40

        scope.moveRowDown(index);

        expect(windowMock.alert).toHaveBeenCalledWith("This row cannot be moved further down!You have reached the end of the table.");
    });

    it('should define function convertHeader', function() {
        expect(scope.convertHeader).toBeDefined();
    });

    it('should convert the row into a header when convertHeader is called', function() {
        var index = 2;

        scope.convertHeader(index);

        expect(scope.widget.settings.data[index].type).toEqual('header');
        expect(scope.widget.settings.data[index].value).toEqual({ data : '' });
    });

    it('should convert the row into a header with data value when convertHeader is called', function() {
        var index = 2;
        var expectedData = { data : 'Velocity' };

        scope.convertHeader(index, expectedData);

        expect(scope.widget.settings.data[index].type).toEqual('header');
        expect(scope.widget.settings.data[index].value).toEqual(expectedData);
    });

    it('should define function updateRow', function() {
        expect(scope.updateRow).toBeDefined();
    });

    it('should update the rows as per the telemetry data when updateRow is called', function() {
        var expectedContents = [{ 
                "datavalue":"vx"
            },{ 
                "datavalue":"x velocity component in ECF"
            },{ 
                "datavalue":"-14"
            },{ 
                "datavalue":"-10"
            },{ 
                "datavalue":-0.3201,
                "datacolor": undefined
            },{ 
                "datavalue":"10"
            },{ 
                "datavalue":"14"
            },{ 
                "datavalue":"km/s"
            },{ 
                "datavalue":"N/A"
            }];
        scope.table.rows = [{
            contents : [{ 
                "datavalue":""
            },{ 
                "datavalue":""
            },{ 
                "datavalue":""
            },{ 
                "datavalue":""
            },{ 
                "datavalue":""
            },{ 
                "datavalue":""
            },{ 
                "datavalue":""
            },{ 
                "datavalue":""
            },{ 
                "datavalue":""
            }]
        }];
        scope.widget.settings.data = [{
            type: "data",
            value: "A0.GNC.velocity.vx"
        }];

        dashboardService.getData.and.callFake(function() {
            return {
                "value": -0.3201368817947103,
                "warn_high": "10",
                "warn_low": "-10",
                "alarm_high": "14",
                "alarm_low": "-14",
                "units": "km/s",
                "name": "x velocity component in ECF",
                "category": "velocity",
                "notes": ""
            };
        });

        scope.updateRow();
        expect(scope.table.rows[0].contents).toEqual(expectedContents);

    });

    it('should call $interval one time', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    });

    it('should call $interval on updateRow function', function(){
        expect($intervalSpy).toHaveBeenCalledWith(scope.updateRow, 1000, 0, false);
    });

    it('should cancel interval when scope is destroyed', function(){
        spyOn($intervalSpy, 'cancel');
        scope.$destroy();
        expect($intervalSpy.cancel.calls.count()).toBe(1);
    });
})