app
.factory('sidebarService', ['$http', function($http) { 

    var vehicleInfo = {
        vehicle : '',
        id : '',
        key : ''
    }

    function getConfig(config) {
        return $http({
                url: "/getConfig", 
                method: "GET",
                params: {'mission' : 'ATest'}
            });
    }

    function setVehicleInfo(dataString) {
        var nodes = dataString.split(".");
        vehicleInfo.vehicle = nodes[0];
        vehicleInfo.id = nodes[nodes.length - 1];
        vehicleInfo.key = dataString;
    }

    function getVehicleInfo(){
        return vehicleInfo;
    }

	return {
        getConfig : getConfig,
        setVehicleInfo : setVehicleInfo,
        vehicleInfo : vehicleInfo,
        getVehicleInfo : getVehicleInfo
	}
}]);