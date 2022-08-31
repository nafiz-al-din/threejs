function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();
	var loader = new THREE.TextureLoader();
	
	const path = '/images/cubemap';
	const cubeMapImgs1 = [
		`${path}/1/px.jpg`,
		`${path}/1/nx.jpg`,
		`${path}/1/py.jpg`,
		`${path}/1/ny.jpg`,
		`${path}/1/pz.jpg`,
		`${path}/1/nz.jpg`,
	];
	const cubeMapImgs2 = [
		`${path}/2/posx.jpg`,
		`${path}/2/negx.jpg`,
		`${path}/2/posy.jpg`,
		`${path}/2/negy.jpg`,
		`${path}/2/posz.jpg`,
		`${path}/2/negz.jpg`,
	];
	const cubeMapImgs3 = [
		`${path}/3/posx.jpg`,
		`${path}/3/negx.jpg`,
		`${path}/3/posy.jpg`,
		`${path}/3/negy.jpg`,
		`${path}/3/posz.jpg`,
		`${path}/3/negz.jpg`,
	];
	
	const imgs = ['concrete.jpg', 'checkerboard.jpg', 'bricks.jpg', 'fingerprints.jpg'];

	var reflectionCube = new THREE.CubeTextureLoader().load(cubeMapImgs3);

	scene.background = reflectionCube;

	//! initialize objects
	var sphereMaterial = getMaterial('phong', 'rgb(255, 255, 255)');
	var sphere = getSphere(sphereMaterial, 1, 24);

	var planeMaterial = getMaterial('phong', 'rgb(255, 255, 255)');
	var plane = getPlane(planeMaterial, 300);

	var lightLeft = getSpotLight(3, 'rgb(255, 255, 255)');
	var lightRight = getSpotLight(3, 'rgb(255, 255, 255)');
	var lightBack = getSpotLight(3, 'rgb(255, 255, 255)');

	//! manipulate objects
	sphere.position.y = sphere.geometry.parameters.radius;
	plane.rotation.x = Math.PI/2;

	lightLeft.position.x = -5;
	lightLeft.position.y = 2;
	lightLeft.position.z = -4;

	lightRight.position.x = 5;
	lightRight.position.y = 2;
	lightRight.position.z = -4;

	lightBack.position.x = 0;
	lightBack.position.y = 2;
	lightBack.position.z = 6.6;

	//! manipulate materials
	if (sphereMaterial.type == "MeshStandardMaterial" && planeMaterial.type == "MeshStandardMaterial") {
		sphereMaterial.roughness = 0.2;
		planeMaterial.roughness = 0.4;
		planeMaterial.metalness = 1;
	}

	// sphereMaterial.map = loader.load(`/images/${imgs[2]}`);
	// sphereMaterial.bumpMap = loader.load(`/images/${imgs[2]}`);
	// sphereMaterial.roughnessMap = loader.load(`/images/${imgs[2]}`);
	sphereMaterial.envMap = reflectionCube;
	
	// var maps0 = ['map', 'bumpMap', 'roughnessMap'];

	// maps0.forEach(mapName => {
	// 	let texture = sphereMaterial[mapName];
	// 	texture.wrapS = THREE.RepeatWrapping;
	// 	texture.wrapT = THREE.RepeatWrapping;
	// 	texture.repeat.set(1, 1)
	// });

	
	planeMaterial.map = loader.load(`/images/${imgs[0]}`);
	planeMaterial.bumpMap = loader.load(`/images/${imgs[0]}`);
	planeMaterial.roughnessMap = loader.load(`/images/${imgs[0]}`);
	planeMaterial.envMap = reflectionCube;

	var maps = ['map', 'bumpMap', 'roughnessMap'];

	maps.forEach(mapName => {
		let texture = planeMaterial[mapName];
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(15, 15)
	});



	//! dat.gui STARTS
	var folder1 = gui.addFolder('light_left');
	folder1.add(lightLeft, 'intensity', 0, 10);
	folder1.add(lightLeft.position, 'x', -5, 15);
	folder1.add(lightLeft.position, 'y', -5, 15);
	folder1.add(lightLeft.position, 'z', -5, 15);
    
	var folder2 = gui.addFolder('light_right');
	folder2.add(lightRight, 'intensity', 0, 10);
	folder2.add(lightRight.position, 'x', -5, 15);
	folder2.add(lightRight.position, 'y', -5, 15);
	folder2.add(lightRight.position, 'z', -5, 15);

	var folder3 = gui.addFolder('light_back');
	folder3.add(lightBack, 'intensity', 0, 10);
	folder3.add(lightBack.position, 'x', -5, 15);
	folder3.add(lightBack.position, 'y', -5, 15);
	folder3.add(lightBack.position, 'z', -5, 15);

	var folder4 = gui.addFolder("materials");

	if (sphereMaterial.type == "MeshStandardMaterial" && planeMaterial.type == "MeshStandardMaterial") {
		folder4.add(sphereMaterial, 'roughness', 0, 1)
		folder4.add(planeMaterial, 'roughness', 0, 1)
		folder4.add(sphereMaterial, 'metalness', 0, 1)
		folder4.add(planeMaterial, 'metalness', 0, 1)

	} else {
		sphereMaterial.shininess ? folder4.add(sphereMaterial, 'shininess', 1, 1000) : null;
		planeMaterial.shininess ? folder4.add(planeMaterial, 'shininess', 1, 1000) : null;
	}
	folder4.open()

	//! dat.gui ENDS
    
	// add objects to the scene
	scene.add(sphere);
	scene.add(plane);
	scene.add(lightLeft);
	scene.add(lightRight);
	scene.add(lightBack);

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		1000 // far clipping plane
	);
	camera.position.z = 10;
	camera.position.x = -5;
	camera.position.y = 10;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	document.getElementById('web-gl-canvas').appendChild(renderer.domElement);
	
	var controls = new OrbitControls( camera, renderer.domElement );
	
	update(renderer, scene, camera, controls);

	return scene;
}

function getSphere(material, size, segments) {
	var geometry = new THREE.SphereGeometry(size, segments, segments);
	var obj = new THREE.Mesh(geometry, material);
	obj.castShadow = true;

	return obj;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function getSpotLight(intensity, color,) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1080;  // default: 512
	light.shadow.mapSize.height = 1080; // default: 512
	light.shadow.bias = 0.001;

	return light;
}

function getPlane(material, size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	material.side = THREE.DoubleSide;
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;

	return obj;
}

function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

var scene = init();