app.directive('groundtracksettings', function() { 
  	return { 
    	restrict: 'EA', 
		templateUrl:'./directives/groundtrack/groundtracksettings.html',
		controller: function($scope, dashboardService, $interval) {
            
            var colors = [ "#07D1EA", "#0D8DB8", "#172168", "#228B22", "#12C700", "#C6FF00" ];
            var previousSettings = angular.copy($scope.widget.settings.contents);

            createVehicles();
            
            $scope.closeWidget = function(widget){
                widget.main = true;
                widget.settings.active = false;
                widget.saveLoad = false;
                widget.delete = false;
                $scope.widget.settings.contents = previousSettings;
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
                
                for(var i=0; i<$scope.widget.settings.contents.length; i++){
                    try{
                        if(widget.settings.contents[i][2].status === true){
                            widget.settings.vehName.push({ 
                                "name" : widget.settings.contents[i][1].value,
                                "color": colors[i]
                            });
                            widget.settings.dataHolder.push(widget.settings.contents[i][2].status);
                            widget.settings.orbitHolder.push(widget.settings.contents[i][3].status);
                            widget.settings.iconHolder.push(widget.settings.contents[i][4].status);
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
                previousSettings = angular.copy($scope.widget.settings.contents);
            }

            function createVehicles(){
                var interval = $interval(function(){
                    var currentMission = dashboardService.getCurrentMission();
                    if(currentMission.missionName != ""){
                        if($scope.widget.settings.contents.length == 0){
                            dashboardService.getConfig(currentMission.missionName)
                            .then(function(response){
                                if(response.data) {
                                    var data = dashboardService.sortObject(response.data);
                                    var count = 0;
                                    for(var key in data) {
                                        if(data.hasOwnProperty(key)) {
                                            count = count+1;
                                            $scope.widget.settings.contents.push(
                                                [
                                                        {   
                                                            "value": count,
                                                            "style":"text-align:left;background-color:#fff;color:#000;font-size:13px;margin-left:2px",
                                                            "active": "false",
                                                            "cstyle":"background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                            "status": false
                                                        },
                                                        {   
                                                            "value": key,
                                                            "style":"text-align:left;background-color:#fff;color:#000;font-size:13px",
                                                            "active": "false",
                                                            "cstyle":"background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                            "status": false
                                                        },
                                                        {   
                                                            "value":"",
                                                            "style":"text-align:left;background-color:#fff;color:#000;margin-top:0px",
                                                            "active": "true",
                                                            "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                            "status": true
                                                        },
                                                        {   
                                                            "value":"",
                                                            "style":"text-align:left;background-color:#fff;color:#000",
                                                            "active": "true",
                                                            "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                            "status": true
                                                        },
                                                        {   
                                                            "value":"",
                                                            "style":"text-align:left;background-color:#fff;color:#000",
                                                            "active": "true",
                                                            "cstyle":"padding-left:0px;background-color:#fff;text-align:left;color:#000;font-size:9px",
                                                            "status": true
                                                        }
                                                ]
                                            ); 
                                        }
                                    }
                                } 
                            });
                        }
                        $interval.cancel(interval);
                    }
                }, 1000);
            }
		}
	}
});