app
.component('rightSidebar', {
  	templateUrl: "./components/rightSidebar/right_sidebar.html",
  	controller: function(gridService, dashboardService, $controller, ModalService) {
        var vm = this;
  		vm.name = dashboardService.name;
        vm.addWidget = function() {
            gridService.addWidget();
        };

        vm.clear = function() {
            gridService.clear();
        };

        vm.addWidgets = function(widget) {
            gridService.addWidgets(widget);
        };

        vm.widgetDefinitions = gridService.widgetDefinitions;
        vm.QwidgetMenu =  false;
        vm.addMenu = false;
		vm.Doc = false;

        vm.showQwidgetMenu = function(){
            vm.QwidgetMenu = !vm.QwidgetMenu;
        }

        vm.showAddMenu = function(){
            vm.addMenu = !vm.addMenu;
        }
		
		vm.showDoc = function(){
            vm.Doc = !vm.Doc;
        }
		
		vm.showReadme = function() {

			// Just provide a template url, a controller and call 'showModal'.
			ModalService.showModal({
				templateUrl: "./components/rightSidebar/documentation.html",
				controller: "docController",
			});
			
		};
		
		vm.showContributing = function() {

			// Just provide a template url, a controller and call 'showModal'.
			ModalService.showModal({
				templateUrl: "./components/rightSidebar/contributing.html",
				controller: "docController",
			});
			
		};
  
	}
})