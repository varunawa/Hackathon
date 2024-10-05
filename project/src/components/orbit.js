import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import earthTexture from "../assets/earth.jpg";
import starsTexture from "../assets/stars.jpg";
import beaconTexture from "../assets/beacon.jpg";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import satellite from "../assets/satellite.fbx";

import earthMap from "../assets/00_earthmap1k.jpg";
import earthBump from "../assets/01_earthbump1k.jpg";
import earthSpec from "../assets/02_earthspec1k.jpg";
import earthLights from "../assets/03_earthlights1k.jpg";
import earthCloud from "../assets/04_earthcloudmap.jpg";
import earthCloudTrans from "../assets/05_earthcloudmaptrans.jpg";
import getStarfield from "./getStarfield";

const EARTH_RADIUS = 16; // Earth radius in your 3D space
const ALTITUDE_SCALE = 0.1; // Adjust this to make altitude changes more noticeable

const convertGeoTo3D = (latitude, longitude, altitude) => {
  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);
  const r = EARTH_RADIUS + (altitude * ALTITUDE_SCALE / 6371000) * EARTH_RADIUS;

  return new THREE.Vector3(
    r * Math.cos(latRad) * Math.cos(lonRad),
    r * Math.sin(latRad),
    -r * Math.cos(latRad) * Math.sin(lonRad)
  );
};

const Orbit = ({ currentCoordinates, rotation, acceleration, dataView }) => {
  console.log('Orbit component props:', { currentCoordinates, rotation, acceleration, dataView });
  
  const satelliteRef = useRef(null);
  useEffect(() => {

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create the scene
    const scene = new THREE.Scene();

    // Create the camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(50, 0, 0); // Set a good initial position

    // Create the WebGL Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h); // Set initial size
    document.body.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; // Smooth the controls
    orbit.dampingFactor = 0.25; // Set damping factor

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Brighter light
    scene.add(ambientLight);

    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);

    // Load earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(16, 30, 30); // 16 units radius 
    const earthMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(earthTexture),
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Load beacon texture and create a new mesh for it
    // const beaconGeo = new THREE.SphereGeometry(2, 30, 30);
    // const beaconMat = new THREE.MeshBasicMaterial({
    //   map: textureLoader.load(beaconTexture),
    // });
    // const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    // earth.add(beacon); // Add beacon as a child of the earth mesh
    // beacon.position.set(20, 0, 0); // Position the beacon

    // Satellite
    // console.log(latitude);
    // console.log(longitude);
    // console.log(altitude);
    // const coordinates = convertGeoTo3D(latitude, longitude, altitude, 16);
    // console.log(coordinates);
    // console.log("heheheh");
    console.log(currentCoordinates);
    const loader = new FBXLoader();
    loader.load(
      satellite,
      (object) => {
        satelliteRef.current = object;
        satelliteRef.current.scale.set(0.01, 0.01, 0.01);
        // object.position.set(0, 0, 30); // Adjust position as needed
        // object.scale.set(0.025, 0.025, 0.025); // Adjust scale as necessary
        // scene.add(object);
        scene.add(satelliteRef.current);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("An error occurred while loading the FBX model:", error);
      }
    );

    // Animation loop
    const animate = () => {
      earth.rotateY(0.00); // Rotate earth
      orbit.update(); // Update controls
       // Update satellite position and rotation
       if (satelliteRef.current && currentCoordinates && rotation) {
        console.log('Updating satellite position:', currentCoordinates);
        
        const position = convertGeoTo3D(
          currentCoordinates.latitude,
          currentCoordinates.longitude,
          currentCoordinates.altitude,
           16 // Earth radius
        );

        satelliteRef.current.position.copy(position);

        // Update rotation (convert to radians)
        satelliteRef.current.rotation.set(
          THREE.MathUtils.degToRad(rotation.pitch),
          THREE.MathUtils.degToRad(rotation.yaw),
          THREE.MathUtils.degToRad(rotation.roll)
        );

        console.log('New satellite position:', position);
        console.log('New satellite rotation:', satelliteRef.current.rotation);

        // Add a small offset to make movement more noticeable (for debugging)
        satelliteRef.current.position.add(new THREE.Vector3(0.1, 0.1, 0.1));
      }
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Resize event listener to adjust camera and renderer when window is resized
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to dispose of the renderer and remove event listener on component unmount
    return () => {
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(renderer.domElement);
    };
  }, [currentCoordinates, rotation]);

  return null; // The canvas is added directly to the body
};

export default Orbit;
