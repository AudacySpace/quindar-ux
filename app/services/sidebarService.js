app
.factory('sidebarService', ['dashboardService', function(dashboardService) { 

    var widget;
    var widgetObject;

    //variable used to create data menu
    var menuStatus = false;

    //receive what widget has been called and what functions it has
    function setTempWidget(tempWidget, tempWidgetObject)
    {
        widget = tempWidget;
        widgetObject = tempWidgetObject;
    }

    function setVehicleInfo(dataString) {
        var vehicleInfo = {
            vehicle : '',
            id : '',
            key : '',
            category:''//,
        }
        if(dataString){
            var nodes = dataString.split(".");
            vehicleInfo.vehicle = nodes[0];
            vehicleInfo.id = nodes[nodes.length - 1];
            vehicleInfo.category = nodes[nodes.length-2];
            vehicleInfo.key = dataString;
            var item = vehicleInfo;
            widget.settings.dataArray.push(item);
            var datavalue = dashboardService.getData(item.key);
            if(datavalue && datavalue.hasOwnProperty("value")) //if data chosen is telemetry id, notify getValue function that last selected data is a group 
            {
                widgetObject.getValue(false);
            }
            else //if data chosen is a group, notify getValue function that last selected data is a group
            {
                widgetObject.getValue(true);
            }
        } else {
            vehicleInfo = {
                vehicle : '',
                id : '',
                key : '',
                category:''//,
            };
        }
    }

    /*function getVehicleInfo(){
        var newData = angular.copy(data);
        data = {
            parameters:[]
        }
        return newData;
    }*/

    function setMenuStatus(status){
        menuStatus = status;
    }

    function getMenuStatus(){
        return menuStatus;
    }

	return {
        setVehicleInfo : setVehicleInfo,
        setMenuStatus : setMenuStatus,
        getMenuStatus : getMenuStatus,
        //getVehicleInfo : getVehicleInfo,
        //data : data,
        setTempWidget : setTempWidget
	}
}]);