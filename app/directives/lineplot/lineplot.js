app
.directive('lineplot', ['d3Service','dashboardService','$interval', 'sidebarService', function(d3,db,$interval,sidebarService) { 

  	return { 
    	restrict: 'EA', 
		controller: 'lineController',
    	templateUrl: './directives/lineplot/lineplot.html', 
		link: function(scope, element, attributes) {
			
			scope.imageUrl = "/icons/line-plot-widget/LIVE_off.svg";
			scope.playImg = "/icons/line-plot-widget/lineplot_play.svg";
			scope.pauseImg = "/icons/line-plot-widget/lineplot_pause_click.svg";
			telemetry = db.telemetry;
			scope.linecolors = scope.widget.settings.linecolors;
			scope.vehicleArray = scope.widget.settings.vehicles;
			scope.plotData = scope.widget.settings.plotData;
			scope.datainput = scope.widget.settings.datainput;
			var newColors = [];
			var newVehicles = [];
			var newPlotData = {};
			var data = {};
			scope.widget.stream = new Array();

			var newColors = scope.widget.settings.linecolors;
			var newVehicles = scope.widget.settings.vehicles;
			var newPlotData = scope.widget.settings.plotData;

			var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
			
			var delay = 1000;	// [milisecond]
			var ptNum = 100;	// Number of points in a plot
			var xUnits;			
			var rectHeight = 10;
			var rectWidth = 10;
			var margin = {top: 10, right: 30, bottom: 30, left: 30};
				
			var temp = element[0].getElementsByTagName("div")[0];
			var el = temp.getElementsByTagName("div")[0];
			
			var width = 580; 
			var height = 380; 
			var svg = d3.select(el).append("svg")
					.attr("preserveAspectRatio", "xMidYMin meet")
                    .attr("viewBox", "0 0 "+(width+margin.left)+" "+height+"")
                    .classed("svg-content", true),
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Grids //
			transHeight = height*.87;
			transWidth = width*.87;

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
				scope.widget.stream = [];
				var paramX = "timestamp";
					for(var i=0;i<newVehicles.length;i++){
						var stream = $interval(updatePlot, delay, 0, false, [newVehicles[i], scope.widget.settings.datainput, paramX,newColors[i],i]);	
						scope.disbtn = true;
						scope.imageUrl = "/icons/line-plot-widget/LIVE_on.svg";
						scope.playImg = "/icons/line-plot-widget/lineplot_play_click.svg";
						scope.pauseImg = "/icons/line-plot-widget/lineplot_pause.svg";
						scope.widget.stream.push(stream);
					}
				scope.widget.settings.pausestatus = false;
			}

			// Pause
			scope.pause = function(){
				scope.widget.settings.pausestatus = true;
				for(var i=0;i<newVehicles.length;i++){
					if(scope.widget.stream){
						$interval.cancel(scope.widget.stream[i]);
					}
					scope.widget.settings.plotData[i] = [[0,0]];
                	scope.widget.settings.plotData[i].pop();
					scope.disbtn = false;
					scope.imageUrl = "/icons/line-plot-widget/LIVE_off.svg";
					scope.playImg = "/icons/line-plot-widget/lineplot_play.svg";
					scope.pauseImg = "/icons/line-plot-widget/lineplot_pause_click.svg";
				}
			}
			
			// Home
			scope.goHome = function(){
				alert("HOME");
			}
	
			function updatePlot(vehicleObj) {
				var vehicle = vehicleObj[0];
				var paramY = vehicleObj[1];
				var paramX = vehicleObj[2];
				var colorValue = vehicleObj[3];
				var lnum = vehicleObj[4];

				g.selectAll("g.axis").remove();				
				g.selectAll("text.linelabel").remove();
			
				if(lnum === 0){

					g.selectAll("path.lineplot1").remove();
					g.selectAll("path.lineplot2").remove();
					g.selectAll("path.lineplot3").remove();
					g.selectAll("circle.circle1").remove();
					g.selectAll("circle.circle2").remove();
					g.selectAll("circle.circle3").remove();
					g.selectAll("line").remove();
					g.select("text.linelabel1").remove();
					g.select("text.linelabel2").remove();
					g.select("text.linelabel3").remove();
					g.select("rect.rect1").remove();
					g.select("rect.rect2").remove();
					g.select("rect.rect3").remove();
					var tTemp = parseTime(telemetry[vehicle][paramX].value);
					var xTemp = telemetry[vehicle][paramY].value;
					var category = telemetry[vehicle][paramY].category;
					xUnits = telemetry[vehicle][paramY].units;
	
					newPlotData[lnum].push({x:tTemp, y:xTemp});
				
					if (newPlotData[lnum].length > ptNum) {
						newPlotData[lnum].splice(0,1);
					};

					data[lnum] = newPlotData[lnum];

					updateLines(data[lnum],paramX,paramY,category,colorValue);
				
					g.append("rect")
						.attr("transform","translate(" + (margin.left+10) + " ,10)")
						.attr("height", rectHeight)
						.attr("width", rectWidth)
						.attr("class","rect1")
						.style("fill",colorValue);
				
					g.append("text")
						.attr("transform","translate(" + (margin.left+20+rectWidth) + " ,"+ (margin.top+10) +")")
						.attr("class","linelabel1")
						.text(vehicle);	

				}else if(lnum === 1){

					g.selectAll("path.lineplot2").remove();
					g.selectAll("circle.circle2").remove();
					g.selectAll("line").remove();
					g.select("text.linelabel2").remove();
					var tTemp = parseTime(telemetry[vehicle][paramX].value);
					var xTemp = telemetry[vehicle][paramY].value;
					var category = telemetry[vehicle][paramY].category;
					xUnits = telemetry[vehicle][paramY].units;
	
					newPlotData[lnum].push({x:tTemp, y:xTemp});
				
					if (newPlotData[lnum].length > ptNum) {
						newPlotData[lnum].splice(0,1);
					};

					data[lnum] = newPlotData[lnum];
					updateLines(data[lnum],paramX,paramY,category,colorValue);
			
					g.append("rect")
						.attr("transform","translate(" + (margin.left+80) + " ,10)")
						.attr("height", rectHeight)
						.attr("width", rectWidth)
						.attr("class","rect2")
						.style("fill",colorValue);
				
					g.append("text")
						.attr("transform","translate(" + (margin.left+90+rectWidth) + " ,"+ (margin.top+10) +")")
						.attr("class","linelabel2")
						.text(vehicle);	
				
				}else if(lnum === 2){
					g.selectAll("path.lineplot3").remove();
					g.selectAll("circle.circle3").remove();
					g.selectAll("line").remove();
					g.select("text.linelabel3").remove();
					var tTemp = parseTime(telemetry[vehicle][paramX].value);
					var xTemp = telemetry[vehicle][paramY].value;
					var category = telemetry[vehicle][paramY].category;
					xUnits = telemetry[vehicle][paramY].units;
	
					newPlotData[lnum].push({x:tTemp, y:xTemp});
				
					if (newPlotData[lnum].length > ptNum) {
						newPlotData[lnum].splice(0,1);
					};

					data[lnum] = newPlotData[lnum];
					updateLines(data[lnum],paramX,paramY,category,colorValue);
							
					g.append("rect")
						.attr("transform","translate(" + (margin.left+150) + " ,10)")
						.attr("height", rectHeight)
						.attr("width", rectWidth)
						.attr("class","rect3")
						.style("fill",colorValue);
				
					g.append("text")
						.attr("transform","translate(" + (margin.left+160+rectWidth) + " ,"+ (margin.top+10) +")")
						.attr("class","linelabel3")
						.text(vehicle);	
				}
			}

			function updateLines(dataVal,paramX,paramY,category,color){
				
				var x = d3.scaleTime()
							.domain(d3.extent(dataVal, function(d) { return d.x; }))
							.rangeRound([margin.left, transWidth+margin.left]);
				var y = d3.scaleLinear()
							.domain(d3.extent(dataVal, function(d) { return d.y; }))
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
				 	.text(category+" [ "+paramY+ " ] " + xUnits + " ");
				// .text(paramY+ " [" + xUnits + "]");  
	  
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
					.datum(dataVal)
					.attr("class","lineplot1")
					.attr("stroke", color)
					.attr("d", line);	

				g.selectAll("dot")
					.data(dataVal)
					.enter().append("circle").attr("class","circle1")
					.attr("r", 2)
					.attr("cx", xMap)
					.attr("cy", yMap)
					.attr("stroke", color)
					.attr("fill", color);	

			}				
		}
  	} 
}]);