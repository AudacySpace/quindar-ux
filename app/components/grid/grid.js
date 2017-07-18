angular.module('app')
.component('grid', {
    templateUrl: "../components/grid/grid.html",
    controller: function(gridService,$scope,$sessionStorage){
    	var vm = this;
		vm.gridsterOptions = gridService.gridsterOptions;
		vm.dashboards = gridService.dashboards;
	    vm.selectedDashboardId = gridService.getDashboardId();
	   	$scope.dashboard = $sessionStorage.dashboard;
		vm.widgetDefinitions = gridService.widgetDefinitions;
		checkSessionStorage();

		$scope.$watch('dashboard',function(newVal,oldVal){
			$scope.dashboard = $sessionStorage.dashboard; 
		},true);

		vm.remove = function(widget) {
			widget.main = false;
			widget.settings.active = false;
			widget.saveLoad = false;
			widget.delete = true;
		};

		vm.openSettings = function(widget) {
			widget.main = false;
			widget.settings.active = true;
			widget.saveLoad = false;		
			widget.delete = false;
		};

		vm.openSaveLoadSettings = function(widget) {
			widget.main = false;
			widget.settings.active = false;
			widget.saveLoad = true;
			widget.delete = false;			
		};

		function checkSessionStorage(){
			if($sessionStorage.dashboard || $sessionStorage.dashboard !== null || $sessionStorage.dashboard !== ''){
				$scope.newLayout = {"current" : $sessionStorage.dashboards[vm.selectedDashboardId]};
				$sessionStorage.dashboard = $scope.newLayout;
			}
		}
    }
})
