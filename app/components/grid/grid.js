angular.module('app')
.component('grid', {
    templateUrl: "../components/grid/grid.html",
    controller: function(gridService,dashboardService){
    	var vm = this;
		vm.gridsterOptions = gridService.gridsterOptions;
	   	vm.dashboard = gridService.getDashboard();
	   	vm.loadStatus = dashboardService.getLoadStatus();
	   	vm.loadLayoutloaders = gridService.getGridLoader();

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
    }
})
