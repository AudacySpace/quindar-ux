app.directive('datalogsettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datalog/datalogsettings.html', 
    controller: 'DataLogSettingsCtrl',
    };
});

app.controller('DataLogSettingsCtrl', function($scope,$window,$mdSidenav,sidebarService,dashboardService){
    

    var hasValue;
    $scope.tempParameterSelection = new Object();
    $scope.inputFieldStyles = {};
    $scope.parametersErrMsg = "";

    checkForLogData();

    $scope.saveDataLogSettings = function(widget){
        $scope.parametersErrMsg = "";
        $scope.inputFieldStyles = {};
        //check conditions originally in getValue over here
        //var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        var data = angular.copy($scope.tempParameterSelection);
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
                        $scope.lock = dashboardService.getLock();
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                    $scope.widget.settings.data = angular.copy($scope.data);
                    var lastCell = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
                    $scope.widget.settings.dataArray = [lastCell];
                    $scope.parametersErrMsg = "";
                    $scope.inputFieldStyles = {};
                }else{
                    $scope.parametersErrMsg = "Selected parameter has no data!";
                    $scope.inputFieldStyles = {'border-color':'#dd2c00'};
                }

            }else{
                $scope.data = angular.copy(data);
                $scope.parametersErrMsg = "Currently there is no data available for this parameter.";
                $scope.inputFieldStyles = {'border-color':'#dd2c00'};
            }
        }else {
            $scope.parametersErrMsg = "Please fill out this field.";
            $scope.inputFieldStyles = {'border-color':'#dd2c00'};
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
        $scope.tempParameterSelection = angular.copy($scope.widget.settings.data);
        if ($window.innerWidth >= 1400) //close left sidebar
        {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        $scope.inputFieldStyles = {};
        $scope.parametersErrMsg = "";
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
        sidebarService.setOpenLogo(false); //set to false if data menu opened through this Qwidget
    }

    //display telemetry id chosen by the user in the input box
    $scope.readValue = function()
    {
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.id !== "" && $scope.tempParameterSelection)
        {
            return $scope.tempParameterSelection.id;
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
                $scope.tempParameterSelection = angular.copy(data);
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
            $scope.tempParameterSelection = angular.copy($scope.data);
        }else {
            $scope.data = angular.copy($scope.widget.settings.data);
            $scope.widget.settings.dataArray = [$scope.widget.settings.data];
            $scope.tempParameterSelection = angular.copy($scope.widget.settings.data);
            hasValue = true;
        }  
    }
});
