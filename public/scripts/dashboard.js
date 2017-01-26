var QUINDAR = window.QUINDAR || {};
$(function(){
	QUINDAR.usermail = document.getElementById('usermail').innerHTML;
	QUINDAR.grid = {};
	QUINDAR.gcount = 0;
    QUINDAR.counter = 0;
    QUINDAR.icount = 0;
    var intervalID;


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
    			data: {'vehicleId.value' : 'all'},
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

	var timerCol=[];	//Create to store timer
    QUINDAR.addGroundWidget = function(){
    	QUINDAR.gcount++;	// Increase counter
					
		timerCol.push(1);	// Initialize timerCol
		
        var delay = 1000;	// milliseconds
									
		// Initialize scHolder
		var scHolder={}

		$('.grid-stack').data('gridstack').addWidget($(
			'<div id="gsdiv'+QUINDAR.gcount+'">\
			  <div class="panel panel-primary grid-stack-item-content" style="margin-bottom:0;" id="divtable'+QUINDAR.gcount+'">\
			    <div class="panel-heading">\
                  <button type="button" class="homebutton" id="homebutton'+QUINDAR.gcount+'">Home</button>\
                  <input type="button" class="timebtn" value="Show Timezones" id="timebtn'+QUINDAR.gcount+'">\
			      <button type="button" class="glyphicon glyphicon-cog pull-right" id="settings" data-toggle="modal" data-target="#myModal'+QUINDAR.gcount+'"></button>\
                  <button type="button" class="trash glyphicon glyphicon-cog glyphicon-trash" aria-label="Close" data-dismiss="modal" id="removediv'+QUINDAR.gcount+'"></button>\
                </div>\
	       	    <div class="svg-container" id="divplot'+QUINDAR.gcount+'"></div>\
			  <div/>\
			</div>\
			<div class="modal fade" id="myModal'+QUINDAR.gcount+'" role="dialog">\
			  <div class="modal-dialog">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal">&times;</button>\
                    <h4 class="modal-title">Settings</h4>\
                  </div>\
                  <div class="modal-body">\
		            <div class="btn-group" >\
                      <label class="btn btn-primary active" style="background-color: #172168;">\
                        <input type="checkbox" name="options'+QUINDAR.gcount+'" id="sat1" checked> Audacy1 </label>\
                      <label class="btn btn-primary" style="background-color: #172168;">\
                        <input type="checkbox" name="options'+QUINDAR.gcount+'" id="sat2" > Audacy2 </label>\
                      <label class="btn btn-primary" style="background-color: #172168;">\
                        <input type="checkbox" name="options'+QUINDAR.gcount+'" id="sat3" > Audacy3 </label>\
                    </div>\
					<div>\
					  <button type="button" class="btn btn-primary" style="color:#F1F1F5; background-color:#172168" id="clearbtn'+QUINDAR.gcount+'">Clear Plot</button>\
					</div>\
				  </div>\
                  <div class="modal-footer">\
                    <button type="button" class="btn btn-default" data-dismiss="modal" id="plotbutton'+QUINDAR.gcount+'">Plot</button>\
                  </div>\
                </div>\
			  </div>\
			</div>'),0,0,6,5,false,3,12,4,16,'idgt'+QUINDAR.gcount);

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
		
		var sat = 1;
		
		var station = [[-122.4, 37.7],[103.8, 1.4]];
       				
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

			for (j=0; j<station.length; j++) {
				plotgs(station[j],QUINDAR.gcount);
			}
			
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
			idnum = this.id.match(/\d+/)[0];
			$('#myModal'+idnum).modal('hide');
			document.getElementById("plotbutton"+idnum).disabled = true;
			sat = document.getElementsByName("options"+idnum)

			//initialize scHolder
			for (j=0; j<sat.length;j++) {
				scHolder[j] = [[0.,0.]];
				scHolder[j].pop();
			}; 
			
            timer = setInterval(updatePlot, delay);
			timerCol[idnum] = timer;
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

		$('#clearbtn'+QUINDAR.gcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			g.selectAll("path.route").remove();
			g.selectAll("#craft").remove();	
			clearTimeout(timerCol[idnum]);
			document.getElementById("plotbutton"+idnum).disabled = false;
		});
		
		$('#addgs'+QUINDAR.gcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			lon = document.getElementsByName("lon"+idnum);
			lat = document.getElementsByName("lat"+idnum);
			plotgs([lat[0].value,lon[0].value], idnum);		
		});
		
        // Function to update data to be plotted
        function updatePlot() {
 			
			g.selectAll("path.route").remove();
			g.selectAll("#craft").remove();	
            
			for (i=0; i< sat.length; i++){
				// Selection of satellite
				latestdata = null;
				if (i == 0){
					if (sat[i].checked){
						latestdata = QUINDAR.telemetry.Audacy1;
					}    
				} else if (i == 1){
					if (sat[i].checked){		
						latestdata = QUINDAR.telemetry.Audacy2;  
					}
				} else {
					if (sat[i].checked){			
						latestdata = QUINDAR.telemetry.Audacy3;  
					}    
				};			
				
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
					if (scHolder[i].length > 600) {
						scHolder[i].splice(0,1);							
					};
						
					// add longitude and latitude to data_plot
					scHolder[i].push([longitude, latitude]);	

					var route = g.append("path")
   							.datum({type: "LineString", coordinates: scHolder[i]})	
                            .attr("class", "route")
                            .attr("d", path);	
					var  craft = g.append("svg:image")
        						.attr("xlink:href", "/media/icons/Segment_Icons_Fill_Black-08.svg")
								.attr("id", "craft")
        						.attr("x",sat_coord[0])
								.attr("y",sat_coord[1]-15)
								.attr("width",30)
								.attr("height",30);
				}   
			}				
        }
				
		function plotgs(coord, gindex){
			var gs_coord = projGround(coord);	//convert to px
			var gs = svg.select('#g'+gindex)
						.append("svg:image")
						.attr("xlink:href", "/media/icons/Segment_Icons_Fill_Black-11.svg")
						.attr("id", "gs")
						.attr("x",gs_coord[0]-10)
						.attr("y",gs_coord[1]-16)
						.attr("width",20)
						.attr("height",20);
		};
		
        var zoom = d3.zoom()
					.scaleExtent([1,10])
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

   		$(document).on('click', '#removediv'+QUINDAR.gcount+'', function(e) {
			idnum = this.id.match(/\d+/)[0];
			$('#gsdiv'+idnum).remove();
			//$('#myModal'+idnum).modal('hide');

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

            griddata = '<div data-gs-min-width="11" data-gs-min-height="10"><div class="panel panel-primary grid-stack-item-content" id="tabletextqwidget'+QUINDAR.counter+'">'
                        +'<div class="panel-heading">'
                        +'<button type="button" class="glyphicon glyphicon-cog pull-right" id="settings" onclick="openSettings('+QUINDAR.counter+')">'
                        +'</button>'
                        +'<div style="display:none" id="settings-menu'+QUINDAR.counter+'" class="settings-menu">'
                        +'<button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
                        +'</button>'
                        +'</div>'
                        +'</div><table class="table table-bordered table-inverse"><thead><tr><th id="category'+QUINDAR.counter+'"></th>'
                        +'<th id="id'+QUINDAR.counter+'"></th><th id="name'+QUINDAR.counter+'"></th><th id="alarm_low'+QUINDAR.counter+'"></th><th id="warn_low'+QUINDAR.counter+'"></th><th id="value'+QUINDAR.counter+'"></th><th id="warn_high'+QUINDAR.counter+'"></th>'
                        +'<th id="alarm_high'+QUINDAR.counter+'"></th> <th id="units'+QUINDAR.counter+'"></th><th id="notes'+QUINDAR.counter+'"></th></tr></thead>'
                        +' <tbody>'
                        + rows
                        +'</tbody>'
                        +'</table>'
                        +'</div></div>';

            $('.grid-stack').data('gridstack').addWidget($(griddata),0,0,0,0);
            $(document).on('click', '#removespan', function(e) {
                console.log("table widget deleted");
                console.log(e.target.id);
                e.target.closest("div").parentElement.parentElement.parentElement.remove();
            });
        } else {
             griddata = '<div data-gs-min-width="11" data-gs-min-height="11"><div class="panel panel-primary grid-stack-item-content" id="tabletextqwidget'+QUINDAR.counter+'">'
                        +'<div class="panel-heading">'
                        +'<button type="button" class="glyphicon glyphicon-cog pull-right" id="settings" onclick="openSettings('+QUINDAR.counter+')">'
                        +'</button>'
                        +'<div style="display:none" id="settings-menu'+QUINDAR.counter+'" class="settings-menu">'
                        +'<button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
                        +'</button>'
                        +'</div>'
                        +'</div><table class="table table-bordered table-inverse"><thead><tr><th id="category'+QUINDAR.counter+'"></th>'
                        +'<th id="id'+QUINDAR.counter+'"></th><th id="name'+QUINDAR.counter+'"></th><th id="alarm_low'+QUINDAR.counter+'"></th><th id="warn_low'+QUINDAR.counter+'"></th><th id="value'+QUINDAR.counter+'"></th><th id="warn_high'+QUINDAR.counter+'"></th>'
                        +'<th id="alarm_high'+QUINDAR.counter+'"></th> <th id="units'+QUINDAR.counter+'"></th><th id="notes'+QUINDAR.counter+'"></th></tr></thead>'
                        +' <tbody>'
                        + rows
                        +'</tbody>'
                        +'</table>'

              +'</div></div>';
            $('.grid-stack').data('gridstack').addWidget($(griddata),0,0,0,0);
            $(document).on('click', '#removespan', function(e) {
                console.log("table widget deleted");
                e.target.closest("div").parentElement.parentElement.parentElement.remove();

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
            for(var c=QUINDAR.counter;c>=1;c--) {
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
        }, 1000);
    }.bind(this);


        QUINDAR.addIdTable = function(e){
            QUINDAR.icount++;
                grid = '<div><div class="panel panel-primary filterable grid-stack-item-content" style="overflow:auto;">'
                        +'<div class="panel-heading ">'
                        +'<button type="button" class="glyphicon glyphicon-cog pull-right" id="settings" onclick="openTableIdSettings('+QUINDAR.icount+')">'
                        +'</button>'
                        +'<div style="display:none" id="id-settings-menu'+QUINDAR.icount+'" class="id-settings-menu">'
                        +'<button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
                        +'</button>'
                        +'</div>'
                        +'</div>'
                        +'<input type="text" id="myInput" placeholder="Search for Satellite Id">'
                        +'<table id="myTable">'
                        +'<thead>'
                        +'<tr class="header">'
                        +'<th colspan="2">Name:</th>'
                        +' <th colspan="2" id="nameid"></th>'
                        +'</tr>'
                        +'<tr class="header">'
                        +'<th colspan="2">Category:</th>'
                        +' <th colspan="2" id="catVal"></th>'
                        +'</tr>'
                        +'<tr class="header" id="header">'
                        +'<th>Id</th>'
                        +'<th>Value</th>'
                        +'<th>Units</th>'
                        +'<th>Timestamp</th>'
                        +'</tr>'
                        +'</thead>'
                        +'<tbody id="tbody" class="idrows">'
                        +'</tbody>'
                        +'</table>'
                        +'</div></div>';

                 $('.grid-stack').data('gridstack').addWidget($(grid),6,0,6,6);
                 $(document).on('click', '#removespan', function(e) {
                    console.log("table widget deleted");
                    e.target.closest("div").parentElement.parentElement.parentElement.remove();
                 });

                 $('input[type=text]').on('keydown', function(e) {
                    if (e.which == 13) {
                        e.preventDefault();
                        var input = $(this).val();
                        clearInterval(intervalID);
                        $(".idrows > tr").remove();
               
                        intervalID = setInterval(function(){
                                data = QUINDAR.telemetry.Audacy1;
                                console.log(data);
                                dataX = QUINDAR.telemetry.Audacy1[input];
                                console.log(dataX);
                                dataTimestamp = QUINDAR.telemetry.Audacy1.timestamp;
                                var size = Object.keys(data).length;
                                var datasize = size-2;
                                var arr = [];

                                for(var k in data.v){
                                    arr.push(k);
                                }
                                arr.splice(1, 0, "id");

                                try{
                                    var date = new Date(dataTimestamp.value);
                                    var $input = $('table'),
                                     $panel = $input.parents('.filterable'),
                                     $table = $panel.find('#myTable');

                                     
                                     if(typeof dataX.value === "number") {
                                            $('#nameid').html(dataX.name);
                                            $('#catVal').html(dataX.category);
                                            $table.find('tbody').append($('<tr><td>'+input+'</td><td>'+Math.round(dataX.value * 100)/100+'</td><td>'+dataX.units+'</td><td>'+date.toUTCString()+'</td></tr>'));
                                    }else {
                                            $('#nameid').html(dataX.name);
                                            $('#catVal').html(dataX.category);
                                            $table.find('tbody').append($('<tr><td>'+input+'</td><td>'+dataX.value+'</td><td>'+dataX.units+'</td><td>'+date.toUTCString()+'</td></tr>'));
                                    }

                                }
                                catch(e){
                                }
                        }, 1000);
                     }
                 });
     
    }.bind(this);  

    QUINDAR.clearGrid = function () {
        QUINDAR.grid.removeAll();
        QUINDAR.counter = 0;
        QUINDAR.gcount = 0;
        QUINDAR.icount = 0;
        console.log("Grid cleared");
        return false;
    }.bind(this);    

    QUINDAR.start();
    $('#addwidget').click(QUINDAR.add);
    $('#addGround').click(QUINDAR.addGroundWidget);
    $('#addtablewidget').click(QUINDAR.addTableWidget);
    $('#clear-grid').click(QUINDAR.clearGrid);
    $('#searchId').click(QUINDAR.addIdTable);


});