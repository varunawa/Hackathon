import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import satellite from "../assets/satellite.fbx";
import earthMap from "../assets/00_earthmap1k.jpg";
import earthBump from "../assets/01_earthbump1k.jpg";
import earthSpec from "../assets/02_earthspec1k.jpg";
import earthCloud from "../assets/04_earthcloudmap.jpg";
import getStarfield from "./getStarfield";

const convertGeoTo3D = (latitude, longitude, altitude, radius) => {
    const latRad = latitude * (Math.PI / 180);
    const lonRad = longitude * (Math.PI / 180);
    const x = (radius + altitude) * Math.cos(latRad) * Math.sin(lonRad);
    const y = altitude;
    const z = (radius + altitude) * Math.cos(latRad) * Math.cos(lonRad);
    return { x, y, z };
};

const Orbit = ({ latitude, longitude, altitude }) => {
    useEffect(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
        camera.position.set(0, 50, 100); // Adjust camera position as needed

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(w, h);
        document.body.appendChild(renderer.domElement);

        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.25;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const stars = getStarfield({ numStars: 2000 });
        scene.add(stars);

        const textureLoader = new THREE.TextureLoader();
        const earthGeo = new THREE.SphereGeometry(16, 30, 30);
        const earthMat = new THREE.MeshPhongMaterial({
            map: textureLoader.load(earthMap),
            bumpMap: textureLoader.load(earthBump),
            bumpScale: 0.5,
            specularMap: textureLoader.load(earthSpec),
            specular: new THREE.Color('grey'),
        });

        const earth = new THREE.Mesh(earthGeo, earthMat);
        scene.add(earth);

        const cloudGeo = new THREE.SphereGeometry(16.1, 32, 32);
        const cloudMat = new THREE.MeshLambertMaterial({
            map: textureLoader.load(earthCloud),
            transparent: true,
            opacity: 0.5,
        });
        const clouds = new THREE.Mesh(cloudGeo, cloudMat);
        scene.add(clouds);

        const coordinates = convertGeoTo3D(latitude, longitude, altitude, 16);
        const loader = new FBXLoader();
        loader.load(
            satellite,
            (object) => {
                // Adjust position and scale
                object.position.set(coordinates.x, coordinates.y + 2, coordinates.z);
                object.scale.set(0.1, 0.1, 0.1); // Scale might need adjustment
                scene.add(object);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.error("An error happened while loading the satellite model:", error);
            }
        );

        const animate = () => {
            requestAnimationFrame(animate);
            orbitControls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup on component unmount
        return () => {
            renderer.dispose();
            orbitControls.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, [latitude, longitude, altitude]);

    return <div />;
};

export default Orbit;
