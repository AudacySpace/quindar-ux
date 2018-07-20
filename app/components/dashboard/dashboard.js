angular.module('app')
.component('dashboard', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./components/dashboard/dashboard.html",
  	controller: function(dashboardService,gridService, sidebarService, $interval,prompt,$mdSidenav,$window, userService, $uibModal,$mdToast) {
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
			sidebarService.setOpenLogo(true); //set to true if data menu opened through Quindar logo on Dashboard
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
                        // alert("Layout saved succcessfully -- " + name);
                        var pinTo = 'bottom right';
            			var toast = $mdToast.simple()
                                    	.textContent("Layout: "+name +" saved succcessfully.")
                                    	.action('OK')
                                    	.hideDelay(5000)
                                    	.highlightAction(true)
                                    	.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    	.position(pinTo);
                		$mdToast.show(toast).then(function(response) {
                    		if ( response == 'ok' ) {
                    		}
                    		$window.location.href = '/logout';
                		});
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

app.controller('modalCtrl', function($uibModalInstance, userService, mission, $window, dashboardService) {
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
		var position,queryId,delay,usermessage,alertstatus;
		if($ctrl.cRole.callsign == 'MD' && $ctrl.role.currentRole.callsign != 'MD') {
			$uibModalInstance.close($ctrl.cRole);
			position = "bottom right";
            queryId = '#adminroletoaster';
            delay = false;
            usermessage = "No mission without the Mission Director. Your role cannot be updated";
            alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay);
		} else {
	        userService.setCurrentRole($ctrl.role.currentRole, mission.missionName)
	        .then(function(response) {
	        	if(response.status == 200){
	                $uibModalInstance.close($ctrl.role.currentRole);
	               	position = "bottom right";
            		queryId = '#dashboardtoaster';
            		delay = false;
            		usermessage = "User's current role updated!";
            		alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay);
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
		var position,queryId,delay,usermessage,alertstatus;
		if(dashboardService.isEmpty($ctrl.currentMission) === false){
			dashboardService.setCurrentMission($ctrl.currentMission);
	    	$uibModalInstance.close($ctrl.currentMission);
           	position = "bottom right";
            queryId = '';
           	delay = 5000;
           	usermessage = "Mission: "+$ctrl.currentMission.missionName+" has been set!";
            alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay);
	    }else {
	    	position = "bottom right";
            queryId = '#missiontoaster';
            delay = false;
            usermessage = "Please select a mission before you save.";
            alertstatus = dashboardService.displayAlert(usermessage,position,queryId,delay);
	    }   
	}
});
