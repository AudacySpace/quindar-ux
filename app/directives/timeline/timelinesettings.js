app.directive('timelinesettings', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/timeline/timelinesettings.html',
	    controller: 'timelineSettingsCtrl',
  	}; 
})

app.controller('timelineSettingsCtrl', function($scope,gridService){

	$scope.selectByGroupData = [];
	var ugrps = [];
	loadTimelineEvents();
	$scope.selectByGroupSettings = { 
    	selectByGroups: ugrps,
    	groupByTextProvider: function(groupValue) {
    		for(var i=0;i<ugrps.length;i++){
    			if(groupValue === ugrps[i]){
    				return ugrps[i];
    			}
    		} 
    	 }, 
    	 groupBy: 'group',
    	 scrollableHeight: '200px',
    	 scrollable: true,
    	 enableSearch: true
    };
	$scope.customFilter = '';
	$scope.selectByGroupModel = []; 
	$scope.selected = {};
	$scope.isLoaded = false;

	$scope.types = [
	{
        'key': 1,
        'value': 'Timezone'
    }, 
	{
		'key': 2,
		'value': 'Events'
	}];

	$scope.timezones = [
	{
		name:"Luxembourg",
        utcoffset: "+02:00",
        id:"lux",
        labeloffset : "+ 02"
	},
    {
        name:"San Francisco",
        utcoffset: "-08:00",
        id:"sfo",
        labeloffset : "- 08"
    },
    {
        name:"Singapore",
       	utcoffset : "+08:00",
        id:"sgp",
        labeloffset : "+ 08"
    },
    {
        name:"UTC",
        utcoffset : "+00:00",
        id:"utc",
        labeloffset : "+ 00"
    }];

	$scope.events = [];

    $scope.sortableOptions = {
        containment: '#scrollable-container',
        scrollableContainer: '#scrollable-container',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };


	function checkForEvents(data){	
		if($scope.widget.settings.events === undefined || $scope.selectByGroupModel === undefined){
			if($scope.selectByGroupData.length > 0){
				$scope.widget.settings.events = [];
				$scope.selectByGroupModel = [];
				for(var a=0;a<data.length;a++){
					$scope.selectByGroupModel.push(data[a]);
					$scope.widget.settings.events.push(data[a]);
				}

				makeEventOrder($scope.selectByGroupModel);
    			$scope.widget.settings.grouporder = angular.copy($scope.itemsList);
			}else if($scope.selectByGroupData.length === 0){
				$scope.selectByGroupModel = [];
				$scope.widget.settings.events = [];
				$scope.widget.settings.grouporder = [];
			}
		}else if($scope.widget.settings.events.length > 0 && $scope.selectByGroupModel.length === 0){
			var ecount = 0;
			var tempnames = [];
			//set events
			for(var c=0;c<$scope.widget.settings.grouporder.items1.length;c++){
            	for(var b=0;b<$scope.widget.settings.events.length;b++){
                    if($scope.widget.settings.grouporder.items1[c].groupstatus === false){
                        if($scope.widget.settings.grouporder.items1[c].Label === $scope.widget.settings.events[b].label){
                            tempnames.push({
                                id:ecount,
                                label:$scope.widget.settings.grouporder.items1[c].Label,
                                group:"Other",
                                eventdata:$scope.widget.settings.events[b].eventdata,
                                eventinfo:$scope.widget.settings.events[b].eventinfo
                            });
                            ecount++;
                        }

                    }else {
                        if($scope.widget.settings.grouporder.items1[c].Label === $scope.widget.settings.events[b].group){
                            tempnames.push({
                                id:ecount,
                                label:$scope.widget.settings.events[b].label,
                                group:$scope.widget.settings.events[b].group,
                                eventdata:$scope.widget.settings.events[b].eventdata,
                                eventinfo:$scope.widget.settings.events[b].eventinfo
                            });
                            ecount++;
                        }
                    }
                }
            }

			for(var b=0;b<tempnames.length;b++){
				$scope.selectByGroupModel.push(tempnames[b]);
			}
			makeEventOrder($scope.selectByGroupModel);
		}
	}

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
	}

	$scope.saveSettings = function(widget){
		var tzExistsStatus = "";
		if( $scope.selected.type ){
			if($scope.selected.type.value === 'Timezone') {
				if ($scope.selected.timezone) {
					tzExistsStatus = tzExists(widget.settings.timezones,$scope.selected.timezone.name);
						if(tzExistsStatus === true){
							alert("This time axis already exists in the qwidget.");
							widget.settings.timezones = widget.settings.timezones;
							$scope.selected.timezone = {};
						}else {
							widget.settings.timezones.push($scope.selected.timezone); 
							widget.main = true;
							widget.settings.active = false;
							widget.saveLoad = false;
							widget.delete = false;
							$scope.selected = {};
						}
				} 
			} else if ($scope.selected.type.value == 'Events') {
				if($scope.selectByGroupModel.length > 0){
					widget.settings.events = [];
					for(var j=0;j<$scope.events.length;j++){
						for(var k=0;k<$scope.selectByGroupModel.length;k++){
							if($scope.events[j].eventname === $scope.selectByGroupModel[k].label){
								widget.settings.events.push($scope.selectByGroupModel[k]);
							}
						}
					}
					widget.settings.grouporder = $scope.eventorder;
					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete =  false;
				}else if($scope.selectByGroupModel.length === 0){
					alert("Select atleast one event");
				}
			} 
		} 
	}

	function tzExists(tzArray,selectedname){
		var status = false;
		for(var t=0;t<tzArray.length;t++){
			if(tzArray[t].name === selectedname){
				status = true;
				break;
			}
		}
		return status;
	}


    function loadTimelineEvents(){
        gridService.loadTimelineEvents().then(function(response){
        	$scope.events = response.data;
        	var groups = [];
        	for(var i=0;i<$scope.events.length;i++){
        		$scope.selectByGroupData.push({
        			id:i,
        			label:$scope.events[i].eventname,
        			group:$scope.events[i].eventgroup,
        			eventdata:$scope.events[i].eventdata,
        			eventinfo:$scope.events[i].eventinfo
        		});
        		groups.push({name:$scope.events[i].eventgroup});

        	}
        	checkForEvents($scope.selectByGroupData);
        	var uniquegroups = unique(groups);
        	 for(var b=0;b<uniquegroups.length;b++){
        	 	ugrps.push(uniquegroups[b].name);
        	 }
        });
    }

    $scope.$watch("selectByGroupModel",function(newval,oldval){
    	makeEventOrder(newval);
    },true);

	$scope.$watch("itemsList",function(newval,oldval){
		$scope.eventorder = newval;
	},true);

	function makeEventOrder(eventmodel){
		$scope.itemsList = {
	        items1: []
	    };
    	var events = [];
    	for(var i=0;i<eventmodel.length;i++){
    		if(eventmodel[i].group === "Other"){
    			events.push({name:eventmodel[i].label,isgroup:false});
    		}else {
    			events.push({name:eventmodel[i].group,isgroup:true});
    		}
    	}
    	var arrUnique = unique(events);
    	if(eventmodel.length > 0){
    		for (var itm = 0; itm < arrUnique.length; itm += 1) {
         		$scope.itemsList.items1.push({'Id': itm, 'Label': arrUnique[itm].name,'groupstatus':arrUnique[itm].isgroup});
    		}
    	}
	}

	var unique = function(origArr) {
	    var newArr = [],
	        origLen = origArr.length,
	        found, x, y;

	    for (x = 0; x < origLen; x++) {
	        found = undefined;
	        for (y = 0; y < newArr.length; y++) {
	            if (origArr[x].name === newArr[y].name) {
	                found = true;
	                break;
	            }
	        }
	        if (!found) {
	            newArr.push(origArr[x]);
	        }
	    }
    	return newArr;
	}

})