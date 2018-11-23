describe('Testing adminModal controller', function () {
    var controller, scope, userService, deferredRole, deferredUser, deferredSet;
    var windowMock = {
        alert: function(message) {
            
        }
    };
    var modalInstance = { dismiss: function() {} };
    var mission = { missionName : 'ATest', missionImage : '/media/icons/Audacy_Icon_White.svg'};

    beforeEach(function () {
        // load the module
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
        });

        inject( function($controller, $rootScope, _$q_){
            deferredUser = _$q_.defer();
            deferredRole = _$q_.defer();
            deferredSet = _$q_.defer();
            scope = $rootScope.$new();
            userService = jasmine.createSpyObj('userService', ['getRoles', 'getUsers', 'setAllowedRoles', 'getUserEmail']);

            userService.getRoles.and.callFake(function() {
                return deferredRole.promise;
            });

            userService.getUsers.and.callFake(function() {
                return deferredUser.promise;
            });

            userService.setAllowedRoles.and.callFake(function() {
                return deferredSet.promise;
            });

            controller = $controller('adminCtrl', {
                $uibModalInstance: modalInstance,
                userService: userService,
                $scope: scope,
                mission: mission
            });
            
        });
    });

    it('should define admin modal controller', function() {
    	expect(controller).toBeDefined();
    });

    it('should define the users and roles variable in controller scope', function() {
        expect(controller.users).toBeDefined();
        expect(controller.users).toEqual([]);
        expect(controller.roles).toBeDefined();
        expect(controller.roles).toEqual([]);
    });

    it('should define the mission variable in controller scope', function() {
        expect(controller.mission).toBeDefined();
        expect(controller.mission).toEqual(mission.missionName);
    });

    it('should get roles from the database and initialise roles variable(status 200)', function() {
        controller.selected = {
            user : {}
        };
        var response = {
            roles : {
                'VIP' : {
                    name : 'Observer',
                    callsign : 'VIP',
                    multiple : true,
                    checked : false
                },
                'MD' : {
                    name : 'Mission Director',
                    callsign : 'MD',
                    multiple : false,
                    checked : false
                },
                'GCC' : {
                    name : 'Ground Communications Controller',
                    callsign : 'GCC',
                    multiple : true,
                    checked : false
                }
            }
        }

        var roles = [{
            name : 'Observer',
            callsign : 'VIP',
            multiple : true,
            checked : false
        },{
            name : 'Mission Director',
            callsign : 'MD',
            multiple : false,
            checked : false
        },{
            name : 'Ground Communications Controller',
            callsign : 'GCC',
            multiple : true,
            checked : false
        }];

        deferredRole.resolve({ data : response, status : 200 });
        scope.$digest();

        expect(controller.roles).toEqual(roles);
        expect(userService.getRoles).toHaveBeenCalled();
    });

    it('should not initialise roles variable(status other than 200)', function() {
        controller.selected = {
            user : {}
        };

        deferredRole.resolve({ data : {}, status : 404 });
        scope.$digest();

        expect(controller.roles).toEqual([]);
    });

    it('should get users from the database and initialise users variable(status 200)', function() {
        controller.selected = {
            user : {}
        };
        var response = [{
            'google' : {},
            'currentRole' : {
                name : 'Mission Director',
                callsign : 'MD'
            },
            'allowedRoles' : {
                VIP : 1,
                MD : 1
            }
        }, {
            'google' : {},
            'currentRole' : {
                name : 'Observer',
                callsign : 'VIP'
            },
            'allowedRoles' : {
                VIP : 1,
                GCC : 1
            }
        }, {
            'google' : {},
            'currentRole' : {
                name : 'Ground Communications Controller',
                callsign : 'GCC'
            },
            'allowedRoles' : {
                VIP : 1,
                GCC : 1
            }
        }]

        var users = [{
            'google' : {},
            'currentRole' : {
                name : 'Mission Director',
                callsign : 'MD'
            },
            'allowedRoles' : {
                VIP : 1,
                MD : 1
            }
        }, {
            'google' : {},
            'currentRole' : {
                name : 'Observer',
                callsign : 'VIP'
            },
            'allowedRoles' : {
                VIP : 1,
                GCC : 1
            }
        }, {
            'google' : {},
            'currentRole' : {
                name : 'Ground Communications Controller',
                callsign : 'GCC'
            },
            'allowedRoles' : {
                VIP : 1,
                GCC : 1
            }
        }];

        deferredUser.resolve({ data : response, status : 200 });
        scope.$digest();

        expect(controller.users).toEqual(users);
        expect(userService.getUsers).toHaveBeenCalledWith(controller.mission);
    });

    it('should not initialise users variable(status other than 200)', function() {
        controller.selected = {
            user : {}
        };

        deferredUser.resolve({ data : {}, status : 404 });
        scope.$digest();

        expect(controller.users).toEqual([]);
    });

    it('should define the function close', function() {
        expect(controller.close).toBeDefined();
    });

    it('should call the modalInstance dismiss on close function call', function() {
        spyOn(modalInstance, 'dismiss');

        controller.close();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should define the function save', function() {
        expect(controller.save).toBeDefined();
    });

    it('should alert the administrator if no user is selected from dropdown, on call of save function', function() {
        spyOn(windowMock, 'alert');
        controller.selected = undefined;

        controller.save();
        expect(windowMock.alert).toHaveBeenCalledWith('Please select the user from dropdown menu');
    });

    it('should alert the administrator if no role is checked for the user, on call of save function', function() {
        spyOn(windowMock, 'alert');
        controller.selected = {
            user : {
                'google' : {},
                'currentRole' : {
                    name : 'Ground Communications Controller',
                    callsign : 'GCC'
                },
                'allowedRoles' : {
                    VIP : 1,
                    GCC : 1
                }
            }
        };
        controller.roles = [{
            name : 'Observer',
            callsign : 'VIP',
            multiple : true,
            checked : false
        },{
            name : 'Ground Communications Controller',
            callsign : 'GCC',
            multiple : true,
            checked : false
        }];

        controller.save();
        expect(windowMock.alert).toHaveBeenCalledWith('Please choose at least one role');
    });

    it('should call service to update user allowed roles and alert administrator, on call of save function', function() {
       // spyOn(windowMock, 'alert');
        controller.selected = {
            user : {
                'google' : {
                    name : 'John Smith',
                    email : 'john.smith@gmail.com'
                },
                'currentRole' : {
                    name : 'Ground Communications Controller',
                    callsign : 'GCC'
                },
                'allowedRoles' : {
                    VIP : 1,
                    GCC : 1
                }
            }
        };

        controller.roles = [{
            name : 'Observer',
            callsign : 'VIP',
            multiple : true,
            checked : false
        },{
            name : 'Ground Communications Controller',
            callsign : 'GCC',
            multiple : true,
            checked : true
        },{
            name : 'Navigation and Control Specialist',
            callsign : 'NAV',
            multiple : true,
            checked : true
        }];

        var user = controller.selected.user;
        var roles = [{
            name : 'Ground Communications Controller',
            callsign : 'GCC'
        },{
            name : 'Navigation and Control Specialist',
            callsign : 'NAV'
        }];

        deferredSet.resolve({ data : {}, status : 200 })
        controller.save();

        //expect(windowMock.alert).not.toHaveBeenCalledWith('Allowed roles updated for John Smith')

        //call digest cycle for resolve to work
        scope.$digest();
        expect(controller.selected.user.allowedRoles).toEqual({GCC : 1, NAV : 1});
        expect(userService.setAllowedRoles).toHaveBeenCalledWith(user, roles, controller.mission);
        //expect(windowMock.alert).toHaveBeenCalledWith('Allowed roles updated for John Smith');
    });

    it('should not be able to save allowed roles for user (status other than 200), on call of save function', function() {
        spyOn(windowMock, 'alert');
        controller.selected = {
            user : {
                'google' : {
                    name : 'John Smith'
                },
                'currentRole' : {
                    name : 'Ground Communications Controller',
                    callsign : 'GCC'
                },
                'allowedRoles' : {
                    VIP : 1,
                    GCC : 1
                }
            }
        };
        controller.roles = [{
            name : 'Observer',
            callsign : 'VIP',
            multiple : true,
            checked : false
        },{
            name : 'Ground Communications Controller',
            callsign : 'GCC',
            multiple : true,
            checked : true
        },{
            name : 'Navigation and Control Specialist',
            callsign : 'NAV',
            multiple : true,
            checked : true
        }];

        deferredSet.resolve({ data : {}, status : 404 })
        controller.save();

        //call digest cycle for resolve to work
        scope.$digest();
        expect(windowMock.alert).not.toHaveBeenCalledWith('Allowed roles updated for John Smith')
    });

    it('should watch for selected user and check the roles listed as allowed roles for user', function() {
        controller.selected = {
            user : {
                'google' : {
                    name : 'John Smith'
                },
                'currentRole' : {
                    name : 'Ground Communications Controller',
                    callsign : 'GCC'
                },
                'allowedRoles' : {
                    VIP : 1,
                    GCC : 1
                }
            }
        };
        controller.roles = [{
            name : 'Observer',
            callsign : 'VIP',
            multiple : true,
            checked : false
        },{
            name : 'Ground Communications Controller',
            callsign : 'GCC',
            multiple : true,
            checked : false
        },{
            name : 'Navigation and Control Specialist',
            callsign : 'NAV',
            multiple : true,
            checked : false
        }];

        var roles = [{
            name : 'Observer',
            callsign : 'VIP',
            multiple : true,
            checked : true
        },{
            name : 'Ground Communications Controller',
            callsign : 'GCC',
            multiple : true,
            checked : true
        },{
            name : 'Navigation and Control Specialist',
            callsign : 'NAV',
            multiple : true,
            checked : false
        }];

        scope.$digest();

        expect(controller.roles).toEqual(roles);
    });
});
