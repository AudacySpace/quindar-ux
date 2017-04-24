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
                docIds.push(telemetry[item]._id);
                if(docIds[docIds.length-1] === docIds[docIds.length-2]){
                    //checkServerStatus();
                     //ServerPing();
                    sIcon.sic = "grey";
                    gIcon.gic = "green";
                    pIcon.pic = "green";
                    dIcon.dic = "red";
                }
                else{
                    sIcon.sic = "green";
                    gIcon.gic = "green";
                    pIcon.pic = "green";
                    dIcon.dic = "green";
                }

            },function error(response){
                console.log(response);
                if(response.status === -1){ 
                    sIcon.sic = "grey";
                    gIcon.gic = "green";
                    pIcon.pic = "red";
                    dIcon.dic = "red";
                }else if(response.status === 500){ //proxy
                    sIcon.sic = "grey";
                    gIcon.gic = "grey";
                    pIcon.pic = "red";
                    dIcon.dic = "red";
                }
                else if(response.status === 502 || response.status === 504){ //gs
                    sIcon.sic = "grey";
                    gIcon.gic = "red";
                    pIcon.pic = "red";
                    dIcon.dic = "red";
                }
                else {
                    gIcon.gic = "red";
                    pIcon.pic = "red";
                    sIcon.sic = "red";
                    dIcon.dic = "red";
                }

            });

        },1000);

    }

    // function checkServerStatus(){
    //     $http({
    //             url: "//qsvr.quindar.space", 
    //             method: "GET",
    //             params: ''
    //         }).then(function success(response) {
    //             if(response.statusCode === 200){
    //                 console.log("Running");
    //             }

    //         },function error(response){
    //             console.log(response.statusCode);
    //             console.log("Server Down");

    //         });

    // }

    function ServerPing(){       
  var url = "https://qsvr.quindar.space";
  if (window.XMLHttpRequest){ 
    reqXML = new XMLHttpRequest();           
    reqXML.onreadystatechange = HandlePing;   
    reqXML.open("GET", url, true);         
    reqXML.send(null);                        
  }
  else if(window.ActiveXObject){ 
    reqXML = new ActiveXObject("Microsoft.XMLHTTP"); 
    if(reqXML){ 
      reqXML.onreadystatechange = HandlePing;   
      reqXML.open("GET", url, true);         
      reqXML.send(null);                     
    }
  }
  else{  
     window.location.href = url;
  }       
}
     
function HandlePing(){
  window.status = "Pinging Server - state: " + reqXML.readyState;
  if(reqXML.readyState == 4){
    var strDate = new Date().toString();
    if(reqXML.status == 200){
         console.log("Running");
      window.status = "Sucessfull Ping at " + strDate;
    }
    else{
         console.log("Server Down");

      window.status = "Failed Ping at " + strDate;
    }
  }
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