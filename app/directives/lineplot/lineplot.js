app
.directive('lineplot', ['d3Service','dashboardService','$interval', function(d3,db,$interval) { 
  	return { 
    	restrict: 'EA', 
    	templateUrl: './directives/lineplot/lineplot.html', 
		link: function(scope, element, attributes) {
			
			scope.dispClass = "liveDisp";
			
			var vm = this;
			var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
			var plotData = [];
			var delay = 1000;	// [milisecond]
			var ptNum = 100;	// Number of points in a plot
			var xUnits;			
			var vehicle = "Audacy1";
			var paramY = "x";
			var paramX = "timestamp";
			var rectHeight = 10;
			var rectWidth = 20;
			
			getData();	//Initialization
			var theInterval = $interval(function(){
				getData();
				var tTemp = parseTime(vm.telemetry[vehicle][paramX].value);
				var xTemp = vm.telemetry[vehicle][paramY].value;
				xUnits = vm.telemetry[vehicle][paramY].units;

				plotData.push({x:tTemp, y:xTemp});
				
				if (plotData.length > ptNum) {
					plotData.splice(0,1);
				};

			}.bind(vm), 1000);

			var margin = {top: 10, right: 40, bottom: 30, left: 40};
				
			var temp = element[0].getElementsByTagName("div")[0];
			var el = temp.getElementsByTagName("div")[0];
			
			var width = temp.clientWidth;
			var height = temp.clientHeight;
			var svg = d3.select(el).append("svg")
					.attr("preserveAspectRatio", "xMidYMin meet")
                    .attr("viewBox", "0 0 "+(width+margin.left)+" "+height+"")
                    .classed("svg-content", true),
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");; 

			// Grids //
			var transHeight = height*.87;
			var transWidth = width*.9;
			
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
						
			function updatePlot() {
				
				g.selectAll("g.axis").remove();
				g.selectAll("path").remove();
				g.selectAll("line").remove();
				g.selectAll("circle").remove();
				g.selectAll("text").remove();
				
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
				.attr("y", 0 )
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
				
				timer = setTimeout(updatePlot, delay);				
				
				return this;
			};

						
			function getData(){
				db.getTelemetry()
				.then(function(response) {
					vm.telemetry = response.data;
				});
			}
			
			scope.goHome = function(){
				updatePlot();
				scope.dispClass = "liveDispOn";
			}
		}
  	}; 
}])