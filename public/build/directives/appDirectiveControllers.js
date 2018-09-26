// directive: quindarwidget
app
.directive('quindarwidget', ['$compile', function (compile) {
  return {
    restrict: 'AE',
    scope: {
        quindarwidget: '@',
        widget: '=widget'
    },
    replace: true,
    controller: ['$scope', function (scope) {
        scope.$watch('quindarwidget', function (value) {
            scope.buildView(value);
        });
    }],
    link: function (scope, elm, attrs) {
        scope.buildView = function (viewName) {
            var z = compile('<' + viewName + '></' + viewName + '>')(scope);
            elm.append(z);
        }
    }
  }
}])
app.directive('alarmpanel',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/alarmpanel/alarmpanel.html',
    controller: 'AlarmPanelCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('AlarmPanelCtrl',['$scope', '$interval', 'dashboardService', 'datastatesService', 'userService','statusboardService', function ($scope,$interval,dashboardService,datastatesService,userService,statusboardService){ 
    
    $scope.telemetry = dashboardService.telemetry;
    var flexprop = 100;
    $scope.alarmpanel = statusboardService.getStatusTable();//status board current alerts;
    var time, ack = "";
    $scope.name = userService.getUserName();
    $scope.role = userService.userRole;
    $scope.contents = [];
    $scope.masteralarmstatus = statusboardService.getMasterAlarmColors();
    $scope.class = []; // for glowing effect

    $scope.vehicleColors = []; //contains all the vehicles to be displayed for the mission
    
    getVehicles();

    //Function to display master alarm and its sub systems
    function getVehicles(){
        $scope.configInterval = $interval(function(){
            var telemetry = dashboardService.telemetry;

            if(!dashboardService.isEmpty(telemetry)){
                var data = dashboardService.sortObject(telemetry.data);
                for(var key in data) {
                    if(data.hasOwnProperty(key)) {
                        //check if the platform exists in the contents
                        var index = $scope.contents.findIndex(content => content.vehicle === key);

                        //add in contents if not exists
                        if(index == -1){
                            $scope.contents.push({
                                "vehicle":key,
                                "flexprop":"",
                                "categories":Object.keys(data[key]),
                                "vehicleColor":"",
                                "categoryColors": [],
                                "tableArray":[],
                                "subCategoryColors" :[],
                                "ackStatus":false
                            });

                            $scope.vehicleColors.push({"vehicle":key,"status":false});
                        } else { //update categories if vehicle exists in contents
                            $scope.contents[index].categories = Object.keys(data[key])
                        }
                    }
                }

                if($scope.contents.length > 0){
                    for(var i=0;i<$scope.contents.length;i++){
                        $scope.contents[i].flexprop = flexprop/$scope.contents.length;
                    }
                }
            } 
        }, 1000);  
    }

    //Function to get colors of each telemetry data item of each vehicle's sub category
    $scope.updateColors = function(){
        var alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType;
        var newtablearray = [];

        time = dashboardService.getTime('UTC');

        for(var i=0;i<$scope.contents.length;i++){
            $scope.contents[i].tableArray = [];
            $scope.contents[i].subCategoryColors = [];
            if($scope.contents[i].vehicle && dashboardService.isEmpty($scope.telemetry) === false){
                var vehicle = $scope.contents[i].vehicle;
                if($scope.contents[i].categories.length > 0){
                    var categories = $scope.contents[i].categories;
                    for(var j=0;j<categories.length;j++){
                        for(var key in $scope.telemetry[vehicle][categories[j]]){
                            if($scope.telemetry[vehicle][categories[j]].hasOwnProperty(key)) {
                                for(var keyval in $scope.telemetry[vehicle][categories[j]][key] ){
                                    if($scope.telemetry[vehicle][categories[j]][key].hasOwnProperty(keyval)){
                                        var telemetryValue = $scope.telemetry[vehicle][categories[j]][key][keyval];
                                        alowValue = telemetryValue.alarm_low;
                                        ahighValue = telemetryValue.alarm_high;
                                        dataValue = telemetryValue.value;
                                        wlowValue = telemetryValue.warn_low;
                                        whighValue = telemetryValue.warn_high;
                                        valueType = typeof telemetryValue.value;

                                        //get colors from datastatesService
                                        var status = datastatesService.getDataColorBound(alowValue,ahighValue,
                                            dataValue,wlowValue,whighValue,valueType);
                                        
                                        $scope.contents[i].subCategoryColors.push(status.color);

                                        var subsystem = categories[j];
                                        var channel = vehicle + "." + subsystem + "." + key + "." + keyval;
                                        var timestamp = Math.round(time.today/1000);
                                        ack = "";

                                        if(status.alert === "ALARM" || status.alert === "CAUTION"){
                                            $scope.contents[i].ackStatus = false; 
                                            $scope.contents[i].tableArray.push(
                                                {
                                                    "alert" : status.alert,
                                                    "bound" : status.bound,
                                                    "vehicle" : vehicle,
                                                    "time" : time.utc,
                                                    "channel" : channel,
                                                    "ack" : ack,
                                                    "timestamp" : timestamp
                                                }
                                            );  
                                        }
                                    }   
                                }
                            }
                        }
                    }
                }
                newtablearray = newtablearray.concat($scope.contents[i].tableArray);
            }
            $scope.vehicleColors[i].status = false;
        }

        //save alerts if any in newtablearray
        if(newtablearray.length > 0 && $scope.vehicleColors.length > 0){
            statusboardService.saveAlerts(newtablearray,$scope.vehicleColors); 
        }

        //Load alerts in the table and set sub system colors
        if($scope.contents.length > 0){
            statusboardService.setSubSystemColors($scope.contents);
            statusboardService.setAlertsTable();  
        }
    }

    $scope.addtablerow = function(veh,$index,color){
        var newArray = [];
        ack = $scope.name + " - " + $scope.role.cRole.callsign;
        var len = $scope.contents[$index].tableArray.length;

        if(color.background === "#FF0000" || color.background === "#FFFF00"){
            $scope.contents[$index].ackStatus = true;
            $scope.class[$index] = "buttonNone"; 
        }

        for(var k=0;k<$scope.contents.length;k++){
            if(k === $index){
                $scope.vehicleColors[k].status = true;
            }
        }

        for(var i=0;i<len;i++){
            $scope.contents[$index].tableArray[i].ack = ack;
            newArray.push($scope.contents[$index].tableArray[i]); 
        }

        statusboardService.saveAlerts(newArray,$scope.vehicleColors);
    }

    $scope.interval = $interval($scope.updateColors, 1000, 0, false); 

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.interval);
            $interval.cancel($scope.configInterval);
        }
    );
}]);





app.directive('alarmpanelsettings', function() { 
    return { 
        restrict: 'E',
        templateUrl:'./directives/alarmpanel/alarmpanelsettings.html', 
        controller: 'AlarmSettingsCtrl',
    };
});

app.controller('AlarmSettingsCtrl',['$scope', function($scope){
    $scope.statusboard = $scope.widget.settings.statusboard;

    $scope.saveAlarmPanelSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        widget.settings.statusboard = $scope.statusboard;
    };

    $scope.closeAlarmPanelSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.statusboard = widget.settings.statusboard;
    }
}]);



app.directive('clock', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clock.html',
	    controller: 'ClockCtrl',
  	}; 
});

app.controller('ClockCtrl',['$scope', 'dashboardService', 'datastatesService', '$interval', function($scope, dashboardService, datastatesService, $interval){
	var tempTime = "";
	var dServiceObj = {};
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color

	$scope.statusIcons = dashboardService.icons;
	
	$scope.$watch('statusIcons',function(newVal,oldVal){
		dServiceObj = newVal; 
    },true);

    $scope.checkForClockData = function(){
    	if(!$scope.widget.settings.clocks){
			$scope.widget.settings.clocks = [{
				name : 'UTC',
				timezone : 'UTC',
			}];
		}

		// initialize clocks
		$scope.clocks = new Array();
		for (var i=0; i<$scope.widget.settings.clocks.length; i++) { 
			$scope.clocks[i] = {
				name : $scope.widget.settings.clocks[i].name,
				delta : '',
				time : {
					days : '000',
					minutes : '00',
					hours : '00',
					seconds : '00'
				},
				style : colorDefault
			}
		}
	}

	$scope.checkForClockData();

	$scope.updateClock = function(){
		for (var i=0; i<$scope.widget.settings.clocks.length; i++){
			
			if(typeof $scope.clocks[i] !== "object"){
				$scope.clocks[i] = new Object();
			}

			//Block to get time for Clock as per timezone
			if($scope.widget.settings.clocks[i].hasOwnProperty('timezone')) {
				$scope.clocks[i].name = $scope.widget.settings.clocks[i].name;
				$scope.clocks[i].time = dashboardService.getTime($scope.widget.settings.clocks[i].timezone);
				$scope.clocks[i].delta = "";

				// healthy if all the status icons are green, else stale 
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
					$scope.clocks[i].style = colorHealthy;
				} 
				else{
					$scope.clocks[i].style = colorStale;
				}

			} else { //Block for timer
				tempTime = dashboardService.countdown($scope.widget.settings.clocks[i].reference);
				$scope.clocks[i].name = $scope.widget.settings.clocks[i].name;
				$scope.clocks[i].time = tempTime;
				$scope.clocks[i].delta = tempTime.sign;

				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green"){
					if(tempTime.sign == "-"){
						if(tempTime.days == '000' && tempTime.hours == '00') {
							if(tempTime.minutes <= '59' && tempTime.minutes > '10') {
								//timer color when it is between 10 and 59 minutes
								$scope.clocks[i].style = colorCaution; 
							}
							if(tempTime.minutes <= '10') {
								//timer color when it is below 10 minutes
								$scope.clocks[i].style = colorAlarm;
							}
						} else {
							$scope.clocks[i].style = colorHealthy;
						}
					} else {
						$scope.clocks[i].style = colorHealthy;
					}
				}else {
					$scope.clocks[i].style = colorStale;
				}

			}

			//show disconnected when database connection fails
			if(dServiceObj.dIcon === "red"){
				$scope.clocks[i].style = colorDisconnected;
			}			
		}
	}

	$scope.interval = $interval($scope.updateClock, 500);

	$scope.remove = function($index) {
		$scope.widget.settings.clocks.splice($index, 1);
		$scope.clocks.splice($index, 1);
	}

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);

}]);
app.directive('clocksettings', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/clock/clocksettings.html',
	    controller: 'ClockSettingsCtrl',
  	}; 
});

app.controller('ClockSettingsCtrl',['$scope', function($scope){

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
		$scope.selected = {};
		$scope.reference = "";
		$scope.name = "";
	}

	$scope.saveSettings = function(widget){
		if( $scope.selected.type ){
			if($scope.selected.type.value == 'Clock') {
				if ($scope.selected.timezone) {
					widget.settings.clocks.push({
						name : $scope.selected.timezone.value,
						timezone : $scope.selected.timezone.zone,
					});
					
					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete = false;

					$scope.selected = {};
				} 
			} else if ($scope.selected.type.value == 'Timer') {
				if ($scope.reference && $scope.name ) {
					widget.settings.clocks.push({
						name : $scope.name,
						reference : $scope.reference,
					});

					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete = false;

					$scope.selected = {};
					$scope.name = "";
					$scope.reference = "";
				}
			} 
		} 
	}

	$scope.selected = {};
	$scope.isLoaded = false;

	$scope.types = [
	{
        'key': 1,
        'value': 'Clock'
    }, 
	{
		'key': 2,
		'value': 'Timer'
	}];

	$scope.timezones = [
	{
        'key': 1,
		'value': 'UTC',
		'zone': 'UTC'
	}, 
	{
		'key': 2,
		'value': 'San Francisco',
		'zone': 'America/Los_Angeles'
	}, 
	{
		'key': 3,
		'value': 'Singapore',
		'zone': 'Asia/Singapore'
	}, 
	{
		'key': 4,
		'value': 'Luxembourg',
		'zone': 'Europe/Luxembourg'
	}];

}]);
app.directive('command', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/command/command.html',
	    controller: 'CommandCtrl',
  	}; 
});

app.controller('CommandCtrl',['$scope', 'userService', 'commandService', 'dashboardService', '$interval', '$window', function($scope, userService, commandService, dashboardService, $interval, $window){
    $scope.email = userService.getUserEmail();
	$scope.mission = dashboardService.getCurrentMission();

    $scope.isLoaded = false;
	$scope.sent = false;

	$scope.initialise = function(){
		$scope.cmd = "";
		$scope.arguments = "";
		$scope.entered =  false;
		$scope.locked = false;
		$scope.disableEnter = false;
		$scope.disableInput = false;
		$scope.disableLock = true;

		$scope.command = {
			name : "",
			arguments : "",
			sent_timestamp : "",
			time : ""
		};
	}

    $scope.enter = function(){
    	if($scope.cmd && $scope.arguments) {
			$scope.command.name = $scope.cmd;
		    $scope.command.arguments = $scope.arguments;
		   	$scope.entered = true;
		   	$scope.disableEnter = true;
	    } 
    }

    $scope.lockCommand = function(){
    	if($scope.command.name && $scope.entered) {
	    	$scope.locked = true;
	    	$scope.disableInput = true;
	    	$scope.disableLock = true;
	    } else {
	    	$window.alert("Please enter the commands before locking");
	    }
    }

    $scope.changeInput = function(){
    	if($scope.entered) {
    		$scope.entered = false;
    		$scope.disableEnter = false;
    	} else {
    		$scope.disableEnter = false;
    		$scope.disableLock = false;
    	}
    }

    $scope.sendCommand = function(){   	
    	var time = dashboardService.getTime('UTC');
    	var systemTime = new Date();
    	var cmdId = systemTime.getTime();
    	$scope.command.sent_timestamp = cmdId;
    	$scope.command.time = time.utc;
        // $scope.sent = true;

    	commandService.saveCommand($scope.email, $scope.command, $scope.mission.missionName)
    	.then(function(response) {
	        if(response.status == 200){
	        	$scope.initialise();
                $scope.commandForm.$setPristine();
                $scope.commandForm.$setUntouched();
	        }
	    });
    }

	$scope.updateCommandlog = function(){
        commandService.getCommandLog($scope.mission.missionName)
        .then(function(response) {
            if(response.status == 200) {
                $scope.commandLog = response.data;

                //get all the responses of a command
                //find the response with the max timestamp
                //assign the status and data to a the commandLog variable
                var commandLen = $scope.commandLog.length;

                for(var i=0;i<commandLen;i++){
                    //call function to get the max date;
                    //loop through the responses and find the response which matches that response
                    //assign to a variable used to display in the command log
                    var maxTime = getMaxTime($scope.commandLog[i].response,"gwp_timestamp");
                    var responsesLen = $scope.commandLog[i].response.length;
                    for(var j=0;j<responsesLen;j++){
                        var dateformat = moment($scope.commandLog[i].response[j].gwp_timestamp).tz('UTC');
                        if(dateformat.valueOf() === maxTime){
                            $scope.commandLog[i].responseStatus = $scope.commandLog[i].response[j].status;
                            $scope.commandLog[i].responseData = $scope.commandLog[i].response[j].metadata_data;
                        }
                    }
                }
            }
        });
    }

    function getMaxTime(responses,filter){
        var timestampArray = [];
        var maxTime;
        var numOfResponses = responses.length;
        for(var j=0;j<numOfResponses;j++){
            var dateformat = moment(responses[j][filter]).tz('UTC');
            timestampArray.push(dateformat.valueOf());
        }
        maxTime = Math.max.apply(null,timestampArray);
        return maxTime;
    }

	$scope.initialise();

    $scope.interval = $interval($scope.updateCommandlog, 1000);

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);
}]);


app.directive('commandsettings', function() { 
  	return { 
        restrict: 'E',  
        templateUrl:'./directives/command/commandsettings.html',
        controller: 'CommandSettingsCtrl',
    };
});

