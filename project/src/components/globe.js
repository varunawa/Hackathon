// Globe.js
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earthTexture from '../assets/earth.jpg'; 

const Globe = () => {
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, // field of view in degrees 
      w / h, // aspect ratio 
      0.1, // near
      1000 // far
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // White directional light
    directionalLight.position.set(5, 5, 5).normalize(); // Position light
    scene.add(directionalLight);


    // Create a box geometry as the "earth"
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, 16);
    const material = new THREE.MeshStandardMaterial({
        // color: 0xffff00,
        // flatShading: true,
        map: loader.load(earthTexture),
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    // Animation loop
    const animate = () => {
      earthMesh.rotation.x += 0.001;
      earthMesh.rotation.y += 0.001;
      controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Cleanup function to dispose of the renderer on component unmount
    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // You can return a div or null since the canvas is added directly to the body
};

export default Globe;
