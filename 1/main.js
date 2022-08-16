//! https://www.mathsisfun.com/index.htm >>>> math
//! 1. Lynda.com - Learning 3D Graphics on the Web with Three.js (2017 ENG) >>>> course
//! 01_05 >>>> episode
// console.log(THREE);

//! Creating a Scene
const scene = new THREE.Scene()

//! Creating a camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

//? when we add a mesh inside the scene the coordinates of the camera and the object we add to the scene stays the same, so we have to move the camera from z / x / y axis to see the object...
camera.position.z = 20


//! renderer is a place where we will merge all the elements ( scene, camera, geometry ) to render a 3d model in the web
const renderer = new THREE.WebGLRenderer()



//! creating a box with geometry

const box = new THREE.BoxGeometry(1, 1, 1);
const boxmat = new THREE.MeshBasicMaterial( {color: 0xFF00FF} );


const caps = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
const capsmat = new THREE.MeshBasicMaterial( {color: 0xFF00FF} );


const plane = new THREE.PlaneGeometry(4, 4);
const planemat = new THREE.MeshBasicMaterial( {color: 0x00FF00, side: THREE.DoubleSide} );


const ring = new THREE.RingGeometry( 6, 4, 30, 20, 4, 6.283185307179586 );
const ringmat = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );


// const mesh = new THREE.Mesh( box, boxmat );
const mesh = new THREE.Mesh( caps, capsmat );
const ringMesh = new THREE.Mesh( ring, ringmat );

// mesh.rotation.x = 10
// mesh.rotation.y = 20
// mesh.rotation.z = 90

ringMesh.rotation.x = 90



// console.log({box, mesh, caps, plane, ring});



//* html element
const canvas = document.getElementById('web-gl-canvas')


//* configs
scene.add( ringMesh );
ringMesh.add( mesh );

renderer.setSize(window.innerWidth, window.innerHeight)

canvas.appendChild(renderer.domElement)

renderer.render( scene, camera )

// function animate() {
//     requestAnimationFrame( animate );

//     mesh.rotation.z += 0.0001
//     mesh.rotation.x += 0.005

//     ringMesh.rotation.x += 0.14
//     ringMesh.rotation.y += 0.001

//     renderer.render( scene, camera );
// };
// animate();
