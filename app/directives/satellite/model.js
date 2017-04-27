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
.controller('SatelliteCtrl',function ($scope, $element, dashboardService, solarService) {
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
	var π = Math.PI,radians = π / 180,degrees = 180 / π;
	
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
	    camera.up = new THREE.Vector3( 0, 0, 1 );
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
	    light.position.y=300;
	    light.position.z=0;
	    return light;
	}

	var createGrid = function(){
		var radius = 100;
		var radials = 16;
		var circles = 50;
		var divisions = 64;

		var gridXY = new THREE.PolarGridHelper( radius, radials, circles, divisions, new THREE.Color( 0x989898 ), new THREE.Color( 0xbfbfbf ) );
		gridXY.rotation.x = Math.PI/2;
		return gridXY;
	}

	var createAxis = function(){
		var axis = new THREE.AxisHelper(20);
		axis.material.linewidth = 2;
		return axis;
	}

	var createArrow = function(name, hex){
		var dir = new THREE.Vector3( 1, 1, 0 );
		var origin = new THREE.Vector3( 0, 0, 0 );
		var arrowLength = 6;

		dir.normalize();
		var arrow = new THREE.ArrowHelper( dir, origin, arrowLength, hex );
		arrow.name = name;
		arrow.visible = false;
		return arrow;
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
	var ECEF2ECI = function(posX,posY,posZ){
		// Calculat Greenwich Mean Sidereal Time //		
		var time = new Date(telemetry[$scope.widget.settings.vehicle].timestamp.value);// Local time
		
		var jd = solarService.date2JulianDate(time);	// Julian date UTC
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

		xECI = mat[0][0]*posX + mat[0][1]*posY + mat[0][2]*posZ;
		yECI = mat[1][0]*posX + mat[1][1]*posY + mat[1][2]*posZ;
		zECI = mat[2][0]*posX + mat[2][1]*posY + mat[2][2]*posZ;
		
		return [xECI, yECI, zECI];
	}

	var solarCoords = function(time){
		// Sun's coordinate [longitude, latitude]
		var solCoords = solarService.solarPosition(time);
		var solLongRad = solCoords[0]*radians;
		var solLatRad = solCoords[1]*radians;

		// Sun in ECEF [x,y,z]
		var solECEF = solarService.longLat2ECEF(solLongRad,solLatRad);
		return solECEF;
	}

	var render = function(){
		requestAnimationFrame(render);
		controls.update();
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
			
			//set direction to Earth
			var posX = telemetry[$scope.widget.settings.vehicle].x.value;
			var posY = telemetry[$scope.widget.settings.vehicle].y.value;
			var posZ = telemetry[$scope.widget.settings.vehicle].z.value;

			//Transform position from ECEF to ECI
			var earthECI = ECEF2ECI(posX,posY,posZ);

			//Plot Satellite to Earth Arrow
			var dirEarth = new THREE.Vector3(-earthECI[0], -earthECI[1], -earthECI[2]);
			dirEarth.normalize();
			$scope.arrowEarth.visible = true;
			$scope.arrowEarth.setDirection(dirEarth);
			
			//Calculate direction to Sun //
			var time = new Date(telemetry[$scope.widget.settings.vehicle].timestamp.value);// Local time
			var solECEF = solarCoords(time);

			// Sun in ECI [x,y,z]
			var sunECI = ECEF2ECI(solECEF[0], solECEF[1], solECEF[2]);

			//Plot Earth to Sun Arrow
			var dirSun = new THREE.Vector3(sunECI[0], sunECI[1], sunECI[2]);
			dirSun.normalize();
			$scope.arrowSun.visible = true;		
			$scope.arrowSun.setDirection(dirSun);
	 	}
	
	 	$scope.camera.fov = fov * $scope.widget.settings.zoom;
	 	$scope.camera.updateProjectionMatrix();
	   	$scope.renderer.render($scope.scene,$scope.camera);	
	}

	$scope.cube = new THREE.Object3D();
	$scope.scene = createScene();
	$scope.camera = createCamera();
	var fov = $scope.camera.fov;
	$scope.light = createLight();
	$scope.renderer = createRenderer();
	$scope.grid = createGrid();
	$scope.axis = createAxis();
	$scope.arrowEarth = createArrow('Earth', 0x111950);
	$scope.arrowSun = createArrow('Sun', 0xFFAB00);

	$scope.scene.add($scope.light);
	loadModel($scope.modelUrl);
	$scope.scene.add($scope.cube);
	$scope.scene.add($scope.axis);
	$scope.scene.add($scope.grid);
	$scope.scene.add($scope.arrowEarth);
	$scope.scene.add($scope.arrowSun);

	var controls = new THREE.OrbitControls($scope.camera, $scope.renderer.domElement);
	controls.enableZoom = false;
	controls.enablePan = false;

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
