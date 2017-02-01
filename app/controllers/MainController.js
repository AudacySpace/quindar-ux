angular.module('app', [])

.controller('MainController', ['$scope', '$timeout',
	function($scope, $timeout) {
		$scope.username = document.getElementById('username').innerHTML;
		$scope.usermail = document.getElementById('usermail').innerHTML;
		//console.log($scope.username);

		$scope.start = function(){
			console.log("Hello all");
			$scope.init();
		}

		$scope.init = function(){
    		$.ajax({  
    			url: "/getTelemetry",
    			type: 'GET',
    			data: {'vehicles' : ['Audacy1', 'Audacy2', 'Audacy3']},
    			success: function(data) {
                    for( var item in data ){
                        //QUINDAR.telemetry[item] = data[item];
                        console.log(data[item]);
                    }
    			}
    		});
    	}
	}
])

.controller('LeftSidebarCtrl', ['$scope', '$timeout',
	function($scope, $timeout) {
		$scope.menuitems = [ "Realtime Telemetry",
		"Satellite Subsystems",
		"Satellite Imagery",
		"Atmosphere Pressure"
		]
	}
])