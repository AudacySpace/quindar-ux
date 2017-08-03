app
.factory('dashboardService', ['$interval', '$http','$uibModal', function($interval, $http,$uibModal) {
    var locks = {
        lockLeft : false,
        lockRight : false
    };
    var telemetry = {};
    var time = "";
    var platforms = [];
    var missions = [];
    var selectedMission = {"mission":""};
    var treeData = {"data":[]};
    var icons = {sIcon:"", gIcon:"", pIcon:"",dIcon:""};
    
    getMissions(missions);
    getProxyStatus();
    var intervalId = {};

    function getMissions(missions){
        $http({
            url: "/getMissions", 
            method: "GET",
            params:{}
        }).then(function success(response) {
            for(var i=0;i<response.data.length;i++){
                if(response.data[i] === "Audacy Zero"){
                    missions.push({"name":response.data[i].mission,"image":"/media/icons/AudacyZero_Logo_Reg.svg"});
                }else if(response.data[i] === "Audacy Lynq"){
                    missions.push({"name":response.data[i].mission,"image":""});
                }else {
                    missions.push({"name":response.data[i].mission,"image":"/media/icons/Audacy_Icon_White.svg"}); 
                }
            }
            $uibModal.open({
                templateUrl: './components/dashboard/missionModal.html',
                controller: 'missionModalCtrl',
                controllerAs: '$ctrl'
            }).result.then(function(response){
                if(response){
                    getTelemetry(response.name);
                    getDataMenu(response.name);
                }
            },function close(){
                alert("No mission selected!Reload the page for options.");
            }); 
        },function error(response){
            console.log("No mission available!");
        });
    }

    function getTelemetry(missionName) {
        var prevId = "";
        if(intervalId){
            $interval.cancel(intervalId);
        }
        intervalId =  $interval(function () { 
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
        selectedMission.mission = mName.currentMission;
    }
    function getCurrentMission(){
        return selectedMission;
    }

    function getConfig(missionname) {
        return $http({
                url: "/getConfig", 
                method: "GET",
                params: {'mission' : missionname}
            });
    }

    function getDataMenu(missionname){
        getConfig(missionname)
            .then(function(response) {
                if(response.data) {
                    treeData.data = getDataTree(response.data);
                }
            });
    }

    //recursive function to create the tree structure data
    function getDataTree(data, cKey){
        var tree = [];
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                var nodes = [];
                var newKey = (cKey ? cKey + "." + key : key);

                if(typeof data[key] === 'object'){
                    nodes = getDataTree(data[key], newKey);
                }

                if(nodes.length != 0) {
                    key = initCaps(key);
                }

                var node = {
                    'name' : key,
                    'nodes' : nodes,
                    'value' : newKey,
                    'active' : false
                };

                tree.push(node)
            }
        }
        return tree;
    }

    //function to capitalise the first letter of a string
    function initCaps(str){
        words = str.split(' ');
        for(var i = 0; i < words.length; i++) {
            var letters = words[i].split('');
            letters[0] = letters[0].toUpperCase();
            words[i] = letters.join('');
        }
        return words.join(' ');
    }
    
	return {
        locks : locks,
        telemetry : telemetry,
        missions : missions,
        getLock : getLock,
        setCurrentMission : setCurrentMission,
        getCurrentMission : getCurrentMission,
        treeData : treeData,
        getTelemetry : getTelemetry,
        getMissions : getMissions,
        setLeftLock : setLeftLock,
        setRightLock : setRightLock,
        isEmpty : isEmpty,
        icons : icons,
        getTime : getTime,
        countdown : countdown,
        sortObject : sortObject,
        getData : getData,
        getConfig : getConfig
	}
}]);
