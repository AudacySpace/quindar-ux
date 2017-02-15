app
.component('leftSidebar', {
  	templateUrl: "./components/leftSidebar/left_sidebar.html",
  	controller: function() {
  		var vm = this;
    	vm.menuitems = [ "Realtime Telemetry",
    	"Satellite Subsystems",
		"Satellite Imagery",
		"Atmosphere Pressure"
		]
	}
})