import * as THREE from "three";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'; // STL loader
import { OBJLoader } from 'threeJS-object-controls';  // Object controls

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the Fusion360 STL file
const loader = new STLLoader();
loader.load(
  'C:/Users/rache/Downloads/Beacon RevE V5 (de-featured) v2.stl',  // Replace with your file path
  (geometry) => {
    // Create a material and mesh from the STL geometry
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.scale.set(0.01, 0.01, 0.01);
    scene.add(mesh);

    // Set up ObjectControls after the mesh is added to the scene
    const controls = new ObjectControls(camera, renderer.domElement, mesh);

    // Optional: If you have multiple meshes, add them like this
    // const controls = new ObjectControls(camera, renderer.domElement, [mesh, myOtherMesh]);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  (error) => {
    console.error('An error occurred while loading the STL file', error);
  }
);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();


export default ThreeScene;
