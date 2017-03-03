app.directive('datatablesettings', function() { 
  return { 
    restrict: 'E',
    scope: {},
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
    	
        $scope.submitValues = function(){
            datatableSettingsService.setCheckedValues($scope.checkedValues);
        }

        $scope.closeValues = function(){
        }
    },
    controllerAs: 'vm',
    bindToController: true 
  	}; 
});


