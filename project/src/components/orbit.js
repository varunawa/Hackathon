import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earthTexture from '../assets/earth.jpg';
import starsTexture from '../assets/stars.jpg';
import beaconTexture from '../assets/beacon.jpg';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import satellite from "../assets/satellite.fbx";

import earthMap from '../assets/00_earthmap1k.jpg';
import earthBump from '../assets/01_earthbump1k.jpg';
import earthSpec from '../assets/02_earthspec1k.jpg';
import earthLights from '../assets/03_earthlights1k.jpg';
import earthCloud from '../assets/04_earthcloudmap.jpg';
import earthCloudTrans from '../assets/05_earthcloudmaptrans.jpg';
import getStarfield from './getStarfield';


const Orbit = () => {

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create the scene
    const scene = new THREE.Scene();

    // Create the camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 100); // Set a good initial position

    // Create the WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h); // Set initial size
    document.body.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; // Smooth the controls
    orbit.dampingFactor = 0.25;  // Set damping factor

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Brighter light
    scene.add(ambientLight);


    // // Load stars background texture for the scene
    // const cubeTextureLoader = new THREE.CubeTextureLoader();
    // scene.background = cubeTextureLoader.load([
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    // ]);

    // Load stars background texture for the scene
    // const cubeTextureLoader = new THREE.CubeTextureLoader();
    // scene.background = cubeTextureLoader.load([
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    //   starsTexture,
    // ]);
    
    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);


    // Load earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(16, 30, 30);
    const earthMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(earthTexture),
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Load beacon texture and create a new mesh for it
    const beaconGeo = new THREE.SphereGeometry(2, 30, 30);
    const beaconMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(beaconTexture),
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    earth.add(beacon); // Add beacon as a child of the earth mesh
    beacon.position.set(20, 0, 0); // Position the beacon

    // Load the FBX model
    // const loader = new FBXLoader();
    // loader.load(
    //   satellite,
    //   (object) => {
    //     // Set model position and scale here
    //     object.position.set(0, 0, 0);
    //     object.scale.set(0.5, 0.5, 0.5); // Adjust scale as necessary
    //     scene.add(object);
    //   },
    //   (xhr) => {
    //     console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //   },
    //   (error) => {
    //     console.error('An error occurred while loading the FBX model:', error);
    //   }
    // );

    // Animation loop
    const animate = () => {
      earth.rotateY(0.004); // Rotate earth
      orbit.update(); // Update controls
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Resize event listener to adjust camera and renderer when window is resized
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to dispose of the renderer and remove event listener on component unmount
    return () => {
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // The canvas is added directly to the body
};

export default Orbit;
