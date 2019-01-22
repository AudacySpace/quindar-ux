describe('Testing right sidebar component', function () {
    var $controller, dashboardService, gridService, userService, 
        deferredLoad, scope, deferredUser, $intervalSpy;
    var windowMock = {
        innerWidth: 1000
    };

    var modalInstance = { open: function() {} };
    var ModalService = { showModal: function() {} };

    beforeEach(function () {
        // load the module
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
            sideNavOpenMock = jasmine.createSpy();
            sideNavCloseMock = jasmine.createSpy();
            $provide.factory('$mdSidenav', function() {
                return function(sideNavId){
                    return { 
                        open: sideNavOpenMock,
                        close: sideNavCloseMock
                    };
                };
            });
        });

        inject(function($componentController, _$q_, $rootScope, $interval){
            scope = $rootScope.$new();
            deferredLoad = _$q_.defer();
            deferredUser = _$q_.defer();
            $intervalSpy = jasmine.createSpy('$interval', $interval);

            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getLock', 'getCurrentMission', 'setRightLock','setLoadStatus']);
            gridService = jasmine.createSpyObj('gridService', 
                ['addWidget', 'addWidgets', 'clear', 'getDashboard', 'save', 'load', 'showLayout', 'widgetDefinitions','setGridLoader']);
            userService = jasmine.createSpyObj('userService', ['userRole', 'getUserName', 'getUserEmail', 'getOnlineUsers']);
            
            userService.getUserEmail.and.callFake(function() {
                return 'john.smith@gmail.com';
            });
            userService.getUserName.and.callFake(function() {
                return 'John Smith';
            });
            userService.userRole.and.callFake(function() {
                return { cRole : { 'callsign' : 'MD'}};
            });
            gridService.widgetDefinitions.and.callFake(function() {
                return [];
            });
            gridService.load.and.callFake(function(){
                return deferredLoad.promise;
            })
            dashboardService.getCurrentMission.and.callFake(function() {
                return { missionName : "ATest" };
            })
            userService.getOnlineUsers.and.callFake(function() {
                return deferredUser.promise;
            })
            
            $controller = $componentController('rightSidebar', {
                $scope : scope,
                dashboardService : dashboardService,
                gridService : gridService,
                userService : userService,
                $uibModal : modalInstance,
                ModalService : ModalService,
                $interval: $intervalSpy
            });
        });

    });

    it('should define the right sidebar component', function() {
        expect($controller).toBeDefined();
    });

    it('should define user name and email', function() {
        expect(userService.getUserEmail).toHaveBeenCalled();
        expect($controller.email).toEqual('john.smith@gmail.com');
        expect(userService.getUserName).toHaveBeenCalled();
        expect($controller.name).toEqual('John Smith');
    });

    it('should define user role', function() {
        expect($controller.userRole).toBeDefined();
        expect($controller.userRole).toEqual(userService.userRole);

        //update innerWidth for the next test
        windowMock.innerWidth = 768;
    });

    it('should define user role as observer on smaller screens', function() {
        var role = {
            cRole : {
                "name": "Observer",
                "callsign": "VIP"
            }
        };

        expect($controller.userRole).toBeDefined();
        expect($controller.userRole).toEqual(role);
    });

    it('should define widgetDefinitions', function() {
        expect($controller.widgetDefinitions).toBeDefined();
        expect($controller.widgetDefinitions).toEqual(gridService.widgetDefinitions);
    });

    it('should define default values', function() {
        expect($controller.QwidgetMenu).toEqual(false);
        expect($controller.addMenu).toEqual(false);
    });

    it('should define function addWidget', function(){
        expect($controller.addWidget).toBeDefined();
    });

    it('should call addWidget of gridService when addWidget function is called', function(){
        $controller.addWidget();

        expect(gridService.addWidget).toHaveBeenCalled();
    });

    it('should define function clear', function(){
        expect($controller.clear).toBeDefined();
    });

    it('should call clear of gridService when clear function is called', function(){
        $controller.clear();

        expect(gridService.clear).toHaveBeenCalled();
    });

    it('should define function addWidgets', function(){
        expect($controller.addWidgets).toBeDefined();
    });

    it('should call addWidgets of gridService when addWidgets function is called', function(){
        widget = {};
        $controller.addWidgets(widget);

        expect(gridService.addWidgets).toHaveBeenCalledWith(widget);
    });

    it('should define the function showQwidgetMenu', function(){
        expect($controller.showQwidgetMenu).toBeDefined();
    });

    it('should toggle the parameter QwidgetMenu when called', function(){
        $controller.QwidgetMenu = false;

        $controller.showQwidgetMenu();
        expect($controller.QwidgetMenu).toEqual(true);

        $controller.QwidgetMenu = true;

        $controller.showQwidgetMenu();
        expect($controller.QwidgetMenu).toEqual(false);
    });

    it('should define the function showAddMenu', function(){
        expect($controller.showAddMenu).toBeDefined();
    });

    it('should toggle the parameter addMenu when called', function(){
        $controller.addMenu = false;

        $controller.showAddMenu();
        expect($controller.addMenu).toEqual(true);

        $controller.addMenu = true;

        $controller.showAddMenu();
        expect($controller.addMenu).toEqual(false);
    });

    it('should define the function load', function(){
        expect($controller.load).toBeDefined();
    });

    it('should load all the layouts when load function is called', function(){
        $controller.layoutMenu = false
        var result = [{
            mission : {},
            name : 'Home',
            widgets : [{}, {}]
        }, {
            mission : {},
            name : 'Work',
            widgets : [{}, {}]
        }];

        deferredLoad.resolve({ data : result });
        $controller.load();

        // expect($controller.layouts.length).toEqual(0);
        //to make the deferred resolve work, call digest cycle
        scope.$digest();

        expect($controller.layouts).toEqual(result);
        expect($controller.layoutMenu).toEqual(true);
    });

    it('should define the function showLayout', function(){
        expect($controller.showLayout).toBeDefined();
    });

    it('should call the gridService layout and update the window title, when showLayout is called', function(){
        windowMock.document = {
            title : "Quindar"
        };

        $controller.layouts = [{
            mission : {},
            name : 'Home',
            widgets : [{}, {}]
        }, {
            mission : {},
            name : 'Work',
            widgets : [{}, {}]
        }];

        var layout = {
            mission : {},
            name : 'Work',
            widgets : [{}, {}]
        };

        $controller.showLayout(layout);

        expect(gridService.showLayout).toHaveBeenCalledWith($controller.layouts, layout);
        expect(windowMock.document.title).toEqual('Quindar - Work');

        //expect the mocked mdSidenav close function to be called
        expect(sideNavCloseMock).toHaveBeenCalled();

        delete windowMock.document;
    });

    it('should define the function showDoc', function(){
        expect($controller.showAddMenu).toBeDefined();
    });

    it('should toggle the parameter Doc when called', function(){
        $controller.Doc = false;

        $controller.showDoc();
        expect($controller.Doc).toEqual(true);

        $controller.Doc = true;

        $controller.showDoc();
        expect($controller.Doc).toEqual(false);
    });

    it('should define the function showReadme', function(){
        expect($controller.showReadme).toBeDefined();
    });

    it('should call the modal service to show the readme file', function(){
        var fakeModal = {
            result: {
                then: function(cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.cancelCallback = cancelCallback;
                }
            }
        };
        spyOn(modalInstance, 'open').and.returnValue(fakeModal);
        $controller.showReadme();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(sideNavCloseMock).toHaveBeenCalled();
    });

    it('should define the function showContributing', function(){
        expect($controller.showContributing).toBeDefined();
    });

    it('should call the modal service to show the contributing file', function(){
        var fakeModal = {
            result: {
                then: function(cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.cancelCallback = cancelCallback;
                }
            }
        };
        spyOn(modalInstance, 'open').and.returnValue(fakeModal);
        $controller.showContributing();

        expect(modalInstance.open).toHaveBeenCalled();
        expect(sideNavCloseMock).toHaveBeenCalled();
    });

    it('should define the function showAdminModal', function(){
        expect($controller.showAdminModal).toBeDefined();
    })

    it('should open the modal for the administrator', function(){
        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };
        spyOn(modalInstance, 'open').and.returnValue(fakeModal);
        $controller.showAdminModal();

        //expect the mocked mdSidenav open function to be called
        expect(modalInstance.open).toHaveBeenCalled();
    })

    it('should define the function showUsers', function(){
        expect($controller.showUsers).toBeDefined();
    });

    it('should toggle the parameter userMenu when called', function(){
        $controller.userMenu = false;

        $controller.showUsers();
        expect($controller.userMenu).toEqual(true);

        $controller.userMenu = true;

        $controller.showUsers();
        expect($controller.userMenu).toEqual(false);
    });

    it('should define the function createUserList', function(){
        expect($controller.createUserList).toBeDefined();
    });

    it('should create a list of online users on user menu', function(){
        var result = [{
            google: {
                email: "john.smith@gmail.com",
                name: "John Smith",
                id: "112313425445562239891"
            },
            missions: [{
                name: "ATest",
                currentRole: {
                    name: "Observer",
                    callsign: "VIP"
                },
                allowedRoles: [
                {
                    name: "Observer",
                    callsign: "VIP"
                }],
                online: true
            }]
        }];

        deferredUser.resolve({ data : result, status : 200});
        $controller.createUserList();

        //to make the deferred resolve work, call digest cycle
        scope.$digest();

        expect($controller.users).toEqual(result);
    });

    it('should call $interval one time', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    });

    it('should call $interval on createUserList function', function(){
        expect($intervalSpy).toHaveBeenCalledWith($controller.createUserList, 5000);
    });

});
