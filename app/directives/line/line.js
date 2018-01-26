app.directive('graph', function() {
    return {
        restrict: 'EA',
        template: "<div class='graph-container'></div>",
        controller : "LineCtrl"
    }
});

app.controller("LineCtrl", function($scope, $element, $interval, $window, dashboardService, d3Service) {
    var telemetry = dashboardService.telemetry;
    var parseTime = d3Service.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
    var prevSettings;
            
    $scope.data = [[0]];
    $scope.opts = { 
        axes: {
            x: {
                drawGrid: true
            },
            y: {
                drawAxis: true
            }
        }, 
        //dateWindow: [0, 1], 
        legend: "always",
        xlabel: "", 
        axisLabelWidth : 80,
        xLabelHeight : 16,
        yLabelWidth : 16,
    };

    var graph = new Dygraph($element[0].firstChild, $scope.data, $scope.opts );

    $scope.interval = $interval(updatePlot, 1000);   

    $scope.plotData =[];

    function updatePlot() {
        graph.resize();
        console.log("going")
        if($scope.widget.settings.data){
            if($scope.widget.settings.data.value !== "" && $scope.widget.settings.data.vehicles.length > 0) {
                var paramY = $scope.widget.settings.data.value;
                var vehicles = $scope.widget.settings.data.vehicles;
                var labels = ["x"]

                //reset plotData when there is a change in settings
                if (JSON.stringify(prevSettings) !== JSON.stringify($scope.widget.settings.data)){
                    for(v in vehicles){
                        var vehicle = vehicles[v];
                        if(!$scope.plotData){
                            $scope.plotData = new Array();
                        } else {
                            $scope.plotData = [];
                        }
                    }
                }

                for(var v in vehicles){
                    var vehicle = vehicles[v];

                    if(telemetry[vehicle.name] !== undefined){  
                        var tTemp = parseTime(telemetry['time']);
                        var currentData = dashboardService.getData(vehicle.key);
                        if(currentData){
                            var xTemp = parseFloat(currentData.value.toFixed(4));
                            var category = currentData.category;
                            var yUnits = currentData.units;
                            $scope.plotData.push([tTemp, xTemp]);

                            if ($scope.plotData.length > 100) {
                                $scope.plotData.shift();
                            };
                        }
                    }

                    labels.push(vehicle.name);
                }

                if(category && paramY){
                    var ylabel = category+" [ "+paramY+ " ] " + yUnits + " "
                }

                graph.updateOptions({ 
                    file: $scope.plotData, 
                    ylabel: ylabel,
                    xlabel: "timestamp",  
                    labels: labels,
                    axes: {
                        y: {
                            //drawGrid: true,
                            valueFormatter: function(y) {
                                return parseFloat(y.toFixed(4));
                            },
                            axisLabelFormatter: function(y) {
                                return parseFloat(y.toFixed(4));
                            }
                        }
                    },
                    drawPoints: true
                });

                prevSettings = angular.copy($scope.widget.settings.data);
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
        }
    );
});