// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// interface ThreeSceneProps {
//   beaconMessages: any[];
//   dataView: string;
//   cameraView: string;
// }

// const ThreeScene: React.FC<ThreeSceneProps> = ({ beaconMessages, dataView, cameraView }) => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const w = containerRef.current?.clientWidth || window.innerWidth;
//     const h = containerRef.current?.clientHeight || window.innerHeight;

//     // Create the scene
//     const scene = new THREE.Scene();

//     // Create the camera
//     const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
//     camera.position.set(0, 0, 100);

//     // Create the WebGL Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(w, h);
//     if (containerRef.current) {
//       containerRef.current.appendChild(renderer.domElement);
//     }

//     // Initialize OrbitControls
//     const orbit = new OrbitControls(camera, renderer.domElement);
//     orbit.enableDamping = true;
//     orbit.dampingFactor = 0.25;

//     // Handle camera view changes based on the selected view
//     const updateCameraPosition = (view: string) => {
//       switch (view) {
//         case 'top':
//           camera.position.set(0, 100, 0);
//           camera.lookAt(0, 0, 0);
//           break;
//         case 'side':
//           camera.position.set(100, 0, 0);
//           camera.lookAt(0, 0, 0);
//           break;
//         case 'bottom':
//           camera.position.set(0, -100, 0);
//           camera.lookAt(0, 0, 0);
//           break;
//         default:
//           camera.position.set(0, 0, 100);
//           break;
//       }
//       camera.updateProjectionMatrix();
//     };

//     // Call updateCameraPosition initially and when cameraView changes
//     updateCameraPosition(cameraView);

//     // Animation loop
//     const animate = () => {
//       orbit.update();
//       renderer.render(scene, camera);
//     };

//     renderer.setAnimationLoop(animate);

//     // Cleanup
//     return () => {
//       renderer.dispose();
//       if (containerRef.current) {
//         containerRef.current.removeChild(renderer.domElement);
//       }
//     };
//   }, [cameraView]);

//   return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
// };

// export default ThreeScene;
