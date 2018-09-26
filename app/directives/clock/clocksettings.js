app.directive('clocksettings', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clocksettings.html',
	    controller: 'ClockSettingsCtrl',
  	}; 
});

app.controller('ClockSettingsCtrl',['$scope', function($scope){

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
		$scope.selected = {};
		$scope.reference = "";
		$scope.name = "";
	}

	$scope.saveSettings = function(widget){
		if( $scope.selected.type ){
			if($scope.selected.type.value == 'Clock') {
				if ($scope.selected.timezone) {
					widget.settings.clocks.push({
						name : $scope.selected.timezone.value,
						timezone : $scope.selected.timezone.zone,
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
						reference : $scope.reference,
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
		'zone': 'UTC'
	}, 
	{
		'key': 2,
		'value': 'San Francisco',
		'zone': 'America/Los_Angeles'
	}, 
	{
		'key': 3,
		'value': 'Singapore',
		'zone': 'Asia/Singapore'
	}, 
	{
		'key': 4,
		'value': 'Luxembourg',
		'zone': 'Europe/Luxembourg'
	}];

}]);