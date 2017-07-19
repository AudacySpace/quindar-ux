app
.factory('dashboardService', ['$interval', '$http', function($interval, $http) {
    var locks = {
        lockLeft : false,
        lockRight : false
    };
    var telemetry = {};
    var time = "";

    var icons = {sIcon:"", gIcon:"", pIcon:"",dIcon:""};
    

    getTelemetry();
    getProxyStatus();

    function getTelemetry() {
        var prevId = "";
        $interval(function () { 
            $http({
                url: "/getTelemetry", 
                method: "GET",
                params: {'mission' : 'ATest'}
            }).then(function success(response) {
                telemetry = response.data.telemetry;
                time = response.data.timestamp;
                if(isEmpty(response.data) === false){//if data is not empty
                    if(prevId === response.data._id){ //  if proxy application is not receiving any data from ground station
                        icons.sIcon = "grey";
                        icons.gIcon = "red";
                        icons.pIcon = "green";
                        icons.dIcon = "blue";
                    } else {
                        icons.sIcon = "green";
                        icons.gIcon = "green";
                        icons.pIcon = "green";
                        icons.dIcon = "green";
                        prevId = response.data._id;
                    }
                } else { // if data received is empty
                    icons.sIcon = "red";
                    icons.gIcon = "green";
                    icons.pIcon = "green";
                    icons.dIcon = "green";
                }
            }, function error(response){
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

    function getTime(offset) {
        var days = "000",
            h = "00",
            m = "00",
            s = "00",
            clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";

        if(time != "") {
            var today = new Date(time);
            var todayZone = new Date(today.getTime() + (3600000*offset) + (today.getTimezoneOffset() * 60000));
            var start = new Date(todayZone.getFullYear(), 0, 0);
            var diff = todayZone - start;
            h = todayZone.getHours();
            m = todayZone.getMinutes();
            s = todayZone.getSeconds();
            days = Math.floor(diff/(1000*60*60*24));
            days = checkDays(days);
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);
            clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";
        }

        return {
            "today" : today,
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

    function checkDays(d) {
        if (d < 10) {
            d = "00" + d;
        } else if (d < 100) {
            d = "0" + d;
        }
        return d;
    }

    function countdown(target) {
        var targettimestamp;
        if(typeof target === "string"){
            targettimestamp = new Date(target);
        }else {
            targettimestamp = target;
        }
        var sign = '';
        var today = new Date(time);
        var currentDate = new Date(today.getTime() + (today.getTimezoneOffset() * 60000));
        var signedDiff = targettimestamp - currentDate;

        //remove sign to calculate individual numbers
        var difference = Math.abs(signedDiff);
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(difference / (1000 * 60 * 60 * 24));
        var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // define sign
        if (signedDiff < 0) {
            sign = '+';
        } else {
            sign = '-';   
        }

        days = checkDays(days);
        hours = checkTime(hours);
        minutes = checkTime(minutes);
        seconds = checkTime(seconds);

        return {
            "days" : days,
            "hours" : hours,
            "minutes" : minutes,
            "seconds" : seconds,
            "sign" : sign
        };
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

    function isEmpty(myObject) {
        for(var key in myObject) {
            if (myObject.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    
	return {
        locks : locks,
        telemetry : telemetry,
        getLock : getLock,
        setLeftLock : setLeftLock,
        setRightLock : setRightLock,
        icons : icons,
        getTime : getTime,
        countdown : countdown,
	}
}]);
