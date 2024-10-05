import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeSceneProps {
  beaconMessages: any[];
  dataView: string;
  cameraView: string; // Accept the camera view prop
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ beaconMessages, dataView, cameraView }) => {
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create the scene
    const scene = new THREE.Scene();

    // Create the camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);

    // Set default camera position
    camera.position.set(0, 0, 100);

    // Create the WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.25;

    // Handle camera view changes based on the selected view
    switch (cameraView) {
      case 'top':
        camera.position.set(0, 100, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'side':
        camera.position.set(100, 0, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'bottom':
        camera.position.set(0, -100, 0);
        camera.lookAt(0, 0, 0);
        break;
      default:
        camera.position.set(0, 0, 100);
        break;
    }

    // Animation loop
    const animate = () => {
      orbit.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Cleanup
    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, [cameraView]); // Re-run the effect when cameraView changes

  return null;
};

export default ThreeScene;
