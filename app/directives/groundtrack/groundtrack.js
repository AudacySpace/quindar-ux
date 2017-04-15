app.directive('groundtrack',function() { 
  return { 
    restrict: 'EA', 
    templateUrl:'./directives/groundtrack/groundtrack.html',
    controller: 'GroundTrackCtrl',
    controllerAs: 'vm',
    bindToController: true              
    }; 
});

app.controller('GroundTrackCtrl',function ($scope,d3Service,$element,dashboardService,gridService) { 
  
    var temp = $element[0].getElementsByTagName("div")[0];
    var el = temp.getElementsByTagName("div")[1];
    $scope.checkboxModel = {
        value1 : true
    };
    $scope.vals =  $scope.widget.settings.vehName;
    $scope.scHo = $scope.widget.settings.scHolder;
    $scope.orbitHo = $scope.widget.settings.orbitHolder;
    $scope.iconHo = $scope.widget.settings.iconHolder;

    var vehName;
    var vehs = [];
    var scH = {};
    var prevVehs = [];
    var orbits = [];
    var satIcons = [];

    $scope.$watch('vals', function(newVal,oldVal){
        vehs = newVal; 
    }, true);

    $scope.$watch('scHo',function(newVal,oldVal){
        scH = newVal; 
    },true);

    $scope.$watch('orbitHo',function(newVal,oldVal){
        orbits = newVal; 
    },true);

    $scope.$watch('iconHo',function(newVal,oldVal){
        satIcons = newVal; 
    },true);

    // Initialize gsHoldar
    var gsHolder={}
    var rEarth = 6378.16;   //Earth radius [km]
    var gsAng = 85;
    var temptime = new Date;
    var width = 960,height = 580;
    var π = Math.PI,radians = π / 180,degrees = 180 / π;
    var projection = d3Service.geoEquirectangular().precision(.1);
    var path = d3Service.geoPath().projection(projection);
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    var graticule = d3Service.geoGraticule();
    var circle = d3Service.geoCircle();
    var zoom = d3Service.zoom()
                        .scaleExtent([1, 8])
                        .translateExtent([[-20,0],[1000,500]])
                        .on("zoom", zoomed);
    var svg = d3Service.select(el)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "-20 0 1000 500")
                .attr('width', '100%')
                .classed("svg-content", true);

    svg.call(zoom);
    var g = svg.append("g");

    g.attr("id","g")
     .attr("x",0)
     .attr("y",0);

    var transform = d3Service.zoomTransform(svg.node());   
           
    var sat = 1; //Default satellite
    var gs = [];
    var station = [[-122.4, 37.7],[103.8, 1.4]];
    var satRadius = 10000;//7000;

    var stationNames = ['Ground Station 01 - San Francisco ','Ground Station 02 - Singapore'];
        
    // Plot world map
    d3Service.json("./directives/groundtrack/world-50m.json", function(error, world) {
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


        for (j=0; j<station.length; j++) {
            plotgs(station[j],stationNames[j]);
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
    
    sat = ['Audacy1','Audacy2','Audacy3']
    gs = ['GS1','GS2'];

    //Plot ground station coverage
    for (j=0; j<gs.length;j++) {
        plotGsCover(station[j]);      
    }

    setInterval(updatePlot, 1000);

    // Function to update data to be plotted
    function updatePlot() {
        // sat = ['Audacy1','Audacy2','Audacy3'];
        g.selectAll("path.route1").remove(); 
        g.selectAll("path.route2").remove();
        g.selectAll("path.route3").remove();
        g.selectAll("#craft1").remove();
        g.selectAll("#craft2").remove();
        g.selectAll("#craft3").remove(); 
      
        var telemetry = dashboardService.telemetry;

        for (i=0; i< vehs.length; i++){
            latestdata = null;
            latestdata = telemetry[vehs[i]];
  
            // Check if the latestdata is available for the selected s/c
            if (latestdata == null) {
                                
            }
            else {
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
                if(scH[i].length > 600) {
                    scH[i].splice(0,1);                            
                }

                // add longitude and latitude to data_plot
                scH[i].push([longitude, latitude]); 
                if(vehs[i] === "Audacy1" ){
                    if(orbits[i] === true){
                   
                        var route1 = g.append("path")
                                      .datum({type: "LineString", coordinates: scH[i]})  
                                      .attr("class", "route1")
                                      .attr("d", path);
                    }
                    
                    if(satIcons[i] === true){
                        var  craft1 = g.append("svg:image")
                                       .attr("xlink:href", "./directives/groundtrack/one.svg")
                                       .attr("id", "craft1")
                                       .attr("x",sat_coord[0])
                                       .attr("y",sat_coord[1]-15)
                                       .attr("width",30)
                                       .attr("height",30)
                                       .append("svg:title").text("Audacy 1");
                    }
                    

                } else if(vehs[i] === "Audacy2"){
                    if(orbits[i] === true){
                        var route2 = g.append("path")
                                      .datum({type: "LineString", coordinates: scH[i]})  
                                      .attr("class", "route2")
                                      .attr("d", path);
                    }

                    if(satIcons[i] === true){
                        var  craft2 = g.append("svg:image")
                                       .attr("xlink:href", "./directives/groundtrack/two.svg")
                                       .attr("id", "craft2")
                                       .attr("x",sat_coord[0])
                                       .attr("y",sat_coord[1]-15)
                                       .attr("width",30)
                                       .attr("height",30)
                                       .append("svg:title").text("Audacy 2");
                    }

                } else if(vehs[i] === "Audacy3"){
                    if(orbits[i] === true){
                        var route3 = g.append("path")
                                      .datum({type: "LineString", coordinates: scH[i]})  
                                      .attr("class", "route3")
                                      .attr("d", path); 
                    }

                    if(satIcons[i] === true){
                        var  craft3 = g.append("svg:image")
                                       .attr("xlink:href", "./directives/groundtrack/three.svg")
                                       .attr("id", "craft3")
                                       .attr("x",sat_coord[0])
                                       .attr("y",sat_coord[1]-15)
                                       .attr("width",30)
                                       .attr("height",30)
                                       .append("svg:title").text("Audacy 3");
                    }
                }

                // if(vehs[i] === "Audacy1" && $scope.widget.settings.contents[i].contents[1].value === 'Audacy1'){
                //    if(orbits[i] === true){
                //         var route1 = g.append("path")
                //                       .datum({type: "LineString", coordinates: scH[i]})  
                //                       .attr("class", "route1")
                //                       .attr("d", path);
                //    }
                //     if(satIcons[i] === true){
                //         var  craft1 = g.append("svg:image")
                //                        .attr("xlink:href", "./directives/groundtrack/one.svg")
                //                        .attr("id", "craft1")
                //                        .attr("x",sat_coord[0])
                //                        .attr("y",sat_coord[1]-15)
                //                        .attr("width",30)
                //                        .attr("height",30)
                //                        .append("svg:title").text("Audacy 1");
                //     }

                // } else if(vehs[i] === "Audacy2" && $scope.widget.settings.contents[i].contents[1].value === 'Audacy2'){
                //     if(orbits[i] === true){
                //         var route2 = g.append("path")
                //                       .datum({type: "LineString", coordinates: scH[i]})  
                //                       .attr("class", "route2")
                //                       .attr("d", path);
                //     }
                //     if(satIcons[i] === true){
                //         var  craft2 = g.append("svg:image")
                //                        .attr("xlink:href", "./directives/groundtrack/two.svg")
                //                        .attr("id", "craft2")
                //                        .attr("x",sat_coord[0])
                //                        .attr("y",sat_coord[1]-15)
                //                        .attr("width",30)
                //                        .attr("height",30)
                //                        .append("svg:title").text("Audacy 2");
                //     }

                // } else if(vehs[i] === "Audacy3" && $scope.widget.settings.contents[i].contents[1].value === 'Audacy3'){
                //     if(orbits[i] === true){
                //         var route3 = g.append("path")
                //                       .datum({type: "LineString", coordinates: scH[i]})  
                //                       .attr("class", "route3")
                //                       .attr("d", path); 
                //     }
                //     if(satIcons[i] === true){
                //         var  craft3 = g.append("svg:image")
                //                        .attr("xlink:href", "./directives/groundtrack/three.svg")
                //                        .attr("id", "craft3")
                //                        .attr("x",sat_coord[0])
                //                        .attr("y",sat_coord[1]-15)
                //                        .attr("width",30)
                //                        .attr("height",30)
                //                        .append("svg:title").text("Audacy 3");
                //     }
                // }
            }
        }   
    }               
        
    function plotGsCover(coord){
        covAng = gsCoverage(satRadius, gsAng); // Coverage angle [deg]
        var gslos = svg.select('#g')
                               .append("path")
                               .datum(circle.center(coord).radius(covAng))
                               .attr("class", "gslos")
                               .attr("d", path);           
    };   

    // Ground station coverage area based on the sat's altitude
    function gsCoverage(r, gsAng){
        // r: radius to satellite [km]
        // gsAng: Ground station coverage angle [deg]
           
        // Temp angle
        alpha = Math.asin(rEarth*Math.sin((180-gsAng)*radians)/r);
          
        //Coverage angle from the center of Earth
        return  180 - (180-gsAng) - alpha*degrees;
    }   

    function showTooltip(d) {
        label = d.properties.name;
        var mouse = d3Service.mouse(svg.node())
                      .map( function(d) { return parseInt(d); } );
        tooltip.classed("hidden", false)
               .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
               .html(label);
    }

    function selected() {
        d3Service.select('.selected').classed('selected', false);
        d3Service.select(this).classed('selected', true);
    }
        

    function plotgs(coord,name){
            var gs_coord = projGround(coord);   //convert to px
            var gs = svg.select("#g")
                        .append("svg:image")
                        .attr("xlink:href", "./directives/groundtrack/aud_target_02_orange.svg")
                        .attr("id", "gs")
                        .attr("x",gs_coord[0]-10)
                        .attr("y",gs_coord[1]-16)
                        .attr("width",30)
                        .attr("height",30)
                        .append("svg:title").text(name);
            }
                
    function zoomed(){
        g.attr("transform", d3Service.event.transform);
    };

    $scope.showCoverage = function(checkedVal){
            if(checkedVal === true){
                 g.selectAll("path.gslos").remove();
                for (j=0; j<gs.length;j++) {
                    plotGsCover(station[j]);      

                }
            }else{
                g.selectAll("path.gslos").remove();
            }

     }
  

    //d3Service.select(self.frameElement).style("height", height + "px");
                
    function projGround(d){
        return projection(d);
    }; 

    function antipode(position) {
        return [position[0] + 180, -position[1]];
    }

    function solarPosition(time) {
        var centuries = (time - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525, // since J2000
            longitude = (d3Service.utcDay.floor(time) - time) / 864e5 * 360 - 180;
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
});

