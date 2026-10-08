"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SceneFallback } from "./SceneFallback";

// Individual Interactive Kinetic Kinetic Element
function KineticShape({
  position,
  scale = 1,
  type = "sphere",
  color = "#ffffff",
  roughness = 0.2,
  metalness = 0.1,
  speed = 1.5,
  repelFactor = 1.0,
}: {
  position: [number, number, number];
  scale?: number;
  type?: "sphere" | "torus" | "capsule" | "octahedron" | "cylinder";
  color?: string;
  roughness?: number;
  metalness?: number;
  speed?: number;
  repelFactor?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const currentPos = useRef(new THREE.Vector3(...position));
  const velocity = useRef(new THREE.Vector3());
  const { pointer, viewport } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed;

    // Subtle natural floating motion
    const targetY = initialPos.y + Math.sin(t) * 0.2;
    const targetX = initialPos.x + Math.cos(t * 0.8) * 0.15;
    const targetZ = initialPos.z + Math.sin(t * 0.6) * 0.15;

    // Calculate pointer distance in viewport space
    const pointer3D = new THREE.Vector3(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    const distToPointer = currentPos.current.distanceTo(pointer3D);
    const repelRadius = 3.2;

    if (distToPointer < repelRadius) {
      // Repel gently from cursor
      const repelDir = currentPos.current.clone().sub(pointer3D).normalize();
      const force = (1 - distToPointer / repelRadius) * repelFactor * 1.8;
      velocity.current.add(repelDir.multiplyScalar(force * delta * 5));
    }

    // Spring back toward target
    const springForce = new THREE.Vector3(targetX, targetY, targetZ)
      .sub(currentPos.current)
      .multiplyScalar(3.0 * delta);
    velocity.current.add(springForce);

    // Apply damping
    velocity.current.multiplyScalar(0.92);
    currentPos.current.add(velocity.current);

    meshRef.current.position.copy(currentPos.current);

    // Gentle continuous rotation
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;
  });

  const renderGeometry = () => {
    switch (type) {
      case "torus":
        return <torusGeometry args={[0.7, 0.22, 24, 48]} />;
      case "capsule":
        return <capsuleGeometry args={[0.35, 0.7, 16, 32]} />;
      case "octahedron":
        return <octahedronGeometry args={[0.65, 0]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 0.25, 32]} />;
      case "sphere":
      default:
        return <sphereGeometry args={[0.55, 36, 36]} />;
    }
  };

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        {renderGeometry()}
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

// Interactive Ambient Kinetic Installation
function KineticField() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer, viewport } = useThree();

  // Subtle group tilt following pointer
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.15,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.12,
        0.04
      );
    }
  });

  // Responsive scale based on viewport width
  const responsiveScale = Math.min(1.0, Math.max(0.65, viewport.width / 14));

  return (
    <group ref={groupRef} scale={responsiveScale}>
      {/* Left Cluster: Clean playful tactile shapes */}
      <KineticShape
        position={[-4.5, 1.8, -0.5]}
        scale={1.25}
        type="sphere"
        color="#ffffff"
        roughness={0.15}
        metalness={0.05}
        speed={1.2}
      />
      <KineticShape
        position={[-3.6, -0.2, 0.8]}
        scale={1.05}
        type="torus"
        color="#10b981"
        roughness={0.25}
        metalness={0.2}
        speed={1.4}
      />
      <KineticShape
        position={[-4.8, -1.8, -0.2]}
        scale={0.9}
        type="capsule"
        color="#38bdf8"
        roughness={0.2}
        metalness={0.1}
        speed={1.0}
      />
      <KineticShape
        position={[-2.4, 2.5, -1.2]}
        scale={0.65}
        type="octahedron"
        color="#fbbf24"
        roughness={0.1}
        metalness={0.4}
        speed={1.6}
      />

      {/* Right Cluster: Complementary vibrant soft pastel shapes */}
      <KineticShape
        position={[4.6, 1.6, -0.3]}
        scale={1.2}
        type="torus"
        color="#ec4899"
        roughness={0.2}
        metalness={0.15}
        speed={1.3}
      />
      <KineticShape
        position={[3.8, -0.4, 0.6]}
        scale={1.15}
        type="sphere"
        color="#ffffff"
        roughness={0.12}
        metalness={0.05}
        speed={1.1}
      />
      <KineticShape
        position={[4.5, -2.0, -0.4]}
        scale={0.95}
        type="octahedron"
        color="#8b5cf6"
        roughness={0.15}
        metalness={0.2}
        speed={1.5}
      />
      <KineticShape
        position={[2.6, 2.3, -1.0]}
        scale={0.7}
        type="cylinder"
        color="#f59e0b"
        roughness={0.2}
        metalness={0.3}
        speed={1.4}
      />

      {/* Background Floating Ambient Dots */}
      {[
        [-5.5, 0.2, -2.5],
        [5.2, 0.1, -2.8],
        [-1.2, 3.2, -2.0],
        [1.4, 3.0, -2.2],
        [-3.0, -2.8, -1.5],
        [3.2, -2.9, -1.8],
      ].map((pos, idx) => (
        <Float key={idx} speed={2 + idx * 0.4} floatIntensity={0.6}>
          <mesh position={pos as [number, number, number]} scale={0.18}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#10b981" : "#38bdf8"}
              roughness={0.3}
              emissive={idx % 2 === 0 ? "#10b981" : "#38bdf8"}
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function HeroSceneClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!hasWebGL) {
    return <SceneFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full select-none pointer-events-auto"
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 48 }}
        dpr={[1, 1.5]}
        frameloop={isInView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Soft Daylight Studio Lighting */}
        <ambientLight intensity={1.1} color="#ffffff" />
        <directionalLight position={[6, 9, 6]} intensity={2.2} color="#fffbeb" />
        <directionalLight position={[-6, 4, -3]} intensity={1.2} color="#f0fdf4" />
        <pointLight position={[0, 6, 3]} intensity={0.8} color="#ffffff" />

        <Suspense fallback={null}>
          <KineticField />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.4}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.7}
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
