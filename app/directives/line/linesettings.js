app
.directive('linesettings', function() { 
    return { 
        restrict: 'EA', 
        templateUrl: './directives/line/linesettings.html',
        controller: 'LineSettingsCtrl',
    }
}); 

app.controller('LineSettingsCtrl', 
    function($scope, $mdSidenav, $window, dashboardService, sidebarService, $interval){

        var colors = [ "#0AACCF", "#FF9100", "#64DD17", "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
        $scope.previousSettings;
        $scope.interval;
        var hasValue;

        $scope.settings = {
            vehicles : [],
            data : {
                id: '',
                vehicle: '',
                key: ''
            }
        }

        $scope.tempParameterSelection = new Object();
        $scope.inputFieldStyles = {};
        $scope.parametersErrMsg = "";
        $scope.vehicleMsg = "";

        $scope.getTelemetrydata = function(){
            //open the data menu
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
            if(data && data.id !== "" && $scope.tempParameterSelection){
                return $scope.tempParameterSelection.id;
            }else{
               return "";
            }
        }
    
        $scope.getValue = function(isGroup){
            var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]; // get the last selected id from the data menu
            if(data && data.key !== "" && !isGroup) //check to see if data is properly chosen and whether or not it is a group
            {
                for(var i=0; i<$scope.settings.vehicles.length; i++){
                    if($scope.settings.vehicles[i].value === data.vehicle){
                        $scope.settings.vehicles[i].checked = true;
                        $scope.tempParameterSelection = angular.copy(data);
                    }
                    else{
                        $scope.settings.vehicles[i].checked = false;
                    }
                }
                hasValue = true;
            }else{
                hasValue = false;
            }
        }

        // Save
        $scope.saveWidget = function(widget){
            $scope.vehicleMsg = "";
            $scope.parametersErrMsg = "";
            //check conditions originally in getValue over here
           // var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
            var data = angular.copy($scope.tempParameterSelection);
            if(data && data.key !== "" && hasValue){
                $scope.settings.data = angular.copy(data);
                var datavalue = dashboardService.getData(data.key);
                if(datavalue){
                    if(datavalue.hasOwnProperty("value")){
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

                            if ($window.innerWidth >= 1400)
                            {
                                $scope.lock = dashboardService.getLock();
                                $scope.lock.lockLeft = false;
                                dashboardService.setLeftLock($scope.lock.lockLeft);
                            }

                            if(count != 0){ //as long as data and vehicles are selected, continue with data implementation in line plot
                                widget.main = true;
                                widget.settings.active = false;
                                $scope.previousSettings = angular.copy($scope.settings);
                                var lastCell = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
                                $scope.widget.settings.dataArray = [lastCell];
                                $scope.inputFieldStyles = {};
                            } else {
                                $scope.vehicleMsg = "Please choose the vehicle.";
                            }
                        }
                    } else {
                        $scope.parametersErrMsg = "Selected parameter has no data!";
                        $scope.inputFieldStyles = {'border-color':'#dd2c00'};
                    }
                }else {
                    //when no telemetry value available for the telemetry id,set the value in the input but also alert the user.
                    $scope.settings.data = angular.copy(data);
                    $scope.parametersErrMsg = "Currently there is no data available for this parameter.";
                    $scope.inputFieldStyles = {'border-color':'#dd2c00'};
                }
            }else { 
                $scope.parametersErrMsg = "Please fill out this field.";
                $scope.inputFieldStyles = {'border-color':'#dd2c00'};
            }
        }
                
        // Close
        $scope.closeWidget = function(widget){
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
            
            widget.main = true;
            widget.settings.active = false;
            $scope.settings = angular.copy($scope.previousSettings);
            $scope.widget.settings.dataArray = [angular.copy($scope.settings.data)];
            $scope.tempParameterSelection = angular.copy($scope.settings.data);
            if ($window.innerWidth >= 1400)
            {
                $scope.lock = dashboardService.getLock();
                $scope.lock.lockLeft = false;
                dashboardService.setLeftLock($scope.lock.lockLeft);
            }

            $scope.parametersErrMsg = "";
            $scope.vehicleMsg = "";
            $scope.inputFieldStyles = {};
        }

        $scope.createVehicleData = function(callback){
            if(!$scope.interval){
                //start an interval only if its not running
                $scope.interval = $interval(function(){
                    var telemetry = dashboardService.telemetry;

                    if(!dashboardService.isEmpty(telemetry)){
                        var data = dashboardService.sortObject(telemetry.data);
                        var count = $scope.settings.vehicles.length;
                        var flag = false; //true if the vehicle name is present in scope settings

                        //Keys in the data variable are the platforms/vehicles available for the mission
                        for(var key in data) {
                            if(data.hasOwnProperty(key)) {
                                for(var i=0; i<$scope.settings.vehicles.length; i++){
                                    if(key == $scope.settings.vehicles[i].value){
                                        flag = true;
                                        break;
                                    }
                                }

                                if(!flag || ($scope.settings.vehicles.length == 0)){
                                    count = count+1;
                                    $scope.settings.vehicles.push({
                                        'key': count,
                                        'value': key,
                                        'checked': false,
                                        'color' : colors[count-1]    
                                    }); 
                                }
                                //reset flag to false for the next vehicle
                                flag = false;
                            }
                        }

                        $interval.cancel($scope.interval);
                        $scope.interval = null;

                        if(callback){
                            callback(true);
                        }
                    }
                }, 1000 );
            }
        }

        function createSettingsData(){
            $scope.createVehicleData(function(result){
                if(result){
                    //Get back the settings saved when page is refreshed
                    if($scope.widget.settings.data.vehicles.length > 0){
                        $scope.settings.data.id = $scope.widget.settings.data.value;
                        $scope.settings.data.key = $scope.widget.settings.data.key;
                        for(var i=0; i<$scope.settings.vehicles.length; i++){
                            for(var j=0; j<$scope.widget.settings.data.vehicles.length; j++){
                                if($scope.settings.vehicles[i].value == $scope.widget.settings.data.vehicles[j].name){
                                    $scope.settings.vehicles[i].checked = true;
                                    $scope.settings.vehicles[i].color = $scope.widget.settings.data.vehicles[j].color;
                                }
                            }
                        }
                    }
                    $scope.previousSettings = angular.copy($scope.settings);
                    $scope.tempParameterSelection = angular.copy($scope.settings.data);
                    $scope.widget.settings.dataArray = [angular.copy($scope.settings.data)];
                    hasValue = true;
                }
            });
        }

        //create settings data for vehicles in the mission
        createSettingsData();

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

        $scope.$on("$destroy",
            function(event) {
                $interval.cancel($scope.interval);
            }
        );
    }
);
