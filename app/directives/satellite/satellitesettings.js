app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: function($scope, sidebarService, dashboardService){

        	$scope.vehicles = [];
        	createVehicles();

			$scope.closeSettings = function(widget){
				widget.main = true;
				widget.settings.active = false;
				widget.saveLoad = false;
				widget.delete = false;
			}

			$scope.saveSettings = function(widget){
				if($scope.selected.vehicle){
					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete = false;
					widget.settings.vehicle = $scope.selected.vehicle.value;
				}
			}

			$scope.selected = {};
			$scope.isLoaded = false;

			function createVehicles(){
				sidebarService.getConfig()
		        .then(function(response) {
		            if(response.data) {
		                var data = dashboardService.sortObject(response.data);
		                var count = 0;
		                for(var key in data) {
		                    if(data.hasOwnProperty(key)) {
		                    	count = count+1;
		                        $scope.vehicles.push({'key': count, 'value': key})
		                    }
		                }
		            } 
		        });
			}
    	}
    }
});