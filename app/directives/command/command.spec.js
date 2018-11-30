describe('Testing command controller', function () {
    var controller, dashboardService, scope, commandService, userService, 
    $intervalSpy, deferredSave, deferredCommandLog, deferredCommandList,
    deferredSend, deferredLock, deferredCommand;

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

    beforeEach(function () {
        // load the module
        module('app');

        inject(function($controller, $rootScope, $interval, _$q_, _commandService_){
            commandService = _commandService_;
            $intervalSpy = jasmine.createSpy('$interval', $interval);

            dashboardService = jasmine.createSpyObj('dashboardService', 
                ['getTime', 'getCurrentMission']);
            userService = jasmine.createSpyObj('userService', ['getUserEmail']);

            deferredSave = _$q_.defer();
            deferredCommandLog = _$q_.defer();
            deferredCommandList = _$q_.defer();
            deferredSend = _$q_.defer();
            deferredLock = _$q_.defer();
            deferredCommand = _$q_.defer();
            spyOn(commandService, "saveCommand").and.returnValue(deferredSave.promise);
            spyOn(commandService, "getCommandLog").and.returnValue(deferredCommandLog.promise);
            spyOn(commandService, "getCommandList").and.returnValue(deferredCommandList.promise);
            spyOn(commandService, "sendCommand").and.returnValue(deferredSend.promise);
            spyOn(commandService, "lockCommand").and.returnValue(deferredLock.promise);
            spyOn(commandService, "getCommand").and.returnValue(deferredCommand.promise);

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
        expect(scope.lockModel).toEqual("LOCK");
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

        deferredSave.resolve({ data : {}, status : 200 });
        scope.enter();
        // call digest cycle for this to work
        scope.$digest();

        expect(scope.command.name).toEqual('GET');
        expect(scope.command.arguments).toEqual('00');
        expect(scope.entered).toEqual(true);
        expect(scope.disableEnter).toEqual(true);
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

        deferredLock.resolve({ data : {}, status : 200 });

        scope.lockCommand();
        // call digest cycle for this to work
        scope.$digest();

        expect(scope.locked).toEqual(true);
        expect(scope.disableLock).toEqual(true);
        expect(scope.disableInput).toEqual(true);
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
            arguments: "00",
            sent_timestamp: 1533066264232,
            time: time.utc
        };
        dashboardService.getTime.and.callFake(function() {
            return time;
        });
      

        scope.sendCommand();
        expect(scope.command.time).toEqual(time.utc);
        expect(scope.command.name).toEqual("Null Command Echo");
        expect(scope.command.arguments).toEqual("00");
    })

    it('should call sendCommand route and reset all values when scope.sendCommand is called', function() {
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
            arguments: "00",
            sent_timestamp: 1533066264232,
            time: '070.10:10:50 UTC'
        };

        scope.commandForm = {
            $setPristine: function(){

            },
            $setUntouched: function(){
                
            }
        };

        dashboardService.getTime.and.callFake(function() {
            return time;
        });

        deferredSend.resolve({ data : {}, status : 200 });
        scope.sendCommand();
        // call digest cycle for this to work
        scope.$digest();

        expect(commandService.sendCommand).toHaveBeenCalled();

        //expect values to reset
        expect(scope.command).toEqual({ name: '', arguments: '', sent_timestamp: '', time: ''});
        expect(scope.entered).toEqual(false);
        expect(scope.locked).toEqual(false);
        expect(scope.disableEnter).toEqual(false);
        expect(scope.disableInput).toEqual(false);
        expect(scope.disableLock).toEqual(true);
    });

    it('should not reset variables when sendCommand status is other than 200', function() {
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
            arguments: "00",
            sent_timestamp: 1533066264232,
            time: '070.10:10:50 UTC'
        };

        dashboardService.getTime.and.callFake(function() {
            return time;
        });

        deferredSend.resolve({ data : {}, status : 404 });
        scope.sendCommand();
        // call digest cycle for this to work
        scope.$digest();

        expect(commandService.sendCommand).toHaveBeenCalled();

        //expect values not to reset
        expect(scope.command.name).toEqual("Null Command Echo");
        expect(scope.command.arguments).toEqual("00");
        expect(scope.command.time).toEqual("070.10:10:50 UTC");
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
            time: "010.16:52:44 UTC",
            sent_timestamp:1533066264168,
            user: "john.smith@gmail.com",
            sent_to_satellite:true,
            response: [
                {
                    "status": "Parameter access sent",
                    "data": "",
                    "gwp_timestamp": 1533066264169,
                    "metadata_data":""
                },
                {
                    "status": "GET Parameter accessed successfully",
                    "metadata_data": "",
                    "gwp_timestamp": 1533066264231,
                    "data":""
                },
                {
                    "status": "success",
                    "metadata_data": 32,
                    "gwp_timestamp": 1533066264232,
                    "data":""
                }
            ]
        }, { 
            arguments: "00",
            mission: "ATest",
            name: "Dummy Command",
            time: "010.22:52:44 UTC",
            sent_timestamp:1533066264159,
            user: "john.smith@gmail.com",
            sent_to_satellite:true,
            response: [
                {
                    "status": "Parameter access sent",
                    "data": "",
                    "gwp_timestamp": 1533066264160,
                    "metadata_data":""
                },
                {
                    "status": "GET Parameter accessed successfully",
                    "data": "",
                    "gwp_timestamp": 1533066264230,
                    "metadata_data":""
                },
                {
                    "status": "success received",
                    "data": "",
                    "gwp_timestamp": 1533066264232,
                    "metadata_data":32
                }
            ]
        }];

        deferredCommandLog.resolve({ data : result, status: 200 });
        deferredCommand.resolve({ data : {}, status: 200 });

        scope.updateCommandlog();
        // call digest cycle for this to work
        scope.$digest();

        expect(commandService.getCommandLog).toHaveBeenCalledWith(scope.mission.missionName);
        expect(scope.commandLog).toEqual(result);
        expect(scope.commandLog[0].responseStatus).toEqual("success");
        expect(scope.commandLog[0].responseData).toEqual(32);
        expect(scope.commandLog[1].responseStatus).toEqual("success received");
        expect(scope.commandLog[1].responseData).toEqual(32);
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
