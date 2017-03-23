app
.factory('sidebarService', ['$http', function($http) { 

    var vehicleInfo = {
        vehicle : '',
        id : ''
    }

    function getConfig(config) {
        return $http({
                url: "/getConfig", 
                method: "GET",
                params: {'source' : 'GMAT'}
            });
    }

    function setVehicleInfo(name,data) {
        vehicleInfo.vehicle = name;
        vehicleInfo.id = data;
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