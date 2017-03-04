app.directive('datatablesettings', function() { 
  return { 
    restrict: 'E',
    // bindings: {
    //     widget: '='
    // },
    templateUrl:'./directives/datatable/datatablesettings.html', 
    controller: function(datatableSettingsService,$scope){

        $scope.checkedValues ={
            checkedId: true,
            checkedName: true,
            checkedAlow: true,
            checkedWlow: true,
            checkedValue: true,
            checkedWhigh: true,
            checkedAhigh: true,
            checkedUnits: true,
            checkedNotes: true
        };
    	
        $scope.saveDataTableSettings = function(widget){
            var val = $scope.checkedValues;
            widget.main = true;
            widget.settings = false;
            widget.saveLoad = false;
            widget.delete = false;
            datatableSettingsService.setCheckedValues(val);
        };

        $scope.closeDataTableSettings = function(widget){
            console.log("hi");
            widget.main = true;
            widget.settings = false;
            widget.saveLoad = false;
            widget.delete = false;
        }
    }
  	}; 
});


