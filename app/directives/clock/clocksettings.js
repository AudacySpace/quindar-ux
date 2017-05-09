app.directive('clocksettings', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clocksettings.html',
	    controller: 'ClockSettingsCtrl',
  	}; 
})

app.controller('ClockSettingsCtrl', function($scope){
	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
		//$scope.selected = {};
	}

	$scope.saveSettings = function(widget){
		if( $scope.selected.type ){
			if($scope.selected.type.value == 'Clock') {
				if ($scope.selected.timezone) {
					widget.settings.clocks.push({
						name : $scope.selected.timezone.value,
						delta : '',
						time : {
							timestamp: {
								days : '00',
								minutes : '00',
								hours : '00',
								seconds : '00'
							}
						},
						timezone : $scope.selected.timezone.zone,
						style : {
							color : 'black'
						}
					});
					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete = false;
					$scope.selected = {};
				} 
			} else if ($scope.selected.type.value == 'Timer') {
				if ($scope.reference && $scope.name ) {
					widget.settings.clocks.push({
						name : $scope.name,
						delta : '',
						time : {
							timestamp: {
								days : '00',
								minutes : '00',
								hours : '00',
								seconds : '00'
							}
						},
						reference : $scope.reference,
						style : {
							color : 'black'
						}
					});
					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete = false;
					$scope.selected = {};
					$scope.name = "";
					$scope.reference = "";
				}
			} 
		} 
	}

	$scope.selected = {};
	$scope.isLoaded = false;

	$scope.types = [
	{
        'key': 1,
        'value': 'Clock'
    }, 
	{
		'key': 2,
		'value': 'Timer'
	}];

	$scope.timezones = [
	{
        'key': 1,
		'value': 'UTC',
		'zone': 0
	}, 
	{
		'key': 2,
		'value': 'San Francisco',
		'zone': -8
	}, 
	{
		'key': 3,
		'value': 'Singapore',
		'zone': 8
	}, 
	{
		'key': 4,
		'value': 'Luxembourg',
		'zone': 2
	}];

})