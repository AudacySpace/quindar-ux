app
.factory('sidebarService', function() { 

    var widget;
    

    //temp store index method which takes in an index as a parameter and stores it as temp
        //when data is selected, add this index to it

    function setTempWidget(tempWidget)
    {
        widget = tempWidget;
    }

    function setVehicleInfo(dataString, dashboard) {
        var vehicleInfo = {
            vehicle : '',
            id : '',
            key : '',
            category:''//,
            //widgetIndex = -1
        }
        if(dataString){
            var nodes = dataString.split(".");
            vehicleInfo.vehicle = nodes[0];
            vehicleInfo.id = nodes[nodes.length - 1];
            vehicleInfo.category = nodes[nodes.length-2];
            vehicleInfo.key = dataString;
            var item = vehicleInfo;
            widget.settings.dataArray.push(item);
            //access last index in index array in widgets.settings.something
            //find corresponding select data text field for widget at that index and display data selected over there
        } else {
            vehicleInfo = {
                vehicle : '',
                id : '',
                key : '',
                category:''//,
                //widgetIndex = -1
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

	return {
        setVehicleInfo : setVehicleInfo,
        //getVehicleInfo : getVehicleInfo,
        //data : data,
        setTempWidget : setTempWidget
	}
});