app
.directive('lineplot', ['d3Service','dashboardService','$interval','lineService', function(d3,db,$interval,lineService) { 
  	return { 
    	restrict: 'EA', 
		scope: {
			transHeight: '&',
			transWidth:	 '&',
		},
    	templateUrl: './directives/lineplot/lineplot.html', 
		link: function(scope, element, attributes) {
			
			scope.disp = "off";
			
			var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");
			var plotData = [];
			var delay = 1000;	// [milisecond]
			var ptNum = 100;	// Number of points in a plot
			var xUnits;			
			var vehicle = "Audacy2";
			var paramY = "y";
			var paramX = "timestamp";
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
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");; 

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

			lineService.elem = g;
			lineService.disp = scope.disp;
			lineService.transWidth = transWidth;
			lineService.transHeight = transHeight;
			
			//console.log(lineService.elem)
			
		}
  	}; 
}])