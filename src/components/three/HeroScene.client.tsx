"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { SceneFallback } from "./SceneFallback";

// Animated Procedural Canvas Texture for the Console Screen
function useConsoleScreenTexture() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 340;
    canvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    setTexture(tex);

    return () => {
      tex.dispose();
    };
  }, []);

  const titles = useMemo(
    () => [
      { name: "STICKMAN PENALTY RUSH", tag: "GAME AKSI • 1K+ PLAYERS", color: "#22c55e" },
      { name: "OFFLINE PDF EDITOR & SIGN", tag: "ALAT PRODUKTIVITAS • 100% OFFLINE", color: "#0284c7" },
      { name: "MILO CAT ADVENTURE", tag: "GAME PLATFORMER • 2D RETRO", color: "#f472b6" },
      { name: "KUCING ATUR DUIT", tag: "CATAT KEUANGAN • AMAN & PRIVAT", color: "#f97316" },
      { name: "MONSTER MATH TRAIN BRAIN", tag: "EDUKASI MATEMATIKA • LATIH OTAK", color: "#8b5cf6" },
      { name: "FRUIT MATCH: MEMORY PUZZLE", tag: "GAME PUZZLE CASUAL • SANTAI", color: "#f59e0b" },
      { name: "BABY SHARK ABC LEARNING", tag: "EDUKASI BALITA • PAUD RAMAH ANAK", color: "#22d3ee" },
    ],
    []
  );

  return { texture, canvas: canvasRef.current, titles };
}

