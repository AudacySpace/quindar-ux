app
.factory('dashboardService', ['$interval', '$http','$uibModal','gridService', function($interval, $http,$uibModal,gridService) {
    var locks = {
        lockLeft : false,
        lockRight : false
    };
    var telemetry = {};
    var time = "";
    var missions = [];
    var selectedMission = {"missionName":"","missionImage":""};
    var icons = {sIcon:"", gIcon:"", pIcon:"",dIcon:""};

    var loadCount = 0;
    var loadStatus = {
        value:true
    };
    var missionSelection;

    getMissionLayout();
    getProxyStatus();

    function getMissionLayout(){
        var currentLayout = gridService.getDashboard();
        if(currentLayout.current.mission.missionName !== ""){
            gridService.setMissionForUser(currentLayout.current.mission.missionName);
            setCurrentMission(currentLayout.current.mission);
            getTelemetry(currentLayout.current.mission);
        }else {
            getMissions(missions);
        }
    }

    function getMissions(missions){
        loadStatus.value = false;
        $http({
            url: "/getMissions", 
            method: "GET",
            params:{}
        }).then(function success(response) {
            for(var i=0;i<response.data.length;i++){
                var image = gridService.getMissionImage(response.data[i].mission);
                missions.push({
                    "missionName":response.data[i].mission,
                    "missionImage":image,
                    "simulated":response.data[i].simulated
                });
            }
            $uibModal.open({
                templateUrl: './components/dashboard/missionModal.html',
                controller: 'missionModalCtrl',
                controllerAs: '$ctrl',
                backdrop: 'static'
            }).result.then(function(response){
                if(response){
                    missionSelection = true;
                    gridService.setMissionForLayout(response);
                    getTelemetry(response);
                }                
            },function close(){
                alert("No mission selected!Reload the page for options.");
            }); 
        },function error(response){
            alert("No mission available!");
        });
    }

    function getTelemetry(mission) {
        var prevId = "";
        var loaders;
        if(loadCount === 0 && missionSelection !== true){
            loadStatus.value = true;
        }

        $interval(function () { 
            $http({
                url: "/getTelemetry", 
                method: "GET",
                params: {'mission' : mission.missionName}
            }).then(function success(response) {
                if(response.data){
                    for(var item in response.data.telemetry){
                        telemetry[item] = response.data.telemetry[item];
                    }
                    telemetry['data'] = response.data.telemetry;
                    telemetry['time'] = response.data.timestamp;
                    // time = response.data.timestamp;
                    loadCount++;
                    loadStatus.value = false;
                    loaders = gridService.getGridLoader();
                    if(loaders.gridLoader === true){
                        gridService.setGridLoader(false);
                    }
                }else{
                    telemetry = {};
                    loadCount++;
                    loadStatus.value = false;
                    loaders = gridService.getGridLoader();
                    if(loaders.gridLoader === true){
                        gridService.setGridLoader(false);
                    }
                }

                if(!mission.simulated){
                    if(isEmpty(response.data) === false){//if data is not empty
                        if(prevId === response.data._id){ //  if proxy application is not receiving any data from ground station
                            icons.sIcon = "grey";
                            icons.gIcon = "red";
                            icons.pIcon = "green";
                            icons.dIcon = "blue";
                            loadCount++;
                            loadStatus.value = false;
                            loaders = gridService.getGridLoader();
                                if(loaders.gridLoader === true){
                                    gridService.setGridLoader(false);
                            }
                        } else {
                            icons.sIcon = "green";
                            icons.gIcon = "green";
                            icons.pIcon = "green";
                            icons.dIcon = "green";
                            prevId = response.data._id;
                            loadCount++;
                            loadStatus.value = false;
                            loaders = gridService.getGridLoader();
                            if(loaders.gridLoader === true){
                                gridService.setGridLoader(false);
                            }
                        }
                    } else { // if data received is empty
                        icons.sIcon = "red";
                        icons.gIcon = "green";
                        icons.pIcon = "green";
                        icons.dIcon = "green";
                        loadCount++;
                        loadStatus.value = false;
                        loaders = gridService.getGridLoader();
                        if(loaders.gridLoader === true){
                            gridService.setGridLoader(false);
                        }
                    }
                } else {
                    if(isEmpty(response.data) === false && isEmpty(response.data.telemetry) === false){//if data is not empty
                        if(!response.data.status){ //  if data received is old
                            icons.sIcon = "red";
                            icons.gIcon = "green";
                            icons.pIcon = "green";
                            icons.dIcon = "blue";
                            loadCount++;
                            loadStatus.value = false;
                            loaders = gridService.getGridLoader();
                                if(loaders.gridLoader === true){
                                    gridService.setGridLoader(false);
                            }
                        } else {
                            icons.sIcon = "green";
                            icons.gIcon = "green";
                            icons.pIcon = "green";
                            icons.dIcon = "green";
                            loadCount++;
                            loadStatus.value = false;
                            loaders = gridService.getGridLoader();
                            if(loaders.gridLoader === true){
                                gridService.setGridLoader(false);
                            }
                        }
                    } else { // if data received is empty
                        icons.sIcon = "red";
                        icons.gIcon = "green";
                        icons.pIcon = "green";
                        icons.dIcon = "green";
                        loadCount++;
                        loadStatus.value = false;
                        loaders = gridService.getGridLoader();
                        if(loaders.gridLoader === true){
                            gridService.setGridLoader(false);
                        }
                    }
                }
            }, function error(response){
                icons.sIcon = "grey";
                icons.gIcon = "grey";
                icons.pIcon = "grey";
                icons.dIcon = "red";
                loadCount++;
                loadStatus.value = false;
                loaders = gridService.getGridLoader();
                if(loaders.gridLoader === true){
                    gridService.setGridLoader(false);
                }
            });

            //Set Mission Time
            //Value from telemetry if simulated mission
            //Real UTC clock time if real mission
            if(!mission.simulated){
                time = new Date();
            } else {
                if(telemetry['time']){
                    time = telemetry['time'];
                }
            }

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

    function getTime(timezone) {
        var days = "000",
            h = "00",
            m = "00",
            s = "00",
            clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";

        if(time != "") {
            var missionTime = moment(time).tz(timezone); // moment object of mission time in timezone defined
            var today = missionTime.toDate();
            days = checkDays(missionTime.dayOfYear());
            h = checkTime(missionTime.hours());
            m = checkTime(missionTime.minutes());
            s = checkTime(missionTime.seconds());
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
        var days = "000",
            hours = "00",
            minutes = "00",
            seconds = "00",
            sign = '';
        var diff;

        if(time != "") {
            var targetTime = moment(target).tz('UTC'); //moment object of target time in UTC
            var missionTime = moment(time).tz('UTC'); //moment object of mission time in UTC

            if(missionTime.isAfter(targetTime)){
                diff = missionTime.diff(targetTime);
                sign = '+'
            } else {
                diff = targetTime.diff(missionTime);
                sign = '-'
            }

            //duration of the difference in time
            var duration = moment.duration(diff);

            // Time calculations for days, hours, minutes and seconds
            days = Math.floor(duration.asDays());
            hours = duration.hours();
            minutes = duration.minutes();
            seconds = duration.seconds();

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
        selectedMission.simulated = mName.simulated;
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

    function getLoadStatus(){
        return loadStatus;
    }

    function setLoadStatus(status){
        loadStatus.value = status;
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
        getLoadStatus : getLoadStatus,
        setLoadStatus : setLoadStatus
	}
}]);
