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
    $scope.widget.stream = new Array(); // array to store all the intervals for the table rows
    var tableCols = []; // table column data

    //Default table structure -contains 15 rows to best appear for small and large screens
    for (var i = 0; i < 15; i++) {
        tableCols.push({
                            contents:   [
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
                                            }
                                        ],
                            disabled: false
                        });      
    }

    //Table row and column structure
    $scope.table = {"rows":{"data":tableCols}};

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
        var telemetry = dashboardService.telemetry;
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;

        if(vehicle !== "" && id !== "") {
            if(telemetry !== null) {
                if(row.flag) $interval.cancel(row.flag);
                row.flag = $interval(function(){
                    row.contents[0].value = id ;
                    row.contents[1].value = telemetry[vehicle][id].name;
                    row.contents[2].value = telemetry[vehicle][id].alarm_low;
                    row.contents[3].value = telemetry[vehicle][id].warn_low;
                    if(typeof telemetry[vehicle][id].value === "number"){
                        row.contents[4].value = Math.round(telemetry[vehicle][id].value * 10000)/10000;
                    } else {
                        row.contents[4].value = telemetry[vehicle][id].value;
                    }
                    if(telemetry[vehicle][id].warn_high !== null){
                        row.contents[5].value = telemetry[vehicle][id].warn_high;
                    }else {
                        row.contents[5].value = 'N/A';   
                    }
                    if(telemetry[vehicle][id].alarm_high !== null){
                        row.contents[6].value = telemetry[vehicle][id].alarm_high;
                    }else {
                        row.contents[6].value = 'N/A';   
                    }
                    row.contents[7].value = telemetry[vehicle][id].units;
                    if(telemetry[vehicle][id].notes !== ''){
                        row.contents[8].value = telemetry[vehicle][id].notes;
                    }else {
                        row.contents[8].value = 'N/A';    
                    }
                }, 1000);
                $scope.widget.stream.push(row.flag);
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
        $scope.table.rows.data.splice($index,0,{contents :[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });
        alert("Row added Above!");
    }

    //Function to add below the current row
    $scope.addRowBelow = function($index){
        $scope.table.rows.data.splice($index+1,0,{contents :[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });
        alert("Row added Below!");
    }

    //Function to delete the current row.
    $scope.deleteRow = function($index){
        if(($index === 0) && ($scope.table.rows.data.length) === 1){
            alert("Please do not delete this row!Add row above to delete this row.");
        }else {
            if($scope.table.rows.data[$index].flag) {
                $interval.cancel($scope.table.rows.data[$index].flag);
            }
            $scope.table.rows.data.splice($index, 1);
            alert("Row Deleted!");
        }
    }

    //Function to move row above.
    $scope.moveRowUp = function($index){
        if($index !== 0){
            $scope.table.rows.data[$index-1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index-1])[0];
            alert("Row moved up!")
        }
        else{
            alert("This row cannot be moved further up!");
        }
    }

    //Function to move row down.
    $scope.moveRowDown = function($index){
        if(($index) !== (($scope.table.rows.data.length)-1)){
            $scope.table.rows.data[$index+1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index+1])[0];
            alert("Row moved down");
        }
        else{
            alert("This row cannot be moved further down!You have reached the end of the table.");
        }
    }

    //Function to convert a row to a header
    $scope.convertHeader = function($index){
        $scope.table.rows.data[$index] = {contents:[{"value":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit", "active":"true"}], disabled: true};
    } 

    //Function to set the row to readonly on blur
    $scope.convertToReadonly = function(cell){
        cell.checked = "true";
    }

});


