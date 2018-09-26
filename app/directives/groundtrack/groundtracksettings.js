app.directive('groundtracksettings', function() { 
    return {
        restrict: 'EA',
        templateUrl:'./directives/groundtrack/groundtracksettings.html',
        controller: 'GroundSettingsCtrl'
    }
});

app.controller('GroundSettingsCtrl',['$scope', 'dashboardService', '$interval','$mdSidenav','$window','sidebarService','$uibModal', function($scope, dashboardService, $interval,$mdSidenav,$window,sidebarService,$uibModal) {
    var colors = [ "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
    var previousCheckedValues;
    $scope.settings = new Object(); // settings object for settings selection
    $scope.settings.vehicles = []; // array to store selected vehicle names
    $scope.settings.pdata = []; // array to store selected parameters for position for each selected vehicle
    $scope.settings.vdata = []; // array to store selected parameters for velocity for each selected vehicle
    $scope.settings.orbitstatus = []; // array to store orbit enabled or disabled status for each selected vehicle
    $scope.settings.iconstatus = []; // array to store icon enabled or disabled status for each selected vehicle
    $scope.firstScreen = true; // initial value of firstScreen is true to display vehicle selection of settings menu
    $scope.secondScreen = false; // Initial value of secondScreen is false to hide position and velocity selection after vehicle
    $scope.positionData = []; // temp array to store position data for each vehicle
    $scope.velocityData = [];// temp array tp store velocity data for each vehicle
    $scope.vehicle = []; // temp array to store selected vehicles
    $scope.iconstatus = []; // temp array to store icon status for each vehicle
    $scope.orbitstatus = []; // temp array to store orbit status for each vehicle
    $scope.checkedValues = []; //temp array to store checkbox status for each vehicle
    $scope.velocityBooleans = [true, true, true, true];
    $scope.positionBooleans = [true, true, true, true];
    $scope.totalVelocityArray = []; // temp array to receive position data from sidebar service
    $scope.totalPositionArray = []; // temp array to receive velocity data from sidebar service
    $scope.chosenCategory; // variable to store field chosen
   // $scope.vehicleSelected = false; // required tag for vehicle selection
    $scope.vehicleMsg = "";
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

    $scope.positionInputStyles={};
    $scope.velocityInputStyles={};
    $scope.positionBtnStyles={};
    $scope.velocityBtnStyles={};
    $scope.positionparametersErrMsg = "";
    $scope.velocityparametersErrMsg = "";
    
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
        $scope.vehicleMsg  = "";
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
                    $scope.vehicleMsg = "Please select all coordinates for selected vehicles.";
                    break;
                }
            }else {
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
                $scope.vehicleMsg  = "";
            }
        }

        if(vehSelectedCount > 0) {
            if(count === (vehSelectedCount * 6)){
                widget.main = true;
                widget.settings.active = false;
                $scope.vehicleMsg  = "";
                previousCheckedValues = angular.copy($scope.checkedValues);
            } else {
                widget.main = false;
                widget.settings.active = true;
               // previousCheckedValues = angular.copy($scope.checkedValues);
            }
        } else {
            widget.main = true;
            widget.settings.active = false;
            $scope.vehicleMsg  = "";
            previousCheckedValues = angular.copy($scope.checkedValues);
            //$scope.vehicleMsg = "Please select atleast one vehicle before you save!";
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
                                $scope.checkedValues[index] = {status:false};
                                $scope.totalPositionArray[index] = [];
                                $scope.totalVelocityArray[index] = [];
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
                                $scope.totalPositionArray[i] = angular.copy($scope.widget.settings.vehicles[i].pdata);
                                
                                $scope.velocityData[j] = angular.copy($scope.widget.settings.vehicles[i].vdata);
                                $scope.settings.vdata[j] = angular.copy($scope.widget.settings.vehicles[i].vdata);
                                $scope.totalVelocityArray[i] = angular.copy($scope.widget.settings.vehicles[i].vdata);
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
           // $scope.velocityBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the velocity data selected doesn't pass
           // $scope.positionBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the position data selected doesn't pass
            if($scope.chosenCategory == 'velocity') //if the velocity input box has been chosen
            {
                //push the last chosen data value into the corresponding velocity array
                $scope.totalVelocityArray[$scope.currentVehicleId].push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }
            else if($scope.chosenCategory == 'position') //if the position input box has been chosen
            {
                //push the last chosen data value into the corresponding position array
                $scope.totalPositionArray[$scope.currentVehicleId].push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }

            var positionArray = [];
            var positionSettings = [];

            positionArray = angular.copy($scope.totalPositionArray[$scope.currentVehicleId]);

            //if the temp position array has length more than 3 then reduce its size to recent 3
            if(positionArray.length > 3){
                positionSettings = getRecentSelectedValues(positionArray,3);
            }else {
                positionSettings = positionArray;
            }
            
            if(positionSettings.length === 3){
                var positionSettingsfiltered1 = removeCategories(positionSettings);//to remove selected group or categories while opening the list
                //var positionSettingsfiltered2 = removeDuplicates(positionSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffPositionVeh = isAnyDiffVehicles(positionSettingsfiltered1,$scope.currentScreenVehicle);// to check if all the values are of the same vehicle
               // var positionfilteredData = filterSelectedData(positionSettingsfiltered1);// check if there are any different values of a category
               // if(isDiffPositionVeh === false && positionfilteredData.length === positionSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                if(isDiffPositionVeh === false && positionSettingsfiltered1.length === 3){    
                    if(positionSettingsfiltered1.length === 3){  
                        $scope.positionData[$scope.currentVehicleId] = angular.copy(positionSettingsfiltered1);
                        $scope.vehicle[$scope.currentVehicleId] = positionSettingsfiltered1[0].vehicle;
                        $scope.totalPositionArray[$scope.currentVehicleId] = angular.copy(positionSettingsfiltered1);
                        //$scope.positionparametersErrMsg = "";
                        $scope.positionBooleans[0] = true;
                        $scope.positionBooleans[1] = true;
                        $scope.positionBooleans[2] = true;
                        $scope.positionBooleans[3] = true;
                    }
                    // else if(positionSettingsfiltered1.length < 3){
                    //     $scope.vehicle[$scope.currentVehicleId] = "";
                    //     $scope.positionData[$scope.currentVehicleId] = [];
                    //     $scope.positionBooleans[0] = false;
                    //     $scope.positionBooleans[1] = true;
                    //     $scope.positionBooleans[2] = true;
                    //     $scope.positionBooleans[3] = true;
                    // }
                }
                else if(positionSettingsfiltered1.length < 3){
                        $scope.vehicle[$scope.currentVehicleId] = "";
                        $scope.positionData[$scope.currentVehicleId] = [];
                        $scope.positionBooleans[0] = false;
                        $scope.positionBooleans[1] = true;
                        $scope.positionBooleans[2] = true;
                        $scope.positionBooleans[3] = true;
                }
                else if(isDiffPositionVeh === false ){
                    $scope.vehicle[$scope.currentVehicleId] = "";
                    $scope.positionData[$scope.currentVehicleId] = [];
                    $scope.positionBooleans[1] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[2] = true;
                    $scope.positionBooleans[3] = true;
                }
                else if(isDiffPositionVeh === true && positionSettingsfiltered1.length === 3){
                    $scope.vehicle[$scope.currentVehicleId] = "";
                    $scope.positionData[$scope.currentVehicleId] = [];
                    //$scope.positionparametersErrMsg = "";
                    $scope.positionBooleans[2] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[3] = true;
                }
                else if(isDiffPositionVeh === true && positionSettingsfiltered1.length !== 3){
                    $scope.vehicle[$scope.currentVehicleId] = "";
                    $scope.positionData[$scope.currentVehicleId] = [];
                    $scope.positionBooleans[2] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[3] = true;
                }
            }else {
                $scope.vehicle[$scope.currentVehicleId] = "";
                $scope.positionData[$scope.currentVehicleId] = [];
                $scope.positionBooleans[3] = false;
                $scope.positionBooleans[0] = true;
                $scope.positionBooleans[1] = true;
                $scope.positionBooleans[2] = true;
            }

            var velocityArray = [];
            var velocitySettings = [];

            velocityArray = angular.copy($scope.totalVelocityArray[$scope.currentVehicleId]);

            //if the temp velocity array has length more than 4 then reduce its size to recent 4
            if(velocityArray.length > 3){
                velocitySettings = getRecentSelectedValues(velocityArray,3);
            }else {
                velocitySettings = velocityArray;
            }

            if(velocitySettings.length === 3){
                var velocitySettingsfiltered1 = removeCategories(velocitySettings); //to remove selected group or categories while opening the list
               // var velocitySettingsfiltered2 = removeDuplicates(velocitySettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffVelocityVeh = isAnyDiffVehicles(velocitySettingsfiltered1,$scope.currentScreenVehicle);// to check if all the values are of the same vehicle
               // var velocityfilteredData = filterSelectedData(velocitySettingsfiltered2); // check if there are any different values of a category
               // if(isDiffVelocityVeh === false && velocityfilteredData.length === velocitySettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                if(isDiffVelocityVeh === false && velocitySettingsfiltered1.length === 3){    
                    if(velocitySettingsfiltered1.length === 3){  
                        $scope.velocityData[$scope.currentVehicleId] = angular.copy(velocitySettingsfiltered1);
                        $scope.vehicle[$scope.currentVehicleId] = velocitySettingsfiltered1[0].vehicle;
                        $scope.totalVelocityArray[$scope.currentVehicleId] = angular.copy(velocitySettingsfiltered1);
                        //$scope.velocityparametersErrMsg = "";
                        $scope.velocityBooleans[0] = true;
                        $scope.velocityBooleans[1] = true;
                        $scope.velocityBooleans[2] = true;
                        $scope.velocityBooleans[3] = true;
                    }
                    // else if(velocitySettingsfiltered1.length < 3){
                    //     $scope.vehicle[$scope.currentVehicleId] = "";
                    //     $scope.velocityData[$scope.currentVehicleId] = [];
                    //     $scope.velocityBooleans[0] = false;
                    //     $scope.velocityBooleans[1] = true;
                    //     $scope.velocityBooleans[2] = true;
                    //     $scope.velocityBooleans[3] = true;
                    // }
                }
                else if(velocitySettingsfiltered1.length < 3){
                    $scope.vehicle[$scope.currentVehicleId] = "";
                    $scope.velocityData[$scope.currentVehicleId] = [];
                    $scope.velocityBooleans[0] = false;
                    $scope.velocityBooleans[1] = true;
                    $scope.velocityBooleans[2] = true;
                    $scope.velocityBooleans[3] = true;
                }
                else if(isDiffVelocityVeh === false){
                    $scope.vehicle[$scope.currentVehicleId] = "";
                    $scope.velocityData[$scope.currentVehicleId] = [];
                    $scope.velocityBooleans[1] = false;
                    $scope.velocityBooleans[0] = true;
                    $scope.velocityBooleans[2] = true;
                    $scope.velocityBooleans[3] = true;
                }
                else if(isDiffVelocityVeh === true && velocitySettingsfiltered1.length === 3){
                    $scope.vehicle[$scope.currentVehicleId] = "";
                    $scope.velocityData[$scope.currentVehicleId] = [];
                    //$scope.velocityparametersErrMsg = "";
                    $scope.velocityBooleans[2] = false;
                    $scope.velocityBooleans[0] = true;
                    $scope.velocityBooleans[1] = true;
                    $scope.velocityBooleans[3] = true;
                }
                else if(isDiffVelocityVeh === true && velocitySettingsfiltered1.length !== 3){
                    $scope.vehicle[$scope.currentVehicleId] = "";
                    $scope.velocityData[$scope.currentVehicleId] = [];
                    $scope.velocityBooleans[2] = false;
                    $scope.velocityBooleans[0] = true;
                    $scope.velocityBooleans[1] = true;
                    $scope.velocityBooleans[3] = true;
                }
            }else {
                $scope.vehicle[$scope.currentVehicleId] = "";
                $scope.velocityData[$scope.currentVehicleId] = [];
                $scope.velocityBooleans[3] = false;
                $scope.velocityBooleans[0] = true;
                $scope.velocityBooleans[1] = true;
                $scope.velocityBooleans[2] = true;                
            }     
        }else
        {
            $scope.velocityData[$scope.currentVehicleId] = null;
            $scope.positionData[$scope.currentVehicleId] = null;
        }
    }

    $scope.getTelemetrydata = function(category, vid){
        //open the data menu
        $scope.chosenCategory = category; //which input box has been selected (position or velocity)
        $scope.currentVehicleId = vid;
        sidebarService.setTempWidget($scope.widget, this); //pass widget and controller functions to sidebarService
        if ($window.innerWidth <= 1440){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = true;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
        sidebarService.setOpenLogo(false); //set to false if data menu opened through this Qwidget
    }

    //display telemetry id chosen by the user in the right input box
    $scope.readValues = function(field) {
        var trimmedData = [];
        // var stringData = "";
        $scope.stringPositionData = "";
        $scope.stringVelocityData = "";

        if(field == "velocity") {
            if($scope.totalVelocityArray[$scope.currentVehicleId]) {
                trimmedData = getRecentSelectedValues($scope.totalVelocityArray[$scope.currentVehicleId], 3);
            }

            for(var i = 0; i < trimmedData.length; i++) {
                if(trimmedData[i]) {
                    if(i == trimmedData.length - 1) {
                        $scope.stringVelocityData += trimmedData[i].id
                    }
                    else {
                        $scope.stringVelocityData += trimmedData[i].id + ", ";
                    }
                }
            }
            if($scope.stringVelocityData) {
                return $scope.stringVelocityData;
            }
            else {
                return "";
            }
        }
        else if(field == "position") {
            if($scope.totalPositionArray[$scope.currentVehicleId]) {
                trimmedData = getRecentSelectedValues($scope.totalPositionArray[$scope.currentVehicleId], 3);
            }
            
            for(var i = 0; i < trimmedData.length; i++) {
                if(trimmedData[i]) {
                    if(i == trimmedData.length - 1) {
                        $scope.stringPositionData += trimmedData[i].id
                    }
                    else {
                        $scope.stringPositionData += trimmedData[i].id + ", ";
                    }
                }
            }

            if($scope.stringPositionData) {
                return $scope.stringPositionData;
            }
            else {
                return "";
            }
        }
    }

    $scope.saveParameters = function(widget){
        $scope.vehicleMsg = "";
        $scope.positionparametersErrMsg = "";
        $scope.velocityparametersErrMsg = "";
        $scope.positionInputStyles = {};
        $scope.positionBtnStyles = {};
        $scope.velocityInputStyles={};
        $scope.velocityBtnStyles = {};
        //display alerts for conditions that were originally checked in getValue
        if($scope.totalPositionArray[$scope.currentVehicleId].length === 0){
            $scope.positionparametersErrMsg = "Please fill out this field.";
            $scope.positionInputStyles={'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalVelocityArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.velocityparametersErrMsg = "Please fill out this field.";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[3]){ 
                $scope.velocityparametersErrMsg = "Required: All velocity coordinates(x,y,z)!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[2]){ 
                $scope.velocityparametersErrMsg = "Select velocity coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }
        }else if(!$scope.positionBooleans[3]){
            $scope.positionparametersErrMsg = "Required: All position values(x,y,z)!";
            $scope.positionInputStyles={'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalVelocityArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.velocityparametersErrMsg = "Please fill out this field.";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[3]){ 
                $scope.velocityparametersErrMsg = "Required: All velocity coordinates(x,y,z)!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[2]){ 
                $scope.velocityparametersErrMsg = "Select velocity coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }
        }else if(!$scope.positionBooleans[2]){
            $scope.positionparametersErrMsg = "Select position coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
            $scope.positionInputStyles={'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalVelocityArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.velocityparametersErrMsg = "Please fill out this field.";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[3]){ 
                $scope.velocityparametersErrMsg = "Required: All velocity coordinates(x,y,z)!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[2]){ 
                $scope.velocityparametersErrMsg = "Select velocity coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }
        }else if(!$scope.positionBooleans[0]){
            $scope.positionparametersErrMsg = "Required: All position values(x,y,z)!";
            $scope.positionInputStyles={'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalVelocityArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.velocityparametersErrMsg = "Please fill out this field.";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[3]){ 
                $scope.velocityparametersErrMsg = "Required: All velocity coordinates(x,y,z)!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.velocityBooleans[2]){ 
                $scope.velocityparametersErrMsg = "Select velocity coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.velocityInputStyles = {'border-color':'#dd2c00'};
                $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            }
        }
        // else if(!$scope.positionBooleans[1] && $scope.totalPositionArray[$scope.currentVehicleId].length > 0 && $scope.totalPositionArray[$scope.currentVehicleId].length < 3){
        //      $scope.positionparametersErrMsg = "Select each coordinate(no duplicates) from same category of vehicle!";
        // }
        else if($scope.totalVelocityArray[$scope.currentVehicleId].length === 0)
        {
            $scope.velocityparametersErrMsg = "Please fill out this field.";
            $scope.velocityInputStyles = {'border-color':'#dd2c00'};
            $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalPositionArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Select position coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
        }
        else if(!$scope.velocityBooleans[3])
        {
            $scope.velocityparametersErrMsg = "Required: All velocity values(x,y,z)!";
            $scope.velocityInputStyles = {'border-color':'#dd2c00'};
            $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalPositionArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Select position coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }

        }
        else if(!$scope.velocityBooleans[2])
        {
            $scope.velocityparametersErrMsg =  "Select velocity coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
            $scope.velocityInputStyles = {'border-color':'#dd2c00'};
            $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalPositionArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Select position coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }

        }
        else if(!$scope.velocityBooleans[0])
        {
            $scope.velocityparametersErrMsg = "Required: All velocity values(x,y,z)!";
            $scope.velocityInputStyles = {'border-color':'#dd2c00'};
            $scope.velocityBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.totalPositionArray[$scope.currentVehicleId].length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Select position coordinates from vehicle: "+$scope.currentScreenVehicle+"!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }

        }
        // else if(!$scope.velocityBooleans[1] && $scope.totalVelocityArray[$scope.currentVehicleId].length > 0 && $scope.totalVelocityArray[$scope.currentVehicleId].length < 3)
        // {
        //     $scope.velocityparametersErrMsg = "Select each coordinate(no duplicates) from same category of vehicle!";
        // }
        else if($scope.positionData[$scope.currentVehicleId].length === 3 && $scope.velocityData[$scope.currentVehicleId].length === 3){
            $uibModal.open({
                templateUrl: "./directives/groundtrack/confirmParameter.html",
                controller: 'confirmParametersCtrl',
                controllerAs: '$ctrl',
                bindToController: true,
                scope: $scope,
                resolve: {
                    dataLabel: function () {
                        return "Did you select position coordinates(x,y,z) and velocity coordinates(x,y,z)?";
                    },
                    dataItems: function(){
                        return $scope.settings;
                    }
                }
            }).result.then(function(dataItems){
                //handle modal close with response
                $scope.secondScreen = false;
                $scope.firstScreen = true;
                $scope.settings.pdata[$scope.currentVehicleId] = angular.copy($scope.positionData[$scope.currentVehicleId]);
                $scope.settings.vdata[$scope.currentVehicleId] = angular.copy($scope.velocityData[$scope.currentVehicleId]);
                $scope.settings.iconstatus[$scope.currentVehicleId] = angular.copy($scope.iconstatus[$scope.currentVehicleId]);
                $scope.settings.orbitstatus[$scope.currentVehicleId] = angular.copy($scope.orbitstatus[$scope.currentVehicleId]);

                $scope.totalVelocityArray[$scope.currentVehicleId] = getRecentSelectedValues($scope.totalVelocityArray[$scope.currentVehicleId], 3);
                $scope.totalPositionArray[$scope.currentVehicleId] = getRecentSelectedValues($scope.totalPositionArray[$scope.currentVehicleId], 3);
                $scope.widget.settings.dataArray = [];
               
                if ($window.innerWidth > 1440){
                    $scope.lock = dashboardService.getLock();
                    $scope.lock.lockLeft = false;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }


                $scope.velocityBooleans = [true, true, true, true];
                $scope.positionBooleans = [true, true, true, true];
                $scope.velocityInputStyles={};
                $scope.velocityBtnStyles={};
                $scope.positionInputStyles={};
                $scope.positionBtnStyles={};
                $scope.velocityparametersErrMsg = "";
                $scope.positionparametersErrMsg = "";
            },
            function () {
            //handle modal dismiss
                $scope.firstScreen = false;
                $scope.secondScreen = true;

                $scope.velocityBooleans = [true, true, true, true];
                $scope.positionBooleans = [true, true, true, true];
                $scope.velocityInputStyles={};
                $scope.velocityBtnStyles={};
                $scope.positionInputStyles={};
                $scope.positionBtnStyles={};
                $scope.velocityparametersErrMsg = "";
                $scope.positionparametersErrMsg = "";
            });
        } 
    }


    $scope.closeParameters = function(widget){
        $scope.secondScreen = false;
        $scope.firstScreen = true;

        $scope.positionData[$scope.currentVehicleId] = angular.copy($scope.settings.pdata[$scope.currentVehicleId]);
        $scope.totalPositionArray[$scope.currentVehicleId] = $scope.positionData[$scope.currentVehicleId];
        $scope.iconstatus[$scope.currentVehicleId] = angular.copy($scope.settings.iconstatus[$scope.currentVehicleId]);
        $scope.orbitstatus[$scope.currentVehicleId] = angular.copy($scope.settings.orbitstatus[$scope.currentVehicleId]);
        $scope.velocityData[$scope.currentVehicleId] = angular.copy($scope.settings.vdata[$scope.currentVehicleId]);
        $scope.totalVelocityArray[$scope.currentVehicleId] = $scope.velocityData[$scope.currentVehicleId];
        $scope.positionparametersErrMsg = "";
        $scope.velocityparametersErrMsg = "";
        if($scope.settings.pdata[$scope.currentVehicleId].length === 0 && $scope.settings.vdata[$scope.currentVehicleId].length === 0){
            $scope.orbitstatus[$scope.currentVehicleId] = true;
            $scope.iconstatus[$scope.currentVehicleId] = true;
        }

        if ($window.innerWidth > 1440){
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        $scope.vehicleMsg = "";
        $scope.velocityBooleans = [true, true, true, true];
        $scope.positionBooleans = [true, true, true, true];
        $scope.velocityInputStyles={};
        $scope.velocityBtnStyles={};
        $scope.positionInputStyles={};
        $scope.positionBtnStyles={};
        $scope.velocityparametersErrMsg = "";
        $scope.positionparametersErrMsg = "";
    }

    $scope.openPositionList = function(vehicleId) {
        // Just provides a modal with a template url, a controller and call 'open'.
        $scope.settings.tempPositions = angular.copy($scope.totalPositionArray);
        $scope.settings.tempPositions[vehicleId] = angular.copy(getRecentSelectedValues($scope.totalPositionArray[vehicleId], 3));
        $uibModal.open({
            templateUrl: "./directives/groundtrack/positionList.html",
            controller: 'positionParametersCtrl',
            controllerAs: '$ctrl',
            resolve: {
                positionItems: function () {
                    return $scope.settings;
                },
                vehicleId: function(){
                    return $scope.currentVehicleId;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            if(dataItems.tempPositions[vehicleId].length === 3){
                $scope.positionData[vehicleId] = angular.copy(dataItems.tempPositions[vehicleId]);
                $scope.totalPositionArray[vehicleId] = angular.copy(dataItems.tempPositions[vehicleId]);
            }   
        },
        function () {
            //handle modal dismiss
        });
    };

    $scope.openVelocityList = function(vehicleId) {
        // Just provides a modal with a  template url, a controller and call 'open'.
        $scope.settings.tempVelocities = angular.copy($scope.totalVelocityArray);
        $scope.settings.tempVelocities[vehicleId] = angular.copy(getRecentSelectedValues($scope.totalVelocityArray[vehicleId], 3)); 
        $uibModal.open({
            templateUrl: "./directives/groundtrack/velocityList.html",
            controller: 'velocityParametersCtrl',
            controllerAs: '$ctrl',
            resolve: {
                velocityItems: function () {
                    return $scope.settings;
                },
                vehicleId: function(){
                    return $scope.currentVehicleId;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            if(dataItems.tempVelocities[vehicleId].length === 3){
                $scope.velocityData[vehicleId] = angular.copy(dataItems.tempVelocities[vehicleId]);
                $scope.totalVelocityArray[vehicleId] = angular.copy(dataItems.tempVelocities[vehicleId]);
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

}]);

app.controller('positionParametersCtrl',['$scope','$uibModalInstance','positionItems','$uibModal','vehicleId', function($scope,$uibModalInstance,positionItems,$uibModal,vehicleId) {
    var $ctrl = this;
    $ctrl.data = positionItems;
    $ctrl.currentVehicleId = vehicleId;
    var values = angular.copy(positionItems);

    $ctrl.close = function() {
        $ctrl.data.tempPositions = values.tempPositions;
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
}]);

app.controller('velocityParametersCtrl',['$scope','$uibModalInstance','velocityItems','$uibModal','vehicleId', function($scope,$uibModalInstance,velocityItems,$uibModal,vehicleId) {
    var $ctrl = this;
    $ctrl.data = velocityItems;
    $ctrl.currentVehicleId = vehicleId;
    var values = angular.copy(velocityItems);

    $ctrl.close = function() {
        $ctrl.data.tempVelocities = values.tempVelocities;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModal.open({
            templateUrl: "./directives/groundtrack/confirmParameter.html",
            controller: 'confirmParametersCtrl',
            controllerAs: '$ctrl',
            resolve: {
                dataLabel: function () {
                    return "Is the velocity coordinates selected order is:x,y,z?";
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
}]);

app.controller('confirmParametersCtrl',['$scope','$uibModalInstance','dataLabel','dataItems', function($scope,$uibModalInstance,dataLabel,dataItems) {
    var $ctrl = this;
    $ctrl.modalLabel = dataLabel;
    $ctrl.finalData = dataItems;
    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModalInstance.close($ctrl.finalData);
    }
}]);

