app.directive('datalogsettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datalog/datalogsettings.html', 
    controller: function($scope,$window,$mdSidenav,sidebarService,dashboardService){

        checkForLogData();
        var previousValue = $scope.data;

        $scope.saveDataLogSettings = function(widget){
            if($scope.data.id !== '' && $scope.data.vehicle !== ''){
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;
                $scope.widget.settings.data = angular.copy($scope.data);
                previousValue = angular.copy($scope.data);
            }
        };

        $scope.closeDataLogSettings = function(widget){
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
            $scope.data = angular.copy(previousValue);
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
            var vehicleInfo = sidebarService.getVehicleInfo();
            if(vehicleInfo.vehicle !== "" && vehicleInfo.id !== "") {
                $scope.data = angular.copy(vehicleInfo);
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
                $scope.data = {
                    id: '',
                    vehicle: '',
                    key: ''
                };
            }else {
                $scope.data = angular.copy($scope.widget.settings.data);
            }  
        }

    }
  	}; 
});
