function init() {
	var scene = new THREE.Scene();
	var gui = new dat.GUI();

	// initialize objects
	var lightTop = getSpotLight(0.4, 'rgb(255, 255, 255)');
	var lightLeft = getSpotLight(1.6, 'rgb(255, 220, 180)');
	var lightRight = getSpotLight(2.1, 'rgb(255, 220, 180)');

	lightTop.position.x = -3;
	lightTop.position.y = 25.3;
	lightTop.position.z = 1;

	lightLeft.position.x = 17;
	lightLeft.position.y = 8;
	lightLeft.position.z = 12;

	lightRight.position.x = -50;
	lightRight.position.y = -50;
	lightRight.position.z = -3;

	console.log({lightTop});

	//! dat.gui
	gui.add(lightTop, 'intensity', 0, 50);
	gui.add(lightTop.rotation, 'x', -100, 100);
	gui.add(lightTop.rotation, 'y', -100, 100);
	gui.add(lightTop.rotation, 'z', -100, 100);

	gui.add(lightTop.position, 'x', -100, 100);
	gui.add(lightTop.position, 'y', -100, 100);
	gui.add(lightTop.position, 'z', -100, 100);

	gui.add(lightLeft, 'intensity', 0, 10);
	gui.add(lightLeft.position, 'x', -50, 50);
	gui.add(lightLeft.position, 'y', -50, 50);
	gui.add(lightLeft.position, 'z', -50, 50);

	gui.add(lightRight, 'intensity', 0, 10);
	gui.add(lightRight.position, 'x', -50, 50);
	gui.add(lightRight.position, 'y', -50, 50);
	gui.add(lightRight.position, 'z', -50, 50);

	//! load the environment map
    const path = '/images/cubemap';
	const cubeMapImgs1 = [`${path}/1/px.jpg`, `${path}/1/nx.jpg`, `${path}/1/py.jpg`, `${path}/1/ny.jpg`, `${path}/1/pz.jpg`, `${path}/1/nz.jpg`,];
	const cubeMapImgs2 = [`${path}/2/posx.jpg`, `${path}/2/negx.jpg`, `${path}/2/posy.jpg`, `${path}/2/negy.jpg`, `${path}/2/posz.jpg`, `${path}/2/negz.jpg`,];
	const cubeMapImgs3 = [`${path}/3/posx.jpg`,`${path}/3/negx.jpg`,`${path}/3/posy.jpg`,`${path}/3/negy.jpg`,`${path}/3/posz.jpg`,`${path}/3/negz.jpg`,];


	var reflectionCube = new THREE.CubeTextureLoader().load(cubeMapImgs3);

	scene.background = reflectionCube;

	// add other objects to the scene
	scene.add(lightTop);
	scene.add(lightLeft);
	scene.add(lightRight);

	// camera
	var camera = new THREE.PerspectiveCamera(
		45, // field of view
		window.innerWidth / window.innerHeight, // aspect ratio
		1, // near clipping plane
		5000 // far clipping plane
	);
	camera.position.z = 50;
	camera.position.x = 100;
	camera.position.y = 30;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	//! load external geometry
	// _objLoader(scene);
	_gltfLoader(scene, "minecraft");

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	var controls = new OrbitControls( camera, renderer.domElement );

	document.getElementById('web-gl-canvas').appendChild(renderer.domElement);

	update(renderer, scene, camera, controls);

	return scene;
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

function getSpotLight(intensity, color) {
	color = color === undefined ? 'rgb(255, 255, 255)' : color;
	var light = new THREE.SpotLight(color, intensity);
	light.castShadow = true;
	light.penumbra = 0.5;

	//Set up shadow properties for the light
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadow.bias = 0.001;

	return light;
}

function update(renderer, scene, camera, controls) {
	controls.update();
	renderer.render(scene, camera);

	const ObjectOnScreen = scene.getObjectByName("Sketchfab_Scene");
	// console.log({ObjectOnScreen});

	if (ObjectOnScreen !== undefined) {
		// ObjectOnScreen.rotation.x += .005;
		ObjectOnScreen.rotation.y += .009;
		// ObjectOnScreen.rotation.z += .005;
	}
	
	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls);
	});
}

function _objLoader(scene) {
	var loader = new OBJLoader();
	var textureLoader = new THREE.TextureLoader();

	loader.load('/images/head/lee-perry-smith-head-scan.obj', function (object) {
		var colorMap = textureLoader.load('/images/head/Face_Color.jpg');
		var bumpMap = textureLoader.load('/images/head/Face_Disp.jpg');
		var faceMaterial = getMaterial('phong', 'rgb(255, 255, 255)');

		object.traverse(function(child) {
			if (child.name == 'Plane') {
				child.visible = false;
			}
			if (child.name == 'Infinite') {
				child.material = faceMaterial;
				faceMaterial.roughness = 0.875;
				faceMaterial.map = colorMap;
				faceMaterial.bumpMap = bumpMap;
				faceMaterial.roughnessMap = bumpMap;
				faceMaterial.metalness = 0;
				faceMaterial.bumpScale = 0.175;
			}
		} );

		object.scale.x = 50;
		object.scale.y = 50;
		object.scale.z = 50;
        
		// object.scale.z = 50;

		object.position.z = 0;
		object.position.y = -2;
		object.position.z = -2;
		scene.add(object);
	});
}

function _gltfLoader(scene, type = 'sun') {
	const imgs = {
		"sun": "/images/gltf/sun/scene.gltf",
		"moon": "/images/gltf/moon/scene.gltf",
		"earth": "/images/gltf/planet_earth/scene.gltf",
		"spaceship": "/images/gltf/death_row_spaceship/scene.gltf",
		"raven_spaceship": "/images/gltf/raven_spaceship_-_star_conflict_v.2/scene.gltf",
		"minecraft": "/images/gltf/extracted_minecraft_java_editions_stars/scene.gltf",
		"rocket": "/images/gltf/rocket_ship/scene.gltf"
		};
		
	let loader = new THREE.GLTFLoader();
	loader.load(`${imgs[type]}`, function (gltf) {
		console.log({gltf});

		scene.add(gltf.scene)
	})
}


var scene = init();