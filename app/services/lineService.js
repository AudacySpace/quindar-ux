app
.factory('lineService',['dashboardService','$interval', function(db, $interval) { 

	var elem = 1;
	var transWidth;
	var transHeight;
	var disp = "off";
	
	var telemetry = {};
  	db.getTelemetry(telemetry);
	
	var setElem = function(element){
		console.log(element);
		elem = element;
	}
	
	var getElem = function(){
		return elem;
	}
	
	return {
		elem: elem,
		transWidth: transWidth,
		transHeight: transHeight,
		disp: disp,
		telemetry: telemetry,
		setElem: setElem,
		getElem: getElem
	}

}]);