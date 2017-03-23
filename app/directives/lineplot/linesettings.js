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
    	
    	// Table		
    	$scope.table = {"rows":{
                        "data":[
                                    [
                                        {   
                                            "value":"",
                                            "checked":"true",
                                            "style":"text-align:left",
                                            "colshow":"true"
                                        },
                                        {   
                                            "value":"",
                                            "checked":"true",
                                            "style":"text-align:left",
                                            "colshow":"true"
                                        }
                                    ]
                                ]
                            }
                        }

        var previous = angular.copy($scope.table.rows.data);

        $scope.getTelemetrydata = function($event,$index){
            var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
            arrow.style.color = "#07D1EA";

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
            var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
            previous = angular.copy($scope.table.rows.data);
            
            if($scope.vehicle.vehicle !== "" && $scope.vehicle.id !== "") {
                if(telemetry !== null) {
                    $scope.table.rows.data[$index][0].value = $scope.vehicle.id;
                    $scope.table.rows.data[$index][1].value = telemetry[$scope.vehicle.vehicle][$scope.vehicle.id].name;
                } else {
                    alert("Telemetry data not available");
                }
                arrow.style.color = "#b3b3b3";
                if ($window.innerWidth >= 1400){
                    $scope.lock.lockLeft = !$scope.lock.lockLeft;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
            } else {
                arrow.style.color = "#07D1EA";
                alert("Vehicle data not set. Please select from Data Menu");
            }
        }
        
        $scope.addRowAbove = function($index){
            $scope.table.rows.data.splice($index,0,[{"value":"","checked":"true","style":"text-align:left","colshow":"true"},{"value":"","checked":"true","style":"text-align:left","colshow":"true"},{"value":"","checked":"true","style":"text-align:right","colshow":"true"}]);
        }

        $scope.addRowBelow = function($index){
            $scope.table.rows.data.splice($index+1,0,[{"value":"","checked":"true","style":"text-align:left","colshow":"true"},{"value":"","checked":"true","style":"text-align:left","colshow":"true"},{"value":"","checked":"true","style":"text-align:right","colshow":"true"}]);
        }

        $scope.deleteRow = function($index){
            $scope.table.rows.data.splice($index, 1);
        }

        $scope.moveRowUp = function($index){
            $scope.table.rows.data[$index-1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index-1])[0];
        }

        $scope.moveRowDown = function($index){
            $scope.table.rows.data[$index+1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index+1])[0];
        }

        $scope.convertHeader = function($index){
            $scope.table.rows.data[$index] = [{"value":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit"}];
        } 

        $scope.convertToReadonly = function($index){
            $scope.table.rows.data[$index]["checked"] = "true";
        }
        // End of Table
        
        // Close
        $scope.closeWidget = function(widget){
            widget.main = true;
            widget.settings.active = false;
            $scope.table.rows.data = previous;
        }
        
        // Save
        $scope.saveWidget = function(widget){
            widget.vehicle_name = $scope.vehicle.vehicle;
            widget.vehicle_id = $scope.vehicle.id;
            widget.main = true;
            widget.settings.active = false;
            previous = angular.copy($scope.table.rows.data);
        }
    }
]);