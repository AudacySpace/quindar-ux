app
.directive('satellite', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellite.html',
        controller: 'SatCtrl'
    }
});

app.controller('SatCtrl',['$scope', function($scope){
    checkSettings();

    $scope.modelUrl = "./directives/satellite/models/satellite.json";
    $scope.step = 0.01;
    $scope.min = 0.2;
    $scope.max = 1.8;
    $scope.quaternion = new Object();
    $scope.colors = new Object();

    function checkSettings(){
        var settings = $scope.widget.settings;
        if(!settings.hasOwnProperty("zoom")){
            $scope.widget.settings.zoom = 1.0;
        }
    }

    // $scope.changeModel = function() {
    //     if ($scope.modelUrl == "../directives/satellite/models/jeep1.ms3d.json") {
    //         return  $scope.modelUrl = "../directives/satellite/models/cube_LARGE.json";
    //     }
    //     else {
    //         $scope.modelUrl = "../directives/satellite/models/jeep1.ms3d.json";
    //     }
    // };
}]);