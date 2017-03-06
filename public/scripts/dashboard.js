var QUINDAR = window.QUINDAR || {};
$(function(){
	//QUINDAR.usermail = document.getElementById('usermail').innerHTML;
	QUINDAR.grid = {};
	QUINDAR.gcount = 0;
	QUINDAR.lcount = 0;
    QUINDAR.counter = 0;
    QUINDAR.icount = 0;
    QUINDAR.rcount = 0;
    QUINDAR.dcount = 0;


	QUINDAR.start = function() {
		var options = {};
		$('.grid-stack').gridstack(options);
		QUINDAR.grid = $('.grid-stack').data('gridstack');
        setInterval(QUINDAR.telemetry.init, 1000);
    };

    QUINDAR.telemetry = {
    	init : function(){
    		$.ajax({  
    			url: "/getTelemetry",
    			type: 'GET',
    			data: {'vehicles' : ['Audacy1', 'Audacy2', 'Audacy3']},
    			success: function(data) {
                    for( var item in data ){
                        QUINDAR.telemetry[item] = data[item];
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
	rEarth = 6378.16;	//Earth radius [km]
    QUINDAR.addGroundWidget = function(){
    	QUINDAR.gcount++;	// Increase counter
					
		timerCol.push(1);	// Initialize timerCol
		
        var delay = 1000;	// milliseconds
									
		// Initialize scHolder
		var scHolder={};
		var scStates={};
		// Initialize gsHoldar
		var gsHolder={};
		$('.grid-stack').data('gridstack').addWidget($(
			'<div id="gsdiv'+QUINDAR.gcount+'">\
			  <div class="panel panel-primary grid-stack-item-content" style="margin-bottom:0;" id="divtable'+QUINDAR.gcount+'">\
			    <div class="panel-heading">\
                  <button type="button" class="homebutton" id="homebutton'+QUINDAR.gcount+'">Home</button>\
                  <input type="button" class="timebtn" value="Show Timezones" id="timebtn'+QUINDAR.gcount+'">\
			      <button type="button" class="settingsbtn glyphicon glyphicon-cog" data-toggle="modal" data-target="#myModal'+QUINDAR.gcount+'"></button>\
                  <button type="button" class="savebtn glyphicon glyphicon-cog glyphicon-save"></button>\
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
                  <div class="modal-body modal-overflow">\
					<div class="form-group">\
					  <label class="control-label col-sm-3">Satellites:</label>\
		              <div class="col-sm-3">\
					    <div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="options'+QUINDAR.gcount+'" id="sat1" > Audacy1 </label>\
						</div>\
						<div class="checkbox"> \
                          <label>\
                            <input type="checkbox" name="options'+QUINDAR.gcount+'" id="sat2" > Audacy2 </label>\
						</div> \
						<div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="options'+QUINDAR.gcount+'" id="sat3" > Audacy3 </label>\
                        </div> \
					  </div>\
					  <div class="col-sm-3">\
					    <div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="orbits'+QUINDAR.gcount+'" > Orbit </label>\
						</div>\
						<div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="orbits'+QUINDAR.gcount+'" > Orbit </label>\
						</div>\
						<div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="orbits'+QUINDAR.gcount+'" > Orbit </label>\
						</div>\
					  </div>\
					  <div class="col-sm-3">\
					    <div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="icons'+QUINDAR.gcount+'" > Icon </label>\
						</div>\
						<div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="icons'+QUINDAR.gcount+'" > Icon </label>\
						</div>\
						<div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="icons'+QUINDAR.gcount+'" > Icon </label>\
						</div>\
					  </div>\
					</div>\
					<div class="form-group">\
					  <label class="control-label col-sm-3">Satellite Coverage Area:</label>\
		              <div class="col-sm-9">\
                        <div class="checkbox">\
						  <label>\
                            <input type="checkbox" name="satCov'+QUINDAR.gcount+'" id="satCov1"> Audacy1 </label>\
						</div>\
						<div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="satCov'+QUINDAR.gcount+'" id="satCov2" > Audacy2 </label>\
						</div>\
						<div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="satCov'+QUINDAR.gcount+'" id="satCov3" > Audacy3 </label>\
                        </div>\
					  </div>\
					</div>\
					<div class="form-group">\
					  <label class="control-label col-sm-3">Ground Station Coverage Area:</label>\
					  <div class="col-sm-9">\
					    <div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="gs'+QUINDAR.gcount+'" id="gs1" > Station1 </label>\
						</div>\
						<div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="gs'+QUINDAR.gcount+'" id="gs2" > Station2 </label>\
                        </div>\
					  </div>\
					</div>\
					<div class="form-group">\
					  <label class="control-label col-sm-3">Links:</label>\
					  <div class="col-sm-3">\
					    <div class="checkbox" >\
                          <label>\
                            <input type="checkbox" name="satLinks'+QUINDAR.gcount+'"> Audacy1 </label>\
						</div>\
						<div class="checkbox"> \
                          <label>\
                            <input type="checkbox" name="satLinks'+QUINDAR.gcount+'"> Audacy2 </label>\
						</div> \
						<div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="satLinks'+QUINDAR.gcount+'"> Audacy3 </label>\
                        </div> \
					  </div>\
					  <div class="col-sm-3">\
					    <div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="gsLinks'+QUINDAR.gcount+'"> Station1 </label>\
						</div>\
						<div class="checkbox">\
                          <label>\
                            <input type="checkbox" name="gsLinks'+QUINDAR.gcount+'"> Station2 </label>\
                        </div>\
					  </div>\
					</div>\
				  </div>\
                  <div class="modal-footer">\
				    <button type="button" class="btn btn-default" id="clearbtn'+QUINDAR.gcount+'">Clear Plot</button>\
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
		var satCov = [];
		var gs = [];
		var station = [[-122.4, 37.7],[103.8, 1.4]];	//[longitude, latitude]
       	
		var satRadius = 10000;	// Satellite radius [km]
		var gsAng = 85;	// Ground station coverage angle [deg]
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
                night.datum(circle.center(antipode(solarPosition(temptime))).radius(90)).attr("d", path);
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
			sat = document.getElementsByName("options"+idnum);
			
			//Initialize scHolder
			for (j=0; j<sat.length;j++) {
				scHolder[j] = [[0.,0.]];
				scHolder[j].pop();
				scStates[j] = [[0.,0.,0.]];
				scStates[j].pop();
			}; 
						
            timer = setInterval(updatePlot, delay, idnum);
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
			g.selectAll("#craft"+idnum).remove();	
			g.selectAll("#satlos").remove();
			g.selectAll("#gslos"+idnum).remove();
			g.selectAll("#link").remove();
			clearTimeout(timerCol[idnum]);
			document.getElementById("plotbutton"+idnum).disabled = false;
		});
		
        // Function to update data to be plotted
        function updatePlot(idnum) {
			g.selectAll("path.route").remove();
			g.selectAll("#craft"+idnum).remove();	
			g.selectAll("#satlos").remove();
            g.selectAll("#gslos"+idnum).remove();
			g.selectAll("#link").remove();
			
			satCov = document.getElementsByName("satCov"+idnum);
			gs = document.getElementsByName("gs"+idnum);
			orb = document.getElementsByName("orbits"+idnum);
			icon = document.getElementsByName("icons"+idnum);
			satLink = document.getElementsByName("satLinks"+idnum);
			gsLink = document.getElementsByName("gsLinks"+idnum);
			
			//Plot ground station coverage
			for (j=0; j<gs.length;j++) {
				if (gs[j].checked) {
					plotGsCover(station[j], idnum);
				}
			}
			
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
						scStates[i].splice(0,1);
					};
						
					// add longitude and latitude to data_plot
					scHolder[i].push([longitude, latitude]);	
					scStates[i].push([x,y,z]);
					
					if (orb[i].checked) {
						var route = g.append("path")
   							.datum({type: "LineString", coordinates: scHolder[i]})	
                            .attr("class", "route")
                            .attr("d", path);	
					}
					
					if (icon[i].checked) {
						var  craft = svg.select('#g'+idnum)
								.append("svg:image")
        						.attr("xlink:href", "/media/icons/Segment_Icons_Fill_Black-08.svg")
								.attr("id", "craft"+idnum)
        						.attr("x",sat_coord[0])
								.attr("y",sat_coord[1]-15)
								.attr("width",30)
								.attr("height",30);
					}
					
					if (satCov[i].checked) {
						var satAng = satCoverage(satRadius, 65);
						var range = g.append("path")
								.datum(circle.center([longitude, latitude]).radius(satAng))
								.attr("id", "satlos")
								.attr("class", "satlos")
								.attr("d", path);		
					}
				}   
			}

			for (k=0; k<satLink.length-1; k++) {
				if (satLink[k].checked) {
					for (kk=k+1; kk<satLink.length; kk++) {
						if (satLink[kk].checked) {
							commlink(scStates[k][scStates[k].length-1],scStates[kk][scStates[kk].length-1],
								scHolder[k][scHolder[k].length-1],scHolder[kk][scHolder[kk].length-1]);			
						}		
					}
				}
			}
			
			for (k=0; k<satLink.length; k++) {
				if(satLink[k].checked) {
					for (kk=0; kk<gsLink.length; kk++) {
						if (gsLink[kk].checked){
							gsCommLink(station[kk], scHolder[k][scHolder[k].length-1], scStates[k][scStates[k].length-1], gsAng);			
						}
						
					}
					
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
		
		function plotGsCover(coord, gindex){
			covAng = gsCoverage(satRadius, gsAng);	// Coverage angle [deg]
			var gslos = svg.select('#g'+gindex)
						.append("path")
						.datum(circle.center(coord).radius(covAng))
						.attr("id", "gslos"+gindex)
						.attr("class", "gslos")
						.attr("d", path);			
		};
		
		// Comm between satellites
		function commlink(a,b,c,d){
			//a: Satellite A [x,y,z] [km]
			//b: Satellite B [x,y,z] [km]
			//c: Satellite A [longitude, latitude] [deg]
			//d: Satellite B [longitude, latitude] [deg]
			
			// Half angles [radians]
			var th1 = Math.acos(rEarth/Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]));
			var th2 = Math.acos(rEarth/Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2]));

			// Angle between a and b
			var th = Math.acos(dotProd(a,b)/(mag(a)*mag(b)));

			if (th < th1+th2){
				var comm = g.append("path")
   							.datum({type: "LineString", coordinates: [[c[0]+6,c[1]-2], [d[0]+6,d[1]-2]]})	
                            .attr("class", "link")
							.attr("id", "link")
                            .attr("d", path);
			} else {
			}
		};
		
		// Comm between satellite and ground station
		function gsCommLink(a,b,c,ang){
			// a: Ground station [longitude, latitude] [deg]
			// b: Satellite [longitude, latitude] [deg]
			// c: Satellite [x,y,z] [km]
			// ang: Ground station coverage angle [deg]
			
			// Convert Ground station location //
			// Calculate z
			var gs_z = rEarth*Math.sin(a[1]*radians);
			
			// Project ground station location on xy plane
			var rp = rEarth*Math.cos(a[1]*radians);
			
			var gs_y = rp*Math.sin(a[0]*radians);
			var gs_x = rp*Math.cos(a[0]*radians);
			
			var gs_state = [gs_x,gs_y,gs_z];
			// End convert gound station location //
			
			// Vector from ground station to satellite
			var r_gs2sat = [c[0]-gs_state[0], c[1]-gs_state[1], c[2]-gs_state[2]];
			
			// Angle ground station to satellite
			var th = Math.acos(dotProd(r_gs2sat,gs_state)/(mag(r_gs2sat)*mag(gs_state)));

			if (th*degrees < ang) {
				var comm = g.append("path")
   							.datum({type: "LineString", coordinates: [[a[0],a[1]], [b[0]+6,b[1]-2]]})	
                            .attr("class", "gslink")
							.attr("id", "link")
                            .attr("d", path);				
			}
		};
		
		// Calculate a dot product
		function dotProd(a,b){
			return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
		}
		
		// Calculate a magnitude
		function mag(a){
			return Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
		}
		
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

		// Ground station coverage area based on the sat's altitude
		function gsCoverage(r, gsAng){
			// r: radius to satellite [km]
			// gsAng: Ground station coverage angle [deg]
			
			// Temp angle
			alpha = Math.asin(rEarth*Math.sin((180-gsAng)*radians)/r);
			
			//Coverage angle from the center of Earth
			return  180 - (180-gsAng) - alpha*degrees;
		}
		
		// Satellite coverage
		function satCoverage(r, satAng){
			// r: radius to satellite [km]
			// satAng: satellite coverage angle [deg]			

			if (r*Math.sin(satAng*radians) > rEarth) {
				// satAng is larger than the limit
				// Math.asin(r*Math.sin(satAng*radians)/rEarth) is invalid
				// beta is smallest
				beta = π/2;
			} else {
				// Two values for beta and select larger one
				beta = π - Math.asin(r*Math.sin(satAng*radians)/rEarth);				
			}
		
			return 180 - satAng - beta*degrees;
			
		}
		
   		$(document).on('click', '#removediv'+QUINDAR.gcount+'', function(e) {
			idnum = this.id.match(/\d+/)[0];
			$('#gsdiv'+idnum).remove();
			//$('#myModal'+idnum).modal('hide');

   		});
   	}.bind(this);

	QUINDAR.addLineWidget = function(){
		QUINDAR.lcount++;
    	$('.grid-stack').data('gridstack').addWidget($(
			'<div id="lpdiv'+QUINDAR.lcount+'">\
			  <div class="panel panel-primary grid-stack-item-content" style="margin-bottom:0;">\
			    <div class="panel-heading">\
				  <button type="button" class="thbtn glyphicon glyphicon-th"></button>\
				  <span class="lineplot">Line Plot</span> \
			      <button type="button" class="settingsbtn glyphicon glyphicon-cog" id="lpModal'+QUINDAR.lcount+'"></button>\
				  <button type="button" class="savebtn glyphicon glyphicon-cog glyphicon-save" id="lpModalSL'+QUINDAR.lcount+'"></button>\
                  <button type="button" class="trash glyphicon glyphicon-cog glyphicon-trash" aria-label="Close" id="removelp'+QUINDAR.lcount+'"></button>\
                </div>\
				<div id="lpmain'+QUINDAR.lcount+'">\
				  <div class="svg-container" id="divlp'+QUINDAR.lcount+'"></div>\
				  <button type="button" class="homeicon fa fa-home" id="homelp'+QUINDAR.lcount+'"></button>\
				  <p class="liveDisp" id="liveDisp'+QUINDAR.lcount+'">LIVE</p>\
				</div>\
				<div class="svg-container settingsdiv" id="lpsettings'+QUINDAR.lcount+'">\
				  <div class="row" id="lpmargin'+QUINDAR.lcount+'"></div>\
				  <div class="row" id="lplabel'+QUINDAR.lcount+'">\
				    <div class="col-md-1 " id="lpcol1'+QUINDAR.lcount+'"></div>\
					<div class="col-md-3 ">\
					  <p class="settingslabel">Vehicle:</p>\
					</div>\
					<div class="col-md-3 ">\
					  <p class="settingslabel">Livestream:</p>\
					</div>\
					<div class="col-md-5 ">\
					  <p class="settingslabel">Custom Range:</p>\
					</div>\
				  </div>\
				  <div class="row" id="lpbtn'+QUINDAR.lcount+'">\
				    <div class="col-md-1 "></div>\
					<div class="col-md-2 ">\
					  <div class="dropdown">\
	                    <button type="button" name="lpbtn'+QUINDAR.lcount+'" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
						  <span class="pull-left">Vehicl ID</span> <span class="caret pull-right"></span></button>\
					    <ul class="dropdown-menu qdropdown" name="lpdropdown'+QUINDAR.lcount+'">\
					      <li><a class="dropdown-item qmenu" href="#">Audacy1</a></li>\
                          <li><a class="dropdown-item qmenu" href="#">Audacy2</a></li>\
                          <li><a class="dropdown-item qmenu" href="#">Audacy3</a></li>\
                        </ul>\
					  </div>\
					  <br><br><br>\
					  <div class="dropdown">\
					    <button type="button" name="lpbtn'+QUINDAR.lcount+'" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
						  <span class="pull-left">Parameter</span> <span class="caret pull-right"></span></button>\
					  	<ul class="dropdown-menu qdropdown" name="lpdropdown'+QUINDAR.lcount+'">\
					      <li class="checkbox qcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="">x-position</label></li>\
                          <li class="checkbox qcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="">y-position</label></li>\
                          <li class="checkbox qcheckbox"><label><input style="margin-top: -2px" type="checkbox" value="">z-position</label></li>\
                        </ul>\
					  </div>\
					</div>\
					<div class="col-md-1 "></div>\
					<div class="col-md-2 ">\
					   <button type="button" name="lpbtn'+QUINDAR.lcount+'" class="btn" aria-haspopup="true" aria-expanded="false">\
					     <span class="pull-left">PLAY</span> <span class="fa fa-play pull-right" style="top:50%"></span></button>\
					   <br><br><br><br>\
					   <button type="button" name="lpbtn'+QUINDAR.lcount+'" class="btn" aria-haspopup="true" aria-expanded="false">\
					     <span class="pull-left">PAUSE</span> <span class="fa fa-pause pull-right" ></span></button>\
					</div>\
					<div class="col-md-1 "></div>\
					<div class="col-md-2 ">\
					  <div class="form-group">\
					    <div class="input-group date" id="datetimestart'+QUINDAR.lcount+'" name="lpbtn'+QUINDAR.lcount+'">\
                          <input type="text" class="form-control" name="caldispstart'+QUINDAR.lcount+'">\
                          <span class="input-group-addon" name="calbtn'+QUINDAR.lcount+'">\
                            <span class="glyphicon glyphicon-time"></span>\
                          </span>\
                        </div>\
					    <br><br><br>\
                        <div class="input-group date" id="datetimeend'+QUINDAR.lcount+'" name="lpbtn'+QUINDAR.lcount+'">\
                          <input type="text" class="form-control" name="caldispend'+QUINDAR.lcount+'">\
                          <span class="input-group-addon" name="calbtn'+QUINDAR.lcount+'">\
                            <span class="glyphicon glyphicon-time"></span>\
                          </span>\
                        </div>\
					  </div>\
					</div>\
				  </div>\
				  <div class="row">\
				    <div class="col-md-1 "></div>\
					<div class="col-md-10 ">\
					  <hr>\
					</div>\
				  </div>\
				  <div class="row">\
				    <div class="col-md-1 "></div>\
				  	<div class="col-md-1 ">\
					  <button type="button" name="qsavebtn'+QUINDAR.lcount+'" class="btn" aria-haspopup="true" aria-expanded="false">SAVE</button>\
					</div>\
					<div class="col-md-1">\
					  <button type="button" name="closebtn'+QUINDAR.lcount+'" id="closebtn'+QUINDAR.lcount+'"class="btn" aria-haspopup="true" aria-expanded="false">CLOSE</button>\
					</div>\
				  </div>\
				</div>\
				<div class="svg-container settingsdiv" id="lpsaveload'+QUINDAR.lcount+'">\
				  <div class="row" id="lpmarginSL'+QUINDAR.lcount+'"></div>\
				  <div class="row" id="lplabelSL'+QUINDAR.lcount+'">\
				    <div class="col-md-1 " id="lpcolSL'+QUINDAR.lcount+'"></div>\
					<div class="col-md-3 ">\
					  <p class="settingslabel">Save Widget:</p>\
					</div>\
					<div class="col-md-3 ">\
					  <p class="settingslabel">Load Widget:</p>\
					</div>\
				  </div>\
				  <div class="row" id="lpbtnSL'+QUINDAR.lcount+'">\
				    <div class="col-md-1 "></div>\
					<div class="col-md-2 ">\
					  <input type="text" name="lpbtn'+QUINDAR.lcount+'">\
				    </div>\
					<div class="col-md-1 "></div>\
					<div class="col-md-2 ">\
					  <div class="dropdown">\
	                    <button type="button" name="lpbtn'+QUINDAR.lcount+'" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
						    <span class="pull-left">File Name</span><span class="caret pull-right"></span></button>\
					    <ul class="dropdown-menu qdropdown" name="lpdropdown'+QUINDAR.lcount+'">\
					      <li><a class="dropdown-item qmenu" href="#">Audacy_Plot_01</a></li>\
                          <li><a class="dropdown-item qmenu" href="#">Audacy_Plot_02</a></li>\
                          <li><a class="dropdown-item qmenu" href="#">Audacy_Plot_03</a></li>\
                        </ul>\
					  </div>\
					</div>\
				  </div>\
				  <div class="row">\
				    <div class="col-md-1 "></div>\
					<div class="col-md-10 ">\
					  <hr>\
					</div>\
				  </div>\
				  <div class="row">\
				    <div class="col-md-1 "></div>\
				  	<div class="col-md-1 ">\
					  <button type="button" name="qsavebtn'+QUINDAR.lcount+'" class="btn" aria-haspopup="true" aria-expanded="false">SAVE</button>\
					</div>\
					<div class="col-md-1">\
					  <button type="button" name="closebtn'+QUINDAR.lcount+'" id="closebtnSL'+QUINDAR.lcount+'" class="btn" aria-haspopup="true" aria-expanded="false">CLOSE</button>\
					</div>\
				  </div>\
				</div>\
				<div class="svg-container settingsdiv" id="lpdelete'+QUINDAR.lcount+'">\
				  <div class="row" id="lpmarginD'+QUINDAR.lcount+'"></div>\
				  <div class="row" id="lplabelD'+QUINDAR.lcount+'">\
				    <div class="col-md-1 " id="lpcolD'+QUINDAR.lcount+'"></div>\
					<div class="col-md-3 ">\
					  <p class="settingslabel">Delete Widget?</p>\
					</div>\
				  </div>\
				  <div class="row">\
				    <div class="col-md-1 "></div>\
					<div class="col-md-10 ">\
					  <hr>\
					</div>\
				  </div>\
				  <div class="row">\
				    <div class="col-md-1 "></div>\
				  	<div class="col-md-1 ">\
					  <button type="button" name="qsavebtn'+QUINDAR.lcount+'" id="removeW'+QUINDAR.lcount+'" class="btn" aria-haspopup="true" aria-expanded="false">YES</button>\
					</div>\
					<div class="col-md-1">\
					  <button type="button" name="closebtn'+QUINDAR.lcount+'" id="closebtnD'+QUINDAR.lcount+'" class="btn" aria-haspopup="true" aria-expanded="false">NO</button>\
					</div>\
				  </div>\
				</div>\
			</div>'),0,0,12,8);
    	
		// Width of grid
		var widthG = $('.grid-stack').data('gridstack').cellWidth();
		$('.grid-stack').data('gridstack').cellHeight(widthG/1.5);
		
		var margin = {top: 40, right: 40, bottom: 40, left: 40};
		
		var svg = d3.select("#divlp"+QUINDAR.lcount).append("svg")
					.attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 1000 500")
                    .classed("svg-content", true),
			g = svg.append("g")
					.attr("id",'g'+QUINDAR.lcount);

		var width = document.getElementById("divlp"+QUINDAR.lcount).offsetWidth - margin.left - margin.right;
		var height = document.getElementById("divlp"+QUINDAR.lcount).offsetHeight - margin.top - margin.bottom;
		
		var x = d3.scaleLinear()
		.domain([0, 1])
		.range([0, width-120]);

		var y = d3.scaleLinear()
		.domain([0, 1])
		.range([height-20, 0]);
		
		g.append("g")
		.attr("transform", "translate(50,20)")
		.attr("class", "axis")
		.call(d3.axisLeft(y).tickSize(-width+120));

		g.append("g")
		.attr("transform", "translate(50,"+ height +")")
		.attr("class", "axis")
		.call(d3.axisBottom(x).tickSize(-height+20));	
		
		g.selectAll("path")
		.attr("stroke","none");
		
		g.selectAll("line")
		.attr("opacity", 0.1);
		
		$('#homelp'+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			var elem = document.getElementById("liveDisp"+idnum);
			elem.style.color = "#ff0000";			
		});
		
		$('#lpModal'+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			$("#lpmain"+idnum).hide();

			$("#lpsettings"+idnum).show();
			
			var elem = document.getElementById("lpmargin"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/6 + "px";
			
			var elem = document.getElementById("lplabel"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/12 + "px";

			var elem = document.getElementById("lpbtn"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/12*5 + "px";
			
			var elem = document.getElementsByName("lpbtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcol1"+idnum).width()*2+30 + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontSize = "12px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.borderRadius = "0";
			}

			var elem = document.getElementsByName("caldispstart"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.height = "28px";
				elem[i].style.fontSize = "12px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.borderRadius = "0"
				elem[i].style.backgroundColor = "#F1F1F5"
				elem[i].style.border = "0px"
				elem[i].defaultValue = "Start Time"
				elem[i].style.paddingRight = "0px";
			}
			
			var elem = document.getElementsByName("caldispend"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.height = "28px";
				elem[i].style.fontSize = "12px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.borderRadius = "0"
				elem[i].style.backgroundColor = "#F1F1F5"
				elem[i].style.border = "0px"
				elem[i].defaultValue = "End Time"
				elem[i].style.paddingRight = "0px";
			}
			
			var elem = document.getElementsByName("calbtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.height = "28px";
				elem[i].style.fontSize = "12px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.borderRadius = "0"
				elem[i].style.backgroundColor = "#F1F1F5"
				elem[i].style.border = "0px"
			}
			var elem = document.getElementsByName("lpdropdown"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width =  $("#lpcol1"+idnum).width()*2+30 + "px";
			}
			
			var elem = document.getElementsByName("qsavebtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcol1"+idnum).width() + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.fontSize = "12px";
				elem[i].style.paddingLeft = "0";
				elem[i].style.paddingRight = "0";
				elem[i].style.borderRadius = "0";
				elem[i].style.backgroundColor = "#07D1EA";
				elem[i].style.color = "#F1F1F5";
			}
			
			var elem = document.getElementsByName("closebtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcol1"+idnum).width() + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.fontSize = "12px";
				elem[i].style.paddingLeft = "0";
				elem[i].style.paddingRight = "0";
				elem[i].style.borderRadius = "0";
				elem[i].style.backgroundColor = "#07D1EA";
				elem[i].style.color = "#F1F1F5";
			}
		});
		
		$('#lpModalSL'+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			$("#lpmain"+idnum).hide();
			$("#lpsaveload"+idnum).show();

			var elem = document.getElementById("lpmarginSL"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/4 + "px";
			
			var elem = document.getElementById("lplabelSL"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/12 + "px";	

			var elem = document.getElementById("lpbtnSL"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/12*4 + "px";
			
			var elem = document.getElementsByName("lpbtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcolSL"+idnum).width()*2+30 + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontSize = "12px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.borderRadius = "0";
			}	

			var elem = document.getElementsByName("lpdropdown"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcolSL"+idnum).width()*2+30 + "px";
			}	
			
			var elem = document.getElementsByName("qsavebtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcolSL"+idnum).width() + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.fontSize = "12px";
				elem[i].style.paddingLeft = "0";
				elem[i].style.paddingRight = "0";
				elem[i].style.borderRadius = "0";
				elem[i].style.backgroundColor = "#07D1EA";
				elem[i].style.color = "#F1F1F5";
			}
			
			var elem = document.getElementsByName("closebtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcolSL"+idnum).width() + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.fontSize = "12px";
				elem[i].style.paddingLeft = "0";
				elem[i].style.paddingRight = "0";
				elem[i].style.borderRadius = "0";
				elem[i].style.backgroundColor = "#07D1EA";
				elem[i].style.color = "#F1F1F5";
			}			
			
		});
			
		$("#closebtn"+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			$("#lpmain"+idnum).show();

			$("#lpsettings"+idnum).hide();
			$("#lpsaveload"+idnum).hide();
			$("#lpdelete"+idnum).hide();
		});
		
		$("#closebtnSL"+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			$("#lpmain"+idnum).show();

			$("#lpsettings"+idnum).hide();
			$("#lpsaveload"+idnum).hide();
			$("#lpdelete"+idnum).hide();
		});
		
		$("#closebtnD"+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			$("#lpmain"+idnum).show();

			$("#lpsettings"+idnum).hide();
			$("#lpsaveload"+idnum).hide();
			$("#lpdelete"+idnum).hide();
		});
		
		$("#datetimestart"+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			$('#datetimestart'+idnum).datetimepicker({
			});
		});
		
		$("#datetimeend"+QUINDAR.lcount).click(function(){
			idnum = this.id.match(/\d+/)[0];
			$('#datetimeend'+idnum).datetimepicker({
			});
		});
			
		$(document).on('click', '#removelp'+QUINDAR.lcount+'', function(e) {
			idnum = this.id.match(/\d+/)[0];
			$("#lpmain"+idnum).hide();
			$("#lpdelete"+idnum).show();			

			var elem = document.getElementById("lpmarginD"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/3 + "px";
			
			var elem = document.getElementById("lplabelD"+idnum);
			elem.style.height = (height + margin.top + margin.bottom)/4 + "px";	

			var elem = document.getElementsByName("qsavebtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcolD"+idnum).width() + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.fontSize = "12px";
				elem[i].style.paddingLeft = "0";
				elem[i].style.paddingRight = "0";
				elem[i].style.borderRadius = "0";
				elem[i].style.backgroundColor = "#07D1EA";
				elem[i].style.color = "#F1F1F5";
			}
			
			var elem = document.getElementsByName("closebtn"+idnum);
			for (i=0; i<elem.length; i++) {
				elem[i].style.width = $("#lpcolD"+idnum).width() + "px";
				elem[i].style.height = "28px";
				elem[i].style.fontFamily = "Open Sans, Sans-serif";
				elem[i].style.fontSize = "12px";
				elem[i].style.paddingLeft = "0";
				elem[i].style.paddingRight = "0";
				elem[i].style.borderRadius = "0";
				elem[i].style.backgroundColor = "#07D1EA";
				elem[i].style.color = "#F1F1F5";
			}			
   		
    	});
		
		$(document).on('click', '#removeW'+QUINDAR.lcount+'', function(e) {
			$('#lpdiv'+idnum).remove();
		});
		
    }.bind(this);
	
    QUINDAR.addTableWidget = function(){
        var rows='';
        QUINDAR.counter++;

        var size = Object.keys(QUINDAR.telemetry.Audacy1).length;
        for(var i=2;i<size;i++){
            rows += '<tr><th id="categoryID'+i+QUINDAR.counter+'"></th><td id="ID'+i+QUINDAR.counter+'"></td><td id="name'+i+QUINDAR.counter+'"></td><td id="alow'+i+QUINDAR.counter+'"></td><td id="wlow'+i+QUINDAR.counter+'"></td><td id="value'+i+QUINDAR.counter+'"></td><td id="whigh'+i+QUINDAR.counter+'"></td><td id="ahigh'+i+QUINDAR.counter+'"></td><td id="units'+i+QUINDAR.counter+'"></td><td id="notes'+i+QUINDAR.counter+'"></td></tr></tbody>';
        }
        griddata = '<div data-gs-min-width="11" data-gs-min-height="10" data-gs-max-height="10">'
                        +'<div class="panel panel-primary grid-stack-item-content" id="tabletextqwidget'+QUINDAR.counter+'">'
                            +'<div class="panel-heading">'
                                +'<button type="button" class="glyphicon glyphicon-cog pull-right settings" onclick="openSettings('+QUINDAR.counter+')">'
                                +'</button>'
                                +'<div style="display:none" id="settings-menu'+QUINDAR.counter+'" class="settings-menu">'
                                    +'<button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
                                    +'</button>'
                                +'</div>'
                            +'</div>'
                        +'<table class="table table-bordered table-inverse" id="teletable">'
                            +'<thead id="telehead"><tr class="telerow">'
                                +'<th id="category'+QUINDAR.counter+'" style="width:15%"></th>'
                                +'<th id="id'+QUINDAR.counter+'" style="width:5%"></th>'
                                +'<th id="name'+QUINDAR.counter+'" style="width:20%"></th>'
                                +'<th id="alarm_low'+QUINDAR.counter+'" style="width:10%"></th>'
                                +'<th id="warn_low'+QUINDAR.counter+'" style="width:10%"></th>'
                                +'<th id="value'+QUINDAR.counter+'" style="width:10%"></th>'
                                +'<th id="warn_high'+QUINDAR.counter+'" style="width:10%"></th>'
                                +'<th id="alarm_high'+QUINDAR.counter+'" style="width:10%"></th>'
                                +'<th id="units'+QUINDAR.counter+'" style="width:5%"></th>'
                                +'<th id="notes'+QUINDAR.counter+'" style="width:5%"></th>'
                            +'</tr></thead>'
                            +'<tbody id="telebody">'+ rows +'</tbody>'
                    +'</table>'
                    +'</div>'
                +'</div>';

        $('.grid-stack').data('gridstack').addWidget($(griddata),0,0,0,0);
        $(document).on('click', '#removespan', function(e) {
            e.target.closest("div").parentElement.parentElement.parentElement.remove();
        });

        setInterval(function(){
            data = QUINDAR.telemetry.Audacy1;
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
        var intervalID;
        grid = '<div data-gs-min-width="6" data-gs-min-height="6">'
                    +'<div class="panel panel-primary filterable grid-stack-item-content">'
                        +'<div class="panel-heading ">'
                            +'<button type="button" class="glyphicon glyphicon-cog pull-right settings" onclick="openTableIdSettings('+QUINDAR.icount+')">'
                            +'</button>'
                            +'<div style="display:none" id="id-settings-menu'+QUINDAR.icount+'" class="id-settings-menu">'
                            +'<button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
                            +'</button>'
                            +'</div>'
                        +'</div>'
                        +'<div class="form-group">'
                            +'<input type="text" id="myInput" class="form-control inp-val" placeholder="Please Enter Id of the Telemetry Data from Telemetry Table">'
                            +'<span class="glyphicon glyphicon-search searchicon"></span>'
                        +'</div>'
                        +'<table id="myTable">'
                            +'<thead id="thead"><tr class="header">'
                                +'<th colspan="1" >Name:</th>'
                                +'<th colspan="3" class="nameid"></th>'
                            +'</tr>'
                            +'<tr class="header">'
                                +'<th colspan="1">Category:</th>'
                                +'<th colspan="3" class="catVal"></th>'
                            +'</tr>'
                            +'<tr class="header" id="header">'
                                +'<th style="width:10%">Id</th>'
                                +'<th style="width:20%">Value</th>'
                                +'<th style="width:10%">Units</th>'
                                +'<th style="width:60%">Timestamp</th>'
                            +'</tr></thead>'
                            +'<tbody id="tbody" class="idrows">'
                            +'</tbody>'
                        +'</table>'
                    +'</div>'
                +'</div>';
        $('.grid-stack').data('gridstack').addWidget($(grid),0,0,0,0);
        
        $(document).on('click', '#removespan', function(e) {
            e.target.closest("div").parentElement.parentElement.parentElement.remove();
        });
        $('.inp-val').on('keydown', function(e) {
            if (e.which == 13) {
                e.preventDefault();
                var input = $(this).val();
                clearInterval(intervalID);
                $(".idrows > tr").remove();
                $('.nameid').html("");
                $('.catVal').html("");
               
                intervalID = setInterval(function(){
                    data = QUINDAR.telemetry.Audacy1;
                    dataX = QUINDAR.telemetry.Audacy1[input];
                    dataTimestamp = QUINDAR.telemetry.Audacy1.timestamp;
                    var size = Object.keys(data).length;
                    var datasize = size-2;
                    var arr = [];

                    for(var k in data.v){
                        arr.push(k);
                    }
                    arr.splice(1, 0, "id");

                    try {
                        var date = new Date(dataTimestamp.value);
                        var $input = $('table'),
                        $panel = $input.parents('.filterable'),
                        $table = $panel.find('#myTable');

                        if(typeof dataX.value === "number") {
                            $('.nameid').html(dataX.name);
                            $('.catVal').html(dataX.category);
                            $table.find('#tbody').append($('<tr><td>'+input+'</td><td>'+Math.round(dataX.value * 100)/100+'</td><td>'+dataX.units+'</td><td>'+date.toUTCString()+'</td></tr>'));
                        }else {
                            $('.nameid').html(dataX.name);
                            $('.catVal').html(dataX.category);
                            $table.find('#tbody').append($('<tr><td>'+input+'</td><td>'+dataX.value+'</td><td>'+dataX.units+'</td><td>'+date.toUTCString()+'</td></tr>'));
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
        return false;
    }.bind(this);    

    QUINDAR.start();
    $('#addwidget').click(QUINDAR.add);
    $('#addGround').click(QUINDAR.addGroundWidget);
	$('#addLine').click(QUINDAR.addLineWidget);
    $('#addtablewidget').click(QUINDAR.addTableWidget);
    $('#clearLayout').click(QUINDAR.clearGrid);
    $('#searchId').click(QUINDAR.addIdTable);
});