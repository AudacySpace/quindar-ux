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

        vm.showCategoryMenu = function(vehicle){
            vehicle.active = !vehicle.active;
        }

        vm.showTelemetryMenu = function(config){
            config.active = !config.active;
        }

  		vm.selectConfig = function(vehicle, data){
  			sidebarService.setVehicle(vehicle.name);
  			sidebarService.setId(data);
  		}

  		function getData(){
  			sidebarService.getConfig()
  			.then(function(response) {
  				vm.config = response.data;
                for(var j=0; j<vm.config.length; j++){
                    vm.config[j].active = false;
                    vm.config[j].category = initCaps(vm.config[j].category);
                }
                
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

        function initCaps(str){
            words = str.toLowerCase().split(' ');

             for(var i = 0; i < words.length; i++) {
                  var letters = words[i].split('');
                  letters[0] = letters[0].toUpperCase();
                  words[i] = letters.join('');
             }
             return words.join(' ');
        }
        
	}
})