import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import earthTexture from '../img/earth.jpg';

const renderer = new THREE.WebGLRenderer();

document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domeElement);
camera.position.set(-90,140,140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const earthGeo = new THREE.SphereGeometry(10, 15, 15);
const earthMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(earthTexture)
});
const earth = new THREE.Mesh(earthGeo, earthMat);
scene.add(earth);


function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', funciton () {
    camera.aspect = window.innderWIdth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
