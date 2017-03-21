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

    $scope.checkedValues = $scope.widget.settings.checkedValues;
    $scope.widget.stream = new Array();

    $scope.table = {"rows": {
                    "data": [{
                                contents:
                                [
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
                            },
                            {
                                contents:
                                [
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
                            },
                            {
                                contents:
                                [
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
                            },
                            {
                                contents:
                                [
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
                            },
                            {
                                contents:
                                [
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
                            },
                            {
                                contents:
                                [
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
                            }]
                        }
                    };

    $scope.getTelemetrydata = function($event,$index){
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
        arrow.style.color = "#07D1EA";

        if ($window.innerWidth < 1400){
            $mdSidenav('left').open();
        } else {
            $scope.lock = dashboardService.getLock();
            $scope.lock.lockLeft = !$scope.lock.lockLeft;
            dashboardService.setLeftLock($scope.lock.lockLeft);
        }
    }

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
                $scope.lock.lockLeft = !$scope.lock.lockLeft;
                dashboardService.setLeftLock($scope.lock.lockLeft);
            }
        } else {
            arrow.style.color = "#07D1EA";
            alert("Vehicle data not set. Please select from Data Menu");
        }
    }

    $scope.addRowAbove = function($index){
        $scope.table.rows.data.splice($index,0,{contents :[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });
    }

    $scope.addRowBelow = function($index){
        $scope.table.rows.data.splice($index+1,0,{contents :[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh","active": "false"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits","active": "false"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes","active": "false"}], disabled:false });
    }

    $scope.deleteRow = function($index){
        if(($index === 0) && ($scope.table.rows.data.length) === 1){
            alert("Please do not delete this row!Add row above to delete this row.");
        }else {
            if($scope.table.rows.data[$index].flag) {
                $interval.cancel($scope.table.rows.data[$index].flag);
            }
            $scope.table.rows.data.splice($index, 1);
        }
    }

    $scope.moveRowUp = function($index){
        if($index !== 0){
            $scope.table.rows.data[$index-1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index-1])[0];
        }
        else{
            alert("This row cannot be moved further up!");
        }
    }

    $scope.moveRowDown = function($index){
        if(($index) !== (($scope.table.rows.data.length)-1)){
            $scope.table.rows.data[$index+1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index+1])[0];
        }
        else{
            alert("This row cannot be moved further down!You have reached the end of the table.");
        }
    }

    $scope.convertHeader = function($index){
        $scope.table.rows.data[$index] = {contents:[{"value":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit", "active":"true"}], disabled: true};
    } 

    $scope.convertToReadonly = function(cell){
        cell.checked = "true";
    }

});


