"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SceneFallback } from "./SceneFallback";

function FloatingGeometries() {
  const groupRef = useRef<THREE.Group>(null);
  const icosahedronRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.x = t * 0.2;
      icosahedronRef.current.rotation.y = t * 0.3;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.15;
      torusRef.current.rotation.z = t * 0.25;
    }
    if (groupRef.current) {
      // Gentle mouse parallax
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Floating Structure */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        {/* Core Wireframe Icosahedron */}
        <mesh ref={icosahedronRef} scale={1.8}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#7c3aed"
            emissiveIntensity={0.6}
            wireframe
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Inner Glowing Crystal */}
        <mesh scale={0.9}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Orbiting Torus Ring */}
        <mesh ref={torusRef} scale={2.5}>
          <torusGeometry args={[1, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#f472b6"
            emissive="#ec4899"
            emissiveIntensity={0.7}
            roughness={0.3}
          />
        </mesh>
      </Float>

      {/* Orbiting Game Satellites (Representing 5 Apps) */}
      {/* App 1: Green (Stickman) */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2} position={[-2.4, 1.2, 0.5]}>
        <mesh scale={0.35}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={0.8} />
        </mesh>
      </Float>

      {/* App 2: Pink (Milo) */}
      <Float speed={3} rotationIntensity={1.8} floatIntensity={1.8} position={[2.3, 1.4, -0.5]}>
        <mesh scale={0.38}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#f472b6" emissive="#db2777" emissiveIntensity={0.8} />
        </mesh>
      </Float>

      {/* App 3: Purple (Monster Math) */}
      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.6} position={[-2.1, -1.5, -0.2]}>
        <mesh scale={0.4}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.8} />
        </mesh>
      </Float>

      {/* App 4: Cyan (Baby Shark) */}
      <Float speed={2.8} rotationIntensity={1.4} floatIntensity={2.2} position={[2.2, -1.3, 0.4]}>
        <mesh scale={0.32}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.8} />
        </mesh>
      </Float>

      {/* App 5: Amber (Fruity Merge) */}
      <Float speed={2.4} rotationIntensity={1.6} floatIntensity={1.7} position={[0, 2.5, -0.8]}>
        <mesh scale={0.3}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.8} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroSceneClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // 1. Check device capability and reduced motion preferences
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const lowConcurrency =
        typeof navigator !== "undefined" &&
        navigator.hardwareConcurrency !== undefined &&
        navigator.hardwareConcurrency <= 4;

      if (prefersReducedMotion || lowConcurrency) {
        setUseFallback(true);
        return;
      }
    }

    // 2. Pause when scrolled out of view
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (useFallback) {
    return <SceneFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={isInView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} color="#8b5cf6" intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#22d3ee" intensity={2} />
        <pointLight position={[0, 5, -5]} color="#f472b6" intensity={1} />

        <Suspense fallback={null}>
          <Stars count={500} depth={40} factor={3} saturation={0.5} fade speed={0.5} />
          <FloatingGeometries />
        </Suspense>
      </Canvas>
    </div>
  );
}
