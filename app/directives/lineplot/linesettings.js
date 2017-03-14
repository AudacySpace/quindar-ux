app
.directive('linesettings', function() { 
  	return { 
    	restrict: 'EA', 
		templateUrl: './directives/lineplot/linesettings.html',
		controller: 'lineController',
		link: function(scope, element, attributes) {

		}
	}
});	

app.controller('lineController', ['$scope', 'd3Service',function($scope, d3){

	// Table
	var jsonData = '{"rows":{"data":[[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"}]]}}';
	$scope.table = JSON.parse(jsonData);

	$scope.addRowAbove = function($index){
		$scope.table.rows.data.splice($index,0,[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"}]);
	}

	$scope.addRowBelow = function($index){
		$scope.table.rows.data.splice($index+1,0,[{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:left"},{"value":"","checked":"true","style":"text-align:right"}]);
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
	// End table	
	
	// Close
	$scope.closeWidget = function(widget){
		widget.main = true;
		widget.settings = false;
	}
	
	// Save
	$scope.saveWidget = function(widget){
		widget.main = true;
		widget.settings = false;
	}
	
}]);