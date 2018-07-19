app.directive('groundtracksettings', function() { 
    return {
        restrict: 'EA',
        templateUrl:'./directives/groundtrack/groundtracksettings.html',
        controller: 'GroundSettingsCtrl'
    }
});

app.controller('GroundSettingsCtrl', function($scope, dashboardService, $interval,$mdSidenav,$window,sidebarService,$uibModal) {
    var colors = [ "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
    var previousCheckedValues;
    $scope.settings = new Object();
    $scope.settings.vehicles = [];
    $scope.settings.pdata = [];
    $scope.settings.vdata = [];
    $scope.settings.orbitstatus = [];
    $scope.settings.iconstatus = [];
    $scope.firstScreen = true;
    $scope.secondScreen = false;
    $scope.positionData = [];
    $scope.velocityData = [];
    $scope.vdisplay = [];
    $scope.pdisplay = [];
    $scope.vehicle = [];
    $scope.iconstatus = [];
    $scope.orbitstatus = [];
    $scope.checkedValues = [];
    $scope.velocityBooleans = [true, true, true, true];
    $scope.positionBooleans = [true, true, true, true];
    $scope.totalVelocityArray = [];
    $scope.totalPositionArray = [];
    $scope.chosenCategory;
    $scope.parameters = {
        pdata: $scope.positionData,
        vdata: $scope.velocityData
    }
    $scope.vehicleSelected = false;
    $scope.vehicleId;
    $scope.sortableOptionsPosition = {
        containment: '#scrollable-containerPositionValues',
        scrollableContainer: '#scrollable-containerPositionValues',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };

    $scope.sortableOptionsVelocity = {
        containment: '#scrollable-containerVelocityValues',
        scrollableContainer: '#scrollable-containerVelocityValues',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };

    $scope.closeWidget = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;

        $scope.checkedValues = angular.copy(previousCheckedValues);
        var previousSettings = angular.copy($scope.settings);

        if(previousSettings.vehicles.length > 0){
            for(var i=0;i<previousSettings.vehicles.length;i++){
                $scope.iconstatus[i] = previousSettings.iconstatus[i];
                $scope.orbitstatus[i] = previousSettings.orbitstatus[i];
                $scope.positionData[i] = angular.copy(previousSettings.pdata[i]);
                $scope.velocityData[i] = angular.copy(previousSettings.vdata[i]);
            }
        }
    }

    $scope.saveWidget = function(widget){
        widget.saveLoad = false;
        widget.delete = false;

        //reset the vehicle settings
        $scope.widget.settings.vehicles = [];
        var count = 0; //total count of parameters for all vehicles, should be 6 per selected vehicle
        var vehSelectedCount = 0; //count of selected vehicles
        for(var i=0;i<$scope.settings.vehicles.length;i++){
            if($scope.checkedValues[i].status === true){
                vehSelectedCount++;
                if($scope.settings.pdata){
                    if($scope.settings.pdata[i]){
                        count = count + $scope.settings.pdata[i].length;
                    }
                }
                if($scope.settings.vdata){
                    if($scope.settings.vdata[i]){
                        count = count + $scope.settings.vdata[i].length; 
                    }
                } 

                // check if count is 6 per selected vehicles till now
                //If true, add it to settings
                if(count === (vehSelectedCount * 6)){
                    var vehicle = {
                        "name" : $scope.settings.vehicles[i].label,
                        "dataStatus" : $scope.checkedValues[i].status,
                        "orbitStatus" : $scope.settings.orbitstatus[i],
                        "iconStatus" : $scope.settings.iconstatus[i],
                        "color": colors[i],
                        "pdata":$scope.settings.pdata[i],
                        "vdata":$scope.settings.vdata[i]
                    }
                    $scope.widget.settings.vehicles.push(vehicle);
                }else {
                    $window.alert("Please select all parameters for selected vehicle "
                        + $scope.settings.vehicles[i].label + " or uncheck it!");
                    break;
                }
            }
        }

        if(vehSelectedCount > 0) {
            if(count === (vehSelectedCount * 6)){
                widget.main = true;
                widget.settings.active = false;
                previousCheckedValues = angular.copy($scope.checkedValues);
            } else {
                widget.main = false;
                widget.settings.active = true;
            }
        } else {
            widget.main = false;
            widget.settings.active = true;
            $window.alert("Please select atleast one vehicle before you save!");
        }
    }

    $scope.createVehicles = function(callback){
        if(!$scope.interval){
            $scope.interval = $interval(function(){
                var telemetry = dashboardService.telemetry;
                if(!dashboardService.isEmpty(telemetry)){
                    var data = dashboardService.sortObject(telemetry.data);
                    var flag =false;
                    for(var key in data) {
                        if(data.hasOwnProperty(key)) {
                            for(var i=0; i<$scope.settings.vehicles.length; i++){
                                if(key == $scope.settings.vehicles[i].label){
                                    flag = true;
                                    break;
                                }
                            }

                            if(!flag || ($scope.settings.vehicles.length == 0)){
                                var index = $scope.settings.vehicles.length;

                                $scope.settings.vehicles[index] = {
                                    "id" : index,
                                    "label" :key
                                }

                                $scope.iconstatus[index] = true;
                                $scope.orbitstatus[index] = true;
                                $scope.positionData[index] = [];
                                $scope.velocityData[index] = [];
                                $scope.settings.pdata[index] = [];
                                $scope.settings.vdata[index] = [];
                                $scope.settings.orbitstatus[index] = true;
                                $scope.settings.iconstatus[index] = true;
                                $scope.pdisplay[index] = "Click for data";
                                $scope.vdisplay[index] = "Click for data";
                                $scope.checkedValues[index] = {status:false};
                            }

                            flag = false;
                        }
                    }

                    $interval.cancel($scope.interval);
                    $scope.interval = null;

                    if(callback){
                        callback(true);
                    }
                }
            }, 1000);
        }
    }

    function createSettingsData(){
        $scope.createVehicles(function(result){
            if(result){ //result is true when the vehicle settings are created by scope.createVehicles()
                if($scope.widget.settings.vehicles.length > 0){
                    for(var j=0; j<$scope.settings.vehicles.length; j++){
                        for(var i=0; i<$scope.widget.settings.vehicles.length; i++){
                            if($scope.settings.vehicles[j].label == $scope.widget.settings.vehicles[i].name){
                                $scope.checkedValues[j] = {
                                    status:$scope.widget.settings.vehicles[i].dataStatus
                                };
                                $scope.orbitstatus[j] = $scope.widget.settings.vehicles[i].orbitStatus;
                                $scope.settings.orbitstatus[j] = $scope.widget.settings.vehicles[i].orbitStatus;
                                $scope.iconstatus[j] = $scope.widget.settings.vehicles[i].iconStatus;
                                $scope.settings.iconstatus[j] = $scope.widget.settings.vehicles[i].iconStatus;
                                $scope.positionData[j] = angular.copy($scope.widget.settings.vehicles[i].pdata);
                                $scope.settings.pdata[j] = angular.copy($scope.widget.settings.vehicles[i].pdata);
                                if($scope.positionData[j].length === 3){
                                    $scope.pdisplay[j] = displayStringForInput($scope.positionData[j]);
                                }else if($scope.positionData[i].length === 0){
                                    $scope.pdisplay[j] = "Click for data";
                                }
                                $scope.velocityData[j] = angular.copy($scope.widget.settings.vehicles[i].vdata);
                                $scope.settings.vdata[j] = angular.copy($scope.widget.settings.vehicles[i].vdata);
                                if( $scope.velocityData[j].length === 3){
                                    $scope.vdisplay[j] = displayStringForInput($scope.velocityData[j]);
                                }else if($scope.velocityData[j].length === 0){
                                    $scope.vdisplay[j] = "Click for data";
                                }
                            }
                        }
                    }
                }
                var index = $scope.checkedValues.findIndex(
                    checkedValue => checkedValue.status === true
                );

                //test if any vehicle was checked
                if(index != -1){
                    $scope.vehicleSelected = true;
                }else {
                    $scope.vehicleSelected = false;
                }

                previousCheckedValues = angular.copy($scope.checkedValues);
            }
        })
    }

    createSettingsData();

    $scope.alertUser = function($event,name,id,status){
        if(status === true){
            $event.stopPropagation();
            $scope.firstScreen = false;
            $scope.secondScreen = true;
            $scope.currentScreenVehicle = name;
            $scope.currentVehicleId = id;
            //Remove required tag
            $scope.vehicleSelected = true;

        }else {
            var selectionCount = 0;
            $scope.checkedValues[id].status = false;

            //To remove required tag
            for(var i=0;i<$scope.settings.vehicles.length;i++){
                if($scope.checkedValues[i].status === true){
                    selectionCount++;
                }
            }

            if(selectionCount > 0){
                $scope.vehicleSelected = true; 
            }else {
                $scope.vehicleSelected = false;
            }
        }
    }

    $scope.getValue = function(isGroup){
        var vehicleInfo = angular.copy($scope.widget.settings.dataArray);
        var dataLen = vehicleInfo.length;
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(!isGroup && data && data.id !== "")
        {
            $scope.velocityBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the velocity data selected doesn't pass
            $scope.positionBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the position data selected doesn't pass
            if($scope.chosenCategory == 'velocity') //if the velocity input box has been chosen
            {
                //push the last chosen data value into the corresponding velocity array
                $scope.totalVelocityArray.push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }
            else if($scope.chosenCategory == 'position') //if the position input box has been chosen
            {
                //push the last chosen data value into the corresponding position array
                $scope.totalPositionArray.push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }

            var positionArray = [];
            var positionSettings = [];
            var positionDisplayText = "";

            positionArray = angular.copy($scope.totalPositionArray);

            //if the temp position array has length more than 3 then reduce its size to recent 3
            if(positionArray.length > 3){
                positionSettings = getRecentSelectedValues(positionArray,3);
            }else {
                positionSettings = positionArray;
            }
            
            if(positionSettings.length === 3){
                var positionSettingsfiltered1 = removeCategories(positionSettings);//to remove selected group or categories while opening the list
                var positionSettingsfiltered2 = removeDuplicates(positionSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffPositionVeh = isAnyDiffVehicles(positionSettingsfiltered2,$scope.currentScreenVehicle);// to check if all the values are of the same vehicle
                var positionfilteredData = filterSelectedData(positionSettingsfiltered2);// check if there are any different values of a category
                if(isDiffPositionVeh === false && positionfilteredData.length === positionSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                    if(positionSettingsfiltered2.length === 3){  
                        positionDisplayText = displayStringForInput(positionSettingsfiltered2);
                        $scope.positionData[$scope.vehicleId] = angular.copy(positionSettingsfiltered2);
                        
                        // $scope.positionDisplay[$scope.vehicleId] = positionDisplayText;
                        $scope.parameters.pdata[$scope.vehicleId] = angular.copy(positionSettingsfiltered2);
                        $scope.pdisplay[$scope.vehicleId] = positionDisplayText;
                        $scope.vehicle[$scope.vehicleId] = positionSettingsfiltered2[0].vehicle;
                    }else if(positionSettingsfiltered2.length < 3){
                        $scope.vehicle[$scope.vehicleId] = "";
                        $scope.positionData[$scope.vehicleId] = [];
                        $scope.pdisplay[$scope.vehicleId] = "Click for data";
                        $scope.positionBooleans[0] = false;
                    }
                }else if(isDiffPositionVeh === false && positionfilteredData.length !== positionSettingsfiltered2.length){
                    $scope.vehicle[$scope.vehicleId] = "";
                    $scope.positionData[$scope.vehicleId] = [];
                    $scope.pdisplay[$scope.vehicleId] = "Click for data";
                    $scope.positionBooleans[1] = false;
                }else if(isDiffPositionVeh === true){
                    $scope.vehicle[$scope.vehicleId] = "";
                    $scope.positionData[$scope.vehicleId] = [];
                    $scope.pdisplay[$scope.vehicleId] = "Click for data";
                    $scope.positionBooleans[2] = false;
                }
            }else {
                $scope.vehicle[$scope.vehicleId] = "";
                $scope.positionData[$scope.vehicleId] = [];
                $scope.pdisplay[$scope.vehicleId] = "Click for data";
                $scope.positionBooleans[3] = false;
            }   

            var velocityArray = [];
            var velocitySettings = [];
            var velocityDisplayText = "";

            velocityArray = angular.copy($scope.totalVelocityArray);

            //if the temp velocity array has length more than 4 then reduce its size to recent 4
            if(velocityArray.length > 3){
                velocitySettings = getRecentSelectedValues(velocityArray,3);
            }else {
                velocitySettings = velocityArray;
            }
            if(velocitySettings.length === 3){
                var velocitySettingsfiltered1 = removeCategories(velocitySettings); //to remove selected group or categories while opening the list
                var velocitySettingsfiltered2 = removeDuplicates(velocitySettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffVelocityVeh = isAnyDiffVehicles(velocitySettingsfiltered2,$scope.currentScreenVehicle);// to check if all the values are of the same vehicle
                var velocityfilteredData = filterSelectedData(velocitySettingsfiltered2); // check if there are any different values of a category
                if(isDiffVelocityVeh === false && velocityfilteredData.length === velocitySettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                    if(velocitySettingsfiltered2.length === 3){  
                        velocityDisplayText = displayStringForInput(velocitySettingsfiltered2);
                        $scope.velocityData[$scope.vehicleId] = angular.copy(velocitySettingsfiltered2);
                        $scope.parameters.vdata[$scope.vehicleId] = angular.copy(velocitySettingsfiltered2);
                        // $scope.velocityDisplay[$scope.vehicleId] = velocityDisplayText;
                        $scope.vdisplay[$scope.vehicleId] = velocityDisplayText;
                        $scope.vehicle[$scope.vehicleId] = velocitySettingsfiltered2[0].vehicle;
                    }else if(velocitySettingsfiltered2.length < 3){
                        $scope.vehicle[$scope.vehicleId] = "";
                        $scope.velocityData[$scope.vehicleId] = [];
                        $scope.vdisplay[$scope.vehicleId] = "Click for data";
                        $scope.velocityBooleans[0] = false;
                    }
                }else if(isDiffVelocityVeh === false && velocityfilteredData.length !== velocitySettingsfiltered2.length){
                    $scope.vehicle[$scope.vehicleId] = "";
                    $scope.velocityData[$scope.vehicleId] = [];
                    $scope.vdisplay[$scope.vehicleId] = "Click for data";
                    $scope.velocityBooleans[1] = false;
                }else if(isDiffVelocityVeh === true){
                    $scope.vehicle[$scope.vehicleId] = "";
                    $scope.velocityData[$scope.vehicleId] = [];
                    $scope.vdisplay[$scope.vehicleId] = "Click for data";
                    $scope.velocityBooleans[2] = false;
                }

            }else {
                $scope.vehicle[$scope.vehicleId] = "";
                $scope.velocityData[$scope.vehicleId] = [];
                $scope.vdisplay[$scope.vehicleId] = "Click for data";
                $scope.velocityBooleans[3] = false;
            }      
        }
        else
        {
            $scope.velocityData[$scope.vehicleId] = null;
            $scope.positionData[$scope.vehicleId] = null;
        }
    }

    $scope.getTelemetrydata = function(category, vid){
        //open the data menu
        $scope.chosenCategory = category; //which input box has been selected (position or velocity)
        $scope.vehicleId = vid;
        sidebarService.setTempWidget($scope.widget, this); //pass widget and controller functions to sidebarService
        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = true;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
    }

    //display telemetry id chosen by the user in the velocity input box
    $scope.readVelocityValues = function()
    {
        var trimmedData = getRecentSelectedValues($scope.totalVelocityArray, 3);
        var stringData = "";
        for(var i = 0; i < trimmedData.length; i++)
        {
            if(trimmedData[i])
            {
                if(i == trimmedData.length - 1)
                {
                    stringData += trimmedData[i].id
                }
                else
                {
                    stringData += trimmedData[i].id + ", ";
                }
            }
        }
        if(stringData)
        {
            return stringData;
        }
        else
        {
            return "Click for data";
        }
    }

    //display telemetry id chosen by the user in the position input box
    $scope.readPositionValues = function()
    {
        var trimmedData = getRecentSelectedValues($scope.totalPositionArray, 3);
        var stringData = "";
        for(var i = 0; i < trimmedData.length; i++)
        {
            if(trimmedData[i])
            {
                if(i == trimmedData.length - 1)
                {
                    stringData += trimmedData[i].id
                }
                else
                {
                    stringData += trimmedData[i].id + ", ";
                }
            }
        }

        if(stringData)
        {
            return stringData;
        }
        else
        {
            return "Click for data";
        }
    }

    $scope.saveParameters = function(widget){
        //display alerts for conditions that were originally checked in getValue
        if(!$scope.velocityData[$scope.vehicleId] || !$scope.positionData[$scope.vehicleId])
        {
            $window.alert("Please select the parameters before applying!");
        }
        else if(!$scope.positionBooleans[3])
        {
            $window.alert("Please select all position values:x,y,z");
        }
        else if(!$scope.positionBooleans[2])
        {
            $window.alert("Please select all the position values:x,y,z from the same vehicle: "+$scope.currentScreenVehicle);
        }
        else if(!$scope.positionBooleans[1])
        {
            $window.alert("Please select all the position values:x,y,z from the same category of vehicle: "+$scope.currentScreenVehicle);
        }
        else if(!$scope.positionBooleans[0])
        {
            $window.alert("You have either not selected all position values:x,y,z or there may be no data available for the selected position coordinates."); 
        }
        else if(!$scope.velocityBooleans[3])
        {
            $window.alert("Please select all velocity values:vx,vy,vz"); 
        }
        else if(!$scope.velocityBooleans[2])
        {
            $window.alert("Please select all the velocity values:vx,vy,vz from the same vehicle: "+$scope.currentScreenVehicle);
        }
        else if(!$scope.velocityBooleans[1])
        {
            $window.alert("Please select all the velocity values:vx,vy,vz from the same category of vehicle: "+$scope.currentScreenVehicle);
        }
        else if(!$scope.velocityBooleans[0])
        {
            $window.alert("You have either not selected all velocity values: or there may be no data available for the selected velocity coordinates.");
        }
        else if($scope.orbitstatus[$scope.currentVehicleId] === false && $scope.iconstatus[$scope.currentVehicleId] === false){
            if($window.confirm("You have not enabled orbit and icon for this vehicle.Do you want to enable either orbit or icon for the vehicle?")){
                   $scope.secondScreen = true;
                   $scope.firstScreen = false;
            } else {
                if($window.confirm("Please click ok if the selected \n position parameters are: x,y,z and velocity parameters are: vx,vy,vz.")){
                    $scope.secondScreen = false;
                    $scope.firstScreen = true;
                    $scope.settings.pdata[$scope.currentVehicleId] = angular.copy($scope.positionData[$scope.currentVehicleId]);
                    $scope.settings.vdata[$scope.currentVehicleId] = angular.copy($scope.velocityData[$scope.currentVehicleId]);
                    $scope.settings.iconstatus[$scope.currentVehicleId] = angular.copy($scope.iconstatus[$scope.currentVehicleId]);
                    $scope.settings.orbitstatus[$scope.currentVehicleId] = angular.copy($scope.orbitstatus[$scope.currentVehicleId]);

                    $scope.totalVelocityArray = [];
                    $scope.totalPositionArray = [];
                    $scope.widget.settings.dataArray = [];

                    $scope.velocityData = [];
                    $scope.positionData = [];

                    if ($window.innerWidth >= 1400){
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }

                }else {
                    $scope.secondScreen = true;
                    $scope.firstScreen = false;
                }

            }      
        }else {
            if($window.confirm("Please click ok if the selected \n position parameters are: x,y,z and velocity parameters are: vx,vy,vz.")){
                $scope.secondScreen = false;
                $scope.firstScreen = true;
                $scope.settings.pdata[$scope.currentVehicleId] = angular.copy($scope.positionData[$scope.currentVehicleId]);
                $scope.settings.vdata[$scope.currentVehicleId] = angular.copy($scope.velocityData[$scope.currentVehicleId]);
                $scope.settings.iconstatus[$scope.currentVehicleId] = angular.copy($scope.iconstatus[$scope.currentVehicleId]);
                $scope.settings.orbitstatus[$scope.currentVehicleId] = angular.copy($scope.orbitstatus[$scope.currentVehicleId]);

                $scope.totalVelocityArray = [];
                $scope.totalPositionArray = [];
                $scope.widget.settings.dataArray = [];

                $scope.velocityData = [];
                $scope.positionData = [];

                if ($window.innerWidth >= 1400){
                    $scope.lock.lockLeft = false;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
            }else {
                $scope.firstScreen = false;
                $scope.secondScreen = true;
            }
        } 
    }


    $scope.closeParameters = function(widget){
        $scope.secondScreen = false;
        $scope.firstScreen = true;

        $scope.positionData[$scope.currentVehicleId] = angular.copy($scope.settings.pdata[$scope.currentVehicleId]);
        $scope.parameters.pdata[$scope.currentVehicleId] = angular.copy($scope.settings.pdata[$scope.currentVehicleId]);

        $scope.iconstatus[$scope.currentVehicleId] = angular.copy($scope.settings.iconstatus[$scope.currentVehicleId]);
        $scope.orbitstatus[$scope.currentVehicleId] = angular.copy($scope.settings.orbitstatus[$scope.currentVehicleId]);

        if($scope.positionData[$scope.currentVehicleId].length === 3){
            $scope.pdisplay[$scope.currentVehicleId] = displayStringForInput($scope.positionData[$scope.currentVehicleId]);
        }else if($scope.positionData[$scope.currentVehicleId].length === 0){
            $scope.pdisplay[$scope.currentVehicleId] = "Click for data";
        }
        
        $scope.velocityData[$scope.currentVehicleId] = angular.copy($scope.settings.vdata[$scope.currentVehicleId]);
        $scope.parameters.vdata[$scope.currentVehicleId] = angular.copy($scope.settings.vdata[$scope.currentVehicleId]);

        if($scope.velocityData[$scope.currentVehicleId].length === 3){
            $scope.vdisplay[$scope.currentVehicleId] = displayStringForInput($scope.velocityData[$scope.currentVehicleId]);
        }else if($scope.velocityData[$scope.currentVehicleId].length === 0){
            $scope.vdisplay[$scope.currentVehicleId] = "Click for data";
        }

        if($scope.settings.pdata[$scope.currentVehicleId].length === 0 && $scope.settings.vdata[$scope.currentVehicleId].length === 0){
            $scope.orbitstatus[$scope.currentVehicleId] = true;
            $scope.iconstatus[$scope.currentVehicleId] = true;
        }

        if ($window.innerWidth >= 1400){
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
    }

    $scope.openPositionList = function(vehicleId) {
        // Just pro$scope.vehicleIde a template url, a controller and call 'open'.
        $uibModal.open({
            templateUrl: "./directives/groundtrack/positionList.html",
            controller: 'positionParametersCtrl',
            controllerAs: '$ctrl',
            resolve: {
                positionItems: function () {
                    return $scope.parameters;
                },
                vehicleId: function(){
                    return $scope.currentVehicleId;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            if(dataItems.pdata[vehicleId].length === 3){
                $scope.pdisplay[vehicleId] = displayStringForInput(dataItems.pdata[vehicleId]);
                $scope.positionData[vehicleId] = angular.copy(dataItems.pdata[vehicleId]);
            }else if(dataItems.length === 0){
                $scope.pdisplay[vehicleId]= "Click for data";
            }     
        },
        function () {
            //handle modal dismiss
        });
    };

    $scope.openVelocityList = function(vehicleId) {
        // Just pro$scope.vehicleIde a template url, a controller and call 'open'.
        $uibModal.open({
            templateUrl: "./directives/groundtrack/velocityList.html",
            controller: 'velocityParametersCtrl',
            controllerAs: '$ctrl',
            resolve: {
                velocityItems: function () {
                    return $scope.parameters;
                },
                vehicleId: function(){
                    return $scope.currentVehicleId;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            if(dataItems.vdata[vehicleId].length === 3){
                $scope.vdisplay[vehicleId] = displayStringForInput(dataItems.vdata[vehicleId]);
                $scope.velocityData[vehicleId] = angular.copy(dataItems.vdata[vehicleId]);
            }else if(dataItems.vdata[vehicleId].length === 0){
                $scope.vdisplay[vehicleId] = "Click for data";
            }     
        },
        function () {
            //handle modal dismiss
        });
    };

    $scope.$on("$destroy",
        function(event) {
            $interval.cancel($scope.interval);
        }
    );

    //not being used now
    function makeModelData(data){
        var tempVehicles = [];
        if($scope.widget.settings.vehicles.length > 0){
            for(var i=0;i<data.length;i++){
                tempVehicles.push({
                    id:i,
                    label:data[i].name
                });
            }

        }else {
            $scope.checkedValues = [];
            $scope.settings.checkedValues = [];
            $scope.settings.pdata = [];
            $scope.settings.vdata = [];
            $scope.settings.orbitstatus = [];
            $scope.settings.iconstatus = [];

            for(var i=0;i<data.length;i++){
                tempVehicles.push({
                    id:i,
                    label:data[i].name
                });
                $scope.iconstatus.push(true);
                $scope.orbitstatus.push(true);
                $scope.positionData.push([]);
                $scope.velocityData.push([]);
                $scope.settings.pdata.push([]);
                $scope.settings.vdata.push([]);
                // $scope.positionDisplay.push("Click for data");
                // $scope.velocityDisplay.push("Click for data");
                $scope.pdisplay.push("Click for data");
                $scope.vdisplay.push("Click for data");
                $scope.checkedValues.push({status:false});
            }
        }
        return tempVehicles;
    }

    function getRecentSelectedValues(selectedArray,count){
        var parameters = [];
        var arrayLen = selectedArray.length;
        for(var i=arrayLen-count;i<arrayLen;i++){
            parameters.push(selectedArray[i]);
        }
        return parameters;
    }

    function checkforSameVehicle(velocityData,positionData){
        var status = true;
        var attDataLen = velocityData.length;
        var posDataLen = positionData.length;
        for(var i=0;i<attDataLen;i++){
            for(var j=0;j<posDataLen;j++){
                if(velocityData[i].vehicle !== positionData[j].vehicle){
                    status = false;
                }
            }
        }
        return status;
    }

    function displayStringForInput(selectedArray){
        var dString = "";
        var arrayLen = selectedArray.length
        for(var k=0;k<arrayLen;k++){
            if(k < arrayLen-1){
                dString = dString + selectedArray[k].id + "," ;
            }else if(k === arrayLen-1){
                dString = dString + selectedArray[k].id;
            }
        }
        return dString;
    }

    function getSelectedArray(selectedArray){
        var data = [];
        var arrayLen = selectedArray.length;
        for(var b=0;b<arrayLen;b++){
            data.push(selectedArray[b]);
        }
        return data;
    }

    function removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};

        for(var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }

        return newArray;
    }

    function removeCategories(filteredArray){
        var data = [];
        var arrayLen = filteredArray.length;
        for(var i=0;i<arrayLen;i++){
           var datavalue = dashboardService.getData(filteredArray[i].key);
           if(datavalue){
               if(datavalue.hasOwnProperty("value")){
                    data.push(filteredArray[i]);
                }
           }
        }
        return data;
    }

    function isAnyDiffVehicles(filteredArray,vehName){
        var arrayLen = filteredArray.length;
        var count = 0;
        for(var i = 0; i < arrayLen; i++){
            if(filteredArray[i].vehicle !== vehName ){
                count++;
            }
        }

        if(count > 0){
            return true;
        }else {
            return false;
        }
    }

    function filterSelectedData(selectedArray){
        var tagArray = [];
        var mostCommonTag = "";
        var arrayLen = selectedArray.length;
        for(var i=0;i<arrayLen;i++){
            tagArray.push({"category":selectedArray[i].category,"vehicle":selectedArray[i].vehicle});
        }

        var mf = 1;
        var m = 0;
        var item;
        var tagArrayLen = tagArray.length;
        for (var j=0; j<tagArrayLen; j++)
        {
            for (var p=j; p<tagArrayLen; p++)
            {
                if (tagArray[j].category === tagArray[p].category && tagArray[j].vehicle === tagArray[p].vehicle)
                 m++;
                if (mf<m)
                {
                  mf=m; 
                  item = tagArray[j];
                }
            }
            m=0;
        }

        var filteredArray = [];

        if(item){
            for(var k=0;k<arrayLen;k++){
                if(selectedArray[k].category === item.category && selectedArray[k].vehicle === item.vehicle){
                    filteredArray.push(selectedArray[k]);
                }
            }
            return filteredArray;
        }else {
            return [];
        }
    }
});

app.controller('positionParametersCtrl',function($scope,$uibModalInstance,positionItems,$uibModal,vehicleId) {
    var $ctrl = this;
    $ctrl.data = positionItems;
    $ctrl.currentVehicleId = vehicleId;
    var values = angular.copy(positionItems);

    $ctrl.close = function() {
        $ctrl.data.pdata = values.pdata;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModal.open({
            templateUrl: "./directives/groundtrack/confirmParameter.html",
            controller: 'confirmParametersCtrl',
            controllerAs: '$ctrl',
            resolve: {
                dataLabel: function () {
                    return "Is the position coordinates selected order is:x,y,z?";
                },
                dataItems: function(){
                    return $ctrl.data;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            $uibModalInstance.close(dataItems);
        },
        function () {
            //handle modal dismiss
        });
    }
});

app.controller('velocityParametersCtrl',function($scope,$uibModalInstance,velocityItems,$uibModal,vehicleId) {
    var $ctrl = this;
    $ctrl.data = velocityItems;
    $ctrl.currentVehicleId = vehicleId;
    var values = angular.copy(velocityItems);

    $ctrl.close = function() {
        $ctrl.data.vdata = values.vdata;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModal.open({
            templateUrl: "./directives/groundtrack/confirmParameter.html",
            controller: 'confirmParametersCtrl',
            controllerAs: '$ctrl',
            resolve: {
                dataLabel: function () {
                    return "Is the velocity coordinates selected order is:vx,vy,vz?";
                },
                dataItems: function(){
                    return $ctrl.data;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            $uibModalInstance.close(dataItems);
        },
        function () {
            //handle modal dismiss
        });
    }
});

app.controller('confirmParametersCtrl',function($scope,$uibModalInstance,dataLabel,dataItems) {
    var $ctrl = this;
    $ctrl.modalLabel = dataLabel;
    $ctrl.finalData = dataItems;
    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModalInstance.close($ctrl.finalData);
    }
});

