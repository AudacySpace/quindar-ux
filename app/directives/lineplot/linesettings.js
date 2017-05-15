app
.directive('linesettings', function() { 
    return { 
        restrict: 'EA', 
        templateUrl: './directives/lineplot/linesettings.html',
        link: function(scope, element, attributes) {
        }
    }
}); 

app.controller('lineController', 
    ['$scope', 'd3Service','$mdSidenav','$window','dashboardService','sidebarService', 
    function($scope, d3, $mdSidenav, $window, dashboardService, sidebarService){
	
    	var telemetry = dashboardService.telemetry;
        $scope.datainput = "";
        $scope.colors = $scope.widget.settings.colors;
        $scope.checkedValues = $scope.widget.settings.checkedValues;
        $scope.satvehicles = $scope.widget.settings.satvehicles;
        var vehicles = [];
        var prevColors = angular.copy($scope.colors);
        var prevCheckedValues = angular.copy($scope.checkedValues);

        $scope.getTelemetrydata = function($event,$index){

            if ($window.innerWidth < 1400){
                $mdSidenav('left').open();
            } else {
                $scope.lock = dashboardService.getLock();
                $scope.lock.lockLeft = !$scope.lock.lockLeft;
                dashboardService.setLeftLock($scope.lock.lockLeft);
            }
        }

        $scope.getValue = function($event,$index){

            $scope.vehicle = sidebarService.getVehicleInfo();

            for(var i=0;i<$scope.checkedValues.length;i++){

                if($scope.satvehicles[i].value === $scope.vehicle.vehicle){
                    $scope.widget.settings.checkedValues[i] =true;
                }
                else{
                    $scope.widget.settings.checkedValues[i] =false;
                }
            }
            if($scope.vehicle.vehicle !== "" && $scope.vehicle.id !== "") {
                if(telemetry !== null) {
                    if($scope.vehicle.id !== "timestamp"){
                    $scope.datainput = $scope.vehicle.id;
                    }
                    else{
                        alert("Please select another data value other than timestamp!");
                    }
                } else {
                    alert("Telemetry data not available");
                }
                if ($window.innerWidth >= 1400){
                    $scope.lock.lockLeft = !$scope.lock.lockLeft;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
            } else {
                alert("Vehicle data not set. Please select from Data Menu");
            }
        }
                
        // Close
        $scope.closeWidget = function(widget){
            widget.main = true;
            widget.settings.active = false;
            $scope.colors = prevColors;
            $scope.checkedValues = prevCheckedValues
        }
        
        // Save
        $scope.saveWidget = function(widget){
            if($scope.datainput !== ""){
                if($scope.widget.settings.pausestatus !== false){

                    while(widget.settings.vehicles.length > 0){
                        widget.settings.vehicles.pop();
                    }

                    while(widget.settings.linecolors.length > 0){
                        widget.settings.linecolors.pop();
                    }

                    widget.main = true;
                    widget.settings.active = false;
                    widget.settings.datainput = $scope.datainput;
                    widget.settings.checkedValues = $scope.checkedValues;
                    for(var i=0;i<widget.settings.checkedValues.length;i++){
                        if(widget.settings.checkedValues[i] === true){
                            widget.settings.vehicles.push( $scope.satvehicles[i].value);
                            widget.settings.linecolors.push($scope.colors[i]);
                        }
                    }
                    if(widget.settings.vehicles.length !== 0){
                        for (j=0; j< widget.settings.vehicles.length;j++) {
                            widget.settings.plotData[j] = [[0,0]];
                            widget.settings.plotData[j].pop();  
                        }; 
                        prevColors = angular.copy($scope.colors);
                        prevCheckedValues = angular.copy($scope.checkedValues);
                    }else {
                        alert("Please select atleast one vehicle and save!");
                            widget.main = false;
                            widget.settings.active = true;
                            $scope.colors = prevColors;
                            $scope.checkedValues = prevCheckedValues;
                    }
                }else{
                    alert("Please pause the data before you save!");
                    widget.main = true;
                    widget.settings.active = false;
                    $scope.colors = prevColors;
                    $scope.checkedValues = prevCheckedValues;
                }
            }else{
                alert("Please select data!");
                widget.main = false;
                widget.settings.active = true;
                $scope.colors = prevColors;
                $scope.checkedValues = prevCheckedValues;
            }
        }
    }
]);