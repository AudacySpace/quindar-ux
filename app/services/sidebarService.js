app
.factory('sidebarService', function() { 

    var vehicleInfo = {
        vehicle : '',
        id : '',
        key : ''
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
        setVehicleInfo : setVehicleInfo,
        vehicleInfo : vehicleInfo,
        getVehicleInfo : getVehicleInfo
	}
});