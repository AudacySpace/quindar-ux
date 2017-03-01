app
.factory('lineService',['dashboardService','$interval', function(db, $interval) { 

	var elem = 1;
	var transWidth;
	var transHeight;
	var disp = "off";
	
	var telemetry = {};
  	db.getTelemetry(telemetry);
	
	return {
		elem: elem,
		transWidth: transWidth,
		transHeight: transHeight,
		disp: disp,
		telemetry: telemetry,
	}

}]);