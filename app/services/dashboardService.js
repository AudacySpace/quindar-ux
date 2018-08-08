app
.factory('dashboardService', ['$interval', '$http','$uibModal','gridService','$mdToast', function($interval, $http,$uibModal,gridService,$mdToast) {
    var locks = {
        lockLeft : false,
        lockRight : false
    };
    var telemetry = {};
    var time = "";
    var missions = [];
    var selectedMission = {"missionName":"","missionImage":""};
    var icons = {sIcon:"", gIcon:"", pIcon:"",dIcon:""};

    getMissionLayout();
    getProxyStatus();

    function getMissionLayout(){
        var currentLayout = gridService.getDashboard();
        if(currentLayout.current.mission.missionName !== ""){
            gridService.setMissionForUser(currentLayout.current.mission.missionName);
            setCurrentMission(currentLayout.current.mission);
            getTelemetry(currentLayout.current.mission.missionName);
        }else {
            getMissions(missions);
        }
    }

    function getMissions(missions){
        $http({
            url: "/getMissions", 
            method: "GET",
            params:{}
        }).then(function success(response) {
            for(var i=0;i<response.data.length;i++){
                var image = gridService.getMissionImage(response.data[i].mission);
                missions.push({"missionName":response.data[i].mission,"missionImage":image});
            }
            $uibModal.open({
                templateUrl: './components/dashboard/missionModal.html',
                controller: 'missionModalCtrl',
                controllerAs: '$ctrl',
                backdrop: 'static'
            }).result.then(function(response){
                if(response){
                    gridService.setMissionForLayout(response.missionName);
                    getTelemetry(response.missionName);
                }
            },function close(){
                alert("No mission selected!Reload the page for options.");
            }); 
        },function error(response){
            alert("No mission available!");
        });
    }

    function getTelemetry(missionName) {
        var prevId = "";
        $interval(function () { 
            $http({
                url: "/getTelemetry", 
                method: "GET",
                params: {'mission' : missionName}
            }).then(function success(response) {
                if(response.data){
                    for(var item in response.data.telemetry){
                        telemetry[item] = response.data.telemetry[item];
                    }
                    telemetry['data'] = response.data.telemetry;
                    telemetry['time'] = response.data.timestamp;
                    time = response.data.timestamp;
                }else{
                    telemetry = {};
                }

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
        var days = "000",
            hours = "00",
            minutes = "00",
            seconds = "00",
            sign = '';

        if(time != "") {
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
        }

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

    function sortObject(o) {
        var sorted = {},
        key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;
    }

    function getData(key){
        var keys = key.split('.'),
            data = telemetry['data'];

        if(key && data){
            for (var i = 0; i < keys.length; ++i) {
                if (data[keys[i]] == undefined) {
                    return undefined;
                } else {
                    data = data[keys[i]];
                }
            }
            return data;
        } else {
            return null;
        }
    }

    function setCurrentMission(mName){
        selectedMission.missionName = mName.missionName;
        selectedMission.missionImage = mName.missionImage;
    }
    function getCurrentMission(){
        return selectedMission;
    }

    function getConfig(missionName) {
        return $http({
                url: "/getConfig", 
                method: "GET",
                params: {'mission' : missionName}
            });
    }

    function getTelemetryValues(){
        return telemetry;
    }

    function displayAlert(message,position,queryId,delay){

        if(queryId === ""){
            var toast = $mdToast.simple()
                            .textContent(message)
                            .action('OK')
                            .hideDelay(delay)
                            .highlightAction(true)
                            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                            .position(position);
            $mdToast.show(toast).then(function(response) {
                if ( response == 'ok' ) {}
            });
            return true;
        }else {
            var toast = $mdToast.simple()
                            .textContent(message)
                            .action('OK')
                            .parent(document.querySelectorAll(queryId))
                            .hideDelay(delay)
                            .highlightAction(true)
                            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                            .position(position);

            $mdToast.show(toast).then(function(response) {
                if ( response == 'ok' ) {
                }
            },function(error){
                // console.log(error);
            });

            return true;
        }

    }

    function displayWidgetAlert(message,position,queryId,delay){
        if(queryId === ""){
            var toast = $mdToast.simple()
                            .textContent(message)
                            .action('OK')
                            .hideDelay(delay)
                            .highlightAction(true)
                            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                            .position(position);
            $mdToast.show(toast).then(function(response) {
                if ( response == 'ok' ) {}
            });
            return true;
        }else {
            var toast = $mdToast.simple()
                            .textContent(message)
                            .action('OK')
                            // .parent(document.querySelectorAll(queryId))
                            .parent(queryId)
                            .hideDelay(delay)
                            .highlightAction(true)
                            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                            .position(position);

            $mdToast.show(toast).then(function(response) {
                if ( response == 'ok' ) {
                }
            },function(error){
                // console.log(error);
            });

            return true;
        }

    }

	return {
        locks : locks,
        telemetry : telemetry,
        missions : missions,
        icons : icons,
        getLock : getLock,
        setLeftLock : setLeftLock,
        setRightLock : setRightLock,
        getTime : getTime,
        countdown : countdown,
        isEmpty : isEmpty,
        sortObject : sortObject,
        getData : getData,
        setCurrentMission : setCurrentMission,
        getCurrentMission : getCurrentMission,
        getConfig : getConfig,
        getTelemetryValues : getTelemetryValues,
        displayAlert : displayAlert,
        displayWidgetAlert : displayWidgetAlert
	}
}]);
