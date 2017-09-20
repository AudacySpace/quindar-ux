app.directive('alarmpanel',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/alarmpanel/alarmpanel.html',
    controller: 'AlarmPanelCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('AlarmPanelCtrl',
    function ($scope,$interval,dashboardService,datastatesService,userService,statusboardService){ 
    
    var telemetry = dashboardService.telemetry;
    var flexprop = 100;
    $scope.alarmpanel = statusboardService.getStatusTable();//status board current alerts;
    var time, ack = "";
    var name = userService.getUserName();
    var callsign = userService.getCurrentCallSign();
    $scope.contents = [];
    $scope.masteralarmstatus = statusboardService.getMasterAlarmColors();
    $scope.class = []; // for glowing effect
    $scope.checked = []; //to enable or disable a button's clickable functionality
    $scope.statusboard = $scope.widget.settings.statusboard;//settings menu button
    var currentMission = dashboardService.getCurrentMission();
    var vehicleColors = []; //contains all the vehicles to be displayed for the mission
    
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
                                        vehicleColors.push({"vehicle":key,"status":false});
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
        var alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType;
        var newtablearray = [];

        time = dashboardService.getTime(0);

        for(var i=0;i<$scope.contents.length;i++){
            $scope.contents[i].tableArray = [];
            $scope.contents[i].subCategoryColors = [];
            if($scope.contents[i].vehicle && dashboardService.isEmpty(telemetry) === false){
                var vehicle = $scope.contents[i].vehicle;
                if($scope.contents[i].categories.length > 0){
                    var categories = $scope.contents[i].categories;
                    for(var j=0;j<categories.length;j++){
                        for(var key in telemetry[vehicle][categories[j]]){
                            if(telemetry[vehicle][categories[j]].hasOwnProperty(key)) {
                                for(var keyval in telemetry[vehicle][categories[j]][key] ){
                                    if(telemetry[vehicle][categories[j]][key].hasOwnProperty(keyval)){
                                        var telemetryValue = telemetry[vehicle][categories[j]][key][keyval];
                                        alowValue = telemetryValue.alarm_low;
                                        ahighValue = telemetryValue.alarm_high;
                                        dataValue = telemetryValue.value;
                                        wlowValue = telemetryValue.warn_low;
                                        whighValue = telemetryValue.warn_high;
                                        valueType = typeof telemetryValue.value;

                                        //get colors from datastatesService
                                        var status = datastatesService.getDataColorBound(alowValue,ahighValue,
                                            dataValue,wlowValue,whighValue,valueType);
                                        
                                        $scope.contents[i].subCategoryColors.push(status.color);

                                        var subsystem = categories[j];
                                        var channel = vehicle + "." + subsystem + "." + key + "." + keyval;
                                        var timestamp = Math.round(time.today/1000);
                                        ack = "";

                                        if(status.alert === "ALARM" || status.alert === "CAUTION"){
                                            $scope.contents[i].ackStatus = false; 
                                            $scope.contents[i].tableArray.push(
                                                {
                                                    "alert" : status.alert,
                                                    "bound" : status.bound,
                                                    "vehicle" : vehicle,
                                                    "time" : time.utc,
                                                    "channel" : channel,
                                                    "ack" : ack,
                                                    "timestamp" : timestamp
                                                }
                                            );  
                                        }
                                    }   
                                }
                            }
                        }
                    }
                }
                newtablearray = newtablearray.concat($scope.contents[i].tableArray);
            }
        }

        //save alerts if any in newtablearray
        if(newtablearray.length > 0 && vehicleColors.length > 0){
            statusboardService.saveAlerts(newtablearray,vehicleColors); 
        }

        //Load alerts in the table and set sub system colors
        if($scope.contents.length > 0){
            statusboardService.setSubSystemColors($scope.contents);
            statusboardService.setAlertsTable();  
        }
    }

    $scope.addtablerow = function(veh,$index,color){
        var newArray = [];
        ack = name + " - " + callsign;
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

        statusboardService.saveAlerts(newArray,vehicleColors);
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.interval);
        }
    );
});




