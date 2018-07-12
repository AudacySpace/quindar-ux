app.directive('datalog',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datalog/datalog.html',
    controller: 'DataLogCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataLogCtrl',function ($scope,$interval,dashboardService,datastatesService, gridService){  
    $scope.telemetry = dashboardService.telemetry;
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
    
    var boxDiv = $("grid").find('div.box-content')[gridService.getDashboard().current.widgets.indexOf($scope.widget)];
    $scope.boxReference = angular.element(boxDiv);
    $scope.box = $scope.boxReference[0]; //div that results in scrollbar when many rows pushed

    $scope.scrollToBottom = true;

    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);


    /*Function to update the log and set data state colors*/
	$scope.updateLog = function(){
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

    //Called every time user scrolls in widget
    $scope.boxReference.scroll(function () {
        if($scope.box.scrollHeight == Math.floor($scope.box.scrollTop) + $scope.box.clientHeight) //Check if user is scrolled to bottom of data log
        {
            $scope.scrollToBottom = true;
        }
        else
        {
            $scope.scrollToBottom = false;
        }
        $scope.autoScroll();
        return true;
    });

    //Check to see if necessary to stay scrolled at the bottom of the data log
    $scope.autoScroll = function()
    {
        if ($scope.scrollToBottom) { //if the user has already scrolled to the bottom, ensure that the scroll remains at the bottom
            $scope.box.scrollTop = $scope.box.scrollHeight;
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
                currentData.value = parseFloat(currentData.value.toFixed(4));
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
                timestamp : $scope.telemetry['time'],
                style : dataColor,
                vehicle : $scope.widget.settings.data.vehicle
            });
        } 
    }

    $scope.interval = $interval($scope.updateLog, 1000, 0, false);   

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);  
});


