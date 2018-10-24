describe('Testing dashboard component', function () {
    var $controller, dashboardService, gridService, userService, $interval, sidebarService;
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

        inject(function($componentController, $interval){
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            dashboardService = jasmine.createSpyObj('dashboardService', ['getLock', 'getCurrentMission', 'getTime', 'setLeftLock', 'setRightLock']);
            gridService = jasmine.createSpyObj('gridService', ['save', 'getDashboard']);
            userService = jasmine.createSpyObj('userService', ['userRole', 'getUserName', 'getUserEmail']);
            sidebarService = jasmine.createSpyObj('sidebarService', ['setMenuStatus', 'setOpenLogo']);
            //$interval = _$interval_;
            
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

            $controller = $componentController('dashboard', {
                dashboardService: dashboardService,
                gridService : gridService,
                userService : userService,
                sidebarService : sidebarService,
                $uibModal : modalInstance,
                $interval : $intervalSpy
            });
        });

    });

    it('should define the dashboard component', function() {
        expect($controller).toBeDefined();
    });

    it('should define user name, email and role', function() {
        expect(userService.getUserEmail).toHaveBeenCalled();
        expect($controller.email).toEqual('john.smith@gmail.com');
        expect(userService.getUserName).toHaveBeenCalled();
        expect($controller.name).toEqual('John Smith');
        expect($controller.role).toBeDefined();
        expect($controller.role).toEqual(userService.userRole);
    });

    it('should define current mission and locks', function() {
        expect(dashboardService.getLock).toHaveBeenCalled();
        expect($controller.locks).toEqual({ lockLeft : false, lockRight : false });
        expect(dashboardService.getCurrentMission).toHaveBeenCalled();
        expect($controller.currentMission).toEqual({ missionName : 'ATest' });
    });

    it('should define default clock', function() {
        expect($controller.clock).toEqual({
            utc : "000.00.00.00 UTC"
        });
    });

    it('should call $interval one time', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    });

    it('should call $interval on updateClock function', function(){
        expect($intervalSpy).toHaveBeenCalledWith($controller.updateClock, 500);
    });

    it('should define the function updateClock', function(){
        expect($controller.updateClock).toBeDefined();
    });

    it('should update time of the clock on call of updateClock', function(){
        dashboardService.getTime.and.callFake(function() {
            return {
                days : '070',
                minutes : '10',
                hours : '10',
                seconds : '50',
                utc : '070.10:10:50 UTC'
            };
        });

        $controller.updateClock();

        expect($controller.clock.utc).toEqual('070.10:10:50 UTC');
    });

    it('should define the function openLeftNav', function(){
        expect($controller.openLeftNav).toBeDefined();
    });

    it('should open the left navigation menu, window width less than 1440', function(){
        windowMock.innerWidth = 1078;
        $controller.openLeftNav();

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
        expect(sidebarService.setMenuStatus).toHaveBeenCalledWith(true);
        expect(sidebarService.setOpenLogo).toHaveBeenCalledWith(true);
    });

    it('should open the left navigation menu, window width more than 1440', function(){
        windowMock.innerWidth = 1441;
        $controller.openLeftNav();

        //expect the left lock to be toggled
        expect($controller.locks.lockLeft).toEqual(true);
        expect(dashboardService.setLeftLock).toHaveBeenCalledWith(true);
        expect(sidebarService.setMenuStatus).toHaveBeenCalledWith(true);
        expect(sidebarService.setOpenLogo).toHaveBeenCalledWith(true);
    });

    it('should define the function openRightNav', function(){
        expect($controller.openRightNav).toBeDefined();
    });

    it('should open the right navigation menu, window width less than 1440', function(){
        windowMock.innerWidth = 1078;
        $controller.openRightNav();

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
    });

    it('should open the right navigation menu, window width more than 1440', function(){
        windowMock.innerWidth = 1441;
        $controller.openRightNav();

        //expect the right lock to be toggled
        expect($controller.locks.lockRight).toEqual(true);
        expect(dashboardService.setRightLock).toHaveBeenCalledWith(true);
    });

    it('should define the function showSettings', function(){
        expect($controller.showSettings).toBeDefined();
    });

    it('should open the modal settings menu', function(){
        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            },
            close: function( item ) {
                //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                this.result.confirmCallBack( item );
            },
            dismiss: function( type ) {
                //The user clicked cancel on the modal dialog, call the stored cancel callback
                this.result.cancelCallback( type );
            }
        };
        spyOn(modalInstance, 'open').and.returnValue(fakeModal);
        $controller.showSettings();

        //expect the mocked mdSidenav open function to be called
        expect(modalInstance.open).toHaveBeenCalled();
    });

});
