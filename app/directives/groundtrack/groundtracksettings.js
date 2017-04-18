app.directive('groundtracksettings', function() { 
  	return { 
    	restrict: 'EA', 
		templateUrl:'./directives/groundtrack/groundtracksettings.html',
		controller: function($scope,$element) {  

            var contents = $scope.widget.settings.contents;
            //Table row and column structure
            $scope.gttable = {"rows":{"data":contents}};

			$scope.closeWidget = function(widget){
	            widget.main = true;
	            widget.settings.active = false;
	            widget.saveLoad = false;
	            widget.delete = false;
	        }
            $scope.saveWidget = function(widget){
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;

                while(widget.settings.vehName.length > 0) {
                    widget.settings.vehName.pop();
                }

                while(widget.settings.orbitHolder.length > 0) {
                    widget.settings.orbitHolder.pop();
                }

                while(widget.settings.iconHolder.length > 0) {
                    widget.settings.iconHolder.pop();
                }

                while(widget.settings.dataHolder.length > 0) {
                    widget.settings.dataHolder.pop();
                }
                
                for(var i=0;i<3;i++){
                //     try{
                //     if(widget.settings.contents[i].status[2] === true && widget.settings.contents[i].status[3] === true && widget.settings.contents[i].status[4] === true){
                //         widget.settings.vehName.push(widget.settings.contents[i].contents[1].value);
                //     }
                //     else if(widget.settings.contents[i].status[2] === true && widget.settings.contents[i].status[3] === false && widget.settings.contents[i].status[4] === true){
                //         console.log("orbit of Audacy"+i+" are disabled ");
                //         widget.settings.vehName = "";
                //     }
                //     else if(widget.settings.contents[i].status[2] === true && widget.settings.contents[i].status[3] === true && widget.settings.contents[i].status[4] === false){
                //         console.log("icon of Audacy"+i+" is disabled ");
                //         widget.settings.vehName = "";
                //     }
                //     else if(widget.settings.contents[i].status[2] === false && widget.settings.contents[i].status[3] === false && widget.settings.contents[i].status[4] === false){
                //         console.log("Data,orbit and icon of Audacy"+i+" are disabled ");
                //         widget.settings.vehName = "";
                //     }
                // }
                // catch(e){
                //     console.log(e instanceof TypeError);
                // }
                try{
                    if(widget.settings.contents[i].status[2] === true){
                        widget.settings.vehName.push(widget.settings.contents[i].contents[1].value);
                        widget.settings.dataHolder.push(widget.settings.contents[i].status[2]);
                        widget.settings.orbitHolder.push(widget.settings.contents[i].status[3]);
                        widget.settings.iconHolder.push(widget.settings.contents[i].status[4]);
                    }
                }
                catch(e){
                    console.log(e instanceof TypeError);
                }
                }

                for (j=0; j< widget.settings.vehName.length;j++) {
                widget.settings.scHolder[j] = [[0.,0.]];
                widget.settings.scHolder[j].pop();
                widget.settings.scStates[j] = [[0.,0.,0.]];
                widget.settings.scStates[j].pop();

            }; 
            }
		}
	}
});