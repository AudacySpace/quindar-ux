app
.factory('sidebarService', ['$http', function($http) { 
    var vehicle = 'Audacy1';
    var id = 'x';

    function getConfig(config) {
        return $http({
                url: "/getConfig", 
                method: "GET",
                params: {'source' : 'GMAT'}
            });
    }

    function setVehicle(name) {
        vehicle = name;
    }

    function setId(data) {
        id = data;
    }

    function getVehicle(name) {
        return vehicle;
    }

    function getId(data) {
        return id;
    }

	return {
        getConfig : getConfig,
        setVehicle : setVehicle,
        setId : setId,
        getVehicle : getVehicle,
        getId : getId
	}
}]);