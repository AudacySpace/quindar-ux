app.directive('alarmpanel',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/alarmpanel/alarmpanel.html',
    controller: 'AlarmPanelCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('AlarmPanelCtrl',function ($scope,$window,$element,$interval,dashboardService,datastatesService){  
    var telemetry = dashboardService.telemetry;
    var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var flexprop = 100;
    $scope.statusboard = $scope.widget.settings.statusboard;

    getVehicles();

    $scope.statustable = [{
        "time":" - ",
        "channel":"",
        "alert":" ",
        "bound":" ",
        "ack":" "
    },
    {
        "time":" - ",
        "channel":" ",
        "alert":" ",
        "bound":" ",
        "ack":" "
    }];


    function getVehicles(){
        var interval = $interval(function(){
            var currentMission = dashboardService.getCurrentMission();

            if(currentMission.missionName != ""){
                if($scope.widget.settings.contents.length == 0){
                    dashboardService.getConfig(currentMission.missionName)
                        .then(function(response){
                            if(response.data) {
                                var data = dashboardService.sortObject(response.data);
                                var count = 0;
                                for(var key in data) {
                                    if(data.hasOwnProperty(key)) {
                                        count = count+1;
                                        $scope.widget.settings.contents.push({
                                            "vehicle":key,
                                            "flexprop":"",
                                            "categories":Object.keys(data[key]) 
                                        }); 

                                        $scope.widget.settings.colors.push({
                                            "vehicleColor":"green",
                                            "categoryColors": []
                                        });
                                    }
                                }

                                if($scope.widget.settings.contents.length > 0){
                                    if($scope.widget.settings.contents.length === 1){
                                        $scope.widget.settings.contents.flexprop = 100;
                                    }else {    
                                        for(var i=0;i<$scope.widget.settings.contents.length;i++){
                                            $scope.widget.settings.contents[i].flexprop = flexprop/$scope.widget.settings.contents.length;
                                            for(var j=0;j<$scope.widget.settings.contents[i].categories.length;j++){
                                                $scope.widget.settings.colors[i].categoryColors[j] = "green";
                                            }
                                        }                  
                                    }   
                                }
                            } 
                        }); 
                }
                $interval.cancel(interval);
            } 
        }, 1000);  
    }
});



