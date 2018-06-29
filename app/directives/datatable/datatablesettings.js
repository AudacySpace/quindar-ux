app.directive('datatablesettings', function() { 
    return { 
        restrict: 'E',
        templateUrl:'./directives/datatable/datatablesettings.html', 
        controller: 'DatatableSettingsCtrl'
    }
});

app.controller('DatatableSettingsCtrl', function($scope, $window){
    $scope.checkedValues = $scope.widget.settings.checkedValues;
    var values = angular.copy($scope.checkedValues);

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
            $window.alert("Please check at least one category");
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


