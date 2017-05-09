app.directive('clock', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clock.html',
	    controller: 'ClockCtrl',
  	}; 
})

app.controller('ClockCtrl', function($scope, dashboardService, $interval){
	var tempTime = "";

	$scope.widget.settings.clocks = [{
		name : 'UTC',
		delta : '',
		time : {
			days : '000',
			minutes : '00',
			hours : '00',
			seconds : '00'
		},
		timezone : 0,
		style : {
			color : 'black'
		}
	}];

	updateClock();

	function updateClock(){
		if($scope.widget.settings.clocks.length > 0) {
			for (var i=0; i<$scope.widget.settings.clocks.length; i++){
				if($scope.widget.settings.clocks[i].hasOwnProperty('timezone')) {
					$scope.widget.settings.clocks[i].time = dashboardService.getTime($scope.widget.settings.clocks[i].timezone);
				} else {
					tempTime = dashboardService.countdown($scope.widget.settings.clocks[i].reference);
					$scope.widget.settings.clocks[i].time = tempTime
					$scope.widget.settings.clocks[i].delta = tempTime.sign; 
					if(tempTime.sign == "-"){
						if(tempTime.days == '000' && tempTime.hours == '00') {
							if(tempTime.minutes <= '59' && tempTime.minutes > '10') {
								$scope.widget.settings.clocks[i].style = { color : '#FFC400' };
							}
							if(tempTime.minutes <= '10') {
								$scope.widget.settings.clocks[i].style = { color : '#FF0000' };
							}
						}
					} else {
						$scope.widget.settings.clocks[i].style = { color : 'black' };
					}
				}
			}
		} else {
			$interval.cancel($scope.interval);
		}	
	}

	$scope.interval = $interval(updateClock, 1000);

})