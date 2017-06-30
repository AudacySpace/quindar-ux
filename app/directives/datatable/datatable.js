app.directive('datatable',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datatable/datatable.html',
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataTableCtrl',function ($scope,$mdSidenav,$window,$interval,dashboardService,sidebarService,datastatesService) {  

    //Get values of the checkboxes in settings category display
    $scope.checkedValues = $scope.widget.settings.checkedValues;
    var tableCols = []; // table column data
    var tempRow = "";
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
    //watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);

    //Default table structure -contains 100 rows to best appear for small and large screens
    for (var i = 0; i < 100; i++) {
        tableCols.push({
            contents: [
            {   
                "value":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedId",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedName",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAlow",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWlow",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedValue",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedWhigh",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textRight,
                "colshow":"checkedValues.checkedAhigh",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedUnits",
                "active": "false",
                "datacolor":""
            },
            {   
                "value":"",
                "checked":"true",
                "style":textLeft,
                "colshow":"checkedValues.checkedNotes",
                "active": "false",
                "datacolor":""
            }],
            disabled: false
        });      
    }

    //Table row and column structure
    $scope.table = { 
        "rows" : tableCols 
    };

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
        $scope.table.rows.splice($index,0,{contents :[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });
        alert("Row added Above!");
    }

    //Function to add below the current row
    $scope.addRowBelow = function($index){
        $scope.table.rows.splice($index+1,0,{contents :[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });
        alert("Row added Below!");
    }

    //Function to delete the current row.
    $scope.deleteRow = function($index){
        if(($index === 0) && ($scope.table.rows.length) === 1){
            alert("Please do not delete this row!Add row above to delete this row.");
        }else {
            $scope.table.rows.splice($index, 1);
            alert("Row Deleted!");
        }
    }

    //Function to move row above.
    $scope.moveRowUp = function($index){
        if($index !== 0){
            $scope.table.rows[$index-1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index-1])[0];
            alert("Row moved up!")
        }
        else{
            alert("This row cannot be moved further up!");
        }
    }

    //Function to move row down.
    $scope.moveRowDown = function($index){
        if(($index) !== (($scope.table.rows.length)-1)){
            $scope.table.rows[$index+1] = $scope.table.rows.splice($index, 1, $scope.table.rows[$index+1])[0];
            alert("Row moved down");
        }
        else{
            alert("This row cannot be moved further down!You have reached the end of the table.");
        }
    }

    //Function to convert a row to a header
    $scope.convertHeader = function($index){
        $scope.table.rows[$index] = {contents:[{"value":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit", "active":"true"}], disabled: true};
    } 

    //Function to set the row to readonly on blur
    $scope.convertToReadonly = function(cell){
        cell.checked = "true";
    }

    $scope.interval = $interval(updateRow, 500, 0, false);   

    function updateRow() {
        for (var i=0; i<$scope.table.rows.length; i++){
            tempRow = $scope.table.rows[i];
            if(tempRow.vehicle && tempRow.id) {
                var valType = typeof telemetry[tempRow.vehicle][tempRow.id].value;
                tempRow.contents[0].value = tempRow.id;
                tempRow.contents[1].value = telemetry[tempRow.vehicle][tempRow.id].name;
                if(telemetry[tempRow.vehicle][tempRow.id].alarm_low !== null){
                    tempRow.contents[2].value = telemetry[tempRow.vehicle][tempRow.id].alarm_low;
                }else {
                    tempRow.contents[2].value = 'N/A';   
                }

                if(telemetry[tempRow.vehicle][tempRow.id].warn_low !== null){
                    tempRow.contents[3].value = telemetry[tempRow.vehicle][tempRow.id].warn_low;
                }else {
                    tempRow.contents[3].value = 'N/A';   
                }

                if(valType === "number"){
                    if(tempvalue[i] === telemetry[tempRow.vehicle][tempRow.id].value){
                         //stale data
                        if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green" ){
                            tempRow.contents[4].datacolor = colorHealthy;
                        }else {
                           tempRow.contents[4].datacolor = colorStale;   
                        }
                        tempRow.contents[4].value = telemetry[tempRow.vehicle][tempRow.id].value.toFixed(4); 
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
                        tempRow.contents[4].value = telemetry[tempRow.vehicle][tempRow.id].value.toFixed(4); 
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
                        tempRow.contents[4].value = telemetry[tempRow.vehicle][tempRow.id].value; 
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
                        tempRow.contents[4].value = telemetry[tempRow.vehicle][tempRow.id].value; 
                        tempvalue[i] = telemetry[tempRow.vehicle][tempRow.id].value; 
                    }
                }

                if(telemetry[tempRow.vehicle][tempRow.id].warn_high !== null){
                    tempRow.contents[5].value = telemetry[tempRow.vehicle][tempRow.id].warn_high;
                }else {
                    tempRow.contents[5].value = 'N/A';   
                }

                if(telemetry[tempRow.vehicle][tempRow.id].alarm_high !== null){
                    tempRow.contents[6].value = telemetry[tempRow.vehicle][tempRow.id].alarm_high;
                }else {
                    tempRow.contents[6].value = 'N/A';   
                }

                tempRow.contents[7].value = telemetry[tempRow.vehicle][tempRow.id].units;

                if(telemetry[tempRow.vehicle][tempRow.id].notes !== ''){
                    tempRow.contents[8].value = telemetry[tempRow.vehicle][tempRow.id].notes;
                }else {
                    tempRow.contents[8].value = 'N/A';    
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


