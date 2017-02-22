app
.directive('lineplot', ['d3Service','dashboardService','$interval', function(d3,db,$interval) { 
  	return { 
    	restrict: 'EA', 
    	templateUrl: './directives/lineplot.html', 
		link: function(scope, element, attributes) {
			var vm = this;
			var theInterval = $interval(function(){
				getData();
			}.bind(vm), 1000);
		
			var data = [{x:"0",y:"0"},{x:"0.5",y:"0.4"},{x:"1",y:"0.2"},{x:"1.2",y:"0.6"},{x:"1.4",y:"1"},{x:"1.8",y:"0.2"}];
			
			var margin = {top: 10, right: 40, bottom: 10, left: 40};
				
			var temp = element[0].getElementsByTagName("div")[0];
			var el = temp.getElementsByTagName("div")[0];
			
			var width = temp.clientWidth;
			var height = temp.clientHeight;
			var svg = d3.select(el).append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+width+" "+height+"")
                    .classed("svg-content", true),
			g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");; 
			
			// Grids //
			var transHeight = height*.9;
			var transWidth = width*.9;
			
			var x = d3.scaleLinear()
						.domain(d3.extent(data, function(d) { return d.x; }))
						.rangeRound([0, transWidth]);

			var y = d3.scaleLinear()
						.domain(d3.extent(data, function(d) { return d.y; }))
						.rangeRound([transHeight, 0]);
						
			var line = d3.line()
							.x(function(d) { return x(d.x); })
							.y(function(d) { return y(d.y); });			
			
			g.append("g")
				.attr("transform", "translate(0,0)")
				.attr("class", "axis")
				.call(d3.axisLeft(y).tickSize(-transWidth));

			g.append("g")
				.attr("transform", "translate(0,"+ transHeight + ")")
				.attr("class", "axis")
				.call(d3.axisBottom(x).tickSize(-transHeight));	
				
			g.selectAll("path")
				.attr("stroke","none");
		
			g.selectAll("line")
				.attr("opacity", 0.1);
			// End Grids //

			// Plot lines//
			g.append("path")
				.datum(data)
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 1.5)
				.attr("d", line);
			
			// End plot lines //
			
			
			
			function getData(){
				db.getTelemetry()
				.then(function(response) {
					vm.telemetry = response.data;
				});
			}
			
			scope.goHome = function(){
				alert("HOME!")
			}
		}
  	}; 
}])