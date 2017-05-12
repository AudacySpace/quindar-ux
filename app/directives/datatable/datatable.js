app.directive('datatable',function() { 
  return { 
    restrict: 'E', 
    templateUrl:'./directives/datatable/datatable.html',
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('DataTableCtrl',function ($scope,$mdSidenav,$window,$interval,dashboardService,sidebarService) {    

    $scope.checkedValues = $scope.widget.settings.checkedValues;//Get values of the checkboxes in settings category display
    var tableCols = []; // table column data
    var tempRow = "";
    var telemetry = dashboardService.telemetry;

    //Default table structure -contains 15 rows to best appear for small and large screens
    for (var i = 0; i < 15; i++) {
        tableCols.push({
            contents: [
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:left",
                "colshow":"checkedValues.checkedId",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:left",
                "colshow":"checkedValues.checkedName",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:right",
                "colshow":"checkedValues.checkedAlow",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:right",
                "colshow":"checkedValues.checkedWlow",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:right",
                "colshow":"checkedValues.checkedValue",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:right",
                "colshow":"checkedValues.checkedWhigh",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:right",
                "colshow":"checkedValues.checkedAhigh",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:left",
                "colshow":"checkedValues.checkedUnits",
                "active": "false"
            },
            {   
                "value":"",
                "checked":"true",
                "style":"text-align:left",
                "colshow":"checkedValues.checkedNotes",
                "active": "false"
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

    updateRow();
    $scope.interval = $interval(updateRow, 500);

    function updateRow() {
        for (var i=0; i<$scope.table.rows.length; i++){
            tempRow = $scope.table.rows[i];
            if(tempRow.vehicle && tempRow.id) {
                tempRow.contents[0].value = tempRow.id ;
                tempRow.contents[1].value = telemetry[tempRow.vehicle][tempRow.id].name;
                tempRow.contents[2].value = telemetry[tempRow.vehicle][tempRow.id].alarm_low;
                tempRow.contents[3].value = telemetry[tempRow.vehicle][tempRow.id].warn_low;
                if(typeof telemetry[tempRow.vehicle][tempRow.id].value === "number"){
                    tempRow.contents[4].value = Math.round(telemetry[tempRow.vehicle][tempRow.id].value * 10000)/10000;
                } else {
                    tempRow.contents[4].value = telemetry[tempRow.vehicle][tempRow.id].value;
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
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );

});


