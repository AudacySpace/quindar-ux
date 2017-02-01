angular.module('app', [])

.controller('LeftSidebarCtrl', ['$scope', '$timeout',
	function($scope, $timeout) {
		$scope.menuitems = [ "Realtime Telemetry",
		"Satellite Subsystems",
		"Satellite Imagery",
		"Atmosphere Pressure"
		]
	}
])