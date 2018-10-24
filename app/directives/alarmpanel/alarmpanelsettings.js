app.directive('alarmpanelsettings', function() { 
    return { 
        restrict: 'E',
        templateUrl:'./directives/alarmpanel/alarmpanelsettings.html', 
        controller: 'AlarmSettingsCtrl',
    };
});

app.controller('AlarmSettingsCtrl', function($scope){
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
});


