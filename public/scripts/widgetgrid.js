    
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
      
              // function to remove widget from the grid layout
              this.removeWid = function(e){
              //console.log(e.target.closest("div"));
              e.target.closest("div").remove();
              }
      
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
                $('#save-grid').click(this.saveGrid); // event handler for saving grid
                $('#load-grid').click(this.loadGrid); //event handler for loading grid
                $('#clear-grid').click(this.clearGrid);// event handler for clearing the grid
            };
        });