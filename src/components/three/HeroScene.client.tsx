"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { SceneFallback } from "./SceneFallback";

// 3D Phone Chassis & Screen
function PhoneDevice() {
  const phoneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      phoneRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <group ref={phoneRef} position={[0, 0, 0]}>
      {/* Outer Phone Frame (Matte Obsidian Metal) */}
      <RoundedBox args={[2.5, 4.4, 0.22]} radius={0.28} smoothness={8}>
        <meshStandardMaterial
          color="#161824"
          metalness={0.85}
          roughness={0.25}
        />
      </RoundedBox>

      {/* Glossy Bezel Rim */}
      <RoundedBox args={[2.46, 4.36, 0.23]} radius={0.26} smoothness={8}>
        <meshStandardMaterial
          color="#282b3d"
          metalness={0.9}
          roughness={0.15}
        />
      </RoundedBox>

      {/* Glass Screen with UI Layout */}
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[2.3, 4.2]} />
        <meshStandardMaterial
          color="#0c0e17"
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Screen Game Header Banner (Cyan/Purple Gradient Bar) */}
      <mesh position={[0, 1.25, 0.125]}>
        <planeGeometry args={[2.1, 1.3]} />
        <meshStandardMaterial
          color="#1e1b4b"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Mini App Grid Mockup on Screen */}
      <group position={[0, -0.4, 0.13]}>
        {/* App row 1 */}
        <mesh position={[-0.65, 0.4, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#16a34a" roughness={0.2} />
        </mesh>
        <mesh position={[0.65, 0.4, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#db2777" roughness={0.2} />
        </mesh>

        {/* App row 2 */}
        <mesh position={[-0.65, -0.3, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.2} />
        </mesh>
        <mesh position={[0.65, -0.3, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="#ea580c" roughness={0.2} />
        </mesh>

        {/* Install CTA Bar on screen */}
        <mesh position={[0, -1.05, 0]}>
          <planeGeometry args={[1.8, 0.38]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

// 3D Shiny Metallic Game Tokens Floating Around the Phone
function FloatingTokens() {
  const coinRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const starRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coinRef.current) {
      coinRef.current.rotation.y = t * 1.2;
      coinRef.current.rotation.x = Math.sin(t * 0.8) * 0.3;
    }
    if (gemRef.current) {
      gemRef.current.rotation.y = -t * 0.9;
      gemRef.current.rotation.z = Math.cos(t * 0.7) * 0.4;
    }
    if (starRef.current) {
      starRef.current.rotation.y = t * 0.7;
    }
  });

  return (
    <>
      {/* 1. Golden Game Coin */}
      <Float speed={2.5} rotationIntensity={1} floatIntensity={1.8} position={[1.9, 1.4, 0.6]}>
        <mesh ref={coinRef} scale={0.55}>
          <cylinderGeometry args={[1, 1, 0.18, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.92}
            roughness={0.15}
            emissive="#d97706"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* 2. Emerald Game Gem (Octahedron) */}
      <Float speed={3} rotationIntensity={1.2} floatIntensity={2} position={[-1.9, 1.2, 0.5]}>
        <mesh ref={gemRef} scale={0.45}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#22c55e"
            metalness={0.4}
            roughness={0.1}
            emissive="#15803d"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* 3. Floating Cyan Arcade Ring */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5} position={[-1.7, -1.3, 0.4]}>
        <mesh ref={starRef} scale={0.5}>
          <torusGeometry args={[0.7, 0.12, 16, 48]} />
          <meshStandardMaterial
            color="#06b6d4"
            metalness={0.8}
            roughness={0.2}
            emissive="#0891b2"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>

      {/* 4. Floating Ruby Controller Button */}
      <Float speed={2.8} rotationIntensity={1.4} floatIntensity={1.6} position={[1.8, -1.2, 0.3]}>
        <mesh scale={0.38}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#f43f5e"
            metalness={0.6}
            roughness={0.2}
            emissive="#e11d48"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>
    </>
  );
}

export default function HeroSceneClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
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
      className="relative w-full h-[440px] md:h-[530px] flex items-center justify-center select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.5]}
        frameloop={isInView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Realistic Studio Lighting Setup */}
        <ambientLight intensity={0.6} />
        {/* Warm Key Light */}
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
        {/* Cool Rim Light */}
        <directionalLight position={[-6, -4, -4]} intensity={1.2} color="#38bdf8" />
        {/* Soft Front Accent Light */}
        <pointLight position={[0, -2, 4]} intensity={0.8} color="#a855f7" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
            <PhoneDevice />
            <FloatingTokens />
          </Float>

          {/* User can naturally grab and rotate the 3D phone */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.5}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Subtle Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-gray-500 font-medium px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/5 pointer-events-none">
        Sentuh &amp; geser untuk memutar 3D
      </div>
    </div>
  );
}
