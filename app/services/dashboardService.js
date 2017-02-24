app
.factory('dashboardService', ['$interval', '$http', function($interval, $http) { 
	function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

    function getTelemetry(value) {
        $interval(function () { 
            $http({
                url: "/getTelemetry", 
                method: "GET",
                params: {'vehicles' : ['Audacy1', 'Audacy2', 'Audacy3']}
            }).then(function(response) {
                for(var item in response.data){
                    value[item] = response.data[item];
                }
            })
        },1000);
    }

    function startTime() {
        var today = new Date();
        var start = new Date(today.getUTCFullYear(), 0, 0);
        var diff = today - start;
        var h = today.getUTCHours();
        var m = today.getUTCMinutes();
        var s = today.getUTCSeconds();
        var days = Math.floor(diff/(1000*60*60*24));
        h = checkTime(h);
        m = checkTime(m);
        s = checkTime(s);
        clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";
        return clock;
    }

	return {
		getTelemetry : getTelemetry,
		name : username,
		email : usermail,
		startTime : startTime
	}
}]);