app.controller('CommandSettingsCtrl',['$scope', function($scope){

    $scope.commandlog = $scope.widget.settings.commandlog;

    $scope.closeSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.commandlog = $scope.widget.settings.commandlog;
    }

    $scope.saveSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.widget.settings.commandlog = $scope.commandlog;
    }
}]);
app.directive('datalog',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datalog/datalog.html',
    controller: 'DataLogCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataLogCtrl',['$scope','$interval','dashboardService','datastatesService', 'gridService', function ($scope,$interval,dashboardService,datastatesService, gridService){  
    $scope.telemetry = dashboardService.telemetry;
    var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var prevLogData = [];
    var dServiceObjVal = {};
    $scope.dataStatus = dashboardService.icons;

    $scope.logData =  [];
    var prevData = {
        key : ''
    };
    var dataColor = '';
    
    var boxDiv = $("grid").find('div.box-content')[gridService.getDashboard().current.widgets.indexOf($scope.widget)];
    $scope.boxReference = angular.element(boxDiv);
    $scope.box = $scope.boxReference[0]; //div that results in scrollbar when many rows pushed

    $scope.scrollToBottom = true;

    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);


    /*Function to update the log and set data state colors*/
	$scope.updateLog = function(){
        if($scope.widget.settings.data) {
            if( $scope.widget.settings.data.id !== '' && $scope.widget.settings.data.vehicle !== ''){ 
                if( prevData.key !== $scope.widget.settings.data.key ){
                    while($scope.logData.length > 0){
                        $scope.logData.pop();
                    }               
                }

                updateLogTable();

                if(dServiceObjVal.dIcon === "red"){
                    for(var i=0;i<=$scope.logData.length-1;i++){
                        $scope.logData[i].style = colorDisconnected;  
                    }
                }

                prevData.key = $scope.widget.settings.data.key;
            }
        }
	}

    //Called every time user scrolls in widget
    $scope.boxReference.scroll = function() {
        if($scope.box.scrollHeight == Math.floor($scope.box.scrollTop) + $scope.box.clientHeight) //Check if user is scrolled to bottom of data log
        {
            $scope.scrollToBottom = true;
        }
        else
        {
            $scope.scrollToBottom = false;
        }
        $scope.autoScroll();
    };

    //Check to see if necessary to stay scrolled at the bottom of the data log
    $scope.autoScroll = function()
    {
        if ($scope.scrollToBottom) { //if the user has already scrolled to the bottom, ensure that the scroll remains at the bottom
            $scope.box.scrollTop = $scope.box.scrollHeight;
        }
    }

    function updateLogTable(){
        if($scope.logData.length > 999){
            while($scope.logData.length > 0){
                $scope.logData.pop();
            }
        }

        var currentData = dashboardService.getData($scope.widget.settings.data.key);
        if(currentData) {
            var valType = typeof currentData.value;
            if(valType === "number"){
                currentData.value = parseFloat(currentData.value.toFixed(4));
            }

            if(prevLogData[prevLogData.length-1] === currentData.value){
                if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && 
                    dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green"){
                    dataColor = colorHealthy; 

                } else {
                    dataColor = colorStale;
                }
            }else {
                var colorVal = datastatesService.getDataColor(currentData.alarm_low, 
                    currentData.alarm_high, currentData.value, currentData.warn_low, currentData.warn_high, valType); 

                if(colorVal === "red"){
                    dataColor = colorAlarm;
                }else if(colorVal === "orange"){
                    dataColor = colorCaution;
                }else {
                    dataColor = colorHealthy;
                }

                prevLogData.push(currentData.value);
            }
            
            $scope.logData.push({
                parameter : $scope.widget.settings.data.id,
                value : currentData.value,
                timestamp : $scope.telemetry['time'],
                style : dataColor,
                vehicle : $scope.widget.settings.data.vehicle
            });
        } 
    }

    $scope.interval = $interval($scope.updateLog, 1000, 0, false);   

	$scope.$on("$destroy", 
		function(event) {
			$interval.cancel( $scope.interval );
		}
	);  
}]);



app.directive('datalogsettings', function() { 
  return { 
    restrict: 'E',
    templateUrl:'./directives/datalog/datalogsettings.html', 
    controller: 'DataLogSettingsCtrl',
    };
});

app.controller('DataLogSettingsCtrl',['$scope','$window','$mdSidenav','sidebarService','dashboardService', function($scope,$window,$mdSidenav,sidebarService,dashboardService){
    
    var hasValue;
    $scope.tempParameterSelection = new Object();
    $scope.inputFieldStyles = {};
    $scope.parametersErrMsg = "";

    checkForLogData();

    $scope.saveDataLogSettings = function(widget){
        $scope.parametersErrMsg = "";
        $scope.inputFieldStyles = {};
        //check conditions originally in getValue over here
        //var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        var data = angular.copy($scope.tempParameterSelection);
        if(data && data.vehicle !== "" && data.id !== "" && hasValue){
            $scope.data = angular.copy(data);
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(datavalue.hasOwnProperty("value")){ //as long as data is id, continue with data implementation in data log
                    widget.main = true;
                    widget.settings.active = false;
                    widget.saveLoad = false;
                    widget.delete = false;
                    if ($window.innerWidth > 1440) //close left sidebar
                    {
                        $scope.lock = dashboardService.getLock();
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                    $scope.widget.settings.data = angular.copy($scope.data);
                    var lastCell = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
                    $scope.widget.settings.dataArray = [lastCell];
                    $scope.parametersErrMsg = "";
                    $scope.inputFieldStyles = {};
                }else{
                    $scope.parametersErrMsg = "Selected parameter has no data!";
                    $scope.inputFieldStyles = {'border-color':'#dd2c00'};
                }

            }else{
                $scope.data = angular.copy(data);
                $scope.parametersErrMsg = "Currently there is no data available for this parameter.";
                $scope.inputFieldStyles = {'border-color':'#dd2c00'};
            }
        }else {
            $scope.parametersErrMsg = "Please fill out this field.";
            $scope.inputFieldStyles = {'border-color':'#dd2c00'};
        }

    };

    $scope.closeDataLogSettings = function(widget){
        $scope.lock = dashboardService.getLock();
        $scope.lock.lockLeft = false;
        dashboardService.setLeftLock($scope.lock.lockLeft);

        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.data = angular.copy($scope.widget.settings.data);
        $scope.widget.settings.dataArray = [$scope.data];
        $scope.tempParameterSelection = angular.copy($scope.widget.settings.data);
        if ($window.innerWidth > 1440) //close left sidebar
        {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
        $scope.inputFieldStyles = {};
        $scope.parametersErrMsg = "";
    }

    $scope.getTelemetrydata = function(){
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

    //display telemetry id chosen by the user in the input box
    $scope.readValue = function()
    {
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.id !== "" && $scope.tempParameterSelection)
        {
            return $scope.tempParameterSelection.id;
        }
        else
        {
            return "";
        }
    }

    $scope.getValue = function(isGroup){
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.vehicle !== "" && data.id !== "") //check to see if data is properly chosen
        {
            if(!isGroup) //confirm that group isn't chosen
            {
                hasValue = true;
                $scope.tempParameterSelection = angular.copy(data);
            }
            else
            {
                hasValue = false;
            }
        }
        else
        {
            hasValue = false;
        }
    }

    function checkForLogData(){
        if(!$scope.widget.settings.data){
            $scope.data = {
                id: '',
                vehicle: '',
                key: ''
            };
            $scope.tempParameterSelection = angular.copy($scope.data);
        }else {
            $scope.data = angular.copy($scope.widget.settings.data);
            $scope.widget.settings.dataArray = [$scope.widget.settings.data];
            $scope.tempParameterSelection = angular.copy($scope.widget.settings.data);
            hasValue = true;
        }  
    }
}]);

app.directive('datatable',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datatable/datatable.html',
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataTableCtrl',['$scope','$mdSidenav','$window','$interval','$timeout','dashboardService','sidebarService','datastatesService', function ($scope,$mdSidenav,$window,$interval,$timeout,dashboardService,sidebarService,datastatesService) {  

    //Get values of the checkboxes in settings category display
    $scope.checkedValues = $scope.widget.settings.checkedValues;
    var tableCols = []; // table column data
    var tempvalue = [];
    $scope.dataStatus = dashboardService.icons;
    var dServiceObjVal = {};
    var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var textLeft = {'text-align':'left'};
    var textRight = {'text-align':'right'};
    var roweffect = { 
                        'background-color':'#CFCFD5',
                        'animation': 'background-fade 0.5s forwards',
                        '-webkit-animation': 'background-fade 0.5s forwards',
                        '-moz-animation': 'background-fade 0.5s forwards'
                    };
    $scope.arrow;
    var tempNum = 0;
    var valueReceived = false;
    $scope.currentIndex;
    $scope.askedForGroup;
    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);
    $scope.badSelectionErrMsg = "";
    $scope.errMsgStyles = {};

    // Default table structure -contains 120 rows to best appear for small and large screens
    createTableRows();

    function createTableRows(){
        var num_of_rows = 120;
        var dataObject = {
            contents: [
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedId",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedValue",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedUnits",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedNotes",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedChannel",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            }
            ],
            disabled: false
        }
        //Default table structure -contains 120 rows to best appear for small and large screens
        if($scope.widget.settings.data.length ===  0){
            for (var i = 0; i < num_of_rows; i++) {
                tableCols.push(angular.copy(dataObject));
                $scope.widget.settings.data[i] = new Object();
                $scope.widget.settings.previous[i] = new Object();      
            }
        }
        else {
            for (var i = 0; i < $scope.widget.settings.data.length; i++) {
                if($scope.widget.settings.data[i].hasOwnProperty("value")){
                    dataObject.value = $scope.widget.settings.data[i].value;
                    dataObject.type = $scope.widget.settings.data[i].type;
                    dataObject.undone = $scope.widget.settings.data[i].undone;
                    tableCols.push(angular.copy(dataObject));  
                }else {
                    tableCols.push(angular.copy(dataObject));
                }
            }
        }
    }

    //Function to select telemetry Id
    $scope.getTelemetrydata = function($event, $index, askedForGroup){
        sidebarService.setTempWidget($scope.widget, this); //pass widget and controller functions to sidebarService
        $scope.arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
        $scope.arrow.style.color = "#07D1EA";
        $scope.currentIndex = $index;
        $scope.askedForGroup = askedForGroup;
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

    $scope.getValue = function(isGroup)
    {
        if(isGroup && $scope.askedForGroup) //if the user has asked to see group and chosen a group from left sidebar
        {
            $scope.applyGroup();
            $scope.arrow.style.color = "#b3b3b3";
            $scope.errMsgStyles = {};
            $scope.badSelectionErrMsg = "";
        }
        else if(!isGroup && !$scope.askedForGroup) //if the user has asked to see telemetry id and chosen telemetry id from left sidebar
        {
            $scope.applyValue();
            $scope.arrow.style.color = "#b3b3b3";
            $scope.errMsgStyles = {};
            $scope.badSelectionErrMsg = "";
        }
        else if(!isGroup && $scope.askedForGroup) //if the user has asked to see group and has instead chosen telemetry id from left sidebar
        {
            $scope.arrow.style.color = "#07D1EA";
            $scope.badSelectionErrMsg = "Select a group from the data menu!";
            $scope.errMsgStyles = {'padding':'5px','margin-bottom':'0px','opacity':'1','border-radius':'0px','position':'absolute','top':'35px','left':'0%','right':'0%','z-index':100};
        }
        $scope.widget.settings.dataArray = []; //once data has been added to table, reset dataArray
    }
    //Function to display selected telemetry Id value and its corresponding data values.
    $scope.applyValue = function(){
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.key) {
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(datavalue.hasOwnProperty("value"))
                { 
                    if(savePrevious($scope.currentIndex)) //save info (if object not already created for this row, create it)
                    {  
                        $scope.widget.settings.data[$scope.currentIndex] = new Object();
                    }

                    $scope.widget.settings.data[$scope.currentIndex].type = "data";
                    $scope.widget.settings.data[$scope.currentIndex].value = data.key;
                    $scope.widget.settings.data[$scope.currentIndex].undone = false;
                        
                    $scope.arrow.style.color = "#b3b3b3";
                    if ($window.innerWidth > 1440)
                    {
                        $scope.lock = dashboardService.getLock();
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
            }
        }
    }

    //function to assign key to specific row indices for the selected group
    $scope.applyGroup = function(){
        var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
        if(data && data.key) {
            var datavalue = dashboardService.getData(data.key);
            if(datavalue){
                if(!datavalue.hasOwnProperty("value")){
                    var idList = Object.keys(datavalue);


                    if($scope.table.rows[$scope.currentIndex]){
                        for(var a=1;a<idList.length;a++){
                            if(!$scope.table.rows[$scope.currentIndex+a]){
                                $scope.addRowBelow($scope.currentIndex); // add row below if row does not exist
                            }
                        }
                    }
                    for(var i=0; i<idList.length; i++){

                        if(savePrevious($scope.currentIndex + i)) //save info (if object not already created for this row, create it)
                        {
                            $scope.widget.settings.data[$scope.currentIndex + i] = new Object();
                        }

                        $scope.widget.settings.data[$scope.currentIndex + i].type = "data";
                        $scope.widget.settings.data[$scope.currentIndex + i].value = data.key + '.' + idList[i];
                        $scope.widget.settings.data[$scope.currentIndex + i].undone = false;
                    }

                    $scope.arrow.style.color = "#b3b3b3";
                    if ($window.innerWidth > 1440){
                        $scope.lock = dashboardService.getLock();
                        $scope.lock.lockLeft = false;
                        dashboardService.setLeftLock($scope.lock.lockLeft);
                    }
                }
            }
        }
    }

    //Function to add row above the current row
    $scope.addRowAbove = function($index){
        $scope.table.rows.splice($index,0,{contents :[
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedId",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedValue",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedUnits",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedNotes",
                    "active": "false"
                },
                {   
                    "datavalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedChannel",
                    "active": "false",
                    "datacolor":"",
                    "headervalue":""
                }
                ], 
                disabled:false 
            });
            $scope.widget.settings.data.splice($index, 0, {});
            $scope.widget.settings.previous.splice($index, 0, {});       
    }

    //Function to add below the current row
    $scope.addRowBelow = function($index){
            $scope.table.rows.splice($index+1,0,{contents :[
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedId",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWlow",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedValue",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedWhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textRight,
                    "colshow":"checkedValues.checkedAhigh",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedUnits",
                    "active": "false"
                },
                {
                    "datavalue":"",
                    "headervalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedNotes",
                    "active": "false"
                },
                {   
                    "datavalue":"",
                    "checked":"true",
                    "style":textLeft,
                    "colshow":"checkedValues.checkedChannel",
                    "active": "false",
                    "datacolor":"",
                    "headervalue":""
                }
                ],
                disabled:false 
            });
            $scope.widget.settings.data.splice($index+1, 0, {}); 
            $scope.widget.settings.previous.splice($index+1, 0, {});        
    }

    //Function to delete the current row.
    $scope.deleteRow = function($index){
        if(($index === 0) && ($scope.table.rows.length) === 1){
            $window.alert("Please do not delete this row!Add row above to delete this row.");
        }else {
            $scope.table.rows.splice($index, 1);
            $scope.widget.settings.data.splice($index,1);
            $scope.widget.settings.previous.splice($index,1);
        }
    }

    //Function to move row above.
    $scope.moveRowUp = function($index){
        if($index > 0){
            $scope.table.rows[$index-1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index-1])[0];
            $scope.widget.settings.data[$index-1] = $scope.widget.settings.data.splice($index, 1, $scope.widget.settings.data[$index-1])[0];
            $scope.table.rows[$index-1].colorin = roweffect;

            $scope.widget.settings.previous[$index-1] = $scope.widget.settings.previous.splice($index, 1, $scope.widget.settings.previous[$index-1])[0];

            $timeout(function() {
                $scope.table.rows[$index-1].colorin = '';
            }, 500);
        }
        else{
            $window.alert("This row cannot be moved further up!");
        }
    }

    //Function to move row down.
    $scope.moveRowDown = function($index){
        if(($index) < (($scope.table.rows.length)-1)){
            $scope.table.rows[$index+1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index+1])[0];
            $scope.widget.settings.data[$index+1] = $scope.widget.settings.data.splice($index, 1, $scope.widget.settings.data[$index+1])[0];
            $scope.table.rows[$index+1].colorin = roweffect; 

            $scope.widget.settings.previous[$index+1] = $scope.widget.settings.previous.splice($index, 1, $scope.widget.settings.previous[$index+1])[0];

            $timeout(function() {
                $scope.table.rows[$index+1].colorin = '';
            }, 500);  
        }
        else{
            //$window.alert("This row cannot be moved further down! You have reached the end of the table.");
        }
    }

    //Function to convert a row to a header
    $scope.convertHeader = function($index, header){
        if(savePrevious($index)) //save info (if object not already created for this row, create it)
        {
            $scope.widget.settings.data[$index] = new Object();
        }
        createHeader($index, header); //actually create the header
        $scope.widget.settings.data[$index].undone = false;
    } 

    //create the header without saving current row in "data" into "previous"
    function createHeader($index, header)
    {
        var data = "";
        if(header)
        {
            data = header.data;
        }
        $scope.table.rows[$index] = {
            contents:[{
                "datavalue":"",
                "headervalue": {"data": data },
                "checked":"false",
                "style":"text-align:right;background-color:#1072A4;",
                "colshow":"true",
                "colspan":"9",
                "class":"header",
                "placeholder":"Click here to edit",
                "active":"true"
            }],
            disabled: true
        };
        $scope.widget.settings.data[$index].type = "header";
        $scope.widget.settings.data[$index].value = $scope.table.rows[$index].contents[0].headervalue;
    }

    //Table row and column structure
    checkForRowData();

    //Undo apply telemetry Id or convert to header
    $scope.undo = function($index) {
        //store current row in "previous" as temp
        var tempType = $scope.widget.settings.previous[$index].type;
        var tempValue = $scope.widget.settings.previous[$index].value;
            
        //save current row in "previous" as the current row in "data"
        $scope.widget.settings.previous[$index] = new Object();
        $scope.widget.settings.previous[$index].type = $scope.widget.settings.data[$index].type;
        $scope.widget.settings.previous[$index].value = $scope.widget.settings.data[$index].value;

        //save current row in "data" as temp
        $scope.widget.settings.data[$index] = new Object();
        $scope.widget.settings.data[$index].type = tempType;
        $scope.widget.settings.data[$index].value = tempValue;

        var dataObj = {
            contents: [
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedId",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWlow",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedValue",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAhigh",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedUnits",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedNotes",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            },
            {   
                "datavalue":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedChannel",
                "active": "false",
                "datacolor":"",
                "headervalue":""
            }
            ],
            disabled: false
        }

        //create header if new current row in "data" says so
        if(tempType == "header")
        {
            createHeader($index, tempValue);
        }
        else //otherwise create a data object in the current row
        {
            $scope.table.rows[$index] = angular.copy(dataObj);
        }

        //now this has been undone, don't allow option to undo again
        $scope.widget.settings.data[$index].undone = true;
    }

    //save current data type and value into previous type and value
    function savePrevious(index)
    {
        if($scope.widget.settings.data[index]) //no need to create new object in previous if object already has been made
        {
            if($scope.widget.settings.data[index].hasOwnProperty("value")){
                $scope.widget.settings.previous[index].type = $scope.widget.settings.data[index].type;
                $scope.widget.settings.previous[index].value = $scope.widget.settings.data[index].value;
                return false;
            }else {
                // $scope.widget.settings.previous[index] = new Object();
                $scope.widget.settings.previous[index].type = "";
                $scope.widget.settings.previous[index].value = "";
                return true;
            }
        }
    }

    function checkForRowData(){
        $scope.table = { 
            "rows" : tableCols 
        };

        if($scope.widget.settings.data.length != 0){
            for (var i=0; i<$scope.widget.settings.data.length; i++){
                if($scope.widget.settings.data[i] && $scope.widget.settings.data[i].type == "header") {
                    createHeader(i, $scope.widget.settings.data[i].value);
                }
            }
        }

    } 

    $scope.updateRow = function() {
        for (var i=0; i<$scope.table.rows.length; i++){
            var tempRow = $scope.table.rows[i];
            var data = $scope.widget.settings.data[i];
            if(data) {
                //update values if the row type is data, not header
                if(data.type == "data"){
                    var key = data.value;
                    tempRow.contents[8].datavalue = key;
                    try {
                        //id is the last/leaf node of the dot separated key.
                        var id = key.split('.').slice(-1)[0];

                        var currentData = dashboardService.getData(key);
                        if(currentData) {
                            var valType = typeof currentData.value;
                            if(valType === "number"){
                                currentData.value = parseFloat(currentData.value.toFixed(4));
                            }

                            tempRow.contents[0].datavalue = id;

                            if(currentData.alarm_low){
                                tempRow.contents[1].datavalue = currentData.alarm_low;
                            }else {
                                tempRow.contents[1].datavalue = 'N/A';
                            }

                            if(currentData.warn_low){
                                tempRow.contents[2].datavalue = currentData.warn_low;
                            }else {
                                tempRow.contents[2].datavalue = 'N/A';
                            }

                            tempRow.contents[3].datavalue = currentData.value;
                            if(tempvalue[i] === currentData.value){
                                //stale data
                                if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && 
                                    dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green" ){
                                        tempRow.contents[3].datacolor = colorHealthy;
                                } else {
                                    tempRow.contents[3].datacolor = colorStale;
                                }
                            } else {
                                //new data
                                var colorVal = datastatesService.getDataColor(currentData.alarm_low, currentData.alarm_high,
                                                    currentData.value, currentData.warn_low, currentData.warn_high, valType)
                                if(colorVal === "red"){
                                    tempRow.contents[3].datacolor = colorAlarm;
                                }else if(colorVal === "orange"){
                                    tempRow.contents[3].datacolor = colorCaution;
                                }else{
                                    tempRow.contents[3].datacolor = colorHealthy;
                                }
                                tempvalue[i] = currentData.value;
                            } 

                            if(currentData.warn_high){
                                tempRow.contents[4].datavalue = currentData.warn_high;
                            }else {
                                tempRow.contents[4].datavalue = 'N/A';
                            }

                            if(currentData.alarm_high){
                                tempRow.contents[5].datavalue = currentData.alarm_high;
                            }else {
                                tempRow.contents[5].datavalue = 'N/A';
                            }

                            tempRow.contents[6].datavalue = currentData.units;

                            if(currentData.notes !== ''){
                                tempRow.contents[7].datavalue = currentData.notes;
                            }else {
                                tempRow.contents[7].datavalue = 'N/A';
                            }
                        }
                    } catch(err){
                    
                    }
                }
            } else {
                if(dServiceObjVal.dIcon === "red"){
                    //GUI Disconnected with Database 
                    tempRow.contents[0].datacolor = colorDisconnected;
                    tempRow.contents[1].datacolor = colorDisconnected;
                    tempRow.contents[2].datacolor = colorDisconnected;
                    tempRow.contents[3].datacolor = colorDisconnected;
                    tempRow.contents[4].datacolor = colorDisconnected;
                    tempRow.contents[5].datacolor = colorDisconnected;
                    tempRow.contents[6].datacolor = colorDisconnected;
                    tempRow.contents[7].datacolor = colorDisconnected;
                }
            }
        }
    }

    $scope.interval = $interval($scope.updateRow, 1000, 0, false);

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );

}]);
app.directive('datatablesettings', function() { 
    return { 
        restrict: 'E',
        templateUrl:'./directives/datatable/datatablesettings.html', 
        controller: 'DatatableSettingsCtrl'
    }
});

