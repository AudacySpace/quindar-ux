app
.directive('satellite', function() {
    return {
        restrict: 'E',
        templateUrl:'./directives/satellite/satellite.html',
        controller: function($scope){
            $scope.modelUrl = "./directives/satellite/models/satellite.json";

            $scope.widget.settings.zoom = 1.0;
            $scope.step = 0.01;
            $scope.min = 0.2;
            $scope.max = 1.8;

            // $scope.changeModel = function() {
            //     if ($scope.modelUrl == "../directives/satellite/models/jeep1.ms3d.json") {
            //         return  $scope.modelUrl = "../directives/satellite/models/cube_LARGE.json";
            //     }
            //     else {
            //         $scope.modelUrl = "../directives/satellite/models/jeep1.ms3d.json";
            //     }
            // };
        }
    };
});