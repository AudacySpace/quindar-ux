angular.module('app')
.component('grid', {
    templateUrl: "../components/grid/grid.html",
    controller: function(gridService){
    	var vm = this;

		vm.gridsterOptions = gridService.gridsterOptions;
		vm.dashboards = gridService.dashboards;
	    vm.selectedDashboardId = gridService.getDashboardId();
	   	vm.dashboard = gridService.getDashboard();
		vm.widgetDefinitions = gridService.widgetDefinitions;

		vm.remove = function(widget) {
			gridService.remove(widget);
		};

		vm.openSettings = function(widget) {
			console.log(widget);
		};
    }
})
