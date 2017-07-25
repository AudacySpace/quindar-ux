app.directive('datatable',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datatable/datatable.html',
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataTableCtrl',function ($scope,$mdSidenav,$window,$interval,$timeout,dashboardService,sidebarService,datastatesService) {  

    //Get values of the checkboxes in settings category display
    $scope.checkedValues = $scope.widget.settings.checkedValues;
    var tableCols = []; // table column data
    var tempRow = {vehicle:"",id:""};
    var telemetry = dashboardService.telemetry;
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
    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);

    var num_of_rows = 39;

    //Default table structure -contains 120 rows to best appear for small and large screens
    for (var i = 0; i <= num_of_rows; i++) {
        tableCols.push({
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
                "style":textLeft,
                "colshow":"checkedValues.checkedName",
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
            }],
            disabled: false
        });      
    }


    //Table row and column structure
    checkForRowData();

    function checkForRowData(){
        if(!$scope.widget.settings.table){
            $scope.widget.settings.table = { 
                "rows" : tableCols 
            };
        }
    }

    //Function to select telemetry Id
    $scope.getTelemetrydata = function($event){
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
        arrow.style.color = "#07D1EA";

        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            if($scope.lock.lockLeft !== true) {
            $scope.lock.lockLeft = !$scope.lock.lockLeft;
            dashboardService.setLeftLock($scope.lock.lockLeft);
            }
        }
    }

    //Function to display selected telemetry Id value and its corresponding data values.
    $scope.getValue = function($event, row){
        var vehicleInfo = sidebarService.getVehicleInfo();
        var vehicle = vehicleInfo.vehicle;
        var id = vehicleInfo.id;
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;

        if(vehicle !== "" && id !== "") {
            if(telemetry !== null) {
                row.vehicle = vehicle;
                row.id = id;
            } else {
                alert("Telemetry data not available");
            }
            arrow.style.color = "#b3b3b3";
            if ($window.innerWidth >= 1400){
                if($scope.lock.lockLeft !== false){
                    $scope.lock.lockLeft = !$scope.lock.lockLeft;
                    dashboardService.setLeftLock($scope.lock.lockLeft);
                }
            }
        } else {
            arrow.style.color = "#07D1EA";
            alert("Vehicle data not set. Please select from Data Menu");
        }
    }

    //Function to add row above the current row
    $scope.addRowAbove = function($index){
        if($scope.widget.settings.table.rows.length < 80){
            $scope.widget.settings.table.rows.splice($index,0,{contents :[{"datavalue":"","headervalue":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false }); 
        }else {
            alert("You have reached the maximum limit for rows!");
        }
       
    }

    //Function to add below the current row
    $scope.addRowBelow = function($index){
        if($scope.widget.settings.table.rows.length < 80){
           $scope.widget.settings.table.rows.splice($index+1,0,{contents :[{"datavalue":"","headervalue":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });  
       }else {
            alert("You have reached the maximum limit for rows!");
       }
       
    }

    //Function to delete the current row.
    $scope.deleteRow = function($index){
        if(($index === 0) && ($scope.widget.settings.table.rows.length) === 1){
            alert("Please do not delete this row!Add row above to delete this row.");
        }else {
            $scope.widget.settings.table.rows.splice($index, 1);
        }
    }

    //Function to move row above.
    $scope.moveRowUp = function($index){
        if($index > 0){
            $scope.widget.settings.table.rows[$index-1] = $scope.widget.settings.table.rows.splice($index, 1, $scope.widget.settings.table.rows[$index-1])[0];
            $scope.widget.settings.table.rows[$index-1].colorin = roweffect;
            $timeout(function() {
                $scope.widget.settings.table.rows[$index-1].colorin = '';
            }, 500);
        }
        else{
            alert("This row cannot be moved further up!");
        }
    }

    //Function to move row down.
    $scope.moveRowDown = function($index){
        if(($index) < (($scope.widget.settings.table.rows.length)-1)){
            $scope.widget.settings.table.rows[$index+1] = $scope.widget.settings.table.rows.splice($index, 1, $scope.widget.settings.table.rows[$index+1])[0];
            $scope.widget.settings.table.rows[$index+1].colorin = roweffect;  
            $timeout(function() {
                $scope.widget.settings.table.rows[$index+1].colorin = '';
            }, 500);  
        }
        else{
            alert("This row cannot be moved further down!You have reached the end of the table.");
        }
    }

    //Function to convert a row to a header
    $scope.convertHeader = function($index){
        $scope.widget.settings.table.rows[$index] = {contents:[{"datavalue":"","headervalue":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit", "active":"true"}], disabled: true};
    } 

    $scope.interval = $interval(updateRow, 500, 0, false);   

    function updateRow() {
        for (var i=0; i<$scope.widget.settings.table.rows.length; i++){
            tempRow = $scope.widget.settings.table.rows[i];
            if(tempRow.vehicle && tempRow.id) {
                try {
                var valType = typeof telemetry[tempRow.vehicle][tempRow.id].value;
                tempRow.contents[0].datavalue = tempRow.id;
                tempRow.contents[1].datavalue = telemetry[tempRow.vehicle][tempRow.id].name;
                if(telemetry[tempRow.vehicle][tempRow.id].alarm_low !== null){
                    tempRow.contents[2].datavalue = telemetry[tempRow.vehicle][tempRow.id].alarm_low;
                }else {
                    tempRow.contents[2].datavalue = 'N/A';   
                }

                if(telemetry[tempRow.vehicle][tempRow.id].warn_low !== null){
                    tempRow.contents[3].datavalue = telemetry[tempRow.vehicle][tempRow.id].warn_low;
                }else {
                    tempRow.contents[3].datavalue = 'N/A';   
                }

                if(valType === "number"){
                    if(tempvalue[i] === telemetry[tempRow.vehicle][tempRow.id].value){
                         //stale data
                        if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green" ){
                            tempRow.contents[4].datacolor = colorHealthy;
                        }else {
                           tempRow.contents[4].datacolor = colorStale;   
                        }
                        tempRow.contents[4].datavalue = telemetry[tempRow.vehicle][tempRow.id].value.toFixed(4); 
                    }else {
                       //new data
                        var colorVal = datastatesService.getDataColor(telemetry[tempRow.vehicle][tempRow.id].alarm_low,telemetry[tempRow.vehicle][tempRow.id].alarm_high,telemetry[tempRow.vehicle][tempRow.id].value,telemetry[tempRow.vehicle][tempRow.id].warn_low,telemetry[tempRow.vehicle][tempRow.id].warn_high,valType); 
                        if(colorVal === "red"){
                            tempRow.contents[4].datacolor = colorAlarm;  
                        }else if(colorVal === "orange"){
                            tempRow.contents[4].datacolor = colorCaution;
                        }else{
                            tempRow.contents[4].datacolor = colorHealthy;
                        }
                        tempRow.contents[4].datavalue = telemetry[tempRow.vehicle][tempRow.id].value.toFixed(4); 
                        tempvalue[i] = telemetry[tempRow.vehicle][tempRow.id].value;
                    }
                } else {
                    //timestamp
                    if(tempvalue[i] === telemetry[tempRow.vehicle][tempRow.id].value){
                        //stale data
                        if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green" ){
                             tempRow.contents[4].datacolor = colorHealthy;
                        }else {
                           tempRow.contents[4].datacolor = colorStale;    
                        }
                        tempRow.contents[4].datavalue = telemetry[tempRow.vehicle][tempRow.id].value; 
                    }else {
                        //new data
                        var colorVal = datastatesService.getDataColor(telemetry[tempRow.vehicle][tempRow.id].alarm_low,telemetry[tempRow.vehicle][tempRow.id].alarm_high,telemetry[tempRow.vehicle][tempRow.id].value,telemetry[tempRow.vehicle][tempRow.id].warn_low,telemetry[tempRow.vehicle][tempRow.id].warn_high,valType);
                        if(colorVal === "red"){
                            tempRow.contents[4].datacolor = colorAlarm;  
                        }else if(colorVal === "orange"){
                            tempRow.contents[4].datacolor = colorCaution;
                        }else{
                            tempRow.contents[4].datacolor = colorHealthy;
                            
                        }
                        tempRow.contents[4].datavalue = telemetry[tempRow.vehicle][tempRow.id].value; 
                        tempvalue[i] = telemetry[tempRow.vehicle][tempRow.id].value; 
                    }
                }

                if(telemetry[tempRow.vehicle][tempRow.id].warn_high !== null){
                    tempRow.contents[5].datavalue = telemetry[tempRow.vehicle][tempRow.id].warn_high;
                }else {
                    tempRow.contents[5].datavalue = 'N/A';   
                }

                if(telemetry[tempRow.vehicle][tempRow.id].alarm_high !== null){
                    tempRow.contents[6].datavalue = telemetry[tempRow.vehicle][tempRow.id].alarm_high;
                }else {
                    tempRow.contents[6].datavalue = 'N/A';   
                }

                tempRow.contents[7].datavalue = telemetry[tempRow.vehicle][tempRow.id].units;

                if(telemetry[tempRow.vehicle][tempRow.id].notes !== ''){
                    tempRow.contents[8].datavalue = telemetry[tempRow.vehicle][tempRow.id].notes;
                }else {
                    tempRow.contents[8].datavalue = 'N/A';    
                }
            }catch(err){

            }
            }else {
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
                    tempRow.contents[8].datacolor = colorDisconnected; 
                }
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );

});


