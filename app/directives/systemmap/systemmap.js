app
.directive('systemmap', function() { 
	return { 
    	restrict: 'EA', 
		controller: 'SystemMapCtrl',
    	templateUrl: './directives/systemmap/systemmap.html'
    }
});

app.controller('SystemMapCtrl', function ($scope, $element, d3Service, dashboardService, $interval,gridService) {
	$scope.imglocation = $scope.widget.settings.imglocation;
	$scope.$watch("widget.settings.contents",function(newVal,oldVal){
		$scope.tlm = newVal;
	});
    $scope.mission = dashboardService.getCurrentMission();
});
