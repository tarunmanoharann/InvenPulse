'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const HeroAnimation = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const gridHelper = new THREE.GridHelper(100, 15, 0x888888, 0x444444);
    scene.add(gridHelper);

    const packages: THREE.Group[] = [];
    const packageGeometry = new THREE.BoxGeometry(2.25, 1.8, 2.25, 2, 2, 2);
    const packageMaterials = [
      new THREE.MeshPhongMaterial({ color: 0xD3D3D3 }),
      new THREE.MeshPhongMaterial({ color: 0xA9A9A9 }),
      new THREE.MeshPhongMaterial({ color: 0x6945C9 }),
    ];

    const lidGeometry = new THREE.BoxGeometry(2.25, 0.3, 2.25, 2, 2, 2);

    for (let i = 0; i < 80; i++) {
      const packageGroup = new THREE.Group();
      const packageMesh = new THREE.Mesh(packageGeometry, packageMaterials[Math.floor(Math.random() * packageMaterials.length)]);
      packageGroup.add(packageMesh);

      const lidMesh = new THREE.Mesh(lidGeometry, packageMaterials[Math.floor(Math.random() * packageMaterials.length)]);
      lidMesh.position.y = 0.7;
      lidMesh.rotation.x = Math.random() * Math.PI / 4;
      packageGroup.add(lidMesh);

      const edgesGeometry = new THREE.EdgesGeometry(packageGeometry);
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      packageGroup.add(edges);

      packageGroup.position.set(
        (Math.random() - 0.5) * 50,
        Math.random() * 50 + 20,
        (Math.random() - 0.5) * 50
      );
      packageGroup.userData = { lifespan: Math.random() * 5 + 5 };
      scene.add(packageGroup);
      packages.push(packageGroup);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      packages.forEach((pkg) => {
        if (pkg.position.y > 0) {
          pkg.position.y -= 0.1 * delta * 60;
          pkg.rotation.x += 0.005 * delta * 60;
          pkg.rotation.y += 0.005 * delta * 60;
        } else {
          pkg.userData.lifespan -= delta;
          if (pkg.userData.lifespan <= 0) {
            pkg.position.y = Math.random() * 50 + 20;
            pkg.position.x = (Math.random() - 0.5) * 50;
            pkg.position.z = (Math.random() - 0.5) * 50;
            pkg.userData.lifespan = Math.random() * 5 + 5;
          }
        }

        pkg.children[1].rotation.x = Math.sin(Date.now() * 0.0005 + pkg.position.x + pkg.position.z) * Math.PI / 16;
      });

      const time = Date.now() * 0.0002;
      camera.position.x = Math.cos(time) * 40;
      camera.position.z = Math.sin(time) * 40;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          console.error("Error removing renderer:", e);
        }
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
};

export default HeroAnimation; 