import React, { useEffect } from 'react';
import * as THREE from 'three';
import earth from '../assets/earth.jpg';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earthMap from '../assets/00_earthmap1k.jpg';
import earthBump from '../assets/01_earthbump1k.jpg';
import earthSpec from '../assets/02_earthspec1k.jpg';
import earthLights from '../assets/03_earthlights1k.jpg';
import earthCloud from '../assets/04_earthcloudmap.jpg';
import earthCloudTrans from '../assets/05_earthcloudmaptrans.jpg';
import getStarfield from './getStarfield';
import { getFresnelMat } from './getFresnelMat';

const Globe = () => {
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    // camera.position.set(0, 0, 5); // Ensure camera is close enough to see the globe
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth controls
    controls.dampingFactor = 0.25; // Set damping factor

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);

    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, 16);
    const material = new THREE.MeshStandardMaterial({
      map: loader.load(earth),
      specularMap: loader.load(earthSpec),
      bumpMap: loader.load(earthBump),
      bumpScale: 0.04,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // Lights
    // const lightsMat = new THREE.MeshBasicMaterial({
    //   map: loader.load(earthLights),
    //   blending: THREE.AdditiveBlending,
    // });

    // const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    // earthGroup.add(lightsMesh);

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load(earthCloud),
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      alphaMap: loader.load(earthCloudTrans),
    });

    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);

    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);


    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(2, 2, 5); // Position the sun light correctly
    scene.add(sunLight);

    // Animation loop
    const animate = () => {
      earthMesh.rotation.y += 0.002;
    //   lightsMesh.rotation.y += 0.002;
      cloudsMesh.rotation.y += 0.0023;
      stars.rotation.y -= 0.0002;
      controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
      renderer.render(scene, camera);
      requestAnimationFrame(animate); // Use requestAnimationFrame for the animation loop
    };

    animate(); // Start the animation loop

    // Cleanup function to dispose of the renderer on component unmount
    return () => {
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // The canvas is added directly to the body
};

export default Globe;
