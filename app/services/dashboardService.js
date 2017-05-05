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
    var icons = {sIcon:"", gIcon:"", pIcon:"",dIcon:""};
    getTelemetry();
    getProxyStatus();

    function getTelemetry() {
        var prevId = "";
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
                if(Object.keys(response.data[item]).length > 0){//if data is not empty
                        if(prevId === telemetry[item]._id){ //  if proxy application is not receiving any data from ground station
                            icons.sIcon = "grey";
                            icons.gIcon = "red";
                            icons.pIcon = "green";
                            icons.dIcon = "blue";
                        }else{
                            icons.sIcon = "green";
                            icons.gIcon = "green";
                            icons.pIcon = "green";
                            icons.dIcon = "green";
                            prevId = telemetry[item]._id;
                        }
                }else{ // if data received is empty
                    icons.sIcon = "red";
                    icons.gIcon = "green";
                    icons.pIcon = "green";
                    icons.dIcon = "green";
                }
            },function error(response){
                icons.sIcon = "grey";
                icons.gIcon = "grey";
                icons.pIcon = "grey";
                icons.dIcon = "red";
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

    //Function to get proxy application status 
    function getProxyStatus(){
        var prevTime = 0;
        $interval(function () { 
            $http({
                url: "/getProxyStatus", 
                method: "GET",
                params: {}
            }).then(function success(response) {
                if(response.data !== ""){
                    if(prevTime !== response.data.proxytimestamp){
                        icons.pIcon = "green";
                        prevTime = response.data.proxytimestamp;  
                    }else {
                        icons.sIcon = "grey";
                        icons.gIcon = "grey";
                        icons.pIcon = "red";
                        icons.dIcon = "green";
                    }
                }else {
                    icons.pIcon = "grey";
                }
            },function error(response){
                icons.sIcon = "grey";
                icons.gIcon = "grey";
                icons.pIcon = "grey";
                icons.dIcon = "red";
            });
        },5000);
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
        icons : icons
	}
}]);