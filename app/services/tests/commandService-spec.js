describe('Testing commandService', function () {
    var commandService, httpBackend;

    beforeEach(function () {
        // load the module
        module('app');

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _commandService_) {
            commandService = _commandService_;
            httpBackend = _$httpBackend_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //commandService should exist in the application
    it('commandService should exist', function() {
    	expect(commandService).toBeDefined();
    });

    it('should be able to save the command in command history', function () {
        var email = "chavi.malhotra@gmail.com";
        var command = { 
            name: "Mission Director",
            argument: "MD",
            timestamp: "010.15:44:32 UTC"
        };
        var mission ="ATest";

        httpBackend.expectPOST("/saveCommand")
            .respond(200, {});

        commandService.saveCommand(email, command, mission).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should be able to retrieve command history from database', function () {
        var mission = "ATest";
    	var commandLog;
    	var result = [{ 
    		argument: "87",
            mission: "ATest",
            name: "Null Command Echo",
            timestamp: "010.16:52:44 UTC",
            user: "chavi.malhotra@gmail.com"
    	}, { 
            argument: "00",
            mission: "ATest",
            name: "Dummy Command",
            timestamp: "010.22:52:44 UTC",
            user: "chavi.malhotra@gmail.com"
        }];
 
        httpBackend.expectGET('/getCommandList?mission=ATest').respond(200, result);
 
        commandService.getCommandList(mission).then( function(response){
        	commandLog = response.data;
        	expect(response.status).toBe(200);
        	expect(commandLog).toBeDefined();
        	expect(commandLog.length).toBeGreaterThan(0);
        	expect(commandLog.length).toEqual(2);
    	});

    	httpBackend.flush();
    });
 
});