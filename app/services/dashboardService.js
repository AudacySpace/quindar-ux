app
.factory('dashboardService', ['$interval', '$http', function($interval, $http) {
    var locks = {
        lockLeft : false,
        lockRight : false
    };
    var telemetry = {};
    var time = {
        timestamp : {}
    }
    var docIds = [];
    var pIcon = {pic:""};
    var dIcon = {dic:""};
    var gIcon = {gic:""};
    var sIcon = {sic:""};
    var count = 0;
    getTelemetry();

    function getTelemetry() {
        $interval(function () { 
            $http({
                url: "/getTelemetry", 
                method: "GET",
                params: {'vehicles' : ['Audacy1', 'Audacy2', 'Audacy3']}
            }).then(function success(response) {
                for(var item in response.data){
                    telemetry[item] = response.data[item];
                    time.timestamp = startTime(telemetry[item].timestamp.value);
                      
                }
                count++; 
                if(Object.keys(response.data[item]).length > 0){//if data is not null
                    docIds.push(telemetry[item]._id);
                    if(docIds[docIds.length-1] === docIds[docIds.length-2]){
                        docIds.pop();
                        count--;
                        if(docIds.length === count){
                        sIcon.sic = "grey";
                        gIcon.gic = "green";
                        pIcon.pic = "green";
                        dIcon.dic = "green";
                    }
                    }
                    else{
                        sIcon.sic = "green";
                        gIcon.gic = "green";
                        pIcon.pic = "green";
                        dIcon.dic = "green";
                    }
                }
                else { // if data is null
                    sIcon.sic = "red";
                    gIcon.gic = "green";
                    pIcon.pic = "green";
                    dIcon.dic = "green";
                }
            },function error(response){
                sIcon.sic = "grey";
                gIcon.gic = "grey";
                pIcon.pic = "grey";
                dIcon.dic = "red";
            });

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
        return {
            "days" : days,
            "hours" : h,
            "minutes" : m,
            "seconds" : s,
            "utc" : clock
        };
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
        setRightLock : setRightLock,
        pIcon : pIcon,
        dIcon : dIcon,
        gIcon : gIcon,
        sIcon : sIcon
	}
}]);