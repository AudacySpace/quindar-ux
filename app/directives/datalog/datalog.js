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
    var dServiceObjVal = {};
    $scope.dataStatus = dashboardService.icons;

    $scope.widget.settings.logData =  [];
    var prevLogObj = {id:'',vehicle:''};

    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);

    $scope.interval = $interval(updateLog, 1000, 0, false);   

    /*Function to update the log and set data state colors*/
	function updateLog(){
           if( $scope.widget.settings.data.value !== '' && $scope.widget.settings.data.vehicle !== ''){ 
                if( prevLogObj.id === $scope.widget.settings.data.value && prevLogObj.vehicle === $scope.widget.settings.data.vehicle ){
                    updateLogTable();     
                }else {
                    while($scope.widget.settings.logData.length > 0){
                        $scope.widget.settings.logData.pop();
                    }
                    updateLogTable(); 
                }

                if(dServiceObjVal.dIcon === "red"){
                    for(var i=0;i<=$scope.widget.settings.logData.length-1;i++){
                        $scope.widget.settings.logData[i].style = colorDisconnected;  
                    }
                }
                prevLogObj.id = $scope.widget.settings.data.value;
                prevLogObj.vehicle = $scope.widget.settings.data.vehicle;
            }
	}

    function updateLogTable(){
        if($scope.widget.settings.logData.length > 999){
            while($scope.widget.settings.logData.length > 0){
                $scope.widget.settings.logData.pop();
            }
        }
        var valType = typeof telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value;
        if(tempValues[tempValues.length-1] === telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value){

            if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green"){
                if(valType === "number"){
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value.toFixed(4),timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorHealthy});  
                }else {
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorHealthy});  
                }
            } else {
                if(valType === "number"){
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value.toFixed(4),timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorStale});  
                }else {
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorStale});
                } 
            }
        }else {
            var colorVal = datastatesService.getDataColor(telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].alarm_low,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].alarm_high,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].warn_low,telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].warn_high,valType); 

            if(valType === "number"){
                if(colorVal === "red"){
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value.toFixed(4),timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorAlarm});
                }else if(colorVal === "orange"){
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value.toFixed(4),timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorCaution});
                }else {
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value.toFixed(4),timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorHealthy});
                }
            }else {
                if(colorVal === "red"){
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorAlarm});
                }else if(colorVal === "orange"){
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorCaution});
                }else {
                    $scope.widget.settings.logData.push({name:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].name,value:telemetry[$scope.widget.settings.data.vehicle][$scope.widget.settings.data.value].value,timestamp:telemetry[$scope.widget.settings.data.vehicle]['timestamp'].value,style:colorHealthy});
                } 
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


