describe('Testing command controller', function () {
    var controller, dashboardService, scope, commandService, userService, 
    $intervalSpy, deferredSave, deferredCommandLog, deferredCommandList;

    var mission = {
        missionName : 'ATest',
    };
    var email = "john.smith@gmail.com";
    var list = [{
        "value": "Null Command Echo",
        "types": [
            {
                "value": "Get"
            },
            {
                "value": "Set"
            },
            {
                "value": "Invoke"
            }]
        },{
        "value": "Pointing",
        "types": [
            {
                "value": "Get"
            },
            {
                "value": "Set"
            }]
        }];
    var windowMock = {
        alert: function(message) {
            
        }
    };

    beforeEach(function () {
        // load the module
        module('app', function ($provide) {
            $provide.value('$window', windowMock);
        });

        inject(function($controller, $rootScope, $interval, _$q_, _commandService_){
            commandService = _commandService_;
            $intervalSpy = jasmine.createSpy('$interval', $interval);

            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getTime', 'getCurrentMission']);
            userService = jasmine.createSpyObj('userService', ['getUserEmail']);

            deferredSave = _$q_.defer();
            deferredCommandLog = _$q_.defer();
            deferredCommandList = _$q_.defer();
            spyOn(commandService, "saveCommand").and.returnValue(deferredSave.promise);
            spyOn(commandService, "getCommandLog").and.returnValue(deferredCommandLog.promise);
            spyOn(commandService, "getCommandList").and.returnValue(deferredCommandList.promise);

            scope = $rootScope.$new();
            scope.widget = {
                name: "Command",
                settings: {
                    active: false,
                    commandlog: true
                }
            };

            dashboardService.getCurrentMission.and.callFake(function() {
                return mission;
            });
            userService.getUserEmail.and.callFake(function() {
                return email;
            });
            deferredCommandList.resolve({ data : list, status: 200 });

            controller = $controller('CommandCtrl', {
                $scope: scope, 
                dashboardService: dashboardService,
                commandService: commandService,
                userService: userService,
                $interval: $intervalSpy
            });
        });

    });

    it('should define the command controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define function scope.initialise', function(){
        expect(scope.initialise).toBeDefined();
    })

    it('should initialise the initial variables on scope.initialise call when controller is defined', function(){
        var nullCommand = {
            name : "",
            arguments : "",
            sent_timestamp : "",
            time : "",
        }

        expect(scope.arguments).toEqual("");
        expect(scope.entered).toEqual(false);
        expect(scope.locked).toEqual(false);
        expect(scope.disableEnter).toEqual(false);
        expect(scope.disableInput).toEqual(false);
        expect(scope.disableLock).toEqual(true);
        expect(scope.command).toEqual(nullCommand);
    })

    it('should set the user email and current mission name', function(){
        expect(dashboardService.getCurrentMission).toHaveBeenCalled();
        expect(userService.getUserEmail).toHaveBeenCalled();
        expect(scope.mission).toEqual({missionName : 'ATest'});
        expect(scope.email).toEqual("john.smith@gmail.com");
    })

    it('should initialise scope.sent as false', function(){
        expect(scope.sent).toEqual(false);
    })

    it('should define function scope.enter', function(){
        expect(scope.enter).toBeDefined();
    })

    it('should update the scope.command when scope.enter is called', function(){
        scope.cmd = "GET";
        scope.arguments = "00";

        scope.enter();
        expect(scope.command.name).toEqual('GET');
        expect(scope.command.arguments).toEqual('00');
        expect(scope.entered).toEqual(true);
        expect(scope.disableEnter).toEqual(true);
    })

    it('should alert the user when command is not selected and scope.enter is called', function(){
        spyOn(windowMock, 'alert');
        scope.arguments = "00";

        scope.enter();
        expect(windowMock.alert).toHaveBeenCalledWith('Please enter the command.');
    })

    it('should define function scope.lockCommand', function(){
        expect(scope.lockCommand).toBeDefined();
    })

    it('should lock the command and disable it when scope.lockCommand is called', function(){
        scope.command = {
            name: "Null Command Echo",
            argument: "00"
        }
        scope.entered = true;

        scope.lockCommand();
        expect(scope.locked).toEqual(true);
        expect(scope.disableLock).toEqual(true);
        expect(scope.disableInput).toEqual(true);
    })

    it('should alert the user when command is not entered and scope.lockCommand is called', function(){
        spyOn(windowMock, 'alert');
        scope.command.name = "Null Command Echo";
        scope.entered = false;

        scope.lockCommand();
        expect(windowMock.alert).toHaveBeenCalledWith('Please enter the commands before locking');
    })

    it('should alert the user when scope.command is null and scope.lockCommand is called', function(){
        spyOn(windowMock, 'alert');
        scope.command = {};
        scope.entered = true;

        scope.lockCommand();
        expect(windowMock.alert).toHaveBeenCalledWith('Please enter the commands before locking');
    })

    it('should define function scope.changeInput', function(){
        expect(scope.changeInput).toBeDefined();
    })

    it('should enable enter button when enter has been clicked before and scope.changeInput is called', function(){
        scope.entered = true;

        scope.changeInput();
        expect(scope.entered).toEqual(false);
        expect(scope.disableEnter).toEqual(false);
    })

    it('should enable enter and lock buttons when enter is diabled and scope.changeInput is called', function(){
        scope.entered = false;

        scope.changeInput();
        expect(scope.disableLock).toEqual(false);
        expect(scope.disableEnter).toEqual(false);
    })

    it('should define function scope.sendCommand', function(){
        expect(scope.sendCommand).toBeDefined();
    })

    it('should update command timestamp when scope.sendCommand is called', function(){
        var time = {
            days : '070',
            minutes : '10',
            hours : '10',
            seconds : '50',
            utc : '070.10:10:50 UTC',
            today : ''
        };

        scope.command = {
            name: "Null Command Echo",
            argument: "00"
        };
        dashboardService.getTime.and.callFake(function() {
            return time;
        });
        var systemTime = new Date().getTime();

        scope.sendCommand();
        //expect(scope.sent).toEqual(true);
        expect(scope.command.time).toEqual(time.utc);
        expect(scope.command.sent_timestamp).toEqual(systemTime);
    })

    it('should call saveCommand route and reset all values when scope.sendCommand is called', function() {
        var time = {
            days : '070',
            minutes : '10',
            hours : '10',
            seconds : '50',
            utc : '070.10:10:50 UTC',
            today : ''
        };

        var systemTime = new Date().getTime();
        var command = {
            name: "Null Command Echo",
            arguments: "00",
            sent_timestamp: systemTime,
            time: '070.10:10:50 UTC'
        };

        scope.command = {
            name: "Null Command Echo",
            arguments: "00"
        };
        dashboardService.getTime.and.callFake(function() {
            return time;
        });

        deferredSave.resolve({ data : {}, status : 200 });
        scope.sendCommand();
        // call digest cycle for this to work
        scope.$digest();

        expect(commandService.saveCommand)
        .toHaveBeenCalledWith(scope.email, command, scope.mission.missionName);

        //expect values to reset
        expect(scope.command).toEqual({ name: '', arguments: '', sent_timestamp: '', time: ''});
        expect(scope.arguments).toEqual("");
        expect(scope.entered).toEqual(false);
        expect(scope.locked).toEqual(false);
        expect(scope.disableEnter).toEqual(false);
        expect(scope.disableInput).toEqual(false);
        expect(scope.disableLock).toEqual(true);
    });

    it('should not reset variables when saveCommand status is other than 200', function() {
        var time = {
            days : '070',
            minutes : '10',
            hours : '10',
            seconds : '50',
            utc : '070.10:10:50 UTC',
            today : ''
        };
        var systemTime = new Date().getTime();
        var command = {
            name: "Null Command Echo",
            arguments: "00",
            sent_timestamp: systemTime,
            time: '070.10:10:50 UTC'
        };

        scope.command = {
            name: "Null Command Echo",
            arguments: "00"
        };
        dashboardService.getTime.and.callFake(function() {
            return time;
        });

        deferredSave.resolve({ data : {}, status : 404 });
        scope.sendCommand();
        // call digest cycle for this to work
        scope.$digest();

        expect(commandService.saveCommand).toHaveBeenCalledWith(scope.email, command, scope.mission.missionName);

        //expect values not to reset
        expect(scope.command).toEqual(command);
    });

    it('should define function scope.updateCommandlog', function(){
        expect(scope.updateCommandlog).toBeDefined();
    })

    it('should get command list when scope.updateCommandlog is called', function() {
        scope.mission = {
            missionName : 'ATest',
        };

        var result = [{ 
            arguments: "87",
            mission: "ATest",
            name: "Null Command Echo",
            sent_timestamp: "010.16:52:44 UTC",
            user: "john.smith@gmail.com",
            response: [
                {
                    "status": "Parameter access sent",
                    "data": "",
                    "gwp_timestamp": 1533066264169
                },
                {
                    "status": "GET Parameter accessed successfully",
                    "data": "",
                    "gwp_timestamp": 1533066264231
                },
                {
                    "status": "success",
                    "data": 32,
                    "gwp_timestamp": 1533066264232
                }
            ]
        }, { 
            arguments: "00",
            mission: "ATest",
            name: "Dummy Command",
            sent_timestamp: "010.22:52:44 UTC",
            user: "john.smith@gmail.com",
            response: [
                {
                    "status": "Parameter access sent",
                    "data": "",
                    "gwp_timestamp": 1533066264160
                },
                {
                    "status": "GET Parameter accessed successfully",
                    "data": "",
                    "gwp_timestamp": 1533066264230
                },
                {
                    "status": "success",
                    "data": 32,
                    "gwp_timestamp": 1533066264232
                }
            ]
        }];

        deferredCommandLog.resolve({ data : result, status: 200 });
        scope.updateCommandlog();
        // call digest cycle for this to work
        scope.$digest();

        expect(commandService.getCommandLog).toHaveBeenCalledWith(scope.mission.missionName);
        expect(scope.commandLog).toEqual(result);
    });

    it('should call $interval one time', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    })

    it('should call $interval on updateClock function', function(){
        expect($intervalSpy).toHaveBeenCalledWith(scope.updateCommandlog, 1000);
    })

    it('should cancel interval when scope is destroyed', function(){
        spyOn($intervalSpy, 'cancel');
        scope.$destroy();
        expect($intervalSpy.cancel.calls.count()).toBe(1);
    })

});
