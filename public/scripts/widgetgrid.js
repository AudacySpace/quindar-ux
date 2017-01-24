
var counter=0; 
var gcount =0; 
var pcounter =0;
var intervalId;
$(function () {
  var options = {
    verticalMargin:25

  };
  var usermail = document.getElementById('usermail').innerHTML;

  $('.grid-stack').gridstack(options);


  new function () {
    this.serializedData = [
    {x: 0, y: 0, width: 4, height: 2},
    {x: 4, y: 0, width: 4, height: 4},
    {x: 8, y: 0, width: 2, height: 2},
    ];

    this.grid = $('.grid-stack').data('gridstack');

              // function to add widget to the grid layout 
              this.add = function(){
                this.grid.addWidget($('<div class="panel panel-primary" id="plainwidget'+pcounter+'"><div class="grid-stack-item-content panel-heading" /><button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
                  +'</button><div/>'),0,0,2,2);
                $(document).on('click', '#removespan', function(e) {
                  console.log("widget deleted");
                  e.target.closest("div").remove();
                });
              }.bind(this);


			  // function to add ground track widget to the grid layout
        this.addGround = function(){
          gcount++;
          var parameters = {collectionName : "position"};
                var delay = 1000;	// milliseconds
                var sc = ["Audacy1", "Audacy2", "Audacy3"];		

				// Initialize scHolder
				var scHolder={}
				for (j=0; j<sc.length;j++) {
          scHolder[j] = [[0.,0.]];
          scHolder[j].pop();
        }

        $('.grid-stack').data('gridstack').addWidget($(
         '<div class="panel panel-primary widgetgrid" style="margin-bottom:0;" id="divtable'+gcount+'">\
         <div class="grid-stack-item-content panel-heading" id="gtpanel'+gcount+'" />\
         <button type="button" class="plotbutton" id="plotbutton'+gcount+'">PLOT</button>\
         <button type="button" class="glyphicon glyphicon-cog" id="settings" onclick="openPlotSettings('+gcount+')"></button><div style="display:none" id="plot-settings-menu'+gcount+'" class="settings-menu"><button type="button" class="glyphicon glyphicon-edit" data-toggle="modal" data-target="#myGTModalNorm"></button><button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan"></button></div>\
         <div class="svg-container" id="divplot'+gcount+'"></div><div/>'),0,0,6,5);

        var projection = d3.geoEquirectangular();

        var path = d3.geoPath()
        .projection(projection);
        var graticule = d3.geoGraticule();
        var svg = d3.select("#divplot"+gcount).append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-50 -50 1100 600")
        .classed("svg-content", true);
        var g = svg.append("g");
        g.attr("id","g"+gcount);

        		// Plot world map
        		d3.json("/media/icons/world-110m.json", function(error, world) {
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
        });				

				// Go back to original view						
        		//$('#homebutton'+gcount).click(function(){
			    //  zoom.scaleTo(svg,1);
        		//});

                // Plot data when PLOT button is clicked and keep updating						
                $('#plotbutton'+gcount).click(function(){
                  timer = setInterval(updatePlot, delay);
                });

        		// Function to update data to be plotted
        		function updatePlot() {
              $.ajax({  
                url: "/getposition",
                type: 'GET',
                data: parameters,
                success: function(res) {

        			  // -- Find latest data for each spacecraft --				  
        		      // Initialize latestdata
                 var latestdata = null;

                 latestdata = res[0];      				 

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
        				//console.log(longitude,latitude)

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
                      //-------------------------------------------//
                    }					  
                  });
            }

            var zoom = d3.zoom()
            .scaleExtent([.1,10])
            .on("zoom",zoomed);

            svg.call(zoom);

            function zoomed(){
             g.attr("transform", d3.event.transform);
           };

           function projGround(d){
             return projection(d);
           }; 

           $('.close').click(this.removeWid);

           $(document).on('click', '#removespan', function(e) {
            e.target.closest("div").parentElement.remove();
          });

         }.bind(this);



         this.tableWidget = function(){
          var rows='';
          var width = $(window).width();
          counter++;
          for(var i=2;i<12;i++){
            rows += '<tr class="content"><th id="categoryID'+i+counter+'" class="categorycontent"></th><td id="ID'+i+counter+'"></td><td id="name'+i+counter+'"></td><td id="alow'+i+counter+'"></td><td id="wlow'+i+counter+'"></td><td id="value'+i+counter+'"></td><td id="whigh'+i+counter+'"></td><td id="ahigh'+i+counter+'"></td><td id="units'+i+counter+'"></td><td id="notes'+i+counter+'"></td></tr></tbody>';
          }
          if(width<=1280){
              // data-gs-min-width="10" data-gs-min-height="7.8" data-gs-max-height="8"
              griddata = '<div class="row"><div class="panel panel-primary widgetgrid grid-stack-item-content" data-gs-min-width="10" data-gs-min-height="7" id="tabletextqwidget'+counter+'"><div class="panel-heading" id="paneldiv'+counter+'"></div><table id="table_format" class="table table-bordered table-inverse">'
              +'<thead><tr><th id="category'+counter+'">'
              +'</th>'
              +'<th id="id'+counter+'"></th><th id="name'+counter+'"></th><th id="alarm_low'+counter+'"></th><th id="warn_low'+counter+'"></th><th id="value'+counter+'"></th><th id="warn_high'+counter+'"></th>'
              +'<th id="alarm_high'+counter+'"></th> <th id="units'+counter+'"></th><th id="notes'+counter+'"></th></tr></thead>'
              +' <tbody>'
              + rows
              +'</table>'
              +'<button type="button" class="glyphicon glyphicon-th" id="data-menu" onclick="openLeftNav()">'
              +'</button>'
              +'<button type="button" class="glyphicon glyphicon-cog" id="settings" onclick="openSettings('+counter+')">'
              +'</button>'
              +'<div style="display:none" id="settings-menu'+counter+'" class="settings-menu">'
              +'<button type="button" class="glyphicon glyphicon-edit" data-toggle="modal" data-target="#myModalNorm">'
              +'</button>'
              +'<button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
              +'</button>'
              +'</div>'
              +'</div>';
              $('.grid-stack').data('gridstack').addWidget($(griddata),0,0,0,0);
              $(document).on('click', '#removespan', function(e) {
                console.log("table widget deleted");
                console.log(e.target.closest("div").parentElement.remove());

              });

            }
            else {
              //data-gs-min-width="6" data-gs-min-height="5.5" data-gs-max-height="6"
              griddata = '<div class="row"><div class="panel panel-primary widgetgrid grid-stack-item-content" data-gs-min-width="6" data-gs-min-height="5.5" id="tabletextqwidget'+counter+'"><div class="panel-heading" id="paneldiv'+counter+'"></div><table id="table_format" class="table table-bordered table-inverse">'
              +'<thead><tr><th id="category'+counter+'">'
              +'</th>'
              +'<th id="id'+counter+'"></th><th id="name'+counter+'"></th><th id="alarm_low'+counter+'"></th><th id="warn_low'+counter+'"></th><th id="value'+counter+'"></th><th id="warn_high'+counter+'"></th>'
              +'<th id="alarm_high'+counter+'"></th> <th id="units'+counter+'"></th><th id="notes'+counter+'"></th></tr></thead>'
              +' <tbody>'
              + rows
              +'</table>'
              +'<button type="button" class="glyphicon glyphicon-th" id="data-menu" onclick="openLeftNav()">'
              +'</button>'
              +'<button type="button" class="glyphicon glyphicon-cog" id="settings" onclick="openSettings('+counter+')">'
              +'</button>'
              +'<div style="display:none" id="settings-menu'+counter+'" class="settings-menu">'
              +'<button type="button" class="glyphicon glyphicon-edit" data-toggle="modal" data-target="#myModalNorm">'
              +'</button>'
              +'<button type="button" class="glyphicon glyphicon-trash" aria-label="Close" id="removespan">'
              +'</button>'
              +'</div>'
              +'</div>';
              $('.grid-stack').data('gridstack').addWidget($(griddata),0,0,0,0);
              $(document).on('click', '#removespan', function(e) {
                console.log("table widget deleted");
                console.log(e.target.closest("div").parentElement.remove());

              });

            }

            var parameters = {collectionName : "position"};
            //var intervalID = 'Interval'+counter;
             intervalID = setInterval(function(){

            // (function pullTelemetryData() {
              $.ajax({
                url: "/addtablewidget",
                type: 'GET',
                data: parameters,
                success: function (data) {
                  var size = Object.keys(data).length;
                  var datasize = size-2;
                  var obj = Object.keys(data)[2];
                  var arr = [];
                  var categories = [];
                  var uniqueNames = [];
                  var stringvalue = '';

                  // console.log(data);

                  for(var k in data.v){
                    arr.push(k);
                  }
                  arr.splice(1, 0, "id");
                  try{
                    for(var i=0;i<arr.length;i++){
                        document.getElementById(arr[i]+counter).innerHTML = arr[i].toUpperCase();
                    }
                  

                  for(var c=1;c<=counter;c++){
                    for(var i=2;i<size;i++){
                      document.getElementById("categoryID"+i+c).innerHTML = data[Object.keys(data)[i]].category;
                      document.getElementById("ID"+i+c).innerHTML = Object.keys(data)[i];
                      document.getElementById("name"+i+c).innerHTML = data[Object.keys(data)[i]].name;
                      document.getElementById("units"+i+c).innerHTML = data[Object.keys(data)[i]].units;
                      document.getElementById("notes"+i+c).innerHTML = data[Object.keys(data)[i]].notes;

                    //Values of telemetry data
                    if(typeof data[Object.keys(data)[i]].value === "number"){
                      document.getElementById("value"+i+c).innerHTML = Math.round(data[Object.keys(data)[i]].value * 100)/100;
                    }
                    else if(Date.parse(data[Object.keys(data)[i]].value)){
                      var date = new Date(data[Object.keys(data)[i]].value);
                      document.getElementById("value"+i+c).innerHTML = date.toUTCString();
                    }
                    else {
                     document.getElementById("value"+i+c).innerHTML = data[Object.keys(data)[i]].value;
                   }

                    //timestamp alarm low

                    if(typeof data[Object.keys(data)[i]].alarm_low === "number"){
                      document.getElementById("alow"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_low;
                    }
                    else if(Date.parse(data[Object.keys(data)[i]].alarm_low)){
                      var date = new Date(data[Object.keys(data)[i]].alarm_low);
                      document.getElementById("alow"+i+c).innerHTML= date.toUTCString();

                    }
                    else {
                     document.getElementById("alow"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_low;
                   }

                    //timestamp warn low
                    if(typeof data[Object.keys(data)[i]].warn_low === "number"){
                     document.getElementById("wlow"+i+c).innerHTML = data[Object.keys(data)[i]].warn_low;
                   }
                   else if(Date.parse(data[Object.keys(data)[i]].warn_low) ){
                     var date = new Date(data[Object.keys(data)[i]].warn_low);
                     document.getElementById("wlow"+i+c).innerHTML = date.toUTCString();
                   }
                   else{
                     document.getElementById("wlow"+i+c).innerHTML = data[Object.keys(data)[i]].warn_low;
                   }

                    //timestamp alarm high
                    if(typeof data[Object.keys(data)[i]].alarm_high === "number"){
                      document.getElementById("ahigh"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_high;
                    }
                    else if(Date.parse(data[Object.keys(data)[i]].alarm_high) ){
                     var date = new Date(data[Object.keys(data)[i]].alarm_high);
                     document.getElementById("ahigh"+i+c).innerHTML= date.toUTCString();
                   }
                   else{
                     document.getElementById("ahigh"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_high;
                   }

                  //timestamp warn high
                  if(typeof data[Object.keys(data)[i]].warn_high === "number"){
                    document.getElementById("whigh"+i+c).innerHTML = data[Object.keys(data)[i]].warn_high;
                  }

                  else if(Date.parse(data[Object.keys(data)[i]].warn_high) ){
                    var date = new Date(data[Object.keys(data)[i]].warn_high);
                    document.getElementById("whigh"+i+c).innerHTML= date.toUTCString();

                  }
                  else{
                   document.getElementById("whigh"+i+c).innerHTML = data[Object.keys(data)[i]].warn_high;
                 } 
               }
             }
           }
           
           catch(e){

           }
         }
       });
 }, 1000);
}.bind(this);


              //function to remove widget from the widget
              this.removeWid = function(e){
                console.log("hello");
                console.log(e.target.closest("div"));
                e.target.closest("div").remove();
              }.bind(this);


              //function to load Grid from the Quindar database
              this.loadGrid = function (addWidget) {
                var p=0;
                this.grid.removeAll();

                var parameters = {collectionName : "layouts" , emailaddress : usermail};
                var id = [];
                var rows = '';
                var count = 0;
                $.ajax({
                  url: "/loadlayout",
                  type: 'GET',
                  data: parameters,
                  success: function(res) {
                    console.log(res);
                    console.log(typeof(res));
                    var items = GridStackUI.Utils.sort(res);
                    console.log(items);
                    _.each(items, function (node) {
              // console.log(node.id);
              id.push(node.id);

              count = node.counter;
              gcounter = node.gcount;
              pcount = node.pcounter;
              if(node.id.search('plainwidget') !== -1){

                $('.grid-stack').data('gridstack').addWidget($('<div class="panel panel-primary" ><div class="grid-stack-item-content panel-heading"></div><button type="button" class="close" aria-label="Close" id="removewidget"><span aria-hidden="true" id="removespan">&times;</span></button><div/>'),
                  node.x, node.y, node.width, node.height);

                $(document).on('click', 'span', function(e) {
                // console.log("hey");
                e.target.closest("div").remove();
              });

              }

              if(node.id.search('tabletextqwidget') !== -1){
                for(var c=1;c<=count;c++){
                 for(var i=2;i<12;i++){
                  rows += '<tr><th id="categoryID'+i+c+'"></th><td id="ID'+i+c+'"></td><td id="name'+i+c+'"></td><td id="alow'+i+c+'"></td><td id="wlow'+i+c+'"></td><td id="value'+i+c+'"></td><td id="whigh'+i+c+'"></td><td id="ahigh'+i+c+'"></td><td id="units'+i+c+'"></td><td id="notes'+i+c+'"></td></tr></tbody>';
                }


                 // if(width<=1280){
                  griddata = '<div class="panel panel-primary" data-gs-min-width="10" data-gs-min-height="7.8" data-gs-max-height="8" id="tabletextqwidget'+c+'" ><div class="panel-heading grid-stack-item-content">Table Text Qwidget '+c +'</div><table class="table table-bordered table-inverse"><thead><tr><th id="category'+c+'"></th>'
                  +'<th id="id'+c+'"></th><th id="name'+c+'"></th><th id="alarm_low'+c+'"></th><th id="warn_low'+c+'"></th><th id="value'+c+'"></th><th id="warn_high'+c+'"></th>'
                  +'<th id="alarm_high'+c+'"></th> <th id="units'+c+'"></th><th id="notes'+c+'"></th></tr></thead>'
                  +' <tbody>'
                  + rows
                  +'</table>'
                  +'<button type="button" class="close" aria-label="Close" id="removewidget" ><span aria-hidden="true" id="removespan">&times;</span></button><div/>';

                  $('.grid-stack').data('gridstack').addWidget($(griddata),node.x,node.y,node.width,node.height);
                  $(document).on('click', 'span', function(e) {
                    console.log("table widget deleted");
                    console.log(e.target.id);
                    e.target.closest("div").remove();

                  });
                }
              }

              if(node.id.search('divtable') !== -1){


                var parameters = {collectionName : "position"};
                var delay = 1000; // milliseconds
                var sc = ["Audacy1", "Audacy2", "Audacy3"];   

        // Initialize scHolder
        var scHolder={}
        for (j=0; j<sc.length;j++) {
          scHolder[j] = [[0.,0.]];
          scHolder[j].pop();
        }

        $('.grid-stack').data('gridstack').addWidget($(
          '<div class="panel panel-primary" style="margin-bottom:0;" id="divtable'+gcount+'">\
          <div class="grid-stack-item-content panel-heading" />\
          <button type="button" class="plotbutton" id="plotbutton'+gcount+'">PLOT</button>\
          <button type="button" class="close" aria-label="Close" id="removewidget" ><span aria-hidden="true" id="removespan">&times;</span></button>\
          <div class="svg-container" id="divplot'+gcount+'"></div><div/>'),0,0,6,5);

        var projection = d3.geoEquirectangular()
        .precision(.1);  ;   
        var path = d3.geoPath()
        .projection(projection);
        var graticule = d3.geoGraticule();
        var svg = d3.select("#divplot"+gcount).append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-50 -50 1100 600")
        .classed("svg-content", true);
        var g = svg.append("g");
        g.attr("id","g"+gcount);

            // Plot world map
            d3.json("/media/icons/world-110m.json", function(error, world) {
              if (error) throw error; 
              g.insert("path", ".graticule")
              .datum(topojson.feature(world, world.objects.land))
              .attr("class", "land")
              .attr("d", path);  

              g.append("path")
              .datum(graticule)
              .attr("d", path)
              .attr("class","graticule");          
            });       

                // Plot data when PLOT button is clicked and keep updating            
                $('#plotbutton'+gcount).click(function(){
                  timer = setInterval(updatePlot, delay);
                });

            // Function to update data to be plotted
            function updatePlot() {
              $.ajax({  
                url: "/getposition",
                type: 'GET',
                data: parameters,
                success: function(res) {

                // -- Find latest data for each spacecraft --         
                  // Initialize latestdata
                  var latestdata = null;

                  latestdata = res[0];               

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
                //console.log(longitude,latitude)

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
                      //-------------------------------------------//
                    }           
                  });
            }

            var zoom = d3.zoom()
            .scaleExtent([.1,10])
            .on("zoom",zoomed);

            g.call(zoom);

            function zoomed(){
              var transform = d3.zoomTransform(this);
              d3.select("#"+g.attr("id"))
              .attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
            };

            function projGround(d){
              return projection(d);
            }; 

            $('.close').click(this.removeWid);
            $(document).on('click', 'span', function(e) {
              e.target.closest("div").remove();
            });

          }

        }, this);
}
});

var parameter = {collectionName : "position"};
var loadID = setInterval(function(){
  $.ajax({
    url: "/addtablewidget",
    type: 'GET',
    data: parameter,
    success: function (data) {
      var size = Object.keys(data).length;
      var datasize = size-2;
      var obj = Object.keys(data)[2];
      var arr = [];
      console.log(data);

      for(var k in data.v){
        arr.push(k);
      }
      arr.splice(1, 0, "id");
      try{
        for(var c=1;c<=count;c++){  
          for(var i=0;i<arr.length;i++){
            document.getElementById(arr[i]+c).innerHTML = arr[i].toUpperCase();

          }


                // for(var c=1;c<=count;c++){
                  for(var i=2;i<size;i++){
                    document.getElementById("categoryID"+i+c).innerHTML = data[Object.keys(data)[i]].category;
                    document.getElementById("ID"+i+c).innerHTML = Object.keys(data)[i];
                    document.getElementById("name"+i+c).innerHTML = data[Object.keys(data)[i]].name;
                    document.getElementById("units"+i+c).innerHTML = data[Object.keys(data)[i]].units;
                    document.getElementById("notes"+i+c).innerHTML = data[Object.keys(data)[i]].notes;

                    //Values of telemetry data
                    if(typeof data[Object.keys(data)[i]].value === "number"){
                      document.getElementById("value"+i+c).innerHTML = Math.round(data[Object.keys(data)[i]].value * 100)/100;
                    }
                    else if(Date.parse(data[Object.keys(data)[i]].value)){
                      var date = new Date(data[Object.keys(data)[i]].value);
                      document.getElementById("value"+i+c).innerHTML = date.toUTCString();
                    }
                    else {
                     document.getElementById("value"+i+c).innerHTML = data[Object.keys(data)[i]].value;
                   }

                    //timestamp alarm low

                    if(typeof data[Object.keys(data)[i]].alarm_low === "number"){
                      document.getElementById("alow"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_low;
                    }
                    else if(Date.parse(data[Object.keys(data)[i]].alarm_low)){
                      var date = new Date(data[Object.keys(data)[i]].alarm_low);
                      document.getElementById("alow"+i+c).innerHTML= date.toUTCString();

                    }
                    else {
                     document.getElementById("alow"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_low;
                   }

                    //timestamp warn low
                    if(typeof data[Object.keys(data)[i]].warn_low === "number"){
                     document.getElementById("wlow"+i+c).innerHTML = data[Object.keys(data)[i]].warn_low;
                   }
                   else if(Date.parse(data[Object.keys(data)[i]].warn_low) ){
                     var date = new Date(data[Object.keys(data)[i]].warn_low);
                     document.getElementById("wlow"+i+c).innerHTML = date.toUTCString();
                   }
                   else{
                     document.getElementById("wlow"+i+c).innerHTML = data[Object.keys(data)[i]].warn_low;
                   }

                    //timestamp alarm high
                    if(typeof data[Object.keys(data)[i]].alarm_high === "number"){
                      document.getElementById("ahigh"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_high;
                    }
                    else if(Date.parse(data[Object.keys(data)[i]].alarm_high) ){
                     var date = new Date(data[Object.keys(data)[i]].alarm_high);
                     document.getElementById("ahigh"+i+c).innerHTML= date.toUTCString();
                   }
                   else{
                     document.getElementById("ahigh"+i+c).innerHTML = data[Object.keys(data)[i]].alarm_high;
                   }

                  //timestamp warn high
                  if(typeof data[Object.keys(data)[i]].warn_high === "number"){
                    document.getElementById("whigh"+i+c).innerHTML = data[Object.keys(data)[i]].warn_high;
                  }

                  else if(Date.parse(data[Object.keys(data)[i]].warn_high) ){
                    var date = new Date(data[Object.keys(data)[i]].warn_high);
                    document.getElementById("whigh"+i+c).innerHTML= date.toUTCString();

                  }
                  else{
                   document.getElementById("whigh"+i+c).innerHTML = data[Object.keys(data)[i]].warn_high;
                 } 
               }

             }      
           }
           catch(e){
           }
         }
       });
}, 1000);
}.bind(this);


              //function to save grid to the Quindar database
              this.saveGrid = function () {
                this.serializedData = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
                  el = $(el);
                  console.log(el);
                  var node = el.data('_gridstack_node');
                  console.log(typeof(node.el));
                  console.log(node);
                console.log(node.el[0].id); //el--0-attributes--[4]id--nodeValue
                return {
                  x: node.x,
                  y: node.y,
                  width: node.width,
                  height: node.height,
                  id: node.el[0].id,
                  counter: counter,
                  gcounter: gcount,
                  pcounter: pcounter
                };
              }, this);
                $('#saved-data').val(JSON.stringify(this.serializedData, null, '    '));
                console.log(this.serializedData);
                console.log(JSON.stringify(this.serializedData));
                var data1 = JSON.stringify(this.serializedData);
                var data2 = data1.replace(/["']/g, "");
                console.log("data1 :"+ data1);
                console.log("data2 :"+ data2);
                var griddata = this.serializedData;
                $.ajax({
                  url: "/savelayout",
                  type: "POST",
                  data: {emailaddress: usermail, grid: griddata} ,
                    // contentType: "application/json",  //Save does not work as expected when contentType is set
                    success:function(data) {
                      console.log("Success");
                    },
                    error:function(err){
                      console.log("Error");
                    }
                  });
                return false;
              }.bind(this);

              //function to clear grid layout from the dasboard and not from the database
              this.clearGrid = function () {
                this.grid.removeAll();
                console.log("Grid cleared");
                return false;
              }.bind(this);

              // this.addTableName = function(e){
              //   console.log("hellooooooo");
              //   console.log(e);
              // }


                $('#addwidget').click(this.add); //event handler for adding widget
                $('#addGround').click(this.addGround)
                $('#addtablewidget').click(this.tableWidget); //event handler for adding widget
                $('#save-grid').click(this.saveGrid); // event handler for saving grid
                $('#load-grid').click(this.loadGrid); //event handler for loading grid
                $('#clear-grid').click(this.clearGrid);// event handler for clearing the grid
                // $('#savebtn'+counter).click(this.addTableName);
                $('#savebtn').click(function(e){
                  console.log(e.target.parentElement);
                  document.getElementById("paneldiv"+counter).innerHTML = $('#exampleInputName').val();
                  $("#myModalNorm").modal("hide");
                  
                });

                $('#saveGTbtn').click(function(e){
                  console.log(e.target.parentElement);
                  document.getElementById("gtpanel"+gcount).innerHTML = $('#exampleGTInputName').val();
                  $("#myGTModalNorm").modal("hide");
                });


              }


            });