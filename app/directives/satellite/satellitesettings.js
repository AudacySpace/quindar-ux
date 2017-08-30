app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: function($scope, dashboardService, $interval){

        	$scope.vehicles = [];
			$scope.isLoaded = false;

        	createVehicles();
			checkForSatelliteModel();

			$scope.closeSettings = function(widget){
				widget.main = true;
				widget.settings.active = false;
				widget.saveLoad = false;
				widget.delete = false;
				$scope.selected.vehicle = widget.settings.vehicle;
			}

			$scope.saveSettings = function(widget){
				if($scope.selected.vehicle){
					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete = false;
					widget.settings.vehicle = $scope.selected.vehicle;
				}
			}

			function checkForSatelliteModel(){
				if(!$scope.widget.settings.vehicle){
					$scope.selected = {};
				}else {
					$scope.selected = {
						vehicle : $scope.widget.settings.vehicle
					};
				}
			}

			function createVehicles(){
				var interval = $interval(function(){
	                var currentMission = dashboardService.getCurrentMission();
	                if(currentMission.missionName != ""){
						dashboardService.getConfig(currentMission.missionName)
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
				        $interval.cancel(interval);
				    }
				}, 1000);
			}
    	}
    }
});