describe('Testing gridService', function () {
    var gridService, httpBackend, userService, deferredMission;

    var dashboards = {
        'Home': {
            name: 'Home',
            mission:{
                missionName: '',
                missionImage: ''
            },
            widgets: [{
                col: 0,
                row: 0,
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
                        key : ""
                    },
                    dataArray: []
                },
                saveLoad: false,
                delete: false
            },
            {
                col: 4,
                row: 0,
                sizeY: 3,
                sizeX: 4,
                name: "3D Model",
                directive: "satellite",
                directiveSettings: "satellitesettings",
                id: "satellite",
                icon: {
                    id: "l-plot",
                    type: "fa-cube"
                },
                main: true,
                settings: {
                    active: false,
                    dataArray: [],
                    totalAttitudeArray: [],
                    totalPositionArray: []
                },
                saveLoad: false,
                delete: false
            }]
        }
    };

    var windowMock = {
        document : {}
    };
    var sessionStorage = {};

    beforeEach(function () {
        // load the module
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
            $provide.value('$sessionStorage', sessionStorage);
        });

        userService = jasmine.createSpyObj('userService', ['userRole', 'setMissionForUser', 'getUserEmail']);


        spyOn(windowMock, "document").and.returnValue({title : "Quindar"});

        module(function($provide) {
          $provide.value('userService', userService);
        });

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _gridService_, _$q_) {
            deferredMission = _$q_.defer();

            userService.setMissionForUser.and.callFake(function(){
                return deferredMission.promise;
            });
            
            gridService = _gridService_;
            httpBackend = _$httpBackend_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //gridService should exist in the application
    it('should define the service gridService', function() {
    	expect(gridService).toBeDefined();
    });

    it('should define the default dashboard layouts', function() {
        expect(sessionStorage.dashboards).toBeDefined();
        expect(sessionStorage.dashboards).toEqual(dashboards);
    });

    it('should define the current dashboard and update the window title', function() {
        expect(windowMock.document.title).toEqual('Quindar - Home');
        expect(sessionStorage.dashboard).toBeDefined();
        expect(sessionStorage.dashboard).toEqual({"current" : dashboards['Home']});
    });

    it('should define the gridster options', function() {
        var gridsterOptions = {
            margins: [20, 20],
            columns: 8,
            draggable: {
                enabled: true,
                handle: '.box-header'
            }
        };

        expect(gridService.gridsterOptions).toBeDefined();
        expect(gridService.gridsterOptions).toEqual(gridsterOptions);
    });

    it('should define the widget definitions with total of 10 widgets', function() {
        expect(gridService.widgetDefinitions).toBeDefined();
        expect(gridService.widgetDefinitions.length).toEqual(10);
    });

    it('should define the getDashboardId function', function() {
        expect(gridService.getDashboardId).toBeDefined();
    });

    it('should return the current dashboard ID when getDashboardId is called', function() {
        expect(gridService.getDashboardId()).toEqual('Home');
    });

    it('should define the clear function', function() {
        expect(gridService.getDashboardId).toBeDefined();
    });

    it('should clear the dashboard when clear function is called', function() {
        gridService.clear();
        expect(sessionStorage.dashboard["current"].widgets).toEqual([]);
        expect(sessionStorage.dashboard["current"].widgets.length).toEqual(0);
    });

    it('should define the addWidgets function', function() {
        expect(gridService.addWidgets).toBeDefined();
    });

    it('should add the widget on current dashboard when addWidgets function is called', function() {
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
                },
                dataArray: []
            },
            saveLoad: false,
            delete: false
        }

        gridService.addWidgets(widget);
        expect(sessionStorage.dashboard["current"].widgets).toEqual([widget]);
        expect(sessionStorage.dashboard["current"].widgets.length).toEqual(1);
    });

    it('should define the remove function', function() {
        expect(gridService.remove).toBeDefined();
    });

    it('should remove the widget on current dashboard when remove function is called', function() {
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
                },
                dataArray: []
            },
            saveLoad: false,
            delete: false
        }

        gridService.remove(widget);
        expect(sessionStorage.dashboard["current"].widgets).toEqual([]);
        expect(sessionStorage.dashboard["current"].widgets.length).toEqual(0);
    });

    it('should define the save function', function() {
        expect(gridService.save).toBeDefined();
    });

    it('should be able to save the layout in database', function () {
        var email = "john.smith@gmail.com";
        var dashboardName = "Home";

        httpBackend.expectPOST("/saveLayout").respond(200, {});

        gridService.save(email, dashboardName).then( function(response){
            expect(response.status).toBe(200);
        });
        expect(sessionStorage.dashboard["current"].name).toEqual(dashboardName);

        httpBackend.flush();
    });

    it('should define the load function', function() {
        expect(gridService.load).toBeDefined();
    });

    it('should be able to retrieve the layouts from database', function () {
        sessionStorage.dashboard["current"].mission.missionName = "ATest";
        var layouts = [];
        var mission = "ATest";
        var email = "john.smith@gmail.com";
        var result = [{
            mission : {},
            widgets : [],
            name : "Home"
        }, {
            mission : {},
            widgets : [],
            name : "Home-2"
        }];
 
        httpBackend.expectGET('/loadLayout?email=john.smith@gmail.com&missionname=ATest').respond(200, result);

        gridService.load(email).then( function(response){
            layouts = response.data;
            expect(response.status).toBe(200);
            expect(layouts).toBeDefined();
            expect(layouts.length).toEqual(2);
            expect(layouts).toEqual(result);
        });

        httpBackend.flush();
    });

    it('should define the showLayout function', function() {
        expect(gridService.showLayout).toBeDefined();
    });

    it('should switch the dashboard layout when showLayout function is called', function() {
        var layouts = [{
            mission : {},
            widgets : [],
            name : "Home"
        }, {
            mission : {},
            widgets : [],
            name : "Home-2"
        }];

        var layout = {
            mission : {},
            widgets : [],
            name : "Home-2"
        }

        var dashboards = {
            'Home' : {
                mission : {},
                widgets : [],
                name : "Home"
            },
            'Home-2' : {
                mission : {},
                widgets : [],
                name : "Home-2"
            }
        }

        gridService.showLayout(layouts, layout);
        expect(sessionStorage.dashboards).toEqual(dashboards);
        expect(sessionStorage.dashboard["current"]).toEqual(layout);
    });

    it('should define the setMissionForLayout function', function() {
        expect(gridService.setMissionForLayout).toBeDefined();
    });

    it('should set mission name and image for layout when setMissionForLayout is called', function () {
        var mission = {
            missionName : "AZero",
            simulated : false
        };

        deferredMission.resolve({data: {}, status:200})
        gridService.setMissionForLayout(mission);

        expect(sessionStorage.dashboard["current"].mission.missionName).toEqual(mission.missionName);
        expect(sessionStorage.dashboard["current"].mission.simulated).toEqual(mission.simulated);
        expect(sessionStorage.dashboard["current"].mission.missionImage).toEqual("/media/icons/AudacyZero_Logo_White.jpg");
        expect(userService.setMissionForUser).toHaveBeenCalled();
    });

    it('should define the getMissionImage function', function() {
        expect(gridService.getMissionImage).toBeDefined();
    });

    it('should get the image url when getMissionImage is called', function () {
        var mname = "AZero";
        expect(gridService.getMissionImage(mname)).toEqual('/media/icons/AudacyZero_Logo_White.jpg');

        mname = "AudacyZero"
        expect(gridService.getMissionImage(mname)).toEqual("/media/icons/AudacyZero_Logo_White.jpg");
        
        mname = "Test"
        expect(gridService.getMissionImage(mname)).toEqual("/media/icons/Audacy_Icon_White.svg");
    });

    it('should define the loadMaps function', function() {
        expect(gridService.loadMaps).toBeDefined();
    });

    it('should be able to retrieve the system maps from database', function () {
        sessionStorage.dashboard["current"].mission.missionName = "ATest";
        var mission = "ATest";
        var result = [];
        var maps;
 
        httpBackend.expectGET('/loadSystemMaps?mission=ATest').respond(200, result);

        gridService.loadMaps(mission).then( function(response){
            maps = response.data;
            expect(response.status).toBe(200);
            expect(maps).toBeDefined();
            expect(maps.length).toEqual(0);
        });

        httpBackend.flush();
    });

    it('should define the loadTimelineEvents function', function() {
        expect(gridService.loadTimelineEvents).toBeDefined();
    });

    it('should be able to retrieve the layouts from database', function () {
        sessionStorage.dashboard["current"].mission.missionName = "ATest";
        var mission = "ATest";
        var result = [];
        var timelines;
 
        httpBackend.expectGET('/loadTimelineEvents?mission=ATest').respond(200, result);

        gridService.loadTimelineEvents(mission).then( function(response){
            timelines = response.data;
            expect(response.status).toBe(200);
            expect(timelines).toBeDefined();
            expect(timelines.length).toEqual(0);
        });

        httpBackend.flush();
    });
});
