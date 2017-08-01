app
.directive('linesettings', function() { 
    return { 
        restrict: 'EA', 
        templateUrl: './directives/lineplot/linesettings.html',
        controller: 'LineSettingsCtrl',
    }
}); 

app.controller('LineSettingsCtrl', 
    function($scope, $mdSidenav, $window, dashboardService, sidebarService){

        var colors = [ "#0AACCF", "#FF9100", "#64DD17", "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
        createSettingsData();
        var previousSettings;

        $scope.getTelemetrydata = function(){

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

            for(var i=0; i<$scope.widget.settings.contents.vehicles.length; i++){
                if($scope.widget.settings.contents.vehicles[i].value === vehicleInfo.vehicle){
                    $scope.widget.settings.contents.vehicles[i].checked = true;
                }
                else{
                    $scope.widget.settings.contents.vehicles[i].checked = false;
                }
            }

            if(vehicleInfo.key !== "") {
                $scope.widget.settings.contents.value = vehicleInfo.id;
                $scope.widget.settings.data.key = vehicleInfo.key;
                if ($window.innerWidth >= 1400){
                    $scope.lock.lockLeft = !$scope.lock.lockLeft;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
            } else {
                alert("Vehicle data not set. Please select from Data Menu");
            }
        }

        // Save
        $scope.saveWidget = function(widget){
            var count = 0;
            if(widget.settings.contents.value) {
                if(widget.settings.data.vehicles.length != 0) {
                    widget.settings.data.vehicles = [];
                }

                widget.settings.data.value = widget.settings.contents.value;
                var vehicles = widget.settings.contents.vehicles;

                for(var i=0; i<vehicles.length; i++){
                    if(vehicles[i].checked === true){
                        //create key to access telemetry for each vehicle
                        var key = createKey(vehicles[i].value, widget.settings.data.key);

                        var vehicle = {
                            'name' : vehicles[i].value,
                            'color' : vehicles[i].color,
                            'data' : [],
                            'key' : key
                        }
                        widget.settings.data.vehicles.push(vehicle);
                        count++;
                    }
                }

                if(count != 0){
                    widget.main = true;
                    widget.settings.active = false;
                    previousSettings = angular.copy(widget.settings.contents);
                } else {
                    alert("Please select atleast one vehicle and save!");
                }
            }
        }
                
        // Close
        $scope.closeWidget = function(widget){
            widget.main = true;
            widget.settings.active = false;
            $scope.widget.settings.contents = angular.copy(previousSettings);
        }

        function createSettingsData(){
            if($scope.widget.settings.contents.vehicles.length == 0){
                sidebarService.getConfig()
                .then(function(response) {
                    if(response.data) {
                        var data = dashboardService.sortObject(response.data);
                        var count = 0;
                        for(var key in data) {
                            if(data.hasOwnProperty(key)) {
                                count = count+1;
                                $scope.widget.settings.contents.vehicles.push(
                                {
                                    'key': count,
                                    'value': key,
                                    'checked': false,
                                    'color' : colors[count-1]    
                                }); 
                            }
                        }
                        previousSettings = angular.copy($scope.widget.settings.contents);
                    } 
                });

                $scope.widget.settings.data = {
                    value : "",
                    vehicles : [],
                    key : ""
                };
            } else {
                for(var i=0; i<$scope.widget.settings.data.vehicles.length; i++){
                    $scope.widget.settings.data.vehicles[i].data = [];
                }
                previousSettings = angular.copy($scope.widget.settings.contents);
            }
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
