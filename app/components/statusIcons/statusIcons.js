angular.module('app')
.component('statusIcons', {
  	templateUrl: "./components/statusIcons/status_icons.html",
  	controller: function(dashboardService,$scope) {
  		var vm = this;
  		vm.satstatusIconColor = "#12C700";//satellite icon default color
  		vm.gsstatusIconColor = "#12C700";//ground station icon default color
  		vm.proxystatusIconColor = "#12C700";//proxy icon default color
  		vm.dbstatusIconColor = "#12C700";//database icon default color
  		$scope.statusIcons = dashboardService.icons;
  		var dServiceObj = {};

  		$scope.$watch('statusIcons',function(newVal,oldVal){
        	dServiceObj = newVal; 
        	if(dServiceObj.sIcon === "grey" && dServiceObj.gIcon === "grey" && dServiceObj.pIcon === "grey" &&dServiceObj.dIcon === "red"){
				//if query failed
				vm.satstatusIconColor = "#CFCFD5";
				vm.gsstatusIconColor = "#CFCFD5";
				vm.proxystatusIconColor = "#CFCFD5";
  				vm.dbstatusIconColor = "#FF0000";
	    	}else if(dServiceObj.sIcon === "grey" && dServiceObj.gIcon === "red" && dServiceObj.pIcon=== "green" && dServiceObj.dIcon === "blue"){
	    		// if there is response from database but the data is stale
	    		// or if proxy application is not receiving any data from ground station
	    		vm.satstatusIconColor = "#CFCFD5";
  				vm.gsstatusIconColor = "#FF0000";
  				vm.proxystatusIconColor = "#12C700";
  				vm.dbstatusIconColor = "#71A5BC";
	    	}else if(dServiceObj.sIcon === "red" && dServiceObj.gIcon === "green" && dServiceObj.pIcon=== "green" && dServiceObj.dIcon === "green"){
	    		//if the streamed data is empty
	    		vm.satstatusIconColor = "#FF0000";
  				vm.gsstatusIconColor = "#12C700";
  				vm.proxystatusIconColor = "#12C700";
  				vm.dbstatusIconColor = "#12C700";
	    	}else if(dServiceObj.sIcon === "grey" && dServiceObj.gIcon === "grey" && dServiceObj.pIcon === "red" && dServiceObj.dIcon === "green"){
	    		//If proxy application is not running
	    		vm.satstatusIconColor = "#CFCFD5";
  				vm.gsstatusIconColor = "#CFCFD5";
  				vm.proxystatusIconColor = "#FF0000";
  				vm.dbstatusIconColor = "#12C700";
	    	}else if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
	    		//If everything works good
	    		vm.satstatusIconColor = "#12C700";
  				vm.gsstatusIconColor = "#12C700";
  				vm.proxystatusIconColor = "#12C700";
  				vm.dbstatusIconColor = "#12C700";
	    	}
    	},true);
	}
})