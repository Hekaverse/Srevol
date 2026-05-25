"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const routes = [
  { code: "SV-005", city: "Bali", lat: -8.4, lon: 115.2, tier: "horizon" },
  { code: "SV-009", city: "Tulum", lat: 20.2, lon: -87.4, tier: "horizon" },
  { code: "SV-010", city: "Costa Rica", lat: 9.7, lon: -84.0, tier: "horizon" },
  { code: "SV-011", city: "Portugal", lat: 37.0, lon: -8.0, tier: "horizon" },
  { code: "SV-012", city: "Morocco", lat: 31.6, lon: -7.9, tier: "horizon" },
  { code: "SV-001", city: "Santorini", lat: 36.4, lon: 25.4, tier: "meridian" },
  { code: "SV-019", city: "Amalfi", lat: 40.6, lon: 14.6, tier: "meridian" },
  { code: "SV-006", city: "Kyoto", lat: 35.0, lon: 135.7, tier: "meridian" },
  { code: "SV-020", city: "Swiss Alps", lat: 46.8, lon: 8.2, tier: "meridian" },
  { code: "SV-002", city: "Maldives", lat: 3.2, lon: 73.2, tier: "meridian" },
  { code: "SV-003", city: "Bora Bora", lat: -16.5, lon: -151.7, tier: "celestial" },
  { code: "SV-004", city: "Seychelles", lat: -4.6, lon: 55.4, tier: "celestial" },
  { code: "SV-013", city: "Patagonia", lat: -50.9, lon: -73.2, tier: "celestial" },
  { code: "SV-014", city: "Kenya", lat: -1.3, lon: 36.8, tier: "celestial" },
  { code: "SV-015", city: "Norway", lat: 62.0, lon: 6.0, tier: "celestial" },
  { code: "SV-016", city: "Private Island", lat: 18.2, lon: -65.0, tier: "astral" },
  { code: "SV-017", city: "Antarctica", lat: -82.8, lon: 135.0, tier: "astral" },
  { code: "SV-018", city: "Around World", lat: 0, lon: 0, tier: "astral" },
  { code: "SV-007", city: "Paris", lat: 48.8, lon: 2.3, tier: "meridian" },
  { code: "SV-008", city: "Dubai", lat: 25.2, lon: 55.2, tier: "meridian" },
];

const tierColors: Record<string, number> = {
  horizon: 0xC9A87C,
  meridian: 0xC97B7B,
  celestial: 0xD4A574,
  astral: 0xE8C9A0,
};

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Dot matrix sphere
    const dotCount = 3000;
    const dotGeometry = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      const r = 1.0;

      dotPositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      dotPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      dotPositions[i * 3 + 2] = r * Math.cos(phi);

      // Slightly warm tinted dots
      const brightness = 0.08 + Math.random() * 0.06;
      dotColors[i * 3] = brightness * 1.0;
      dotColors[i * 3 + 1] = brightness * 0.95;
      dotColors[i * 3 + 2] = brightness * 0.90;
    }

    dotGeometry.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotGeometry.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));

    const dotMaterial = new THREE.PointsMaterial({
      size: 0.008,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const dotSphere = new THREE.Points(dotGeometry, dotMaterial);
    globeGroup.add(dotSphere);

    // Route markers
    const markers: THREE.Mesh[] = [];
    routes.forEach((route) => {
      const pos = latLonToVector3(route.lat, route.lon, 1.02);
      const color = tierColors[route.tier];

      // Marker dot
      const markerGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      globeGroup.add(marker);
      markers.push(marker);

      // Glow ring
      const ringGeo = new THREE.RingGeometry(0.03, 0.04, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ring);

      // Arc to hub (slightly offset from center)
      const hubPos = latLonToVector3(35, 20, 1.02);
      const curve = new THREE.QuadraticBezierCurve3(
        pos,
        pos.clone().add(hubPos).multiplyScalar(0.5).normalize().multiplyScalar(1.3),
        hubPos
      );
      const arcPoints = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 });
      const arc = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arc);
    });

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y,
        };
        targetRotationY += deltaMove.x * 0.005;
        targetRotationX += deltaMove.y * 0.005;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: e.touches[0].clientX - previousMousePosition.x,
          y: e.touches[0].clientY - previousMousePosition.y,
        };
        targetRotationY += deltaMove.x * 0.005;
        targetRotationX += deltaMove.y * 0.005;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);
    container.addEventListener("touchend", onTouchEnd);

    // Animation
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto rotation
      if (!isDragging) {
        targetRotationY += 0.001;
      }

      // Smooth rotation
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;

      // Mouse parallax (subtle tilt)
      globeGroup.rotation.z += (mouseX * 0.05 - globeGroup.rotation.z) * 0.02;

      // Pulse markers
      const time = Date.now() * 0.001;
      markers.forEach((marker, i) => {
        const scale = 1 + Math.sin(time * 2 + i) * 0.2;
        marker.scale.setScalar(scale);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ height: "clamp(400px, 50vh, 600px)", cursor: "grab" }}
    />
  );
}
