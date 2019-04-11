angular.module('app')
.component('grid', {
    templateUrl: "../components/grid/grid.html",
    controller: function(gridService,dashboardService,userService,$window,prompt,$uibModal,$mdSidenav,sidebarService,$interval){
    	var vm = this;
		vm.gridsterOptions = gridService.gridsterOptions;
	   	vm.dashboard = gridService.getDashboard();
	   	vm.loadStatus = dashboardService.getLoadStatus();
	   	vm.loadLayoutloaders = gridService.getGridLoader();
	   	vm.currentMission =  dashboardService.getCurrentMission();
	   	vm.prevDashboard = new Object();
	   	vm.name = userService.getUserName();
		vm.email = userService.getUserEmail();
		vm.role = userService.userRole;
		var dashboard = gridService.getDashboard();

		vm.clock = {
			utc : "000.00.00.00 UTC"
		}
		vm.locks = dashboardService.getLock();

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

		vm.isFullScreenMode = function(status,widget){
			widget.main = true;
			widget.settings.active = false;
			widget.saveLoad = false;		
			widget.delete = false;
			if(status === 'true'){
				vm.prevDashboard = angular.copy(vm.dashboard.current); // to retain original grid item positions
			}else if(status === 'false'){
				vm.dashboard.current = angular.copy(vm.prevDashboard);
			}
		}

		vm.logout = function () {
			userService.setUserOffline(vm.email, vm.currentMission)
			.then(function(response) {
                if(response.status == 200){
					prompt({
		                title:'Do you want to save this layout?',
		                input: true,
		                label: 'Layout Name',
		                value: dashboard["current"].name
		            }).then(function(name){
		                gridService.save(vm.email, name)
		                .then(function(resp) {
		                    if(resp.status == 200){
		                        $window.location.href = '/logout';
		                    }
		                });
		            },function(){
						$window.location.href = '/logout';
		            }).catch(function (err) {});
		        }
            });
        };

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

	   	vm.openRightNav = function(){
	    	if ($window.innerWidth <= 1440){
	    		$mdSidenav('right').open();
	    	} else {
	    		vm.locks.lockRight = !vm.locks.lockRight;
	    		dashboardService.setRightLock(vm.locks.lockRight); 
	    	}
	    }

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

	    vm.updateClock = function(){
  			vm.clock = dashboardService.getTime('UTC');
  		}

  		vm.interval = $interval(vm.updateClock, 500);
    }
})
