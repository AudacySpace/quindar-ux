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
			widget.option = "delete";
		};

		vm.deleteWidget = function(widget) {
			gridService.remove(widget);
		};

		vm.closedeleteWidget = function(widget){
			widget.option = "";
		}

		vm.openSettings = function(widget) {
			widget.option = "settings";
		};

		vm.openSaveLoadSettings = function(widget) {
			widget.option = "save-load";
		};

		vm.closeSaveLoadSettings = function(widget){
			widget.option = "";
		}
    }
})
