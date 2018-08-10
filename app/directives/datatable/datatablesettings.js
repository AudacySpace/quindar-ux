app.directive('datatablesettings', function() { 
    return { 
        restrict: 'E',
        templateUrl:'./directives/datatable/datatablesettings.html', 
        controller: 'DatatableSettingsCtrl'
    }
});

app.controller('DatatableSettingsCtrl', function($scope, $window, $element, dashboardService){
    $scope.checkedValues = $scope.widget.settings.checkedValues;
    var values = angular.copy($scope.checkedValues);

    var settingsToaster = $element[0].getElementsByTagName("div")["datatablecolumnsToaster"];
    var settingsToasterMbl = $element[0].getElementsByTagName("div")["datatablecolumnsToasterMbl"];
    var settingsToasterTablet = $element[0].getElementsByTagName("div")["datatablecolumnsToasterTablet"];

    $scope.saveDataTableSettings = function(widget){
        var val = $scope.checkedValues;
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
        } else {
            if($window.innerWidth >= 1024){
                $scope.toasterusermessage = "Please check at least one category!";
                $scope.toasterposition = "top left";
                $scope.toasterqueryId = settingsToaster;
                $scope.toasterdelay = false;
                var alertstatus = dashboardService.displayWidgetAlert( $scope.toasterusermessage, $scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }else if($window.innerWidth > 640 && $window.innerWidth < 1024){
                $scope.toasterusermessage = "Please check at least one category!";
                $scope.toasterposition = "top left";
                $scope.toasterqueryId = settingsToasterTablet;
                $scope.toasterdelay = false;
                var alertstatus = dashboardService.displayWidgetAlert( $scope.toasterusermessage, $scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }else if($window.innerWidth <= 640){
                $scope.toasterusermessage = "Please check at least one category!";
                $scope.toasterposition = "top left";
                $scope.toasterqueryId = settingsToasterMbl;
                $scope.toasterdelay = false;
                var alertstatus = dashboardService.displayWidgetAlert( $scope.toasterusermessage, $scope.toasterposition,$scope.toasterqueryId,$scope.toasterdelay);
            }
        }
    };

    $scope.closeDataTableSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        setCheckedValues(widget,values);
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
    } 
});


