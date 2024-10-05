import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import satellite from "../assets/satellite.fbx";

import earthMap from "../assets/00_earthmap1k.jpg";
import earthBump from "../assets/01_earthbump1k.jpg";
import earthSpec from "../assets/02_earthspec1k.jpg";
import earthLights from "../assets/03_earthlights1k.jpg";
import earthCloud from "../assets/04_earthcloudmap.jpg";
import earthCloudTrans from "../assets/05_earthcloudmaptrans.jpg";
import getStarfield from "./getStarfield";

const convertGeoTo3D = (latitude, longitude, altitude, radius) => {
    // Convert latitude and longitude to radians
    const latRad = latitude * (Math.PI / 180);
    const lonRad = longitude * (Math.PI / 180);

    // Calculate the 3D coordinates
    const x = (radius + altitude) * Math.cos(latRad) * Math.sin(lonRad);
    const y = altitude; // Altitude directly used as Y
    const z = (radius + altitude) * Math.cos(latRad) * Math.cos(lonRad);

    return { x, y, z }; // Return the coordinates as an object
};

const Orbit = ({latitude, longitude, altitude}) => {
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Create the scene
    const scene = new THREE.Scene();

    // Create the camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 100); // Set a good initial position

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

    // Starfield background
    const stars = getStarfield({ numStars: 2000 });
    scene.add(stars);
    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const earthGeo = new THREE.SphereGeometry(16, 30, 30); // 16 units radius 

    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load(earthMap),             // Earth surface texture (diffuse map)
      bumpMap: textureLoader.load(earthBump),        // Bump map for terrain relief
      bumpScale: 0.5,                                // Adjust the intensity of the bump effect
      specularMap: textureLoader.load(earthSpec),    // Specular map for shiny water areas
      specular: new THREE.Color('grey'),             // Reflective color for specular highlights
    });

    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Cloud Layer
    const cloudGeo = new THREE.SphereGeometry(16.1, 32, 32); // Slightly larger than the Earth sphere
    const cloudMat = new THREE.MeshLambertMaterial({
      map: textureLoader.load(earthCloud),           // Cloud texture
      transparent: true,                             // Enable transparency for clouds
      opacity: 0.5,                                  // Adjust cloud opacity
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);                               // Add clouds to the scene
    

    // Satellite
    console.log(latitude);
    console.log(longitude);
    console.log
    const coordinates = convertGeoTo3D(latitude, longitude, altitude, 16);
    console.log(coordinates);
    console.log("heheheh");
    const loader = new FBXLoader();
    loader.load(
      satellite,
      (object) => {
        object.position.set(0, 0, 30); // Adjust position as needed
        object.scale.set(0.025, 0.025, 0.025); // Adjust scale as necessary
        scene.add(object);
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
      earth.rotateY(0.004); // Rotate earth
      clouds.rotateY(0.002); // Rotate clouds at a slower rate
      orbit.update(); // Update controls
      renderer.render(scene, camera);
    };

    loader.load(
        satellite,
        (object) => {
          satellite = object;                             // Store reference to the loaded beacon
          object.scale.set(0.05, 0.05, 0.05);          // Scale the beacon model appropriately
          scene.add(satellite);                           // Add the beacon to the scene
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('An error occurred while loading the FBX model:', error);
        }
      );
  
      // Track beacon's orbit around the Earth
      let satelliteAngle = 0;  // Angle to track the beacon's orbit

      
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
  }, []);

  return null; // The canvas is added directly to the body
};

export default Orbit;
