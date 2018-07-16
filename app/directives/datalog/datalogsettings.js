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
        $scope.getValue();
        if($scope.data.id !== '' && $scope.data.vehicle !== ''){
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
            $scope.widget.settings.data = angular.copy($scope.data);
        }
        $scope.widget.settings.dataArray = [];
    };

    $scope.closeDataLogSettings = function(widget){
        $scope.lock = dashboardService.getLock();
        $scope.lock.lockLeft = false;
        dashboardService.setLeftLock($scope.lock.lockLeft);

        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.data = angular.copy($scope.widget.settings.data);
    }

    $scope.getTelemetrydata = function(){
        //findIndex
        //pass index to the method in sidebar service that will store temporary index
        //console.log("hi");
        //sidebarService.setTempWidget($scope.widget);
        sidebarService.setTempWidget($scope.widget, this);
        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = true;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
    }

    $scope.readValue = function()
    {
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.id !== "")
        {
            return data.id;
        }
        else
        {
            return "";
        }
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
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.vehicle !== "" && data.id !== ""){
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(datavalue.hasOwnProperty("value")){
                    $scope.data = angular.copy(data);
                    if ($window.innerWidth >= 1400){
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }

                }else{
                   $window.alert("Please select telemetry ID(leaf node) from Data Menu"); 
                }

            }else{
                console.log($scope.data);
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
