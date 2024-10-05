import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import earthTexture from '../assets/earth.jpg';
import starsTexture from '../assets/stars.jpg';
import beaconTexture from '../assets/beacon.jpg';

// Create the WebGL Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);  // Set initial size
document.body.appendChild(renderer.domElement);

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 100); // Set a good initial position

// Initialize OrbitControls
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true; // Smooth the controls
orbit.dampingFactor = 0.25;  // Set damping factor
orbit.update();  // Update the controls

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Brighter light
scene.add(ambientLight);

// Load stars background texture for the scene
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

// Load earth texture
const textureLoader = new THREE.TextureLoader();
const earthGeo = new THREE.SphereGeometry(16, 30, 30);
const earthMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(earthTexture)
});
const earth = new THREE.Mesh(earthGeo, earthMat);
scene.add(earth);

// Load beacon texture and create a new mesh for it
const beaconGeo = new THREE.SphereGeometry(2, 30, 30);
const beaconMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(beaconTexture)  // Correct variable name
});
const beacon = new THREE.Mesh(beaconGeo, beaconMat);
earth.add(beacon);  // Add beacon as a child of the earth mesh
beacon.position.set(20, 0, 0);  // Position the beacon

// Animation loop
function animate() {
    earth.rotateY(0.004);  // Rotate earth
    orbit.update();  // Update controls
    renderer.render(scene, camera);
}

// Set up the animation loop using requestAnimationFrame
renderer.setAnimationLoop(animate);

// Resize event listener to adjust camera and renderer when window is resized
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
