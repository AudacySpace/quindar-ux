app
.component('leftSidebar', {
  	templateUrl: "./views/partials/left_sidebar.ejs",
  	controller: function() {
    	this.menuitems = [ "Realtime Telemetry",
    	"Satellite Subsystems",
		"Satellite Imagery",
		"Atmosphere Pressure"
		]
	}
})

.component('rightSidebar', {
  	templateUrl: "./views/partials/right_sidebar.ejs",
  	controller: function(dashboardService) {
  		this.name = dashboardService.name;
	}
})

.component('dashboard', {
	transclude: true,
  	// require: {
   //  	parent: '^wrapper'
  	// },
  	scope: true,
   	bindToController: true,
  	templateUrl: "./views/partials/main.html",
  	controller: function(dashboardService, $interval) {
  		var vm = this;
  		var theInterval = $interval(function(){
	    	vm.clock = dashboardService.startTime();
	    	getData();
	    	//init();
	   	}.bind(vm), 1000); 

  		vm.clock = dashboardService.startTime();
  		vm.name = dashboardService.name;
  		vm.email = dashboardService.email;

  		function getData(){
  			dashboardService.get()
  			.then(function(response) {
  				console.log(response.data.Audacy1);
  				vm.telemetry = response.data;
                //return response.data;
       		});
  		}

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
	}
})

.component('dashboardContainer', {
	templateUrl : "./views/partials/dashboard.html",
	controllerAs: 'parent',
    bindToController: true,
	controller : function(){

	}
})