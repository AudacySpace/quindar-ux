var QUINDAR = window.QUINDAR || {};
$(function(){
	QUINDAR.usermail = document.getElementById('usermail').innerHTML;
	QUINDAR.grid = {};
	QUINDAR.gcount = 0;
    QUINDAR.counter = 0;

	QUINDAR.start = function() {
		var options = {};
		$('.grid-stack').gridstack(options);
		QUINDAR.grid = $('.grid-stack').data('gridstack');
        setInterval(QUINDAR.telemetry.init, 1000);
    };

    QUINDAR.telemetry = {
    	Audacy1 : null,
        Audacy2 : null,
        Audacy3 : null,
    	init : function(){
    		$.ajax({  
    			url: "/getTelemetry",
    			type: 'GET',
    			data: {'vehicleId.value' : 'Audacy1'},
    			success: function(res) {
                    if(res.Audacy1) {
    				    QUINDAR.telemetry.Audacy1 = res.Audacy1;
                    }
                    if(res.Audacy2) {
                        QUINDAR.telemetry.Audacy2 = res.Audacy2;
                    }
                    if(res.Audacy3) {
                        QUINDAR.telemetry.Audacy3 = res.Audacy3;
                    }
    			}
    		});

    	}
    };

    QUINDAR.add = function(){
    	QUINDAR.grid.addWidget($('<div class="panel panel-primary" id="plainwidget">'
    		+'<div class="grid-stack-item-content panel-heading" />'
    		+'<button type="button" class="close" aria-label="Close" id="removewidget">'
    		+'<span role="button" aria-hidden="true" id="removespan">&times;</span>'
    		+'</button></div>'),0,0,2,2);
    	$(document).on('click', '#removewidget', function(e) {
    		console.log("widget deleted");
    		e.target.closest("div").remove();
    	});
    };

    QUINDAR.addGroundWidget = function(){
    	QUINDAR.gcount++;
        var delay = 1000;	// milliseconds
		var sc = ["Audacy1", "Audacy2", "Audacy3"];		
									
		// Initialize scHolder
		var scHolder={}
		for (j=0; j<sc.length;j++) {
			scHolder[j] = [[0.,0.]];
			scHolder[j].pop();
		};

		$('.grid-stack').data('gridstack').addWidget($(
			'<div class="panel panel-primary" style="margin-bottom:0;" id="divtable'+QUINDAR.gcount+'">\
			<div class="grid-stack-item-content panel-heading" />\
	        <button type="button" class="plotbutton" id="plotbutton'+QUINDAR.gcount+'">Plot</button>\
            <button type="button" class="homebutton" id="homebutton'+QUINDAR.gcount+'">Home</button>\
            <input type="button" class="timebtn" value="Show Timezones" id="timebtn'+QUINDAR.gcount+'">\
	       	<button type="button" class="close" aria-label="Close" id="removespan" >&times;</button>\
	       	<div class="svg-container" id="divplot'+QUINDAR.gcount+'"></div><div/>'),0,0,6,5,false,3,12,4,16,'idgt'+QUINDAR.gcount);

		var  temptime = new Date;   // temporary time being replaced by the source time
		
		// Width of grid
		var widthG = $('.grid-stack').data('gridstack').cellWidth();
		$('.grid-stack').data('gridstack').cellHeight(widthG/1.8);
				
        var π = Math.PI,
            radians = π / 180,
            degrees = 180 / π;

        var projection = d3.geoEquirectangular()
							.precision(.1);
        var path = d3.geoPath().projection(projection);
        var graticule = d3.geoGraticule();
        var circle = d3.geoCircle();
        var svg = d3.select("#divplot"+QUINDAR.gcount).append("svg")
        			.attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "-20 0 1000 500")
                    .classed("svg-content", true);
        var g = svg.append("g");
		g.attr("id","g"+QUINDAR.gcount)
			.attr("x",0)
			.attr("y",0);

        var transform = d3.zoomTransform(svg.node());   
                 				
        // Plot world map
        d3.json("/media/icons/world-50m.json", function(error, world) {
        	if (error) throw error;	
                  
			// Show land
			g.append("path")
        		.datum(topojson.feature(world, world.objects.land))
        		.attr("class", "land")
        		.attr("d", path);	

			// Show graticule
        	g.append("path")
        		.datum(graticule)
        		.attr("d", path)
        		.attr("class","graticule");	

            // Show dark region (night time)
            var night = g.append("path")                
                       .attr("class", "night")
                       .attr("d", path);
                               
            redraw();
            setInterval(redraw, 1000);

            function redraw() {
                night.datum(circle.center(antipode(solarPosition(temptime)))).attr("d", path);
            }				
        });				
        						
		// Go back to original view						
       	$('#homebutton'+QUINDAR.gcount).click(function(){
			svg.transition()
				.duration(500)
				.call(zoom.transform, d3.zoomIdentity);
       	});
				
        // Plot data when PLOT button is clicked and keep updating						
        $('#plotbutton'+QUINDAR.gcount).click(function(){
            timer = setInterval(updatePlot, delay);
        });

        $('#timebtn'+QUINDAR.gcount).click(function(){
            var tempval = this.value
            if (tempval == "Show Timezones"){
                this.value = "Hide Timezones";
                    
                d3.json("/media/icons/timezones.json", function(error, timezones) {
                    if (error) throw error;

                    var timeZ = g.append("g")
                                   .attr("class", "timezones")
                                   .selectAll("path")
                                   .data(topojson.feature(timezones, timezones.objects.timezones).features)
                                   .enter().append("path")
                                   .attr("d", path)
                                   .append("title")
                                   .text(function(d) { return d.id; });
                }); 
            } else {
                this.value = "Show Timezones";
				
				// Remove timezones
                g.select(".timezones").remove();
            }
        });
				
        // Function to update data to be plotted
        function updatePlot() {
        	latestdata = QUINDAR.telemetry.Audacy1;      				 
        	console.log(latestdata);	
            // Check if the latestdata is available for the selected s/c
        	if (latestdata == null) {
        						
        	} else {
        		// update latestdata						  				
        		var x = latestdata.x.value;
        		var y = latestdata.y.value;
        		var z = latestdata.z.value;
        					
        		// Calculate longitude and latitude from the satellite position x, y, z.
        		// The values (x,y,z) must be Earth fixed.
        	    r = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
        	    longitude = Math.atan2(y,x)/Math.PI*180;
       	        latitude = Math.asin(z/r)/Math.PI*180;
        					
				// Convert [longitude,latitude] to plot	
                var sat_coord = projGround([longitude,latitude]);
						
				// Remove data when the length of scHolder reaches a certain value
				if (scHolder[0].length > 600) {
					scHolder[0].splice(0,1);							
				};
						
        		// add longitude and latitude to data_plot
        		scHolder[0].push([longitude, latitude]);	
				g.select("path.route").remove();
				g.select("image").remove();
   				var route = g.append("path")
   							.datum({type: "LineString", coordinates: scHolder[0]})	
                            .attr("class", "route")
                            .attr("d", path);	
        		var  craft = g.append("svg:image")
        						.attr("xlink:href", "/media/icons/Segment_Icons_Fill_Black-08.svg")
        						.attr("x",sat_coord[0])
								.attr("y",sat_coord[1]-15)
								.attr("width",30)
								.attr("height",30);
			}                    
        }
				
        var zoom = d3.zoom()
					.scaleExtent([.1,10])
					.translateExtent([[0,0],[1000,500]])
					.on("zoom",zoomed);
							 
		svg.call(zoom);
				
		function zoomed(){
			g.attr("transform", d3.event.transform);
		};
				
		function projGround(d){
			return projection(d);
		}; 

        function antipode(position) {
            return [position[0] + 180, -position[1]];
        }

        function solarPosition(time) {
            var centuries = (time - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525, // since J2000
            longitude = (d3.utcDay.floor(time) - time) / 864e5 * 360 - 180;
            return [
                longitude - equationOfTime(centuries) * degrees,
                solarDeclination(centuries) * degrees
            ];
        }

        // Equations based on NOAA’s Solar Calculator; all angles in radians.
        // http://www.esrl.noaa.gov/gmd/grad/solcalc/

        function equationOfTime(centuries) {
            var e = eccentricityEarthOrbit(centuries),
                m = solarGeometricMeanAnomaly(centuries),
                l = solarGeometricMeanLongitude(centuries),
                y = Math.tan(obliquityCorrection(centuries) / 2);
                y *= y;
            return y * Math.sin(2 * l)
                    - 2 * e * Math.sin(m)
                    + 4 * e * y * Math.sin(m) * Math.cos(2 * l)
                    - 0.5 * y * y * Math.sin(4 * l)
                    - 1.25 * e * e * Math.sin(2 * m);
            }

        function solarDeclination(centuries) {
            return Math.asin(Math.sin(obliquityCorrection(centuries)) * Math.sin(solarApparentLongitude(centuries)));
        }

        function solarApparentLongitude(centuries) {
            return solarTrueLongitude(centuries) - (0.00569 + 0.00478 * Math.sin((125.04 - 1934.136 * centuries) * radians)) * radians;
        }

        function solarTrueLongitude(centuries) {
            return solarGeometricMeanLongitude(centuries) + solarEquationOfCenter(centuries);
        }

        function solarGeometricMeanAnomaly(centuries) {
            return (357.52911 + centuries * (35999.05029 - 0.0001537 * centuries)) * radians;
        }

        function solarGeometricMeanLongitude(centuries) {
            var l = (280.46646 + centuries * (36000.76983 + centuries * 0.0003032)) % 360;
            return (l < 0 ? l + 360 : l) / 180 * π;
        }

        function solarEquationOfCenter(centuries) {
            var m = solarGeometricMeanAnomaly(centuries);
            return (Math.sin(m) * (1.914602 - centuries * (0.004817 + 0.000014 * centuries))
                    + Math.sin(m + m) * (0.019993 - 0.000101 * centuries)
                    + Math.sin(m + m + m) * 0.000289) * radians;
        }

        function obliquityCorrection(centuries) {
            return meanObliquityOfEcliptic(centuries) + 0.00256 * Math.cos((125.04 - 1934.136 * centuries) * radians) * radians;
        }

        function meanObliquityOfEcliptic(centuries) {
            return (23 + (26 + (21.448 - centuries * (46.8150 + centuries * (0.00059 - centuries * 0.001813))) / 60) / 60) * radians;
        }

        function eccentricityEarthOrbit(centuries) {
            return 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
        }

   		$(document).on('click', '#removespan', function(e) {
   			e.target.closest("div").remove();
   		});
   	}.bind(this);

    QUINDAR.addTableWidget = function(){
        var rows='';
        var width = $(window).width();
        QUINDAR.counter++;
        for(var i=2;i<12;i++){
            rows += '<tr><th id="categoryID'+i+QUINDAR.counter+'"></th><td id="ID'+i+QUINDAR.counter+'"></td><td id="name'+i+QUINDAR.counter+'"></td><td id="alow'+i+QUINDAR.counter+'"></td><td id="wlow'+i+QUINDAR.counter+'"></td><td id="value'+i+QUINDAR.counter+'"></td><td id="whigh'+i+QUINDAR.counter+'"></td><td id="ahigh'+i+QUINDAR.counter+'"></td><td id="units'+i+QUINDAR.counter+'"></td><td id="notes'+i+QUINDAR.counter+'"></td></tr></tbody>';
        }
        if(width<=1280){
              // data-gs-min-width="10" data-gs-min-height="7.8" data-gs-max-height="8"
            griddata = '<div class="panel panel-primary" data-gs-min-width="10" data-gs-min-height="7"id="tabletextqwidget'+QUINDAR.counter+'" style="overflow-x:auto;"><div class="panel-heading grid-stack-item-content"></div><table class="table table-bordered table-inverse"><thead><tr><th id="category'+QUINDAR.counter+'"></th>'
              +'<th id="id'+QUINDAR.counter+'"></th><th id="name'+QUINDAR.counter+'"></th><th id="alarm_low'+QUINDAR.counter+'"></th><th id="warn_low'+QUINDAR.counter+'"></th><th id="value'+QUINDAR.counter+'"></th><th id="warn_high'+QUINDAR.counter+'"></th>'
              +'<th id="alarm_high'+QUINDAR.counter+'"></th> <th id="units'+QUINDAR.counter+'"></th><th id="notes'+QUINDAR.counter+'"></th></tr></thead>'
              +' <tbody>'
              + rows
              +'</table>'
              +'<button type="button" class="close" aria-label="Close" id="removewidget" ><span aria-hidden="true" id="removespan">&times;</span></button><div/>';

            $('.grid-stack').data('gridstack').addWidget($(griddata),0,0,0,0);
            $(document).on('click', 'span', function(e) {
                console.log("table widget deleted");
                console.log(e.target.id);
                e.target.closest("div").remove();
            });
        } else {
              //data-gs-min-width="6" data-gs-min-height="5.5" data-gs-max-height="6"
            griddata = '<div class="panel panel-primary" data-gs-min-width="6" data-gs-min-height="5.5" id="tabletextqwidget'+QUINDAR.counter+' style="overflow-x:auto;"><div class="panel-heading grid-stack-item-content"></div><table class="table table-bordered table-inverse"><thead><tr><th id="category'+QUINDAR.counter+'"></th>'
              +'<th id="id'+QUINDAR.counter+'"></th><th id="name'+QUINDAR.counter+'"></th><th id="alarm_low'+QUINDAR.counter+'"></th><th id="warn_low'+QUINDAR.counter+'"></th><th id="value'+QUINDAR.counter+'"></th><th id="warn_high'+QUINDAR.counter+'"></th>'
              +'<th id="alarm_high'+QUINDAR.counter+'"></th> <th id="units'+QUINDAR.counter+'"></th><th id="notes'+QUINDAR.counter+'"></th></tr></thead>'
              +' <tbody>'
              + rows
              +'</table>'
              +'<button type="button" class="close" aria-label="Close" id="removewidget" ><span aria-hidden="true" id="removespan">&times;</span></button><div/>';

            $('.grid-stack').data('gridstack').addWidget($(griddata),0,0,0,0);
            $(document).on('click', 'span', function(e) {
                console.log("table widget deleted");
                e.target.closest("div").remove();
            });
        }

        intervalID = setInterval(function(){
            data = QUINDAR.telemetry.Audacy1;
            var size = Object.keys(data).length;
            var datasize = size-2;
            var obj = Object.keys(data)[2];
            var arr = [];

            for(var k in data.v){
                arr.push(k);
            }
            arr.splice(1, 0, "id");

            try{
                for(var i=0;i<arr.length;i++) {
                    document.getElementById(arr[i]+QUINDAR.counter).innerHTML = arr[i].toUpperCase();
                }

                for(var c=1;c<=QUINDAR.counter;c++) {
                    for(var i=2;i<size;i++) {
                        document.getElementById("categoryID"+i+c).innerHTML = data[Object.keys(data)[i]].category;
                        document.getElementById("ID"+i+c).innerHTML = Object.keys(data)[i];
                        document.getElementById("name"+i+c).innerHTML = data[Object.keys(data)[i]].name;
                        document.getElementById("units"+i+c).innerHTML = data[Object.keys(data)[i]].units;
                        document.getElementById("notes"+i+c).innerHTML = data[Object.keys(data)[i]].notes;

                        //Values of telemetry data
                        if(typeof data[Object.keys(data)[i]].value === "number") {
                            document.getElementById("value"+i+c).innerHTML = Math.round(data[Object.keys(data)[i]].value * 100)/100;
                        } else if(Date.parse(data[Object.keys(data)[i]].value)) {
                            var date = new Date(data[Object.keys(data)[i]].value);
                            document.getElementById("value"+i+c).innerHTML = date.toUTCString();
                        } else {
                            document.getElementById("value"+i+c).innerHTML = data[Object.keys(data)[i]].value;
                        }

                        //timestamp alarm low

                        if(typeof data[Object.keys(data)[i]].alarm_low === "number") {
                            document.getElementById("alow"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_low;
                        } else if(Date.parse(data[Object.keys(data)[i]].alarm_low)) {
                            var date = new Date(data[Object.keys(data)[i]].alarm_low);
                            document.getElementById("alow"+i+c).innerHTML= date.toUTCString();
                        } else {
                         document.getElementById("alow"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_low;
                        }

                        //timestamp warn low
                        if(typeof data[Object.keys(data)[i]].warn_low === "number") {
                            document.getElementById("wlow"+i+c).innerHTML = data[Object.keys(data)[i]].warn_low;
                        } else if(Date.parse(data[Object.keys(data)[i]].warn_low)) {
                            var date = new Date(data[Object.keys(data)[i]].warn_low);
                            document.getElementById("wlow"+i+c).innerHTML = date.toUTCString();
                        }
                        else {
                            document.getElementById("wlow"+i+c).innerHTML = data[Object.keys(data)[i]].warn_low;
                        }

                        //timestamp alarm high
                        if(typeof data[Object.keys(data)[i]].alarm_high === "number") {
                            document.getElementById("ahigh"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_high;
                        } else if(Date.parse(data[Object.keys(data)[i]].alarm_high)) {
                            var date = new Date(data[Object.keys(data)[i]].alarm_high);
                            document.getElementById("ahigh"+i+c).innerHTML= date.toUTCString();
                        } else {
                            document.getElementById("ahigh"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_high;
                        }

                        //timestamp warn high
                        if(typeof data[Object.keys(data)[i]].warn_high === "number") {
                            document.getElementById("whigh"+i+c).innerHTML = data[Object.keys(data)[i]].warn_high;
                        } else if(Date.parse(data[Object.keys(data)[i]].warn_high)) {
                            var date = new Date(data[Object.keys(data)[i]].warn_high);
                            document.getElementById("whigh"+i+c).innerHTML= date.toUTCString();
                        } else {
                            document.getElementById("whigh"+i+c).innerHTML = data[Object.keys(data)[i]].warn_high;
                        }
                    }
                }
            }
            catch(e){

            }
        }, 1000)
    }.bind(this);

    QUINDAR.clearGrid = function () {
        QUINDAR.grid.removeAll();
        console.log("Grid cleared");
        return false;
    }.bind(this);    

    QUINDAR.start();
    $('#addwidget').click(QUINDAR.add);
    $('#addGround').click(QUINDAR.addGroundWidget);
    $('#addtablewidget').click(QUINDAR.addTableWidget);
    $('#clear-grid').click(QUINDAR.clearGrid);
});