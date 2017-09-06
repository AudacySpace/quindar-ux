app.directive('alarmpanel',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/alarmpanel/alarmpanel.html',
    controller: 'AlarmPanelCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('AlarmPanelCtrl',function ($scope,$window,$element,$interval,dashboardService,datastatesService,userService,gridService,statusboardService){  
    
    var telemetry = dashboardService.telemetry;
    var flexprop = 100;
    $scope.alarmpanel = statusboardService.getStatusTable();//status board current alerts;
    var time,name,callsign,ack = "";
    $scope.contents = [];
    $scope.masteralarmstatus = statusboardService.getMasterAlarmColors();
    $scope.class = []; // for glowing effect
    $scope.checked = []; //to enable or disable a button's clickable functionality
    $scope.statusboard = $scope.widget.settings.statusboard;//settings menu button
    var currentMission = dashboardService.getCurrentMission();
    var vehicleColors = [];
    getVehicles();

    //Function to display master alarm and its sub systems
    function getVehicles(){
        var interval = $interval(function(){
            if(currentMission.missionName != ""){
                if($scope.contents.length == 0){
                    dashboardService.getConfig(currentMission.missionName)
                        .then(function(response){
                            if(response.data) {
                                var data = dashboardService.sortObject(response.data);
                                for(var key in data) {
                                    if(data.hasOwnProperty(key)) {
                                        $scope.contents.push({
                                            "vehicle":key,
                                            "flexprop":"",
                                            "categories":Object.keys(data[key]),
                                            "vehicleColor":"",
                                            "categoryColors": [],
                                            "tableArray":[],
                                            "subCategoryColors" :[],
                                             "ackStatus":false
                                        });
                                    }
                                }
                                if($scope.contents.length > 0){   
                                    for(var i=0;i<$scope.contents.length;i++){
                                        $scope.contents[i].flexprop = flexprop/$scope.contents.length;
                                    }                    
                                }
                            } 
                        }); 
                }
                $interval.cancel(interval);
            } 
        }, 1000);  
    }

    $scope.interval = $interval(updateColors, 1000, 0, false); 

    //Function to get colors of each telemetry data item of each vehicle's sub category
    function updateColors(){
        time = dashboardService.getTime(0);
        name = userService.getUserName();
        callsign = userService.getCurrentCallSign();

        var alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType;
        var newtablearray = [];
        vehicleColors = [];

        for(var i=0;i<$scope.contents.length;i++){
            $scope.contents[i].tableArray = [];
            $scope.contents[i].subCategoryColors = [];
            if($scope.contents[i].vehicle && dashboardService.isEmpty(telemetry) === false){
                if($scope.contents[i].categories.length > 0){
                    for(var j=0;j<$scope.contents[i].categories.length;j++){
                        for(var key in telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]]){
                            if(telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]].hasOwnProperty(key)) {
                                for(var keyval in telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key] ){
                                    if(telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key].hasOwnProperty(keyval)){
                                        alowValue = telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key][keyval].alarm_low;
                                        ahighValue = telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key][keyval].alarm_high;
                                        dataValue = telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key][keyval].value;
                                        wlowValue = telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key][keyval].warn_low;
                                        whighValue = telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key][keyval].warn_high;
                                        valueType = typeof telemetry[$scope.contents[i].vehicle][$scope.contents[i].categories[j]][key][keyval].value;

                                        var status = datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType);
                                        $scope.contents[i].subCategoryColors.push(status.color);
                                        var vehicle = $scope.contents[i].vehicle;
                                        var subsystem = $scope.contents[i].categories[j];
                                        var channel = vehicle+"."+subsystem+"."+key+"."+keyval;
                                        var timestamp = Math.round(time.today/1000);
                                        ack = "";
                                        if(status.alert === "ALARM" || status.alert === "CAUTION"){
                                            $scope.contents[i].ackStatus = false; 
                                            $scope.contents[i].tableArray.push({"alert":status.alert,"bound":status.bound,"vehicle":vehicle,"time":time.utc,"channel":channel,"ack":ack,"timestamp":timestamp});  
                                        }
                                    }   
                                }
                            }
                        }
                    }
                }
              newtablearray = newtablearray.concat($scope.contents[i].tableArray);
            }
            vehicleColors.push({"vehicle":$scope.contents[i].vehicle,"status":false});
        }

        if(newtablearray.length > 0){
            gridService.saveAlerts(newtablearray,vehicleColors); 
        }
        if($scope.contents.length > 0){
            statusboardService.setSubSystemColors($scope.contents);//Function call to set sub system colors   
        }
        statusboardService.loadAlerts(); 
    }

    $scope.addtablerow = function(veh,$index,color){
        var newArray = [];
        ack = name+" - "+callsign;
        var len = $scope.contents[$index].tableArray.length;

        if(color.background === "#FF0000" || color.background === "#FFFF00"){
            $scope.contents[$index].ackStatus = true;
            $scope.class[$index] = "buttonNone"; 
        }

        for(var k=0;k<$scope.contents.length;k++){
            if(k === $index){
                vehicleColors[k].status = true;
            }
        }

        for(var i=0;i<len;i++){
            $scope.contents[$index].tableArray[i].ack = ack;
            newArray.push($scope.contents[$index].tableArray[i]); 
        }

        gridService.saveAckAlerts(newArray,vehicleColors)
            .then(function success(response) {

            },function error(response){
        });
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.interval);
        }
    );
});




