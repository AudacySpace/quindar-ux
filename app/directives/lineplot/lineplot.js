app
.directive('lineplot', ['d3Service','dashboardService','$interval', 'sidebarService', 'lineService', function(d3,db,$interval,sidebarService,lineService) { 

  	return { 
    	restrict: 'EA', 
		scope: {
			vehicle: '&',
		},
		controller: 'lineController',
    	templateUrl: './directives/lineplot/lineplot.html', 
		link: function(scope, element, attributes) {
			
			scope.imageUrl = "/icons/line-plot-widget/LIVE_off.svg";
			scope.playImg = "/icons/line-plot-widget/lineplot_play.svg";
			scope.pauseImg = "/icons/line-plot-widget/lineplot_pause_click.svg";
			lineService.mainId = scope.$id;
			telemetry = db.telemetry;

			var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
			var plotData = [];
			var delay = 1000;	// [milisecond]
			var ptNum = 100;	// Number of points in a plot
			var xUnits;			
			var rectHeight = 10;
			var rectWidth = 10;

			var margin = {top: 10, right: 30, bottom: 30, left: 30};
				
			var temp = element[0].getElementsByTagName("div")[0];
			var el = temp.getElementsByTagName("div")[0];
			
			var width = temp.clientWidth;
			var height = temp.clientHeight;
			var svg = d3.select(el).append("svg")
					.attr("preserveAspectRatio", "xMidYMin meet")
                    .attr("viewBox", "0 0 "+(width+margin.left)+" "+height+"")
                    .classed("svg-content", true),
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Grids //
			transHeight = height*.87;
			transWidth = width*.9;

			var x = d3.scaleLinear()
						.domain([0, 1])
						.rangeRound([0, transWidth]);

			var y = d3.scaleLinear()
						.domain([0, 1])
						.rangeRound([transHeight, 0]);
						
			var line = d3.line()
							.x(function(d) { return x(d.x); })
							.y(function(d) { return y(d.y); });			
			
			g.append("g")
				.attr("transform", "translate("+margin.left+",0)")
				.attr("class", "axis")
				.call(d3.axisLeft(y).tickSize(-transWidth));
			
			g.append("g")
				.attr("transform", "translate("+margin.left+","+ transHeight + ")")
				.attr("class", "axis")
				.call(d3.axisBottom(x).tickSize(-transHeight));	
			
			g.selectAll("path")
				.attr("opacity", 0.1);	
				
			g.selectAll("line")
				.attr("opacity", 0.1);
			// End Grids //

			// Stream
			scope.play = function(){
				
				var tempParam = lineService.getParam();	
				var idNum = "none";
				
				for (i=0; i < tempParam.length; i++){
					
					if (tempParam[i].main == scope.$id){
						
						// Identify the index
						idNum = i;
					} 				
				}

				if (idNum == "none"){
					alert("Select Data!")
				}else{
					var vehicle = tempParam[idNum].name;
					var paramY = tempParam[idNum].id;
					var paramX = "timestamp";
					if (paramY == "timestamp"){
						alert("Select a different parameter")
					} else{
						scope.stream = $interval(updatePlot, delay, 0, false, [vehicle, paramY, paramX]);		
						scope.disbtn = true;
						scope.imageUrl = "/icons/line-plot-widget/LIVE_on.svg";
						scope.playImg = "/icons/line-plot-widget/lineplot_play_click.svg";
						scope.pauseImg = "/icons/line-plot-widget/lineplot_pause.svg";
					}
				}
			}

			// Pause
			scope.pause = function(){
				$interval.cancel(scope.stream);
				plotData=[];
				scope.disbtn = false;
				scope.imageUrl = "/icons/line-plot-widget/LIVE_off.svg";
				scope.playImg = "/icons/line-plot-widget/lineplot_play.svg";
				scope.pauseImg = "/icons/line-plot-widget/lineplot_pause_click.svg";
			}
			
			// Home
			scope.goHome = function(){
				alert("HOME")
			}
	
			function updatePlot(vehicleObj) {
				
				var vehicle = vehicleObj[0];
				var paramY = vehicleObj[1];
				var paramX = vehicleObj[2];

				g.selectAll("g.axis").remove();
				g.selectAll("path").remove();
				g.selectAll("line").remove();
				g.selectAll("circle").remove();
				g.selectAll("text").remove();
				
				var tTemp = parseTime(telemetry[vehicle][paramX].value);
				var xTemp = telemetry[vehicle][paramY].value;
				xUnits = telemetry[vehicle][paramY].units;
	
				plotData.push({x:tTemp, y:xTemp});
				
				if (plotData.length > ptNum) {
					plotData.splice(0,1);
				};

				data = plotData;
				
				var x = d3.scaleTime()
					.domain(d3.extent(data, function(d) { return d.x; }))
					.rangeRound([margin.left, transWidth+margin.left]);
				var y = d3.scaleLinear()
					.domain(d3.extent(data, function(d) { return d.y; }))
					.rangeRound([transHeight, 0]);
				var line = d3.line()
					.x(function(d) { return x(d.x); })
					.y(function(d) { return y(d.y); });		
				var xMap = function(d) { return x(d.x);};
				var yMap = function(d) { return y(d.y);} 
				
				g.append("g")
				.attr("transform", "translate("+margin.left+",0)")
				.attr("class", "axis")
				.call(d3.axisLeft(y).tickSize(-transWidth));

				// text label for the y axis
				g.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", -10 )
				.attr("x",0 - (transHeight / 2))
				.attr("class", "linelabel")
				.text(paramY+ " [" + xUnits + "]");  
	  
				g.append("g")
				.attr("transform", "translate(0,"+ transHeight + ")")
				.attr("class", "axis")
				.call(d3.axisBottom(x).tickSize(-transHeight));		
					
				// text label for the x axis
				g.append("text")             
				.attr("transform","translate(" + (transWidth/2) + " ," + (transHeight+margin.bottom) + ")")
				.attr("class","linelabel")
				.text(paramX);
	  
				g.selectAll("path")
				.attr("opacity", 0.1);
			
				g.selectAll("line")
				.attr("opacity", 0.1);

				g.append("path")
				.datum(data)
				.attr("class","lineplot")
				.attr("stroke", "#172168")
				.attr("d", line);	

				g.selectAll("dot")
				.data(data)
				.enter().append("circle")
				.attr("r", 2)
				.attr("cx", xMap)
				.attr("cy", yMap)
				.attr("stroke", "#172168")
				.attr("fill", "#172168");		
			
				g.append("rect")
				.attr("transform","translate(" + (margin.left+10) + " ,10)")
				.attr("height", rectHeight)
				.attr("width", rectWidth)
				.style("fill","#172168");
				
				g.append("text")
				.attr("transform","translate(" + (margin.left+20+rectWidth) + " ,"+ (margin.top+10) +")")
				.attr("class","linelabel")
				.text(vehicle);				
				
				return this;
			}			
	
		}
  	} 
}]);