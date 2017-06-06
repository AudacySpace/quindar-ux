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
        $scope.checkedVehicles = [
                {
                    'key': 1,
                    'value': 'Audacy1',
                    'checked': false,
                    'color' : '#0AACCF'
                }, 
                {
                    'key': 2,
                    'value': 'Audacy2',
                    'checked': true,
                    'color' : '#FF9100'
                }, 
                {
                    'key': 3,
                    'value': 'Audacy3',
                    'checked': false,
                    'color' : '#64DD17'
                }
        ];

        $scope.widget.settings.data = {
            value : "",
            vehicles : []
        };

        $scope.data = {
            value : ""
        };

        var previousValue = $scope.data.value;
        var previousVehicles = angular.copy($scope.checkedVehicles);

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
            $scope.vehicleInfo = sidebarService.getVehicleInfo();

            for(var i=0; i<$scope.checkedVehicles.length; i++){
                if($scope.checkedVehicles[i].value === $scope.vehicleInfo.vehicle){
                    $scope.checkedVehicles[i].checked = true;
                }
                else{
                    $scope.checkedVehicles[i].checked = false;
                }
            }

            if($scope.vehicleInfo.vehicle !== "" && $scope.vehicleInfo.id !== "") {
                if($scope.vehicleInfo.id !== "timestamp"){
                    $scope.data.value = $scope.vehicleInfo.id;
                    if ($window.innerWidth >= 1400){
                        $scope.lock.lockLeft = !$scope.lock.lockLeft;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
                else{
                    alert("Please select data value other than timestamp!");
                }
            } else {
                alert("Vehicle data not set. Please select from Data Menu");
            }
        }

        // Save
        $scope.saveWidget = function(widget){
            var count = 0;
            if($scope.data.value) {
                if(widget.settings.data.vehicles.length != 0) {
                    widget.settings.data.vehicles = [];
                }

                widget.settings.data.value = $scope.data.value;

                for(var i=0; i<$scope.checkedVehicles.length; i++){
                    if($scope.checkedVehicles[i].checked === true){
                        var vehicle = {
                            'name' : $scope.checkedVehicles[i].value,
                            'color' : $scope.checkedVehicles[i].color,
                            'data' : []
                        }
                        widget.settings.data.vehicles.push(vehicle);
                        count++;
                    }
                }

                if(count != 0){
                    widget.main = true;
                    widget.settings.active = false;
                    previousVehicles = angular.copy($scope.checkedVehicles);
                    previousValue = $scope.data.value;
                } else {
                    alert("Please select atleast one vehicle and save!");
                }
            }
        }
                
        // Close
        $scope.closeWidget = function(widget){
            widget.main = true;
            widget.settings.active = false;
            $scope.data.value = previousValue;
            $scope.checkedVehicles = previousVehicles;
        }
        
    }
);