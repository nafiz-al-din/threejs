//! https://www.mathsisfun.com/index.htm >>>> math
//! 1. Lynda.com - Learning 3D Graphics on the Web with Three.js (2017 ENG) >>>> course
//! 3. 06_03 >>>> episode
// console.log(THREE);

const gui = new dat.GUI()
//! Creating a Scene
const scene = new THREE.Scene()

//! adding fog
// scene.fog = new THREE.FogExp2('#fff000', 0.01) 

//! Creating a camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

//? when we add a mesh inside the scene the coordinates of the camera and the object we add to the scene stays the same, so we have to move the camera from z / x / y axis to see the object...
camera.position.z = 20


//! renderer is a place where we will merge all the elements ( scene, camera, geometry ) to render a 3d model in the web
const renderer = new THREE.WebGLRenderer()

renderer.setClearColor("#6c002d")
renderer.shadowMap.enable = true;


//! creating Light for the material
const light = getPointLight(3);
light.position.y = 3;
// light.position.y = -6;
light.position.x = 9;

//* dat gui controls setup for light
gui.add(light, 'intensity', 1, 100);
gui.add(light.position, 'x', -100, 100);
gui.add(light.position, 'y', -100, 100);


//! creating a box with geometry

const box = new THREE.BoxGeometry(1, 1, 1);
const boxmat = new THREE.MeshBasicMaterial( {color: 0xFF00FF} );


//! creating a caps with geometry

const caps = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
const capsmat = new THREE.MeshBasicMaterial( {color: 0xFF00FF} );


//! creating a plane with geometry

const plane = new THREE.PlaneGeometry(4, 4);
const planemat = new THREE.MeshBasicMaterial( {color: 0x00FF00, side: THREE.DoubleSide} );


//! creating a ring with geometry

const ring = new THREE.RingGeometry( 1, 4, 30, 20, 4, 6.283185307179586 );
const ringmat = new THREE.MeshPhongMaterial( { color: 0xffff00, side: THREE.DoubleSide } );


//! creating a sphear with geometry

const sphere = new THREE.SphereGeometry( 0.2, 24, 24 );
const spheremat = new THREE.MeshBasicMaterial( { color: 'white', side: THREE.DoubleSide } );
const shpereMesh = new THREE.Mesh( sphere, spheremat );


const mesh = new THREE.Mesh( box, boxmat );
mesh.castShadow = true;

const ringMesh = new THREE.Mesh( ring, ringmat );
ringMesh.recieveShadow = true;

// mesh.rotation.x = 10
// mesh.rotation.y = 20
// mesh.rotation.z = 90

ringMesh.rotation.x = 90;
gui.add(ringMesh.rotation, 'x', Math.fround(-100.000), Math.fround(100.000));
gui.add(ringMesh.rotation, 'y', Math.fround(-100.000), Math.fround(100.000));



// console.log({box, mesh, caps, plane, ring});



//* html element
const canvas = document.getElementById('web-gl-canvas')


//* configs
mesh.add( light );
// scene.add( light );
ringMesh.add( mesh );
light.add( shpereMesh );
scene.add( ringMesh );

// naming an object;
ringMesh.name = 'the-ring';

renderer.setSize(window.innerWidth, window.innerHeight)

canvas.appendChild(renderer.domElement)

const controls = new OrbitControls( camera, renderer.domElement );

// const theObj = scene.getObjectByName('the-ring')
// console.log({theObj});
mesh.rotation.z -= 2

function animate() {
    requestAnimationFrame( () => animate() );

    mesh.rotation.x += 0.055

    // ringMesh.rotation.x += 0.05
    // ringMesh.rotation.y += 0.001

    // light.position.x += 0.005;


    controls.update()
    renderer.render( scene, camera );
};
animate();
// renderer.render( scene, camera );

//TODO =====>>>> Functions 

function getPointLight ( intensity, color = '#00446c' ) {
    let light = new THREE.PointLight(color, intensity);
    light.castShadow = true;

    return light;
}