app.controller('DatatableSettingsCtrl',['$scope', '$window', function($scope, $window){
    $scope.checkedValues = angular.copy($scope.widget.settings.checkedValues);
    var values = angular.copy($scope.checkedValues);
    $scope.columnSelectionErrMsg = "";

    $scope.saveDataTableSettings = function(widget){
        var val = angular.copy($scope.checkedValues);
        var count = 0;
        for(obj in val){
            if(val[obj]){
                count = count + 1;
            }
        }
        if(count > 0) {
            widget.main = true;
            widget.settings.active = false;
            widget.saveLoad = false;
            widget.delete = false;
            values = angular.copy($scope.checkedValues);
            $scope.columnSelectionErrMsg = "";
            setCheckedValues(widget,values);
        } else {
            $scope.columnSelectionErrMsg = "Please select atleast one column.";
        }
    };

    $scope.closeDataTableSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        setCheckedValues(widget,values);
        $scope.checkedValues.checkedId = values.checkedId;

        $scope.checkedValues.checkedAlow = values.checkedAlow;
        $scope.checkedValues.checkedWlow = values.checkedWlow;
        $scope.checkedValues.checkedValue = values.checkedValue;
        $scope.checkedValues.checkedWhigh = values.checkedWhigh;
        $scope.checkedValues.checkedAhigh = values.checkedAhigh;
        $scope.checkedValues.checkedUnits = values.checkedUnits;
        $scope.checkedValues.checkedNotes = values.checkedNotes;
        $scope.checkedValues.checkedChannel = values.checkedChannel;
        $scope.columnSelectionErrMsg = "";
    }

    function setCheckedValues(widget,val){
        widget.settings.checkedValues.checkedId = val.checkedId;
        // widget.settings.checkedValues.checkedName = val.checkedName;
        widget.settings.checkedValues.checkedAlow = val.checkedAlow;
        widget.settings.checkedValues.checkedWlow = val.checkedWlow;
        widget.settings.checkedValues.checkedValue = val.checkedValue;
        widget.settings.checkedValues.checkedWhigh = val.checkedWhigh;
        widget.settings.checkedValues.checkedAhigh = val.checkedAhigh;
        widget.settings.checkedValues.checkedUnits = val.checkedUnits;
        widget.settings.checkedValues.checkedNotes = val.checkedNotes;
        widget.settings.checkedValues.checkedChannel = val.checkedChannel;
    } 
}]);



app.directive('graph', function() {
    return {
        restrict: 'EA',
        templateUrl: "./directives/line/line.html",
        controller : "LineCtrl"
    }
});

