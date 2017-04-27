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
  		vm.sIcon = dashboardService.sIcon;
  		vm.gIcon = dashboardService.gIcon;
  		vm.pIcon = dashboardService.pIcon;
  		vm.dIcon = dashboardService.dIcon;

	  	vm.icons = [
	  		{
			    image:"/media/icons/aud_status_sat_green.svg",
			   	id: "i5"
			},
			{
		    	image:"/media/icons/aud_status_gs_green.svg",
		    	id: "i6"
		    },
		    {
		    	image:"/media/icons/aud_status_proxy_green.svg",
		    	id: "i7"
		    },
		    {
		    	image:"/media/icons/aud_status_db_green.svg",
		    	id:"i8"
		    }
	    ];

	    $interval(function(){

	    	if(vm.sIcon.sic === "grey" && vm.gIcon.gic === "grey" && vm.pIcon.pic === "grey" &&vm.dIcon.dic === "red"){
	    		vm.icons = [
	  				{
			    		image:"/media/icons/aud_status_sat_grey.svg",
			   			id: "i5"
					},
					{
		    			image:"/media/icons/aud_status_gs_grey.svg",
		    			id: "i6"
		    		},
		    		{
		    			image:"/media/icons/aud_status_proxy_grey.svg",
		    			id: "i7"
		    		},
		    		{
		    			image:"/media/icons/aud_status_db_red.svg",
		    			id:"i8"
		    		}
	    		];
	    	}else if(vm.sIcon.sic === "grey" && vm.gIcon.gic === "green" && vm.pIcon.pic === "green" && vm.dIcon.dic === "green"){
	    		vm.icons = [
	  				{
			    		image:"/media/icons/aud_status_sat_grey.svg",
			   			id: "i5"
					},
					{
		    			image:"/media/icons/aud_status_gs_green.svg",
		    			id: "i6"
		    		},
		    		{
		    			image:"/media/icons/aud_status_proxy_green.svg",
		    			id: "i7"
		    		},
		    		{
		    			image:"/media/icons/aud_status_db_green.svg",
		    			id:"i8"
		    		}
	    		];
	    	}else if(vm.sIcon.sic === "grey" && vm.gIcon.gic === "green" && vm.pIcon.pic === "green" && vm.dIcon.dic === "grey"){
	    		vm.icons = [
	  				{
			    		image:"/media/icons/aud_status_sat_grey.svg",
			   			id: "i5"
					},
					{
		    			image:"/media/icons/aud_status_gs_green.svg",
		    			id: "i6"
		    		},
		    		{
		    			image:"/media/icons/aud_status_proxy_green.svg",
		    			id: "i7"
		    		},
		    		{
		    			image:"/media/icons/aud_status_db_grey.svg",
		    			id:"i8"
		    		}
	    		];
	    	}else if(vm.sIcon.sic === "grey" && vm.gIcon.gic === "grey" && vm.pIcon.pic === "red" && vm.dIcon.dic === "red"){
	    		vm.icons = [
	  				{
			    		image:"/media/icons/aud_status_sat_grey.svg",
			   			id: "i5"
					},
					{
		    			image:"/media/icons/aud_status_gs_grey.svg",
		    			id: "i6"
		    		},
		    		{
		    			image:"/media/icons/aud_status_proxy_red.svg",
		    			id: "i7"
		    		},
		    		{
		    			image:"/media/icons/aud_status_db_red.svg",
		    			id:"i8"
		    		}
	    		];
	    	}else if(vm.sIcon.sic === "grey" && vm.gIcon.gic === "green" && vm.pIcon.pic === "green" && vm.dIcon.dic === "red"){
		    	vm.icons = [
		  			{
				    	image:"/media/icons/aud_status_sat_grey.svg",
				   		id: "i5"
					},
					{
			    		image:"/media/icons/aud_status_gs_green.svg",
			    		id: "i6"
			    	},
			    	{
			    		image:"/media/icons/aud_status_proxy_green.svg",
			    		id: "i7"
			    	},
			    	{
			    		image:"/media/icons/aud_status_db_red.svg",
			    		id:"i8"
			    	}
	    		];
	    	}else if(vm.sIcon.sic === "red" && vm.gIcon.gic === "green" && vm.pIcon.pic === "green" && vm.dIcon.dic === "green"){
		    	vm.icons = [
		  			{
				    	image:"/media/icons/aud_status_sat_red.svg",
				   		id: "i5"
					},
					{
			    		image:"/media/icons/aud_status_gs_green.svg",
			    		id: "i6"
			    	},
			    	{
			    		image:"/media/icons/aud_status_proxy_green.svg",
			    		id: "i7"
			    	},
			    	{
			    		image:"/media/icons/aud_status_db_green.svg",
			    		id:"i8"
			    	}
	    		];
	    	}else if(vm.sIcon.sic === "red" && vm.gIcon.gic === "red" && vm.pIcon.pic === "red" && vm.dIcon.dic === "red"){
		    	vm.icons = [
			  		{
					    image:"/media/icons/aud_status_sat_red.svg",
					   	id: "i5"
					},
					{
				    	image:"/media/icons/aud_status_gs_red.svg",
				    	id: "i6"
				    },
				    {
				    	image:"/media/icons/aud_status_proxy_red.svg",
				    	id: "i7"
				    },
				    {
				    	image:"/media/icons/aud_status_db_red.svg",
				    	id:"i8"
				    }
		    	];
	    	}else if(vm.sIcon.sic === "green" && vm.gIcon.gic === "green" && vm.pIcon.pic === "green" && vm.dIcon.dic === "green"){
		    	vm.icons = [
			  		{
					    image:"/media/icons/aud_status_sat_green.svg",
					   	id: "i5"
					},
					{
				    	image:"/media/icons/aud_status_gs_green.svg",
				    	id: "i6"
				    },
				    {
				    	image:"/media/icons/aud_status_proxy_green.svg",
				    	id: "i7"
				    },
				    {
				    	image:"/media/icons/aud_status_db_green.svg",
				    	id:"i8"
				    }
		    	];
	    	}
		},1000);


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