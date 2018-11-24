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
						integrator = odeService.IntegratorFactory( y0, eom, t0, dt0)
						
						// Integrate up to tmax:
						var tmax = 1, tEst = [], yEst = []
						while( integrator.step( tmax ) ) {
							// Store the solution at this timestep:
							tEst.push( integrator.t );
							yEst.push( integrator.y );
						}

						// Update with the estimated value
						x = yEst.pop()[0];
						y = yEst.pop()[1];
						z = yEst.pop()[2];
						vx = yEst.pop()[3];
						vy = yEst.pop()[4];
						vz = yEst.pop()[5];

                        if($scope.timeObj[i][$scope.timeObj[i].length-1] != null){
                            var timestamp = $scope.timeObj[i][$scope.timeObj[i].length-1].timestamp + tmax*1000;
                        } else {
                            var timestamp = "";
                        }

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
 
});

