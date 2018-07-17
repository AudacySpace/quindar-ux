app.directive('datalogsettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datalog/datalogsettings.html', 
    controller: 'DataLogSettingsCtrl',
    };
});

app.controller('DataLogSettingsCtrl', function($scope,$window,$mdSidenav,sidebarService,dashboardService){
    checkForLogData();

    $scope.saveDataLogSettings = function(widget){
        if($scope.data.id !== '' && $scope.data.vehicle !== ''){
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
            $scope.widget.settings.data = angular.copy($scope.data);
        }
    };

    $scope.closeDataLogSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.data = angular.copy($scope.widget.settings.data);
    }

    $scope.getTelemetrydata = function(){
        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = !$scope.lock.lockLeft;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
    }

    // $scope.getValue = function(){
    //     var vehicleInfo = sidebarService.getVehicleInfo();
    //     if(vehicleInfo.vehicle !== "" && vehicleInfo.id !== "") {
    //         $scope.data = angular.copy(vehicleInfo);
    //         if ($window.innerWidth >= 1400){
    //             $scope.lock.lockLeft = !$scope.lock.lockLeft;
    //             dashboardService.setLeftLock($scope.lock.lockLeft);
    //         }
    //     } else {
    //         $window.alert("Vehicle data not set. Please select from Data Menu");
    //     }
    // }

    $scope.getValue = function(){
        var vehicleInfo = sidebarService.getVehicleInfo();
        var data = vehicleInfo.parameters[vehicleInfo.parameters.length - 1];
        if(data && data.vehicle !== "" && data.id !== ""){
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(datavalue.hasOwnProperty("value")){
                    $scope.data = angular.copy(data);
                    if ($window.innerWidth >= 1400){
                        $scope.lock.lockLeft = !$scope.lock.lockLeft;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }

                }else{
                   $window.alert("Please select telemetry ID(leaf node) from Data Menu"); 
                }

            }else{
                $scope.data = angular.copy(data);
                $window.alert("Currently there is no data available for this telemetry id.");
            }
        }else {
            $window.alert("Vehicle data not set. Please select from Data Menu");
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
});
