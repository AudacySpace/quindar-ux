app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: 'SatSettingsCtrl'
    }
});

app.controller('SatSettingsCtrl', function($scope, dashboardService, sidebarService, $window, $mdSidenav,$uibModal,$element){

    $scope.chosenCategory;
    $scope.attitudeBooleans = [true, true, true, true];
    $scope.positionBooleans = [true, true, true, true];
    var outerScreenToaster1 = $element[0].getElementsByTagName("div")["outerScreenToaster1"];
    var outerScreenToaster2 = $element[0].getElementsByTagName("div")["outerScreenToaster2"];
    var outerScreenToasterMbl = $element[0].getElementsByTagName("div")["outerScreenToasterMbl"];
    var outerScreenToasterTablet = $element[0].getElementsByTagName("div")["outerScreenToasterTablet"];

    checkforPreSavedData();

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;

        var prevValues = angular.copy(widget.settings);

		if(prevValues.attitudeData && prevValues.positionData){
			$scope.settings.attitudeData = prevValues.attitudeData;
            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);
		
			$scope.settings.positionData = prevValues.positionData;
            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
		
			$scope.vehicle = prevValues.vehicle;

		}else if(!prevValues.attitudeData && prevValues.positionData){
			$scope.settings.positionData = prevValues.positionData;
            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
		
			$scope.vehicle = prevValues.vehicle;

		}else if(prevValues.attitudeData && !prevValues.positionData){
			$scope.settings.attitudeData = prevValues.attitudeData;
            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);

			$scope.vehicle = prevValues.vehicle;

		}else {
			$scope.settings.attitudeData = [];
			$scope.settings.positionData = [];
            $scope.widget.settings.totalAttitudeArray = [];
            $scope.widget.settings.totalPositionArray = [];

		}

        if ($window.innerWidth >= 1400)
        {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
	}

	$scope.saveSettings = function(widget){
		var status = checkforSameVehicle($scope.settings.attitudeData,$scope.settings.positionData);
		if($scope.widget.settings.totalAttitudeArray.length == 0 || $scope.widget.settings.totalPositionArray.length == 0)
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Please select all the parameters before saving!";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster1;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please select all the parameters before saving!";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "Please select all the parameters before saving!";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }
        }
        else if(!$scope.attitudeBooleans[3])
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Please select all attitude values:q1,q2,q3,qc.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster1;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please select all attitude values:q1,q2,q3,qc.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "Please select all attitude values:q1,q2,q3,qc.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }
        }
        else if(!$scope.attitudeBooleans[2])
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Please select all the attitude values:q1,q2,q3,qc from the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster1;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please select all the attitude values:q1,q2,q3,qc from the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "Please select all the attitude values:q1,q2,q3,qc from the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }
        }
        else if(!$scope.attitudeBooleans[1])
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Please select all the attitude values:q1,q2,q3,qc from the same category of single vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster1;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please select all the attitude values:q1,q2,q3,qc from the same category of single vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "Please select all the attitude values:q1,q2,q3,qc from the same category of single vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 
            }
        }
        else if(!$scope.attitudeBooleans[0])
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "You have either not selected all attitude values:q1,q2,q3,qc or there may be no data available for the selected quaternion coordinates.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster1;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 
            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "You have either not selected all attitude values:q1,q2,q3,qc or there may be no data available for the selected quaternion coordinates.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 
            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "You have either not selected all attitude values:q1,q2,q3,qc or there may be no data available for the selected quaternion coordinates.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 
            }
        }
        else if(!$scope.positionBooleans[3])
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Please select all position values:x,y,z.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster2;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please select all position values:x,y,z.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessagee = "Please select all position values:x,y,z.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }
        }
        else if(!$scope.positionBooleans[2])
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessagee = "Please select all the position values:x,y,z from the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster2;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please select all the position values:x,y,z from the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "Please select all the position values:x,y,z from the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }
        }
        else if(!$scope.positionBooleans[1])
        {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Please select all the position values:x,y,z from the same vehicle's category.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster2;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please select all the position values:x,y,z from the same vehicle's category.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
               var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage= "Please select all the position values:x,y,z from the same vehicle's category.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }
        }else if(!$scope.positionBooleans[0]){
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "You have either not selected all position values:x,y,z or there may be no data available for the position coordinates.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster2;
             var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "You have either not selected all position values:x,y,z or there may be no data available for the position coordinates.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "You have either not selected all position values:x,y,z or there may be no data available for the position coordinates.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }
        }else if($scope.widget.settings.totalAttitudeArray.length === 4 && $scope.widget.settings.totalPositionArray.length === 3 && status === true){
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

                widget.settings.attitudeData = getSelectedArray(dataItems.attitudeData);
                widget.settings.positionData = getSelectedArray(dataItems.positionData);
                widget.settings.vehicle = $scope.vehicle;

                //reset arrays that handle data selected by the user
                $scope.widget.settings.totalAttitudeArray = getRecentSelectedValues($scope.widget.settings.totalAttitudeArray, 4);
                $scope.widget.settings.totalPositionArray = getRecentSelectedValues($scope.widget.settings.totalPositionArray, 3);
                widget.settings.dataArray = [];

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
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Both Attitude and Position Values should be of the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToaster1;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay); 

            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Both Attitude and Position Values should be of the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterTablet;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);

            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "Both Attitude and Position Values should be of the same vehicle.";
                $scope.toasterposition = "top left";
                $scope.toasterdelay = false;
                $scope.toasterqueryId = outerScreenToasterMbl;
                var alertstatus = dashboardService.displayWidgetAlert($scope.toasterusermessage,$scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }
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
        sidebarService.setMenuStatus(true); //set to true when data menu is opened and tree needs to be created
        sidebarService.setOpenLogo(false); //set to false if data menu opened through this Qwidget
    }

    //display telemetry id chosen by the user in the right input box
    $scope.readValues = function(field)
    {
        var trimmedData = [];
        var stringData = "";

        if(field == 'attitude')
        {
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
        else if(field == 'position')
        {
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
                        $scope.settings.attitudeData = attitudeSettingsfiltered2;
                        $scope.vehicle = attitudeSettingsfiltered2[0].vehicle;
                        $scope.widget.settings.totalAttitudeArray = angular.copy(attitudeSettingsfiltered2);
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
                        $scope.settings.positionData = positionSettingsfiltered2;
                        $scope.vehicle = positionSettingsfiltered2[0].vehicle;
                        $scope.widget.settings.totalPositionArray = angular.copy(positionSettingsfiltered2);
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
            $scope.widget.settings.totalPositionArray = angular.copy($scope.widget.settings.positionData);
            $scope.widget.settings.totalAttitudeArray = angular.copy($scope.widget.settings.attitudeData);
    	}else if(!$scope.widget.settings.attitudeData && !$scope.widget.settings.positionData){
    		$scope.settings = {
        		attitudeData:[],
        		positionData:[],
    		};

            $scope.widget.settings.totalPositionArray = [];
            $scope.widget.settings.totalAttitudeArray = [];

            $scope.vehicle = "";
    	}
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
                    $scope.widget.settings.totalAttitudeArray = angular.copy(dataItems.tempAttitudes);
                    $scope.settings.attitudeData = angular.copy($scope.widget.settings.totalAttitudeArray);
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
                $scope.widget.settings.totalPositionArray = angular.copy(dataItems.tempPositions);
                $scope.settings.positionData = angular.copy($scope.widget.settings.totalPositionArray);
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