app.controller("LineCtrl",['$scope', '$element', '$interval', '$window', 'dashboardService', 'd3Service', function($scope, $element, $interval, $window, dashboardService, d3Service) {
    var telemetry = dashboardService.telemetry;
    var parseTime = d3Service.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    var prevSettings;
    var axisWidth = 70;
    var labelsDiv = $element[0].children[0].children[1];
    var graphDiv = $element[0].children[0].children[0];

    if ($window.innerWidth >= 600 && $window.innerWidth <= 768){
        axisWidth = 50;
    } else if ($window.innerWidth < 600){
        axisWidth = 40;
    }
            
    $scope.data = [[0]];
    $scope.opts = { 
        axes: {
            x: {
                drawGrid: true
            },
            y: {
                drawAxis: true
            }
        }, 
        //dateWindow: [0, 1], 
        legend: "always",
        xlabel: "timestamp",
        ylabel: "", 
        axisLabelWidth : axisWidth,
        xLabelHeight : 16,
        yLabelWidth : 16,
        labelsDiv: labelsDiv,
        labels: ["time"]
    };

    var graph = new Dygraph(graphDiv, $scope.data, $scope.opts );

    $scope.interval = $interval(updatePlot, 1000);   

    $scope.plotData =[];

    function updatePlot() {
        graph.resize();

        if($scope.widget.settings.data){
            if($scope.widget.settings.data.value !== "" && $scope.widget.settings.data.vehicles.length > 0) {
                var paramY = $scope.widget.settings.data.value;
                var vehicles = $scope.widget.settings.data.vehicles;
                var labels = ["time"];
                var series = {};
                var typeFlag = false;

                if(telemetry['time']){
                    var xValue = parseTime(telemetry['time']);
                    var plotPoint = [xValue];

                    //reset plotData when there is a change in settings
                    if (JSON.stringify(prevSettings) !== JSON.stringify($scope.widget.settings.data)){
                        if(!$scope.plotData){
                            $scope.plotData = new Array();
                        } else {
                            $scope.plotData = [];
                        }
                        $scope.stringDataErrMsg = "";
                    }

                    for(var v in vehicles){
                        var vehicle = vehicles[v];

                        if(telemetry[vehicle.name] !== undefined){  
                            var currentData = dashboardService.getData(vehicle.key);
                            if(currentData){
                                if(typeof(currentData.value) == "number") {
                                    var yValue = parseFloat(currentData.value.toFixed(4));
                                    var yUnits = currentData.units;
                                    plotPoint.push(yValue);
                                } else {
                                    typeFlag = true;
                                    break;
                                }
                            }
                        }

                        $scope.plotData.push(plotPoint);
                        labels.push(vehicle.name);
                        series[vehicle.name] = {
                            color : vehicle.color
                        };

                        if ($scope.plotData.length > 100) {
                            $scope.plotData.shift();
                        };
                    }

                    if(paramY){
                        if(yUnits) {
                            var unitString = " [ "+ yUnits + " ] ";
                        } else {
                            var unitString = "";
                        }

                        var ylabel = paramY + unitString;
                    }

                    if(typeFlag){
                        //reset to an empty plot as selected ID is not of type number
                        graph.updateOptions({
                            file: [[0]],
                            axes: {
                                x: {
                                    drawGrid: true
                                },
                                y: {
                                    drawAxis: true
                                }
                            },
                            legend: "always",
                            xlabel: "timestamp",
                            ylabel: "",
                            axisLabelWidth : axisWidth,
                            xLabelHeight : 16,
                            yLabelWidth : 16,
                            labels : labels,
                            series : series
                        });

                        //reset settings data
                        $scope.widget.settings.data = {
                            vehicles : [],
                            value : "",
                            key: ""
                        };

                        // $window.alert(paramY + " is of datatype " + typeof(currentData.value) + 
                        //     ". Please select another ID from data menu.");
                        $scope.stringDataErrMsg = "'"+paramY +"' has no numeric data"+
                            ". Please select another ID from data menu.";
                    } else {
                        graph.updateOptions({
                            file: $scope.plotData,
                            ylabel: ylabel,
                            xlabel: "timestamp",
                            labels: labels,
                            axes: {
                                y: {
                                    drawGrid: true,
                                    valueFormatter: function(y) {
                                        return parseFloat(y.toFixed(4));
                                    },
                                    axisLabelFormatter: function(y) {
                                        return parseFloat(y.toFixed(4));
                                    }
                                },
                                x: {
                                    valueFormatter: function(x) {
                                        return dashboardService.getTime('UTC').utc;
                                    }
                                }
                            },
                            drawPoints: true,
                            //yRangePad: 0,
                            series: series,
                            axisLabelWidth : axisWidth,
                        });
                    }
                }

                prevSettings = angular.copy($scope.widget.settings.data);
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );
}]);
app
.directive('linesettings', function() { 
    return { 
        restrict: 'EA', 
        templateUrl: './directives/line/linesettings.html',
        controller: 'LineSettingsCtrl',
    }
}); 

app.controller('LineSettingsCtrl',['$scope', '$mdSidenav', '$window', 'dashboardService', 'sidebarService', '$interval',
    function($scope, $mdSidenav, $window, dashboardService, sidebarService, $interval){

        var colors = [ "#0AACCF", "#FF9100", "#64DD17", "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
        $scope.previousSettings;
        $scope.interval;
        var hasValue;

        $scope.settings = {
            vehicles : [],
            data : {
                id: '',
                vehicle: '',
                key: ''
            }
        }

        $scope.tempParameterSelection = new Object();
        $scope.inputFieldStyles = {};
        $scope.parametersErrMsg = "";
        $scope.vehicleMsg = "";

        $scope.getTelemetrydata = function(){
            //open the data menu
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

        //display telemetry id chosen by the user in the input box
        $scope.readValue = function()
        {
            var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
            if(data && data.id !== "" && $scope.tempParameterSelection){
                return $scope.tempParameterSelection.id;
            }else{
               return "";
            }
        }
    
        $scope.getValue = function(isGroup){
            var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1]; // get the last selected id from the data menu
            if(data && data.key !== "" && !isGroup) //check to see if data is properly chosen and whether or not it is a group
            {
                for(var i=0; i<$scope.settings.vehicles.length; i++){
                    if($scope.settings.vehicles[i].value === data.vehicle){
                        $scope.settings.vehicles[i].checked = true;
                        $scope.tempParameterSelection = angular.copy(data);
                    }
                    else{
                        $scope.settings.vehicles[i].checked = false;
                    }
                }
                hasValue = true;
            }else{
                hasValue = false;
            }
        }

        // Save
        $scope.saveWidget = function(widget){
            $scope.vehicleMsg = "";
            $scope.parametersErrMsg = "";
            //check conditions originally in getValue over here
           // var data = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
            var data = angular.copy($scope.tempParameterSelection);
            if(data && data.key !== "" && hasValue){
                $scope.settings.data = angular.copy(data);
                var datavalue = dashboardService.getData(data.key);
                if(datavalue){
                    if(datavalue.hasOwnProperty("value")){
                        var count = 0;
                        if($scope.settings.data.key) {
                            if(widget.settings.data.vehicles.length != 0) {
                                widget.settings.data.vehicles = [];
                            }

                            widget.settings.data.value = $scope.settings.data.id;
                            widget.settings.data.key = $scope.settings.data.key;
                            var vehicles = $scope.settings.vehicles;

                            for(var i=0; i<vehicles.length; i++){
                                if(vehicles[i].checked === true){
                                    //create key to access telemetry for each vehicle
                                    var key = createKey(vehicles[i].value, $scope.settings.data.key);

                                    var vehicle = {
                                        'name' : vehicles[i].value,
                                        'color' : vehicles[i].color,
                                        'key' : key
                                    }
                                    widget.settings.data.vehicles.push(vehicle);
                                    count++;
                                }
                            }

                            if ($window.innerWidth > 1440)
                            {
                                $scope.lock = dashboardService.getLock();
                                $scope.lock.lockLeft = false;
                                dashboardService.setLeftLock($scope.lock.lockLeft);
                            }

                            if(count != 0){ //as long as data and vehicles are selected, continue with data implementation in line plot
                                widget.main = true;
                                widget.settings.active = false;
                                $scope.previousSettings = angular.copy($scope.settings);
                                var lastCell = $scope.widget.settings.dataArray[$scope.widget.settings.dataArray.length - 1];
                                $scope.widget.settings.dataArray = [lastCell];
                                $scope.inputFieldStyles = {};
                            } else {
                                $scope.vehicleMsg = "Please choose the vehicle.";
                            }
                        }
                    } else {
                        $scope.parametersErrMsg = "Selected parameter has no data!";
                        $scope.inputFieldStyles = {'border-color':'#dd2c00'};
                    }
                }else {
                    //when no telemetry value available for the telemetry id,set the value in the input but also alert the user.
                    $scope.settings.data = angular.copy(data);
                    $scope.parametersErrMsg = "Currently there is no data available for this parameter.";
                    $scope.inputFieldStyles = {'border-color':'#dd2c00'};
                }
            }else { 
                $scope.parametersErrMsg = "Please fill out this field.";
                $scope.inputFieldStyles = {'border-color':'#dd2c00'};
            }
        }
                
        // Close
        $scope.closeWidget = function(widget){
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
            
            widget.main = true;
            widget.settings.active = false;
            $scope.settings = angular.copy($scope.previousSettings);
            $scope.widget.settings.dataArray = [angular.copy($scope.settings.data)];
            $scope.tempParameterSelection = angular.copy($scope.settings.data);
            if ($window.innerWidth > 1440)
            {
                $scope.lock = dashboardService.getLock();
                $scope.lock.lockLeft = false;
                dashboardService.setLeftLock($scope.lock.lockLeft);
            }

            $scope.parametersErrMsg = "";
            $scope.vehicleMsg = "";
            $scope.inputFieldStyles = {};
        }

        $scope.createVehicleData = function(callback){
            if(!$scope.interval){
                //start an interval only if its not running
                $scope.interval = $interval(function(){
                    var telemetry = dashboardService.telemetry;

                    if(!dashboardService.isEmpty(telemetry)){
                        var data = dashboardService.sortObject(telemetry.data);
                        var count = $scope.settings.vehicles.length;
                        var flag = false; //true if the vehicle name is present in scope settings

                        //Keys in the data variable are the platforms/vehicles available for the mission
                        for(var key in data) {
                            if(data.hasOwnProperty(key)) {
                                for(var i=0; i<$scope.settings.vehicles.length; i++){
                                    if(key == $scope.settings.vehicles[i].value){
                                        flag = true;
                                        break;
                                    }
                                }

                                if(!flag || ($scope.settings.vehicles.length == 0)){
                                    count = count+1;
                                    $scope.settings.vehicles.push({
                                        'key': count,
                                        'value': key,
                                        'checked': false,
                                        'color' : colors[count-1]    
                                    }); 
                                }
                                //reset flag to false for the next vehicle
                                flag = false;
                            }
                        }

                        $interval.cancel($scope.interval);
                        $scope.interval = null;

                        if(callback){
                            callback(true);
                        }
                    }
                }, 1000 );
            }
        }

        function createSettingsData(){
            $scope.createVehicleData(function(result){
                if(result){
                    //Get back the settings saved when page is refreshed
                    if($scope.widget.settings.data.vehicles.length > 0){
                        $scope.settings.data.id = $scope.widget.settings.data.value;
                        $scope.settings.data.key = $scope.widget.settings.data.key;
                        for(var i=0; i<$scope.settings.vehicles.length; i++){
                            for(var j=0; j<$scope.widget.settings.data.vehicles.length; j++){
                                if($scope.settings.vehicles[i].value == $scope.widget.settings.data.vehicles[j].name){
                                    $scope.settings.vehicles[i].checked = true;
                                    $scope.settings.vehicles[i].color = $scope.widget.settings.data.vehicles[j].color;
                                }
                            }
                        }
                    }
                    $scope.previousSettings = angular.copy($scope.settings);
                    $scope.tempParameterSelection = angular.copy($scope.settings.data);
                    $scope.widget.settings.dataArray = [angular.copy($scope.settings.data)];
                    hasValue = true;
                }
            });
        }

        //create settings data for vehicles in the mission
        createSettingsData();

        function createKey(vehicle, key){
            var nodes = key.split('.');
            if(vehicle === nodes[0]){
                return key;
            } else {
                var partKey = nodes.slice(1);
                var newKey = vehicle + "." + partKey.join(".");
                return newKey;
            }
        }

        $scope.$on("$destroy",
            function(event) {
                $interval.cancel($scope.interval);
            }
        );
    }
]);

app.directive('groundtrack',function() { 
  return { 
    restrict: 'EA', 
    templateUrl:'./directives/groundtrack/groundtrack.html',
    controller: 'GroundTrackCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('GroundTrackCtrl',['$scope', 'd3Service', '$element', '$interval', 'dashboardService', 'gridService', 'solarService', 'odeService', function ($scope,d3Service,$element,$interval,dashboardService,gridService,solarService,odeService) { 
  
    var telemetry = dashboardService.telemetry;
    var temp = $element[0].getElementsByTagName("div")[0];
    var el = temp.getElementsByTagName("div")[1];
    var prevSettings;
    var scH = {};		// Current live data
    var scS = {};
	var scHEst = {};	// Estimated data
	var dServiceObjVal = {};
	var est = {};			// Is it estimation? Estimation=true, Actual=false
	var prev_est = {};
	var scHCurrent = {};
	
	$scope.dataStatus = dashboardService.icons;
	//watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);
	
    $scope.timeObj = {};
    $scope.checkboxModel = {
        value1 : true
    };

    var time, solarTime, latestdata;
    var rEarth = 6378.16;   //Earth radius [km]
    var gsAng = 85;
    var π = Math.PI,radians = π / 180,degrees = 180 / π;
    var projection = d3Service.geoEquirectangular().precision(.1);
    var path = d3Service.geoPath().projection(projection);
    var graticule = d3Service.geoGraticule();
    var circle = d3Service.geoCircle();
    var zoom = d3Service.zoom()
                .scaleExtent([1, 10])
                .translateExtent([[0,0], [900, 600]])
                .on("zoom", zoomed);
                        
    var svg = d3Service.select(el)
                        .append("svg")
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "-20 10 1000 500")
                        .attr('width', '100%')
                        .attr('height', '100%')
                        .classed("gt-svg-content", true);

    var transform = d3Service.zoomTransform(svg.node()); 
    var g = svg.append("g");

    var gs = ['GS1','GS2'];
    var station = [[-122.4, 37.7],[103.8, 1.4]];
    //var satRadius = 10000;//7000;
    var stationNames = ['Ground Station 01 - San Francisco ','Ground Station 02 - Singapore'];
	
    g.attr("id","g")
        .attr("x",0)
        .attr("y",0);

    svg.call(zoom);

    if($(window).width() >= screen.width){
        zoom = d3Service.zoom()
                        .scaleExtent([1, 10])
                        .translateExtent([[0,0], [1300, 1000]])
                        .on("zoom", zoomed);
    }

    // Plot world map
    d3Service.json("./directives/groundtrack/d3-maps/world-50m.json", function(error, world) {
        if (error) throw error;  

        // Show graticule
        g.append("path")
            .datum(graticule)
            .attr("d", path)
            .attr("class","graticule"); 

        // Show land
        g.append("path")
            .datum(topojson.feature(world, world.objects.land))
            .attr("class", "land")
            .style("fill","#fff")
            .attr("d", path);

        //countries
        g.append("g")
            .attr("class", "boundary")
            .selectAll("boundary")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append("path")
            .style("fill","#ccc")
            .attr("name", function(d) {return d.properties.name;})
            .attr("id", function(d) { return d.id;})
            .attr("d", path);

        //Plot ground stations
        for (j=0; j<station.length; j++) {
            plotgs(station[j],stationNames[j]);
        }

        // Show dark region (night time)
        $scope.night = g.append("path")
                        .attr("class", "night")
                        .attr("d", path);
        showDayNight();
    });

    //Function to reset the map
    $scope.resetted = function() {
        svg.transition()
            .duration(500)
            .call(zoom.transform, d3Service.zoomIdentity);
    }

    //Function to zoom in using button
    $scope.zoomIn = function(){
        zoom.scaleBy(svg, 2);
    }

    //Function to zoom out using button
    $scope.zoomOut = function(){
        zoom.scaleBy(svg,0.5);
    }

    //Function to show enable or disable ground station coverage area.
    //Commented out as coverage is shown whenever the vehicles/satellites are enabled on ground track
    // $scope.showCoverage = function(checkedVal){
    //     if(checkedVal === true){
    //         g.selectAll("path.gslos").remove();
    //         for (j=0; j<gs.length;j++) {
    //             plotGsCover(station[j]);      
    //         }
    //     } else {
    //         g.selectAll("path.gslos").remove();
    //     }
    // }

    $scope.interval = $interval(updatePlot, 1000);

    $scope.$on("$destroy",
        function(event) {
            $interval.cancel($scope.interval);
        }
    );

    // Function to update data to be plotted
    function updatePlot() {
        g.selectAll("path.route").remove();
        g.selectAll("path.est_route").remove(); 
        g.selectAll("#craft").remove();
        g.selectAll("path.link").remove();
        g.selectAll("line").remove();
        g.selectAll("path.gslink").remove(); 

        showDayNight();
        var vehicles = $scope.widget.settings.vehicles;

        //reset plotData when there is a change in settings
        if (JSON.stringify(prevSettings) !== JSON.stringify(vehicles)){
            $scope.timeObj = {};
            for(i=0; i<vehicles.length; i++){
                scS[i] = [];
                scH[i] = [];
				scHEst[i] = []; 
				scHCurrent[i] = "";
				prev_est[i] = "";
				est[i] = false;
            }
        }
		
        for (i=0; i< vehicles.length; i++){
            latestdata = telemetry[vehicles[i].name];
  
            // Check if the latestdata is available for the selected s/c
            if (latestdata == null) {
                //alert("Latest data not available.");
            }
            else {
                if(vehicles[i].dataStatus === true) {
                    // remove previous Ground Station coverage
                    g.selectAll("path.gslos").remove();

                    //Timestamp array for each vehicle
                    if(!$scope.timeObj[i]){
                        $scope.timeObj[i] = new Array();
                    }

                    //Actual Data If block
                    if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" &&
						dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green"){
	                    // update latestdata
                        var x,y,z,vx,vy,vz;

                        if(vehicles[i].pdata.length > 0){
                            if(dashboardService.getData(vehicles[i].pdata[0].key).hasOwnProperty("value")){
                                x = dashboardService.getData(vehicles[i].pdata[0].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].pdata[1].key).hasOwnProperty("value")){
                                y = dashboardService.getData(vehicles[i].pdata[1].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].pdata[2].key).hasOwnProperty("value")){
                                z = dashboardService.getData(vehicles[i].pdata[2].key).value;
                            } 
                        }

                        if(vehicles[i].vdata.length > 0){
                            if(dashboardService.getData(vehicles[i].vdata[0].key).hasOwnProperty("value")){
                                vx = dashboardService.getData(vehicles[i].vdata[0].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].vdata[1].key).hasOwnProperty("value")){
                                vy = dashboardService.getData(vehicles[i].vdata[1].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].vdata[2].key).hasOwnProperty("value")){
                                vz = dashboardService.getData(vehicles[i].vdata[2].key).value;
                            }
                        }

                        //get current time
                        var dateValue = new Date(telemetry['time']);
                        var timestamp = dateValue.getTime(); //time in milliseconds

						est[i] = false;

					} else { //Estimated data else block
						// The initial x is from the data base
						if (scS[i] != ""){
							var x = scS[i][scS[i].length-1][0];
							var y = scS[i][scS[i].length-1][1];
							var z = scS[i][scS[i].length-1][2];
							var vx = scS[i][scS[i].length-1][3];
							var vy = scS[i][scS[i].length-1][4];
							var vz = scS[i][scS[i].length-1][5];
						}
						else{
                            var x,y,z,vx,vy,vz;
                            if(vehicles[i].pdata.length > 0){
                                if(dashboardService.getData(vehicles[i].pdata[0].key).hasOwnProperty("value")){
                                    x = dashboardService.getData(vehicles[i].pdata[0].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].pdata[1].key).hasOwnProperty("value")){
                                    y = dashboardService.getData(vehicles[i].pdata[1].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].pdata[2].key).hasOwnProperty("value")){
                                    z = dashboardService.getData(vehicles[i].pdata[2].key).value;
                                }  
                            }

                            if(vehicles[i].vdata.length > 0){
                                if(dashboardService.getData(vehicles[i].vdata[0].key).hasOwnProperty("value")){
                                    vx = dashboardService.getData(vehicles[i].vdata[0].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].vdata[1].key).hasOwnProperty("value")){
                                    vy = dashboardService.getData(vehicles[i].vdata[1].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].vdata[2].key).hasOwnProperty("value")){
                                    vz = dashboardService.getData(vehicles[i].vdata[2].key).value;
                                }
                            }
						}

						// The equations of motion: two-body problem, earth-centered:
						var eom = function(xdot, x, t) {
							var mu = 3.9860043543609598E+05;	//[km³/sec²] from http://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/gm_de431.tpc

							r = Math.sqrt(Math.pow(x[0],2)+Math.pow(x[1],2)+Math.pow(x[2],2));
							xdot[0] = x[3];
							xdot[1] = x[4];
							xdot[2] = x[5];
							xdot[3] = -mu /Math.pow(r,3) *x[0];
							xdot[4] = -mu /Math.pow(r,3) *x[1];
							xdot[5] = -mu /Math.pow(r,3) *x[2];
						}

						// Initialize:
						var y0 = [x,y,z,vx,vy,vz],
						t0 = 0,
						dt0 = 1e-10,
						integrator = odeService.IntegratorFactory( y0, eom, t0, dt0)
						
						// Integrate up to tmax:
						var tmax = 1, tEst = [], yEst = []
						while( integrator.step( tmax ) ) {
							// Store the solution at this timestep:
							tEst.push( integrator.t );
							yEst.push( integrator.y );
						}

						// Update with the estimated value
						x = yEst.pop()[0];
						y = yEst.pop()[1];
						z = yEst.pop()[2];
						vx = yEst.pop()[3];
						vy = yEst.pop()[4];
						vz = yEst.pop()[5];

                        if($scope.timeObj[i][$scope.timeObj[i].length-1] != null){
                            var timestamp = $scope.timeObj[i][$scope.timeObj[i].length-1].timestamp + tmax*1000;
                        } else {
                            var timestamp = "";
                        }

						est[i] = true;
					}

                    if(timestamp != ""){
                        // create an object with timestamp and boolean value of est
                        var newTime = {
                            timestamp : timestamp,
                            est : est[i]
                        };
                        $scope.timeObj[i].push(newTime);

                        var diffMins = Math.round(
                            ($scope.timeObj[i][$scope.timeObj[i].length-1].timestamp - $scope.timeObj[i][0].timestamp)/60000);

                        // Remove data points after 90 minutes (7200000ms)
                        if( diffMins >= 90 ) {
                            var timeObj = $scope.timeObj[i].splice(0,1);
                            if(timeObj[0].est){
                                scHEst[i][0].splice(0,1);
                                if(scHEst[i][0].length == 0){
                                    scHEst[i].splice(0,1)
                                }
                            } else {
                                scH[i][0].splice(0,1);
                                if(scH[i][0].length == 0){
                                    scH[i].splice(0,1)
                                }
                            }
                        }

                        // Calculate longitude and latitude from the satellite position x, y, z.
                        // The values (x,y,z) must be Earth fixed.
                        r = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
                        longitude = Math.atan2(y,x)/Math.PI*180;
                        latitude = Math.asin(z/r)/Math.PI*180;

                        // Convert [longitude,latitude] to plot
                        var sat_coord = projGround([longitude,latitude]);

                        //Plot ground station coverage
                        for (j=0; j<gs.length;j++) {
                            plotGsCover(station[j], r);
                        }

                        //Flag is true when there is a switch between actual and estimated data
                        if(est[i] !== prev_est[i]){
                            flag = true;
                        } else {
                            flag = false;
                        }

                        // add longitude and latitude to data_plot
                        var scHData = [longitude, latitude];
                        scHCurrent[i] = scHData;

                        //Push current latitude,longitude to the main array of points
                        if(!est[i]) {
                            if(flag){
                                scH[i][scH[i].length] = new Array();
                            }
                            scH[i][scH[i].length-1].push(scHData);
                        } else {
                            if(flag){
                                scHEst[i][scHEst[i].length] = new Array();
                            }
                            scHEst[i][scHEst[i].length-1].push(scHData);
                        }

                        //Data containing position and velocity of the satellite
                        var scSData = [x, y, z, vx, vy, vz];
                        scS[i].push(scSData);

                        if(vehicles[i].orbitStatus === true){
                            //Orbit path using actual telemetry
                            var route = g.append("path")
                                            .datum({type: "MultiLineString", coordinates: scH[i]})
                                            .attr("class", "route")
                                            .attr("stroke", vehicles[i].color)
                                            .attr("d", path);

                            //Orbit path using estimated data
                            var est_route = g.append("path")
                                            .datum({type: "MultiLineString", coordinates: scHEst[i]})
                                            .attr("class", "est_route")
                                            .attr("stroke", vehicles[i].color)
                                            .attr("d", path);
                        }

                        //Satellite icon and communication links between satellites and ground stations
                        if(vehicles[i].iconStatus === true){
                            var craft = g.append("svg:image")
                                         .attr("xlink:href", "/icons/groundtrack-widget/satellite.svg")
                                         .attr("id", "craft")
                                         .attr("fill", "#000000")
                                         .attr("x",sat_coord[0])
                                         .attr("y",sat_coord[1]-15)
                                         .attr("width",30)
                                         .attr("height",30)
                                         .append("svg:title").text(vehicles[i].name);

                            for (kk=i+1; kk<vehicles.length; kk++) {
                                if (vehicles[kk].iconStatus === true) {
                                    commlink(scS[i][scS[i].length-1],scS[kk][scS[kk].length-1],scHCurrent[i],scHCurrent[kk]);
                                }
                            }
                            for (kk=0; kk<gs.length; kk++) {
                                gsCommLink(station[kk], scHCurrent[i], scS[i][scS[i].length-1], gsAng);
                            }
                        }
                        prev_est[i] = est[i];
                    }
                }
            }
        }
        prevSettings = angular.copy($scope.widget.settings.vehicles);
    }

    //Displays day and night regions on map according to time
    function showDayNight() {
        time = dashboardService.getTime('UTC');
        solarTime = time.today;
        if($scope.night){
            $scope.night.datum(circle.center(antipode(solarService.solarPosition(solarTime))).radius(90)).attr("d", path);
        }
        
    }
    
    //Displays Ground station coverage area    
    function plotGsCover(coord, radius){
        covAng = gsCoverage(radius, gsAng); // Coverage angle [deg]
        var gslos = svg.select('#g')
                        .append("path")
                        .datum(circle.center(coord).radius(covAng))
                        .attr("class", "gslos")
                        .attr("d", path);           
    }; 


    // Communication link between satellites
    function commlink(a,b,c,d){
        //a: Satellite A [x,y,z] [km]
        //b: Satellite B [x,y,z] [km]
        //c: Satellite A [longitude, latitude] [deg]
        //d: Satellite B [longitude, latitude] [deg]

        if(a && b && c && d) {
            // Half angles [radians]
            var th1 = Math.acos(rEarth/Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]));
            var th2 = Math.acos(rEarth/Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2]));

            // Angle between a and b
            var th = Math.acos(dotProd(a,b)/(mag(a)*mag(b)));

            if (th < th1+th2){
                var comm = g.append("path")
                            .datum({type: "LineString", coordinates: [[c[0]+6,c[1]-2], [d[0]+6,d[1]-2]]})
                            .attr("class", "link")
                            .attr("d", path);
            }
        }
    }; 

    // Communication between satellite and ground station
    function gsCommLink(a,b,c,ang){
        // a: Ground station [longitude, latitude] [deg]
        // b: Satellite [longitude, latitude] [deg]
        // c: Satellite [x,y,z] [km]
        // ang: Ground station coverage angle [deg]

        if(a && b && c && ang) {
            // Convert Ground station location //
            // Calculate z
            var gs_z = rEarth*Math.sin(a[1]*radians);

            // Project ground station location on xy plane
            var rp = rEarth*Math.cos(a[1]*radians);

            var gs_y = rp*Math.sin(a[0]*radians);
            var gs_x = rp*Math.cos(a[0]*radians);

            var gs_state = [gs_x,gs_y,gs_z];
            // End convert gound station location //

            // Vector from ground station to satellite
            var r_gs2sat = [c[0]-gs_state[0], c[1]-gs_state[1], c[2]-gs_state[2]];

            // Angle ground station to satellite
            var th = Math.acos(dotProd(r_gs2sat,gs_state)/(mag(r_gs2sat)*mag(gs_state)));

            if (th*degrees < ang) {
                var comm = g.append("path")
                            .datum({type: "LineString", coordinates: [[a[0],a[1]], [b[0]+6,b[1]-2]]})
                            .attr("class", "gslink")
                            .attr("d", path);
            }
        }
    };
         

    // Calculate a dot product
    function dotProd(a,b){
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    }
        
    // Calculate a magnitude
    function mag(a){
        return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
    }

    // Ground station coverage area based on the sat's altitude
    function gsCoverage(r, gsAng){
        // r: radius to satellite [km]
        // gsAng: Ground station coverage angle [deg]
           
        // Temp angle
        alpha = Math.asin(rEarth*Math.sin((180-gsAng)*radians)/r);
          
        //Coverage angle from the center of Earth
        return  180 - (180-gsAng) - alpha*degrees;
    }   

    //Plots ground station and display's name on hover
    function plotgs(coord,name){
            var gs_coord = projGround(coord);   //convert to px
            var gs = svg.select("#g")
                        .append("svg:image")
                        .attr("xlink:href", "/icons/groundtrack-widget/aud_target_02_orange.svg")
                        .attr("id", "gs")
                        .attr("x",gs_coord[0]-10)
                        .attr("y",gs_coord[1]-16)
                        .attr("width",30)
                        .attr("height",30)
                        .append("svg:title").text(name);
    }
     
    //Function to zoom in using mouse scroll or touch events           
    function zoomed(){
        g.attr("transform", d3Service.event.transform);   
    };
      
    function projGround(d){
        return projection(d);
    }; 

    function antipode(position) {
        return [position[0] + 180, -position[1]];
    }
 
}]);


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


