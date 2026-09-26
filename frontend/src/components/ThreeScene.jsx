import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

const THREE_CDN = "https://unpkg.com/three@0.170.0/build/three.min.js";

export default function ThreeScene() {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    let disposed = false;
    let animationId = 0;
    let cleanup = () => {};

    const start = () => {
      if (disposed || !mountRef.current || !window.THREE) return;
      const THREE = window.THREE;
      const mount = mountRef.current;
      mount.innerHTML = "";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 100);
      camera.position.set(0, 0, 7.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      const accent = theme === "dark" ? 0x8e7dff : 0x6657e8;
      const glow = theme === "dark" ? 0x58d6ff : 0x7368ff;
      const particleColor = theme === "dark" ? 0xcfc9ff : 0x6d62e8;

      const root = new THREE.Group();
      scene.add(root);

      // Central AI evaluation core.
      const coreGeo = new THREE.IcosahedronGeometry(1.05, 2);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: accent,
        roughness: 0.18,
        metalness: 0.55,
        transmission: 0.05,
        transparent: true,
        opacity: 0.92,
        wireframe: true,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      root.add(core);

      const innerGeo = new THREE.SphereGeometry(0.62, 32, 32);
      const innerMat = new THREE.MeshBasicMaterial({ color: glow, transparent: true, opacity: 0.13 });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      root.add(inner);

      // Three tilted scanning rings.
      const rings = [];
      for (let i = 0; i < 3; i += 1) {
        const geo = new THREE.TorusGeometry(1.55 + i * 0.18, 0.012 + i * 0.004, 10, 120);
        const mat = new THREE.MeshBasicMaterial({ color: i === 1 ? glow : accent, transparent: true, opacity: 0.52 - i * 0.1 });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.set(Math.PI / 2 + i * 0.22, i * 0.7, i * 0.8);
        root.add(ring);
        rings.push(ring);
      }

      // Orbiting "evaluation nodes".
      const nodeGroup = new THREE.Group();
      root.add(nodeGroup);
      const nodeGeo = new THREE.SphereGeometry(0.055, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: glow });
      for (let i = 0; i < 9; i += 1) {
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        const a = (i / 9) * Math.PI * 2;
        node.position.set(Math.cos(a) * 2.05, Math.sin(a * 1.3) * 0.65, Math.sin(a) * 1.35);
        nodeGroup.add(node);
      }

      // Fine star field.
      const stars = new THREE.BufferGeometry();
      const starPositions = [];
      const starCount = 420;
      for (let i = 0; i < starCount; i += 1) {
        starPositions.push(
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 5 - 0.5
        );
      }
      stars.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: particleColor,
        size: theme === "dark" ? 0.018 : 0.012,
        transparent: true,
        opacity: theme === "dark" ? 0.62 : 0.32,
      });
      const starField = new THREE.Points(stars, starMat);
      scene.add(starField);

      // Connecting line network around the core.
      const linePoints = [];
      for (let i = 0; i < 12; i += 1) {
        const a = (i / 12) * Math.PI * 2;
        linePoints.push(new THREE.Vector3(Math.cos(a) * 2.2, Math.sin(a) * 0.9, Math.sin(a) * 1.7));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.14 });
      const network = new THREE.LineLoop(lineGeo, lineMat);
      root.add(network);

      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const keyLight = new THREE.PointLight(glow, 18, 13);
      keyLight.position.set(2.4, 2.5, 4);
      scene.add(keyLight);
      const fillLight = new THREE.PointLight(accent, 9, 9);
      fillLight.position.set(-3, -1, 2);
      scene.add(fillLight);

      let targetX = 0;
      let targetY = 0;
      const onPointer = (event) => {
        targetX = (event.clientX / window.innerWidth - 0.5) * 0.6;
        targetY = (event.clientY / window.innerHeight - 0.5) * 0.35;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const resize = () => {
        if (!mount.clientWidth || !mount.clientHeight) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("resize", resize);

      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        root.rotation.y += (targetX - root.rotation.y) * 0.012;
        root.rotation.x += (-targetY - root.rotation.x) * 0.012;
        core.rotation.y = t * 0.23;
        core.rotation.x = Math.sin(t * 0.6) * 0.18;
        inner.scale.setScalar(1 + Math.sin(t * 1.7) * 0.08);
        rings[0].rotation.z = t * 0.22;
        rings[1].rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.18;
        rings[1].rotation.z = -t * 0.16;
        rings[2].rotation.y = t * 0.14;
        nodeGroup.rotation.y = -t * 0.28;
        network.rotation.z = t * 0.07;
        starField.rotation.y = t * 0.006;
        starField.rotation.x = Math.sin(t * 0.08) * 0.04;
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        [coreGeo, coreMat, innerGeo, innerMat, ...rings.flatMap((r) => [r.geometry, r.material]), nodeGeo, nodeMat, stars, starMat, lineGeo, lineMat].forEach((item) => item?.dispose?.());
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    };

    if (window.THREE) start();
    else {
      const script = document.createElement("script");
      script.src = THREE_CDN;
      script.async = true;
      script.onload = start;
      document.head.appendChild(script);
    }

    return () => { disposed = true; cleanup(); };
  }, [theme]);

  return <div ref={mountRef} className="threeScene" aria-hidden="true" />;
}
