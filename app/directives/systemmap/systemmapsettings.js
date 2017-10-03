app
.directive('systemmapsettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/systemmap/systemmapsettings.html',
        controller: function($scope, dashboardService, gridService){

        	$scope.mission = dashboardService.getCurrentMission();
 
        	loadSystemMaps();

        	function loadSystemMaps(){
        		gridService.loadMaps().then(function(response){
        			$scope.images = response.data;
        		});
        	}

        	$scope.widget.settings.tlmdisplay = false;
			$scope.isLoaded = false;

			checkForImageModel();

			$scope.closeSettings = function(widget){
				widget.main = true;
				widget.settings.active = false;
				widget.saveLoad = false;
				widget.delete = false;
				$scope.selected.imageid = widget.settings.imageid;
			}

			$scope.saveSettings = function(widget){
				if($scope.selected.imageid){
					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete = false;
					for(var i=0;i<$scope.images.length;i++){
						if($scope.images[i].imageid === $scope.selected.imageid){
							widget.settings.imageid = $scope.images[i].imageid ;
							widget.settings.imglocation = 'data:image/gif;base64,'+$scope.images[i].image; 
							widget.settings.image = $scope.images[i].image;
							widget.settings.contents = $scope.images[i].contents;
						}
					}
				}
			}

			function checkForImageModel(){
				if(!$scope.widget.settings.imageid){
					$scope.selected = {};
				}else {
					$scope.selected = {
						imageid : $scope.widget.settings.imageid
					};
				}
			}
    	}
    }
});