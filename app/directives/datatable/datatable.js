app.directive('datatable',function() { 
  return { 
    restrict: 'E', 
    scope: {},
    templateUrl:'./directives/datatable/datatable.html',
    controller: 'DataTableCtrl',
    controllerAs: 'vm',
    bindToController: true              
  	}; 
});

app.controller('DataTableCtrl',function ($scope,$mdSidenav,$window,$interval,datatableSettingsService,dashboardService,sidebarService) {    

    $scope.checkedValues = datatableSettingsService.getValues();

    $scope.table = {"rows":{
                    "data":[
                                [
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedId"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedName"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedValue"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedUnits"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedNotes"
                                    }
                                ],
                                 [
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedId"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedName"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedValue"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedUnits"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedNotes"
                                    }
                                ],
                                [
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedId"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedName"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedValue"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedUnits"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedNotes"
                                    }
                                ],
                                [
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedId"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedName"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedValue"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedUnits"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedNotes"
                                    }
                                ],
                                [
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedId"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedName"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedValue"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedUnits"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedNotes"
                                    }
                                ],
                                [
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedId"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedName"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWlow"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedValue"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedWhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:right",
                                        "colshow":"checkedValues.checkedAhigh"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedUnits"
                                    },
                                    {   
                                        "value":"",
                                        "checked":"true",
                                        "style":"text-align:left",
                                        "colshow":"checkedValues.checkedNotes"
                                    }
                                ]
                            ]
                        }
                    };

    $scope.getTelemetrydata = function($event,$index){
        var arrow = $event.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
        arrow.style.color = "red";

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
                $interval(function(){
                    row[0].value = id ;
                    row[1].value = telemetry[vehicle][id].name;
                    row[2].value = telemetry[vehicle][id].alarm_low;
                    row[3].value = telemetry[vehicle][id].warn_low;
                    if(typeof telemetry[vehicle][id].value === "number"){
                        row[4].value = Math.round(telemetry[vehicle][id].value * 10000)/10000;
                    } else {
                        row[4].value = telemetry[vehicle][id].value
                    }
                    row[5].value = telemetry[vehicle][id].warn_high;
                    row[6].value = telemetry[vehicle][id].alarm_high;
                    row[7].value = telemetry[vehicle][id].units;
                    row[8].value = telemetry[vehicle][id].notes;            
                }, 1000);
            } else {
                alert("Telemetry data not available");
            }
            arrow.style.color = "#b3b3b3";  
        } else {
            arrow.style.color = "red";
            alert("Vehicle data not set. Please select from Data Menu");
        }

        if ($window.innerWidth >= 1400){
            $scope.lock.lockLeft = !$scope.lock.lockLeft;
            dashboardService.setLeftLock($scope.lock.lockLeft);          
        } 
    }

    $scope.addRowAbove = function($index){
        $scope.table.rows.data.splice($index,0,[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes"}]);
    }

    $scope.addRowBelow = function($index){
        $scope.table.rows.data.splice($index+1,0,[{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedId"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedName"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAlow"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWlow"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedValue"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedWhigh"},{"value":"","checked":"true","style":"text-align:right","colshow":"checkedValues.checkedAhigh"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedUnits"},{"value":"","checked":"true","style":"text-align:left","colshow":"checkedValues.checkedNotes"}]);
    }

    $scope.deleteRow = function($index){
        $scope.table.rows.data.splice($index, 1);
    }

    $scope.moveRowUp = function($index){
        $scope.table.rows.data[$index-1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index-1])[0];
    }

    $scope.moveRowDown = function($index){
        $scope.table.rows.data[$index+1] = $scope.table.rows.data.splice($index, 1, $scope.table.rows.data[$index+1])[0];
    }

    $scope.convertHeader = function($index){
        $scope.table.rows.data[$index] = [{"value":"","checked":"false","style":"text-align:right;background-color:#1072A4;","colshow":"true","colspan":"9","class":"header","placeholder":"Click here to edit"}];
    } 

    $scope.convertToReadonly = function($index){
        $scope.table.rows.data[$index]["checked"] = "true";
    }

});


