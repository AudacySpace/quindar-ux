app.directive('samplesettings', function() { 
  	return { 
    	restrict: 'EA', 
		template: 	'<div class="savestyles">'+
   						'<form class="form-inline">'+
       						'<div class="row">'+
           						'<div class="col-sm-5">'+
               						'<label for="SampleSettings">This is a Sample Settings Page.</label>'+
           						'</div>'+
       						'</div>'+
       						'<div class="row">'+
           						'<div class="col-sm-11">'+
          						'<hr/>'+
           						'</div>'+
       						'</div>'+
       						'<div class="row">'+
           						'<div class="col-sm-11">'+
           							'<button type="submit" class="btn btn-primary sbtns" ng-click="close(widget)">CLOSE</button>'+
           						'</div>'+
       						'</div>'+
   						'</form>'+
					'</div>',
		controller: function($scope) {
			$scope.close = function(widget){
	            widget.main = true;
	            widget.settings.active = false;
	            widget.saveLoad = false;
	            widget.delete = false;
	        }
		}
	}
});