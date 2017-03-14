app
.factory('dashboardService', ['$interval', '$http', function($interval, $http) {
    var locks = {
        lockLeft : false,
        lockRight : false
    };
    var telemetry = {};
    var time = {
        timestamp : ""
    }

    getTelemetry();

    function getTelemetry() {
        $interval(function () { 
            $http({
                url: "/getTelemetry", 
                method: "GET",
                params: {'vehicles' : ['Audacy1', 'Audacy2', 'Audacy3']}
            }).then(function(response) {
                for(var item in response.data){
                    telemetry[item] = response.data[item];
                    time.timestamp = startTime(telemetry[item].timestamp.value);
                }
            })
        },1000);
    }

    function getLock(){
        return locks;
    }

    function setLeftLock(lock){
        locks.lockLeft = lock;
    }

    function setRightLock(lock){
       locks.lockRight = lock; 
    }

    function startTime(time) {
        var today = new Date(time);
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

    function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

	return {
        locks : locks,
        telemetry : telemetry,
        time : time,
		name : username,
		email : usermail,
        getLock : getLock,
        setLeftLock : setLeftLock,
        setRightLock : setRightLock
	}
}]);