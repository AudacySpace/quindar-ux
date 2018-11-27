app.directive('command', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/command/command.html',
	    controller: 'CommandCtrl',
  	}; 
})

app.controller('CommandCtrl', 
	function($scope, userService, commandService, dashboardService, $interval, $window){

	$scope.email = userService.getUserEmail();
	$scope.mission = dashboardService.getCurrentMission();

    $scope.isLoaded = false;
	$scope.sent = false;

	$scope.initialise = function(){
		$scope.cmd = "";
		$scope.arguments = "";
		$scope.entered =  false;
		$scope.locked = false;
		$scope.disableEnter = false;
		$scope.disableInput = false;
		$scope.disableLock = true;

        $scope.command = {
            name : "",
            arguments : "",
            sent_timestamp : "",
            time : ""
        };
	}

    $scope.enter = function(){
    	if($scope.cmd && $scope.arguments) {
			$scope.command.name = $scope.cmd;
		    $scope.command.arguments = $scope.arguments;

            commandService.saveCommand($scope.email, $scope.command, $scope.mission.missionName)
            .then(function(response) {
                if(response.status == 200){
                    $scope.entered = true;
                    $scope.disableEnter = true;
                }
            });
	    } 
    }

    $scope.lockCommand = function(){
    	if($scope.command.name && $scope.entered) {
            commandService.lockCommand($scope.mission.missionName)
            .then(function(response) {
                if(response.status == 200){
                    $scope.locked = true;
                    $scope.disableInput = true;
                    $scope.disableLock = true;
                }
            });
	    } else {
	    	$window.alert("Please enter the commands before locking");
	    }
    }

    $scope.changeInput = function(){
    	if($scope.entered) {
    		$scope.entered = false;
    		$scope.disableEnter = false;
            commandService.removeCommand($scope.mission.missionName)
            .then(function(response) {
                if(response.status == 200){
                    console.log("removed")
                }
            });
    	} else {
    		$scope.disableEnter = false;
    		$scope.disableLock = false;
    	}
    }

    $scope.sendCommand = function(){
    	var time = dashboardService.getTime('UTC');
    	var systemTime = new Date();
    	var cmdId = systemTime.getTime();
        $scope.timestamp = {
            "sent_timestamp" : cmdId,
            "time" : time.utc
        }

        commandService.sendCommand($scope.mission.missionName, $scope.timestamp)
    	.then(function(response) {
	        if(response.status == 200){
	        	$scope.initialise();
                $scope.commandForm.$setPristine();
                $scope.commandForm.$setUntouched();
	        }
	    });
    }

	$scope.updateCommandlog = function(){
        commandService.getCommandLog($scope.mission.missionName)
        .then(function(response) {
            if(response.status == 200) {
                $scope.commandLog = response.data;

                //get all the responses of a command
                //find the response with the max timestamp
                //assign the status and data to a the commandLog variable
                var commandLen = $scope.commandLog.length;

                for(var i=0;i<commandLen;i++){
                    //call function to get the max date;
                    //loop through the responses and find the response which matches that response
                    //assign to a variable used to display in the command log
                    var maxTime = getMaxTime($scope.commandLog[i].response,"gwp_timestamp");
                    var responsesLen = $scope.commandLog[i].response.length;
                    for(var j=0;j<responsesLen;j++){
                        var dateformat = moment($scope.commandLog[i].response[j].gwp_timestamp).tz('UTC');
                        if(dateformat.valueOf() === maxTime){
                            $scope.commandLog[i].responseStatus = $scope.commandLog[i].response[j].status;
                            $scope.commandLog[i].responseData = $scope.commandLog[i].response[j].metadata_data;
                        }
                    }
                }
            }
        });

        commandService.getCommand($scope.mission.missionName)
        .then(function success(response) {
            var command = response.data;
            if(command != ""){
                if(command.entered && !command.sent) {
                    $scope.cmd = command.name;
                    $scope.arguments = command.arguments;
                    $scope.command = {
                        name : command.name,
                        arguments : command.arguments,
                        sent_timestamp : "",
                        time : ""
                    };
                    $scope.entered = true;
                    $scope.disableEnter = true;
                    if(command.locked) {
                        $scope.locked = true;
                        $scope.disableInput = true;
                        $scope.disableLock = true;
                    }
                }
            } else {
                if($scope.command.name != "" && $scope.command.arguments != "" && $scope.entered){
                    $scope.initialise();
                    $scope.commandForm.$setPristine();
                    $scope.commandForm.$setUntouched();
                }
            }
        });
    }

    function getMaxTime(responses,filter){
        var timestampArray = [];
        var maxTime;
        var numOfResponses = responses.length;
        for(var j=0;j<numOfResponses;j++){
            var dateformat = moment(responses[j][filter]).tz('UTC');
            timestampArray.push(dateformat.valueOf());
        }
        maxTime = Math.max.apply(null,timestampArray);
        return maxTime;
    }

	$scope.initialise();

    $scope.interval = $interval($scope.updateCommandlog, 1000);

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);
});

