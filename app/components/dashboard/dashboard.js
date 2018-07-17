angular.module('app')
.component('dashboard', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./components/dashboard/dashboard.html",
  	controller: function(dashboardService,gridService, sidebarService, $interval,prompt,$mdSidenav,$window, userService, $uibModal) {
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
  			vm.clock = dashboardService.getTime(0);
  		}

  		vm.interval = $interval(vm.updateClock, 500);

	    vm.openLeftNav = function(){
	    	if ($window.innerWidth < 1400){
	    		$mdSidenav('left').open();
	    	} else {
	    		vm.locks.lockLeft = !vm.locks.lockLeft;
	    		dashboardService.setLeftLock(vm.locks.lockLeft); 
	    	}
			sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
	    }

	    vm.logout = function () {
            prompt({
                title: 'Do you want to save this layout?',
                input: true,
                label: 'Layout Name',
                value: dashboard["current"].name
            }).then(function(name){
                gridService.save(vm.email, name)
                .then(function(response) {
                    if(response.status == 200){
                        alert("Layout saved succcessfully -- " + name);
                        $window.location.href = '/logout';
                    }
                });
            },function(){
            	$window.location.href = '/logout';
            });
        };

	    vm.openRightNav = function(){
	    	if ($window.innerWidth < 1400){
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
				console.log('Modal dismissed');
      		});
	    }
	}
})

app.controller('modalCtrl', function($uibModalInstance, userService, mission, $window) {
	var $ctrl = this;

	$ctrl.cRole = {};

	userService.getCurrentRole(mission.missionName)
	.then(function(response) {
		if(response.status == 200){
			$ctrl.cRole = response.data;
			$ctrl.role = {
				currentRole : $ctrl.cRole
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

	$ctrl.updateRole = function(){
		if($ctrl.cRole.callsign == 'MD' && $ctrl.role.currentRole.callsign != 'MD') {
			$window.alert("No mission without the Mission Director. Your role cannot be updated");
			$uibModalInstance.close($ctrl.cRole);
		} else {
	        userService.setCurrentRole($ctrl.role.currentRole, mission.missionName)
	        .then(function(response) {
	        	if(response.status == 200){
	                $window.alert("User's current role updated");
	                $uibModalInstance.close($ctrl.role.currentRole);
	            }
	        });
	    }
    }
});

app.controller('missionModalCtrl', function($uibModalInstance,dashboardService,$scope,$window) {
	var $ctrl = this;
	$scope.missions = dashboardService.missions;
	$ctrl.currentMission = {};
	$scope.$watch("missions",function(newVal,oldVal){
		$ctrl.missions = newVal;
	},true);

	//save mission and close modal
	$ctrl.setMission = function(){
		if(dashboardService.isEmpty($ctrl.currentMission) === false){
			dashboardService.setCurrentMission($ctrl.currentMission);
	    	$uibModalInstance.close($ctrl.currentMission);
	    	$window.alert("Mission has been set");
	    }else {
	    	$window.alert("Please select a mission before you save.");
	    }   
	}
});
