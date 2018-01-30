app
.directive('linesettings', function() { 
    return { 
        restrict: 'EA', 
        templateUrl: './directives/lineplot/linesettings.html',
        controller: 'LineSettingsCtrl',
    }
}); 

app.controller('LineSettingsCtrl', 
    function($scope, $mdSidenav, $window, dashboardService, sidebarService, $interval){

        var colors = [ "#0AACCF", "#FF9100", "#64DD17", "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
        var previousSettings;

        $scope.settings = {
            vehicles : [],
            data : {
                id: '',
                vehicle: '',
                key: ''
            }
        }

        createSettingsData();

        $scope.getTelemetrydata = function(){
            //open the data menu
            if ($window.innerWidth < 1400){
                $mdSidenav('left').open();
            } else {
                $scope.lock = dashboardService.getLock();
                $scope.lock.lockLeft = !$scope.lock.lockLeft;
                dashboardService.setLeftLock($scope.lock.lockLeft);
            }
        }

        $scope.getValue = function(){
            var vehicleInfo = sidebarService.getVehicleInfo();

            for(var i=0; i<$scope.settings.vehicles.length; i++){
                if($scope.settings.vehicles[i].value === vehicleInfo.vehicle){
                    $scope.settings.vehicles[i].checked = true;
                }
                else{
                    $scope.settings.vehicles[i].checked = false;
                }
            }

            if(vehicleInfo.key !== "") {
                $scope.settings.data = angular.copy(vehicleInfo);
                if ($window.innerWidth >= 1400){
                    $scope.lock.lockLeft = !$scope.lock.lockLeft;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
            } else {
                $window.alert("Vehicle data not set. Please select from Data Menu");
            }
        }

        // Save
        $scope.saveWidget = function(widget){
            var count = 0;
            if($scope.settings.data.key) {
                if(widget.settings.data.vehicles.length != 0) {
                    widget.settings.data.vehicles = [];
                }

                widget.settings.data.value = $scope.settings.data.id;
                widget.settings.data.key = $scope.settings.data.key;
                var vehicles = $scope.settings.vehicles;

                for(var i=0; i<vehicles.length; i++){
                    if(vehicles[i].checked === true){
                        //create key to access telemetry for each vehicle
                        var key = createKey(vehicles[i].value, $scope.settings.data.key);

                        var vehicle = {
                            'name' : vehicles[i].value,
                            'color' : vehicles[i].color,
                            'key' : key
                        }
                        widget.settings.data.vehicles.push(vehicle);
                        count++;
                    }
                }

                if(count != 0){
                    widget.main = true;
                    widget.settings.active = false;
                    previousSettings = angular.copy($scope.settings);
                } else {
                    $window.alert("Please select atleast one vehicle and save!");
                }
            }
        }
                
        // Close
        $scope.closeWidget = function(widget){
            widget.main = true;
            widget.settings.active = false;
            $scope.settings = angular.copy(previousSettings);
        }

        function createSettingsData(){
            var interval = $interval(function(){
                var currentMission = dashboardService.getCurrentMission();
                if(currentMission.missionName != ""){
                    dashboardService.getConfig(currentMission.missionName)
                    .then(function(response) {
                        if(response.data) {
                            var data = dashboardService.sortObject(response.data);
                            var count = 0;
                            for(var key in data) {
                                if(data.hasOwnProperty(key)) {
                                    count = count+1;
                                    $scope.settings.vehicles.push({
                                        'key': count,
                                        'value': key,
                                        'checked': false,
                                        'color' : colors[count-1]    
                                    }); 
                                }
                            }
                                
                            if($scope.widget.settings.data.vehicles.length > 0){
                                $scope.settings.data.id = $scope.widget.settings.data.value;
                                $scope.settings.data.key = $scope.widget.settings.data.key;
                                for(var i=0; i<$scope.widget.settings.data.vehicles.length; i++){
                                        
                                    if($scope.settings.vehicles[i].value == $scope.widget.settings.data.vehicles[i].name){
                                        $scope.settings.vehicles[i].checked = true;
                                    }
                                    else{
                                        $scope.settings.vehicles[i].checked = false;
                                    }
                                }
                            }
                            previousSettings = angular.copy($scope.settings);
                        } 
                    });
                    $interval.cancel(interval);
                }
            }, 1000 );
        }

        function createKey(vehicle, key){
            var nodes = key.split('.');
            if(vehicle === nodes[0]){
                return key;
            } else {
                var partKey = nodes.slice(1);
                var newKey = vehicle + "." + partKey.join(".");
                return newKey;
            }
        }      
    }
);