// 3D Cyber Console Component
function CyberHandheldConsole({
  screenTexture,
  screenCanvas,
  titles,
}: {
  screenTexture: THREE.CanvasTexture | null;
  screenCanvas: HTMLCanvasElement | null;
  titles: Array<{ name: string; tag: string; color: string }>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const leftStickRef = useRef<THREE.Group>(null);
  const rightStickRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Dynamic frame loop to update screen texture and smooth mouse tilt
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Smooth subtle tilt following pointer
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.35 + Math.sin(t * 0.4) * 0.05,
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.25 + Math.cos(t * 0.3) * 0.04,
        0.06
      );
    }

    // Gentle thumbstick idle wobble
    if (leftStickRef.current) {
      leftStickRef.current.rotation.x = Math.sin(t * 1.5) * 0.12;
      leftStickRef.current.rotation.z = Math.cos(t * 1.2) * 0.12;
    }
    if (rightStickRef.current) {
      rightStickRef.current.rotation.x = -Math.sin(t * 1.8) * 0.1;
      rightStickRef.current.rotation.z = Math.cos(t * 1.6) * 0.1;
    }

    // Render 2D Arcade Screen Canvas
    if (screenCanvas && screenTexture) {
      const ctx = screenCanvas.getContext("2d");
      if (ctx) {
        const w = screenCanvas.width;
        const h = screenCanvas.height;

        // Background
        ctx.fillStyle = "#090c18";
        ctx.fillRect(0, 0, w, h);

        // Top Status Header Bar
        ctx.fillStyle = "#12172b";
        ctx.fillRect(0, 0, w, 38);

        ctx.font = "bold 13px system-ui, sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("D LUCKY X OS", 18, 24);

        ctx.font = "11px monospace";
        ctx.fillStyle = "#10b981";
        ctx.fillText("● ONLINE", w - 170, 24);

        ctx.fillStyle = "#94a3b8";
        ctx.fillText("60 FPS", w - 70, 24);

        // Header separator line
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 38);
        ctx.lineTo(w, 38);
        ctx.stroke();

        // Cycling App Showcase
        const cycleIndex = Math.floor(t / 2.8) % titles.length;
        const currentItem = titles[cycleIndex];

        // Central Holographic Showcase Card
        ctx.fillStyle = "#11162a";
        ctx.beginPath();
        ctx.roundRect(24, 52, w - 48, 190, 16);
        ctx.fill();
        ctx.strokeStyle = currentItem.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Category Tag
        ctx.fillStyle = currentItem.color;
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.fillText(currentItem.tag, 42, 84);

        // Main Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px system-ui, sans-serif";
        ctx.fillText(currentItem.name, 42, 118);

        // Arcade Status Badge
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.roundRect(42, 142, 150, 30, 8);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px monospace";
        ctx.fillText("▶ PLAY READY", 56, 162);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillText("Tersedia di Google Play", 206, 162);

        // Audio Equalizer Visualizer Bars at the bottom
        const numBars = 24;
        const barWidth = 14;
        const barGap = 6;
        const startX = 24;
        const bottomY = 308;

        for (let i = 0; i < numBars; i++) {
          const barHeight = 12 + Math.abs(Math.sin(t * 4 + i * 0.45)) * 34;
          const barX = startX + i * (barWidth + barGap);

          // Gradient color across bars
          ctx.fillStyle = i % 2 === 0 ? "#06b6d4" : "#8b5cf6";
          ctx.fillRect(barX, bottomY - barHeight, barWidth, barHeight);
        }

        // Subtext at very bottom
        ctx.font = "11px monospace";
        ctx.fillStyle = "#64748b";
        ctx.fillText("TAP OR ROTATE TO INSPECT 3D STAGE", 24, 328);

        // Subtle CRT scanline overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        for (let y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 1);
        }

        screenTexture.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Main Console Chassis (Ergonomic Matte Slate Body) */}
      <RoundedBox args={[3.9, 2.3, 0.38]} radius={0.24} smoothness={8}>
        <meshStandardMaterial
          color="#121526"
          metalness={0.8}
          roughness={0.25}
        />
      </RoundedBox>

      {/* 2. Left Grip Accent Strip (Electric Cyan) */}
      <mesh position={[-1.9, 0, 0.05]}>
        <boxGeometry args={[0.08, 2.1, 0.32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* 3. Right Grip Accent Strip (Arcade Coral / Ruby) */}
      <mesh position={[1.9, 0, 0.05]}>
        <boxGeometry args={[0.08, 2.1, 0.32]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* 4. Glossy Screen Outer Frame Bezel */}
      <RoundedBox args={[2.55, 1.85, 0.4]} radius={0.08} smoothness={6} position={[0, 0, 0.01]}>
        <meshStandardMaterial
          color="#1a1e33"
          metalness={0.9}
          roughness={0.15}
        />
      </RoundedBox>

      {/* 5. The Dynamic Screen Mesh */}
      <mesh position={[0, 0, 0.205]}>
        <planeGeometry args={[2.42, 1.72]} />
        {screenTexture ? (
          <meshBasicMaterial map={screenTexture} toneMapped={false} />
        ) : (
          <meshStandardMaterial color="#090c18" roughness={0.2} />
        )}
      </mesh>

      {/* 6. Screen Glass Lens Cover (Glossy Specular Layer) */}
      <mesh position={[0, 0, 0.21]}>
        <planeGeometry args={[2.42, 1.72]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.08}
          roughness={0.05}
          reflectivity={0.9}
          clearcoat={1}
        />
      </mesh>

      {/* ---------------- LEFT CONTROLLER WING ---------------- */}
      {/* 3D D-PAD (Directional Cross) */}
      <group position={[-1.42, 0.32, 0.19]}>
        {/* Horizontal D-pad arm */}
        <RoundedBox args={[0.48, 0.18, 0.1]} radius={0.03} smoothness={4}>
          <meshStandardMaterial color="#232840" metalness={0.6} roughness={0.3} />
        </RoundedBox>
        {/* Vertical D-pad arm */}
        <RoundedBox args={[0.18, 0.48, 0.1]} radius={0.03} smoothness={4}>
          <meshStandardMaterial color="#232840" metalness={0.6} roughness={0.3} />
        </RoundedBox>
        {/* Center Pivot Indicator */}
        <mesh position={[0, 0, 0.055]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Left Analog Joystick */}
      <group ref={leftStickRef} position={[-1.42, -0.45, 0.2]}>
        {/* Joystick Base Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 16, 32]} />
          <meshStandardMaterial color="#1a1d30" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Thumbstick Cap */}
        <mesh position={[0, 0, 0.06]}>
          <cylinderGeometry args={[0.18, 0.14, 0.08, 32]} />
          <meshStandardMaterial color="#2a304e" roughness={0.4} metalness={0.4} />
        </mesh>
        {/* Textured Grip Ring */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.12, 0.12, 0.015, 24]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.6} />
        </mesh>
      </group>

      {/* ---------------- RIGHT CONTROLLER WING ---------------- */}
      {/* 4 Arcade Action Buttons in Diamond Layout */}
      <group position={[1.42, 0.32, 0.2]}>
        {/* Top Button: Y (Gold / Amber) */}
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.09, 24]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
        {/* Left Button: X (Cyan / Blue) */}
        <mesh position={[-0.19, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.09, 24]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0284c7"
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
        {/* Right Button: B (Ruby / Red) */}
        <mesh position={[0.19, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.09, 24]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
        {/* Bottom Button: A (Emerald / Green) */}
        <mesh position={[0, -0.19, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.09, 24]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Right Analog Joystick */}
      <group ref={rightStickRef} position={[1.42, -0.45, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 16, 32]} />
          <meshStandardMaterial color="#1a1d30" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <cylinderGeometry args={[0.18, 0.14, 0.08, 32]} />
          <meshStandardMaterial color="#2a304e" roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.12, 0.12, 0.015, 24]} />
          <meshStandardMaterial color="#f43f5e" roughness={0.6} />
        </mesh>
      </group>

      {/* ---------------- TOP SHOULDER TRIGGERS ---------------- */}
      {/* Left Bumper (L1) */}
      <mesh position={[-1.4, 1.15, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.28]} />
        <meshStandardMaterial color="#2a3048" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Right Bumper (R1) */}
      <mesh position={[1.4, 1.15, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.28]} />
        <meshStandardMaterial color="#2a3048" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Speaker Grille Microdots */}
      {[-1.48, -1.42, -1.36, 1.36, 1.42, 1.48].map((x, i) => (
        <mesh key={i} position={[x, -0.9, 0.2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 12]} />
          <meshBasicMaterial color="#0c0e17" />
        </mesh>
      ))}
    </group>
  );
}

