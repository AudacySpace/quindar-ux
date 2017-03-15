app.directive('datatablesettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datatable/datatablesettings.html', 
    controller: function($scope){

        $scope.checkedValues = $scope.widget.settings.checkedValues;
    	
        $scope.saveDataTableSettings = function(widget){
            var val = $scope.checkedValues;
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
        };

        $scope.closeDataTableSettings = function(widget){
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
        }
    }
  	}; 
});


