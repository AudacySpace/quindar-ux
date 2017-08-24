app
.directive('model', function() {
  	return { 
    	restrict: 'E',
		scope: {
			modelUrl: "=modelUrl",
			widget: "=widget",
			quaternion: "=quaternion"
		},
		controller: 'SatelliteCtrl'
  	}; 
});

app
.controller('SatelliteCtrl',function ($scope, $element,$interval, dashboardService, solarService, datastatesService) {
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
	var colorAlarm = datastatesService.colorValues.alarmcolor; //Color red for alarm
    var colorCaution = datastatesService.colorValues.cautioncolor;// Color orange for caution
    var colorHealthy = datastatesService.colorValues.healthycolor;// Color green for healthy data
    var colorStale = datastatesService.colorValues.stalecolor;// Color staleblue for stale data
    var colorDisconnected = datastatesService.colorValues.disconnectedcolor;//Color grey for disconnected db
    var colorDefault = datastatesService.colorValues.defaultcolor;//Color black for default color
    var q1tempval = '';
    var q2tempval = '';
	var q3tempval = '';
    var qctempval = '';
	$scope.statusIcons = dashboardService.icons;
	var dServiceObj = {};

	$scope.$watch('statusIcons',function(newVal,oldVal){
        	dServiceObj = newVal; 
    },true);

	//$scope.quaternion = new Object();

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
		var time = new Date(telemetry['time']);// Local time
		
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
 	var count =0;
	var render = function(){

		requestAnimationFrame(render);
		controls.update();
		if($scope.cube && $scope.widget.settings.vehicle){
			if(telemetry[$scope.widget.settings.vehicle]) {
		
				//set quaternion values for rotation
				$scope.cube.quaternion.x = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q1.value;
				$scope.cube.quaternion.y = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q2.value;
				$scope.cube.quaternion.z = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q3.value;
				$scope.cube.quaternion.w = telemetry[$scope.widget.settings.vehicle].GNC.attitude.qc.value;

				//set quaternion values for displaying on widget
				$scope.quaternion.q1 = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q1.value.toFixed(4);
				$scope.quaternion.q2 = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q2.value.toFixed(4);
				$scope.quaternion.q3 = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q3.value.toFixed(4);
				$scope.quaternion.qc = telemetry[$scope.widget.settings.vehicle].GNC.attitude.qc.value.toFixed(4);
				
				//set direction to Earth
				var posX = telemetry[$scope.widget.settings.vehicle].GNC.position.x.value;
				var posY = telemetry[$scope.widget.settings.vehicle].GNC.position.y.value;
				var posZ = telemetry[$scope.widget.settings.vehicle].GNC.position.z.value;

				//Transform position from ECEF to ECI
				var earthECI = ECEF2ECI(posX,posY,posZ);

				//Plot Satellite to Earth Arrow
				var dirEarth = new THREE.Vector3(-earthECI[0], -earthECI[1], -earthECI[2]);
				dirEarth.normalize();
				$scope.arrowEarth.visible = true;
				$scope.arrowEarth.setDirection(dirEarth);
				
				//Calculate direction to Sun //
				var time = new Date(telemetry['time']);// Local time
				var solECEF = solarCoords(time);

				// Sun in ECI [x,y,z]
				var sunECI = ECEF2ECI(solECEF[0], solECEF[1], solECEF[2]);

				//Plot Earth to Sun Arrow
				var dirSun = new THREE.Vector3(sunECI[0], sunECI[1], sunECI[2]);
				dirSun.normalize();
				$scope.arrowSun.visible = true;		
				$scope.arrowSun.setDirection(dirSun);
			} else {
				//set quaternion values to N/A if telemetry data not available
				$scope.quaternion.q1 = "N/A";
				$scope.quaternion.q2 = "N/A";
				$scope.quaternion.q3 = "N/A";
				$scope.quaternion.qc = "N/A";
			}
	 	}
	
	 	$scope.camera.fov = fov * $scope.widget.settings.zoom;
	 	$scope.camera.updateProjectionMatrix();
	   	$scope.renderer.render($scope.scene,$scope.camera);	
	}

	$scope.interval = $interval(updateColors, 500, 0, false); 

	function updateColors(){
		if($scope.widget.settings.vehicle && $scope.cube && telemetry[$scope.widget.settings.vehicle]){

			var valTypeq1 = typeof telemetry[$scope.widget.settings.vehicle].GNC.attitude.q1.value;
			var valTypeq2 = typeof telemetry[$scope.widget.settings.vehicle].GNC.attitude.q2.value;
			var valTypeq3 = typeof telemetry[$scope.widget.settings.vehicle].GNC.attitude.q3.value;
			var valTypeqc = typeof telemetry[$scope.widget.settings.vehicle].GNC.attitude.qc.value;	

			var q1 = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q1;
			var q2 = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q2;
			var q3 = telemetry[$scope.widget.settings.vehicle].GNC.attitude.q3;
			var qc = telemetry[$scope.widget.settings.vehicle].GNC.attitude.qc;	

			//color of q1 
			if(q1tempval === q1.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.colorq1 = colorHealthy;
				}else {
					$scope.quaternion.colorq1 = colorStale;
				}	
			}else{
				var colorValq1 =  datastatesService.getDataColor(q1.alarm_low,q1.alarm_high,q1.value,q1.warn_low,q1.warn_high,valTypeq1); 
				if(colorValq1 === "red"){
                    $scope.quaternion.colorq1 = colorAlarm;  
                }else if(colorValq1 === "orange"){
                    $scope.quaternion.colorq1 = colorCaution;
                }else{
                    $scope.quaternion.colorq1 = colorHealthy;
                }
				q1tempval = q1.value;
			}

			//color of q2
			if(q2tempval === q2.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.colorq2 = colorHealthy;
				}else {
					$scope.quaternion.colorq2 = colorStale;
				}	
			}else{
				var colorValq2 =  datastatesService.getDataColor(q2.alarm_low,q2.alarm_high,q2.value,q2.warn_low,q2.warn_high,valTypeq2);
				if(colorValq2 === "red"){
                    $scope.quaternion.colorq2 = colorAlarm;  
                }else if(colorValq2 === "orange"){
                    $scope.quaternion.colorq2 = colorCaution;
                }else{
                    $scope.quaternion.colorq2 = colorHealthy;
                }
				q2tempval = q2.value;
			}

			//color of q3
			if(q3tempval === q3.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.colorq3 = colorHealthy;
				}else {
					$scope.quaternion.colorq3 = colorStale;
				}
			}else{
				var colorValq3 =  datastatesService.getDataColor(q3.alarm_low,q3.alarm_high,q3.value,q3.warn_low,q3.warn_high,valTypeq3);
				if(colorValq3 === "red"){
                    $scope.quaternion.colorq3 = colorAlarm;  
                }else if(colorValq3 === "orange"){
                    $scope.quaternion.colorq3 = colorCaution;
                }else{
                    $scope.quaternion.colorq3 = colorHealthy;
                }
				q3tempval = q3.value;
			}

			//color of qc
			if(qctempval === qc.value){
				if(dServiceObj.sIcon === "green" && dServiceObj.gIcon === "green" && dServiceObj.pIcon === "green" && dServiceObj.dIcon === "green" ){
					$scope.quaternion.colorqc = colorHealthy;
				}else {
					$scope.quaternion.colorqc = colorStale;
				}
			}else{
				var colorValqc =  datastatesService.getDataColor(qc.alarm_low,qc.alarm_high,qc.value,qc.warn_low,qc.warn_high,valTypeqc);		
				if(colorValqc === "red"){
                    $scope.quaternion.colorqc = colorAlarm;  
                }else if(colorValqc === "orange"){
                    $scope.quaternion.colorqc = colorCaution;
                }else{
                    $scope.quaternion.colorqc = colorHealthy;
                }
				qctempval = qc.value;
			}

			if(dServiceObj.dIcon === "red"){
				$scope.quaternion.colorq1 = colorDisconnected;
				$scope.quaternion.q1 = '-';
				$scope.quaternion.colorq2 = colorDisconnected;
				$scope.quaternion.q2 = '-';
				$scope.quaternion.colorq3 = colorDisconnected;
				$scope.quaternion.q3 = '-';
				$scope.quaternion.colorqc = colorDisconnected;
				$scope.quaternion.qc = '-';	
			}
		} else {
			//set to default color if telemetry data not available for that vehicle
			$scope.quaternion.colorq1 = colorDefault;
			$scope.quaternion.colorq2 = colorDefault;
			$scope.quaternion.colorq3 = colorDefault;
			$scope.quaternion.colorqc = colorDefault;
		}
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

	$scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
            q1tempval = '';
    		q2tempval = '';
			q3tempval = '';
    		qctempval = '';
        }
    );

})
