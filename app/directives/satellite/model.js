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

	$scope.scene.add($scope.light);
	loadModel($scope.modelUrl);
	$scope.scene.add($scope.cube);
	$scope.scene.add(new THREE.AxisHelper(100));
	$scope.scene.add(new THREE.GridHelper(100,2));

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
