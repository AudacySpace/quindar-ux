app
.component('deleteMenu', {
	bindings: {
    	widget: '='
    },
    templateUrl: "../components/deleteMenu/delete.html",
    controller: function(gridService, $interval){
    	var vm = this;

		vm.deleteWidget = function(widget) {
			gridService.remove(widget);
			if(widget.stream){
				for(var i=0; i<widget.stream.length; i++){
					$interval.cancel(widget.stream[i]);
				}
			}
		};

		vm.closedeleteWidget = function(widget){
			widget.main = true;
			widget.settings.active = false;
			widget.saveLoad = false;			
			widget.delete = false;			
		}
    }
})