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
		   	$scope.entered = true;
		   	$scope.disableEnter = true;
	    } else if($scope.cmd.length === 0 && $scope.arguments.length > 0) {
	    	$window.alert("Please enter the command.");
	    } else if($scope.cmd.length > 0 && $scope.arguments.length === 0){
	    	$window.alert("Please enter the argument values.");
	    } else if($scope.cmd.length === 0 && $scope.arguments.length === 0){
	    	$window.alert("Please enter the command and argument values.");
	    }
    }

    $scope.lockCommand = function(){
    	if($scope.command.name && $scope.entered) {
	    	$scope.locked = true;
	    	$scope.disableInput = true;
	    	$scope.disableLock = true;
	    } else {
	    	$window.alert("Please enter the commands before locking");
	    }
    }

    $scope.changeInput = function(){
    	if($scope.entered) {
    		$scope.entered = false;
    		$scope.disableEnter = false;
    	} else {
    		$scope.disableEnter = false;
    		$scope.disableLock = false;
    	}
    }

    $scope.sendCommand = function(){   	
    	var time = dashboardService.getTime(0);
    	$scope.command.sent_timestamp = time.today;
    	$scope.command.time = time.utc;
    	// $scope.command.sent_timestamp = new Date();
    	// $scope.command.time = time.utc;

    	commandService.saveCommand($scope.email, $scope.command, $scope.mission.missionName)
    	.then(function(response) {
	        if(response.status == 200){
	        	$scope.initialise();
	        }
	    });
    }

	$scope.updateCommandlog = function(){
		commandService.getCommandLog($scope.mission.missionName)
		.then(function(response) {
	        if(response.status == 200) {
	            $scope.commandLog = response.data;
	        }
	    });
	}

	$scope.initialise();

    $scope.interval = $interval($scope.updateCommandlog, 1000);

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);
});

