app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function(sidebarService, $interval) {
  		var vm = this;
        vm.post = {id: null};

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
            sidebarService.setVehicleInfo(vehicle.name,data);
  		}

        vm.searchData = function(id){

            var vehs = angular.copy(vm.vehicles);
            var vehMenu = angular.copy(vm.vehicleMenu);
            var newObj = {};

            for(var i=0;i<vehs.length;i++){
                for(var j=0;j<vehs[i].config.length;j++){
                    for(var k=0;k<vehs[i].config[j].values.length;k++){
                    if(vehs[i].config[j].active = true){
                        vehs[i].config[j].active = false;
                        vehs[i].config[j].datastatus[k] = false;
                        vm.vehicleMenu = false;
                    }else {
                        vehs[i].config[j].active;
                        vm.vehicleMenu = false;
                    }
                }
            }
            }

            for(var i=0;i<vehs.length;i++){
                for(var j=0;j<vehs[i].config.length;j++){
                    for(var k=0;k<vehs[i].config[j].values.length;k++){
                        if(id != undefined && id !== '' && id != ''){
                            if(vehs[i].config[j].values[k].match(id)){
                                vehMenu = true;
                                vehs[i].active = true;
                                vehs[i].config[j].active = true;
                                vehs[i].config[j].datastatus[k] = true;
                                newObj = JSON.stringify(vehs);
                                vm.vehicleMenu = vehMenu;
                                vm.vehicles = JSON.parse(newObj);
                            }
                            else{
                                vehs[i].config[j].datastatus[k] = false;
                            }
                        }
                    }

                }             
            }
        }

  		function getData(){
  			sidebarService.getConfig()
  			.then(function(response) {
  				vm.config = response.data;
                for(var i=0;i<vm.config.length;i++){
                    vm.config[i].datastatus = [];
                }

                for(var j=0; j<vm.config.length; j++){
                    for(var k=0;k<vm.config[j].values.length;k++){
                    vm.config[j].active = false;
                    vm.config[j].datastatus[k] = true;
                    vm.config[j].category = initCaps(vm.config[j].category);
                    }
                }

                console.log(vm.config);
                
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
});
