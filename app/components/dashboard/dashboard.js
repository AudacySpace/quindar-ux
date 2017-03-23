angular.module('app')
.component('dashboard', {
	transclude: true,
  	scope: true,
   	bindToController: true,
  	templateUrl: "./components/dashboard/dashboard.html",
  	controller: function(dashboardService, $interval, $mdSidenav,$window) {
  		var vm = this;
		
		vm.locks = dashboardService.getLock();
		vm.telemetry = dashboardService.telemetry;
  		vm.clock = dashboardService.time;
  		vm.name = dashboardService.name;
  		vm.email = dashboardService.email;

	  	vm.icons = [
	  		{
			    image:"/media/icons/status_icons-05.png",
			   	id: "i5"
			},
			{
		    	image:"/media/icons/status_icons-06.png",
		    	id: "i6"
		    },
		    {
		    	image:"/media/icons/status_icons-07.png",
		    	id: "i7"
		    },
		    {
		    	image:"/media/icons/status_icons-08.png",
		    	id:"i8"
		    }
	    ];

	    vm.openLeftNav = function(){
	    
	    	if ($window.innerWidth < 1400){
	    		$mdSidenav('left').open();
	    	} else {
	    		vm.locks.lockLeft = !vm.locks.lockLeft;
	    		dashboardService.setLeftLock(vm.locks.lockLeft); 
	    	}
	    }

	    vm.openRightNav = function(){
	    	if ($window.innerWidth < 1400){
	    		$mdSidenav('right').open();
	    	} else {
	    		vm.locks.lockRight = !vm.locks.lockRight;
	    		dashboardService.setRightLock(vm.locks.lockRight); 
	    	}
	    }

	}
})