// Floating 3D Arcade Objects Surrounding Console
function FloatingArcadeAssets() {
  const goldCoinRef1 = useRef<THREE.Mesh>(null);
  const goldCoinRef2 = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (goldCoinRef1.current) {
      goldCoinRef1.current.rotation.y = t * 1.6;
      goldCoinRef1.current.rotation.x = Math.sin(t * 0.7) * 0.2;
    }
    if (goldCoinRef2.current) {
      goldCoinRef2.current.rotation.y = -t * 1.4;
    }
    if (gemRef.current) {
      gemRef.current.rotation.y = t * 1.2;
      gemRef.current.rotation.z = Math.cos(t * 0.8) * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.9;
      ringRef.current.rotation.y = t * 0.6;
    }
  });

  return (
    <>
      {/* 1. Golden Game Coin (Upper Right) */}
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.4} position={[2.5, 1.4, 0.6]}>
        <mesh ref={goldCoinRef1} scale={0.42}>
          <cylinderGeometry args={[1, 1, 0.18, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.15}
            emissive="#b45309"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* 2. Secondary Mini Coin (Lower Left) */}
      <Float speed={2} rotationIntensity={0.9} floatIntensity={1.2} position={[-2.4, -1.2, 0.4]}>
        <mesh ref={goldCoinRef2} scale={0.3}>
          <cylinderGeometry args={[1, 1, 0.18, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.15}
            emissive="#b45309"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>

      {/* 3. Emerald Power Crystal (Octahedron Upper Left) */}
      <Float speed={3} rotationIntensity={1.1} floatIntensity={1.8} position={[-2.3, 1.3, 0.5]}>
        <mesh ref={gemRef} scale={0.38}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.4}
            metalness={0.4}
            roughness={0.1}
          />
        </mesh>
      </Float>

      {/* 4. Electric Cyan Neon Ring (Lower Right) */}
      <Float speed={2.2} rotationIntensity={1.3} floatIntensity={1.5} position={[2.3, -1.1, 0.4]}>
        <mesh ref={ringRef} scale={0.42}>
          <torusGeometry args={[0.75, 0.1, 16, 48]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0284c7"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </>
  );
}

// Ground Holographic Pedestal Base
function CyberPedestal() {
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={[0, -1.65, 0]}>
      {/* Concentric Glowing Cyber Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.55, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.04, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Reflective Dark Base Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[2.2, 64]} />
        <meshStandardMaterial
          color="#0b0e1c"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

export default function HeroSceneClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [hasWebGL, setHasWebGL] = useState(true);
  const { texture, canvas, titles } = useConsoleScreenTexture();

  useEffect(() => {
    // Check WebGL capability safely
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
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

  if (!hasWebGL) {
    return <SceneFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] md:h-[540px] flex items-center justify-center select-none"
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 44 }}
        dpr={[1, 1.5]}
        frameloop={isInView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.7} />
        {/* Warm Key Light */}
        <directionalLight position={[4, 6, 5]} intensity={1.6} color="#ffffff" />
        {/* Cool Rim Light (Electric Cyan) */}
        <directionalLight position={[-5, -3, -3]} intensity={1.3} color="#38bdf8" />
        {/* Bottom Fill Light (Amethyst) */}
        <pointLight position={[0, -2, 3]} intensity={0.9} color="#8b5cf6" />
        {/* Top Rim Accent */}
        <pointLight position={[0, 4, 1]} intensity={0.6} color="#f43f5e" />

        <Suspense fallback={null}>
          <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.7}>
            <CyberHandheldConsole
              screenTexture={texture}
              screenCanvas={canvas}
              titles={titles}
            />
            <FloatingArcadeAssets />
          </Float>

          <CyberPedestal />

          {/* Interactive OrbitControls: Smooth grab, tilt & rotate */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.7}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.5}
            dampingFactor={0.06}
          />
        </Suspense>
      </Canvas>

      {/* Floating Interactive Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0d1a]/85 backdrop-blur-md border border-white/10 text-[11px] text-gray-300 font-mono pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>3D CONSOLE • GESER UNTUK MEMUTAR</span>
      </div>
    </div>
  );
}
