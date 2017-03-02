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
			widget.main = false;
			widget.settings = false;
			widget.saveLoad = false;
			widget.delete = true;
		};

		vm.openSettings = function(widget) {
			widget.main = false;
			widget.settings = true;
			widget.saveLoad = false;		
			widget.delete = false;
		};

		vm.openSaveLoadSettings = function(widget) {
			widget.main = false;
			widget.settings = false;
			widget.saveLoad = true;
			widget.delete = false;			
		};
    }
})
