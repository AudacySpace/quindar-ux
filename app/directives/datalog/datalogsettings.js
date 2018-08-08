app.directive('datalogsettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datalog/datalogsettings.html', 
    controller: 'DataLogSettingsCtrl',
    };
});

app.controller('DataLogSettingsCtrl', function($scope,$window,$mdSidenav,sidebarService,dashboardService,$element){
    checkForLogData();

    var hasValue;

    //For Laptop Screens
    var temp1 = $element[0].getElementsByTagName("div")[0];
    var temp2 = temp1.getElementsByTagName("div")[0];
    var temp3 = temp2.getElementsByTagName("div")[0];
    var temp4 = temp3.getElementsByTagName("div")[1];
    var temp5 = temp4.getElementsByTagName("div")[3];
    var elScreen1 = temp5.getElementsByTagName("div")[0];

    //For Tablet Screens
    var temptablet1 = $element[0].getElementsByTagName("div")[0];
    var temptablet2 = temptablet1.nextSibling;
    var temptablet3 = temptablet2.nextSibling;
    var temptablet4 = temptablet3.nextSibling;
    var temptablet5 = temptablet4.nextSibling;
    var temptablet6 = temptablet5.nextSibling;
    var temptablet7 = temptablet6.nextSibling;
    var temptablet8 = temptablet7.nextSibling;
    var temptablet9 = temptablet8.nextSibling;
    var temptablet10 = temptablet9.getElementsByTagName("div")[0];
    var temptablet11 = temptablet10.lastElementChild;
    var temptablet12 = temptablet11.getElementsByTagName("div")[0];
    var elScreen2 = temptablet12.getElementsByTagName("div")[0];

    //For Mobile Screens
    var tempmbl1 = $element[0].getElementsByTagName("div")[0];
    var tempmbl2 = tempmbl1.nextSibling;
    var tempmbl3 = tempmbl2.nextSibling;
    var tempmbl4 = tempmbl3.nextSibling;
    var tempmbl5 = tempmbl4.nextSibling;
    var elScreen3 = tempmbl5.getElementsByTagName("div")[0];

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
                        $scope.lock = dashboardService.getLock();
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                    $scope.widget.settings.data = angular.copy($scope.data);
                    var lastCell = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
                    $scope.widget.settings.dataArray = [lastCell];
                }else{
                    //$window.alert("Please select telemetry ID(leaf node) from Data Menu."); 
                    if($window.innerWidth > 1023){
                        var position = "top left";
                        var queryId = elScreen1;
                        var delay = false;
                        var usermessage = "Please select telemetry ID(leaf node) from Data Menu.";
                        var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
                    }else if($window.innerWidth < 640){
                        var position = "top left";
                        var queryId = elScreen3;
                        var delay = false;
                        var usermessage = "Please select telemetry ID(leaf node) from Data Menu.";
                        var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
                    }else if($window.innerWidth > 640 && $window.innerWidth <= 1023){
                        var position = "top left";
                        var queryId = elScreen2;
                        var delay = false;
                        var usermessage = "Please select telemetry ID(leaf node) from Data Menu.";
                        var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
                    }
                }
            }else{
                $scope.data = angular.copy(data);
                // $window.alert("Currently there is no data available for this telemetry id.");
                if($window.innerWidth > 1023){
                    var position = "top left";
                    var queryId = elScreen1;
                    var delay = false;
                    var usermessage = "Currently there is no data available for this telemetry id.";
                    var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
                }else if($window.innerWidth < 640){
                    var position = "top left";
                    var queryId = elScreen3;
                    var delay = false;
                    var usermessage = "Currently there is no data available for this telemetry id.";
                    var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
                }else if($window.innerWidth > 640 && $window.innerWidth <=1023){
                    var position = "top left";
                    var queryId = elScreen2;
                    var delay = false;
                    var usermessage = "Currently there is no data available for this telemetry id.";
                    var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
                }
            }
        }else {
            //$window.alert("Vehicle data not set. Please select from Data Menu");
            if($window.innerWidth > 1023){
                var position = "top left";
                var queryId = elScreen1;
                var delay = false;
                var usermessage = "Vehicle data not set. Please select from Data Menu.";
                var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
            }else if($window.innerWidth < 640){
                var position = "top left";
                var queryId = elScreen3;
                var delay = false;
                var usermessage = "Vehicle data not set. Please select from Data Menu.";
                var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
            }else if($window.innerWidth > 640 && $window.innerWidth <= 1023){
                var position = "top left";
                var queryId = elScreen2;
                var delay = false;
                var usermessage = "Vehicle data not set. Please select from Data Menu.";
                var alertstatus = dashboardService.displayWidgetAlert(usermessage,position,queryId,delay); 
            }
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
            $scope.lock = dashboardService.getLock();
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
        sidebarService.setOpenLogo(false); //set to false if data menu opened through this Qwidget
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