app.directive('sample', function() { 
	return { 
    	restrict: 'E',  
    	template: '<p>This is a Sample Widget</p>'
  	}; 
})
app.directive('samplesettings', function() { 
  	return { 
    	restrict: 'EA', 
		template: 	'<div class="savestyles">'+
   						'<form class="form-inline">'+
       						'<div class="row">'+
           						'<div class="col-sm-5">'+
               						'<label for="SampleSettings">This is a Sample Settings Page.</label>'+
           						'</div>'+
       						'</div>'+
       						'<div class="row">'+
           						'<div class="col-sm-11">'+
          						'<hr/>'+
           						'</div>'+
       						'</div>'+
       						'<div class="row">'+
           						'<div class="col-sm-11">'+
           							'<button type="submit" class="btn btn-primary sbtns" ng-click="close(widget)">CLOSE</button>'+
           						'</div>'+
       						'</div>'+
   						'</form>'+
					'</div>',
		controller: function($scope) {
			$scope.close = function(widget){
	            widget.main = true;
	            widget.settings.active = false;
	            widget.saveLoad = false;
	            widget.delete = false;
	        }
		}
	}
});
app
.directive('model', function() {
  	return { 
    	restrict: 'E',
		scope: {
			modelUrl: "=modelUrl",
			widget: "=widget",
			quaternion: "=quaternion"
		},
		controller: 'SatelliteCtrl'
  	}; 
});

app
.controller('SatelliteCtrl',['$scope', '$element','$interval', 'dashboardService', 'solarService', 'datastatesService', function ($scope, $element,$interval, dashboardService, solarService, datastatesService) {
	var container = $element.parent()[0];
	var width = $(container).width();
	var height = $(container).height();
	var aspect = width/height;
	var near = 1;
	var far = 1000;
	var angle = 45;
	var previous;
	var loader = new THREE.AssimpJSONLoader();
	var telemetry = dashboardService.telemetry;
	var π = Math.PI,radians = π / 180,degrees = 180 / π;
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var q1tempval = '';
    var q2tempval = '';
	var q3tempval = '';
    var q4tempval = '';
    var quaternionDataX,quaternionDataY,quaternionDataZ,quaternionDataW;
    var positionDataX,positionDataY,positionDataZ;
	$scope.statusIcons = dashboardService.icons;
	var dServiceObj = {};


	$scope.$watch('statusIcons',function(newVal,oldVal){
        	dServiceObj = newVal; 
    },true);

	//$scope.quaternion = new Object();

	var createRenderer = function(){
    	var renderer =  new THREE.WebGLRenderer();
	    renderer.setSize(width,height);
	    renderer.setClearColor( 0xffffff, 1 );
	    return renderer;
	}

	var createCamera = function(){
	    var camera = new THREE.PerspectiveCamera(angle, aspect, near, far);    
	    camera.position.set( 8, 8, 8 );
	    camera.up = new THREE.Vector3( 0, 0, 1 );
	    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	    return camera;
	}

	var createScene = function(){
	    var scene = new THREE.Scene();
	    return scene;
	}

	var createLight = function(){
	    var light = new THREE.PointLight(0xbfbfbf);
	    light.position.x=0;
	    light.position.y=300;
	    light.position.z=0;
	    return light;
	}

	var createGrid = function(){
		var radius = 100;
		var radials = 16;
		var circles = 50;
		var divisions = 64;

		var gridXY = new THREE.PolarGridHelper( radius, radials, circles, divisions, new THREE.Color( 0x989898 ), new THREE.Color( 0xbfbfbf ) );
		gridXY.rotation.x = Math.PI/2;
		return gridXY;
	}

	var createAxis = function(){
		var axis = new THREE.AxisHelper(20);
		axis.material.linewidth = 2;
		return axis;
	}

	var createArrow = function(name, hex){
		var dir = new THREE.Vector3( 1, 1, 0 );
		var origin = new THREE.Vector3( 0, 0, 0 );
		var arrowLength = 6;

		dir.normalize();
		var arrow = new THREE.ArrowHelper( dir, origin, arrowLength, hex );
		arrow.name = name;
		arrow.visible = false;
		return arrow;
	}
	
	function loadModel(modelUrl) {
		loader.load(modelUrl, function (assimpjson) {
			assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 0.8;
			assimpjson.updateMatrix();
			if (previous) $scope.scene.remove(previous);
			$scope.scene.add(assimpjson);

			previous = assimpjson;
			$scope.cube = assimpjson;
		});
	}

	// Earth Centered Earth Fixed to Earth Centered Inertial
	var ECEF2ECI = function(posX,posY,posZ){
		// Calculat Greenwich Mean Sidereal Time //		
		var time = new Date(telemetry['time']);// Local time
		
		var jd = solarService.date2JulianDate(time);	// Julian date UTC
		var jdcJ2000 = (jd - 2451545.0)/36525.0;	//Julian centuries since epoch J2000

		// Calculate Greenwich Mean Sidereal Time in seconds
		var tGmstSec = 67310.54841 + (876600*3600+8640184.812866)*jdcJ2000 +
			0.093104*Math.pow(jdcJ2000,2) - 6.2*Math.pow(10,-6)*Math.pow(jdcJ2000,3);
		
		// Convert to rad (1 sec =  1/240 deg)
		var tGmstDeg = (tGmstSec % 86400)/240;
		var tGmstRad = tGmstDeg*Math.PI/180;

		// Transformation matrix
		var mat = [ [Math.cos(-tGmstRad), Math.sin(-tGmstRad), 0.0], [-Math.sin(-tGmstRad), Math.cos(-tGmstRad), 0.0],
		[0.0, 0.0, 1.0] ];

		xECI = mat[0][0]*posX + mat[0][1]*posY + mat[0][2]*posZ;
		yECI = mat[1][0]*posX + mat[1][1]*posY + mat[1][2]*posZ;
		zECI = mat[2][0]*posX + mat[2][1]*posY + mat[2][2]*posZ;
		
		return [xECI, yECI, zECI];
	}

	var solarCoords = function(time){
		// Sun's coordinate [longitude, latitude]
		var solCoords = solarService.solarPosition(time);
		var solLongRad = solCoords[0]*radians;
		var solLatRad = solCoords[1]*radians;

		// Sun in ECEF [x,y,z]
		var solECEF = solarService.longLat2ECEF(solLongRad,solLatRad);
		return solECEF;
	}
 	var count =0;
	var render = function(){
		var posX,posY,posZ;
		requestAnimationFrame(render);
		controls.update();
		if($scope.cube && $scope.widget.settings.vehicle && $scope.widget.settings.attitudeData && $scope.widget.settings.positionData){
			if(telemetry[$scope.widget.settings.vehicle]) {
				//set quaternion values for rotation
				quaternionDataX = dashboardService.getData($scope.widget.settings.attitudeData[0].key);
				quaternionDataY = dashboardService.getData($scope.widget.settings.attitudeData[1].key);
				quaternionDataZ = dashboardService.getData($scope.widget.settings.attitudeData[2].key);
				quaternionDataW = dashboardService.getData($scope.widget.settings.attitudeData[3].key);

				$scope.cube.quaternion.x = quaternionDataX.value;
				$scope.cube.quaternion.y = quaternionDataY.value;
				$scope.cube.quaternion.z = quaternionDataZ.value;
				$scope.cube.quaternion.w = quaternionDataW.value;

				//set quaternion values for displaying on widget
				if((typeof quaternionDataX.value) === 'number'){
					$scope.quaternion[$scope.widget.settings.attitudeData[0].id] = quaternionDataX.value.toFixed(4);
				}else if((typeof quaternionDataX.value) === 'string'){
					$scope.quaternion[$scope.widget.settings.attitudeData[0].id] = quaternionDataX.value;
				}


				if((typeof quaternionDataY.value) === 'number'){
					$scope.quaternion[$scope.widget.settings.attitudeData[1].id] = quaternionDataY.value.toFixed(4);
				}else if((typeof quaternionDataY.value) === 'string'){
					$scope.quaternion[$scope.widget.settings.attitudeData[1].id] = quaternionDataY.value;
				}


				if((typeof quaternionDataZ.value) === 'number'){
					$scope.quaternion[$scope.widget.settings.attitudeData[2].id] = quaternionDataZ.value.toFixed(4);
				}else if((typeof quaternionDataZ.value) === 'string'){
					$scope.quaternion[$scope.widget.settings.attitudeData[2].id] = quaternionDataZ.value;
				}


				if((typeof quaternionDataW.value) === 'number'){
					$scope.quaternion[$scope.widget.settings.attitudeData[3].id] = quaternionDataW.value.toFixed(4);
				}else if((typeof quaternionDataW.value) === 'string'){
					$scope.quaternion[$scope.widget.settings.attitudeData[3].id] = quaternionDataW.value;
				}




				// $scope.quaternion[$scope.widget.settings.attitudeData[0].id] = quaternionDataX.value.toFixed(4);
				// $scope.quaternion[$scope.widget.settings.attitudeData[1].id] = quaternionDataY.value.toFixed(4);
				// $scope.quaternion[$scope.widget.settings.attitudeData[2].id] = quaternionDataZ.value.toFixed(4);
				// $scope.quaternion[$scope.widget.settings.attitudeData[3].id] = quaternionDataW.value.toFixed(4);
				
				//set direction to Earth
				positionDataX = dashboardService.getData($scope.widget.settings.positionData[0].key);
				positionDataY = dashboardService.getData($scope.widget.settings.positionData[1].key);
				positionDataZ = dashboardService.getData($scope.widget.settings.positionData[2].key);
				posX = positionDataX.value;
				posY = positionDataY.value;
				posZ = positionDataZ.value;

				//Transform position from ECEF to ECI
				var earthECI = ECEF2ECI(posX,posY,posZ);

				//Plot Satellite to Earth Arrow
				var dirEarth = new THREE.Vector3(-earthECI[0], -earthECI[1], -earthECI[2]);
				dirEarth.normalize();
				$scope.arrowEarth.visible = true;
				$scope.arrowEarth.setDirection(dirEarth);
				
				//Calculate direction to Sun //
				var time = new Date(telemetry['time']);// Local time
				var solECEF = solarCoords(time);

				// Sun in ECI [x,y,z]
				var sunECI = ECEF2ECI(solECEF[0], solECEF[1], solECEF[2]);

				//Plot Earth to Sun Arrow
				var dirSun = new THREE.Vector3(sunECI[0], sunECI[1], sunECI[2]);
				dirSun.normalize();
				$scope.arrowSun.visible = true;		
				$scope.arrowSun.setDirection(dirSun);
			} else {
				//set quaternion values to N/A if telemetry data not available
				$scope.quaternion[$scope.widget.settings.attitudeData[0].id] = "N/A";
				$scope.quaternion[$scope.widget.settings.attitudeData[1].id] = "N/A";
				$scope.quaternion[$scope.widget.settings.attitudeData[2].id] = "N/A";
				$scope.quaternion[$scope.widget.settings.attitudeData[3].id] = "N/A";
			}
	 	}else {
	 		
	 	}
	
	 	$scope.camera.fov = fov * $scope.widget.settings.zoom;
	 	$scope.camera.updateProjectionMatrix();
	   	$scope.renderer.render($scope.scene,$scope.camera);	
	}

	$scope.interval = $interval(updateColors, 1000, 0, false); 

	function updateColors(){
		$scope.quaternion.color = [];
		if($scope.widget.settings.vehicle && $scope.cube && telemetry[$scope.widget.settings.vehicle] && $scope.widget.settings.attitudeData && $scope.widget.settings.positionData){

			var currentData1 = dashboardService.getData($scope.widget.settings.attitudeData[0].key);
			var currentData2 = dashboardService.getData($scope.widget.settings.attitudeData[1].key);
			var currentData3 = dashboardService.getData($scope.widget.settings.attitudeData[2].key);
			var currentData4 = dashboardService.getData($scope.widget.settings.attitudeData[3].key);

			var valTypeq1 = typeof currentData1.value;
			var valTypeq2 = typeof currentData2.value;
			var valTypeq3 = typeof currentData3.value;
			var valTypeq4 = typeof currentData4.value;	

			var q1 = currentData1;
			var q2 = currentData2;
			var q3 = currentData3;
			var q4 = currentData4;	
			

			//color of q1 
			if(q1tempval === q1.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.color[0] = colorHealthy;
				}else {
					$scope.quaternion.color[0] = colorStale;
				}	
			}else{
				var colorValq1 =  datastatesService.getDataColor(q1.alarm_low,q1.alarm_high,q1.value,q1.warn_low,q1.warn_high,valTypeq1); 
				if(colorValq1 === "red"){
                    $scope.quaternion.color[0] = colorAlarm;

                }else if(colorValq1 === "orange"){
                    $scope.quaternion.color[0] = colorCaution;
                }else{
                    $scope.quaternion.color[0] = colorHealthy;
                }
				q1tempval = q1.value;
			}

			//color of q2
			if(q2tempval === q2.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.color[1] = colorHealthy;
				}else {
					$scope.quaternion.color[1] = colorStale;
				}	
			}else{
				var colorValq2 =  datastatesService.getDataColor(q2.alarm_low,q2.alarm_high,q2.value,q2.warn_low,q2.warn_high,valTypeq2);
				if(colorValq2 === "red"){
                    $scope.quaternion.color[1] = colorAlarm;
                }else if(colorValq2 === "orange"){
                    $scope.quaternion.color[1] = colorCaution;
                }else{
                    $scope.quaternion.color[1] = colorHealthy;
                }
				q2tempval = q2.value;
			}

			//color of q3
			if(q3tempval === q3.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.color[2] = colorHealthy;
				}else {
					$scope.quaternion.color[2] = colorStale;
				}
			}else{
				var colorValq3 =  datastatesService.getDataColor(q3.alarm_low,q3.alarm_high,q3.value,q3.warn_low,q3.warn_high,valTypeq3);
				if(colorValq3 === "red"){
                    $scope.quaternion.color[2] =  colorAlarm;

                }else if(colorValq3 === "orange"){
                    $scope.quaternion.color[2] = colorCaution;
                }else{
                    $scope.quaternion.color[2] = colorHealthy;
                }
				q3tempval = q3.value;
			}

			//color of q4
			if(q4tempval === q4.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.color[3] = colorHealthy;
				}else {
					$scope.quaternion.color[3] = colorStale;
				}
			}else{
				var colorValq4 =  datastatesService.getDataColor(q4.alarm_low,q4.alarm_high,q4.value,q4.warn_low,q4.warn_high,valTypeq4);		
				if(colorValq4 === "red"){
                    $scope.quaternion.color[3] =  colorAlarm; 
                }else if(colorValq4 === "orange"){
                    $scope.quaternion.color[3] = colorCaution;
                }else{
                    $scope.quaternion.color[3] = colorHealthy;
                }
				q4tempval = q4.value;
			}

			if(dServiceObj.dIcon === "red"){
				$scope.quaternion.color[0] = colorDisconnected;
				$scope.quaternion[$scope.widget.settings.attitudeData[0].id] = '-';
				$scope.quaternion.color[1] = colorDisconnected;
				$scope.quaternion[$scope.widget.settings.attitudeData[1].id] = '-';
				$scope.quaternion.color[2] = colorDisconnected;
				$scope.quaternion[$scope.widget.settings.attitudeData[2].id] = '-';
				$scope.quaternion.color[3] = colorDisconnected;
				$scope.quaternion[$scope.widget.settings.attitudeData[3].id] = '-';	
			}
		} else {
			//set to default color if telemetry data not available for that vehicle
			$scope.quaternion.color[0] = colorDefault;
			$scope.quaternion.color[1] = colorDefault;
			$scope.quaternion.color[2] = colorDefault;
			$scope.quaternion.color[3] = colorDefault;
		}
	}

	$scope.cube = new THREE.Object3D();
	$scope.scene = createScene();
	$scope.camera = createCamera();
	var fov = $scope.camera.fov;
	$scope.light = createLight();
	$scope.renderer = createRenderer();
	$scope.grid = createGrid();
	$scope.axis = createAxis();
	$scope.arrowEarth = createArrow('Earth', 0x111950);
	$scope.arrowSun = createArrow('Sun', 0xFFAB00);

	$scope.scene.add($scope.light);
	loadModel($scope.modelUrl);
	$scope.scene.add($scope.cube);
	$scope.scene.add($scope.axis);
	$scope.scene.add($scope.grid);
	$scope.scene.add($scope.arrowEarth);
	$scope.scene.add($scope.arrowSun);

	var controls = new THREE.OrbitControls($scope.camera, $scope.renderer.domElement);
	controls.enableZoom = false;
	controls.enablePan = false;

	render();	
	container.appendChild($scope.renderer.domElement);

	$scope.$watch(
		function () { 
			return {
				width: $element.parent()[0].clientWidth,
			    height: $element.parent()[0].clientHeight,
			}
		},
		function (size) {
			$scope.renderer.setSize(size.width, size.height);
			$scope.camera.aspect = size.width / size.height;
			$scope.camera.updateProjectionMatrix();
		}, //listener 
		true //deep watch
	);

	$scope.$watch("modelUrl", function(newValue, oldValue) {
		if (newValue != oldValue) loadModel(newValue);
	});

	$scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
            q1tempval = '';
    		q2tempval = '';
			q3tempval = '';
    		q4tempval = '';
        }
    );
}]);

