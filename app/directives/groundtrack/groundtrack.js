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
    var scS = {};
	var scHEst = {};	// Estimated data
	var dServiceObjVal = {};
	var est = {};			// Is it estimation? Estimation=true, Actual=false
	var prev_est = {};
	var scHCurrent = {};
    var first = {};   // True if it is the first data point of the plot
	
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

    // Function to update data to be plotted
    function updatePlot() {
        g.selectAll("path.route").remove();
        g.selectAll("path.est_route").remove(); 
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
				scHEst[i] = []; 
				scHCurrent[i] = "";
				prev_est[i] = "";
				est[i] = false;
                first[i] = true;
            }
        }
		
        for (i=0; i< vehicles.length; i++){
            latestdata = telemetry[vehicles[i].name];
  
            // Check if the latestdata is available for the selected s/c
            if (latestdata == null) {
                //alert("Latest data not available.");
            }
            else {
                if(vehicles[i].dataStatus === true) {
                    // remove previous Ground Station coverage
                    g.selectAll("path.gslos").remove();

                    //Timestamp array for each vehicle
                    if(!$scope.timeObj[i]){
                        $scope.timeObj[i] = new Array();
                    }

                    //Actual Data If block
                    if(dServiceObjVal.sIcon === "green" && dServiceObjVal.gIcon === "green" &&
						dServiceObjVal.pIcon === "green" && dServiceObjVal.dIcon === "green"){
	                    // update latestdata
                        var x,y,z,vx,vy,vz;

                        if(vehicles[i].pdata.length > 0){
                            if(dashboardService.getData(vehicles[i].pdata[0].key).hasOwnProperty("value")){
                                x = dashboardService.getData(vehicles[i].pdata[0].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].pdata[1].key).hasOwnProperty("value")){
                                y = dashboardService.getData(vehicles[i].pdata[1].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].pdata[2].key).hasOwnProperty("value")){
                                z = dashboardService.getData(vehicles[i].pdata[2].key).value;
                            } 
                        }

                        if(vehicles[i].vdata.length > 0){
                            if(dashboardService.getData(vehicles[i].vdata[0].key).hasOwnProperty("value")){
                                vx = dashboardService.getData(vehicles[i].vdata[0].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].vdata[1].key).hasOwnProperty("value")){
                                vy = dashboardService.getData(vehicles[i].vdata[1].key).value;
                            }

                            if(dashboardService.getData(vehicles[i].vdata[2].key).hasOwnProperty("value")){
                                vz = dashboardService.getData(vehicles[i].vdata[2].key).value;
                            }
                        }

                        //get current time
                        var dateValue = new Date(telemetry['time']);
                        var timestamp = dateValue.getTime(); //time in milliseconds

						est[i] = false;

					} else { //Estimated data else block
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
                            var x,y,z,vx,vy,vz;
                            if(vehicles[i].pdata.length > 0){
                                if(dashboardService.getData(vehicles[i].pdata[0].key).hasOwnProperty("value")){
                                    x = dashboardService.getData(vehicles[i].pdata[0].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].pdata[1].key).hasOwnProperty("value")){
                                    y = dashboardService.getData(vehicles[i].pdata[1].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].pdata[2].key).hasOwnProperty("value")){
                                    z = dashboardService.getData(vehicles[i].pdata[2].key).value;
                                }  
                            }

                            if(vehicles[i].vdata.length > 0){
                                if(dashboardService.getData(vehicles[i].vdata[0].key).hasOwnProperty("value")){
                                    vx = dashboardService.getData(vehicles[i].vdata[0].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].vdata[1].key).hasOwnProperty("value")){
                                    vy = dashboardService.getData(vehicles[i].vdata[1].key).value;
                                }

                                if(dashboardService.getData(vehicles[i].vdata[2].key).hasOwnProperty("value")){
                                    vz = dashboardService.getData(vehicles[i].vdata[2].key).value;
                                }
                            }
						}

						// The equations of motion: two-body problem, earth-centered:
						var eom = function(xdot, x, t) {
							var mu = 3.9860043543609598E+05;	//[km³/sec²] from http://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/gm_de431.tpc

							r = Math.sqrt(Math.pow(x[0],2)+Math.pow(x[1],2)+Math.pow(x[2],2));
							xdot[0] = x[3];
							xdot[1] = x[4];
							xdot[2] = x[5];
							xdot[3] = -mu /Math.pow(r,3) *x[0];
							xdot[4] = -mu /Math.pow(r,3) *x[1];
							xdot[5] = -mu /Math.pow(r,3) *x[2];
						}

						// Initialize:
						var y0 = [x,y,z,vx,vy,vz],
						t0 = 0,
						dt0 = 1e-10,
						integrator = odeService.IntegratorFactory( y0, eom, t0, dt0);
						
						if (first[i]){
                            //reset as this was the first point of plot
                            first[i] = false;
							// Get the latest time in the database
							var dateValue = new Date(telemetry['time']);
							var timeDatabase = dateValue.getTime(); //time in milliseconds
							var tInit = timeDatabase;	// Initial time	in milliseconds
							
							// Get the current mission time
							var timeMission = dashboardService.getTime('UTC').today.getTime();
							
							// Integrate up to tmax:
							var tmax = (timeMission - timeDatabase)/1000, tEst = [], yEst = [];		
						
						}	
						else{
							
							// Get the current mission time
							var timeMission = dashboardService.getTime('UTC').today.getTime();
							
							// Make sure an empty timeObj does not give any errors
							if ($scope.timeObj[i][$scope.timeObj[i].length-1].timestamp != ""){
								
								// Take the previous time as the initial time
								var tInit =  $scope.timeObj[i][$scope.timeObj[i].length-1].timestamp;
								
								// Take the current mission clock as the final time
								var tmax = (timeMission - tInit)/1000,  tEst = [], yEst = [];
			
							}else{
								
								// No timeObj, but timeObj should be defined at this point.
								console.log("Not supposed to happen");	
								var tInit = timeMission/1000 - 1;
								var tmax = 1,  tEst = [], yEst = [];						
							}

						}
			

						// Julian Date Century
						var jdcJ2000Init = jDayCent(tInit);
					
						// tGmst: Greenwich mean sidereal time [rad]
						var tGmstInit = gmst(jdcJ2000Init);		

						// transform from Earth-centered, Earth-fixed (ECEF)  coordinate system to Earth-centered inertial (ECI) 
						// coordinate system, J2000
						rEci = ecef2Eci([x,y,z,vx,vy,vz], tGmstInit);

						// Initialize:
						var y0 = rEci,
						t0 = 0,
						dt0 = 1e-10,
						integrator = odeService.IntegratorFactory( y0, eom, t0, dt0)		
			
						while( integrator.step( tmax ) ) {
							// Store the solution at this timestep:
							tEst.push( integrator.t );
							yEst.push( integrator.y );
						}

						// Updated ECI values
						var xEci = yEst.pop()[0];
						var yEci = yEst.pop()[1];
						var zEci = yEst.pop()[2];
						var vxEci = yEst.pop()[3];
						var vyEci = yEst.pop()[4];
						var vzEci = yEst.pop()[5];						
						
						var tFin = tInit + tmax*1000;	// Final time in milliseconds
				
						// Julian Date Century
						var jdcJ2000Fin = jDayCent(tFin);
					
						// tGmst: Greenwich mean sidereal time [rad]
						var tGmstFin = gmst(jdcJ2000Fin);											
					
						// Function to transform from Earth-centered inertial (ECI)  coordinate system to Earth-centered, Earth-fixed (ECEF) 
						// coordinate system, J2000
						var rEcef = eci2Ecef([xEci,yEci,zEci,vxEci,vyEci,vzEci], tGmstFin);

						// Update with the estimated value
						x = rEcef[0];
						y = rEcef[1];
						z = rEcef[2];
						vx = rEcef[3];
						vy = rEcef[4];
						vz = rEcef[5];						
						
						var timestamp = timeMission;

						est[i] = true;
					}

                    if(timestamp != ""){
                        // create an object with timestamp and boolean value of est
                        var newTime = {
                            timestamp : timestamp,
                            est : est[i]
                        };
                        $scope.timeObj[i].push(newTime);

                        var diffMins = Math.round(
                            ($scope.timeObj[i][$scope.timeObj[i].length-1].timestamp - $scope.timeObj[i][0].timestamp)/60000);

                        // Remove data points after 90 minutes (7200000ms)
                        if( diffMins >= 90 ) {
                            var timeObj = $scope.timeObj[i].splice(0,1);
                            if(timeObj[0].est){
                                scHEst[i][0].splice(0,1);
                                if(scHEst[i][0].length == 0){
                                    scHEst[i].splice(0,1)
                                }
                            } else {
                                scH[i][0].splice(0,1);
                                if(scH[i][0].length == 0){
                                    scH[i].splice(0,1)
                                }
                            }
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

                        //Flag is true when there is a switch between actual and estimated data
                        if(est[i] !== prev_est[i]){
                            flag = true;
                        } else {
                            flag = false;
                        }

                        // add longitude and latitude to data_plot
                        var scHData = [longitude, latitude];
                        scHCurrent[i] = scHData;

                        //Push current latitude,longitude to the main array of points
                        if(!est[i]) {
                            if(flag){
                                scH[i][scH[i].length] = new Array();
                            }
                            scH[i][scH[i].length-1].push(scHData);
                        } else {
                            if(flag){
                                scHEst[i][scHEst[i].length] = new Array();
                            }
                            scHEst[i][scHEst[i].length-1].push(scHData);
                        }

                        //Data containing position and velocity of the satellite
                        var scSData = [x, y, z, vx, vy, vz];
                        scS[i].push(scSData);

                        if(vehicles[i].orbitStatus === true){
                            //Orbit path using actual telemetry
                            var route = g.append("path")
                                            .datum({type: "MultiLineString", coordinates: scH[i]})
                                            .attr("class", "route")
                                            .attr("stroke", vehicles[i].color)
                                            .attr("d", path);

                            //Orbit path using estimated data
                            var est_route = g.append("path")
                                            .datum({type: "MultiLineString", coordinates: scHEst[i]})
                                            .attr("class", "est_route")
                                            .attr("stroke", vehicles[i].color)
                                            .attr("d", path);
                        }

                        //Satellite icon and communication links between satellites and ground stations
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

                            for (kk=i+1; kk<vehicles.length; kk++) {
                                if (vehicles[kk].iconStatus === true) {
                                    commlink(scS[i][scS[i].length-1],scS[kk][scS[kk].length-1],scHCurrent[i],scHCurrent[kk]);
                                }
                            }
                            for (kk=0; kk<gs.length; kk++) {
                                gsCommLink(station[kk], scHCurrent[i], scS[i][scS[i].length-1], gsAng);
                            }
                        }
                        prev_est[i] = est[i];
                    }
                }
            }
        }
        prevSettings = angular.copy($scope.widget.settings.vehicles);
    }

    //Displays day and night regions on map according to time
    function showDayNight() {
        time = dashboardService.getTime('UTC');
        solarTime = time.today;
        if($scope.night){
            $scope.night.datum(circle.center(antipode(solarService.solarPosition(solarTime))).radius(90)).attr("d", path);
        }
        
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
 
 
 	// Function to calcualte Julian date
	// INPUTS
	// time: unix time [milliseconds]
	// OUTPUTS
	// jdcJ2000: Julian Date century since epoch J2000
	function jDayCent(time)
	{
		var jdJ2000 = 2451545.0;	// epoch J2000, 1/1/2000, 12 PM
		var jd0 = 2440587.5;	// Julian Date to Jan 1 1970, 0 AM
		
		var jd = jd0 + time / (1000*60*60*24);	// Julian date
		
		var jdcJ2000 = (jd-jdJ2000)/36525;		// Julian date since J2000
		
		return jdcJ2000;
	}
	
	
	// Function to calculate Greenwich Mean Sidereal Time
	// INPUTS
	// jdcJ2000: Julian century from the epoch J2000 [century]
	// OUTPUTS
	// tGmst: Greenwich mean sidereal time [rad]
	function gmst(jdcJ2000)
	{
		// Calculate Greenwich Mean Sidereal Time in seconds
		var tGmstSec = 67310.54841 + (876600*3600+8640184.812866)*jdcJ2000 +
			0.093104*Math.pow(jdcJ2000, 2) - 6.2 *Math.pow(10, -6) * Math.pow(jdcJ2000,3);
	
		// Convert to radian, 1 sec = 1/240ᵒ (1ᵒ = 4 min)
		var tGmst = (tGmstSec / 240. * Math.PI/180.) % (Math.PI*2);
	
		return tGmst;
	}
	
	
	// Function to calculate a direction cosine matrix
	// to rotate a frame about the third axis
	// INPUTS
	// th: Angle of rotation [rad]
	// OUTPUTS
	// mat: transformation matrix, rotated by th along z-axis
	function rot3Mat(th)
	{
	var mat = new Array(3);	// Create an Array [1 x 3]
	
	for (iRot=0; iRot<3; iRot++)
		mat[iRot] = new Array(3);	// Expand mat to [3 x 3]
	
	mat[0][0] = Math.cos(th);
	mat[0][1] = Math.sin(th);
	mat[0][2] = 0.0;
	mat[1][0] = -Math.sin(th);
	mat[1][1] = Math.cos(th);
	mat[1][2] = 0.0;
	mat[2][0] = 0.0;
	mat[2][1] = 0.0;
	mat[2][2] = 1.0;
	
	return mat;
	
	}


	// Function to express a vector in a new frame
	// The new frame is rotated about the third axis
	// INPUTS
	// r: row vector [1 x 3]
	// th: Angle of rotation [rad]
	// OUTPUTS
	// rRot: r expressed in a new frame rotated by th along z-axis
	function rot3(r, th)
	{
		var matA = rot3Mat(th);
		
		var rRot = new Array(3);
		
		for (iRow=0; iRow<3; iRow++)
			rRot[iRow] = matA[iRow][0]*r[0] + matA[iRow][1]*r[1] + matA[iRow][2]*r[2];
		
		return rRot;
	}
	
	
	// Function for a cross product of two arrays
	// INPUTS
	// a: Array 1 [1x3]
	// b: Array 2 [1x3]
	//OUTPUTS
	// c: Cross product of a and b
	function cross(a, b)
	{
		var c = [a[1]*b[2] - a[2]*b[1], -a[0]*b[2] + a[2]*b[0], a[0]*b[1] - a[1]*b[0]];
		
		return c;
	}
	
	
	// Function to express a velocity vector 
	// in a new rotating frame
	// using basic kinematic equation
	// INPUTS
	// r: Array [1 x 6] position, velocity
	// omega: Angular velocity array [1x3] rad/s
	// OUTPUTS
	// rBke: Array [1 x 6] position, corrected velocity in the rotating frame
	function bke(r, omega)
	{
		// Create an angular velocity array
		//var omega = new Array(3);	
		//omega[0] = 0.0;
		//omega[1] = 0.0;
		//omega[2] = -7.292115 * Math.pow(10,-5);	// rad/s
		
		var crossProd = cross(omega, [r[0],r[1],r[2]]);
		
		var rBke = Array(6);
		rBke[0] = r[0];
		rBke[1] = r[1];
		rBke[2] = r[2];
		rBke[3] = r[3] + crossProd[0];
		rBke[4] = r[4] + crossProd[1];
		rBke[5] = r[5] + crossProd[2];
		
		return rBke;	
	}


	// Function to transform from Earth-centered inertial (ECI)  
	// coordinate system to Earth-centered, Earth-fixed (ECEF) 
	// coordinate system, J2000
	// INPUTS
	// r: state vector 1x6 (position [km]; vector[km/s]) in ECI
	// tGmst: Greenwich mean sidereal time [rad] 
	// OUTPUTS
	// rFinal: State vector 1x6 in ECEF
	function eci2Ecef(r, tGmst)
	{
		var pEcef = new Array(3);	// Initialize position array
		var vEcef = new Array(3);	// Initialize velocity array
		
		// Position in ECEF
		pEcef = rot3([r[0],r[1],r[2]], tGmst);	
	
		// Velocity expressed in ECEF
		vEcef = rot3([r[3],r[4],r[5]], tGmst);

		// Use BKE to complete the velocity transformation
		// eAngV: Earth rotation rate
		var eAngV = 7.292115 * Math.pow(10,-5);	// rad/s
		var rFinal = bke([pEcef[0],pEcef[1],pEcef[2],vEcef[0],vEcef[1],vEcef[2]], [0.,0.,-eAngV]);
	
		return rFinal;
	
	}
	
	
	// Function to transform from Earth-centered, Earth-fixed (ECEF)  
	// coordinate system to Earth-centered inertial (ECI) 
	// coordinate system, J2000
	// INPUTS
	// r: state vector 6x1 (position [km]; vector[km/s]) in ECEF
	// tGmst: Greenwich mean sidereal time [rad] 
	// OUTPUTS
	// stateEci: State vector 1x6 in ECI
	function ecef2Eci(r, tGmst)
	{
		var pEci = new Array(3);	// Initialize position array
		var vEci = new Array(3);	// Initialize velocity array
	
		// Position in ECI
		pEci = rot3([r[0],r[1],r[2]], -tGmst);	
	
		// Velocity expressed in ECI
		vEci = rot3([r[3],r[4],r[5]], -tGmst);
	
		// Use BKE to complete the velocity transformation
		// eAngV: Earth rotation rate
		var eAngV = 7.292115 * Math.pow(10,-5);	// rad/s
		var stateEci = bke([pEci[0],pEci[1],pEci[2],vEci[0],vEci[1],vEci[2]], [0.,0.,eAngV]);
	
		return stateEci;

	}
});

