describe('Testing role modal controller', function () {
    var controller, userService, deferredGetRole, deferredAllowed, deferredSetRole, scope,dashboardService;
    var windowMock = {
        alert: function(message) {
            
        },
        user : {
            role : {}
        },
        document:{}
    };
    var modalInstance = { close: function() {}, dismiss: function() {}, open: function() {} };
    var mission = { missionName : 'ATest', missionImage : '/media/icons/Audacy_Icon_White.svg'};

    beforeEach(function () {
        // load the module
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
        });

        inject( function($controller, _$q_, _userService_, $rootScope,_dashboardService_){
            scope = $rootScope.$new();
            userService = _userService_;
            dashboardService = _dashboardService_;
            deferredGetRole = _$q_.defer();
            deferredSetRole = _$q_.defer();
            deferredAllowed = _$q_.defer();
            spyOn(userService, "getCurrentRole").and.returnValue(deferredGetRole.promise);
            spyOn(userService, "setCurrentRole").and.returnValue(deferredSetRole.promise);
            spyOn(userService, "getAllowedRoles").and.returnValue(deferredAllowed.promise);
            spyOn(dashboardService,"displayAlert").and.returnValue(true);

            controller = $controller('modalCtrl', {
                $scope : scope,
                $uibModalInstance: modalInstance,
                userService: userService,
                mission: mission,
                dashboardService: dashboardService
            });
            
        });
    });

    it('should define role modal controller', function() {
    	expect(controller).toBeDefined();
    });

    it('should call the user service to get the current role of the user', function() {
        var cRole = { 
            name : 'Mission Director', 
            callsign : 'MD'
        };
        var role = {
            currentRole : cRole
        }

        deferredGetRole.resolve({ data : cRole, status : 200 });
        // call digest cycle for this to work
        scope.$digest();

        expect(userService.getCurrentRole).toHaveBeenCalledWith(mission.missionName);
        expect(controller.cRole).toEqual(cRole);
        expect(controller.role).toEqual(role);       
    });

    it('should call the user service to get the current role of the user(status other than 200)', function() {
        deferredGetRole.resolve({ data : {}, status : 404 });
        // call digest cycle for this to work
        scope.$digest();

        expect(userService.getCurrentRole).toHaveBeenCalledWith(mission.missionName);
        expect(controller.cRole).toEqual({});
        expect(controller.role).not.toBeDefined();       
    });

    it('should call the user service to get the allowed roles of the user', function() {
        var roles = [{ 
            name : 'Mission Director', 
            callsign : 'MD'
        },{
            name : 'Observer', 
            callsign : 'VIP'
        }];

        deferredAllowed.resolve({ data : roles, status : 200 });
        // call digest cycle for this to work
        scope.$digest();

        expect(userService.getAllowedRoles).toHaveBeenCalledWith(mission.missionName);
        expect(controller.roles).toEqual(roles);       
    });

    it('should call the user service to get the allowed roles of the user(status other than 200)', function() {
        deferredGetRole.resolve({ data : [], status : 404 });
        // call digest cycle for this to work
        scope.$digest();

        expect(userService.getAllowedRoles).toHaveBeenCalledWith(mission.missionName);
        expect(controller.roles).not.toBeDefined();       
    });

    it('should define the function close', function() {
        expect(controller.close).toBeDefined();
    });

    it('should call the modalInstance dismiss on close function call', function() {
        spyOn(modalInstance, 'dismiss');

        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should define the function updateRole', function() {
        expect(controller.updateRole).toBeDefined();
    });

    it('should not update the role if you are a Mission Director', function() {
        controller.cRole = { 
            name : 'Mission Director', 
            callsign : 'MD'
        };
        controller.role = {
            currentRole : { 
                name : 'Observer', 
                callsign : 'VIP'
            }
        }
        var usermessage = 'No mission without the Mission Director. Your role cannot be updated';
        spyOn(windowMock, 'alert');
        spyOn(modalInstance, 'close');

        controller.updateRole();
        expect(modalInstance.close).toHaveBeenCalled();
        expect(dashboardService.displayAlert).toHaveBeenCalledWith(usermessage,"bottom right",'#adminroletoaster',false);

    });

    it('should update the role of the user when update role is called', function() {
        controller.cRole = { 
            name : 'Proxy Director', 
            callsign : 'PRX'
        };
        controller.role = {
            currentRole : { 
                name : 'Observer', 
                callsign : 'VIP'
            }
        };

        spyOn(windowMock, 'alert');
        spyOn(modalInstance, 'close');
        var usermessage = "User's current role updated!";
        deferredSetRole.resolve({ data : {}, status : 200 });
        controller.updateRole();

        // call digest cycle for this to work
        scope.$digest();

        expect(userService.setCurrentRole).toHaveBeenCalledWith(controller.role.currentRole, mission.missionName);
        expect(modalInstance.close).toHaveBeenCalled();
        expect(dashboardService.displayAlert).toHaveBeenCalledWith(usermessage,"bottom right",'#dashboardtoaster',false);
    });

    it('should not update the role of the user when update role is called(response status other than 200)', function() {
        controller.cRole = { 
            name : 'Proxy Director', 
            callsign : 'PRX'
        };
        controller.role = {
            currentRole : { 
                name : 'Observer', 
                callsign : 'VIP'
            }
        };

        spyOn(windowMock, 'alert');
        spyOn(modalInstance, 'close');

        deferredSetRole.resolve({ data : {}, status : 404 });
        controller.updateRole();

        // call digest cycle for this to work
        scope.$digest();

        expect(userService.setCurrentRole).toHaveBeenCalledWith(controller.role.currentRole, mission.missionName);
        expect(modalInstance.close).not.toHaveBeenCalled();
        expect(windowMock.alert).not.toHaveBeenCalledWith("User's current role updated");
    });
});