app
.directive('satellite', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellite.html',
        controller: 'SatCtrl'
    }
});

app.controller('SatCtrl',['$scope', function($scope){
    checkSettings();

    $scope.modelUrl = "./directives/satellite/models/satellite.json";
    $scope.step = 0.01;
    $scope.min = 0.2;
    $scope.max = 1.8;
    $scope.quaternion = new Object();
    $scope.colors = new Object();

    function checkSettings(){
        var settings = $scope.widget.settings;
        if(!settings.hasOwnProperty("zoom")){
            $scope.widget.settings.zoom = 1.0;
        }
    }

    // $scope.changeModel = function() {
    //     if ($scope.modelUrl == "../directives/satellite/models/jeep1.ms3d.json") {
    //         return  $scope.modelUrl = "../directives/satellite/models/cube_LARGE.json";
    //     }
    //     else {
    //         $scope.modelUrl = "../directives/satellite/models/jeep1.ms3d.json";
    //     }
    // };
}]);
app
.directive('satellitesettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellitesettings.html',
        controller: 'SatSettingsCtrl'
    }
});

app.controller('SatSettingsCtrl',['$scope', 'dashboardService', 'sidebarService', '$window', '$mdSidenav','$uibModal', function($scope, dashboardService, sidebarService, $window, $mdSidenav,$uibModal){

    $scope.chosenCategory;
    $scope.attitudeBooleans = [true, true, true, true];
    $scope.positionBooleans = [true, true, true, true];
    checkforPreSavedData();
    $scope.attitudeInputStyles={};
    $scope.positionInputStyles={};
    $scope.attitudeBtnStyles={};
    $scope.positionBtnStyles={};
    $scope.attitudeparametersErrMsg = "";
    $scope.positionparametersErrMsg = "";

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

        if ($window.innerWidth > 1440)
        {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = false;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }

        $scope.attitudeBooleans = [true, true, true, true];
        $scope.positionBooleans = [true, true, true, true];
        $scope.attitudeInputStyles={};
        $scope.attitudeBtnStyles={};
        $scope.positionInputStyles={};
        $scope.positionBtnStyles={};
        $scope.attitudeparametersErrMsg = "";
        $scope.positionparametersErrMsg = "";
	}

	$scope.saveSettings = function(widget){
		var status = checkforSameVehicle($scope.settings.attitudeData,$scope.settings.positionData);
        $scope.positionparametersErrMsg = "";
        $scope.attitudeparametersErrMsg = "";
        $scope.positionInputStyles = {};
        $scope.positionBtnStyles = {};
        $scope.attitudeInputStyles={};
        $scope.attitudeBtnStyles = {};
        if($scope.widget.settings.totalAttitudeArray.length === 0 ){
            $scope.attitudeparametersErrMsg = "Please fill out this field.";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.attitudeBooleans[3])
        {
           $scope.attitudeparametersErrMsg = "Required: All attitude coordinates(q1,q2,q3,qc)!";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.attitudeBooleans[2])
        {
            $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.attitudeBooleans[0])
        {
            $scope.attitudeparametersErrMsg = "Required: All attitude coordinates(q1,q2,q3,qc)!";
            $scope.attitudeInputStyles={'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalPositionArray.length === 0){ // When select position field is untouched
                $scope.positionparametersErrMsg = "Please fill out this field.";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[3]){ 
                $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.positionBooleans[2]){ 
                $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.positionInputStyles = {'border-color':'#dd2c00'};
                $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.positionBooleans[0]){
            //     $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.positionInputStyles = {'border-color':'#dd2c00'};
            //     $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if($scope.widget.settings.totalPositionArray.length === 0){
            $scope.positionparametersErrMsg = "Please fill out this field.";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.positionBooleans[3])
        {
            $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.positionBooleans[2])
        {
            $scope.positionparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if(!$scope.positionBooleans[0])
        {
            $scope.positionparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
            if($scope.widget.settings.totalAttitudeArray.length === 0){
                $scope.attitudeparametersErrMsg = "Please fill out this field.";
                $scope.attitudeInputStyles={'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[3]){
                $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }else if(!$scope.attitudeBooleans[2]){
                $scope.attitudeparametersErrMsg = "Coordinates selected from different vehicles.Select from single vehicle!";
                $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
                $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            }
            // else if(!$scope.attitudeBooleans[0]){
            //     $scope.attitudeparametersErrMsg = "Required: All position coordinates(x,y,z)!";
            //     $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            //     $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            // }
        }
        else if($scope.widget.settings.totalAttitudeArray.length === 4 && $scope.widget.settings.totalPositionArray.length === 3 && status === true){
            $uibModal.open({
                templateUrl: "./directives/satellite/confirmSettings.html",
                controller: 'confirmCtrl',
                controllerAs: '$ctrl',
                bindToController: true,
                scope: $scope,
                resolve: {
                    dataLabel: function () {
                        return "Did you select quaternion coordinates(q1,q2,q3,qc) and position coordinates(x,y,z)?";
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

                if ($window.innerWidth > 1440){
                    $scope.lock = dashboardService.getLock();
                    $scope.lock.lockLeft = false;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
 
                $scope.attitudeBooleans = [true, true, true, true];
                $scope.positionBooleans = [true, true, true, true];
                $scope.attitudeInputStyles={};
                $scope.attitudeBtnStyles={};
                $scope.positionInputStyles={};
                $scope.positionBtnStyles={};
                $scope.attitudeparametersErrMsg = "";
                $scope.positionparametersErrMsg = "";
            },
            function () {
            //handle modal dismiss
                $scope.attitudeBooleans = [true, true, true, true];
                $scope.positionBooleans = [true, true, true, true];
                $scope.attitudeInputStyles={};
                $scope.attitudeBtnStyles={};
                $scope.positionInputStyles={};
                $scope.positionBtnStyles={};
                $scope.attitudeparametersErrMsg = "";
                $scope.positionparametersErrMsg = "";
            });
        }
        else if(status === false)
        {
            $scope.attitudeparametersErrMsg = "Vehicles of both fields do not match! Selected from vehicle: "+$scope.currentAttitudeVehicle;
            $scope.positionparametersErrMsg = "Vehicles of both fields do not match! Selected from vehicle: "+$scope.currentPositionVehicle;
            $scope.attitudeInputStyles = {'border-color':'#dd2c00'};
            $scope.attitudeBtnStyles = {'border-left-color':'#dd2c00'};
            $scope.positionInputStyles = {'border-color':'#dd2c00'};
            $scope.positionBtnStyles = {'border-left-color':'#dd2c00'};
        }
	}

	$scope.getTelemetrydata = function(category){
        //open the data menu
        $scope.chosenCategory = category; //which input box has been selected (position or velocity)
        sidebarService.setTempWidget($scope.widget, this); //which input box has been selected (position or velocity)
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
    $scope.readValues = function(field)
    {
        var trimmedData = [];
        // var stringData = "";
        $scope.stringPositionData = "";
        $scope.stringAttitudeData = "";

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
                        $scope.stringAttitudeData += trimmedData[i].id
                    }
                    else
                    {
                        $scope.stringAttitudeData += trimmedData[i].id + ", ";
                    }
                }
            }
            if($scope.stringAttitudeData)
            {
                return $scope.stringAttitudeData;
            }
            else
            {
                return "";
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
                         $scope.stringPositionData += trimmedData[i].id
                    }
                    else
                    {
                         $scope.stringPositionData += trimmedData[i].id + ", ";
                    }
                }
            }

            if( $scope.stringPositionData)
            {
                return  $scope.stringPositionData;
            }
            else
            {
                return "";
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
            //$scope.attitudeBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the attitude data selected doesn't pass
            //$scope.positionBooleans = [true, true, true, true]; //boolean array to keep track of which conditions the position data selected doesn't pass
 
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
               // var attitudeSettingsfiltered2 = removeDuplicates(attitudeSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffAttitudeVeh = isAnyDiffVehicles(attitudeSettingsfiltered1);// to check if all the values are of the same vehicle
               // var attitudefilteredData = filterSelectedData(attitudeSettingsfiltered2); // check if there are any different values of a category
               // if(isDiffAttitudeVeh === false && attitudefilteredData.length === attitudeSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                if(isDiffAttitudeVeh === false && attitudeSettingsfiltered1.length === 4){    
                    if(attitudeSettingsfiltered1.length === 4){  
                        $scope.settings.attitudeData = attitudeSettingsfiltered1;
                        $scope.vehicle = attitudeSettingsfiltered1[0].vehicle;
                        $scope.widget.settings.totalAttitudeArray = angular.copy(attitudeSettingsfiltered1);
                        $scope.attitudeBooleans[0] = true;
                        $scope.attitudeBooleans[1] = true;
                        $scope.attitudeBooleans[2] = true;
                        $scope.attitudeBooleans[3] = true;
                    }
                    // else if(attitudeSettingsfiltered1.length < 4){
                    //     $scope.attitudeBooleans[0] = false;
                    //     $scope.attitudeBooleans[1] = true;
                    //     $scope.attitudeBooleans[2] = true;
                    //     $scope.attitudeBooleans[3] = true;
                    // }
                }else if(attitudeSettingsfiltered1.length < 4){
                    $scope.attitudeBooleans[0] = false;
                    $scope.attitudeBooleans[1] = true;
                    $scope.attitudeBooleans[2] = true;
                    $scope.attitudeBooleans[3] = true;
                }
                else if(isDiffAttitudeVeh === false){
                    $scope.attitudeBooleans[1] = false;
                    $scope.attitudeBooleans[0] = true;
                    $scope.attitudeBooleans[2] = true;
                    $scope.attitudeBooleans[3] = true;
                }else if(isDiffAttitudeVeh === true && attitudeSettingsfiltered1.length === 4){
                    //$scope.attitudeparametersErrMsg = "";
                    $scope.attitudeBooleans[2] = false;
                    $scope.attitudeBooleans[0] = true;
                    $scope.attitudeBooleans[1] = true;
                    $scope.attitudeBooleans[3] = true;
                }else if(isDiffAttitudeVeh === true && attitudeSettingsfiltered1.length !== 4){
                    $scope.attitudeBooleans[2] = false;
                    $scope.attitudeBooleans[0] = true;
                    $scope.attitudeBooleans[1] = true;
                    $scope.attitudeBooleans[3] = true;
                }
            }else {
                $scope.attitudeBooleans[3] = false;
                $scope.attitudeBooleans[0] = true;
                $scope.attitudeBooleans[1] = true;
                $scope.attitudeBooleans[2] = true;
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
               // var positionSettingsfiltered2 = removeDuplicates(positionSettingsfiltered1,"id");// to remove duplicate selection of a single value
                var isDiffPositionVeh = isAnyDiffVehicles(positionSettingsfiltered1);// to check if all the values are of the same vehicle
               // var positionfilteredData = filterSelectedData(positionSettingsfiltered2);// check if there are any different values of a category
        
                //if(isDiffPositionVeh === false && positionfilteredData.length === positionSettingsfiltered2.length){ // condition to check if the values are of same vehicle and same category
                if(isDiffPositionVeh === false && positionSettingsfiltered1.length === 3){     
                    if(positionSettingsfiltered1.length === 3){  
                        $scope.settings.positionData = positionSettingsfiltered1;
                        $scope.vehicle = positionSettingsfiltered1[0].vehicle;
                        $scope.widget.settings.totalPositionArray = angular.copy(positionSettingsfiltered1);
                        $scope.positionBooleans[0] = true;
                        $scope.positionBooleans[1] = true;
                        $scope.positionBooleans[2] = true;
                        $scope.positionBooleans[3] = true;
                    }
                    // else if(positionSettingsfiltered1.length < 3){
                    //     $scope.positionBooleans[0] = false;
                    //     $scope.positionBooleans[1] = true;
                    //     $scope.positionBooleans[2] = true;
                    //     $scope.positionBooleans[3] = true;
                    // }
                }else if(positionSettingsfiltered1.length < 3){
                    $scope.positionBooleans[0] = false;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[2] = true;
                    $scope.positionBooleans[3] = true;
                }
                else if(isDiffPositionVeh === false){
                    $scope.positionBooleans[1] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[2] = true;
                    $scope.positionBooleans[3] = true;
                }else if(isDiffPositionVeh === true && positionSettingsfiltered1.length === 3){
                    $scope.positionBooleans[2] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[3] = true;
                }else if(isDiffPositionVeh === true && positionSettingsfiltered1.length !== 3){
                    $scope.positionBooleans[2] = false;
                    $scope.positionBooleans[0] = true;
                    $scope.positionBooleans[1] = true;
                    $scope.positionBooleans[3] = true;
                }
            }else {
                $scope.positionBooleans[3] = false;
                $scope.positionBooleans[0] = true;
                $scope.positionBooleans[1] = true;
                $scope.positionBooleans[2] = true;
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
                    $scope.currentAttitudeVehicle = attitudeData[i].vehicle;
                    $scope.currentPositionVehicle = positionData[j].vehicle;
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
}]);


app.controller('positionListCtrl',['$scope','$uibModalInstance','positionItems','$uibModal', function($scope,$uibModalInstance,positionItems,$uibModal) {
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
}]);

app.controller('attitudeListCtrl',['$scope','$uibModalInstance','attitudeItems','$uibModal', function($scope,$uibModalInstance,attitudeItems,$uibModal) {
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
                    return "Is the quaternion coordinates selected order is:q1,q2,q3,qc?";
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

app.controller('confirmCtrl',['$scope','$uibModalInstance','dataLabel','dataItems', function($scope,$uibModalInstance,dataLabel,dataItems) {
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


app
.directive('systemmap', function() { 
	return { 
    	restrict: 'EA', 
		controller: 'SystemMapCtrl',
    	templateUrl: './directives/systemmap/systemmap.html'
    }
});

app.controller('SystemMapCtrl',['$scope', 'dashboardService', '$interval', 'datastatesService', function ($scope, dashboardService, $interval, datastatesService) {

	// data states colors
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var prevDatavalue = [];
    $scope.dataStatus = dashboardService.icons;
    var dServiceObjVal = {};
   // $scope.interval = $interval(updateSystemMap, 1000, 0, false);   

    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);

    //default image on adding qwidget for the first time.
    $scope.widget.settings.imglocation = "/media/systemmaps/sysmap.jpg";
    function updateSystemMap(){

        //Implement when data is available.
            //0.Uncomment interval call to updateSystemMap
        	//1.GET image data of the selected image from database.
        	//2.SET mission name,sub system name ,subcategory name and data id from image data
        	//3.Create a string datavalue to form an argument to dashboardService.getData(datavalue);
        	//4.The datavalue should be a concatenated string mission.subsystem.subcategory.dataid;
        	//5.GET data value of each data id from telemetry collection and check the data state color;
        	//6.SET the value{{tlmdata.value}} and its color{{tlmdata.datacolor}} for display on the selected map at the designated area.

    }

//    $scope.$on("$destroy", 
	// 	function(event) {
	// 		$interval.cancel( $scope.interval );
	// 	}
	// );  
}]);


app
.directive('systemmapsettings', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/systemmap/systemmapsettings.html',
        controller: 'SystemSettingsCtrl',
    };
});

app.controller('SystemSettingsCtrl',['$scope', 'gridService', function($scope, gridService){
	loadSystemMaps();

	function loadSystemMaps(){
		gridService.loadMaps().then(function(response){
			if(response.status == 200) {
				$scope.images = response.data;
			}
		});
	}

	$scope.isLoaded = false;

	checkForImageModel();

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
		$scope.selected.imageid = widget.settings.imageid;
	}

	$scope.saveSettings = function(widget){
		if($scope.selected.imageid){
			widget.main = true;
			widget.settings.active = false;
			widget.saveLoad = false;
			widget.delete = false;
			for(var i=0;i<$scope.images.length;i++){
				if($scope.images[i].imageid === $scope.selected.imageid){
					widget.settings.imageid = $scope.images[i].imageid ;
					widget.settings.imglocation = 'data:image/gif;base64,'+$scope.images[i].image; 
					widget.settings.contents = $scope.images[i].contents;
				}
			}
		}
	}

	function checkForImageModel(){
		if(!$scope.widget.settings.imageid){
			$scope.selected = {};
		}else {
			$scope.selected = {
				imageid : $scope.widget.settings.imageid
			};
		}
	}
}]);
app
.directive('timeline', function() { 
	return { 
    	restrict: 'EA', 
		controller: 'timelineCtrl',
    	templateUrl: './directives/timeline/timeline.html'
    }
});

app.controller('timelineCtrl',['gridService','$scope','$interval','dashboardService','$element', function (gridService,$scope,$interval,dashboardService,$element) {

    var globalgroups = [] ;
    var names = [];
    // create a data set with groups
    var groups = new vis.DataSet();
    var items = new vis.DataSet();

    // create visualization
    var container = $element[0].getElementsByTagName("div")["visualization"];
    var timeline = new vis.Timeline(container);

    $scope.tztimeline = [];
    $scope.tzcontainer = [];
    $scope.tzgroups = [];
    $scope.tzoptions = [];

    var outercontainer = $element[0].getElementsByTagName("div")["timeline"];
    $scope.datetime = "";
    $scope.rowOperationErrorMsg = "";
    $scope.errMsgStyles = {};
    $scope.datetime = $scope.widget.settings.datetime;
    $scope.realtimebutton = { 
        style : {
            'background':'#12C700',
            'float':'right'
        }
    };


    checkForTimezoneData();
    checkForEventData();

    function checkForEventData(){
        gridService.loadTimelineEvents().then(function(response){
            if(response.data.length === 0){
                container.setAttribute("style","display:none");
                $scope.rowOperationErrorMsg = "Please upload timeline data file to view timeline events!";
                // $scope.errMsgStyles = {'padding':'5px','margin-bottom':'0px','opacity':'1','border-radius':'0px','position':'absolute','top':'35px','left':'0%','right':'0%','z-index':100};
            }else {

            }
        });
    }


    $scope.$watch("widget.settings.timezones",function(newval,oldval){
        checkForTimezoneData();
        if($scope.datetime && $scope.datetime.length > 0){
            $scope.changetime();
        }else {
            $scope.realtime();
        }
    },true);

    $scope.$watch("widget.settings.events",function(newval,oldval){
        if(newval){
            displayEvents(newval,$scope.widget.settings.grouporder);
        } 

        if($scope.datetime && $scope.datetime.length > 0){
            $scope.changetime();
        }else {
            $scope.realtime();
        }         
    },true);

    $scope.$watch("widget.settings.grouporder",function(newval,oldval){
        if(newval){
            displayEvents($scope.widget.settings.events,newval);
        } 

        if($scope.datetime && $scope.datetime.length > 0){
            $scope.changetime();
        }else {
            $scope.realtime();
        }         
    },true);


    //Function to load events and its order whenever user has changed in settings
    function displayEvents(events,eventorder){
        var tempnames = [];
        var tcount = 0;
        names = [];
        groups = new vis.DataSet();
        items =  new vis.DataSet();

        for(var c=0;c<eventorder.items1.length;c++){
            for(var b=0;b<events.length;b++){
                if(eventorder.items1[c].groupstatus === false){
                    if(eventorder.items1[c].Label === events[b].label){
                        tempnames.push({
                            id:events[b].id,
                            label:eventorder.items1[c].Label,
                            group:"Other"
                        });
                    }

                }else {
                    if(eventorder.items1[c].Label === events[b].group){
                        tempnames.push({
                            id:events[b].id,
                            label:events[b].label,
                            group:events[b].group
                        });
                    }
                }
            }
        }
        names = buildEventProperties(tempnames);
        var grps = createEvents(groups,names,eventorder.items1);
        var itms = createEventTimeline(items,grps,tempnames);
        $scope.options = gettimelineOptions();
        timeline.setOptions($scope.options);
        timeline.setOptions({orientation: {axis: "none"}});
        timeline.setGroups(grps);
        timeline.setItems(itms);

        if(!$scope.widget.settings.start && !$scope.widget.settings.start){
            $scope.options = gettimelineOptions();
            $scope.widget.settings.start = $scope.options.start;
            $scope.widget.settings.end = $scope.options.end;
        }else {
            $scope.options = gettimelineOptions();
        } 
    }

    //Function to display timezones selected using settings menu.
    function checkForTimezoneData(){ 
        $scope.timezones = new Array();
        $scope.tztimeline = [];
        $scope.tzcontainer = [];
        $scope.tzgroups = [];
        $scope.tzoptions = [];
        var outercontainer = $element[0].getElementsByTagName("div")["timeline"];

        if($scope.widget.settings.start && $scope.widget.settings.end){
            $scope.options = gettimelineOptions();
        }       
        if(!$scope.widget.settings.timezones || $scope.widget.settings.timezones.length === 0){
            $scope.widget.settings.timezones = [
                {
                    name:"UTC",
                    utcoffset : "+00:00",
                    id:"utc",
                    labeloffset : "+ 00"
                }];
        }

        for(var t=0;t<$scope.widget.settings.timezones.length;t++){
            $scope.timezones.push($scope.widget.settings.timezones[t]);
        }

        while (outercontainer.firstChild) {
            outercontainer.removeChild(outercontainer.firstChild);
        }

        for(var a=0;a<$scope.timezones.length;a++){
            $scope.tzcontainer[a] = document.createElement("div");
            $scope.tzcontainer[a].className = "tzgroup";
            outercontainer.insertBefore($scope.tzcontainer[a], outercontainer.childNodes[outercontainer.childNodes.length]);
            var newtimeline = new vis.Timeline($scope.tzcontainer[a]);
            $scope.tztimeline.push(newtimeline);

            if($scope.widget.settings.start && $scope.widget.settings.end){
                 $scope.tzoptions.push({
                    start : $scope.widget.settings.start,
                    end : $scope.widget.settings.end,
                    orientation: {axis: "top"},
                    moveable : false,
                    zoomable : false
                 });
            }else {
                $scope.tzoptions.push({
                    start : new Date(vis.moment(dashboardService.getTime('UTC').today).utcOffset($scope.timezones[a].utcoffset) - 1000 * 60 * 60),
                    end : new Date(vis.moment(dashboardService.getTime('UTC').today).utcOffset($scope.timezones[a].utcoffset) + 1000 * 60 * 60),
                    orientation: {axis: "top"},
                    moveable : false,
                    zoomable : false
                });
            }

            var grp = new vis.DataSet();
            var opt = "";
            var name = $scope.timezones[a].name;
            $scope.tzgroups.push(grp);

            if(name === "San Francisco"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("-08:00");
                    }  
                };
            }else if(name === "Singapore"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+08:00");
                    }  
                };
            }else if(name === "UTC"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+00:00");
                    }  
                };
            }else if(name === "Luxembourg"){
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+02:00");
                    }  
                };
            }else {
                opt = {
                    moment: function(date) {
                        return vis.moment(date).utcOffset("+00:00");
                    }  
                };
            }

            $scope.tztimeline[a].setOptions($scope.tzoptions[a]);
            $scope.tztimeline[a].setOptions(opt);
            $scope.tzgroups[a].add({id:0,content:$scope.timezones[a].name+" (UTC "+$scope.timezones[a].labeloffset+")"});
            $scope.tztimeline[a].setGroups($scope.tzgroups[a]);
        }
    }

    //Event Listener to listen to change in the main timeline window range and move the timezone range accordingly
    timeline.on('rangechanged', function (properties) {
        for(var i=0;i<$scope.timezones.length;i++){
            try{
                $scope.tztimeline[i].setWindow(properties.start, properties.end);
            }catch(e){
                //console.log(e);
            }
        }
        $scope.widget.settings.start = properties.start;
        $scope.widget.settings.end = properties.end;
    });

    //Function to Display current time using current mission time every second
    $scope.updateClock = function(){
        if(dashboardService.getTime('UTC').today){
            //sets current time in all timezones of the timeline 
            timeline.setCurrentTime(vis.moment(dashboardService.getTime('UTC').today).utc());
            if($scope.timezones.length >0){
                for(var i=0;i<$scope.timezones.length;i++){
                    try{
                         $scope.tztimeline[i].setCurrentTime(vis.moment(dashboardService.getTime('UTC').today).utcOffset($scope.timezones[i].utcoffset));
                    }catch(e){
                        //console.log(e);
                    }
                }
            }
            if($scope.widget.settings.datetime === "" || $scope.widget.settings.datetime === undefined){
                $scope.realtimebutton = { 
                    style : {
                        background:'#12C700'
                    }
                };
            }else {
                $scope.datetime = $scope.widget.settings.datetime;
            }
        }
    }

    $scope.interval = $interval($scope.updateClock, 1000);

    //Function to change date time using date time button on the widget and pan to that range.
    $scope.changetime = function(){
        if($scope.datetime){
            $interval.cancel($scope.interval);
            timeline.setOptions({start: new Date(vis.moment($scope.datetime).utc() - 1000 * 60 * 60),end:new Date(vis.moment($scope.datetime).utc() + 1000 * 60 * 60) });
            if($scope.timezones.length > 0){
                for(var i=0;i<$scope.timezones.length;i++){
                    try{
                         $scope.tztimeline[i].setOptions({start: new Date(vis.moment($scope.datetime).utcOffset($scope.timezones[i].utcoffset) - 1000 * 60 * 60),end:new Date(vis.moment($scope.datetime).utcOffset($scope.timezones[i].utcoffset) + 1000 * 60 * 60) });
                    }catch(e){
                        //console.log(e);
                    }
                }
            }
            $scope.realtimebutton.style = {background:'#cccccc52'};
            $scope.widget.settings.datetime = $scope.datetime;
            $scope.dateTimeErrMsg = "";
            $scope.dateTimeErrMsgStyles = {};
        }else {
            //alert("Select a date and time and then set.");
           $scope.dateTimeErrMsg = "Select a date and time and then set.";
           $scope.dateTimeErrMsgStyles = {'border-color':'#dd2c00'};
        }
    };

    //Function to set timeline to realtime or mission time
    $scope.realtime = function(){
        if($scope.interval){
            $interval.cancel($scope.interval);
        }
        $scope.clock = dashboardService.getTime('UTC');
        timeline.setOptions({start: new Date(vis.moment($scope.clock.today).utc() - 1000 * 60 * 60),end:new Date(vis.moment($scope.clock.today).utc() + 1000 * 60 * 60) });  
        if($scope.timezones.length > 0){
            for(var i=0;i<$scope.timezones.length;i++){
                try{
                    $scope.tztimeline[i].setOptions({start: new Date(vis.moment($scope.clock.today).utcOffset($scope.timezones[i].utcoffset) - 1000 * 60 * 60),end:new Date(vis.moment($scope.clock.today).utcOffset($scope.timezones[i].utcoffset) + 1000 * 60 * 60) });
                }catch(e){
                    //console.log(e);
                }
                       
            }
        }
        $scope.datetime = "";
        $scope.widget.settings.datetime = "";
        $scope.interval = $interval($scope.updateClock, 1000);
        $scope.realtimebutton = { 
            style : {
                'background':'#12C700',
                'float':'right'
             }
        };
        $scope.dateTimeErrMsg = "";
        $scope.dateTimeErrMsgStyles = {};
    }

    //Function to create groups with groupname as nested and other
    //Function Parameters :
       //groups = new data set to accomodate the groups
       //names = All the event names
       //grouporder = the order of the events to be displayed in the widget.
    function createEvents(groups,names,grouporder){

        if(grouporder !== undefined){
            var tempArray1 = [];
            var tempArray2 = [];

            //Check if all the events have group name other
            var grpstatus = isGroupOther(names);

            //Non nested and other events
            for(var h=0;h<names.length;h++){
                if(names[h].groupname !== "Nested" && names[h].groupname !== "Other"){
                    tempArray1.push(names[h]);
                } else{
                    tempArray2.push(names[h]);
                }
            }

            //Order your nested and other events
            for(var j=0;j<grouporder.length;j++){
                for(var k=0;k<tempArray2.length;k++){
                    if(grouporder[j].Label === tempArray2[k].ename){
                        tempArray1.push({ename:grouporder[j].Label,groupname:tempArray2[k].groupname})
                    }
                }
            }


            for(var a=0;a<tempArray1.length;a++){
                if(tempArray1[a].groupname === "Nested"){
                    groups.add({id:a,content:tempArray1[a].ename,nestedGroups:[],className:'groupheader'});
                }
                else if(tempArray1[a].groupname === "Other"){
                    if(grpstatus === true){
                        groups.add({id:a,content:tempArray1[a].ename,className:'onlyotherevents'});
                    }else {
                        groups.add({id:a,content:tempArray1[a].ename,className:'otherevent'});
                    }
                   
                }else {
                    groups.add({id:a,content:tempArray1[a].ename});
                }
            }

            for(var b=0;b<tempArray1.length;b++){
                for(var c=0;c<groups.length;c++){
                    if(tempArray1[b].groupname === groups._data[c].content){
                        groups._data[b].className = "innerItem";                 
                        groups._data[c].nestedGroups.push(b);
                    }
                }
            }


        }else {
            for(var a=0;a<names.length;a++){
                if(names[a].groupname === "Nested"){
                    groups.add({id:a,content:names[a].ename,nestedGroups:[],className:'groupheader'});
                }
                else if(names[a].groupname === "Other"){
                    groups.add({id:a,content:names[a].ename,className:'otherevent'});
                }else {
                    groups.add({id:a,content:names[a].ename});
                }
            }        
            for(var b=0;b<names.length;b++){
                for(var c=0;c<groups.length;c++){
                    if(names[b].groupname === groups._data[c].content){
                        groups._data[b].className = "innerItem";                 
                        groups._data[c].nestedGroups.push(b);
                    }
                }
            }

        }
        globalgroups = groups;
        return groups;
    }

    //Function to check if a name already exists in an array to avoid duplicates in group order display
    function contentExists(groupid,groupnames) {
        return groupnames.some(function(el) {
            return el.ename === groupid;
      }); 
    }

    //Function to create the timeline range items for each event
    //Function Parameters:
        //items = new created data set to accomodate all the timeranges of all the events
        //groups = groups created in createEvents function
        //newgroupContents = all events with event name or label and ordered by the user.
    function createEventTimeline(items,groups,newgroupContents){
        items = new vis.DataSet();
        var count = 0;
        gridService.loadTimelineEvents().then(function(response){
            $scope.timelinedata = response.data;

            if($scope.timelinedata.length > 0){
                for(var b=0;b<newgroupContents.length;b++){
                    for(var a=0;a<$scope.timelinedata.length;a++){
                        if(newgroupContents[b].label === $scope.timelinedata[a].eventname){
                            newgroupContents[b].eventdata = $scope.timelinedata[a].eventdata;
                            newgroupContents[b].eventinfo = $scope.timelinedata[a].eventinfo;
                        }
                    }
                }

                for(var k=0;k<groups.length;k++){
                    for (var i = 0; i < newgroupContents.length; i++) {
                        if(groups._data[k].content === newgroupContents[i].label){
                            if(newgroupContents[i].eventdata.length > 0){
                                for(var j=0;j<newgroupContents[i].eventdata.length;j++){
                                    if(newgroupContents[i].eventdata[j].start !== "" && newgroupContents[i].eventdata[j].end !== ""){
                                        //var start = vis.moment(vis.moment.utc().format(newgroupContents[i].eventdata[j].start));
                                        // var end = vis.moment(vis.moment.utc().format(newgroupContents[i].eventdata[j].end));
                                        var start = vis.moment.utc().format(newgroupContents[i].eventdata[j].start);
                                        var end = vis.moment.utc().format(newgroupContents[i].eventdata[j].end);
                                        var content = "";
                                        if(newgroupContents[i].eventdata[j].content){
                                            content = newgroupContents[i].eventdata[j].content;
                                        }
                                        
                                        if(content !== ""){
                                            items.add({
                                                id: count,
                                                content : content,
                                                className : "event",
                                                group : groups._data[k].id,
                                                start : start,
                                                end : end
                                            });
                                        }else{
                                            items.add({
                                                id: count,
                                                content : newgroupContents[i].eventinfo,
                                                className : "event",
                                                group : groups._data[k].id,
                                                start : start,
                                                end : end
                                            });
                                        }
                                        count++;
                                    }else if(newgroupContents[i].eventdata[j].start !== "" && !newgroupContents[i].eventdata[j].end){
                                        //var start = vis.moment(vis.moment.utc().format(newgroupContents[i].eventdata[j].start));
                                        var start = vis.moment.utc().format(newgroupContents[i].eventdata[j].start);
                                        items.add({
                                            id: count,
                                            content : newgroupContents[i].eventinfo,
                                            className : "event",
                                            group : groups._data[k].id,
                                            start : start
                                        });
                                        count++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return items;
    }

    //Function to read events and create names array categorized with groupname
    //Function parameters:
        //eventsselected = all the events selected from the settings menu.
    function buildEventProperties(eventsselected){
        var names = [];

        for(var a=0;a<eventsselected.length;a++){
            names.push({"ename":eventsselected[a].label,"groupname":eventsselected[a].group});
        }

        for (var g = 0; g < names.length; g++) {
            if(names[g].groupname === "Other" || names[g].groupname === "Nested"){

            }else {
                if(contentExists(names[g].groupname,names) === false){
                    names.push({"ename":names[g].groupname,"groupname":"Nested"}); 
                }
            }
        }
        return names;
    }

    //Function to set options for the timeline 
    //Function Parameters:
        // start : the timeline start time
        // end : the timeline end time
    function setStartAndEndForOptions(start,end){
        var options = {
            groupTemplate: function(group){
                var container = document.createElement('div');
                var label = document.createElement('span');
                var outerdiv,button,arrow,innerdiv,hidep,moveupp,movedowp,hide,moveup,movedownp,movedown;
                var button1,arrow1,innerdiv1,hidep1,hide1,textnodehide,moveupp1,moveup1,textnodemoveup,movedownp1,movedown1,textnodemovedown;

                if(group.nestedInGroup){
                    label.innerHTML = group.content ;
                    container.insertAdjacentElement('beforeEnd',label);
                    outerdiv = document.createElement('div');
                    button = document.createElement("button");
                    arrow = document.createElement("i");
                    innerdiv = document.createElement("div");
                    hidep = document.createElement("p");
                    moveupp = document.createElement("p");
                    hidep.className = "listItems";
                    moveupp.className = "listItems";
                    hide = document.createElement("a");
                    moveup = document.createElement("a");
                    movedownp = document.createElement("p");
                    movedownp.className = "listItems";
                    hide = document.createElement("a");
                    moveup = document.createElement("a");
                    movedown = document.createElement("a");


                    outerdiv.className = "dropdown";
                    outerdiv.setAttribute('style', "display:inline");
                    button1 = outerdiv.appendChild(button);
                    button1.className = "btn btn-secondary dropdown-toggle";
                    button1.setAttribute('data-toggle', "dropdown");
                    button1.setAttribute('aria-haspopup', "true");
                    button1.setAttribute('aria-expanded', "false");
                    button1.setAttribute('style', "padding:0px;margin-right:2px;margin-bottom:3px;background:none;");
                    arrow1 = button1.appendChild(arrow);
                    arrow1.className = "fa fa-chevron-right";
                    innerdiv1 = outerdiv.appendChild(innerdiv);
                    innerdiv1.className = "dropdown-menu";
                    innerdiv1.setAttribute('style', "min-width:128px !important;border-radius:0px;background-color:#f1f2f4");
                    hidep1 = innerdiv1.appendChild(hidep);
                    hide1 = hidep1.appendChild(hide);
                    textnodehide = document.createTextNode("Hide"); 
                    hide1.className = "dropdown-item";
                    hide1.setAttribute('style', "padding-left:10px;color:#333;text-decoration:none");
                    hide1.appendChild(textnodehide); 
                    moveupp1 = innerdiv1.appendChild(moveupp);
                    moveup1 = moveupp1.appendChild(moveup);
                    textnodemoveup = document.createTextNode("Move Up"); 
                    moveup1.className = "dropdown-item";
                    moveup1.setAttribute('style', "padding-left:10px;color:#333;text-decoration:none");
                    moveup1.appendChild(textnodemoveup); 
                    movedownp1 = innerdiv1.appendChild(movedownp);
                    movedown1 = movedownp1.appendChild(movedown);
                    textnodemovedown = document.createTextNode("Move Down"); 
                    movedown1.className = "dropdown-item";
                    movedown1.setAttribute('style', "padding-left:10px;color:#333;text-decoration:none");
                    movedown1.appendChild(textnodemovedown); 


                    hide1.addEventListener('click',function(){
                        if(group.nestedInGroup){
                            globalgroups.update({id: group.id, visible: false});
                        }
                    });

                    moveup1.addEventListener('click',function(){
                        if(group.id !== 0){
                            var item1 = group.content.split("_");
                            var item2 = [];
                            var content1;
                            var content2;
                            for(var i=0;i<globalgroups.length;i++){
                                if(group.id === globalgroups._data[i].id){
                                    item2 = globalgroups._data[i-1].content.split("_");
                                    if(item1[0] === item2[0]){
                                        content1 = globalgroups._data[i].content;
                                        content2 = globalgroups._data[i-1].content;
                                        $scope.rowOperationErrorMsg = "";
                                        $scope.errMsgStyles = {};
                                        break;
                                    }
                                    else {
                                        $scope.rowOperationErrorMsg = "This row cannot be moved further up!";
                                        $scope.errMsgStyles = {'padding':'5px','margin-bottom':'0px','opacity':'1','border-radius':'0px','position':'absolute','top':'35px','left':'0%','right':'0%','z-index':100};
                                        break;
                                    }
                                }
                            }

                            if(content1 !== undefined && content2 !== undefined){
                                globalgroups.update({id: group.id,content: content2});
                                globalgroups.update({id: group.id-1,content: content1});
                                setEvents(content1,content2);
                                $scope.rowOperationErrorMsg = "";
                                $scope.errMsgStyles = {};
                            }
                        }else if(group.id === 0){
                            $scope.rowOperationErrorMsg = "This row cannot be moved further up!";
                            $scope.errMsgStyles = {'padding':'5px','margin-bottom':'0px','opacity':'1','border-radius':'0px','position':'absolute','top':'35px','left':'0%','right':'0%','z-index':100};
                        }
                    });

                    movedown1.addEventListener('click',function(){
                        if(group.id !== globalgroups.length-1){
                            var item1 = group.content.split("_");
                            var item2 = [];
                            var content1;
                            var content2;
                            for(var i=0;i<globalgroups.length;i++){
                                if(group.id === globalgroups._data[i].id){
                                    item2 = globalgroups._data[i+1].content.split("_");
                                    if(item1[0] === item2[0] && i !== globalgroups.length - 2){
                                        content1 = globalgroups._data[i].content;
                                        content2 = globalgroups._data[i+1].content;
                                        $scope.rowOperationErrorMsg = "";
                                        $scope.errMsgStyles = {};
                                        break;
                                    }else {
                                        $scope.rowOperationErrorMsg = "This row cannot be moved down!";
                                        $scope.errMsgStyles = {'padding':'5px','margin-bottom':'0px','opacity':'1','border-radius':'0px','position':'absolute','top':'35px','left':'0%','right':'0%','z-index':100};
                                        break;
                                    }
                                }
                            }
                            if(content1 !== undefined && content2 !== undefined){
                                globalgroups.update({id: group.id,content: content2});
                                globalgroups.update({id: group.id+1,content: content1});
                                setEvents(content1,content2);
                                $scope.rowOperationErrorMsg = "";
                                $scope.errMsgStyles = {};
                            }

                        }else if(group.id === globalgroups.length-1){
                            $scope.rowOperationErrorMsg = "This row cannot be moved further down!";
                            $scope.errMsgStyles = {'padding':'5px','margin-bottom':'0px','opacity':'1','border-radius':'0px','position':'absolute','top':'35px','left':'0%','right':'0%','z-index':100};
                        }
                    });
                    container.insertAdjacentElement('afterbegin',outerdiv);
                    return container;
                }else {
                    label.innerHTML = group.content;
                    container.insertAdjacentElement('beforeEnd',label);
                    return container;
                }
            },
            groupEditable: true,
            moment: function(date) {
                return vis.moment(date).utc();
            },
            start : start,
            end : end,
            orientation: {axis: "none"}
        };
        return options;
    }

    //Function to fetch timeline options and display
    function gettimelineOptions(){
        if($scope.widget.settings.start && $scope.widget.settings.end){
            var options = setStartAndEndForOptions($scope.widget.settings.start,$scope.widget.settings.end);
            $scope.options = options;
        }else {
            var starttime = new Date(vis.moment(dashboardService.getTime('UTC').today).utc() - 1000 * 60 * 60 );
            var endtime = new Date(vis.moment(dashboardService.getTime('UTC').today).utc() + 1000 * 60 * 60 ); 
            var options = setStartAndEndForOptions(starttime,endtime);
            $scope.options = options;
        }
        return $scope.options;
    }

   //Function to set event order after using move up or down option from event group dropdown
   //Function Parameters:
        // content1 - item to be changed to content2 position
        // content2 - item to be changed to content1 position
   function setEvents(content1,content2){
        var tempindex1 = "";
        var templabel1 = "";
        var tempgroup1 = "";
        var tempeventdata1= [];
        var tempeventinfo1 = "";
        var tempindex2 = "";
        var templabel2 = "";
        var tempgroup2 = "";
        var tempeventdata2= [];
        var tempeventinfo2 = "";

        for(var k=0;k<$scope.widget.settings.events.length;k++){
            if($scope.widget.settings.events[k].label === content1){
                tempindex1 = k;
                templabel1 = content1;
                tempgroup1 = $scope.widget.settings.events[k].group;
                tempeventdata1 = $scope.widget.settings.events[k].eventdata;
                tempeventinfo1 = $scope.widget.settings.events[k].eventinfo;
            }else if($scope.widget.settings.events[k].label === content2){
                tempindex2 = k;
                templabel2 = content2;
                tempgroup2 = $scope.widget.settings.events[k].group;
                tempeventdata2 = $scope.widget.settings.events[k].eventdata;
                tempeventinfo2 = $scope.widget.settings.events[k].eventinfo;
            }
        }

        $scope.widget.settings.events[tempindex1].label = templabel2;
        $scope.widget.settings.events[tempindex1].group = tempgroup2;
        $scope.widget.settings.events[tempindex1].eventdata = tempeventdata2;
        $scope.widget.settings.events[tempindex1].eventinfo = tempeventinfo2


        $scope.widget.settings.events[tempindex2].label = templabel1;
        $scope.widget.settings.events[tempindex2].group = tempgroup1;
        $scope.widget.settings.events[tempindex2].eventdata = tempeventdata1;
        $scope.widget.settings.events[tempindex2].eventinfo = tempeventinfo1;
   }

   //Function to check if the events displayed in the timeline are group other
   // if there are all other css is different for only those events
    function isGroupOther(events){
        var isGrpOtherStatus = false;
        var allcount = 0;

        for(var i=0;i<events.length;i++){
            if(events[i].groupname === "Other"){
                allcount++;
            }
        }
        if(allcount === events.length){
            isGrpOtherStatus = true;
        }else {
            isGrpOtherStatus = false;
        }
        return isGrpOtherStatus;
   }

    $scope.$on("$destroy", 
        function(event) {
           $interval.cancel( $scope.interval );
        }
    );  
}]);




app.directive('timelinesettings', function() { 
	return { 
    	restrict: 'E',  
	    templateUrl:'./directives/timeline/timelinesettings.html',
	    controller: 'timelineSettingsCtrl',
  	}; 
});

app.controller('timelineSettingsCtrl',['$scope','gridService', function($scope,gridService){

	$scope.selectByGroupData = [];
	var reloaded = false;
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

    $scope.sortableOptions = {
        containment: '#scrollable-container',
        scrollableContainer: '#scrollable-container',
        //restrict move across columns. move only within column.
        accept: function (sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
        }
    };

    $scope.timezoneErrMsg = "";
    $scope.eventErrMsg = "";

    //Function to created unique groups from a list of groups
    function uniqueItems(origArr) {
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

	//Function to display settings based on the data available from database.
	function checkForEvents(data){	
		if($scope.widget.settings.events === undefined){
			if($scope.selectByGroupData.length > 0){
				$scope.widget.settings.events = [];
				reloaded = false;
				$scope.selectByGroupModel = [];
				for(var a=0;a<data.length;a++){
					$scope.selectByGroupModel.push(data[a]);
					$scope.widget.settings.events.push(data[a]);
				}
				$scope.widget.settings.grouporder = {
					items1: []
				};
				makeEventOrder($scope.selectByGroupModel,$scope.widget.settings.grouporder,reloaded);

    			for(var g=0;g<$scope.itemsList.items1.length;g++){
    				$scope.widget.settings.grouporder.items1.push($scope.itemsList.items1[g]);
    			}
			}else if($scope.selectByGroupData.length === 0){
				$scope.selectByGroupModel = [];
				$scope.widget.settings.events = [];
				$scope.widget.settings.grouporder = [];
			}
		}else if($scope.widget.settings.events.length > 0 && $scope.widget.settings.grouporder.items1.length > 0){
			$scope.selectByGroupModel = []; 
			reloaded = true;
			getPrevSavedEventModel();

		}
	}

	$scope.closeSettings = function(widget){
		widget.main = true;
		widget.settings.active = false;
		widget.saveLoad = false;
		widget.delete = false;
		getPrevSavedEventModel();
		$scope.eventErrMsg = "";
		$scope.timezoneErrMsg = "";	
	}

	$scope.saveSettings = function(widget){
		var tzExistsStatus = "";
		if( $scope.selected.type ){
			if($scope.selected.type.value === 'Timezone') {
				if ($scope.selected.timezone) {
					tzExistsStatus = tzExists(widget.settings.timezones,$scope.selected.timezone.name);
						if(tzExistsStatus === true){
							//alert("This time axis already exists in the qwidget.");
							$scope.timezoneErrMsg = "This time axis already exists in the qwidget";
							$scope.eventErrMsg = "";
							widget.settings.timezones = widget.settings.timezones;
							$scope.selected.timezone = {};
						}else {
							widget.settings.timezones.push($scope.selected.timezone); 
							widget.main = true;
							widget.settings.active = false;
							widget.saveLoad = false;
							widget.delete = false;
							$scope.selected = {};
							$scope.eventErrMsg = "";
							$scope.timezoneErrMsg = "";
						}
				} 
			} else if ($scope.selected.type.value == 'Events') {
				reloaded = false;
				if($scope.selectByGroupModel.length > 0){
					widget.settings.events = [];
					
					for(var j=0;j<$scope.selectByGroupData.length;j++){
						for(var k=0;k<$scope.selectByGroupModel.length;k++){
							if($scope.selectByGroupData[j].label === $scope.selectByGroupModel[k].label){
								widget.settings.events.push($scope.selectByGroupModel[k]);
							}
						}
					}
					widget.settings.grouporder = {
						items1:[]
					};
					for(var b=0;b<$scope.itemsList.items1.length;b++){
						widget.settings.grouporder.items1.push($scope.itemsList.items1[b]);
					}

					widget.main = true;
					widget.settings.active = false;
					widget.saveLoad = false;
					widget.delete =  false;
					$scope.eventErrMsg = "";
					$scope.timezoneErrMsg = "";
				}else if($scope.selectByGroupModel.length === 0){
					// alert("Select atleast one event");
					$scope.eventErrMsg = "Select atleast one event";
					$scope.timezoneErrMsg = "";
				}
			} 
		} 
	}

	//Function to check if a timezone already exists in the widget.
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

	//Function to load timeline data from the database and create data set for settings
    function loadTimelineEvents(){
        var groups = [];
        $scope.selectByGroupData = [];
        gridService.loadTimelineEvents().then(function(response){
        	if(response.data.length > 0){
        		for(var i=0;i<response.data.length;i++){
	        		$scope.selectByGroupData.push({
	        			id:i,
	        			label:response.data[i].eventname,
	        			group:response.data[i].eventgroup,
	        		});

	        		groups.push({name:response.data[i].eventgroup});

        		}
        		checkForEvents($scope.selectByGroupData);
        		var uniquegroups = uniqueItems(groups);
        		for(var b=0;b<uniquegroups.length;b++){
        	 		ugrps.push(uniquegroups[b].name);
        		}
        	}else {
        		$scope.selectByGroupData = [];
        		$scope.selectByGroupModel = [];
        	}
        });

    }

    $scope.$watch("selectByGroupModel",function(newval,oldval){
    	if($scope.selectByGroupModel && $scope.selectByGroupModel.length > 0){
    		makeEventOrder($scope.selectByGroupModel,$scope.widget.settings.grouporder,reloaded);
    	}
    },true);

    //Function to display previous saved selected events
	function getPrevSavedEventModel(){
		reloaded = true;
		$scope.selectByGroupModel = [];
		$scope.itemsList = {
			items1:[]
		}
		var tempnames = [];

 		for(var c=0;c<$scope.widget.settings.grouporder.items1.length;c++){
            for(var b=0;b<$scope.widget.settings.events.length;b++){
                if($scope.widget.settings.grouporder.items1[c].groupstatus === false){
                    if($scope.widget.settings.grouporder.items1[c].Label === $scope.widget.settings.events[b].label){
                        tempnames.push({
                            id:$scope.widget.settings.events[b].id,
                            label:$scope.widget.settings.grouporder.items1[c].Label,
                            group:"Other"
                        });
                    }

                }else {
                    if($scope.widget.settings.grouporder.items1[c].Label === $scope.widget.settings.events[b].group){
                        tempnames.push({
                            id:$scope.widget.settings.events[b].id,
                            label:$scope.widget.settings.events[b].label,
                            group:$scope.widget.settings.events[b].group
                        });
                    }
                }
            }
        }

        for(var j=0;j<$scope.selectByGroupData.length;j++){
        	for(var k=0;k<tempnames.length;k++){
        		if($scope.selectByGroupData[j].label === tempnames[k].label){
        			$scope.selectByGroupModel.push($scope.selectByGroupData[j]);
        		}
        		
        	}
        }
        makeEventOrder($scope.selectByGroupModel,$scope.widget.settings.grouporder,reloaded);
	}

	//Function to selected events in selected event order
	function makeEventOrder(eventmodel,order,loadstatus){

		if(eventmodel !== undefined){
			if(eventmodel.length !== order.items1.length){
				loadstatus = false;
			}else{
				loadstatus = true;
			}
			$scope.itemsList = {
		        items1: []
		    };
		    var newarr = [];
		    //To set previous saved settings
		    if(loadstatus === true){
		    	for (var itm = 0; itm < order.items1.length; itm += 1) {
	         		$scope.itemsList.items1.push({Id:order.items1[itm].Id,Label:order.items1[itm].Label,groupstatus:order.items1[itm].groupstatus});
	    		}
		    }else if(loadstatus === false) { //To set new settings
		    	var events = [];
	    		for(var i=0;i<eventmodel.length;i++){
	    			if(eventmodel[i].group === "Other"){
	    				events.push({name:eventmodel[i].label,isgroup:false});
	    			}else {
	    				events.push({name:eventmodel[i].group,isgroup:true});
	    			}
	    		}
	    		var arrUnique = uniqueItems(events);
	    		for (var itm = 0; itm < arrUnique.length; itm += 1) {
	         		$scope.itemsList.items1.push({'Id': itm, 'Label': arrUnique[itm].name,'groupstatus':arrUnique[itm].isgroup});
	    		}
		    }
		}
	}

}]);