app.directive('clock', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clock.html',
	    controller: 'ClockCtrl',
  	}; 
})

app.controller('ClockCtrl', function($scope, dashboardService, datastatesService, $interval){
	var tempTime = "";
	var dServiceObj = {};
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color

	$scope.statusIcons = dashboardService.icons;
	
	$scope.$watch('statusIcons',function(newVal,oldVal){
		dServiceObj = newVal; 
    },true);

    $scope.checkForClockData = function(){
    	if(!$scope.widget.settings.clocks){
			$scope.widget.settings.clocks = [{
				name : 'UTC',
				timezone : 0,
			}];
		}

		// initialize clocks
		$scope.clocks = new Array();
		for (var i=0; i<$scope.widget.settings.clocks.length; i++) { 
			$scope.clocks[i] = {
				name : $scope.widget.settings.clocks[i].name,
				delta : '',
				time : {
					days : '000',
					minutes : '00',
					hours : '00',
					seconds : '00'
				},
				style : colorDefault
			}
		}
	}

	$scope.checkForClockData();

	$scope.updateClock = function(){
		for (var i=0; i<$scope.widget.settings.clocks.length; i++){
			
			if(typeof $scope.clocks[i] !== "object"){
				$scope.clocks[i] = new Object();
			}

			//Block to get time for Clock as per timezone
			if($scope.widget.settings.clocks[i].hasOwnProperty('timezone')) {
				$scope.clocks[i].name = $scope.widget.settings.clocks[i].name;
				$scope.clocks[i].time = dashboardService.getTime($scope.widget.settings.clocks[i].timezone);
				$scope.clocks[i].delta = "";

				// healthy if all the status icons are green, else stale 
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
					$scope.clocks[i].style = colorHealthy;
				} 
				else{
					$scope.clocks[i].style = colorStale;
				}

			} else { //Block for timer
				tempTime = dashboardService.countdown($scope.widget.settings.clocks[i].reference);
				$scope.clocks[i].name = $scope.widget.settings.clocks[i].name;
				$scope.clocks[i].time = dashboardService.countdown($scope.widget.settings.clocks[i].reference);
				$scope.clocks[i].delta = tempTime.sign;

				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
					if(tempTime.sign == "-"){
						if(tempTime.days == '000' && tempTime.hours == '00') {
							if(tempTime.minutes <= '59' && tempTime.minutes > '10') {
								//timer color when it is between 10 and 59 minutes
								$scope.clocks[i].style = colorCaution; 
							}
							if(tempTime.minutes <= '10') {
								//timer color when it is below 10 minutes
								$scope.clocks[i].style = colorAlarm;
							}
						} else {
							$scope.clocks[i].style = colorHealthy;
						}
					} else {
						$scope.clocks[i].style = colorHealthy;
					}
				}else {
					$scope.clocks[i].style = colorStale;
				}

			}

			//show disconnected when database connection fails
			if(dServiceObj.dIcon === "red"){
				$scope.clocks[i].style = colorDisconnected;
			}			
		}
	}

	$scope.interval = $interval($scope.updateClock, 500);

	$scope.remove = function($index) {
		$scope.widget.settings.clocks.splice($index, 1);
		$scope.clocks.splice($index, 1);
	}

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);

})