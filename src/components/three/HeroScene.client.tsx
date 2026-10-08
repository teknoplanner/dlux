"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SceneFallback } from "./SceneFallback";

// Crystalline Glass/Prism Material with Iridescent Refraction
function PrismCrystalMaterial({ isHovered }: { isHovered?: boolean }) {
  return (
    <meshPhysicalMaterial
      color="#ffffff"
      roughness={isHovered ? 0.04 : 0.08}
      metalness={0.12}
      transmission={0.88}
      ior={1.54}
      thickness={1.4}
      specularColor="#38bdf8"
      specularIntensity={1.0}
      clearcoat={1.0}
      clearcoatRoughness={0.08}
      iridescence={0.75}
      iridescenceIOR={1.38}
      attenuationColor="#e0f2fe"
      attenuationDistance={1.2}
      transparent
      opacity={0.95}
    />
  );
}

// Single Hexagonal Crystal Arm with Dendritic Branches
function CrystalArm({
  rotationZ,
  isHovered,
}: {
  rotationZ: number;
  isHovered: boolean;
}) {
  return (
    <group rotation={[0, 0, rotationZ]}>
      {/* Main Arm Shaft */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.045, 0.09, 2.2, 6]} />
        <PrismCrystalMaterial isHovered={isHovered} />
      </mesh>

      {/* Arm Tip Crystal Diamond */}
      <mesh position={[0, 2.45, 0]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.2, 0]} />
        <PrismCrystalMaterial isHovered={isHovered} />
      </mesh>

      {/* Inner Branchlets at 60 degrees */}
      <group position={[0, 0.95, 0]}>
        <mesh position={[0.32, 0.18, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <cylinderGeometry args={[0.03, 0.055, 0.75, 6]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
        <mesh position={[-0.32, 0.18, 0]} rotation={[0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.03, 0.055, 0.75, 6]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
        {/* Diamond caps on inner branchlets */}
        <mesh position={[0.62, 0.36, 0]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.09, 0]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
        <mesh position={[-0.62, 0.36, 0]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.09, 0]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
      </group>

      {/* Outer Branchlets at 60 degrees */}
      <group position={[0, 1.7, 0]}>
        <mesh position={[0.26, 0.15, 0]} rotation={[0, 0, -Math.PI / 3]}>
          <cylinderGeometry args={[0.025, 0.045, 0.6, 6]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
        <mesh position={[-0.26, 0.15, 0]} rotation={[0, 0, Math.PI / 3]}>
          <cylinderGeometry args={[0.025, 0.045, 0.6, 6]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
        {/* Diamond caps on outer branchlets */}
        <mesh position={[0.5, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.075, 0]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
        <mesh position={[-0.5, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.075, 0]} />
          <PrismCrystalMaterial isHovered={isHovered} />
        </mesh>
      </group>
    </group>
  );
}

// The Majestic Procedural Snowflake / Prism Crystal
function CrystallizeStructure({ isHovered }: { isHovered: boolean }) {
  const crystalGroupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!crystalGroupRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle auto-rotation and pointer tilt
    crystalGroupRef.current.rotation.z = t * 0.12;
    crystalGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      crystalGroupRef.current.rotation.y,
      pointer.x * 0.35 + Math.sin(t * 0.4) * 0.08,
      0.05
    );
    crystalGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      crystalGroupRef.current.rotation.x,
      -pointer.y * 0.25 + Math.cos(t * 0.3) * 0.06,
      0.05
    );
  });

  return (
    <group ref={crystalGroupRef}>
      {/* Central Hexagonal Core Nucleus */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.32, 6]} />
        <PrismCrystalMaterial isHovered={isHovered} />
      </mesh>

      {/* Central Star Gem Core */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <PrismCrystalMaterial isHovered={isHovered} />
      </mesh>

      {/* Concentric Inner Facet Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.035, 16, 48]} />
        <PrismCrystalMaterial isHovered={isHovered} />
      </mesh>

      {/* 6 Radial Symmetrical Crystal Arms */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <CrystalArm
          key={i}
          rotationZ={(i / 6) * Math.PI * 2}
          isHovered={isHovered}
        />
      ))}
    </group>
  );
}

// Ambient Floating Prismatic Spores / Ice Dust
function FloatingPrismaticDust() {
  const dustCount = 32;
  const particles = useMemo(() => {
    return Array.from({ length: dustCount }, () => ({
      position: [
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5 - 1,
      ] as [number, number, number],
      scale: 0.06 + Math.random() * 0.12,
      speed: 1.0 + Math.random() * 1.5,
    }));
  }, []);

  return (
    <>
      {particles.map((p, idx) => (
        <Float key={idx} speed={p.speed} rotationIntensity={0.6} floatIntensity={0.8} position={p.position}>
          <mesh scale={p.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={idx % 3 === 0 ? "#38bdf8" : idx % 3 === 1 ? "#10b981" : "#ffffff"}
              roughness={0.15}
              metalness={0.2}
              emissive={idx % 3 === 0 ? "#0284c7" : "#059669"}
              emissiveIntensity={0.25}
              transparent
              opacity={0.7}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Main Interactive Scene Stage
function CrystalStage() {
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();

  // Responsive scale to fit mobile or ultra-wide gracefully
  const responsiveScale = Math.min(1.05, Math.max(0.68, viewport.width / 11));

  return (
    <group
      scale={responsiveScale}
      onPointerOver={() => {
        setIsHovered(true);
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.35}>
        <CrystallizeStructure isHovered={isHovered} />
      </Float>

      <FloatingPrismaticDust />
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
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={isInView ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Prismatic Studio Lighting for Facet Dispersion */}
        <ambientLight intensity={1.0} color="#ffffff" />
        {/* Warm Key Light */}
        <directionalLight position={[5, 7, 6]} intensity={2.4} color="#fffbf0" />
        {/* Cool Ice Cyan Rim Light */}
        <directionalLight position={[-6, -4, -4]} intensity={1.8} color="#38bdf8" />
        {/* Emerald Specular Accent Light */}
        <pointLight position={[-3, 4, 3]} intensity={1.5} color="#10b981" />
        {/* Prismatic Violet Specular Glint */}
        <pointLight position={[3, -3, 2]} intensity={1.3} color="#c084fc" />

        <Suspense fallback={null}>
          <CrystalStage />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3.0}
            maxPolarAngle={Math.PI / 1.5}
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
