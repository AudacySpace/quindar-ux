app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: 'SatSettingsCtrl'
    }
});

app.controller('SatSettingsCtrl', function($scope, dashboardService, sidebarService, $window, $mdSidenav,$uibModal){

    $scope.chosenCategory;
    $scope.attitudeBooleans = [true, true, true, true];
    $scope.positionBooleans = [true, true, true, true];
    checkforPreSavedData();

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;

        var prevValues = angular.copy(widget.settings);

		if(prevValues.attitudeData && prevValues.positionData){
			$scope.settings.attitudeData = prevValues.attitudeData;
			if($scope.settings.attitudeData.length > 0){
				$scope.attitudeDisplay = displayStringForInput($scope.settings.attitudeData);
			}else {
				$scope.attitudeDisplay = "Click for data";
			}

            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);
		
			$scope.settings.positionData = prevValues.positionData;
			if($scope.settings.positionData.length > 0){
				$scope.positionDisplay = displayStringForInput($scope.settings.positionData);
			}else {
				$scope.positionDisplay = "Click for data";
			}

            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
		
			$scope.vehicle = prevValues.vehicle;

		}else if(!prevValues.attitudeData && prevValues.positionData){
			$scope.settings.positionData = prevValues.positionData;
			if($scope.settings.positionData.length > 0){
				$scope.positionDisplay = displayStringForInput($scope.settings.positionData);
			}else {
				$scope.positionDisplay = "Click for data";
			}

            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
		
			$scope.vehicle = prevValues.vehicle;

		}else if(prevValues.attitudeData && !prevValues.positionData){

			$scope.settings.attitudeData = prevValues.attitudeData;
			if($scope.settings.attitudeData.length > 0){
				$scope.attitudeDisplay = displayStringForInput($scope.settings.attitudeData);
			}else {
				$scope.attitudeDisplay = "Click for data";
			}

            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);

			$scope.vehicle = prevValues.vehicle;

		}else {
			$scope.settings.attitudeData = [];
			$scope.attitudeDisplay = "Click for data";
			$scope.settings.positionData = [];
			$scope.positionDisplay = "Click for data";
            $scope.widget.settings.totalPositionArray = [];
            $scope.widget.settings.totalAttitudeArray = [];
		}

        if ($window.innerWidth >= 1400)
        {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
	}

	$scope.saveSettings = function(widget){
        //display telemetry id chosen by the user in the velocity input box
		var status = checkforSameVehicle($scope.settings.attitudeData,$scope.settings.positionData);
		if($scope.widget.settings.totalAttitudeArray.length == 0 || $scope.widget.settings.totalPositionArray.length == 0)
        {
            $window.alert("Please select the parameters before applying!");
        }
        else if(!$scope.attitudeBooleans[3])
        {
            $window.alert("Please select all attitude values:q1,q2,q3,qc");
        }
        else if(!$scope.attitudeBooleans[2])
        {
            $window.alert("Please select all the attitude values:q1,q2,q3,qc from the same vehicle.");
        }
        else if(!$scope.attitudeBooleans[1])
        {
            $window.alert("Please select all the attitude values:q1,q2,q3,qc from the same category of single vehicle.");
        }
        else if(!$scope.attitudeBooleans[0])
        {
            $window.alert("You have either not selected all attitude values:q1,q2,q3,qc or there may be no data available for the selected quaternion coordinates."); 
        }
        else if(!$scope.positionBooleans[3])
        {
            $window.alert("Please select all position values:x,y,z");
        }
        else if(!$scope.positionBooleans[2])
        {
            $window.alert("Please select all the position values:x,y,z from the same vehicle.");
        }
        else if(!$scope.positionBooleans[1])
        {
            $window.alert("Please select all the position values:x,y,z from the same vehicle's category.");

        }
        else if(!$scope.positionBooleans[0])
        {
            $window.alert("You have either not selected all position values:x,y,z or there may be no data available for the position coordinates."); 
        }
        else if($scope.settings.attitudeData.length === 4 && $scope.settings.positionData.length === 3 && status === true){
            $uibModal.open({
                templateUrl: "./directives/satellite/confirmSettings.html",
                controller: 'confirmCtrl',
                controllerAs: '$ctrl',
                bindToController: true,
                scope: $scope,
                resolve: {
                    dataLabel: function () {
                        return "Is the quaternion coordinates selected order is:q1,q2,q3,qc and position coordinates selected order: x,y,z?";
                    },
                    dataItems: function(){
                        return $scope.settings;
                    }
                }
            }).result.then(function(dataItems){
                //handle modal close with response
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;
                widget.settings.attitudeData = [];
                widget.settings.positionData = [];
                $scope.attitudeDisplay = "";
                $scope.positionDisplay = "";

                widget.settings.attitudeData = getSelectedArray(dataItems.attitudeData);
                $scope.attitudeDisplay = displayStringForInput(dataItems.attitudeData);
                widget.settings.positionData = getSelectedArray(dataItems.positionData);
                $scope.positionDisplay = displayStringForInput(dataItems.positionData);
                widget.settings.vehicle = $scope.vehicle;

                //reset arrays that handle data selected by the user
                $scope.widget.settings.totalAttitudeArray = getRecentSelectedValues($scope.widget.settings.totalAttitudeArray, 4);
                $scope.widget.settings.totalPositionArray = getRecentSelectedValues($scope.widget.settings.totalPositionArray, 3);
                widget.settings.dataArray = [];
                $scope.settings.attitudeData = [];
                $scope.settings.positionData = [];

                if ($window.innerWidth >= 1400){
                    $scope.lock = dashboardService.getLock();
                    $scope.lock.lockLeft = false;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
            },
            function () {
            //handle modal dismiss
        });
		}
        else if(status === false)
        {
			$window.alert("Both Attitude and Position Values should be of the same vehicle.");
		}else if($scope.settings.attitudeData.length < 4 && $scope.settings.positionData.length < 3){
			$window.alert("Please select all the quaternion coordinates:q1,q2,q3,qc and position coordinates:x,y,z");
            $scope.settings.attitudeData = [];
            $scope.attitudeDisplay = "Click for data";
            $scope.settings.positionData = [];
            $scope.positionDisplay = "Click for data";
		}
		else if($scope.settings.attitudeData.length < 4 && $scope.settings.positionData.length === 3){
            $scope.settings.attitudeData = [];
            $scope.attitudeDisplay = "Click for data";
			$window.alert("Please select all the quaternion coordinates:q1,q2,q3,qc");
		}else if($scope.settings.positionData.length < 3 && $scope.settings.attitudeData.length === 4){
            $scope.settings.positionData = [];
            $scope.positionDisplay = "Click for data";
			$window.alert("Please select all the position coordinates:x,y,z");		
        }
	}

	$scope.getTelemetrydata = function(category){
        //open the data menu
        $scope.chosenCategory = category; //which input box has been selected (position or velocity)
        sidebarService.setTempWidget($scope.widget, this); //which input box has been selected (position or velocity)
        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = true;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
    }

    //display telemetry id chosen by the user in the attitude input box
    $scope.readAttitudeValues = function()
    {
        var trimmedData = [];
        var stringData = "";

        if($scope.widget.settings.totalAttitudeArray)
        {
            trimmedData = getRecentSelectedValues($scope.widget.settings.totalAttitudeArray, 4);
        }

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
        var trimmedData = [];
        var stringData = "";

        if($scope.widget.settings.totalPositionArray)
        {
            trimmedData = getRecentSelectedValues($scope.widget.settings.totalPositionArray, 3);
        }

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

    $scope.sortableOptionsAttitude = {
        containment: '#scrollable-containerAttitude',
        scrollableContainer: '#scrollable-containerAttitude',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };

    $scope.sortableOptionsPosition = {
        containment: '#scrollable-containerPosition',
        scrollableContainer: '#scrollable-containerPosition',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };

    $scope.getValue = function(isGroup){
        var vehicleInfo = angular.copy($scope.widget.settings.dataArray);
        var dataLen = vehicleInfo.length;
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(!isGroup && data && data.id !== "") //as long as data is id and not group
        {
            $scope.attitudeBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the attitude data selected doesn't pass
            $scope.positionBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the position data selected doesn't pass
            if($scope.chosenCategory == 'attitude') //if the attitude input box has been chosen
            {
                //push the last chosen data value into the corresponding attitude array
                $scope.widget.settings.totalAttitudeArray.push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }
            else if($scope.chosenCategory == 'position') //if the position input box has been chosen
            {
                //push the last chosen data value into the corresponding position array
                $scope.widget.settings.totalPositionArray.push($scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]);
            }
            
            var attitudeArray = [];
            var attitudeSettings = [];
            var attitudeDisplayText = "";

            attitudeArray = angular.copy($scope.widget.settings.totalAttitudeArray);

            //if the temp attitude array has length more than 4 then reduce its size to recent 4
            if(attitudeArray.length > 4){
                attitudeSettings = getRecentSelectedValues(attitudeArray,4);
            }else {
                attitudeSettings = attitudeArray;
            }
            
            if(attitudeSettings.length === 4){
                var attitudeSettingsfiltered1 = removeCategories(attitudeSettings); //to remove selected group or categories while opening the list
                var attitudeSettingsfiltered2 = removeDuplicates(attitudeSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffAttitudeVeh = isAnyDiffVehicles(attitudeSettingsfiltered2);// to check if all the values are of the same vehicle
                var attitudefilteredData = filterSelectedData(attitudeSettingsfiltered2); // check if there are any different values of a category

                if(isDiffAttitudeVeh === false && attitudefilteredData.length === attitudeSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                    if(attitudeSettingsfiltered2.length === 4){  
                        attitudeDisplayText = displayStringForInput(attitudeSettingsfiltered2);
                        $scope.settings.attitudeData = attitudeSettingsfiltered2;
                        $scope.attitudeDisplay = attitudeDisplayText;
                        $scope.vehicle = attitudeSettingsfiltered2[0].vehicle;
                    }else if(attitudeSettingsfiltered2.length < 4){
                        $scope.attitudeBooleans[0] = false;
                    }
                }else if(isDiffAttitudeVeh === false && attitudefilteredData.length !== attitudeSettingsfiltered2.length){
                    $scope.attitudeBooleans[1] = false;
                }else if(isDiffAttitudeVeh === true){
                    $scope.attitudeBooleans[2] = false;
                }
            }else {
                $scope.attitudeBooleans[3] = false;
            }  
            
        
            var positionArray = [];
            var positionSettings = [];
            var positionDisplayText = "";

            positionArray = angular.copy($scope.widget.settings.totalPositionArray);

            //if the temp position array has length more than 3 then reduce its size to recent 3
            if(positionArray.length > 3){
                positionSettings = getRecentSelectedValues(positionArray,3);
            }else {
                positionSettings = positionArray;
            }
            
            if(positionSettings.length === 3){
                var positionSettingsfiltered1 = removeCategories(positionSettings);//to remove selected group or categories while opening the list
                var positionSettingsfiltered2 = removeDuplicates(positionSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffPositionVeh = isAnyDiffVehicles(positionSettingsfiltered2);// to check if all the values are of the same vehicle
                var positionfilteredData = filterSelectedData(positionSettingsfiltered2);// check if there are any different values of a category
        
                if(isDiffPositionVeh === false && positionfilteredData.length === positionSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                    if(positionSettingsfiltered2.length === 3){  
                        positionDisplayText = displayStringForInput(positionSettingsfiltered2);
                        $scope.settings.positionData = positionSettingsfiltered2;
                        $scope.positionDisplay = positionDisplayText;
                        $scope.vehicle = positionSettingsfiltered2[0].vehicle;
                    }else if(positionSettingsfiltered2.length < 3){
                        $scope.positionBooleans[0] = false;
                    }
                }else if(isDiffPositionVeh === false && positionfilteredData.length !== positionSettingsfiltered2.length){
                    $scope.positionBooleans[1] = false;
                }else if(isDiffPositionVeh === true){
                    $scope.positionBooleans[2] = false;
                }
            }else {
                $scope.positionBooleans[3] = false;
            }          
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

    function getRecentSelectedValues(selectedArray,count){
    	var parameters = [];
        var arrayLen = selectedArray.length;
    	for(var i=arrayLen-count;i<arrayLen;i++){
    		parameters.push(selectedArray[i]);
    	}
    	return parameters;
    }

    function checkforSameVehicle(attitudeData,positionData){
    	var status = true;
        var attDataLen = attitudeData.length;
        var posDataLen = positionData.length;
    	for(var i=0;i<attDataLen;i++){
    		for(var j=0;j<posDataLen;j++){
    			if(attitudeData[i].vehicle !== positionData[j].vehicle){
    				status = false;
    			}
    		}
    	}
    	return status;
    }

    function checkforPreSavedData(){
    	if($scope.widget.settings.attitudeData && $scope.widget.settings.positionData){
            var preSavedValues = angular.copy($scope.widget.settings);
    		$scope.settings = {
        		attitudeData:preSavedValues.attitudeData,
        		positionData:preSavedValues.positionData
    		};

            $scope.vehicle = preSavedValues.vehicle
    		$scope.attitudeDisplay = displayStringForInput(preSavedValues.attitudeData);
            $scope.positionDisplay = displayStringForInput(preSavedValues.positionData);
            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);
    	}else if(!$scope.widget.settings.attitudeData && !$scope.widget.settings.positionData){
    		$scope.settings = {
        		attitudeData:[],
        		positionData:[],
    		};

            $scope.widget.settings.totalPositionArray = [];
            $scope.widget.settings.totalAttitudeArray = [];

    		$scope.attitudeDisplay = "Click for data";
    		$scope.positionDisplay = "Click for data";
            $scope.vehicle = "";
    	}
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

    function isAnyDiffVehicles(filteredArray){
        var arrayLen = filteredArray.length;
        var count = 0;
        for(var i = 1; i < arrayLen; i++){
            if(filteredArray[i].vehicle !== filteredArray[0].vehicle){
                count++;
            }
        }

        if(count > 0){
            return true;
        }else {
            return false;
        }
    }

	$scope.openAttitudeList = function() {
		// Just provide a template url, a controller and call 'open'.
        $scope.settings.tempAttitudes = angular.copy(getRecentSelectedValues($scope.widget.settings.totalAttitudeArray, 4)); 
        $uibModal.open({
            templateUrl: "./directives/satellite/quaternionList.html",
            controller: 'attitudeListCtrl',
            controllerAs: '$ctrl',
            resolve: {
                attitudeItems: function () {
                    return $scope.settings;
                }
            }
        }).result.then(
            function(dataItems){
                //handle modal close with response
                if(dataItems.tempAttitudes.length === 4){
                	$scope.attitudeDisplay = displayStringForInput(dataItems.tempAttitudes);
                    $scope.widget.settings.totalAttitudeArray = angular.copy(dataItems.tempAttitudes);
                }else if(dataItems.tempAttitudes.length === 0) {
                	$scope.attitudeDisplay = "Click for data";
                }   
            },
            function () {
                //handle modal dismiss
            });
		};

	$scope.openPositionList = function() {
		// Just provide a template url, a controller and call 'open'.
        $scope.settings.tempPositions = angular.copy(getRecentSelectedValues($scope.widget.settings.totalPositionArray, 3)); 
        $uibModal.open({
            templateUrl: "./directives/satellite/positionList.html",
            controller: 'positionListCtrl',
            controllerAs: '$ctrl',
            resolve: {
                positionItems: function () {
                   	return $scope.settings;
                }
            }
        }).result.then(function(dataItems){ //dataItems = $scope.widget.settings
            //handle modal close with response
            if(dataItems.tempPositions.length === 3){
               	$scope.positionDisplay = displayStringForInput(dataItems.tempPositions);
                $scope.widget.settings.totalPositionArray = angular.copy(dataItems.tempPositions);
            }else if(dataItems.tempPositions.length === 0){
                $scope.positionDisplay = "Click for data";
            }     
        },
        function () {
            //handle modal dismiss
        });
	};
});


app.controller('positionListCtrl',function($scope,$uibModalInstance,positionItems,$uibModal) {
    var $ctrl = this;
    $ctrl.data = positionItems;
    var values = angular.copy(positionItems);

    $ctrl.close = function() {
        $ctrl.data.tempPositions = values.tempPositions;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModal.open({
            templateUrl: "./directives/satellite/confirmParameter.html",
            controller: 'confirmCtrl',
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

app.controller('attitudeListCtrl',function($scope,$uibModalInstance,attitudeItems,$uibModal) {
    var $ctrl = this;
    $ctrl.data = attitudeItems;
    var values = angular.copy(attitudeItems);

    $ctrl.close = function() {
        $ctrl.data.tempAttitudes = values.tempAttitudes;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModal.open({
            templateUrl: "./directives/satellite/confirmParameter.html",
            controller: 'confirmCtrl',
            controllerAs: '$ctrl',
            resolve: {
                dataLabel: function () {
                    return "Quaternion coordinates selected order is:q1,q2,q3,qc?";
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

app.controller('confirmCtrl',function($scope,$uibModalInstance,dataLabel,dataItems) {
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

