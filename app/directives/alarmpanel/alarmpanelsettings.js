app.directive('alarmpanelsettings', function() { 
    return { 
        restrict: 'E',
        templateUrl:'./directives/alarmpanel/alarmpanelsettings.html', 
        controller: function($scope,$window,$mdSidenav,sidebarService,dashboardService){

            $scope.statusboard = $scope.widget.settings.statusboard;
            var statusValue = angular.copy( $scope.statusboard);

            $scope.saveAlarmPanelSettings = function(widget){
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;
                statusValue = angular.copy($scope.statusboard);
            };

            $scope.closeAlarmPanelSettings = function(widget){
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;
                $scope.statusboard.status = statusValue.status;
            }
        }
    }; 
});


