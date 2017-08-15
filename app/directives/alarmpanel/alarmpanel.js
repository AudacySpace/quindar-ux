app.directive('alarmpanel',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/alarmpanel/alarmpanel.html',
    controller: 'AlarmPanelCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('AlarmPanelCtrl',function ($scope,$window,$element,$interval,dashboardService,datastatesService,userService){  
    
    var telemetry = dashboardService.telemetry;
    var flexprop = 100;
    var colorValues = {
        alarmcolor : {background:'#FF0000'},
        cautioncolor : {background:'#FFFF00'},
        stalecolor : {background:'#71A5BC'},
        healthycolor : {background:'#12C700'},
        disconnectedcolor :{background:'#CFCFD5'},
        defaultcolor :{background:'#000000'}
    }

    $scope.statustable = [{
        "time":" - ",
        "channel":"",
        "alert":" ",
        "bound":" ",
        "ack":" "
    },
    {
        "time":" - ",
        "channel":" ",
        "alert":" ",
        "bound":" ",
        "ack":" "
    }];

    var time,name,callsign,ack;
    $scope.class = [];
    $scope.checked = [];
    getVehicles();


    //Function to display master alarm and its sub systems
    function getVehicles(){
        var interval = $interval(function(){
            var currentMission = dashboardService.getCurrentMission();

            if(currentMission.missionName != ""){
                if($scope.widget.settings.contents.length == 0){
                    dashboardService.getConfig(currentMission.missionName)
                        .then(function(response){
                            if(response.data) {
                                var data = dashboardService.sortObject(response.data);
                                for(var key in data) {
                                    if(data.hasOwnProperty(key)) {
                                        $scope.widget.settings.contents.push({
                                            "vehicle":key,
                                            "flexprop":"",
                                            "categories":Object.keys(data[key]),
                                            "vehicleColor":"",
                                            "categoryColors": [],
                                            "tableArray":[],
                                            "subCategoryColors" :[],
                                            "ackStatus":false
                                        });
                                    }
                                }
                                if($scope.widget.settings.contents.length > 0){   
                                    for(var i=0;i<$scope.widget.settings.contents.length;i++){
                                        $scope.widget.settings.contents[i].flexprop = flexprop/$scope.widget.settings.contents.length;
                                    }                    
                                }
                            } 
                        }); 
                }
                $interval.cancel(interval);
            } 
        }, 1000);  
    }

    $scope.interval = $interval(updateColors, 1000, 0, false); 

    //Function to get colors of each telemetry data item of each vehicle's sub category
    function updateColors(){
        time = dashboardService.getTime(0);
        name = userService.getUserName();
        callsign = userService.getCurrentCallSign();
        ack = name+" - "+callsign;
        var alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType;

        for(var i=0;i<$scope.widget.settings.contents.length;i++){
            $scope.widget.settings.contents[i].tableArray = [];
            $scope.widget.settings.contents[i].subCategoryColors = [];
            if($scope.widget.settings.contents[i].vehicle && dashboardService.isEmpty(telemetry) === false){
                if($scope.widget.settings.contents[i].categories.length > 0){
                    for(var j=0;j<$scope.widget.settings.contents[i].categories.length;j++){
                        for(var key in telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]]){
                            if(telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]].hasOwnProperty(key)) {
                                for(var keyval in telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key] ){
                                    if(telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key].hasOwnProperty(keyval)){
                                        var alowValue = telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key][keyval].alarm_low;
                                        var ahighValue = telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key][keyval].alarm_high;
                                        var dataValue = telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key][keyval].value;
                                        var wlowValue = telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key][keyval].warn_low;
                                        var whighValue = telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key][keyval].warn_high;
                                        var valueType = typeof telemetry[$scope.widget.settings.contents[i].vehicle][$scope.widget.settings.contents[i].categories[j]][key][keyval].value;
                                        var status = datastatesService.getDataColorBound(alowValue,ahighValue,dataValue,wlowValue,whighValue,valueType);
                                        $scope.widget.settings.contents[i].subCategoryColors.push(status.color);
                                        if(status.alert !== ""){
                                            $scope.widget.settings.contents[i].ackStatus = false;
                                        }
                                        $scope.widget.settings.contents[i].tableArray.push({"dataValue":keyval,"alert":status.alert,"subcategory":key,"bound":status.bound,"vehicle":$scope.widget.settings.contents[i].vehicle,"time":time.utc,"channel":"","subsystem":$scope.widget.settings.contents[i].categories[j],"ack":""}); 
                                    }   
                                }
                            }
                        }
                    }
                }
            }
        }
        if($scope.widget.settings.contents.length > 0){
            //setTable($scope.widget.settings.contents);
            setSubSystemColors($scope.widget.settings.contents);//Function call to set sub system colors
        }
    }

    //Function to set sub system colors
    function setSubSystemColors(contents){
        //1.get vehicles
        //2.for each vehicle get sub systems
        //3.for each sub system get sub category colors and then get the high priority color among them.
        //4.setMasterAlarmColor
        for(var i=0;i<contents.length;i++){
            for(var j=0;j<$scope.widget.settings.contents[i].categories.length;j++){
                $scope.widget.settings.contents[i].categoryColors[j] = getHighPriorityColor($scope.widget.settings.contents[i].subCategoryColors);
            } 
        }
        setMasterAlarmColor($scope.widget.settings.contents);
    }

    //Function to set Master Alarm colors
    function setMasterAlarmColor(contents){
        for(var i=0;i<contents.length;i++){
            var subSystemColors = [];
            $scope.class[i] = "";
            for(var j=0;j<$scope.widget.settings.contents[i].categoryColors.length;j++){
                subSystemColors.push($scope.widget.settings.contents[i].categoryColors[j].background);
                var color = getHighPriorityColor(subSystemColors);
                $scope.widget.settings.contents[i].vehicleColor = color;

                if(color.background === "#FF0000"){
                    $scope.checked[i] = false; 
                    if( $scope.widget.settings.contents[i].ackStatus === false){
                        $scope.class[i] = "buttonred";    
                    }else {
                        $scope.class[i] = "buttonNone";
                    }
                }else if(color.background === "#FFFF00"){
                    $scope.checked[i] = false;
                    if( $scope.widget.settings.contents[i].ackStatus === false) {
                        $scope.class[i] = "buttonyellow";
                    }else {
                        $scope.class[i] = "buttonNone";
                    }           
                }else {
                    $scope.class[i] = "buttonNone";
                    $scope.checked[i] = true;  
                }
            }
        }   
    }

    //Function to return the color of high priority
    function getHighPriorityColor(colorArray){

        var redCount = 0;
        var yellowCount = 0;
        var greenCount = 0;

        var colors = datastatesService.colorBoundObj;

        redCount = countInArray(colorArray,colors.alarm.color);
        yellowCount = countInArray(colorArray,colors.caution.color);
        greenCount = countInArray(colorArray,colors.healthy.color);

        if(redCount >= 1){
            return colorValues.alarmcolor;
        }else if(redCount === 0 && yellowCount >=1){
            return colorValues.cautioncolor;
        }else if(redCount === 0 && yellowCount === 0){
            return colorValues.healthycolor;
        }
    }

    function countInArray(array, what) {
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === what) {
                count++;
            }
        }
        return count;
    }

    $scope.addtablerow = function(veh,$index){
        $scope.widget.settings.contents[$index].ackStatus = true;
        $scope.class[$index] = "buttonNone";
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.interval);
        }
    );

});



