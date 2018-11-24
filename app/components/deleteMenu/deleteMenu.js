app
.component('deleteMenu', {
	bindings: {
    	widget: '='
    },
    templateUrl: "../components/deleteMenu/delete.html",
    controller: function(gridService){
    	var vm = this;

		vm.deleteWidget = function(widget) {
			gridService.remove(widget);
		};

		vm.closedeleteWidget = function(widget){
			widget.main = true;
			widget.settings.active = false;
			widget.saveLoad = false;			
			widget.delete = false;			
		}
    }
})