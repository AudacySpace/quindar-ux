app.directive('groundtracksettings', function() { 
  	return { 
    	restrict: 'EA', 
		templateUrl:'./directives/groundtrack/groundtracksettings.html',
		controller: 'GroundSettingsCtrl'
    }
});

app.controller('GroundSettingsCtrl', function($scope, dashboardService, $interval,$mdSidenav,$window,sidebarService,$uibModal) {
    var colors = [ "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
    $scope.settings = new Array();
    $scope.selectByGroupData = [];
    $scope.firstScreen = true;
    $scope.secondScreen = false;
    $scope.positionData = [];
    $scope.velocityData = [];
    $scope.vdisplay = [];
    $scope.pdisplay = [];
    $scope.vehicle = [];
    $scope.pdisplay = [];
    $scope.vdisplay = [];
    $scope.iconstatus = [];
    $scope.orbitstatus = [];
    $scope.positionDisplay = [];
    $scope.velocityDisplay = [];
    $scope.checkedValues = {};
    $scope.parameters = {
        pdata: $scope.positionData,
        vdata: $scope.velocityData
    }
    $scope.vehicleSelected = false;
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

    createVehicles();

    $scope.closeWidget = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        var previousSettings = angular.copy(widget.settings);
        if(previousSettings.vehicles.length > 0){
            for(var i=0;i<previousSettings.vehicles.length;i++){
                $scope.iconstatus[i] = previousSettings.vehicles[i].iconStatus;
                $scope.orbitstatus[i] = previousSettings.vehicles[i].orbitStatus;
                $scope.checkedValues[i].status = previousSettings.vehicles[i].dataStatus;
                $scope.positionData[i] = angular.copy(previousSettings.vehicles[i].pdata);
                $scope.velocityData[i] = angular.copy(previousSettings.vehicles[i].vdata);
            }
        }else {
            for(var k=0;k<$scope.selectByGroupData.length;k++){
                $scope.checkedValues[k].status = false;
            } 
        }

    }

    $scope.saveWidget = function(widget){
        widget.saveLoad = false;
        widget.delete = false;

        //reset the vehicle settings
        $scope.widget.settings.vehicles = [];
        var count = 0;
        var vehSelectedCount = 0;

        for(var i=0;i<$scope.selectByGroupData.length;i++){
            if($scope.checkedValues[i].status === true){
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
                vehSelectedCount++;
            }else {

            }
        }

        if(vehSelectedCount > 0){
            if(count === (vehSelectedCount * 6)){
                widget.main = true;
                widget.settings.active = false;
                for(var i=0; i<$scope.selectByGroupData.length; i++){
                    try{
                        var vehicle = {
                            "name" : $scope.selectByGroupData[i].label,
                            "dataStatus" : $scope.checkedValues[i].status,
                            "orbitStatus" : $scope.settings.orbitstatus[i],
                            "iconStatus" : $scope.settings.iconstatus[i],
                            "color": colors[i],
                            "pdata":$scope.settings.pdata[i],
                            "vdata":$scope.settings.vdata[i]
                        }
                        $scope.widget.settings.vehicles.push(vehicle);
                    }
                    catch(e){
                        console.log(e instanceof TypeError);
                    }
                }

                previousSettings = angular.copy($scope.widget.settings);
            }else {
                $window.alert("Please select all parameters for all the vehicles selected!");
            }
        }else {
             $window.alert("Please select atleast one vehicle before you save!");
        }
    }

    function createVehicles(){
        $scope.settings.vehicles = [];
        $scope.settings.pdata = [];
        $scope.settings.vdata = [];
        $scope.settings.iconstatus = [];
        $scope.settings.orbitstatus = [];
        var interval = $interval(function(){
            var currentMission = dashboardService.getCurrentMission();
            if(currentMission.missionName != ""){
                dashboardService.getConfig(currentMission.missionName)
                .then(function(response){
                    if(response.data) {
                        var data = dashboardService.sortObject(response.data);
                        var count = 0;
                        for(var key in data) {
                            if(data.hasOwnProperty(key)) {
                                count = count+1;
                                var dataStatus = true;
                                var orbitStatus = true;
                                var iconStatus = true;

                                // if widget settings exist, set settings using those values
                                if($scope.widget.settings.vehicles.length > 0){
                                    for(var i=0; i<$scope.widget.settings.vehicles.length; i++){    
                                        if(key == $scope.widget.settings.vehicles[i].name){
                                            $scope.checkedValues[i] = {
                                                status:$scope.widget.settings.vehicles[i].dataStatus
                                            }; 
                                            $scope.orbitstatus[i] = $scope.widget.settings.vehicles[i].orbitStatus;
                                            $scope.settings.orbitstatus[i] = $scope.widget.settings.vehicles[i].orbitStatus;
                                            $scope.iconstatus[i] = $scope.widget.settings.vehicles[i].iconStatus;
                                            $scope.settings.iconstatus[i] = $scope.widget.settings.vehicles[i].iconStatus;
                                            $scope.positionData[i] = angular.copy($scope.widget.settings.vehicles[i].pdata);
                                            $scope.settings.pdata[i] = angular.copy($scope.widget.settings.vehicles[i].pdata);
                                            if($scope.positionData[i].length === 3){
                                                $scope.pdisplay[i] = displayStringForInput($scope.positionData[i]);
                                            }else if($scope.positionData[i].length === 0){
                                                $scope.pdisplay[i] = "Click for data";
                                            }
                                            $scope.velocityData[i] = angular.copy($scope.widget.settings.vehicles[i].vdata);
                                            $scope.settings.vdata[i] = angular.copy($scope.widget.settings.vehicles[i].vdata);
                                            if( $scope.velocityData[i].length === 3){
                                                $scope.vdisplay[i] = displayStringForInput($scope.velocityData[i]);

                                            }else if($scope.velocityData[i].length === 0){
                                                 $scope.vdisplay[i] = "Click for data";
                                            }
                                        }
                                    }
                                    $scope.settings.vehicles.push({
                                        "name":key
                                    });

                                    $scope.selectByGroupData = makeModelData($scope.settings.vehicles);
                                    var prevSelectionCount = 0;
                                    for(var i=0;i<$scope.selectByGroupData.length;i++){
                                        if($scope.checkedValues[i].status === true){
                                            prevSelectionCount++;
                                        }
                                    }

                                    if(prevSelectionCount > 0){
                                        $scope.vehicleSelected = true; 
                                    }else {
                                        $scope.vehicleSelected = false;
                                    }
                                }else {
                                    $scope.settings.vehicles.push({
                                        "name":key
                                    });
                                    $scope.selectByGroupData = makeModelData($scope.settings.vehicles);
                                }
                            }
                        }
                        // previousSettings = angular.copy($scope.settings);
                    }
                });  
                $interval.cancel(interval);
            }
        }, 1000);
    }

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
            for(var i=0;i<$scope.selectByGroupData.length;i++){
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

    $scope.getValue = function(category,vid){
        var vehicleInfo = sidebarService.getVehicleInfo();
        var dataLen = vehicleInfo.parameters.length;
        //this condition checks if there is any selected data
        if(dataLen > 0){
            //this condition checks if the dropdown is velocity 
            if(category === "velocity"){
                var velocityArray = [];
                var velocitySettings = [];
                var velocityDisplayText = "";

                //for loop to form a temp velocity coordinate array from the data array
                for(var i=0;i<dataLen;i++){
                    velocityArray.push(vehicleInfo.parameters[i]);
                }

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
                            $scope.velocityData[vid] = angular.copy(velocitySettingsfiltered2);
                            $scope.parameters.vdata[vid] = angular.copy(velocitySettingsfiltered2);
                            $scope.velocityDisplay[vid] = velocityDisplayText;
                            $scope.vdisplay[vid] = velocityDisplayText;
                            $scope.vehicle[vid] = velocitySettingsfiltered2[0].vehicle;
                            if ($window.innerWidth >= 1400){
                                $scope.lock.lockLeft = !$scope.lock.lockLeft;
                                dashboardService.setLeftLock($scope.lock.lockLeft);
                            }
                        }else if(velocitySettingsfiltered2.length < 3){
                            $window.alert("You have either not selected all velocity values: or there may be no data available for the selected velocity coordinates."); 
                        }
                    }else if(isDiffVelocityVeh === false && velocityfilteredData.length !== velocitySettingsfiltered2.length){
                        $window.alert("Please select all the velocity values:vx,vy,vz from the same category of vehicle: "+$scope.currentScreenVehicle);
                    }else if(isDiffVelocityVeh === true){
                        $window.alert("Please select all the velocity values:vx,vy,vz from the same vehicle: "+$scope.currentScreenVehicle);
                    }

                }else {
                    $window.alert("Please select all velocity values:vx,vy,vz"); 
                }  
                
            }else if(category === "position"){ //this condition checks if the dropdown is position
                var positionArray = [];
                var positionSettings = [];
                var positionDisplayText = "";

                //for loop to form a temp position coordinate array from the data array
                for(var i=0;i<dataLen;i++){
                    positionArray.push(vehicleInfo.parameters[i]);
                }

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
                            $scope.positionData[vid] = angular.copy(positionSettingsfiltered2);
                            
                            $scope.positionDisplay[vid] = positionDisplayText;
                            $scope.parameters.pdata[vid] = angular.copy(positionSettingsfiltered2);
                            $scope.pdisplay[vid] = positionDisplayText;
                            $scope.vehicle[vid] = positionSettingsfiltered2[0].vehicle;
                            if ($window.innerWidth >= 1400){
                                $scope.lock.lockLeft = !$scope.lock.lockLeft;
                                dashboardService.setLeftLock($scope.lock.lockLeft);
                            }
                        }else if(positionSettingsfiltered2.length < 3){
                            $window.alert("You have either not selected all position values:x,y,z or there may be no data available for the position coordinates."); 
                        }
                    }else if(isDiffPositionVeh === false && positionfilteredData.length !== positionSettingsfiltered2.length){
                        $window.alert("Please select all the position values:x,y,z from the same category of vehicle: "+$scope.currentScreenVehicle);
                    }else if(isDiffPositionVeh === true){
                        $window.alert("Please select all the position values:x,y,z from the same vehicle: "+$scope.currentScreenVehicle);
                    }
                }else {
                    $window.alert("Please select all position values:x,y,z");
                }       
            }
        }else if(vehicleInfo.parameters.length ===  0){
            $window.alert("Please select the parameters before apply!");
        }
    }

    $scope.getTelemetrydata = function(){
        //open the data menu
        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = !$scope.lock.lockLeft;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
    }

    $scope.saveParameters = function(widget){
        if($scope.orbitstatus[$scope.currentVehicleId] === false && $scope.iconstatus[$scope.currentVehicleId] === false){
            if($window.confirm("Do you want to enable either orbit or icon for the satellite?")){
                   $scope.secondScreen = true;
            } else {
                if($window.confirm("Please click ok if all the selected position parameters are:x,y,z and velocity parameters are:vx,vy,vz")){
                    $scope.secondScreen = false;
                    $scope.firstScreen = true;
                    $scope.settings.pdata[$scope.currentVehicleId] = angular.copy($scope.positionData[$scope.currentVehicleId]);
                    $scope.settings.vdata[$scope.currentVehicleId] = angular.copy($scope.velocityData[$scope.currentVehicleId]);
                    $scope.settings.iconstatus[$scope.currentVehicleId] = angular.copy($scope.iconstatus[$scope.currentVehicleId]);
                    $scope.settings.orbitstatus[$scope.currentVehicleId] = angular.copy($scope.orbitstatus[$scope.currentVehicleId]);
                }else {
                    $scope.secondScreen = true;
                }
            }      
        }else {
            if($window.confirm("Please click ok if all the selected position parameters are:x,y,z and velocity parameters are:vx,vy,vz")){
                $scope.secondScreen = false;
                $scope.firstScreen = true;
                $scope.settings.pdata[$scope.currentVehicleId] = angular.copy($scope.positionData[$scope.currentVehicleId]);
                $scope.settings.vdata[$scope.currentVehicleId] = angular.copy($scope.velocityData[$scope.currentVehicleId]);
                $scope.settings.iconstatus[$scope.currentVehicleId] = angular.copy($scope.iconstatus[$scope.currentVehicleId]);
                $scope.settings.orbitstatus[$scope.currentVehicleId] = angular.copy($scope.orbitstatus[$scope.currentVehicleId]);
            }else {
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
    }

    $scope.openPositionList = function(vid) {
        // Just provide a template url, a controller and call 'open'.
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
            if(dataItems.pdata[vid].length === 3){
                $scope.pdisplay[vid] = displayStringForInput(dataItems.pdata[vid]);
                $scope.positionData[vid] = angular.copy(dataItems.pdata[vid]);
            }else if(dataItems.length === 0){
                $scope.pdisplay[vid]= "Click for data";
            }     
        },
        function () {
            //handle modal dismiss
        });
    };

    $scope.openVelocityList = function(vid) {
        // Just provide a template url, a controller and call 'open'.
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
            if(dataItems.vdata[vid].length === 3){
                $scope.vdisplay[vid] = displayStringForInput(dataItems.vdata[vid]);
                $scope.velocityData[vid] = angular.copy(dataItems.vdata[vid]);
            }else if(dataItems.vdata[vid].length === 0){
                $scope.vdisplay[vid] = "Click for data";
            }     
        },
        function () {
            //handle modal dismiss
        });
    };

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
                $scope.positionDisplay.push("Click for data");
                $scope.velocityDisplay.push("Click for data");
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
