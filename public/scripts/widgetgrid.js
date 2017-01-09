    
        $(function () {
            var options = {
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
              this.grid.addWidget($('<div class="panel panel-primary"><div class="grid-stack-item-content panel-heading" /><button type="button" class="close" aria-label="Close" id="removewidget" ><span aria-hidden="true" id="removespan">&times;</span></button><div/>'),0,0,2,2);
              $('.close').click(this.removeWid);
              }.bind(this);

			  // function to add ground track widget to the grid layout
              this.addGround = function(){
				
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
			          '<div class="panel panel-primary" style="margin-bottom:0;">\
				        <div class="grid-stack-item-content panel-heading" />\
				        <button id="plotspan">PLOT</button>\
						<button type="button" class="close" aria-label="Close" id="removewidget" ><span aria-hidden="true" id="removespan">&times;</span></button>\
				        <p class="ground-widget"></p>\
				<div/>'),0,0,6,5);
                
				var width = 550;
				var height = 300;
				var projection = d3.geoEquirectangular()
	                           .center([0,0])
	                           .scale((width + 1) / 2 / Math.PI)
						       .translate([width/2,height/2])
                               .precision(.1);			
				var path = d3.geoPath()
						.projection(projection);
				var graticule = d3.geoGraticule();
				var svg = d3.select("p").append("svg")
						.attr("width", width)
						.attr("height", height);
				var g = svg.append("g");

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
				$('#plotspan').click(function(){
                  updatePlot();
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
					  var latestdata;
						  
					  for (j = 0; j < sc.length; j++) {
						latestdata = null;	
						var i = res.length-1;
						// Check if data is available for the selected s/c
						while (i > res.length-10) {
							  tempdata = res[i]
						  if (tempdata.vehicleId.value == sc[j]) {
								latestdata = tempdata
							    i = i - 10
						  } else {
							i-- 
						  }							  
						}
						
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
						  console.log(longitude,latitude)
						
					      // add longitude and latitude to data_plot
					      scHolder[j].push([longitude, latitude]);		

					      route = g.append("path")
                            .datum({type: "LineString", coordinates: scHolder[j]})	
                            .attr("class", "route")
                            .attr("d", path);	
						  }							
					  }
                      //-------------------------------------------//		
										
					  timer = setTimeout(updatePlot, delay);
					}
				  });
				}
					
                $('.close').click(this.removeWid);
				$(document).on('click', 'span', function(e) {
                  e.target.closest("div").remove();
                });

			  }.bind(this);
			      
              //function to load Grid from the Quindar database
              this.loadGrid = function (addWidget) {
              this.grid.removeAll();
          
              var parameters = {collectionName : "layouts" , emailaddress : usermail};
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
                      $('.grid-stack').data('gridstack').addWidget($('<div class="panel panel-primary"><div class="grid-stack-item-content panel-heading" /><button type="button" class="close" aria-label="Close" id="removewidget"><span aria-hidden="true" id="removespan">&times;</span></button><div/>'),
                            node.x, node.y, node.width, node.height);
               $('.close').click(this.removeWid);
               $(document).on('click', 'span', function(e) {
               e.target.closest("div").remove();
              });
              }, this);
              }
              });
              }.bind(this);


              //function to save grid to the Quindar database
              this.saveGrid = function () {
                this.serializedData = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
                el = $(el);
                console.log(el);
                var node = el.data('_gridstack_node');
                return {
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height, 
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
                    return false;
              }.bind(this);
        
                $('#addwidget').click(this.add); //event handler for adding widget
				$('#addGround').click(this.addGround)
                $('#save-grid').click(this.saveGrid); // event handler for saving grid
                $('#load-grid').click(this.loadGrid); //event handler for loading grid
                $('#clear-grid').click(this.clearGrid);// event handler for clearing the grid
            };
        });