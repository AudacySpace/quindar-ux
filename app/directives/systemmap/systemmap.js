app
.directive('systemmap', function() { 
	return { 
    	restrict: 'EA', 
		controller: 'SystemMapCtrl',
    	templateUrl: './directives/systemmap/systemmap.html'
    }
});

app.controller('SystemMapCtrl', function ($scope, dashboardService, $interval, datastatesService) {

	// data states colors
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var prevDatavalue = [];
    $scope.dataStatus = dashboardService.icons;
    var dServiceObjVal = {};
   // $scope.interval = $interval(updateSystemMap, 1000, 0, false);   

    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);

    function updateSystemMap(){

    //Implement when data is available.
        //0.Uncomment interval call to updateSystemMap
    	//1.GET image data of the selected image from database.
    	//2.SET mission name,sub system name ,subcategory name and data id from image data
    	//3.Create a string datavalue to form an argument to dashboardService.getData(datavalue);
    	//4.The datavalue should be a concatenated string mission.subsystem.subcategory.dataid;
    	//5.GET data value of each data id from telemetry collection and check the data state color;
    	//6.SET the value{{tlmdata.value}} and its color{{tlmdata.datacolor}} for display on the selected map at the designated area.

    }

//    $scope.$on("$destroy", 
	// 	function(event) {
	// 		$interval.cancel( $scope.interval );
	// 	}
	// );  
}

