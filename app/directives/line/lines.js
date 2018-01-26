app.directive('line', function() {
    return {
        restrict: 'EA',
        template: "<div class='graph-container'></div>",
        controller : "LineCtrl"
    }
});

app.controller("LineCtrl", function($scope, $element, $window, dashboardService, d3Service) {
    var telemetry = dashboardService.telemetry;
    var parseTime = d3Service.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    var prevSettings;
            
    $scope.data = [[0]];
    $scope.opts = { 
        // labels: [ "time", "value"], 
        axes: {
            x: {
                drawGrid: true,
            },
            y: {
                drawAxis: true,
                //valueRange: [0,1]
            }
        }, 
        //dateWindow: [0, 1], 
        legend: "always",
        xlabel: "timestamp", 
        axisLabelWidth : 80
    };

    var graph = new Dygraph($element[0].firstChild, $scope.data, $scope.opts );
    console.log("Ricky");

})