app
.factory('sidebarService', function() { 

    var widget;
    var widgetObject;

    //variable used to create data menu
    var menuStatus = false;

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
            widgetObject.getValue();
            //access last index in index array in widgets.settings.something
            //find corresponding select data text field for widget at that index and display data selected over there
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
});