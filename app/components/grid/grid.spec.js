describe('Testing grid component', function () {
    var $controller, gridService,dashboardService,userService, $interval, sidebarService;
    var windowMock = {
        location: {
            href: "/"
        },
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

        inject(function($componentController){
            gridService = jasmine.createSpyObj('gridService', ['getDashboard', 'gridsterOptions','getGridLoader','save']);
            dashboardService = jasmine.createSpyObj('dashboardService', ['getLoadStatus','getLock', 'getCurrentMission', 'getTime', 'setLeftLock', 'setRightLock']);
            userService = jasmine.createSpyObj('userService', ['userRole', 'getUserName', 'getUserEmail']);
            sidebarService = jasmine.createSpyObj('sidebarService', ['setMenuStatus', 'setOpenLogo']);


            userService.getUserEmail.and.callFake(function() {
                return 'john.smith@gmail.com';
            });
            userService.getUserName.and.callFake(function() {
                return 'John Smith';
            });
            userService.userRole.and.callFake(function() {
                return { cRole : { 'callsign' : 'MD'}};
            });
            dashboardService.getLock.and.callFake(function() {
                return { lockLeft : false, lockRight : false };
            });
            dashboardService.getCurrentMission.and.callFake(function() {
                return { missionName : 'ATest' };
            });
            $controller = $componentController('grid', {
                gridService: gridService,
                dashboardService: dashboardService,
                userService : userService,
                sidebarService : sidebarService,
                $uibModal : modalInstance,
                $interval : $intervalSpy
            });
        });

    });

    it('grid component controller should be defined', function() {
        expect($controller).toBeDefined();
    });

    it('gridsterOptions should be equal to the value in gridService', function() {
        var gridsterOptions = gridService.gridsterOptions;
        expect($controller.gridsterOptions).toEqual(gridsterOptions);
    });

    it('dashboard should be equal to the value in gridService', function() {
        var dashboard = gridService.getDashboard();
        expect($controller.dashboard).toEqual(dashboard);
    });

    it('remove function should be defined', function() {
        expect($controller.remove).toBeDefined();
    });

    it('remove function should open the delete menu', function() {
        var widget = {
            sizeY: 3,
            sizeX: 4,
            name: "Line Plot",
            directive: "graph",
            directiveSettings: "linesettings",
            id: "addLine",
            icon: {
                id: "l-plot",
                type: "fa-line-chart"
            },
            main: true,
            settings: {
                active: false,
                data : {
                    vehicles : [],
                    value : "", 
                    key: ""
                }
            },
            saveLoad: false,
            delete: false
        }

        $controller.remove(widget);
        expect(widget.delete).toEqual(true);
        expect(widget.main).toEqual(false);
    });

    it('openSettings function should be defined', function() {
        expect($controller.openSettings).toBeDefined();
    });

    it('openSettings function should open the settings menu', function() {
        var widget = {
            sizeY: 3,
            sizeX: 4,
            name: "Line Plot",
            directive: "graph",
            directiveSettings: "linesettings",
            id: "addLine",
            icon: {
                id: "l-plot",
                type: "fa-line-chart"
            },
            main: true,
            settings: {
                active: false,
                data : {
                    vehicles : [],
                    value : "", 
                    key: ""
                }
            },
            saveLoad: false,
            delete: false
        }

        $controller.openSettings(widget);
        expect(widget.settings.active).toEqual(true);
        expect(widget.main).toEqual(false);
    });

    it('openSaveLoadSettings should be defined', function() {
        expect($controller.openSaveLoadSettings).toBeDefined();
    });

    it('openSaveLoadSettings function should open the save and load menu', function() {
        var widget = {
            sizeY: 3,
            sizeX: 4,
            name: "Line Plot",
            directive: "graph",
            directiveSettings: "linesettings",
            id: "addLine",
            icon: {
                id: "l-plot",
                type: "fa-line-chart"
            },
            main: true,
            settings: {
                active: false,
                data : {
                    vehicles : [],
                    value : "", 
                    key: ""
                }
            },
            saveLoad: false,
            delete: false
        }

        $controller.openSaveLoadSettings(widget);
        expect(widget.saveLoad).toEqual(true);
        expect(widget.main).toEqual(false);
    });
});
