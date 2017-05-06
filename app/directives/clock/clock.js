app.directive('clock', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clock.html',
	    controller: 'ClockCtrl',
  	}; 
})

app.controller('ClockCtrl', function($scope, dashboardService, $interval){

	$scope.widget.settings.clocks = [{
		name : 'UTC',
		delta : '',
		time : {
			timestamp: {
				days : '000',
				minutes : '00',
				hours : '00',
				seconds : '00'
			}
		},
		timezone : 0
	}];

	updateClock();

	function updateClock(){
		if($scope.widget.settings.clocks.length > 0) {
			for (var i=0; i<$scope.widget.settings.clocks.length; i++){
				$scope.widget.settings.clocks[i].time.timestamp = dashboardService.getTime($scope.widget.settings.clocks[i].timezone);
			}
		} else {
			$interval.cancel($scope.interval);
		}
	}

	$scope.interval = $interval(updateClock, 1000)

})