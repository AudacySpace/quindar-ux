app
.directive('lineplot', ['d3Service','$document', function(d3,$document) { 
  	return { 
    	restrict: 'EA', 
    	templateUrl: './directives/lineplot.html', 
		link: function(scope, element, attributes) {
	
			var margin = {top: 40, right: 40, bottom: 40, left: 40};
				
			var temp = element[0].getElementsByTagName("div")[0];
			var el = temp.getElementsByTagName("div")[0];
			
			var width = temp.clientWidth;
			var height = temp.clientHeight;
			var svg = d3.select(el).append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 "+width+" "+height+"")
                    .classed("svg-content", true),
			g = svg.append("g"); 
			
			var transHeight = height*.8 + 10 ;
			
			var x = d3.scaleLinear()
						.domain([0, 1])
						.range([0, width*.9]);

			var y = d3.scaleLinear()
						.domain([0, 1])
						.range([height*.8, 0]);
						
			g.append("g")
				.attr("transform", "translate(50,10)")
				.attr("class", "axis")
				.call(d3.axisLeft(y).tickSize(-width*.9));

			g.append("g")
				.attr("transform", "translate(50,"+ transHeight + ")")
				.attr("class", "axis")
				.call(d3.axisBottom(x).tickSize(-height*.8));	
				
			g.selectAll("path")
				.attr("stroke","none");
		
			g.selectAll("line")
				.attr("opacity", 0.1);
				
			scope.goHome = function(){
				alert("HOME")
			}
		}
  	}; 
}])