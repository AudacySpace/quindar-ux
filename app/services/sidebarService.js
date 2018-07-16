app
.factory('sidebarService', function() { 

    var data = {
        parameters:[]
    };

    //variable used to create data menu
    var menuStatus = false;

    function setVehicleInfo(dataString) {
        var vehicleInfo = {
            vehicle : '',
            id : '',
            key : '',
            category:''
        }
        if(dataString){
            var nodes = dataString.split(".");
            vehicleInfo.vehicle = nodes[0];
            vehicleInfo.id = nodes[nodes.length - 1];
            vehicleInfo.category = nodes[nodes.length-2];
            vehicleInfo.key = dataString;
            var item = vehicleInfo;
            data.parameters.push(item);
        } else {
            vehicleInfo = {
                vehicle : '',
                id : '',
                key : '',
                category:''
            };
        }
    }

    function getVehicleInfo(){
        var newData = angular.copy(data);
        data = {
            parameters:[]
        }
        return newData;
    }

    function setMenuStatus(status){
        menuStatus = status;
    }

    function getMenuStatus(){
        return menuStatus;
    }

	return {
        setVehicleInfo : setVehicleInfo,
        getVehicleInfo : getVehicleInfo,
        data : data,
        setMenuStatus : setMenuStatus,
        getMenuStatus : getMenuStatus
	}
});