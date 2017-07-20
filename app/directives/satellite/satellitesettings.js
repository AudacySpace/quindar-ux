app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: function($scope){

			$scope.closeSettings = function(widget){
				widget.main = true;
				widget.settings.active = false;
				widget.saveLoad = false;
				widget.delete = false;
			}

			$scope.saveSettings = function(widget){
				widget.main = true;
				widget.settings.active = false;
				widget.saveLoad = false;
				widget.delete = false;
				widget.settings.vehicle = $scope.selected.vehicle.value;
			}

			checkForSatelliteModel();

			function checkForSatelliteModel(){
				if(!$scope.widget.settings.vehicle){
					$scope.selected = {};
				}else {
					$scope.selected = 
					{ 
						vehicle:{
							value :$scope.widget.settings.vehicle
						}
					}
				}
			}

			$scope.isLoaded = false;

			$scope.vehicles = [
			{
        		'key': 1,
		        'value': 'Audacy1'
		    }, 
		    {
		        'key': 2,
		        'value': 'Audacy2'
		    }, 
		    {
		        'key': 3,
		        'value': 'Audacy3'
		    }];
    	}
    }
});