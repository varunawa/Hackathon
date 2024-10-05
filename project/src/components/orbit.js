import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import earthTexture from '../assets/earth.jpg';
import starsTexture from '../assets/stars.jpg';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);  // Set initial size
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Corrected `domElement` typo
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
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
const earthGeo = new THREE.SphereGeometry(10, 15, 15);
const earthMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(earthTexture)
});
const earth = new THREE.Mesh(earthGeo, earthMat);
scene.add(earth);

// Animation loop
function animate() {
    renderer.render(scene, camera);
}

// Set up the animation loop using requestAnimationFrame
renderer.setAnimationLoop(animate);

// Fix typo in 'function' for the resize event listener
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
