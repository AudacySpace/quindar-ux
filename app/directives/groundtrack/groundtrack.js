app.directive('groundtrack',function() { 
  return { 
    restrict: 'EA', 
    templateUrl:'./directives/groundtrack/groundtrack.html',
    controller: 'GroundTrackCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('GroundTrackCtrl',function ($scope,d3Service,$element,$interval,dashboardService,gridService,solarService,odeService) { 
  
    var telemetry = dashboardService.telemetry;
    var temp = $element[0].getElementsByTagName("div")[0];
    var el = temp.getElementsByTagName("div")[1];
    var prevSettings;
    var scH = {};		// Current live data
	var scHOld = {};	// Save old data
	var scTime = {};	// Save timestamp during live data
    var scS = {};
	var scHEst = {};	// Estimated data
	var scHEstOld = {};	// Save old data
	var scEstTime = {};// Save timestamp during estimation
	var dServiceObjVal = {};
	var est = false;			// Is it estimation?
	
	$scope.dataStatus = dashboardService.icons;
	//watch to check the database icon color to know about database status
    $scope.$watch('dataStatus',function(newVal,oldVal){
        dServiceObjVal = newVal; 
    },true);
	
    $scope.timeObj = {};
    $scope.checkboxModel = {
        value1 : true
    };

    var time, solarTime, latestdata;
    var rEarth = 6378.16;   //Earth radius [km]
    var gsAng = 85;
    var π = Math.PI,radians = π / 180,degrees = 180 / π;
    var projection = d3Service.geoEquirectangular().precision(.1);
    var path = d3Service.geoPath().projection(projection);
    var graticule = d3Service.geoGraticule();
    var circle = d3Service.geoCircle();
    var zoom = d3Service.zoom()
                .scaleExtent([1, 10])
                .translateExtent([[0,0], [900, 600]])
                .on("zoom", zoomed);
                        
    var svg = d3Service.select(el)
                        .append("svg")
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "-20 10 1000 500")
                        .attr('width', '100%')
                        .attr('height', '100%')
                        .classed("gt-svg-content", true);

    var transform = d3Service.zoomTransform(svg.node()); 
    var g = svg.append("g");

    var gs = ['GS1','GS2'];
    var station = [[-122.4, 37.7],[103.8, 1.4]];
    //var satRadius = 10000;//7000;
    var stationNames = ['Ground Station 01 - San Francisco ','Ground Station 02 - Singapore'];
	
    g.attr("id","g")
        .attr("x",0)
        .attr("y",0);

    svg.call(zoom);

    if($(window).width() >= screen.width){
        zoom = d3Service.zoom()
                        .scaleExtent([1, 10])
                        .translateExtent([[0,0], [1300, 1000]])
                        .on("zoom", zoomed);
    }

    // Plot world map
    d3Service.json("./directives/groundtrack/d3-maps/world-50m.json", function(error, world) {
        if (error) throw error;  

        // Show graticule
        g.append("path")
            .datum(graticule)
            .attr("d", path)
            .attr("class","graticule"); 

        // Show land
        g.append("path")
            .datum(topojson.feature(world, world.objects.land))
            .attr("class", "land")
            .style("fill","#fff")
            .attr("d", path);

        //countries
        g.append("g")
            .attr("class", "boundary")
            .selectAll("boundary")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter().append("path")
            .style("fill","#ccc")
            .attr("name", function(d) {return d.properties.name;})
            .attr("id", function(d) { return d.id;})
            .attr("d", path);

        //Plot ground stations
        for (j=0; j<station.length; j++) {
            plotgs(station[j],stationNames[j]);
        }

        // Show dark region (night time)
        $scope.night = g.append("path")
                        .attr("class", "night")
                        .attr("d", path);
        showDayNight();
    });

    //Function to reset the map
    $scope.resetted = function() {
        svg.transition()
            .duration(500)
            .call(zoom.transform, d3Service.zoomIdentity);
    }

    //Function to zoom in using button
    $scope.zoomIn = function(){
        zoom.scaleBy(svg, 2);
    }

    //Function to zoom out using button
    $scope.zoomOut = function(){
        zoom.scaleBy(svg,0.5);
    }

    //Function to show enable or disable ground station coverage area.
    //Commented out as coverage is shown whenever the vehicles/satellites are enabled on ground track
    // $scope.showCoverage = function(checkedVal){
    //     if(checkedVal === true){
    //         g.selectAll("path.gslos").remove();
    //         for (j=0; j<gs.length;j++) {
    //             plotGsCover(station[j]);      
    //         }
    //     } else {
    //         g.selectAll("path.gslos").remove();
    //     }
    // }

    $scope.interval = $interval(updatePlot, 1000);

    $scope.$on("$destroy",
        function(event) {
            $interval.cancel($scope.interval);
        }
    );

	//var counter = 0;
    // Function to update data to be plotted
    function updatePlot() {
        g.selectAll("path.route").remove(); 
        g.selectAll("#craft").remove();
        g.selectAll("path.link").remove();
        g.selectAll("line").remove();
        g.selectAll("path.gslink").remove(); 

        showDayNight();
        var vehicles = $scope.widget.settings.vehicles;

        //reset plotData when there is a change in settings
        if (JSON.stringify(prevSettings) !== JSON.stringify(vehicles)){
            $scope.timeObj = {};
            for(i=0; i<vehicles.length; i++){
                scS[i] = [];
                scH[i] = [];
				scHOld[i] = [];
				scTime[i] = [];
				scHEst[i] = []; 
				scHEstOld[i] = [];
				scEstTime[i] = [];
            }
        } 

		// Increase counter
		//counter++;
		
        for (i=0; i< vehicles.length; i++){
            latestdata = telemetry[vehicles[i].name];

            if(vehicles[i].dataStatus === true) {
            	g.selectAll("path.gslos").remove();

				//Timestamp array for each vehicle
				if(!$scope.timeObj[i]){
					$scope.timeObj[i] = new Array();
				}
				
				if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" && 
				dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green"){
	//					if(counter < 10 || (counter > 20 && counter < 30) || counter > 40 ){
					
					//get current time
					var dateValue = new Date(telemetry['time']);
					var timestamp = dateValue.getTime(); //time in milliseconds

					//push values to the array
					if(timestamp != $scope.timeObj[i][$scope.timeObj[i].length-1]){
						$scope.timeObj[i].push(timestamp);
					}
				
					// update latestdata
					var x = latestdata.GNC.position.x.value;
					var y = latestdata.GNC.position.y.value;
					var z = latestdata.GNC.position.z.value;
					var vx = latestdata.GNC.velocity.vx.value;
					var vy = latestdata.GNC.velocity.vy.value;
					var vz = latestdata.GNC.velocity.vz.value;						
			
					// Save timestamp 
					scTime[i].push(timestamp);							
					
					est = false;	// Not estimation					
				}
				else{
					// The initial x is from the data base
					if (scS[i] != ""){
						var x = scS[i][scS[i].length-1][0];
						var y = scS[i][scS[i].length-1][1];
						var z = scS[i][scS[i].length-1][2];
						var vx = scS[i][scS[i].length-1][3];
						var vy = scS[i][scS[i].length-1][4];
						var vz = scS[i][scS[i].length-1][5];
					}
					else{

						var x = latestdata.GNC.position.x.value;
						var y = latestdata.GNC.position.y.value;
						var z = latestdata.GNC.position.z.value;
						var vx = latestdata.GNC.velocity.vx.value;
						var vy = latestdata.GNC.velocity.vy.value;
						var vz = latestdata.GNC.velocity.vz.value;
					}

					// The equations of motion: two-body problem, earth-centered:
					var eom = function(xdot, x, t) {
					
						var mu = 3.9860043543609598E+05;	//[km³/sec²] from http://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/gm_de431.tpc

						r = Math.sqrt(Math.pow(x[0],2)+Math.pow(x[1],2)+Math.pow(x[2],2));
						xdot[0] = x[3]
						xdot[1] = x[4]
						xdot[2] = x[5]
						xdot[3] = -mu /Math.pow(r,3) *x[0] 
						xdot[4] = -mu /Math.pow(r,3) *x[1] 
						xdot[5] = -mu /Math.pow(r,3) *x[2] 
						
					}

					// Initialize:
					var y0 = [x,y,z,vx,vy,vz],
					t0 = 0,
					dt0 = 1e-10,
					integrator = odeService.IntegratorFactory( y0, eom, t0, dt0)
					
					// Integrate up to tmax:
					var tmax = 1, tEst = [], yEst = []
					while( integrator.step( tmax ) ) {
						
						// Store the solution at this timestep:
						tEst.push( integrator.t )
						yEst.push( integrator.y )						
					}
					
					// Update with the estimated value
					x = yEst.pop()[0];
					y = yEst.pop()[1];
					z = yEst.pop()[2];
					vx = yEst.pop()[3];
					vy = yEst.pop()[4];
					vz = yEst.pop()[5];
					
					// Save timestamp 
					scEstTime[i].push(timestamp);							
					
					var timestamp = $scope.timeObj[i][$scope.timeObj[i].length-1] + tmax*1000; //time in milliseconds

					//push values to the array
					if(timestamp != $scope.timeObj[i][$scope.timeObj[i].length-1]){
						$scope.timeObj[i].push(timestamp);
					}

					est = true;
				}
				
				var scSData = [x, y, z, vx, vy, vz];
				if(scSData != scS[i][scS[i].length - 1]){
					scS[i].push(scSData);
				}
					
				// Calculate longitude and latitude from the satellite position x, y, z.
				// The values (x,y,z) must be Earth fixed.
				r = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
				longitude = Math.atan2(y,x)/Math.PI*180;
				latitude = Math.asin(z/r)/Math.PI*180;
				
				// Convert [longitude,latitude] to plot 
				var sat_coord = projGround([longitude,latitude]);

				//Plot ground station coverage
				for (j=0; j<gs.length;j++) {
					plotGsCover(station[j], r);
				}
		
				var diffMins = Math.round(($scope.timeObj[i][$scope.timeObj[i].length-1] - $scope.timeObj[i][0])/60000);
				
				// Remove data points after 90 minutes (7200000ms)					
				if( diffMins >= 90) {
						if (scHOld[i] == "" && scHEstOld[i] == ""){
							scH[i].splice(0,1);
							scTime[i].splice(0,1);
							scHEst[i].splice(0,1);
							scEstTime[i].splice(0,1);
						}
						else if (scHEstOld[i] == ""){
												
							// When scHOld[i][0] is empty, remove it
							if (scHOld[i][0] == ""){
								scHOld[i].splice(0,1);
							}
								
							scHOld[i][0].splice(0,1);
							scTime[i].splice(0,1);
						}
						else if (scHOld[i] == ""){
							
							// When scHEstOld[i][0] is empty, remove it
							if (scHEstOld[i][0] == ""){
								scHEstOld[i].splice(0,1);
							}
								
							scHEstOld[i][0].splice(0,1);
							scEstTime[i].splice(0,1);
						}
						else {
							if (scTime[i][0] < scEstTime[i][0]){
								
								// When scHOld[i][0] is empty, remove it
								if (scHOld[i][0] == ""){
									scHOld[i].splice(0,1);
								}
								
								scHOld[i][0].splice(0,1);
								scTime[i].splice(0,1);
								//console.log(scHOld[i][0])
							}else{
								
								// When scHEstOld[i][0] is empty, remove it
								if (scHEstOld[i][0] == ""){
									scHEstOld[i].splice(0,1);
								}
								
								scHEstOld[i][0].splice(0,1);
								scEstTime[i].splice(0,1);
								//console.log(scHEstOld[i][0])
							}
						}
						
						scS[i].splice(0,1);
						$scope.timeObj[i].splice(0,1);
				}
					
				// Check if estimation or not
				if (est == false){
					// Not estimation
					
					// Clean data when switched from estimation
					if (scH[i] != ""){
						if (scH[i][scH[i].length-1][0] == 400){
							scH[i] = []
						}
					}
					
					// add longitude and latitude to data_plot
					var scHData = [longitude, latitude];
					if(scHData != scH[i][scH[i].length - 1]){
						scH[i].push(scHData);
					}

					// If scH is switched to scH, save scHEst to scHEstOld
					if (scHEst[i] != ""){
						if (scHEst[i][scHEst[i].length-1][0] != 400){
							scHEstOld[i].push(scHEst[i]);
							scHEst[i]= [];	// Clean scH
						}
					}
					
					// Assign 400 when no data
					scHEst[i].push([400, 400]);
					
					// Show link when iconStatus is true
					if(vehicles[i].iconStatus === true){
						// scH for all vehicles exist
						if (scH[vehicles.length-1] != "") {
							if (scH[vehicles.length-1][scH[vehicles.length-1].length-1][0] != 400){
								for (kk=i+1; kk<vehicles.length; kk++) {
									if (vehicles[kk].iconStatus === true) {
										commlink(scS[i][scS[i].length-1],scS[kk][scS[kk].length-1],scH[i][scH[i].length-1],scH[kk][scH[kk].length-1]); 
									}
								}
								for (kk=0; kk<gs.length; kk++) {
									gsCommLink(station[kk], scH[i][scH[i].length-1], scS[i][scS[i].length-1], gsAng);
								}
							}
						}					
					}
					
					// Plot live trajectory when orbitStatus is true
					if(vehicles[i].orbitStatus === true){
						
						// Plot existing data first
						var route = g.append("path")
								 .datum({type: "LineString", coordinates: scH[i]})  
								 .attr("class", "route")
								 .attr("stroke", vehicles[i].color)
								 .attr("d", path);		 
					}			
				}
				else{
					// Estimation
					
					// Clean data when switched from live data
					if (scHEst[i] != ""){
						if (scHEst[i][scHEst[i].length-1][0] == 400){
							scHEst[i] = []
						}
					}
					
					// add longitude and latitude to data_plot
					var scHData = [longitude, latitude];
					if(scHData != scHEst[i][scHEst[i].length - 1]){
						scHEst[i].push(scHData);
					}  				

					// If scH is switched to scHEst, save scH to scHOld
					if (scH[i] != ""){
						if (scH[i][scH[i].length-1][0] != 400){
							scHOld[i].push(scH[i]);
							scH[i]= [];	// Clean scH
						}
					}
					
					// Assign 400 when no data
					scH[i].push([400, 400]);
								 
					// Show link when iconStatus is true
					if(vehicles[i].iconStatus === true){
						// scHEst for all vehicles exist
						if (scHEst[vehicles.length-1] != ""){	
							if (scHEst[vehicles.length-1][scHEst[vehicles.length-1].length-1][0] != 400) {
								//console.log(scHEst[vehicles.length-1][scHEst[vehicles.length-1].length-1])
								for (kk=i+1; kk<vehicles.length; kk++) {
									if (vehicles[kk].iconStatus === true) {
										commlink(scS[i][scS[i].length-1],scS[kk][scS[kk].length-1],scHEst[i][scHEst[i].length-1],scHEst[kk][scHEst[kk].length-1]); 
									}
								}
								for (kk=0; kk<gs.length; kk++) {
									gsCommLink(station[kk], scHEst[i][scHEst[i].length-1], scS[i][scS[i].length-1], gsAng);
								}
							}
						}
					}
					
					// Plot estimated trajectory when orbitStatus is true
					if(vehicles[i].orbitStatus === true){
						// Add estimation
						var route = g.append("path")
								 .datum({type: "LineString", coordinates: scHEst[i]})  
								 .attr("class", "route")
								 .style("stroke-dasharray", ("10,3"))
								 .attr("stroke", vehicles[i].color)
								 .attr("d", path);											
					}
					
				}
											
				// Plot old trajectory when orbitStatus is true						
				if(vehicles[i].orbitStatus === true){
					
					// Plot trajectory from saved data
					if (scHOld[i].length != 0){
						for (kOld=0; kOld<scHOld[i].length; kOld++){
							var route = g.append("path")
								 .datum({type: "LineString", coordinates: scHOld[i][kOld]})  
								 .attr("class", "route")
								 .attr("stroke", vehicles[i].color)
								 .attr("d", path);
						}
					}
					
					// Plot trajectory from saved estimation data
					if (scHEstOld[i].length != 0){
						for (kOld=0; kOld<scHEstOld[i].length; kOld++){
							var route = g.append("path")
								 .datum({type: "LineString", coordinates: scHEstOld[i][kOld]})  
								 .attr("class", "route")
								 .style("stroke-dasharray", ("10,3"))
								 .attr("stroke", vehicles[i].color)
								 .attr("d", path);
						}
					}												
				}
				
				// Show icon when iconStatus is true
				if(vehicles[i].iconStatus === true){
						var craft = g.append("svg:image")
								 .attr("xlink:href", "/icons/groundtrack-widget/satellite.svg")
								 .attr("id", "craft")
								 .attr("fill", "#000000")
								 .attr("x",sat_coord[0])
								 .attr("y",sat_coord[1]-15)
								 .attr("width",30)
								 .attr("height",30)
								 .append("svg:title").text(vehicles[i].name);
				}
			}
        }
		
        prevSettings = angular.copy($scope.widget.settings.vehicles);
    }

    //Displays day and night regions on map according to time
    function showDayNight() {
        time = dashboardService.getTime(0);
        solarTime = time.today;
        $scope.night.datum(circle.center(antipode(solarService.solarPosition(solarTime))).radius(90)).attr("d", path);
    }
    
    //Displays Ground station coverage area    
    function plotGsCover(coord, radius){
        covAng = gsCoverage(radius, gsAng); // Coverage angle [deg]
        var gslos = svg.select('#g')
                        .append("path")
                        .datum(circle.center(coord).radius(covAng))
                        .attr("class", "gslos")
                        .attr("d", path);           
    }; 


    // Communication link between satellites
    function commlink(a,b,c,d){
        //a: Satellite A [x,y,z] [km]
        //b: Satellite B [x,y,z] [km]
        //c: Satellite A [longitude, latitude] [deg]
        //d: Satellite B [longitude, latitude] [deg]

        if(a && b && c && d) {
            // Half angles [radians]
            var th1 = Math.acos(rEarth/Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]));
            var th2 = Math.acos(rEarth/Math.sqrt(b[0]*b[0]+b[1]*b[1]+b[2]*b[2]));

            // Angle between a and b
            var th = Math.acos(dotProd(a,b)/(mag(a)*mag(b)));

            if (th < th1+th2){
                var comm = g.append("path")
                            .datum({type: "LineString", coordinates: [[c[0]+6,c[1]-2], [d[0]+6,d[1]-2]]})
                            .attr("class", "link")
                            .attr("d", path);
            }
        }
    }; 

    // Communication between satellite and ground station
    function gsCommLink(a,b,c,ang){
        // a: Ground station [longitude, latitude] [deg]
        // b: Satellite [longitude, latitude] [deg]
        // c: Satellite [x,y,z] [km]
        // ang: Ground station coverage angle [deg]

        if(a && b && c && ang) {
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
                            .attr("d", path);
            }
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

    // Ground station coverage area based on the sat's altitude
    function gsCoverage(r, gsAng){
        // r: radius to satellite [km]
        // gsAng: Ground station coverage angle [deg]
           
        // Temp angle
        alpha = Math.asin(rEarth*Math.sin((180-gsAng)*radians)/r);
          
        //Coverage angle from the center of Earth
        return  180 - (180-gsAng) - alpha*degrees;
    }   

    //Plots ground station and display's name on hover
    function plotgs(coord,name){
            var gs_coord = projGround(coord);   //convert to px
            var gs = svg.select("#g")
                        .append("svg:image")
                        .attr("xlink:href", "/icons/groundtrack-widget/aud_target_02_orange.svg")
                        .attr("id", "gs")
                        .attr("x",gs_coord[0]-10)
                        .attr("y",gs_coord[1]-16)
                        .attr("width",30)
                        .attr("height",30)
                        .append("svg:title").text(name);
    }
     
    //Function to zoom in using mouse scroll or touch events           
    function zoomed(){
        g.attr("transform", d3Service.event.transform);   
    };
      
    function projGround(d){
        return projection(d);
    }; 

    function antipode(position) {
        return [position[0] + 180, -position[1]];
    }
 
});

