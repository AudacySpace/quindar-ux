app

.controller('MainController', ['$scope', '$timeout', '$interval',
	function($scope, $timeout, $interval) {
		//$scope.username = document.getElementById('username').innerHTML;
		//$scope.usermail = document.getElementById('usermail').innerHTML;
		//$scope.main = main;
		//$scope.user = googlename;
		$scope.$watch('googleuser', function () {
		    //console.log($scope.googleuser); 
		    $scope.name = JSON.parse($scope.googleuser).name;
		    $scope.email = JSON.parse($scope.googleuser).email;
		});
		
		// user.success(function(data) { 
		// 	console.log(data);
		// 	$scope.fiveDay = data; 
		// });
		this.start = function(){
			console.log("Hello all");
			
			//invoke initialy
	   		startTime();
	   		console.log(this.clock);
			//init();
		};

		function init(){
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
    	};

    	function startTime() {
    		var today = new Date();
      		var start = new Date(today.getUTCFullYear(), 0, 0);
      		var diff = today - start;
      		var h = today.getUTCHours();
      		var m = today.getUTCMinutes();
      		var s = today.getUTCSeconds();
      		var days = Math.floor(diff/(1000*60*60*24));
      		h = checkTime(h);
      		m = checkTime(m);
      		s = checkTime(s);
      		$scope.clock = days + "." + h + ":" + m + ":" + s + " " + "UTC";
    	}

    	function checkTime(i) {
        	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        	return i;
      	}

		var theInterval = $interval(function(){
	    	startTime();
	    	//init();
	   	}.bind(this), 1000);    

	    $scope.$on('$destroy', function () {
	        $interval.cancel(theInterval)
	    });


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

.controller('DashboardCtrl', ['$scope',
	function($scope) {
		$scope.icons = [
		    {
		    	image:"/media/icons/status_icons-05.png",
		    	id: "i5"
		    },
		    {
		    	image:"/media/icons/status_icons-06.png",
		    	id: "i6"
		    },
		    {
		    	image:"/media/icons/status_icons-07.png",
		    	id: "i7"
		    },
		    {
		    	image:"/media/icons/status_icons-08.png",
		    	id:"i8"
		    }
	    ];
	}
])

.controller("ChildCtrl", [ '$scope', function($scope){
    // Nothing defined on $scope
}])

// .component('Hello', {
//   controller: function() {
//     this.clock = "Hello";
// }
// })


