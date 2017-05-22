app.directive('clock', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clock.html',
	    controller: 'ClockCtrl',
  	}; 
})

app.controller('ClockCtrl', function($scope, dashboardService, datastatesService, $interval){
	var tempTime = "";
	$scope.statusIcons = dashboardService.icons;
	var dServiceObj = {};
	var alarm_low = dashboardService.timestamp_alow.value;
	var alarm_high = dashboardService.timestamp_ahigh.value;
	var warn_low = dashboardService.timestamp_wlow.value;
	var warn_high = dashboardService.timestamp_whigh.value;
	var timertemp = [];
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color


	$scope.$watch('statusIcons',function(newVal,oldVal){
        	dServiceObj = newVal; 
    },true);

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
		style : colorDefault
	}];

	updateClock();

	function updateClock(){

		for (var i=0; i<$scope.widget.settings.clocks.length; i++){
			if($scope.widget.settings.clocks[i].hasOwnProperty('timezone')) {
				$scope.widget.settings.clocks[i].time = dashboardService.getTime($scope.widget.settings.clocks[i].timezone);
				var valueType = typeof $scope.widget.settings.clocks[i].time;
				if(JSON.stringify(timertemp[i]) === JSON.stringify($scope.widget.settings.clocks[i].time)){
					if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
						$scope.widget.settings.clocks[i].style = colorHealthy;
					}
					else{
						$scope.widget.settings.clocks[i].style = colorStale;
					}
				}else {
					var colorvalue = datastatesService.getDataColor(alarm_low,alarm_high,$scope.widget.settings.clocks[i].time,warn_low,warn_high,valueType)
					if(colorvalue === "red"){
						$scope.widget.settings.clocks[i].style = colorAlarm;	
					}else if(colorvalue === "orange"){
						$scope.widget.settings.clocks[i].style = colorCaution;
					}else{
						$scope.widget.settings.clocks[i].style = colorHealthy;	
					}
					timertemp[i] = JSON.parse(JSON.stringify($scope.widget.settings.clocks[i].time));
				}
			} else {
				tempTime = dashboardService.countdown($scope.widget.settings.clocks[i].reference);
				if(JSON.stringify(timertemp[i]) === JSON.stringify(tempTime)){
					$scope.widget.settings.clocks[i].style = colorStale;
					$scope.widget.settings.clocks[i].time = tempTime
					$scope.widget.settings.clocks[i].delta = tempTime.sign;
					if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
						$scope.widget.settings.clocks[i].style = colorHealthy;
					}else {
						$scope.widget.settings.clocks[i].style = colorStale;
					} 

					if(dServiceObj.dIcon === "red"){
						$scope.widget.settings.clocks[i].style = colorDisconnected;
					}
				}else {
					$scope.widget.settings.clocks[i].time = tempTime
					$scope.widget.settings.clocks[i].delta = tempTime.sign; 
					if(tempTime.sign == "-"){
						if(tempTime.days == '000' && tempTime.hours == '00') {
							if(tempTime.minutes <= '59' && tempTime.minutes > '10') {
								$scope.widget.settings.clocks[i].style = colorCaution;
							}
							if(tempTime.minutes <= '10') {
								$scope.widget.settings.clocks[i].style = colorAlarm;
							}
						}
					} else {
						$scope.widget.settings.clocks[i].style = colorHealthy;
					}
					timertemp[i] = JSON.parse(JSON.stringify(tempTime));
				}
			}

			if(dServiceObj.dIcon === "red"){
				$scope.widget.settings.clocks[i].style = colorDisconnected;
			}			
		}
	}

	$scope.interval = $interval(updateClock, 500);

	$scope.remove = function(clock) {
		$scope.widget.settings.clocks.splice($scope.widget.settings.clocks.indexOf(clock), 1);
	}

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);

})