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
		$scope.selected = {};
		$scope.argument = "";
		$scope.entered =  false;
		$scope.locked = false;
		$scope.disableEnter = false;
		$scope.disableInput = false;
		$scope.disableLock = true;

		$scope.command = {
			name : "",
			argument : "",
			timestamp : "",
			time : ""
		}
	}

    $scope.commandList = [{
    	'key': 0,
    	'value': 'Null Command Echo'
    }, {
    	'key': 1,
    	'value': 'Dummy Command'
    }]

    $scope.enter = function(){
    	if($scope.selected.command) {
			$scope.command.name = $scope.selected.command;
		    $scope.command.argument = $scope.argument;
		   	$scope.entered = true;
		   	$scope.disableEnter = true;
	    } else {
	    	$window.alert("Please select the command from select dropdown");
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
    	$scope.command.timestamp = time.today;
    	$scope.command.time = time.utc;
    	//$scope.sent = true;

    	commandService.saveCommand($scope.email, $scope.command, $scope.mission.missionName)
    	.then(function(response) {
	        if(response.status == 200){
	        	$scope.initialise();
	        }
	    });
    }

	$scope.updateCommandlog = function(){
		commandService.getCommandList($scope.mission.missionName)
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

