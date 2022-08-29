function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();
	var clock = new THREE.Clock();

	var enableFog = true;

	if (enableFog) {
		scene.fog = new THREE.FogExp2(0xffffff, 0.01);
	}
	
	var plane = getPlane(60);
	var directionalLight = _directionalLight(1, gui);
	var sphere = getSphere(0.05);
	var boxGrid = getBoxGrid(30, 1.6);
		boxGrid.name = 'box-grid';
	var ambientLight = _ambientLight(1);
	var cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)

	plane.name = 'plane-1';

	plane.rotation.x = Math.PI/2;
	directionalLight.position.y = 8;
	directionalLight.position.z = -11;
	directionalLight.intensity = 2;

	scene.add(plane);
	directionalLight.add(sphere);
	scene.add(directionalLight);
	scene.add(boxGrid);
	// scene.add(cameraHelper);
	scene.add(ambientLight);

	gui.add(directionalLight, 'intensity', 0, 10);
	// gui.add(directionalLight.position, 'x', -20, 20);
	// gui.add(directionalLight.position, 'y', 0, 20);
	// gui.add(directionalLight.position, 'z', -20, 20);
	// gui.add(directionalLight, 'penumbra', 0, 1);

	// var camera = new THREE.PerspectiveCamera(
	// 	-15,
	// 	15,
	// 	15,
	// 	-15,
	// 	1,
	// 	1000
	// );

	var camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth/window.innerHeight,
		1,
		1000
	);

	// camera.position.x = 0;
	// camera.position.y = 8;
	// camera.position.z = 20;

	// camera.lookAt(new THREE.Vector3(0, 0, 0));

	//* Directions 
	var cameraYPosition = new THREE.Group();
	var cameraZPosition = new THREE.Group();
	var cameraXPosition = new THREE.Group();
	var cameraXRotation = new THREE.Group();
	var cameraYRotation = new THREE.Group();
	var cameraZRotation = new THREE.Group();

	cameraYPosition.name = "camYPos";
	cameraZPosition.name = "camZPos";
	cameraXPosition.name = "camXPos";
	cameraXRotation.name = "camXRot";
	cameraYRotation.name = "camYRot";
	cameraZRotation.name = "camZRot";

	cameraXPosition.add(camera)
	cameraZRotation.add(cameraXPosition)
	cameraYPosition.add(cameraZRotation);
	cameraZPosition.add(cameraYPosition);
	cameraXRotation.add(cameraZPosition);
	cameraYRotation.add(cameraXRotation);

	cameraXRotation.rotation.x = -Math.PI / 2;
	cameraXPosition.position.x = 0;
	cameraYPosition.position.y = 1;
	cameraZPosition.position.z = 50;
	// cameraZRotation.rotation.z = 0;

	scene.add(cameraYRotation);


	//! STARTING Animations using TWEEN js
	
	// new TWEEN.Tween({val: 100}).to({val: -50}, 12000).onUpdate(function () {
	// 	cameraZPosition.position.z = this.val;
	// }).start()
	
	// new TWEEN.Tween({val: 100}).to({val: 0}, 6000).delay(1000).onUpdate(function () {
	// 	cameraXRotation.rotation.x = this.val;
	// }).start()

	//! FINISHING Animations using TWEEN js





	gui.add(cameraZPosition.position, 'z', -50, 100);
	gui.add(cameraYRotation.position, 'y', -Math.PI, Math.PI);
	gui.add(cameraZRotation.rotation, 'z', -Math.PI, Math.PI);

	var renderer = new THREE.WebGLRenderer();
	renderer.shadowMap.enabled = true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(120, 120, 120)');
	document.getElementById('web-gl-canvas').appendChild(renderer.domElement);

	var controls = new OrbitControls(camera, renderer.domElement);

	// update(renderer, scene, camera, controls, clock);
	update(renderer, scene, camera, controls, clock);

	return scene;
}

function getBox(w, h, d) {
	var geometry = new THREE.BoxGeometry(w, h, d);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)'
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
	mesh.castShadow = true;

	return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
	var group = new THREE.Group();

	for (var i=0; i<amount; i++) {
		var obj = getBox(1, 2, 1);
		obj.position.x = i * separationMultiplier;
		obj.position.y = obj.geometry.parameters.height/2;
		group.add(obj);
		for (var j=1; j<amount; j++) {
			var obj = getBox(1, 2, 1);
			obj.position.x = i * separationMultiplier;
			obj.position.y = obj.geometry.parameters.height/2;
			obj.position.z = j * separationMultiplier;
			group.add(obj);
		}
	}

	group.position.x = -(separationMultiplier * (amount-1))/2;
	group.position.z = -(separationMultiplier * (amount-1))/2;

	return group;
}

function getPlane(size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(120, 120, 120)',
		side: THREE.DoubleSide
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
	mesh.receiveShadow = true;

	return mesh;
}

function getSphere(size) {
	var geometry = new THREE.SphereGeometry(size, 24, 24);
	var material = new THREE.MeshBasicMaterial({
		color: 'rgb(255, 255, 255)'
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);

	return mesh;
}

function getPointLight(intensity) {
	var light = new THREE.PointLight(0xffffff, intensity);
	light.castShadow = true;

	return light;
}

function getSpotLight(intensity) {
	var light = new THREE.SpotLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.bias = 0.001;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;

	return light;
}

function _directionalLight(intensity, gui = null) {
	var light = new THREE.DirectionalLight(0xffffff, intensity);
	light.castShadow = true;

	light.shadow.camera.left = -40;
	light.shadow.camera.top = -40;
	light.shadow.camera.right = 40;
	light.shadow.camera.bottom = 40;

	light.shadow.mapSize.width = 4096;
	light.shadow.mapSize.height = 4096;


	// if (gui) {
	// 	gui.add(light.shadow.camera, 'left', -5, -15);
	// 	gui.add(light.shadow.camera, 'top', -5, -15);
	// 	gui.add(light.shadow.camera, 'right', 5, 15);
	// 	gui.add(light.shadow.camera, 'bottom', 5, 15);
	// }

	return light;
}

function _ambientLight(intensity, gui = null) {
	var light = new THREE.AmbientLight("rgb(10, 30, 50)", intensity);

	return light;
}

function update(renderer, scene, camera, controls, clock) {
	var getElapsedTime = clock.getElapsedTime();
	
	var boxes = scene.getObjectByName("box-grid");
	let camZPos = scene.getObjectByName('camZPos');
	let camXPos = scene.getObjectByName('camXPos');
	let camZRot = scene.getObjectByName('camZRot');
	let camXRot = scene.getObjectByName('camXRot');

	camZPos.position.z -= 0.090;

	
	if (camXRot.rotation.x > 0) {
		camZRot.rotation.z = noise.simplex2(getElapsedTime * 1.5, getElapsedTime) * 0.2;
	}
	
	if (camXRot.rotation.x < 0) {
		camXRot.rotation.x += 0.01;
	}

	renderer.render(
		scene,
		camera
	);

	boxes.children.forEach((child, i) => {
		child.scale.y = (Math.sin(getElapsedTime * 5 + i) + 1) / 2 + 0.05;
		child.position.y = child.scale.y/2;
	});

	controls.update();
	// TWEEN.update()

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock);
	})
}

var scene = init();