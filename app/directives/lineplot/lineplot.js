app
.directive('lineplot', function() { 
	return { 
    	restrict: 'EA', 
		controller: 'LinePlotCtrl',
    	templateUrl: './directives/lineplot/lineplot.html'
    }
});

app.controller('LinePlotCtrl', function ($scope, $element, d3Service, dashboardService, $interval) {
	var telemetry = dashboardService.telemetry;
	var parseTime = d3Service.timeParse("%Y-%m-%dT%H:%M:%S.%LZ");
	$scope.plotData = {};
	var prevSettings;
	var delay = 1000;	// [milisecond]
	var limit = 100;	// Number of points in a plot
	var margin = {top: 10, right: 30, bottom: 30, left: 30};
	var width = 580; 
	var height = 380; 
	var transHeight = height * 0.8;
	var transWidth = width * 0.87;

	var firstDiv = $element[0].getElementsByTagName("div")[0];
	var firstElement = firstDiv.getElementsByTagName("div")[0];
			
	var svg = d3Service.select(firstElement).append("svg")
					.attr("preserveAspectRatio", "xMidYMin meet")
                    .attr("viewBox", "0 0 "+(width+margin.left)+" "+height+"")
                    .classed("svg-content", true);
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3Service.scaleTime()
					.range([0, transWidth]);

	var y = d3Service.scaleLinear()
					.rangeRound([transHeight, 0]);
						
	var line = d3Service.line()
					.x(function(d) { return x(d.x); })
					.y(function(d) { return y(d.y); });	

	var xMap = function(d) { $scope.dx = d.x ; return x(d.x);};
	var yMap = function(d) { $scope.dy = d.y ; return y(d.y);};
			
	var axisY = g.append("g")
					.attr("transform", "translate("+margin.left+",0)")
					.attr("class", "axis")
					.call(d3Service.axisLeft(y).tickSize(-transWidth));
			
	var axisX = g.append("g")
					.attr("transform", "translate("+margin.left+","+ transHeight + ")")
					.attr("class", "axis")
					.call(d3Service.axisBottom(x).tickSize(-transHeight));	

	// Define the div for the tooltip
	var div = d3Service.select(firstElement).append("div")	
    			.attr("class", "valuetooltip")				
    			.style("opacity", 0);

	var labelX = g.append("text")             
					.attr("transform","translate(" + (transWidth/2) + " ," + (transHeight +margin.bottom) + ")")
					.attr("class","linelabel");


	var labelY = g.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", -15 )
					.attr("x",0 - (transHeight / 2))
					.attr("class", "linelabel");
			
	g.selectAll("path")
		.attr("opacity", 0.1);	
				
	g.selectAll("line")
		.attr("opacity", 0.1);

	$scope.interval = $interval(updatePlot, delay, 0, false);	

	function updatePlot() {
		if($scope.widget.settings.data){
			if($scope.widget.settings.data.value !== "" && $scope.widget.settings.data.vehicles.length > 0) {
				var paramY = $scope.widget.settings.data.value;
				var paramX = "timestamp";
				var legendSpace = transWidth/$scope.widget.settings.data.vehicles.length;
				var vehicles = $scope.widget.settings.data.vehicles;

				//reset plotData when there is a change in settings
				if (JSON.stringify(prevSettings) !== JSON.stringify($scope.widget.settings.data)){
					for(v in vehicles){
						var vehicle = vehicles[v];
						if(!$scope.plotData[vehicle.name]){
							$scope.plotData[vehicle.name] = new Array();
						} else {
							$scope.plotData[vehicle.name] = [];
						}
					}
				} 

				g.selectAll("path.lineplot").remove();
				g.selectAll("circle.circle").remove();
				g.selectAll(".legend").remove();
				d3.selectAll('.valuetooltip').style('opacity', '0');

				//push real time data points
				for(var v in vehicles){
					var vehicle = vehicles[v];

					if(telemetry[vehicle.name] !== undefined){	
						var tTemp = parseTime(telemetry['time']);
						var currentData = dashboardService.getData(vehicle.key);
						if(currentData){
							var xTemp = currentData.value;
							var category = currentData.category;
							var yUnits = currentData.units;
							$scope.plotData[vehicle.name].push({x:tTemp, y:xTemp});

							if ($scope.plotData[vehicle.name].length > limit) {
								$scope.plotData[vehicle.name].splice(0,1);
							};
						}
					}
				}

				//define X axis domain
				x.range([margin.left, transWidth+margin.left])
					.domain([
						d3.min(vehicles, function(v) {
							return d3.min($scope.plotData[v.name], function(d) { 
								return d.x; 
							}); 
						}),
						d3.max(vehicles, function(v) {
							return d3.max($scope.plotData[v.name], function(d) { 
								return d.x; 
							}); 
						})				
					]);


				//define Y axis domain
				y.domain([
					d3.min(vehicles, function(v) {
						return d3.min($scope.plotData[v.name], function(d) { 
							return Math.floor(d.y);
						}); 
					}),
					d3.max(vehicles, function(v) {
						return d3.max($scope.plotData[v.name], function(d) { 
							return Math.ceil(d.y);
						}); 
					})				
				]);

				if(category && paramY){
					axisY.call(d3Service.axisLeft(y).tickSize(-transWidth));

					axisX.attr("transform", "translate(0,"+ transHeight + ")")
						.call(d3Service.axisBottom(x).tickSize(-transHeight));	

					// text label for the y axis
					labelY.text(category+" [ "+paramY+ " ] " + yUnits + " ");
		  
					// text label for the x axis
					labelX.text(paramX);
				}

				g.selectAll("path")
					.attr("opacity", 0.1);
					
				g.selectAll("line")
					.attr("opacity", 0.1);

				vehicles.forEach(function(d,i) {
					if(telemetry[d.name] !== undefined){
					//plot line and circles
					g.append("path")
						.datum($scope.plotData[d.name])
						.attr("class","lineplot")
						.attr("stroke", d.color)
						.attr("d", line);

					g.selectAll("dot")
						.data($scope.plotData[d.name])
						.enter().append("circle").attr("class","circle")
						.attr("r", 1)
						.attr("cx", xMap)
						.attr("cy", yMap)
						.on("mouseover", function(d) {
	            			div.transition()		
	                			.duration(200)		
	                			.style("opacity", .9);		
	            			div	.html("x: " + $scope.dx + "<br/>"  +"y: " +parseFloat($scope.dy.toFixed(4)))	
	                			.style("left", (d3Service.mouse(this)[0])+ "px")		
	                			.style("top", (d3Service.mouse(this)[1]) + "px");
	            		})					
	        			.on("mouseout", function(d) {		
	            			div.transition()		
	                		   .duration(500)		
	                		   .style("opacity", 0);	
	        			})
						.attr("stroke", d.color)
						.attr("fill", d.color);

					//Add the legend data
					g.append("rect")
				    	.attr("transform","translate(" + (legendSpace/2 + i*legendSpace) + " ," + 
				    		(transHeight + margin.bottom + 20) + ")")
						.attr("height", 10)
						.attr("width", 10)
						.attr("class","legend")
						.style("fill",d.color);
					
					g.append("text")
						.attr("transform","translate(" + (legendSpace/2 + i*legendSpace + 15) + " ,"+ 
							(transHeight + margin.bottom + 30) +")")
						.attr("class","legend")
						.text(d.name);
					}
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
