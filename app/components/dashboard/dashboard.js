angular.module('app')
.component('dashboard', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./components/dashboard/dashboard.html",
  	controller: function(dashboardService,gridService, sidebarService, $interval,$mdSidenav,$window, userService, $uibModal,$mdDialog,prompt) {
  		var vm = this;

		vm.clock = {
			utc : "000.00.00.00 UTC"
		}
		vm.locks = dashboardService.getLock();
		vm.telemetry = dashboardService.telemetry;
		vm.name = userService.getUserName();
		vm.email = userService.getUserEmail();
		vm.role = userService.userRole;
		var dashboard = gridService.getDashboard();
		var totalMissions = [];

  		vm.currentMission =  dashboardService.getCurrentMission();

  		vm.updateClock = function(){
  			vm.clock = dashboardService.getTime('UTC');
  		}

  		vm.interval = $interval(vm.updateClock, 500);

	    vm.openLeftNav = function(){
	    	if ($window.innerWidth <= 1440){
	    		$mdSidenav('left').open();
	    	} else {
	    		vm.locks.lockLeft = !vm.locks.lockLeft;
	    		dashboardService.setLeftLock(vm.locks.lockLeft); 
	    	}
			sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
			sidebarService.setOpenLogo(true); //set to true if data menu opened through Quindar logo on Dashboard
	    }

	    vm.logout = function (ev) {
    		prompt({
                title:'Do you want to save this layout?',
                input: true,
                label: 'Layout Name',
                value: dashboard["current"].name
            }).then(function(name){
                gridService.save(vm.email, name)
                .then(function(response) {
                    if(response.status == 200){
                        $window.location.href = '/logout';
                    }
                });
            },function(){
            	$window.location.href = '/logout';
            }).catch(function (err) {});
        };

	    vm.openRightNav = function(){
	    	if ($window.innerWidth <= 1440){
	    		$mdSidenav('right').open();
	    	} else {
	    		vm.locks.lockRight = !vm.locks.lockRight;
	    		dashboardService.setRightLock(vm.locks.lockRight); 
	    	}
	    }

	    vm.showSettings = function(){
			$uibModal.open({
				templateUrl: './components/dashboard/roleModal.html',
				controller: 'modalCtrl',
				controllerAs: '$ctrl',
                resolve: {
                    mission: function () {
                        return dashboardService.getCurrentMission();
                    }
                }
			}).result.then(function(response){
				if(response) {
					//vm.callsign = response.callsign;
				}
			},
			function () {
				//console.log('Modal dismissed');
      		});
	    }
	}
})

app.controller('modalCtrl', function($uibModalInstance, userService, mission, $window,$mdDialog) {
	var $ctrl = this;

	$ctrl.cRole = {};

	userService.getCurrentRole(mission.missionName)
	.then(function(response) {
		if(response.status == 200){
			$ctrl.cRole = angular.copy(response.data);
			$ctrl.role = {
				currentRole:$ctrl.cRole
			};
		}
	});

	$ctrl.close = function() {
		$uibModalInstance.dismiss('cancel'); 
	};


	userService.getAllowedRoles(mission.missionName)
	.then(function(response) {
		if(response.status == 200){
			$ctrl.roles = response.data;
		}
	});

	$ctrl.updateRole = function(ev){
		if($ctrl.cRole.callsign === 'MD' && $ctrl.role.currentRole.name !== 'Mission Director') {
			//$window.alert("No mission without the Mission Director. Your role cannot be updated!");
			$uibModalInstance.close($ctrl.cRole);
		} else {
			userService.getRoles()
    		.then(function(response) {
        		if(response.status == 200) {
        			for(var a in response.data.roles){
        				if(response.data.roles[a].name === $ctrl.role.currentRole.name){
        					$ctrl.role.currentRole.callsign = response.data.roles[a].callsign;
        					break;
        				}
        			}
       				userService.setCurrentRole($ctrl.role.currentRole, mission.missionName)
	        		.then(function(response) {
	        			if(response.status == 200){
	                		//$window.alert("User's current role updated.");
	                		$uibModalInstance.close($ctrl.role.currentRole);
	            		}else {
	            			$window.alert("An error occurred.User's role not updated!");
	            		}
	        		});
        		}
    		});
	    }
    }
});

app.controller('missionModalCtrl', function($uibModalInstance,dashboardService,$scope,$window) {
	var $ctrl = this;
	$scope.missions = dashboardService.missions;
	$ctrl.currentMission = {};
	$ctrl.missionName = ''; 
	$scope.$watch("missions",function(newVal,oldVal){
		$ctrl.missions = newVal;
	},true);

	//save mission and close modal 
	$ctrl.setMission = function(){
		var numOfMissions = $scope.missions.length;
		for(var i=0;i<numOfMissions;i++){
			if($ctrl.missionName === $scope.missions[i].missionName){
				$ctrl.currentMission = angular.copy($scope.missions[i]);
				if(dashboardService.isEmpty($ctrl.currentMission) === false){
					dashboardService.setCurrentMission($ctrl.currentMission);
	    			$uibModalInstance.close($ctrl.currentMission);
	    			break;
	    		}
			}
		}  
	}
});
