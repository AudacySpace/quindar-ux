app
.directive('satellite', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl:'./directives/satellite/satellite.html',
        controller: function($scope){
            $scope.modelUrl = "./directives/satellite/models/cube.json";

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