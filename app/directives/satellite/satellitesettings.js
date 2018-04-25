app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: 'SatSettingsCtrl'
    }
});

app.controller('SatSettingsCtrl', function($scope, dashboardService, sidebarService, $window, $mdSidenav,$uibModal,$ngConfirm){
	$scope.checkboxModel = {
		value1:false,
		value2:false,
	}

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
		
			$scope.settings.positionData = prevValues.positionData;
			if($scope.settings.positionData.length > 0){
				$scope.positionDisplay = displayStringForInput($scope.settings.positionData);
			}else {
				$scope.positionDisplay = "Click for data";
			}
		
			$scope.vehicle = prevValues.vehicle;

		}else if(!prevValues.attitudeData && prevValues.positionData){
			$scope.settings.positionData = prevValues.positionData;
			if($scope.settings.positionData.length > 0){
				$scope.positionDisplay = displayStringForInput($scope.settings.positionData);
			}else {
				$scope.positionDisplay = "Click for data";
			}
		
			$scope.vehicle = prevValues.vehicle;

		}else if(prevValues.attitudeData && !prevValues.positionData){

			$scope.settings.attitudeData = prevValues.attitudeData;
			if($scope.settings.attitudeData.length > 0){
				$scope.attitudeDisplay = displayStringForInput($scope.settings.attitudeData);
			}else {
				$scope.attitudeDisplay = "Click for data";
			}
			$scope.vehicle = prevValues.vehicle;

		}else {
			$scope.settings.attitudeData = [];
			$scope.attitudeDisplay = "Click for data";
			$scope.settings.positionData = [];
			$scope.positionDisplay = "Click for data";
		}

	}

	$scope.saveSettings = function(widget){
		var status = checkforSameVehicle($scope.settings.attitudeData,$scope.settings.positionData);
		if($scope.settings.attitudeData.length === 4 && $scope.settings.positionData.length === 3 && status === true){
            $ngConfirm({
            	title: 'Confirm!',
            	content: 'Is the quaternion coordinates selected order is:q1,q2,q3,qc and position coordinates selected order: x,y,z?',
            	scope: $scope,
            	columnClass: 'col-md-8 col-md-offset-2',
            	buttons: {
                	Yes: {
                    	text: 'Yes',
                    	btnClass: 'btn-blue',
                    	action: function(scope, button){
                       		widget.main = true;
							widget.settings.active = false;
							widget.saveLoad = false;
							widget.delete = false;
							widget.settings.attitudeData = [];
							widget.settings.positionData = [];
							scope.attitudeDisplay = "";
							scope.positionDisplay = "";

							widget.settings.attitudeData = getSelectedArray(scope.settings.attitudeData);
							scope.attitudeDisplay = displayStringForInput(scope.settings.attitudeData);
							widget.settings.positionData = getSelectedArray(scope.settings.positionData);
							scope.positionDisplay = displayStringForInput(scope.settings.positionData);
							widget.settings.vehicle = scope.vehicle;
                            return true; // to close after done ,if given false it will not close the confirm box
                    	}
                	},
                	NotSure: {
                    	text: 'Not Sure',
                    	btnClass: 'btn-orange',
                    	action: function(scope, button){
                        	$ngConfirm('Please change the coordinates order to the desired order and then save!');
                   		}
                	},
                	ReorderAttitude: {
                		text: 'Reorder Attitude',
                    	btnClass: 'btn-orange',
                    	action: function(scope, button){
                        	scope.openAttitudeList();
                   		}
                	},
                	ReorderPosition: {
             			text: 'Reorder Position',
                    	btnClass: 'btn-orange',
                    	action: function(scope, button){
                        	scope.openPositionList();
                   		}
                	},
                	close: function(scope, button){
                    	// closes the modal
                
                	}
            	}
        	});
		}else if(status === false){
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

    $scope.getValue = function(category){
    	var vehicleInfo = sidebarService.getVehicleInfo();
		if(vehicleInfo.parameters.length > 0){
    		if(category === "attitude"){
    			$scope.settings.attitudeData = [];
    			$scope.attitudeDisplay = "Click for data";

    			for(var i=0;i<vehicleInfo.parameters.length;i++){
    				$scope.settings.attitudeData.push(vehicleInfo.parameters[i]);
    				$scope.vehicle = vehicleInfo.parameters[i].vehicle;
    			}

    			if($scope.settings.attitudeData.length > 4){
    				$scope.settings.attitudeData = getRecentSelectedValues($scope.settings.attitudeData,4);
    			}else {}
    					
    			$scope.settings.attitudeData = filterSelectedData($scope.settings.attitudeData);
    			$scope.attitudeDisplay = displayStringForInput($scope.settings.attitudeData);

				if($scope.settings.attitudeData.length !== 4){
            		$scope.attitudeDisplay = "Click for data";
            		$scope.settings.attitudeData = [];
            		$window.alert("Please select all attitude values:q1,q2,q3,qc");
            	}else {
                    if ($window.innerWidth >= 1400){
                        $scope.lock.lockLeft = !$scope.lock.lockLeft;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }

    		}else if(category === "position"){
    			$scope.settings.positionData = [];
    			$scope.positionDisplay = "Click for data";
    			for(var i=0;i<vehicleInfo.parameters.length;i++){
    				$scope.settings.positionData.push(vehicleInfo.parameters[i]);
    				$scope.vehicle = vehicleInfo.parameters[i].vehicle;
    			}

    			if($scope.settings.positionData.length > 3){
    				$scope.settings.positionData = getRecentSelectedValues($scope.settings.positionData,3);
    			}else {}
    					
    			$scope.settings.positionData = filterSelectedData($scope.settings.positionData);
    			$scope.positionDisplay = displayStringForInput($scope.settings.positionData);

				if($scope.settings.positionData.length !== 3){
            		$scope.positionDisplay = "Click for data";
            		$scope.settings.positionData = [];
            		$window.alert("Please select all position values:x,y,z");
            	}else {
                    if ($window.innerWidth >= 1400){
                        $scope.lock.lockLeft = !$scope.lock.lockLeft;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
            }
    	}else if(vehicleInfo.parameters.length ===  0){
    		$window.alert("Please select the parameters before apply!");
    	}
    }

    function filterSelectedData(selectedArray){
    	var tagArray = [];
    	var mostCommonTag = "";

    	for(var i=0;i<selectedArray.length;i++){
    		tagArray.push({"category":selectedArray[i].category,"vehicle":selectedArray[i].vehicle});
    	}

    	var mf = 1;
		var m = 0;
		var item;
		for (var j=0; j<tagArray.length; j++)
		{
        	for (var p=j; p<tagArray.length; p++)
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
    	for(var k=0;k<selectedArray.length;k++){
    		if(selectedArray[k].category === item.category && selectedArray[k].vehicle === item.vehicle){
    			filteredArray.push(selectedArray[k]);
    		}
    	}
    	return filteredArray;
    }

    function getRecentSelectedValues(selectedArray,count){
    	var parameters = [];
    	for(var i=selectedArray.length-count;i<selectedArray.length;i++){
    		parameters.push(selectedArray[i]);
    	}
    	return parameters;
    }

    function checkforSameVehicle(attitudeData,positionData){
    	var status = true;
    	for(var i=0;i<attitudeData.length;i++){
    		for(var j=0;j<positionData.length;j++){
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
    	}else if(!$scope.widget.settings.attitudeData && !$scope.widget.settings.positionData){
    		$scope.settings = {
        		attitudeData:[],
        		positionData:[]
    		};

    		$scope.attitudeDisplay = "Click for data";
    		$scope.positionDisplay = "Click for data";
            $scope.vehicle = "";
    	}
    }

    function displayStringForInput(selectedArray){
    	var dString = "";
    	for(var k=0;k<selectedArray.length;k++){
            if(k < selectedArray.length-1){
            	dString = dString + selectedArray[k].id + "," ;
            }else if(k === selectedArray.length-1){
            	dString = dString + selectedArray[k].id;
            }
        }
        return dString;
    }

    function getSelectedArray(selectedArray){
    	var data = [];
    	for(var b=0;b<selectedArray.length;b++){
			data.push(selectedArray[b]);
		}
		return data;
    }


	$scope.openAttitudeList = function() {
		// Just provide a template url, a controller and call 'open'.
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
                if(dataItems.attitudeData.length === 4){
                	$scope.attitudeDisplay = displayStringForInput(dataItems.attitudeData);
                }else if(dataItems.attitudeData.length === 0) {
                	$scope.attitudeDisplay = "Click for data";
                }   
            },
            function () {
                //handle modal dismiss
            });
		};

	$scope.openPositionList = function() {
		// Just provide a template url, a controller and call 'open'.
        $uibModal.open({
            templateUrl: "./directives/satellite/positionList.html",
            controller: 'positionListCtrl',
            controllerAs: '$ctrl',
            resolve: {
                positionItems: function () {
                   	return $scope.settings;
                }
            }
        }).result.then(function(dataItems){
            //handle modal close with response
            if(dataItems.positionData.length === 3){
               	$scope.positionDisplay = displayStringForInput(dataItems.positionData);
            }else if(dataItems.positionData.length === 0){
                $scope.positionDisplay = "Click for data";
            }     
        },
        function () {
            //handle modal dismiss
        });
	};
});

app.controller('positionListCtrl',function($scope,$uibModalInstance,positionItems,$ngConfirm) {
	var $ctrl = this;
	$ctrl.data = positionItems;
    var values = angular.copy(positionItems);

    $ctrl.close = function() {
        $ctrl.data.positionData = values.positionData;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
		$ngConfirm({
            title: 'Confirm!',
            content: 'Is the position coordinates selected order is:x,y,z?',
            scope: $scope,
            buttons: {
                Yes: {
                    text: 'Yes',
                    btnClass: 'btn-blue',
                    action: function(scope, button){
                    	$uibModalInstance.close($ctrl.data);
						return true; 
                    }
                },
                No: {
                	text: 'No',
                    btnClass: 'btn-default',
                    action: function(scope, button){
						return true;
                    }

                }
            }
        });
    }
});

app.controller('attitudeListCtrl',function($scope,$uibModalInstance,attitudeItems,$ngConfirm) {
	var $ctrl = this;
    $ctrl.data = attitudeItems;
    var values = angular.copy(attitudeItems);

    $ctrl.close = function() {
        $ctrl.data.attitudeData = values.attitudeData;
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
		$ngConfirm({
            title: 'Do you Confirm!',
            content: 'Quaternion coordinates selected order is:q1,q2,q3,qc?',
            scope: $scope,
            buttons: {
                Yes: {
                    text: 'Yes',
                    btnClass: 'btn-blue',
                    action: function(scope, button){
                    	$uibModalInstance.close($ctrl.data);
						return true; 
                    }
                },
                No: {
                	text: 'No',
                    btnClass: 'btn-default',
                    action: function(scope, button){
						return true;
                    }

                }
            }
        });
    }

});