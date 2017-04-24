app
.directive('model', function() {
  	return { 
    	restrict: 'E',
		scope: {
			modelUrl: "=modelUrl",
			widget: "=widget"
		},
		controller: 'SatelliteCtrl'
  	}; 
});

app
.controller('SatelliteCtrl',function ($scope, $element, dashboardService) {
	var container = $element.parent()[0];
	var width = $(container).width();
	var height = $(container).height();
	var aspect = width/height;
	var near = 1;
	var far = 1000;
	var angle = 45;
	var previous;
	var loader = new THREE.AssimpJSONLoader();
	var telemetry = dashboardService.telemetry;
	
	$scope.widget.settings.quaternion = new Object();

	var createRenderer = function(){
    	var renderer =  new THREE.WebGLRenderer();
	    renderer.setSize(width,height);
	    renderer.setClearColor( 0xffffff, 1 );
	    return renderer;
	}

	var createCamera = function(){
	    var camera = new THREE.PerspectiveCamera(angle, aspect, near, far);    
	    camera.position.set( 8, 8, 8 );
	    camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	    return camera;
	}

	var createScene = function(){
	    var scene = new THREE.Scene();
	    return scene;
	}

	var createLight = function(){
	    var light = new THREE.PointLight(0xbfbfbf);
	    light.position.x=0;
	    light.position.y=0;
	    light.position.z=300;
	    return light;
	}
	
	function loadModel(modelUrl) {
		loader.load(modelUrl, function (assimpjson) {
			assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 0.8;
			assimpjson.updateMatrix();
			if (previous) $scope.scene.remove(previous);
			$scope.scene.add(assimpjson);

			previous = assimpjson;
			$scope.cube = assimpjson;
		});
	}

	// Earth Centered Earth Fixed to Earth Centered Inertial
	var ECEF2ECI = function(){

		// Calculat Greenwich Mean Sidereal Time //		
		var time = new Date(telemetry[$scope.widget.settings.vehicle].timestamp.value);// Local time
		
		var jd = date2JulianDate(time);	// Julian date UTC
		var jdcJ2000 = (jd - 2451545.0)/36525.0;	//Julian centuries since epoch J2000

		// Calculate Greenwich Mean Sidereal Time in seconds
		var tGmstSec = 67310.54841 + (876600*3600+8640184.812866)*jdcJ2000 +
			0.093104*Math.pow(jdcJ2000,2) - 6.2*Math.pow(10,-6)*Math.pow(jdcJ2000,3);
		
		// Convert to rad (1 sec =  1/240 deg)
		var tGmstDeg = (tGmstSec % 86400)/240;
		var tGmstRad = tGmstDeg*Math.PI/180;

		// Transformation matrix
		var mat = [ [Math.cos(-tGmstRad), Math.sin(-tGmstRad), 0.0], [-Math.sin(-tGmstRad), Math.cos(-tGmstRad), 0.0],
		[0.0, 0.0, 1.0] ];

		$scope.xECI = mat[0][0]*$scope.posX + mat[0][1]*$scope.posY + mat[0][2]*$scope.posZ;
		$scope.yECI = mat[1][0]*$scope.posX + mat[1][1]*$scope.posY + mat[1][2]*$scope.posZ;
		$scope.zECI = mat[2][0]*$scope.posX + mat[2][1]*$scope.posY + mat[2][2]*$scope.posZ;

	}
	
	// Convert date to Julian date: 1900-2100
	function date2JulianDate(d){
		var yr=d.getUTCFullYear();
		var mo=d.getUTCMonth()+1;
		var day=d.getUTCDate();
		var hr=d.getUTCHours();
		var min=d.getUTCMinutes();
		var sec=d.getUTCSeconds();
		var a = 7*(yr+Math.floor((mo+9)/12));
		var b = (sec/60+min)/60 + hr;
		
		var JDN = 367*yr - Math.floor(a/4) + Math.floor(275*mo/9) + day + 1721013.5 + b/24;
		return JDN;
	}

	var render = function(){
		requestAnimationFrame(render);
		if($scope.cube && $scope.widget.settings.vehicle){
					
			//set quaternion values for rotation
			$scope.cube.quaternion.x = telemetry[$scope.widget.settings.vehicle].q1.value;
			$scope.cube.quaternion.y = telemetry[$scope.widget.settings.vehicle].q2.value;
			$scope.cube.quaternion.z = telemetry[$scope.widget.settings.vehicle].q3.value;
			$scope.cube.quaternion.w = telemetry[$scope.widget.settings.vehicle].qc.value;

			//set quaternion values for displaying on widget
			$scope.widget.settings.quaternion.q1 = telemetry[$scope.widget.settings.vehicle].q1.value.toFixed(4);
			$scope.widget.settings.quaternion.q2 = telemetry[$scope.widget.settings.vehicle].q2.value.toFixed(4);
			$scope.widget.settings.quaternion.q3 = telemetry[$scope.widget.settings.vehicle].q3.value.toFixed(4);
			$scope.widget.settings.quaternion.qc = telemetry[$scope.widget.settings.vehicle].qc.value.toFixed(4);
			
			// set direction to Earth
			$scope.posX = telemetry[$scope.widget.settings.vehicle].x.value;
			$scope.posY = telemetry[$scope.widget.settings.vehicle].y.value;
			$scope.posZ = telemetry[$scope.widget.settings.vehicle].z.value;

			//Calculate time
			ECEF2ECI();
	 	}
	
	 	$scope.camera.fov = fov * $scope.widget.settings.zoom;
	 	$scope.camera.updateProjectionMatrix();
	   	$scope.renderer.render($scope.scene,$scope.camera);

 		var dir = new THREE.Vector3(-$scope.xECI, -$scope.yECI, -$scope.zECI);

		//normalize the direction vector (convert to vector of length 1)
		dir.normalize();

		$scope.arrowHelper.setDirection(dir);
		
	}

	$scope.cube = new THREE.Object3D();
	$scope.scene = createScene();
	$scope.camera = createCamera();
	var fov = $scope.camera.fov;
	$scope.light = createLight();
	$scope.renderer = createRenderer();

	$scope.scene.add($scope.light);
	loadModel($scope.modelUrl);
	$scope.scene.add($scope.cube);
	$scope.scene.add(new THREE.AxisHelper(100));
	$scope.scene.add(new THREE.GridHelper(100,2));

	// Add an arrow //
	var dir = new THREE.Vector3( 1, 1, 0 );

	//normalize the direction vector (convert to vector of length 1)
	dir.normalize();

	var origin = new THREE.Vector3( 0, 0, 0 );
	var arrowLength = 10;
	var hex = 0x111950;

	$scope.arrowHelper = new THREE.ArrowHelper( dir, origin, arrowLength, hex );
	$scope.scene.add($scope.arrowHelper)
	
	// End add an arrow //
	
	render();	
	container.appendChild($scope.renderer.domElement);

	$scope.$watch(
		function () { 
			return {
				width: $element.parent()[0].clientWidth,
			    height: $element.parent()[0].clientHeight,
			}
		},
		function (size) {
			$scope.renderer.setSize(size.width, size.height);
			$scope.camera.aspect = size.width / size.height;
			$scope.camera.updateProjectionMatrix();
		}, //listener 
		true //deep watch
	);

	$scope.$watch("modelUrl", function(newValue, oldValue) {
		if (newValue != oldValue) loadModel(newValue);
	});
})
