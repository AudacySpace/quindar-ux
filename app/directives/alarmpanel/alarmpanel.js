app.directive('alarmpanel',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/alarmpanel/alarmpanel.html',
    controller: 'AlarmPanelCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('AlarmPanelCtrl',['$scope', '$interval', 'dashboardService', 'datastatesService', 'userService','statusboardService', function ($scope,$interval,dashboardService,datastatesService,userService,statusboardService){ 
    
    $scope.telemetry = dashboardService.telemetry;
    var flexprop = 100;
    $scope.alarmpanel = statusboardService.getStatusTable();//status board current alerts;
    var time, ack = "";
    $scope.name = userService.getUserName();
    $scope.role = userService.userRole;
    $scope.contents = [];
    $scope.masteralarmstatus = statusboardService.getMasterAlarmColors();
    $scope.class = []; // for glowing effect

    $scope.vehicleColors = []; //contains all the vehicles to be displayed for the mission
    
    getVehicles();

    //Function to display master alarm and its sub systems
    function getVehicles(){
        $scope.configInterval = $interval(function(){
            var telemetry = dashboardService.telemetry;

            if(!dashboardService.isEmpty(telemetry)){
                var data = dashboardService.sortObject(telemetry.data);
                for(var key in data) {
                    if(data.hasOwnProperty(key)) {
                        //check if the platform exists in the contents
                        var index = $scope.contents.findIndex(content => content.vehicle === key);

                        //add in contents if not exists
                        if(index == -1){
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

                            $scope.vehicleColors.push({"vehicle":key,"status":false});
                        } else { //update categories if vehicle exists in contents
                            $scope.contents[index].categories = Object.keys(data[key])
                        }
                    }
                }

                if($scope.contents.length > 0){
                    for(var i=0;i<$scope.contents.length;i++){
                        $scope.contents[i].flexprop = flexprop/$scope.contents.length;
                    }
                }
            } 
        }, 1000);  
    }

    //Function to get colors of each telemetry data item of each vehicle's sub category
    $scope.updateColors = function(){
        var alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType;
        var newtablearray = [];

        time = dashboardService.getTime('UTC');

        for(var i=0;i<$scope.contents.length;i++){
            $scope.contents[i].tableArray = [];
            $scope.contents[i].subCategoryColors = [];
            if($scope.contents[i].vehicle && dashboardService.isEmpty($scope.telemetry) === false){
                var vehicle = $scope.contents[i].vehicle;
                if($scope.contents[i].categories.length > 0){
                    var categories = $scope.contents[i].categories;
                    for(var j=0;j<categories.length;j++){
                        for(var key in $scope.telemetry[vehicle][categories[j]]){
                            if($scope.telemetry[vehicle][categories[j]].hasOwnProperty(key)) {
                                for(var keyval in $scope.telemetry[vehicle][categories[j]][key] ){
                                    if($scope.telemetry[vehicle][categories[j]][key].hasOwnProperty(keyval)){
                                        var telemetryValue = $scope.telemetry[vehicle][categories[j]][key][keyval];
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
            $scope.vehicleColors[i].status = false;
        }

        //save alerts if any in newtablearray
        if(newtablearray.length > 0 && $scope.vehicleColors.length > 0){
            statusboardService.saveAlerts(newtablearray,$scope.vehicleColors); 
        }

        //Load alerts in the table and set sub system colors
        if($scope.contents.length > 0){
            statusboardService.setSubSystemColors($scope.contents);
            statusboardService.setAlertsTable();  
        }
    }

    $scope.addtablerow = function(veh,$index,color){
        var newArray = [];
        ack = $scope.name + " - " + $scope.role.cRole.callsign;
        var len = $scope.contents[$index].tableArray.length;

        if(color.background === "#FF0000" || color.background === "#FFFF00"){
            $scope.contents[$index].ackStatus = true;
            $scope.class[$index] = "buttonNone"; 
        }

        for(var k=0;k<$scope.contents.length;k++){
            if(k === $index){
                $scope.vehicleColors[k].status = true;
            }
        }

        for(var i=0;i<len;i++){
            $scope.contents[$index].tableArray[i].ack = ack;
            newArray.push($scope.contents[$index].tableArray[i]); 
        }

        statusboardService.saveAlerts(newArray,$scope.vehicleColors);
    }

    $scope.interval = $interval($scope.updateColors, 1000, 0, false); 

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.interval);
            $interval.cancel($scope.configInterval);
        }
    );
}]);




