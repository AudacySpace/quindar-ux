angular.module('app')
.component('dashboard', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./components/dashboard/dashboard.html",
  	controller: function(dashboardService,gridService, $interval,prompt,$mdSidenav,$window, userService, $uibModal) {
  		var vm = this;

		vm.clock = {
			utc : "000.00.00.00 UTC"
		}
		vm.locks = dashboardService.getLock();
		vm.telemetry = dashboardService.telemetry;
		vm.name = userService.getUserName();
		vm.email = userService.getUserEmail();
		vm.callsign = userService.getCurrentCallSign();
		var dashboard = gridService.getDashboard();
		var totalMissions = [];

  		vm.interval = $interval(updateClock, 500);
  		vm.currentMission =  dashboardService.getCurrentMission();

  		function updateClock(){
  			vm.clock = dashboardService.getTime(0);
  		}

	    vm.openLeftNav = function(){
	    	if ($window.innerWidth < 1400){
	    		$mdSidenav('left').open();
	    	} else {
	    		vm.locks.lockLeft = !vm.locks.lockLeft;
	    		dashboardService.setLeftLock(vm.locks.lockLeft); 
	    	}
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
				controllerAs: '$ctrl'
			}).result.then(function(response){
				if(response) {
					vm.callsign = response.callsign;
				}
			},
			function () {
				console.log('Modal dismissed');
      		});
	    }
	}
})

app.controller('modalCtrl', function($uibModalInstance, userService) {
	var $ctrl = this;

	var cRole = {};

	userService.getCurrentRole()
	.then(function(response) {
		if(response.status == 200){
			cRole = response.data;
			$ctrl.role = {
				currentRole : cRole
			};
		}
	});

	$ctrl.close = function() {
		$uibModalInstance.dismiss('cancel'); 
	};


	userService.getAllowedRoles()
	.then(function(response) {
		if(response.status == 200){
			$ctrl.roles = response.data;
		}
	});

	$ctrl.updateRole = function(){
		if(cRole.callsign == 'MD' && $ctrl.role.currentRole.callsign != 'MD') {
			alert("No mission without the Mission Director. Your role cannot be updated");
			$uibModalInstance.close(cRole);
		} else {
	        userService.setCurrentRole($ctrl.role.currentRole)
	        .then(function(response) {
	        	if(response.status == 200){
	                alert("User's current role updated");
	                $uibModalInstance.close($ctrl.role.currentRole);
	            }
	        });
	    }
    }
});

app.controller('missionModalCtrl', function($uibModalInstance,dashboardService,$scope) {
	var $ctrl = this;
	$scope.missions = dashboardService.missions;
	$ctrl.currentMission = {};
	$scope.$watch("missions",function(newVal,oldVal){
		$ctrl.missions = newVal;
	},true);

	$ctrl.close = function() {
		if(dashboardService.isEmpty($ctrl.currentMission) === true){
			$uibModalInstance.dismiss('cancel'); 
		}else {
			alert("Please save the selected mission.");
		}

	};

	$ctrl.setMission = function(){
		if(dashboardService.isEmpty($ctrl.currentMission) === false){
			dashboardService.setCurrentMission($ctrl.currentMission);
	    	$uibModalInstance.close($ctrl.currentMission);
	    	alert("Mission has been set");
	    }else {
	    	alert("Please select a mission before you save.");
	    }   
	}
});
