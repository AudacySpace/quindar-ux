app.directive('datalog',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datalog/datalog.html',
    controller: 'DataLogCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataLogCtrl',function ($scope,$window,$element,$interval,dashboardService,datastatesService){  
    var telemetry = dashboardService.telemetry;
    var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var tempValues = [];

    $scope.widget.settings.logData =  [];

    $scope.$watch('widget.settings.data',function(newVal,oldVal){
    	if(newVal){
    		if( newVal.value !== '' && newVal.vehicle !== ''){
    			if(	$scope.widget.settings.logData.length>0){
    				while($scope.widget.settings.logData.length > 0){
    					$scope.widget.settings.logData.pop();
    				}
				}else {
    				updateLog();
    				$scope.interval = $interval(updateLog,1000);
    			}
			}
		}
    },true);

    //Function to update the log and set data state colors
	function updateLog(){
    	if($scope.widget.settings.logData.length > 999){
    		while($scope.widget.settings.logData.length > 0){
    			$scope.widget.settings.logData.pop();
    		}
    	}

    	if(tempValues[tempValues.length-1] === telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value){
    		$scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:Math.round(telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value * 10000)/10000,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorStale});
    	}else {
    		var valType = typeof telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value;
    		var colorVal = datastatesService.getDataColor(telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].alarm_low,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].alarm_high,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].warn_low,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].warn_high,valType); 

    		if(colorVal === "red"){
    			$scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:Math.round(telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value * 10000)/10000,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorAlarm});
    		}else if(colorVal === "orange"){
    			$scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:Math.round(telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value * 10000)/10000,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorCaution});
    		}else {
    			$scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:Math.round(telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value * 10000)/10000,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorHealthy});
    		}
    		tempValues.push(telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value);
    	}
	}

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);  
});


