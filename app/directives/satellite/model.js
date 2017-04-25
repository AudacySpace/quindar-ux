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
.controller('SatelliteCtrl',function ($scope, $element, dashboardService,d3Service) {
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
		var gridXY = new THREE.GridHelper(100, 50, new THREE.Color( 0x989898 ), new THREE.Color( 0xbfbfbf ));
		gridXY.rotation.x = Math.PI/2;
		return gridXY;
	}

	var createAxis = function(){
		var axis = new THREE.AxisHelper(20);
		axis.material.linewidth = 2;
		return axis;
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

		xECI = mat[0][0]*posX + mat[0][1]*posY + mat[0][2]*posZ;
		yECI = mat[1][0]*posX + mat[1][1]*posY + mat[1][2]*posZ;
		zECI = mat[2][0]*posX + mat[2][1]*posY + mat[2][2]*posZ;
		
		return [xECI, yECI, zECI]

	}
	
	function longLat2ECEF(longitude, latitude){
		var solX = Math.cos(longitude);
		var solY = Math.sin(longitude);
		var solZ = Math.sin(latitude);
		
		return [solX,solY,solZ];
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
			$scope.posX = telemetry[$scope.widget.settings.vehicle].x.value;
			$scope.posY = telemetry[$scope.widget.settings.vehicle].y.value;
			$scope.posZ = telemetry[$scope.widget.settings.vehicle].z.value;

			//Transform position from ECEF to ECI
			$scope.earthECI = ECEF2ECI($scope.posX,$scope.posY,$scope.posZ);
			
			//Calculate direction to Sun //
			var tempTime = new Date(telemetry[$scope.widget.settings.vehicle].timestamp.value);// Local time
			// Sun's coordinate [longitude, latitude]
			$scope.solCoords = solarPosition(tempTime);
			$scope.solLongRad = $scope.solCoords[0]*radians;
			$scope.solLatRad = $scope.solCoords[1]*radians;

			console.log(tempTime)
			// Sun in ECEF [x,y,z]
			$scope.solECEF = longLat2ECEF($scope.solLongRad,$scope.solLatRad);

			// Sun in ECI [x,y,z]
			$scope.sunECI = ECEF2ECI($scope.solECEF[0], $scope.solECEF[1], $scope.solECEF[2]);
			console.log($scope.sunECI)
			var dir = new THREE.Vector3(-$scope.earthECI[0], -$scope.earthECI[1], -$scope.earthECI[2]);
			var dirSun = new THREE.Vector3($scope.sunECI[0], $scope.sunECI[1], $scope.sunECI[2]);
			
			//normalize the direction vector (convert to vector of length 1)
			dir.normalize();
			dirSun.normalize();

			$scope.arrowHelper.setLength(8);
			$scope.arrowHelperSun.setLength(8);			
			$scope.arrowHelper.setDirection(dir);
			$scope.arrowHelperSun.setDirection(dirSun);
	 	}
	
	 	$scope.camera.fov = fov * $scope.widget.settings.zoom;
	 	$scope.camera.updateProjectionMatrix();
	   	$scope.renderer.render($scope.scene,$scope.camera);


		
	}

	function solarPosition(time) {
	var centuries = (time - Date.UTC(2000, 0, 1, 12)) / 864e5 / 36525, // since J2000
		longitude = (d3Service.utcDay.floor(time) - time) / 864e5 * 360 - 180;
		return [
			longitude - equationOfTime(centuries) * degrees,
			solarDeclination(centuries) * degrees
		];
	}

    // Equations based on NOAA’s Solar Calculator; all angles in radians.
    // http://www.esrl.noaa.gov/gmd/grad/solcalc/

    function equationOfTime(centuries) {
        var e = eccentricityEarthOrbit(centuries),
            m = solarGeometricMeanAnomaly(centuries),
            l = solarGeometricMeanLongitude(centuries),
            y = Math.tan(obliquityCorrection(centuries) / 2);
            y *= y;
                return y * Math.sin(2 * l)
                    - 2 * e * Math.sin(m)
                    + 4 * e * y * Math.sin(m) * Math.cos(2 * l)
                    - 0.5 * y * y * Math.sin(4 * l)
                    - 1.25 * e * e * Math.sin(2 * m);
    }

    function solarDeclination(centuries) {
        return Math.asin(Math.sin(obliquityCorrection(centuries)) * Math.sin(solarApparentLongitude(centuries)));
    }

    function solarApparentLongitude(centuries) {
        return solarTrueLongitude(centuries) - (0.00569 + 0.00478 * Math.sin((125.04 - 1934.136 * centuries) * radians)) * radians;
    }

    function solarTrueLongitude(centuries) {
        return solarGeometricMeanLongitude(centuries) + solarEquationOfCenter(centuries);
    }

    function solarGeometricMeanAnomaly(centuries) {
        return (357.52911 + centuries * (35999.05029 - 0.0001537 * centuries)) * radians;
    }

    function solarGeometricMeanLongitude(centuries) {
        var l = (280.46646 + centuries * (36000.76983 + centuries * 0.0003032)) % 360;
            return (l < 0 ? l + 360 : l) / 180 * π;
    }

    function solarEquationOfCenter(centuries) {
        var m = solarGeometricMeanAnomaly(centuries);
            return (Math.sin(m) * (1.914602 - centuries * (0.004817 + 0.000014 * centuries))
                    + Math.sin(m + m) * (0.019993 - 0.000101 * centuries)
                    + Math.sin(m + m + m) * 0.000289) * radians;
    }

    function obliquityCorrection(centuries) {
        return meanObliquityOfEcliptic(centuries) + 0.00256 * Math.cos((125.04 - 1934.136 * centuries) * radians) * radians;
    }

    function meanObliquityOfEcliptic(centuries) {
        return (23 + (26 + (21.448 - centuries * (46.8150 + centuries * (0.00059 - centuries * 0.001813))) / 60) / 60) * radians;
    }

    function eccentricityEarthOrbit(centuries) {
        return 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
    }  
	
	$scope.cube = new THREE.Object3D();
	$scope.scene = createScene();
	$scope.camera = createCamera();
	var fov = $scope.camera.fov;
	$scope.light = createLight();
	$scope.renderer = createRenderer();
	$scope.grid = createGrid();
	$scope.axis = createAxis();

	$scope.scene.add($scope.light);
	loadModel($scope.modelUrl);
	$scope.scene.add($scope.cube);
	$scope.scene.add($scope.axis);
	$scope.scene.add($scope.grid);

	var controls = new THREE.OrbitControls($scope.camera, $scope.renderer.domElement);
	controls.enableZoom = false;
	controls.enablePan = false;

	// Add an arrow //
	var dir = new THREE.Vector3( 1, 1, 0 );
	//normalize the direction vector (convert to vector of length 1)
	dir.normalize();

	// Add an arrow //
	var dirSun = new THREE.Vector3( 1, 1, 0 );
	//normalize the direction vector (convert to vector of length 1)
	dirSun.normalize();	
	
	var origin = new THREE.Vector3( 0, 0, 0 );
	var arrowLength = 0.1;
	var hex = 0x111950;
	
	var originSun = new THREE.Vector3( 0, 0, 0 );
	var arrowLengthSun = 0.1;	
	var hexSun = 0xFF6D00;

	$scope.arrowHelper = new THREE.ArrowHelper( dir, origin, arrowLength, hex );
	$scope.scene.add($scope.arrowHelper)
	
	$scope.arrowHelperSun = new THREE.ArrowHelper( dirSun, originSun, arrowLengthSun, hexSun );
	$scope.scene.add($scope.arrowHelperSun)	
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
