// ThreeScene.js
import React, { useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,  // field of view 
      window.innerWidth / window.innerHeight,  // aspect ratio 
      0.1, // near
      1000 // far
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; 
};

export default ThreeScene;
