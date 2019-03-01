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

        function getHexCode(color){
            var code = "#12C700";
            switch(color) {
                case "grey":
                    code = "#CFCFD5"
                    break;
                case "red":
                    code = "#FF0000"
                    break;
                case "green":
                    code = "#12C700"
                    break;
                case "blue":
                    code = "#71A5BC"
                    break;
                default:
                    code = "#12C700"
            }
            return code;
        }

  		$scope.$watch('statusIcons',function(newVal,oldVal){
        	dServiceObj = newVal; 
            vm.satstatusIconColor = getHexCode(dServiceObj.sIcon);
            vm.gsstatusIconColor = getHexCode(dServiceObj.gIcon);
            vm.proxystatusIconColor = getHexCode(dServiceObj.pIcon);
            vm.dbstatusIconColor = getHexCode(dServiceObj.dIcon);
    	},true);
	}
})