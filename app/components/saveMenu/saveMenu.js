app
.component('saveMenu', {
	bindings: {
    	widget: '='
    },
    templateUrl: "../components/saveMenu/save.html",
    controller: function(gridService){
    	var vm = this;

		vm.closeSaveLoadSettings = function(widget){
			widget.main = true;
			widget.settings = false;
			widget.saveLoad = false;
			widget.delete = false;
		}
    }
})