app.directive('datalogsettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datalog/datalogsettings.html', 
    controller: function($scope,$window,$mdSidenav,sidebarService,dashboardService){

        checkForLogData();
        var previousValue = $scope.widget.settings.data.value;
        var previousVehicle = $scope.widget.settings.data.vehicle;


        $scope.saveDataLogSettings = function(widget){
            if($scope.data.value !== '' && $scope.data.vehicle !== ''){
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;
                $scope.widget.settings.data.value = $scope.data.value;
                $scope.widget.settings.data.vehicle = $scope.data.vehicle;
                previousValue = angular.copy($scope.widget.settings.data.value);
                previousVehicle =  angular.copy($scope.widget.settings.data.vehicle);
            }
        };

        $scope.closeDataLogSettings = function(widget){
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
            $scope.data.value = previousValue;
            $scope.data.vehicle = previousVehicle;
            $scope.widget.settings.data.value = previousValue;
            $scope.widget.settings.data.vehicle = previousVehicle;
        }

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
            if($scope.vehicleInfo.vehicle !== "" && $scope.vehicleInfo.id !== "") {
                    $scope.data.value = $scope.vehicleInfo.id;
                    $scope.data.vehicle = $scope.vehicleInfo.vehicle;
                    if ($window.innerWidth >= 1400){
                        $scope.lock.lockLeft = !$scope.lock.lockLeft;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
            } else {
                alert("Vehicle data not set. Please select from Data Menu");
            }
        }

        function checkForLogData(){
            if(!$scope.widget.settings.data){
                $scope.widget.settings.data = {
                    value: '',
                    vehicle: ''
                }; 
                $scope.data = {value:'',vehicle:''};
            }else {
                $scope.data = {
                    value:$scope.widget.settings.data.value,
                    vehicle:$scope.widget.settings.data.vehicle
                };
            }  
        }

    }
  	}; 
});
