app.directive('commandsettings', function() { 
  	return { 
        restrict: 'E',  
        templateUrl:'./directives/command/commandsettings.html',
        controller: 'CommandSettingsCtrl',
    };
});

app.controller('CommandSettingsCtrl', function($scope){

    $scope.commandlog = $scope.widget.settings.commandlog;

    $scope.closeSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.commandlog = $scope.widget.settings.commandlog;
    }

    $scope.saveSettings = function(widget){
        widget.main = true;
        widget.settings.active = false;
        widget.saveLoad = false;
        widget.delete = false;
        $scope.widget.settings.commandlog = $scope.commandlog;
    }
});