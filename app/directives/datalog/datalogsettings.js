app.directive('datalogsettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datalog/datalogsettings.html', 
    controller: 'DataLogSettingsCtrl',
    };
});

app.controller('DataLogSettingsCtrl', function($scope,$window,$mdSidenav,sidebarService,dashboardService){
    checkForLogData();

    var hasValue;

    $scope.saveDataLogSettings = function(widget){
        //check conditions originally in getValue over here
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.vehicle !== "" && data.id !== "" && hasValue){
            $scope.data = angular.copy(data);
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(datavalue.hasOwnProperty("value")){ //as long as data is id, continue with data implementation in data log
                    widget.main = true;
                    widget.settings.active = false;
                    widget.saveLoad = false;
                    widget.delete = false;
                    if ($window.innerWidth >= 1400) //close left sidebar
                    {
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                    $scope.widget.settings.data = angular.copy($scope.data);
                    var lastCell = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
                    $scope.widget.settings.dataArray = [lastCell];
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
        $scope.widget.settings.dataArray = [$scope.data];
        if ($window.innerWidth >= 1400) //close left sidebar
        {
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
    }

    $scope.getTelemetrydata = function(){
        sidebarService.setTempWidget($scope.widget, this); //pass widget and controller functions to sidebarService

        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = true;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
    }

    $scope.readValue = function()
    {
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.vehicle !== "" && data.id !== "")
        {
            return data.id;
        }
        else
        {
            return "";
        }
    }

    //display telemetry id chosen by the user in the input box
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

    $scope.getValue = function(isGroup){
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.vehicle !== "" && data.id !== "") //check to see if data is properly chosen
        {
            if(!isGroup) //confirm that group isn't chosen
            {
                hasValue = true;
            }
            else
            {
                hasValue = false;
            }
        }
        else
        {
            hasValue = false;
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
            $scope.widget.settings.dataArray = [$scope.widget.settings.data];
            hasValue = true;
        }  
    }
});
