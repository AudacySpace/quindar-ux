app.directive('groundtracksettings', function() { 
  	return { 
    	restrict: 'EA', 
		templateUrl:'./directives/groundtrack/groundtracksettings.html',
		controller: 'GroundSettingsCtrl'
    }
});

app.controller('GroundSettingsCtrl', function($scope, dashboardService, $interval) {
    var colors = [ "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
    var previousSettings;
    $scope.settings = new Array();

    createVehicles();
            
    $scope.closeWidget = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.settings = angular.copy(previousSettings);
    }

    $scope.saveWidget = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;

        //reset the vehicle settings
        $scope.widget.settings.vehicles = [];

        for(var i=0; i<$scope.settings.length; i++){
            try{
                var vehicle = {
                    "name" : $scope.settings[i][1].value,
                    "dataStatus" : $scope.settings[i][2].status,
                    "orbitStatus" : $scope.settings[i][3].status,
                    "iconStatus" : $scope.settings[i][4].status,
                    "color": colors[i]
                }
                $scope.widget.settings.vehicles.push(vehicle);
            }
            catch(e){
                console.log(e instanceof TypeError);
            }
        }

        previousSettings = angular.copy($scope.settings);
    }

    function createVehicles(){
        var interval = $interval(function(){
            var currentMission = dashboardService.getCurrentMission();
            if(currentMission.missionName != ""){
                dashboardService.getConfig(currentMission.missionName)
                .then(function(response){
                    if(response.data) {
                        var data = dashboardService.sortObject(response.data);
                        var count = 0;
                        for(var key in data) {
                            if(data.hasOwnProperty(key)) {
                                count = count+1;
                                var dataStatus = true;
                                var orbitStatus = true;
                                var iconStatus = true;

                                // if widget settings exist, set settings using those values
                                if($scope.widget.settings.vehicles.length > 0){
                                    for(var i=0; i<$scope.widget.settings.vehicles.length; i++){    
                                        if(key == $scope.widget.settings.vehicles[i].name){
                                            dataStatus = $scope.widget.settings.vehicles[i].dataStatus;
                                            orbitStatus = $scope.widget.settings.vehicles[i].orbitStatus;
                                            iconStatus = $scope.widget.settings.vehicles[i].iconStatus;
                                        }
                                    }
                                }

                                $scope.settings.push([
                                {   
                                    "value": count,
                                    "style":"text-align:left;background-color:#fff;color:#000;font-size:13px;margin-left:2px",
                                    "active": "false",
                                    "cstyle":"background-color:#fff;text-align:left;color:#000;font-size:9px",
                                    "status": false
                                },
                                {   
                                    "value": key,
                                    "style":"text-align:left;background-color:#fff;color:#000;font-size:13px",
                                    "active": "false",
                                    "cstyle":"background-color:#fff;text-align:left;color:#000;font-size:9px",
                                    "status": false
                                },
                                {   
                                    "value":"",
                                    "style":"text-align:left;background-color:#fff;color:#000;margin-top:0px",
                                    "active": "true",
                                    "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                    "status": dataStatus
                                },
                                {   
                                    "value":"",
                                    "style":"text-align:left;background-color:#fff;color:#000",
                                    "active": "true",
                                    "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                    "status": orbitStatus
                                },
                                {   
                                    "value":"",
                                    "style":"text-align:left;background-color:#fff;color:#000",
                                    "active": "true",
                                    "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                    "status": iconStatus
                                }
                                ]);
                            }
                        }
                        previousSettings = angular.copy($scope.settings);
                    }
                });  
                $interval.cancel(interval);
            }
        }, 1000);
    }
});