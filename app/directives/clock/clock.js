app.directive('clock', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clock.html',
	    controller: 'ClockCtrl',
  	}; 
})

app.controller('ClockCtrl', function($scope, dashboardService){

	var clock = dashboardService.time;

	$scope.clocks = [{
		name : 'UTC',
		delta : '',
		time : clock
	}]

})