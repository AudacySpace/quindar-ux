app.directive('datatablesettings', function() { 
  return { 
    restrict: 'E', 
    scope: {},
    templateUrl:'./directives/datatable/datatablesettings.html', 
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
  	}; 
});
