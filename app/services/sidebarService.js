app
.factory('sidebarService', ['$http', function($http) { 

    var vehicleInfo = {
        vehicle : '',
        id : ''
    }

    var key = ''

    function getConfig(config) {
        return $http({
                url: "/getConfig", 
                method: "GET",
                params: {'mission' : 'ATest'}
            });
    }

    function setVehicleInfo(name,data) {
        vehicleInfo.vehicle = name;
        vehicleInfo.id = data;
    }

    function getVehicleInfo(){
        return vehicleInfo;
    }

    function setData(dataString) {
        key = dataString
    }

    function getData(){
        return key;
    }

	return {
        getConfig : getConfig,
        setVehicleInfo : setVehicleInfo,
        vehicleInfo : vehicleInfo,
        getVehicleInfo : getVehicleInfo,
        setData : setData,
        getData : getData
	}
}]);