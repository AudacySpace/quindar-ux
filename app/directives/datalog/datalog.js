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
    var prevLogData = [];
    var dServiceObjVal = {};
    $scope.dataStatus = dashboardService.icons;

    $scope.logData =  [];
    var prevData = {
        key : ''
    };
    var dataColor = '';

    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);

    $scope.interval = $interval(updateLog, 1000, 0, false);   

    /*Function to update the log and set data state colors*/
	function updateLog(){
        if($scope.widget.settings.data) {
            if( $scope.widget.settings.data.id !== '' && $scope.widget.settings.data.vehicle !== ''){ 
                if( prevData.key !== $scope.widget.settings.data.key ){
                    while($scope.logData.length > 0){
                        $scope.logData.pop();
                    }               
                }

                updateLogTable();

                if(dServiceObjVal.dIcon === "red"){
                    for(var i=0;i<=$scope.logData.length-1;i++){
                        $scope.logData[i].style = colorDisconnected;  
                    }
                }

                prevData.key = $scope.widget.settings.data.key;
            }
        }
	}

    function updateLogTable(){
        if($scope.logData.length > 999){
            while($scope.logData.length > 0){
                $scope.logData.pop();
            }
        }

        var currentData = dashboardService.getData($scope.widget.settings.data.key);
        if(currentData) {
            var valType = typeof currentData.value;
            if(valType === "number"){
                currentData.value = currentData.value.toFixed(4);
            }

            if(prevLogData[prevLogData.length-1] === currentData.value){
                if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && 
                    dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green"){
                    
                    dataColor = colorHealthy; 

                } else {
                    dataColor = colorStale;
                }
            }else {
                var colorVal = datastatesService.getDataColor(currentData.alarm_low, 
                    currentData.alarm_high, currentData.value, currentData.warn_low, currentData.warn_high, valType); 

                if(colorVal === "red"){
                    dataColor = colorAlarm;
                }else if(colorVal === "orange"){
                    dataColor = colorCaution;
                }else {
                    dataColor = colorHealthy;
                }

                prevLogData.push(currentData.value);
            }
                    
            $scope.logData.push({
                    name : currentData.name,
                    value : currentData.value,
                    timestamp : telemetry['time'],
                    style : dataColor
            });
        } 
    }

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);  
});


