app
.factory('lineService',['dashboardService','$interval', function(db, $interval) { 

	var telemetry = {};
  	db.getTelemetry(telemetry);
	
	
	return {
		telemetry: telemetry
	}

}]);