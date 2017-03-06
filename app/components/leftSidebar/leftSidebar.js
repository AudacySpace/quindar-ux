app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function(sidebarService, $interval) {
  		var vm = this;

  		getData();

		vm.vehicleMenu = false;

        vm.showVehicleMenu = function(){
            vm.vehicleMenu = !vm.vehicleMenu;
        }

        vm.showTelemetryMenu = function(vehicle){
            vehicle.active = !vehicle.active;
        }

  		vm.selectConfig = function(vehicle, data){
  			sidebarService.setVehicle(vehicle.name);
  			sidebarService.setId(data);
  		}

  		function getData(){
  			sidebarService.getConfig()
  			.then(function(response) {
  				vm.config = response.data;

  				vm.vehicles = [ {
					name : "Audacy1",
					config : vm.config,
					active : false
				},
				{
					name : "Audacy2",
					config : vm.config,
					active : false
				},
				{
					name : "Audacy3",
					config : vm.config,
					active : false
				}
				];

       		});
  		}
        
	}
})