app.directive('datatablesettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datatable/datatablesettings.html', 
    controller: function($scope,datatableService){

        $scope.checkedValues = $scope.widget.settings.checkedValues;
        var values = angular.copy($scope.checkedValues);

        $scope.saveDataTableSettings = function(widget){
            var val = $scope.checkedValues;
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
            values = angular.copy($scope.checkedValues);
        };

        $scope.closeDataTableSettings = function(widget){
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
            datatableService.setCheckedValues(widget,values);
        }
    }
  	}; 
});


