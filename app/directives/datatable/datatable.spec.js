describe('Testing data table controller', function () {
    var controller, scope, dashboardService, sidebarService, sideNavOpenMock,
        datastatesService, $intervalSpy;
    var element = angular.element('<div></div>'); //provide element you want to test
    var windowMock = {
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
            sidebarService = jasmine.createSpyObj('sidebarService', ['getVehicleInfo', 'setMenuStatus', 'setTempWidget', 'setOpenLogo']);;
            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getLock', 'setLeftLock', 'icons', 'getData','displayWidgetAlert']);
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
                        checkedAlow: true,
                        checkedWlow: true,
                        checkedValue: true,
                        checkedWhigh: true,
                        checkedAhigh: true,
                        checkedUnits: true,
                        checkedNotes: true
                    },
                    data : [],
                    previous: []
                }
            };

            controller = $controller('DataTableCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                sidebarService: sidebarService,
                datastatesService: datastatesService,
                $interval: $intervalSpy,
                $element: element
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
        expect(scope.table.rows[0].contents.length).toEqual(8);
    });

    it('should define function getTelemetrydata', function() {
        expect(scope.getTelemetrydata).toBeDefined();
    });

    it('should open the left sidebar/Data Menu when function is called(window width < 1400)', function() {
        scope.getTelemetrydata(ev);

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
        expect(arrow.style.color).toEqual('#07D1EA');
        expect(sidebarService.setMenuStatus).toHaveBeenCalledWith(true);
        expect(sidebarService.setOpenLogo).toHaveBeenCalledWith(false);
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
        expect(sidebarService.setMenuStatus).toHaveBeenCalledWith(true);
        expect(sidebarService.setOpenLogo).toHaveBeenCalledWith(false);
    });

    it('should define function getValue', function() {
        expect(scope.getValue).toBeDefined();
    });

    it('should not add anything if the vehicle and id from the left menu are not available', function() {
        scope.arrow = arrow;

        scope.widget.settings.dataArray = [];

        scope.getValue();

        expect(scope.widget.settings.dataArray.length).toEqual(0);
        expect(scope.widget.settings.dataArray.length).toEqual(0);
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should store the value of selected vehicle and id in scope.widget.settings.data variable', function() {
        var index = 1;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'category' 
        };

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        scope.widget.settings.dataArray = [vehicleInfo];
        scope.askedForGroup = false;
        scope.currentIndex = index;
        scope.arrow = arrow;

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

        scope.getValue(false);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should close the left menu after storing data into variable(window width>1400)', function() {
        windowMock.innerWidth = 1440;
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });
        var index = 1;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'category' 
        };

        scope.widget.settings.dataArray = [vehicleInfo];
        scope.askedForGroup = false;
        scope.currentIndex = index;
        scope.arrow = arrow;

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

        scope.getValue(false);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
        expect(scope.lock.lockLeft).toEqual(false);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(false);
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should define function applyGroup', function() {
        expect(scope.applyGroup).toBeDefined();
    });

    it('should alert the user if an ID(not group) is selected from the left menu', function() {
        scope.arrow = arrow;
        
        var data = { 
            id: 'velocity',
            vehicle: 'A0',
            key: 'A0.GNC.velocity',
            category: 'GNC'
        }
    
        scope.widget.settings.dataArray = [data];
        scope.askedForGroup = true;

        scope.getValue(false);
        expect(arrow.style.color).toEqual('#b3b3b3');
        expect(scope.widget.settings.dataArray.length).toEqual(0);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Be sure to select a group!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should not execute anything if a group(not ID) is selected from the left menu', function() {
        scope.arrow = arrow;
        
        var data = { 
            id: 'velocity',
            vehicle: 'A0',
            key: 'A0.GNC.velocity',
            category: 'GNC'
        }
        
        scope.widget.settings.dataArray = [data];
        scope.askedForGroup = false;

        scope.getValue(true);

        expect(arrow.style.color).toEqual('#b3b3b3');
        expect(scope.widget.settings.dataArray).toEqual([]);
    });

    it('should store the value of selected group keys in widget settings variable', function() {
        var index = 1;
        var vehicleInfo = { 
            id: 'velocity',
            vehicle: 'A0',
            key: 'A0.GNC.velocity',
            category: 'GNC' 
        };

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        scope.widget.settings.dataArray = [vehicleInfo];
        scope.currentIndex = index;
        scope.askedForGroup = true;
        scope.arrow = arrow;

        dashboardService.getData.and.callFake(function() {
            return {
                "v": {},
                "vx": {},
                "vy": {},
                "vz": {}
            };
        });

        scope.getValue(true);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.v');
        expect(scope.widget.settings.data[index+1].type).toEqual('data');
        expect(scope.widget.settings.data[index+1].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data[index+2].type).toEqual('data');
        expect(scope.widget.settings.data[index+2].value).toEqual('A0.GNC.velocity.vy');
        expect(scope.widget.settings.data[index+3].type).toEqual('data');
        expect(scope.widget.settings.data[index+3].value).toEqual('A0.GNC.velocity.vz');

        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
        expect(scope.widget.settings.previous[index+1].type).toEqual('');
        expect(scope.widget.settings.previous[index+1].value).toEqual('');
        expect(scope.widget.settings.previous[index+2].type).toEqual('');
        expect(scope.widget.settings.previous[index+2].value).toEqual('');
        expect(scope.widget.settings.previous[index+3].type).toEqual('');
        expect(scope.widget.settings.previous[index+3].value).toEqual('');

        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should close the left menu after storing keys of the group into settings variable(window width>1400)', function() {
        windowMock.innerWidth = 1440;
        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });
        var index = 1;
        var vehicleInfo = { 
            id: 'velocity',
            vehicle: 'A0',
            key: 'A0.GNC.velocity' 
        };

        scope.widget.settings.dataArray = [vehicleInfo];
        scope.currentIndex = index;
        scope.askedForGroup = true;
        scope.arrow = arrow;

        dashboardService.getData.and.callFake(function() {
            return {
                "v": {},
                "vx": {},
                "vy": {},
                "vz": {}
            };
        });

        scope.getValue(true);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.v');
        expect(scope.widget.settings.data[index+1].type).toEqual('data');
        expect(scope.widget.settings.data[index+1].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data[index+2].type).toEqual('data');
        expect(scope.widget.settings.data[index+2].value).toEqual('A0.GNC.velocity.vy');
        expect(scope.widget.settings.data[index+3].type).toEqual('data');
        expect(scope.widget.settings.data[index+3].value).toEqual('A0.GNC.velocity.vz');

        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
        expect(scope.widget.settings.previous[index+1].type).toEqual('');
        expect(scope.widget.settings.previous[index+1].value).toEqual('');
        expect(scope.widget.settings.previous[index+2].type).toEqual('');
        expect(scope.widget.settings.previous[index+2].value).toEqual('');
        expect(scope.widget.settings.previous[index+3].type).toEqual('');
        expect(scope.widget.settings.previous[index+3].value).toEqual('');

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
        scope.table.rows.length = 80;
        var index = 2;

        scope.addRowAbove(index);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("You have reached the maximum limit for rows!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
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
        scope.table.rows.length = 80;
        var index = 2;
        scope.addRowBelow(index);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("You have reached the maximum limit for rows!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
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
        scope.table.rows.length = 1;
        var index = 0;
        scope.deleteRow(index);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("Please do not delete this row!Add row above to delete this row.");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should define function moveRowUp', function() {
        expect(scope.moveRowUp).toBeDefined();
    });

    it('should alert the user when the index is 0 in the table when moveRowUp is called', function() {
        var index = 0;
        scope.moveRowUp(index);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("This row cannot be moved further up!");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should define function moveRowDown', function() {
        expect(scope.moveRowDown).toBeDefined();
    });

    it('should alert the user when the end of the table is reached when moveRowDown is called', function() {
        var index = 39;
        scope.table.rows.length = 40

        scope.moveRowDown(index);
        expect(dashboardService.displayWidgetAlert).toHaveBeenCalled();
        expect(scope.toasterusermessage).toEqual("This row cannot be moved further down! You have reached the end of the table.");
        expect(scope.toasterposition).toEqual("top left");
        expect(scope.toasterdelay).toEqual(false);
    });

    it('should define function convertHeader', function() {
        expect(scope.convertHeader).toBeDefined();
    });

    it('should convert the row into a header when convertHeader is called', function() {
        var index = 2;

        scope.convertHeader(index);

        expect(scope.widget.settings.data[index].type).toEqual('header');
        expect(scope.widget.settings.data[index].value).toEqual({ data : '' });
        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
    });

    it('should convert the row into a header with data value when convertHeader is called', function() {
        var index = 2;
        var expectedData = { data : 'Velocity' };

        scope.convertHeader(index, expectedData);

        expect(scope.widget.settings.data[index].type).toEqual('header');
        expect(scope.widget.settings.data[index].value).toEqual(expectedData);
        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
    });

    it('should define function updateRow', function() {
        expect(scope.updateRow).toBeDefined();
    });

    it('should update the rows as per the telemetry data when updateRow is called', function() {
        var expectedContents = [{ 
                "datavalue":"vx"
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
                "notes": ""
            };
        });

        scope.updateRow();
        expect(scope.table.rows[0].contents).toEqual(expectedContents);

    });

    it('should define function undo', function() {
        expect(scope.undo).toBeDefined();
    });

    it('should undo apply telemetry id and show a blank row', function() {
        var index = 2;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'category' 
        };

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        scope.widget.settings.dataArray = [vehicleInfo];
        scope.currentIndex = index;
        scope.askedForGroup = false;
        scope.arrow = arrow;

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

        scope.getValue(false);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
        expect(scope.widget.settings.data[index].undone).toEqual(false);
        expect(arrow.style.color).toEqual('#b3b3b3');

        scope.undo(index);

        expect(scope.widget.settings.data[index].type).toEqual('');
        expect(scope.widget.settings.data[index].value).toEqual('');
        expect(scope.widget.settings.previous[index].type).toEqual('data');
        expect(scope.widget.settings.previous[index].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data[index].undone).toEqual(true);
        expect(arrow.style.color).toEqual('#b3b3b3');
    });

    it('should undo convert header with data and show a blank row', function() {
        var index = 2;
        var expectedData = { data : 'Velocity' };

        scope.convertHeader(index, expectedData);

        expect(scope.widget.settings.data[index].type).toEqual('header');
        expect(scope.widget.settings.data[index].value).toEqual(expectedData);
        expect(scope.widget.settings.previous[index].type).toEqual('');
        expect(scope.widget.settings.previous[index].value).toEqual('');
        expect(scope.widget.settings.data[index].undone).toEqual(false);

        scope.undo(index);

        expect(scope.widget.settings.data[index].type).toEqual('');
        expect(scope.widget.settings.data[index].value).toEqual('');
        expect(scope.widget.settings.previous[index].type).toEqual('header');
        expect(scope.widget.settings.previous[index].value).toEqual(expectedData);
        expect(scope.widget.settings.data[index].undone).toEqual(true);

    });

    it('should undo convert header and show previously applied telemetry id', function() {
        var index = 2;
        var vehicleInfo = { 
            id: 'vx',
            vehicle: 'A0',
            key: 'A0.GNC.velocity.vx',
            category: 'category' 
        };

        dashboardService.getLock.and.callFake(function(){
            return { lockLeft : true, lockRight : false }
        });

        scope.widget.settings.dataArray = [vehicleInfo];
        scope.currentIndex = index;
        scope.askedForGroup = false;
        scope.arrow = arrow;

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

        scope.getValue(false);
        
        scope.convertHeader(index);

        expect(scope.widget.settings.data[index].type).toEqual('header');
        expect(scope.widget.settings.data[index].value).toEqual({ data : '' });
        expect(scope.widget.settings.previous[index].type).toEqual('data');
        expect(scope.widget.settings.previous[index].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.data[index].undone).toEqual(false);

        scope.undo(index);

        expect(scope.widget.settings.data[index].type).toEqual('data');
        expect(scope.widget.settings.data[index].value).toEqual('A0.GNC.velocity.vx');
        expect(scope.widget.settings.previous[index].type).toEqual('header');
        expect(scope.widget.settings.previous[index].value).toEqual({ data : '' });
        expect(scope.widget.settings.data[index].undone).toEqual(true);
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