import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { WorldAudio } from "./WorldAudio";

export interface ActiveMinigame {
  id: "ring_trial" | "penalty_kick" | "crystal_runes" | "airdrop_hunt";
  title: string;
  island: string;
  instructions: string;
  score: number;
  targetScore: number;
  timeLeft: number;
  totalTime: number;
  status: "playing" | "won" | "lost";
}

export interface NPCData {
  id: string;
  name: string;
  title: string;
  island: string;
  pos: THREE.Vector3;
  dialogue: string[];
  avatar: string;
  arcadeChallenge?: {
    id: "ring_trial" | "penalty_kick" | "crystal_runes" | "airdrop_hunt";
    title: string;
    instructions: string;
    badge: string;
  };
}

export interface IslandPOI {
  id: string;
  name: string;
  pos: THREE.Vector3;
  desc: string;
  tag: string;
}

export interface EngineCallbacks {
  onCoinsUpdate?: (coins: number, total: number) => void;
  onLocationUpdate?: (location: string) => void;
  onSpeedUpdate?: (speedKmH: number) => void;
  onNitroUpdate?: (nitroPct: number) => void;
  onGoal?: () => void;
  onProximityChange?: (npc: NPCData | null) => void;
  onQuestProgress?: (questId: string) => void;
  onMinigameUpdate?: (game: ActiveMinigame | null) => void;
}

export type SolidCollider =
  | { type?: "circle"; x: number; z: number; radius: number; label?: string }
  | { type: "box"; minX: number; maxX: number; minZ: number; maxZ: number; label?: string };

export interface BridgeData {
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  width: number;
  arch: number;
}

function getBridgeHeightAt(px: number, pz: number, br: BridgeData): number | null {
  const dx = br.p2.x - br.p1.x;
  const dz = br.p2.z - br.p1.z;
  const lenSq = dx * dx + dz * dz;
  if (lenSq === 0) return null;
  const t = ((px - br.p1.x) * dx + (pz - br.p1.z) * dz) / lenSq;
  if (t < -0.02 || t > 1.02) return null;
  const clampedT = Math.max(0, Math.min(1, t));
  const projX = br.p1.x + clampedT * dx;
  const projZ = br.p1.z + clampedT * dz;
  const dist = Math.hypot(px - projX, pz - projZ);
  if (dist <= br.width / 2 + 0.3) {
    const baseH = br.p1.y * (1 - clampedT) + br.p2.y * clampedT;
    const archH = br.arch * 4 * clampedT * (1 - clampedT);
    return baseH + archH;
  }
  return null;
}

function getPathHeightAt(
  px: number,
  pz: number,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  width: number,
  height: number
): number | null {
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;
  const lenSq = dx * dx + dz * dz;
  if (lenSq === 0) return null;
  const t = ((px - p1.x) * dx + (pz - p1.z) * dz) / lenSq;
  if (t < -0.06 || t > 1.06) return null;
  const clampedT = Math.max(0, Math.min(1, t));
  const projX = p1.x + clampedT * dx;
  const projZ = p1.z + clampedT * dz;
  const dist = Math.hypot(px - projX, pz - projZ);
  if (dist <= width / 2 + 1.2) {
    return height;
  }
  return null;
}

// =============================================================================
// PROCEDURAL CANVAS TEXTURE GENERATORS
// =============================================================================

function createSoccerBallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#0f172a";
    const r = 24;
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 10; col++) {
        if ((row + col) % 2 === 0) {
          const cx = col * 55 + 24;
          const cy = row * 45 + 20;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

function createGoalNetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 2.5;
    const step = 16;
    for (let i = -128; i <= 256; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 128, 128);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i, 128);
      ctx.lineTo(i + 128, 0);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 4);
  return tex;
}

function createMiloFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Orange Tabby background
    ctx.fillStyle = "#f97316";
    ctx.fillRect(0, 0, 512, 256);

    // Tabby forehead stripes
    ctx.fillStyle = "#c2410c";
    ctx.beginPath();
    ctx.moveTo(256, 20);
    ctx.lineTo(246, 70);
    ctx.lineTo(266, 70);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(216, 25);
    ctx.lineTo(210, 65);
    ctx.lineTo(230, 65);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(296, 25);
    ctx.lineTo(302, 65);
    ctx.lineTo(282, 65);
    ctx.fill();

    // Cute big eyes with white catchlight
    // Left eye
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.ellipse(190, 110, 26, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(182, 100, 10, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.ellipse(322, 110, 26, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(314, 100, 10, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = "#431407";
    ctx.lineWidth = 3;
    // Left whiskers
    ctx.beginPath();
    ctx.moveTo(130, 140);
    ctx.lineTo(70, 130);
    ctx.moveTo(130, 150);
    ctx.lineTo(65, 155);
    ctx.stroke();

    // Right whiskers
    ctx.beginPath();
    ctx.moveTo(382, 140);
    ctx.lineTo(442, 130);
    ctx.moveTo(382, 150);
    ctx.lineTo(447, 155);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

function createNPCFaceTexture(npcId: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const baseColors: Record<string, string> = {
      lexa: "#fed7aa", // warm golden peach
      valen: "#fef3c7", // noble fair ivory
      jax: "#fdba74",   // outdoors bronze
      leo: "#fed7aa",   // athletic sun-kissed
    };
    ctx.fillStyle = baseColors[npcId] || "#fed7aa";
    ctx.fillRect(0, 0, 512, 256);

    // Cute blush cheeks for Lexa and Leo
    if (npcId === "lexa" || npcId === "leo") {
      ctx.fillStyle = "rgba(244, 114, 182, 0.45)";
      ctx.beginPath();
      ctx.ellipse(170, 130, 24, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(342, 130, 24, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (npcId === "jax") {
      // Tactical Aviator Sunglasses with gold rims & reflective glare
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 4;

      // Left lens
      ctx.beginPath();
      ctx.ellipse(200, 105, 45, 34, 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right lens
      ctx.beginPath();
      ctx.ellipse(312, 105, 45, 34, -0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Bridge connection
      ctx.beginPath();
      ctx.moveTo(245, 95);
      ctx.lineTo(267, 95);
      ctx.stroke();

      // Lens glare reflection
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.beginPath();
      ctx.ellipse(185, 95, 12, 18, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(297, 95, 12, 18, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Smirk mouth
      ctx.strokeStyle = "#7c2d12";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(240, 168);
      ctx.quadraticCurveTo(260, 166, 276, 158);
      ctx.stroke();
    } else {
      // Big Expressive Chibi/Anime Eyes with Iris Glow & Sparkles
      const irisColors: Record<string, string> = {
        lexa: "#10b981", // Emerald green
        valen: "#0284c7", // Sapphire blue
        leo: "#f59e0b",   // Golden amber
      };
      const irisColor = irisColors[npcId] || "#0284c7";

      // White Sclera
      ctx.fillStyle = "#ffffff";
      // Left eye
      ctx.beginPath();
      ctx.ellipse(195, 105, 30, 36, 0, 0, Math.PI * 2);
      ctx.fill();
      // Right eye
      ctx.beginPath();
      ctx.ellipse(317, 105, 30, 36, 0, 0, Math.PI * 2);
      ctx.fill();

      // Colored Iris
      ctx.fillStyle = irisColor;
      ctx.beginPath();
      ctx.ellipse(198, 105, 20, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(314, 105, 20, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dark Pupil
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.ellipse(200, 107, 11, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(312, 107, 11, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Big Sparkle Highlights
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(192, 95, 8, 0, Math.PI * 2);
      ctx.arc(206, 115, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(306, 95, 8, 0, Math.PI * 2);
      ctx.arc(320, 115, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyelashes & Brows
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 4;
      // Brows
      ctx.beginPath();
      ctx.moveTo(170, 72);
      ctx.quadraticCurveTo(195, 64, 225, 72);
      ctx.moveTo(287, 72);
      ctx.quadraticCurveTo(317, 64, 342, 72);
      ctx.stroke();

      // Friendly smile mouth
      ctx.strokeStyle = "#991b1b";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(256, 155, 14, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Leo sports band-aid on cheek
      if (npcId === "leo") {
        ctx.fillStyle = "#fde047";
        ctx.save();
        ctx.translate(345, 132);
        ctx.rotate(0.3);
        ctx.fillRect(-15, -6, 30, 12);
        ctx.restore();
      }
    }
  }
  return new THREE.CanvasTexture(canvas);
}

export class WorldEngine {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  public audio: WorldAudio;
  public callbacks: EngineCallbacks;

  // Clock & Loop
  private clock: THREE.Clock;
  private reqId: number = 0;
  private isRunning: boolean = false;

  // Milo Space Hero Cat Model
  public playerGroup: THREE.Group;
  private catMeshGroup: THREE.Group;
  private leftLeg: THREE.Group | null = null;
  private rightLeg: THREE.Group | null = null;
  private leftArm: THREE.Group | null = null;
  private rightArm: THREE.Group | null = null;
  private headGroup: THREE.Group | null = null;
  private earL: THREE.Mesh | null = null;
  private earR: THREE.Mesh | null = null;
  private tailGroup: THREE.Group | null = null;
  private bubbleHelmet: THREE.Mesh | null = null;

  // Solid Colliders, Connecting Bridges & Road Pavements
  private colliders: SolidCollider[] = [];
  private bridges: BridgeData[] = [];
  public paths: { p1: THREE.Vector3; p2: THREE.Vector3; width: number; height: number }[] = [];

  // Movement & Camera Physics
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 4.80, 8.0);
  private lastSafePos: THREE.Vector3 = new THREE.Vector3(0, 4.80, 8.0);
  public playerVel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public playerRotY: number = 0;
  public currentSpeed: number = 0;
  public maxSpeed: number = 7.5;
  public acceleration: number = 16;
  public deceleration: number = 18;
  public turnSpeed: number = 2.6;
  public isGrounded: boolean = true;
  public onWater: boolean = false;
  public nitro: number = 100;
  public isBoosting: boolean = false;

  private walkCycle: number = 0;
  private currentTurnSpeed: number = 0;
  private currentBankZ: number = 0;
  private currentPitchX: number = 0;
  private cameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 5.8, 0);

  // Environment Meshes
  private waterGeometry: THREE.PlaneGeometry | null = null;
  private clouds: THREE.Group[] = [];
  private foamRings: THREE.Mesh[] = [];
  private maritimeBuoys: THREE.Group[] = [];
  private lighthouseBeam: THREE.Mesh | null = null;
  private mobaCrystal: THREE.Mesh | null = null;

  // Soccer Ball & Stadium
  private soccerBall: THREE.Mesh | null = null;
  private ballVel: THREE.Vector3 = new THREE.Vector3();
  private goalBox: THREE.Box3 = new THREE.Box3();

  // Collectibles & Speed Rings
  private tokens: { mesh: THREE.Mesh; collected: boolean; baseY: number }[] = [];
  public coinsCollected: number = 0;
  public totalCoins: number = 30;
  private speedRings: THREE.Mesh[] = [];

  // Water Wake & Rainbow Thruster Particles
  private wakeParticles: THREE.Points | null = null;
  private wakePositions: Float32Array | null = null;
  private nextWakeIdx: number = 0;

  private thrusterParticles: THREE.Points | null = null;
  private thrusterPositions: Float32Array | null = null;
  private nextThrusterIdx: number = 0;

  // Animated NPC mesh map
  private npcMeshMap: Map<string, { group: THREE.Group; head: THREE.Group; waveArm?: THREE.Group; juggledBall?: THREE.Mesh }> = new Map();

  // POIs
  public pois: IslandPOI[] = [
    { id: "hub", name: "Central Plaza", pos: new THREE.Vector3(0, 4.80, 8.0), desc: "The vibrant heart of the archipelago", tag: "START" },
    { id: "moba", name: "MOBA Sanctuary", pos: new THREE.Vector3(-70, 6.6, -65), desc: "Ancient Champions Monolith & Amethyst Crystal", tag: "ARENA" },
    { id: "br", name: "Battle Royale Outpost", pos: new THREE.Vector3(75, 7.0, -60), desc: "Coastal Lighthouse, Airdrop & Cliff Boardwalk", tag: "SURVIVAL" },
    { id: "voxel", name: "Voxel Sandbox Bay", pos: new THREE.Vector3(-65, 4.7, 70), desc: "Terraced Cubic Hills & Pixel Palms", tag: "SANDBOX" },
    { id: "soccer", name: "Arcade Soccer Arena", pos: new THREE.Vector3(65, 2.38, 65), desc: "Beach Stadium, Bleachers & Giant Ball", tag: "SPORTS" },
  ];

  // NPCs with unique Arcade Challenges
  public npcs: NPCData[] = [
    {
      id: "lexa",
      name: "Lexa the Explorer",
      title: "Archipelago Navigator",
      island: "Central Plaza",
      pos: new THREE.Vector3(6, 4.80, 5),
      avatar: "🧭",
      dialogue: [
        "Hello Milo! Welcome to the Coastal Gaming Archipelago!",
        "Sprint and leap across the scenic suspension bridges linking MOBA Sanctuary, Battle Royale Outpost, Voxel Bay, and the Soccer Arena.",
        "Collect 30 gold arcade tokens, challenge the island champions, and score a screamer at the beach stadium!"
      ],
      arcadeChallenge: {
        id: "ring_trial",
        title: "Plaza Slalom Rush",
        instructions: "Sprint through 5 glowing Neon Slalom Rings around Central Plaza before time runs out!",
        badge: "💍 RING MASTER",
      },
    },
    {
      id: "valen",
      name: "Valen the Knight",
      title: "MOBA Grandmaster",
      island: "MOBA Sanctuary",
      pos: new THREE.Vector3(-66, 6.6, -60),
      avatar: "⚔️",
      dialogue: [
        "Greetings, star champion! You stand before the Monolith of the Ancients.",
        "The glowing amethyst crystal above our altar radiates the essence of tactical mastery.",
        "Impeccable timing and lane positioning are the true hallmarks of a Grandmaster!"
      ],
      arcadeChallenge: {
        id: "crystal_runes",
        title: "Sanctuary Core Overdrive",
        instructions: "Attune 4 Ancient Elemental Runes around the Sanctuary Altar within 35 seconds!",
        badge: "💎 RUNE GUARDIAN",
      },
    },
    {
      id: "jax",
      name: "Jax the Ranger",
      title: "Survival Outpost Ace",
      island: "Battle Royale Outpost",
      pos: new THREE.Vector3(70, 7.0, -55),
      avatar: "🪂",
      dialogue: [
        "Heads up, operative! A high-value tactical airdrop just touched down on the lighthouse bluffs.",
        "Hit Nitro with Shift to charge across the cliffside skywalks up to the observation deck!",
        "Keep your eyes peeled and your reflexes sharp. Victory belongs to the decisive!"
      ],
      arcadeChallenge: {
        id: "airdrop_hunt",
        title: "Airdrop Supply Intercept",
        instructions: "Recover 3 Tactical Airdrop Crates along the Outpost cliffs before time runs out!",
        badge: "📦 SURVIVAL ACE",
      },
    },
    {
      id: "leo",
      name: "Striker Leo",
      title: "Beach Stadium Champion",
      island: "Arcade Soccer Arena",
      pos: new THREE.Vector3(60, 2.60, 58),
      avatar: "⚽",
      dialogue: [
        "Yo Milo! Welcome to the Arcade Beach Soccer Arena!",
        "Got what it takes to strike gold? Drive the giant soccer ball right into the netted goal!",
        "Score now and let the seaside grandstands echo with roaring applause!"
      ],
      arcadeChallenge: {
        id: "penalty_kick",
        title: "Golden Striker Shootout",
        instructions: "Dribble and drive the giant soccer ball into 3 Golden Goal Target Zones!",
        badge: "⚽ GOLDEN BOOT",
      },
    },
  ];

  public activeProximityNPC: NPCData | null = null;
  public activeDialogueNPC: NPCData | null = null;
  public activeMinigame: ActiveMinigame | null = null;
  private minigameTargets: {
    mesh: THREE.Object3D;
    hit: boolean;
    radius: number;
    pos: THREE.Vector3;
    type?: "soccer_target" | "nitro_gate" | "moba_orb" | "airdrop_crate";
    update?: (delta: number, time: number) => void;
    onHit?: () => void;
  }[] = [];
  public currentLocationName: string = "Central Plaza";

  // Inputs
  public inputs = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    boost: false,
    interact: false,
  };

  constructor(container: HTMLElement, audio: WorldAudio, callbacks: EngineCallbacks = {}) {
    this.container = container;
    this.audio = audio;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // 1. Scene & Environment (Tropical Azure Sky Fog, Clear Horizon)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0022);

    // 2. Camera Setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(54, aspect, 0.1, 950);
    this.camera.position.set(0, 9.2, 15.8);
    this.cameraLookAt.set(0, 6.4, 8.0);
    this.camera.lookAt(this.cameraLookAt);

    // 3. WebGL Renderer with Tone Mapping & Soft Shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.96;
    container.appendChild(this.renderer.domElement);

    // 4. Post-processing (UnrealBloomPass for Cinematic Glow)
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.28, // Soft cinematic bloom strength
      0.30, // Radius
      0.88  // High threshold so only neon emissive elements bloom, no water/sky blowout
    );
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    // 5. Lighting & Three.js Sky Shader
    this.setupLighting();
    this.buildPhysicalSky();
    this.buildOcean();
    this.buildArchipelago();

    // 6. Milo Space Hero Cat (Walking on Foot!)
    this.playerGroup = new THREE.Group();
    this.catMeshGroup = this.buildMiloAvatar();
    this.playerGroup.add(this.catMeshGroup);
    this.scene.add(this.playerGroup);

    // 7. Spawn Collectibles, Soccer Arena & Animated NPCs
    this.spawnTokens();
    this.spawnSpeedRings();
    this.spawnSoccerArena();
    this.spawnAnimatedNPCs();
    this.setupParticles();

    // 8. Event Listeners
    window.addEventListener("resize", this.onWindowResize);

    // 9. Start Loop
    this.isRunning = true;
    this.animate();
  }

  // =========================================================================
  // LIGHTING & PHYSICAL SKY SHADER
  // =========================================================================
  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xfffbeb, 0.70);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x15803d, 0.60);
    hemiLight.position.set(0, 70, 0);
    this.scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfff7ed, 1.15);
    sun.position.set(85, 115, 65);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 340;
    sun.shadow.camera.left = -140;
    sun.shadow.camera.right = 140;
    sun.shadow.camera.top = 140;
    sun.shadow.camera.bottom = -140;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);
  }

  private buildPhysicalSky() {
    // Three.js Sky Shader
    const sky = new Sky();
    sky.scale.setScalar(450000);
    this.scene.add(sky);

    const sunPosition = new THREE.Vector3().setFromSphericalCoords(
      1,
      THREE.MathUtils.degToRad(72),
      THREE.MathUtils.degToRad(50)
    );

    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 8;
    uniforms["rayleigh"].value = 1.35;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.8;
    uniforms["sunPosition"].value.copy(sunPosition);

    // Drifting Low-Poly Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
    });

    const cloudCoords: [number, number, number][] = [
      [-120, 80, -90],
      [90, 85, -120],
      [-100, 75, 100],
      [120, 90, 80],
      [0, 95, 0],
      [-50, 85, -150],
      [60, 80, 130],
    ];

    cloudCoords.forEach(([cx, cy, cz]) => {
      const cloud = new THREE.Group();
      cloud.position.set(cx, cy, cz);
      for (let i = 0; i < 5; i++) {
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(6 + (i % 3) * 2, 1), cloudMat);
        puff.position.set((i - 2) * 5.5, ((i % 2) - 0.5) * 2, ((i % 3) - 1) * 3);
        cloud.add(puff);
      }
      this.scene.add(cloud);
      this.clouds.push(cloud);
    });
  }

  // =========================================================================
  // PROCEDURAL OCEAN, SHORELINE FOAM & MARITIME BUOYS
  // =========================================================================
  private buildOcean() {
    this.waterGeometry = new THREE.PlaneGeometry(550, 550, 80, 80);
    this.waterGeometry.rotateX(-Math.PI / 2);

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Tropical azure ocean
      roughness: 0.44, // Soft satin water reflection - eliminates blinding mirror glare!
      metalness: 0.06, // Prevents specular blowout
      flatShading: true,
    });

    const waterMesh = new THREE.Mesh(this.waterGeometry, waterMat);
    waterMesh.position.y = 0;
    waterMesh.receiveShadow = true;
    this.scene.add(waterMesh);

    // Deep seabed plane (prevents hollow white voids underneath water)
    const seaBed = new THREE.Mesh(
      new THREE.PlaneGeometry(550, 550),
      new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.9 })
    );
    seaBed.rotateX(-Math.PI / 2);
    seaBed.position.y = -1.2;
    this.scene.add(seaBed);

    // Floating Maritime Channel Buoys (Red & Green)
    const buoyMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const buoyMatGreen = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const buoyMatBase = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    const buoyPositions: [number, number, boolean][] = [
      [-35, -35, true],
      [35, -35, false],
      [-35, 35, false],
      [35, 35, true],
      [0, -45, true],
      [0, 45, false],
    ];

    buoyPositions.forEach(([bx, bz, isRed]) => {
      const buoy = new THREE.Group();
      buoy.position.set(bx, 0.2, bz);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.4, 12), buoyMatBase);
      buoy.add(base);

      const top = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 8), isRed ? buoyMatRed : buoyMatGreen);
      top.position.y = 0.9;
      buoy.add(top);

      // Blinking beacon light
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        new THREE.MeshStandardMaterial({
          color: isRed ? 0xf87171 : 0x34d399,
          emissive: isRed ? 0xef4444 : 0x10b981,
          emissiveIntensity: 1.0,
        })
      );
      beacon.position.y = 1.7;
      buoy.add(beacon);

      this.scene.add(buoy);
      this.maritimeBuoys.push(buoy);
      this.colliders.push({ x: bx, z: bz, radius: 1.2, label: "buoy" });
    });
  }

  private createShorelineFoam(center: THREE.Vector3, radius: number) {
    const foamGeo = new THREE.RingGeometry(radius * 0.92, radius * 1.25, 36);
    foamGeo.rotateX(-Math.PI / 2);
    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xbae6fd, // Soft seafoam cyan, not blinding white
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const foam = new THREE.Mesh(foamGeo, foamMat);
    foam.position.set(center.x, 0.08, center.z);
    this.scene.add(foam);
    this.foamRings.push(foam);
  }

  // =========================================================================
  // ORGANIC ARCHIPELAGO ISLANDS & SCENERY PROPS
  // =========================================================================
  private buildArchipelago() {
    // 1. Central Plaza (Hub)
    this.createOrganicIsland({
      center: new THREE.Vector3(0, 0, 0),
      radius: 28,
      height: 4.80,
      sandColor: 0xfef08a,
      grassColor: 0x4ade80,
    });
    this.addHubProps(new THREE.Vector3(0, 0, 0));

    // 2. MOBA Sanctuary (NW)
    this.createOrganicIsland({
      center: new THREE.Vector3(-70, 0, -65),
      radius: 25,
      height: 6.60,
      sandColor: 0xfde047,
      grassColor: 0x38bdf8,
    });
    this.addMOBAProps(new THREE.Vector3(-70, 0, -65));

    // 3. Battle Royale Outpost (NE)
    this.createOrganicIsland({
      center: new THREE.Vector3(75, 0, -60),
      radius: 26,
      height: 7.00,
      sandColor: 0xfde047,
      grassColor: 0xf97316,
    });
    this.addBRProps(new THREE.Vector3(75, 0, -60));

    // 4. Voxel Sandbox Bay (SW)
    this.createVoxelIsland(new THREE.Vector3(-65, 0, 70));

    // 5. Arcade Soccer Arena (SE)
    this.createOrganicIsland({
      center: new THREE.Vector3(65, 0, 65),
      radius: 27,
      height: 2.60,
      sandColor: 0xfef08a,
      grassColor: 0x22c55e,
    });
    this.addSoccerStadiumProps(new THREE.Vector3(65, 0, 65));

    // 6. Connect All Islands with Walkable Wooden Bridges
    this.buildConnectingBridges();
  }

  private createOrganicIsland(cfg: { center: THREE.Vector3; radius: number; height: number; sandColor: number; grassColor: number }) {
    this.createShorelineFoam(cfg.center, cfg.radius);

    // 1. Golden Sand Beach Shelf (Top face at y = 1.30)
    const sandGeo = new THREE.CylinderGeometry(cfg.radius * 0.94, cfg.radius * 1.25, 2.0, 36);
    const sandMat = new THREE.MeshStandardMaterial({ color: cfg.sandColor, roughness: 0.9, flatShading: true });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.set(cfg.center.x, 0.3, cfg.center.z);
    sandMesh.receiveShadow = true;
    this.scene.add(sandMesh);

    // 2. Rich Earthy Soil & Rock Cliff Layer (Tanah Cokelat - Berhenti 0.85m di Bawah Rumput agar Tidak Z-Fight!)
    const soilTop = cfg.height - 0.85;
    const soilBottom = 1.0;
    const soilH = Math.max(0.6, soilTop - soilBottom);
    const soilGeo = new THREE.CylinderGeometry(cfg.radius * 0.82, cfg.radius * 0.96, soilH, 36);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, flatShading: true });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.set(cfg.center.x, soilBottom + soilH / 2, cfg.center.z);
    soilMesh.castShadow = true;
    soilMesh.receiveShadow = true;
    this.scene.add(soilMesh);

    // 3. Lush Green Park Turf Plateau (Rumput Hijau Halus - Satu-satunya Permukaan di y = cfg.height)
    const hillH = 1.0;
    const hillGeo = new THREE.CylinderGeometry(cfg.radius * 0.88, cfg.radius * 0.94, hillH, 36);
    const hillMat = new THREE.MeshStandardMaterial({
      color: cfg.grassColor,
      roughness: 0.88,
      metalness: 0.0,
      flatShading: false, // Smooth shading anti-flicker
    });
    const hillMesh = new THREE.Mesh(hillGeo, hillMat);
    hillMesh.position.set(cfg.center.x, cfg.height - hillH / 2, cfg.center.z);
    hillMesh.castShadow = true;
    hillMesh.receiveShadow = true;
    this.scene.add(hillMesh);

    // 4. Palm Trees & Coastal Boulders
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const dist = cfg.radius * 0.84;
      const x = cfg.center.x + Math.cos(angle) * dist;
      const z = cfg.center.z + Math.sin(angle) * dist;
      this.createPalmTree(x, z, cfg.height);
      if (i % 2 === 0) {
        this.createBeachRock(x + 2.5, z - 2.5, 1.3);
      }
    }
  }

  private createPalmTree(x: number, z: number, y: number) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.85 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.38, 3.8, 8), trunkMat);
    trunk.position.set(x, y + 1.9, z);
    trunk.rotation.z = (Math.random() - 0.5) * 0.22;
    trunk.castShadow = true;
    this.scene.add(trunk);
    this.colliders.push({ x, z, radius: 0.65, label: "palm" });

    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65, flatShading: true });
    for (let j = 0; j < 5; j++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.4, 5), leavesMat);
      leaf.position.set(x, y + 4.0, z);
      leaf.rotation.z = Math.PI / 3.2;
      leaf.rotation.y = (j / 5) * Math.PI * 2;
      leaf.castShadow = true;
      this.scene.add(leaf);
    }

    const nutMat = new THREE.MeshStandardMaterial({ color: 0x582a0b, roughness: 0.8 });
    for (let k = 0; k < 3; k++) {
      const nut = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), nutMat);
      nut.position.set(x + (k - 1) * 0.22, y + 3.7, z + (k % 2 === 0 ? 0.22 : -0.22));
      this.scene.add(nut);
    }
  }

  private createBeachRock(x: number, z: number, y: number) {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85, flatShading: true });
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9 + Math.random() * 0.5, 0), rockMat);
    rock.position.set(x, y, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    this.scene.add(rock);
    this.colliders.push({ x, z, radius: 1.1, label: "rock" });
  }

  // =========================================================================
  // PARK, GARDEN, ROAD & LANDSCAPE PROPS
  // =========================================================================
  // Jalan Setapak Paving / Dirt Road
  private createPathSegment(p1: THREE.Vector3, p2: THREE.Vector3, width: number, color: number, height: number) {
    const dist = Math.hypot(p2.x - p1.x, p2.z - p1.z);
    const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z);
    const midX = (p1.x + p2.x) / 2;
    const midZ = (p1.z + p2.z) / 2;

    const pathGroup = new THREE.Group();
    pathGroup.position.set(midX, height + 0.04, midZ);
    pathGroup.rotation.y = angle;

    const slab = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.08, dist),
      new THREE.MeshStandardMaterial({ color, roughness: 0.82 })
    );
    slab.receiveShadow = true;
    pathGroup.add(slab);

    // Stone road curbs
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.85 });
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, dist), curbMat);
    curbL.position.set(-width / 2, 0.03, 0);
    pathGroup.add(curbL);

    const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, dist), curbMat);
    curbR.position.set(width / 2, 0.03, 0);
    pathGroup.add(curbR);

    this.scene.add(pathGroup);
    this.paths.push({ p1, p2, width, height });
  }

  // Taman Bunga & Tanah Subur (Flowerbeds with rich soil & colorful petals)
  private createGardenFlowerBed(center: THREE.Vector3, radius: number, flowerCount: number = 8) {
    const bedGroup = new THREE.Group();
    bedGroup.position.copy(center);

    // Rich Dark Garden Soil (Tanah Subur Hitam Cokelat)
    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 1.05, 0.16, 18),
      new THREE.MeshStandardMaterial({ color: 0x3f2305, roughness: 0.95 })
    );
    soil.position.y = 0.08;
    soil.receiveShadow = true;
    bedGroup.add(soil);

    // Cobblestone curb ring
    const curb = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.14, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 })
    );
    curb.rotateX(Math.PI / 2);
    curb.position.y = 0.12;
    bedGroup.add(curb);

    // Low trimmed hedge ring
    const hedge = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.86, 0.16, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 })
    );
    hedge.rotateX(Math.PI / 2);
    hedge.position.y = 0.20;
    bedGroup.add(hedge);

    // Colorful blooming flowers
    const flowerColors = [0xef4444, 0xf59e0b, 0xa855f7, 0x06b6d4, 0xf472b6, 0xec4899];
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });

    for (let f = 0; f < flowerCount; f++) {
      const angle = (f / flowerCount) * Math.PI * 2 + (f % 3) * 0.3;
      const r = (radius * 0.28) + ((f * 3) % 5) * (radius * 0.1);
      const fx = Math.cos(angle) * r;
      const fz = Math.sin(angle) * r;

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 6), stemMat);
      stem.position.set(fx, 0.26, fz);
      bedGroup.add(stem);

      const petalMat = new THREE.MeshStandardMaterial({ color: flowerColors[f % flowerColors.length], roughness: 0.5 });
      const bloom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), petalMat);
      bloom.position.set(fx, 0.44, fz);
      bedGroup.add(bloom);
    }

    this.scene.add(bedGroup);
  }

  // Bangku Taman Kayu (Park Wooden Bench)
  private createParkBench(x: number, z: number, y: number, rotY: number) {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(x, y, z);
    benchGroup.rotation.y = rotY;

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.75 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });

    for (let s = 0; s < 3; s++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.16), woodMat);
      plank.position.set(0, 0.45, -0.16 + s * 0.16);
      plank.castShadow = true;
      benchGroup.add(plank);
    }

    for (let b = 0; b < 2; b++) {
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.06), woodMat);
      back.position.set(0, 0.65 + b * 0.18, -0.28);
      back.castShadow = true;
      benchGroup.add(back);
    }

    for (const legX of [-0.68, 0.68]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.42), ironMat);
      leg.position.set(legX, 0.24, 0);
      benchGroup.add(leg);

      const backSupport = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.08), ironMat);
      backSupport.position.set(legX, 0.68, -0.26);
      benchGroup.add(backSupport);
    }

    this.scene.add(benchGroup);
    this.colliders.push({ x, z, radius: 1.0, label: "bench" });
  }

  // Lampu Taman Hias (Victorian Garden Lamp Post)
  private createGardenLampPost(x: number, z: number, y: number) {
    const postGroup = new THREE.Group();
    postGroup.position.set(x, y, z);

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.35 });
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.35, 8), ironMat);
    base.position.y = 0.18;
    postGroup.add(base);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.6, 8), ironMat);
    pole.position.y = 1.6;
    pole.castShadow = true;
    postGroup.add(pole);

    const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.38), ironMat);
    fixture.position.y = 2.95;
    postGroup.add(fixture);

    const glass = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), lanternMat);
    glass.position.y = 3.12;
    postGroup.add(glass);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.22, 6), ironMat);
    cap.position.y = 3.32;
    postGroup.add(cap);

    this.scene.add(postGroup);
    this.colliders.push({ x, z, radius: 0.5, label: "lamppost" });
  }

  // Pohon Taman Rindang & Pohon Bunga (Lush Park Canopy Trees)
  private createParkTree(x: number, z: number, y: number, isBlossom: boolean = false) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x582a0b, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: isBlossom ? 0xf472b6 : 0x16a34a,
      roughness: 0.7,
      flatShading: true,
    });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, 2.6, 8), trunkMat);
    trunk.position.set(x, y + 1.3, z);
    trunk.castShadow = true;
    this.scene.add(trunk);
    this.colliders.push({ x, z, radius: 0.75, label: "tree" });

    for (let c = 0; c < 4; c++) {
      const angle = (c / 4) * Math.PI * 2;
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4 + (c % 2) * 0.3, 1), foliageMat);
      crown.position.set(x + Math.cos(angle) * 0.6, y + 2.8 + (c % 2) * 0.5, z + Math.sin(angle) * 0.6);
      crown.castShadow = true;
      this.scene.add(crown);
    }
    const topCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), foliageMat);
    topCrown.position.set(x, y + 3.8, z);
    topCrown.castShadow = true;
    this.scene.add(topCrown);
  }

  private createBeachUmbrella(x: number, z: number, y: number, colorA: number, colorB: number) {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4), poleMat);
    pole.position.set(x, y + 1.2, z);
    this.scene.add(pole);

    const canopyMat = new THREE.MeshStandardMaterial({ color: colorA, roughness: 0.6, side: THREE.DoubleSide });
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 8, 1, true), canopyMat);
    canopy.position.set(x, y + 2.3, z);
    canopy.rotation.z = 0.12;
    canopy.castShadow = true;
    this.scene.add(canopy);

    const chairMat = new THREE.MeshStandardMaterial({ color: colorB, roughness: 0.7 });
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 1.8), chairMat);
    chair.position.set(x + 1.2, y + 0.15, z);
    chair.rotation.y = 0.3;
    chair.castShadow = true;
    this.scene.add(chair);
    this.colliders.push({ x, z, radius: 1.2, label: "umbrella" });
  }

  private createWoodenPier(start: THREE.Vector3, rotY: number, length: number = 8) {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, length), woodMat);
    deck.position.set(start.x, 0.7, start.z);
    deck.rotation.y = rotY;
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.scene.add(deck);

    const postMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    for (let p = -1; p <= 1; p += 2) {
      for (let s = -1; s <= 1; s += 2) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.2, 8), postMat);
        const offsetX = (p * 1.4) * Math.cos(rotY) - (s * (length / 2 - 0.4)) * Math.sin(rotY);
        const offsetZ = (p * 1.4) * Math.sin(rotY) + (s * (length / 2 - 0.4)) * Math.cos(rotY);
        post.position.set(start.x + offsetX, 0.9, start.z + offsetZ);
        this.scene.add(post);
      }
    }
  }

  private addHubProps(center: THREE.Vector3) {
    // 1. Grand Garden Promenade: Warm Slate & Terracotta Pavers (Bukan Putih Polos!)
    const outerPlaza = new THREE.Mesh(
      new THREE.CylinderGeometry(11.5, 11.5, 0.20, 32),
      new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 }) // Slate stone paving
    );
    outerPlaza.position.set(center.x, 4.80, center.z);
    outerPlaza.receiveShadow = true;
    this.scene.add(outerPlaza);

    const innerPlaza = new THREE.Mesh(
      new THREE.CylinderGeometry(7.5, 7.5, 0.24, 28),
      new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.75 }) // Terracotta paving
    );
    innerPlaza.position.set(center.x, 4.80, center.z);
    innerPlaza.receiveShadow = true;
    this.scene.add(innerPlaza);

    // Center Garden Ring around Trophy
    this.createGardenFlowerBed(new THREE.Vector3(center.x, 4.80, center.z), 3.2, 12);

    // Golden Trophy on dark granite pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.4, 0.9, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    pedestal.position.set(center.x, 5.35, center.z);
    pedestal.castShadow = true;
    this.scene.add(pedestal);

    const trophy = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 0.45, 2.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.15 })
    );
    trophy.position.set(center.x, 6.90, center.z);
    trophy.castShadow = true;
    this.scene.add(trophy);
    this.colliders.push({ type: "circle", x: center.x, z: center.z, radius: 3.3, label: "central_flowerbed" });

    // 2. 4 Radial Cobblestone Roads (Jalan Paving ke Setiap Jembatan!)
    this.createPathSegment(new THREE.Vector3(-6, 0, -6), new THREE.Vector3(-18, 0, -18), 3.4, 0xa8a29e, 4.80);
    this.createPathSegment(new THREE.Vector3(6, 0, -6), new THREE.Vector3(18, 0, -16), 3.4, 0xa8a29e, 4.80);
    this.createPathSegment(new THREE.Vector3(-6, 0, 6), new THREE.Vector3(-16, 0, 18), 3.4, 0xa8a29e, 4.80);
    this.createPathSegment(new THREE.Vector3(6, 0, 6), new THREE.Vector3(16, 0, 18), 3.4, 0xa8a29e, 4.80);

    // 3. Flower Beds in 4 Park Quadrants
    this.createGardenFlowerBed(new THREE.Vector3(center.x, 4.80, center.z - 15), 3.0, 9);
    this.createGardenFlowerBed(new THREE.Vector3(center.x, 4.80, center.z + 15), 3.0, 9);
    this.createGardenFlowerBed(new THREE.Vector3(center.x - 15, 4.80, center.z), 3.0, 9);
    this.createGardenFlowerBed(new THREE.Vector3(center.x + 15, 4.80, center.z), 3.0, 9);

    // 4. Park Shade Trees & Cherry Blossom Trees
    this.createParkTree(center.x - 10, center.z - 12, 4.80, false);
    this.createParkTree(center.x + 10, center.z - 12, 4.80, true);
    this.createParkTree(center.x - 10, center.z + 12, 4.80, true);
    this.createParkTree(center.x + 10, center.z + 12, 4.80, false);

    // 5. Wooden Park Benches along the promenade
    this.createParkBench(center.x - 8, center.z - 5, 4.80, Math.PI / 4);
    this.createParkBench(center.x + 8, center.z - 5, 4.80, -Math.PI / 4);
    this.createParkBench(center.x - 8, center.z + 5, 4.80, (3 * Math.PI) / 4);
    this.createParkBench(center.x + 8, center.z + 5, 4.80, -(3 * Math.PI) / 4);

    // 6. Victorian Garden Lampposts
    this.createGardenLampPost(center.x - 11, center.z - 11, 4.80);
    this.createGardenLampPost(center.x + 11, center.z - 11, 4.80);
    this.createGardenLampPost(center.x - 11, center.z + 11, 4.80);
    this.createGardenLampPost(center.x + 11, center.z + 11, 4.80);

    // Pier, Beach Umbrellas, and Ramps
    this.createWoodenPier(new THREE.Vector3(0, 0, -28), 0, 10);
    this.createBeachUmbrella(center.x - 14, center.z + 20, 0.4, 0xf43f5e, 0x0284c7);
    this.createBeachUmbrella(center.x + 14, center.z + 20, 0.4, 0x06b6d4, 0xf59e0b);

    this.createRamp(new THREE.Vector3(-24, 0, 0), Math.PI / 2);
    this.createRamp(new THREE.Vector3(24, 0, 0), -Math.PI / 2);
  }

  private addMOBAProps(center: THREE.Vector3) {
    // Ancient stone road from bridge (-52, -50) to monolith center
    this.createPathSegment(new THREE.Vector3(-52, 0, -50), new THREE.Vector3(center.x, 0, center.z), 3.6, 0x475569, 6.6);

    // Mystical Garden beds flanking the path
    this.createGardenFlowerBed(new THREE.Vector3(center.x - 6, 6.6, center.z + 8), 2.8, 8);
    this.createGardenFlowerBed(new THREE.Vector3(center.x + 8, 6.6, center.z - 6), 2.8, 8);

    // Ancient park benches and stone lanterns
    this.createParkBench(center.x - 9, center.z - 2, 6.6, Math.PI / 3);
    this.createGardenLampPost(center.x - 5, center.z - 8, 6.6);
    this.createGardenLampPost(center.x - 12, center.z + 5, 6.6);

    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 15, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6, metalness: 0.9, roughness: 0.1 })
    );
    blade.position.set(center.x, 10.5, center.z);
    blade.rotation.z = 0.15;
    blade.castShadow = true;
    this.scene.add(blade);
    this.colliders.push({ type: "box", minX: center.x - 0.8, maxX: center.x + 0.8, minZ: center.z - 1.6, maxZ: center.z + 1.6, label: "monolith" });

    this.mobaCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.4, 0),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 0.9, metalness: 0.8, roughness: 0.1 })
    );
    this.mobaCrystal.position.set(center.x + 8, 8.5, center.z + 6);
    this.mobaCrystal.castShadow = true;
    this.scene.add(this.mobaCrystal);
    this.colliders.push({ x: center.x + 8, z: center.z + 6, radius: 1.5, label: "crystal" });

    const ruinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    for (let p = 0; p < 4; p++) {
      const angle = (p / 4) * Math.PI * 2;
      const px = center.x + Math.cos(angle) * 12;
      const pz = center.z + Math.sin(angle) * 12;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 4.5, 8), ruinMat);
      pillar.position.set(px, 7.5, pz);
      pillar.castShadow = true;
      this.scene.add(pillar);
      this.colliders.push({ x: px, z: pz, radius: 0.85, label: "pillar" });
    }
  }

  private addBRProps(center: THREE.Vector3) {
    // Dirt & Gravel Road from bridge (56, -45) to lighthouse area
    this.createPathSegment(new THREE.Vector3(56, 0, -45), new THREE.Vector3(center.x - 4, 0, center.z - 4), 3.6, 0x92400e, 7.0);

    // Lighthouse: Maritime Cream Stone Masonry (Bukan Putih Polos!)
    const lhBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 3.0, 14, 16),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.65 })
    );
    lhBase.position.set(center.x - 8, 14, center.z - 8);
    lhBase.castShadow = true;
    this.scene.add(lhBase);
    this.colliders.push({ x: center.x - 8, z: center.z - 8, radius: 3.2, label: "lighthouse" });

    // Weather-worn granite base ring
    const lhStoneBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3.1, 3.4, 2.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 })
    );
    lhStoneBase.position.set(center.x - 8, 8.25, center.z - 8);
    lhStoneBase.receiveShadow = true;
    this.scene.add(lhStoneBase);

    // Red bands
    const redBand1 = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 2.8, 16), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 }));
    redBand1.position.set(center.x - 8, 12, center.z - 8);
    this.scene.add(redBand1);

    const redBand2 = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.3, 2.4, 16), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 }));
    redBand2.position.set(center.x - 8, 17, center.z - 8);
    this.scene.add(redBand2);

    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.0, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
    lantern.position.set(center.x - 8, 22, center.z - 8);
    this.scene.add(lantern);

    const beamMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false });
    this.lighthouseBeam = new THREE.Mesh(new THREE.ConeGeometry(8, 35, 12, 1, true), beamMat);
    this.lighthouseBeam.position.set(center.x - 8, 22, center.z - 8);
    this.lighthouseBeam.rotation.x = Math.PI / 2;
    this.scene.add(this.lighthouseBeam);

    const crate = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 3.5), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 }));
    crate.position.set(center.x + 6, 8.8, center.z + 6);
    crate.castShadow = true;
    this.scene.add(crate);
    this.colliders.push({ type: "box", minX: center.x + 6 - 1.9, maxX: center.x + 6 + 1.9, minZ: center.z + 6 - 1.9, maxZ: center.z + 6 + 1.9, label: "crate" });

    const chute = new THREE.Mesh(new THREE.ConeGeometry(5.5, 2.8, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide }));
    chute.position.set(center.x + 6, 13.5, center.z + 6);
    this.scene.add(chute);

    // Park bench & lampposts
    this.createParkBench(center.x + 2, center.z - 12, 7.0, -Math.PI / 4);
    this.createGardenLampPost(center.x, center.z - 6, 7.0);
    this.createParkTree(center.x - 14, center.z + 4, 7.0, false);

    this.createRamp(new THREE.Vector3(center.x - 18, 0, center.z + 8), -Math.PI / 4);
  }

  private createVoxelIsland(center: THREE.Vector3) {
    this.createShorelineFoam(center, 22);

    const voxelMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9, flatShading: true });
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, flatShading: true });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, flatShading: true });

    // 1. Solid Stone Arrival Quay & Foundation directly under Bridge Touchdown (-48, 52)
    // Ensures seamless physical ground connecting bridge abutment directly into Voxel island
    const quayMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, flatShading: true });
    const arrivalQuay = new THREE.Mesh(new THREE.BoxGeometry(8.5, 5.2, 9.5), quayMat);
    arrivalQuay.position.set(-48, 2.1, 52); // Top surface flush at y = 4.70, anchored to seabed at y = -0.5
    arrivalQuay.receiveShadow = true;
    arrivalQuay.castShadow = true;
    this.scene.add(arrivalQuay);

    const bridgeStairs = new THREE.Mesh(new THREE.BoxGeometry(7.5, 4.8, 8.5), voxelMat);
    bridgeStairs.position.set(-54, 2.3, 59); // Top surface flush at y = 4.70
    bridgeStairs.receiveShadow = true;
    bridgeStairs.castShadow = true;
    this.scene.add(bridgeStairs);

    // Paved stone road from bridge (-48, 52) to voxel center
    this.createPathSegment(new THREE.Vector3(-48, 0, 52), new THREE.Vector3(center.x, 0, center.z), 4.2, 0x475569, 4.7);

    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        const dist = Math.hypot(x, z);
        if (dist > 4.2) continue;
        const h = Math.max(1, 4 - Math.floor(dist * 0.8));
        const mat = dist > 2.8 ? soilMat : dist > 1.4 ? stoneMat : voxelMat;
        const box = new THREE.Mesh(new THREE.BoxGeometry(4.5, h * 1.5, 4.5), mat);
        box.position.set(center.x + x * 4.6, (h * 1.5) / 2 + 0.2, center.z + z * 4.6);
        box.castShadow = true;
        box.receiveShadow = true;
        this.scene.add(box);
      }
    }

    this.createParkTree(center.x - 6, center.z - 6, 5.0, true);
    this.createGardenLampPost(center.x + 6, center.z - 6, 4.7);
  }

  private addSoccerStadiumProps(center: THREE.Vector3) {
    // 1. Terracotta / Clay Running Track & Walking Promenade encircling the pitch (Bukan Kosong/Putih!)
    const track = new THREE.Mesh(
      new THREE.BoxGeometry(27, 0.12, 38),
      new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.85 })
    );
    track.position.set(center.x, 2.56, center.z);
    track.receiveShadow = true;
    this.scene.add(track);

    // 2. Soccer Pitch Turf (Top face at y = 2.66)
    const pitch = new THREE.Mesh(
      new THREE.BoxGeometry(22, 0.16, 32),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 })
    );
    pitch.position.set(center.x, 2.58, center.z);
    pitch.receiveShadow = true;
    this.scene.add(pitch);

    // 3. Center line (Soft white, not glaring)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9 });
    const centerLine = new THREE.Mesh(new THREE.BoxGeometry(21, 0.18, 0.3), lineMat);
    centerLine.position.set(center.x, 2.67, center.z);
    this.scene.add(centerLine);

    // 4. Cobblestone Path from bridge (48, 48) to pitch entrance
    this.createPathSegment(new THREE.Vector3(48, 0, 48), new THREE.Vector3(center.x - 11, 0, center.z), 3.2, 0xa8a29e, 2.60);

    // 5. Spectator Bleachers & Garden amenities
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    for (let b = 0; b < 3; b++) {
      const bx = center.x - 14 - b * 2.2;
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6 * (b + 1), 24), benchMat);
      bench.position.set(bx, 2.60 + (0.6 * (b + 1)) / 2, center.z);
      bench.castShadow = true;
      this.scene.add(bench);
      this.colliders.push({
        type: "box",
        minX: bx - 1.1,
        maxX: bx + 1.1,
        minZ: center.z - 12.2,
        maxZ: center.z + 12.2,
        label: "stadium_bleacher",
      });
    }

    // Garden flowerbeds and park trees around stadium
    this.createGardenFlowerBed(new THREE.Vector3(center.x + 13, 2.60, center.z - 10), 2.5, 7);
    this.createGardenFlowerBed(new THREE.Vector3(center.x + 13, 2.60, center.z + 10), 2.5, 7);
    this.createParkTree(center.x - 14, center.z - 14, 2.60, false);
    this.createParkTree(center.x - 14, center.z + 14, 2.60, true);

    // Park benches & Lampposts for spectators
    this.createParkBench(center.x + 14, center.z, 2.60, -Math.PI / 2);
    this.createGardenLampPost(center.x - 12, center.z - 12, 2.60);
    this.createGardenLampPost(center.x - 12, center.z + 12, 2.60);
    this.createGardenLampPost(center.x + 14, center.z - 12, 2.60);
    this.createGardenLampPost(center.x + 14, center.z + 12, 2.60);
  }

  private createRamp(pos: THREE.Vector3, rotY: number) {
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 7.5), rampMat);
    ramp.position.set(pos.x, 0.65, pos.z);
    ramp.rotation.y = rotY;
    ramp.rotation.x = -0.24;
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    this.scene.add(ramp);
  }

  // =========================================================================
  // CONNECTING ARCHED WOODEN BRIDGES (Photorealistic Maritime Links)
  // =========================================================================
  private buildConnectingBridges() {
    // 1. Central Plaza (Hub) <-> MOBA Sanctuary (Arched timber trestle)
    this.createBridgeSegment(new THREE.Vector3(-18, 4.80, -18), new THREE.Vector3(-52, 6.60, -50), 1.6);
    // 2. Central Plaza (Hub) <-> Battle Royale Outpost
    this.createBridgeSegment(new THREE.Vector3(18, 4.80, -16), new THREE.Vector3(56, 7.00, -45), 1.6);
    // 3. Central Plaza (Hub) <-> Voxel Sandbox Bay
    this.createBridgeSegment(new THREE.Vector3(-16, 4.80, 18), new THREE.Vector3(-48, 4.70, 52), 1.4);
    // 4. Central Plaza (Hub) <-> Arcade Soccer Arena
    this.createBridgeSegment(new THREE.Vector3(16, 4.80, 18), new THREE.Vector3(48, 2.60, 48), 1.0);
  }

  private createBridgeSegment(p1: THREE.Vector3, p2: THREE.Vector3, arch: number = 1.2) {
    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const totalDist = Math.hypot(dx, dz);
    const yaw = Math.atan2(dx, dz);
    const width = 4.2;

    const woodPlankMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.82 });
    const woodBeamMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.88 });
    const woodRailingMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.75 });
    const ironCollarMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const stoneAbutmentMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });

    // 1. Stone Abutments at Shore Connections (Pangkal Jembatan Kokoh Menyatu Sempurna dengan Jalan)
    for (const pt of [p1, p2]) {
      const abutment = new THREE.Mesh(new THREE.BoxGeometry(width + 0.6, 2.6, 3.8), stoneAbutmentMat);
      abutment.position.set(pt.x, pt.y - 1.3, pt.z);
      abutment.rotation.y = yaw;
      abutment.receiveShadow = true;
      abutment.castShadow = true;
      this.scene.add(abutment);
    }

    // 2. Arched Modular Timber Bays along Span
    const numSegments = 24;
    for (let i = 0; i < numSegments; i++) {
      const t0 = i / numSegments;
      const t1 = (i + 1) / numSegments;
      const tMid = (t0 + t1) / 2;

      const y0 = p1.y * (1 - t0) + p2.y * t0 + arch * 4 * t0 * (1 - t0);
      const y1 = p1.y * (1 - t1) + p2.y * t1 + arch * 4 * t1 * (1 - t1);
      const yMid = p1.y * (1 - tMid) + p2.y * tMid + arch * 4 * tMid * (1 - tMid);

      const xMid = p1.x + tMid * dx;
      const zMid = p1.z + tMid * dz;

      const segLen = totalDist / numSegments;
      const pitch = Math.atan2(y1 - y0, segLen);

      const bay = new THREE.Group();
      bay.position.set(xMid, yMid, zMid);
      bay.rotation.y = yaw;
      bay.rotation.x = -pitch;

      // Longitudinal Heavy Stringer Beams (Balok Gelagar Kayu Penyangga di Bawah)
      for (const s of [-width / 2 + 0.35, width / 2 - 0.35]) {
        const stringer = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.30, segLen + 0.08), woodBeamMat);
        stringer.position.set(s, -0.20, 0);
        stringer.castShadow = true;
        bay.add(stringer);
      }

      // Individual Crosswise Timber Deck Planks (Papan Kayu Melintang Rapi)
      const planksPerBay = 3;
      const plankW = segLen / planksPerBay;
      for (let p = 0; p < planksPerBay; p++) {
        const plankZ = (p - (planksPerBay - 1) / 2) * plankW;
        const plank = new THREE.Mesh(new THREE.BoxGeometry(width, 0.12, plankW * 0.90), woodPlankMat);
        plank.position.set(0, -0.06, plankZ);
        plank.receiveShadow = true;
        bay.add(plank);
      }

      // Railing Top Handrail & Safety Beam
      for (const side of [-width / 2 + 0.12, width / 2 - 0.12]) {
        const handrail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.10, segLen + 0.05), woodRailingMat);
        handrail.position.set(side, 0.92, 0);
        bay.add(handrail);

        const midRail = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, segLen + 0.05), woodRailingMat);
        midRail.position.set(side, 0.48, 0);
        bay.add(midRail);

        const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.10, 0.15), woodBeamMat);
        post.position.set(side, 0.50, 0);
        post.castShadow = true;
        bay.add(post);

        const diag1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.60, 0.06), woodRailingMat);
        diag1.position.set(side, 0.48, 0);
        diag1.rotation.x = Math.PI / 4;
        bay.add(diag1);
        const diag2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.60, 0.06), woodRailingMat);
        diag2.position.set(side, 0.48, 0);
        diag2.rotation.x = -Math.PI / 4;
        bay.add(diag2);
      }

      // Heavy Marine Pilings & Nautical Lanterns (Every 4 bays)
      if (i % 4 === 0 && i > 0 && i < numSegments - 1) {
        const pilingHeight = yMid + 4.8;
        for (const side of [-width / 2 + 0.35, width / 2 - 0.35]) {
          const piling = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.24, pilingHeight, 10), woodBeamMat);
          piling.position.set(side, -pilingHeight / 2 - 0.18, 0);
          piling.castShadow = true;
          bay.add(piling);

          const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.18, 10), ironCollarMat);
          collar.position.set(side, -yMid + 0.1, 0);
          bay.add(collar);
        }

        const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(width, 0.26, 0.26), woodBeamMat);
        crossBeam.position.set(0, -0.48, 0);
        bay.add(crossBeam);

        for (const side of [-width / 2 + 0.12, width / 2 - 0.12]) {
          const lampPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.40, 0.08), woodBeamMat);
          lampPost.position.set(side, 1.15, 0);
          bay.add(lampPost);

          const lanternGlass = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), lanternMat);
          lanternGlass.position.set(side, 1.40, 0);
          bay.add(lanternGlass);
        }
      }

      this.scene.add(bay);
    }

    this.bridges.push({ p1, p2, width, arch });
  }

  // =========================================================================
  // OFFICIAL MILO SPACE HERO CAT AVATAR (Faithful to App Icon Artwork)
  // =========================================================================
  private buildMiloAvatar(): THREE.Group {
    const cat = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.65 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 }); // Blue Space Suit Vest
    const suitCollarMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.3, metalness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.15 });

    // 1. Torso with Blue Space Suit Vest
    const torso = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.54, 1.05, 16), furMat);
    body.position.y = 1.05;
    body.castShadow = true;
    torso.add(body);

    // Blue Space Suit Vest
    const suitVest = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.56, 0.72, 16), suitMat);
    suitVest.position.y = 1.02;
    torso.add(suitVest);

    // White Belly Patch (Front facing -Z)
    const belly = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.55, 0.22), whiteMat);
    belly.position.set(0, 0.98, -0.44);
    torso.add(belly);

    // Golden Cat Hero Emblem on Chest (Front facing -Z)
    const emblem = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.1), goldMat);
    emblem.position.set(0, 1.15, -0.48);
    torso.add(emblem);

    // Astronaut Jetpack on Back (Rear facing +Z towards camera)
    const jetpack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.3), suitCollarMat);
    jetpack.position.set(0, 1.05, 0.45);
    torso.add(jetpack);

    const nozzleL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.25, 8), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
    nozzleL.position.set(-0.16, 0.65, 0.45);
    torso.add(nozzleL);

    const nozzleR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.25, 8), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
    nozzleR.position.set(0.16, 0.65, 0.45);
    torso.add(nozzleR);

    cat.add(torso);

    // 2. Head with Tabby Markings, Big Eyes & Bubble Helmet
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.88, 0);

    const faceTex = createMiloFaceTexture();
    const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.65 });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 24, 24), faceMat);
    head.rotation.y = Math.PI / 2; // Face texture maps to front (-Z)
    head.castShadow = true;
    this.headGroup.add(head);

    // White Muzzle & Pink Nose (Front facing -Z)
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), whiteMat);
    muzzle.position.set(0, -0.1, -0.44);
    muzzle.scale.set(1.1, 0.7, 0.8);
    this.headGroup.add(muzzle);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.08, 4), pinkMat);
    nose.position.set(0, -0.05, -0.6);
    nose.rotation.x = -Math.PI / 2;
    this.headGroup.add(nose);

    // Cat Ears
    const earLGroup = new THREE.Group();
    earLGroup.position.set(-0.32, 0.46, 0);
    earLGroup.rotation.z = 0.25;
    this.earL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.38, 5), furMat);
    const innerL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 4), pinkMat);
    innerL.position.set(0, -0.02, -0.06);
    earLGroup.add(this.earL);
    earLGroup.add(innerL);
    this.headGroup.add(earLGroup);

    const earRGroup = new THREE.Group();
    earRGroup.position.set(0.32, 0.46, 0);
    earRGroup.rotation.z = -0.25;
    this.earR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.38, 5), furMat);
    const innerR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 4), pinkMat);
    innerR.position.set(0, -0.02, -0.06);
    earRGroup.add(this.earR);
    earRGroup.add(innerR);
    this.headGroup.add(earRGroup);

    // TRANSPARENT ASTRONAUT BUBBLE HELMET (Official Artwork Feature)
    const helmetMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.06,
      transmission: 0.9,
      thickness: 0.4,
      transparent: true,
      opacity: 0.6,
      specularIntensity: 1.0,
      clearcoat: 1.0,
    });
    this.bubbleHelmet = new THREE.Mesh(new THREE.SphereGeometry(0.74, 28, 28), helmetMat);
    this.bubbleHelmet.position.set(0, 0.06, -0.05);
    this.headGroup.add(this.bubbleHelmet);

    // Helmet Collar Ring
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.58, 0.12, 20), suitCollarMat);
    collar.position.set(0, -0.42, 0);
    this.headGroup.add(collar);

    cat.add(this.headGroup);

    // 3. Articulated Legs (Calibrated so paw pads touch ground at exactly y = 0.0)
    const legGeo = new THREE.CylinderGeometry(0.14, 0.13, 0.65, 12);
    const pawGeo = new THREE.SphereGeometry(0.17, 12, 12);

    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.25, 0.72, 0);
    const legMeshL = new THREE.Mesh(legGeo, furMat);
    legMeshL.position.y = -0.3;
    legMeshL.castShadow = true;
    this.leftLeg.add(legMeshL);

    const pawL = new THREE.Mesh(pawGeo, whiteMat);
    pawL.position.set(0, -0.6, -0.06);
    pawL.scale.set(1.0, 0.7, 1.2);
    this.leftLeg.add(pawL);
    cat.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.25, 0.72, 0);
    const legMeshR = new THREE.Mesh(legGeo, furMat);
    legMeshR.position.y = -0.3;
    legMeshR.castShadow = true;
    this.rightLeg.add(legMeshR);

    const pawR = new THREE.Mesh(pawGeo, whiteMat);
    pawR.position.set(0, -0.6, -0.06);
    pawR.scale.set(1.0, 0.7, 1.2);
    this.rightLeg.add(pawR);
    cat.add(this.rightLeg);

    // 4. Articulated Arms
    const armGeo = new THREE.CylinderGeometry(0.12, 0.11, 0.6, 12);

    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.52, 1.35, 0);
    const armMeshL = new THREE.Mesh(armGeo, furMat);
    armMeshL.position.y = -0.28;
    armMeshL.castShadow = true;
    this.leftArm.add(armMeshL);

    const handPawL = new THREE.Mesh(pawGeo, whiteMat);
    handPawL.position.set(0, -0.55, -0.04);
    handPawL.scale.set(0.9, 0.7, 1.0);
    this.leftArm.add(handPawL);
    cat.add(this.leftArm);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.52, 1.35, 0);
    const armMeshR = new THREE.Mesh(armGeo, furMat);
    armMeshR.position.y = -0.28;
    armMeshR.castShadow = true;
    this.rightArm.add(armMeshR);

    const handPawR = new THREE.Mesh(pawGeo, whiteMat);
    handPawR.position.set(0, -0.55, -0.04);
    handPawR.scale.set(0.9, 0.7, 1.0);
    this.rightArm.add(handPawR);
    cat.add(this.rightArm);

    // 5. Tail (Striped Tabby Cat Tail on Back facing +Z)
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.75, 0.48);

    const tailBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.45, 8), furMat);
    tailBase.position.set(0, 0.1, 0.15);
    tailBase.rotation.x = 0.8;
    this.tailGroup.add(tailBase);

    const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), whiteMat);
    tailTip.position.set(0, 0.25, 0.35);
    this.tailGroup.add(tailTip);
    cat.add(this.tailGroup);

    return cat;
  }

  // =========================================================================
  // ANIMATED 3D CHIBI NPCS
  // =========================================================================
  private spawnAnimatedNPCs() {
    this.npcs.forEach((npc) => {
      const group = new THREE.Group();
      group.position.copy(npc.pos);

      // Set natural posed orientation (facing scenic post)
      const defaultRotY: Record<string, number> = {
        lexa: 0.15,
        valen: 0.85,
        jax: -0.75,
        leo: 0.45,
      };
      group.rotation.y = defaultRotY[npc.id] ?? 0;

      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

      // Head Group (Natural posed head, doesn't swivel towards player)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.7, 0);

      // Procedural Anime Face Texture mapped to front (-Z)
      const faceTex = createNPCFaceTexture(npc.id);
      faceTex.needsUpdate = true;
      const faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.65 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 24), faceMat);
      head.rotation.y = Math.PI / 2; // Centers texture directly towards -Z (front)
      head.castShadow = true;
      headGroup.add(head);

      // Legs & Boots firmly planted on ground
      for (const lx of [-0.18, 0.18]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.52, 12), darkMat);
        leg.position.set(lx, 0.26, 0);
        leg.castShadow = true;
        group.add(leg);

        const boot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.36), darkMat);
        boot.position.set(lx, 0.09, -0.06);
        group.add(boot);
      }

      let waveArm: THREE.Group | undefined;
      let juggledBall: THREE.Mesh | undefined;

      if (npc.id === "lexa") {
        // --- LEXA: THE ARCHIPELAGO NAVIGATOR & ADVENTURER ---
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });

        // Hair Back volume
        const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.47, 16, 16, 0, Math.PI, 0, Math.PI), hairMat);
        hairBack.position.set(0, 0, 0.08);
        hairBack.rotation.x = -Math.PI / 2;
        headGroup.add(hairBack);

        // Front layered bangs
        for (const bx of [-0.22, 0, 0.22]) {
          const bang = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.22, 0.1), hairMat);
          bang.position.set(bx, 0.24, -0.4);
          bang.rotation.z = bx * 0.4;
          bang.rotation.x = -0.2;
          headGroup.add(bang);
        }

        // Side hair locks
        for (const sx of [-0.42, 0.42]) {
          const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.42, 8), hairMat);
          lock.position.set(sx, -0.05, -0.15);
          headGroup.add(lock);
        }

        // Explorer Safari Hat with wide brim, leather strap & gold compass buckle
        const vestMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
        const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.06, 24), vestMat);
        hatBrim.position.y = 0.34;
        headGroup.add(hatBrim);

        const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.46, 0.36, 16), vestMat);
        hatCrown.position.y = 0.53;
        headGroup.add(hatCrown);

        const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.465, 0.465, 0.08, 16), darkMat);
        hatBand.position.y = 0.39;
        headGroup.add(hatBand);

        const compassBuckle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 12), goldMat);
        compassBuckle.position.set(0, 0.39, -0.47);
        compassBuckle.rotation.x = Math.PI / 2;
        headGroup.add(compassBuckle);

        // Khaki jacket body with utility belt
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 0.92, 14), vestMat);
        body.position.y = 0.92;
        body.castShadow = true;
        group.add(body);

        // White collar
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.12, 12), whiteMat);
        collar.position.y = 1.34;
        group.add(collar);

        // Utility belt & pouches
        const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16), darkMat);
        belt.position.y = 0.62;
        group.add(belt);

        for (const px of [-0.38, 0.38]) {
          const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.14), darkMat);
          pouch.position.set(px, 0.62, 0);
          group.add(pouch);
        }

        // Explorer backpack on back (+Z)
        const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.62, 0.32), darkMat);
        backpack.position.set(0, 0.95, 0.38);
        backpack.castShadow = true;
        group.add(backpack);

        const bedroll = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.54, 12), new THREE.MeshStandardMaterial({ color: 0x059669 }));
        bedroll.position.set(0, 1.30, 0.38);
        bedroll.rotation.z = Math.PI / 2;
        group.add(bedroll);

        // Friendly animated waving arm (right arm)
        waveArm = new THREE.Group();
        waveArm.position.set(0.46, 1.25, 0);
        const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.52), vestMat);
        armMesh.position.y = 0.24;
        waveArm.add(armMesh);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), whiteMat);
        hand.position.y = 0.50;
        waveArm.add(hand);
        group.add(waveArm);

        // Resting left arm
        const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.52), vestMat);
        leftArm.position.set(-0.46, 0.95, 0);
        group.add(leftArm);

      } else if (npc.id === "valen") {
        // --- VALEN: MOBA SANCTUARY KNIGHT & RUNE GUARDIAN ---
        const armorMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.18 });
        const cyanGlowMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.2 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

        // Dark navy hair strands peeking out
        const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.46, 14, 14, 0, Math.PI, 0, Math.PI), hairMat);
        hairBack.position.set(0, -0.05, 0.08);
        hairBack.rotation.x = -Math.PI / 2;
        headGroup.add(hairBack);

        // Paladin Winged Circlet Visor
        const circlet = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16), armorMat);
        circlet.position.y = 0.25;
        headGroup.add(circlet);

        // Forehead Rune Gem
        const runeGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), cyanGlowMat);
        runeGem.position.set(0, 0.25, -0.47);
        headGroup.add(runeGem);

        // Winged visor fins on sides
        for (const wx of [-0.48, 0.48]) {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.25), armorMat);
          wing.position.set(wx, 0.35, -0.05);
          wing.rotation.z = (wx > 0 ? -1 : 1) * 0.4;
          wing.rotation.y = (wx > 0 ? 1 : -1) * 0.2;
          headGroup.add(wing);
        }

        // Armored Torso with Cyan Arc-Reactor
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.48, 0.96, 14), armorMat);
        body.position.y = 0.94;
        body.castShadow = true;
        group.add(body);

        const chestRune = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 16), cyanGlowMat);
        chestRune.position.set(0, 1.15, -0.42);
        chestRune.rotation.x = Math.PI / 2;
        group.add(chestRune);

        // Giant Winged Shoulder Pauldrons
        for (const px of [-0.52, 0.52]) {
          const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), armorMat);
          pauldron.position.set(px, 1.35, 0);
          group.add(pauldron);

          const pGlow = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 16), cyanGlowMat);
          pGlow.position.set(px, 1.35, 0);
          pGlow.rotation.y = Math.PI / 2;
          group.add(pGlow);
        }

        // Royal Blue Cape fluttering on back (+Z)
        const capeMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6, side: THREE.DoubleSide });
        const cape = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.1), capeMat);
        cape.position.set(0, 0.85, 0.44);
        cape.rotation.x = 0.15;
        group.add(cape);

        // Cyan Glowing Greatsword held at side
        const swordGroup = new THREE.Group();
        swordGroup.position.set(0.60, 0.7, 0.1);
        swordGroup.rotation.z = -0.2;

        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.8, 0.38), cyanGlowMat);
        blade.position.y = 0.9;
        swordGroup.add(blade);

        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.7), goldMat);
        guard.position.y = 0.0;
        swordGroup.add(guard);

        const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5), darkMat);
        hilt.position.y = -0.28;
        swordGroup.add(hilt);

        group.add(swordGroup);

      } else if (npc.id === "jax") {
        // --- JAX: BATTLE ROYALE OUTPOST ACE & SURVIVOR ---
        const camoMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
        const beretMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });

        // Short military cropped hair behind head
        const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.45, 14, 14, 0, Math.PI, 0, Math.PI), hairMat);
        hairBack.position.set(0, 0, 0.08);
        hairBack.rotation.x = -Math.PI / 2;
        headGroup.add(hairBack);

        // Red Tactical Beret sharply tilted with silver emblem
        const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.50, 0.46, 0.22, 16), beretMat);
        beret.position.set(0.10, 0.38, 0);
        beret.rotation.z = -0.28;
        headGroup.add(beret);

        const beretBadge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.04), goldMat);
        beretBadge.position.set(0.02, 0.38, -0.46);
        headGroup.add(beretBadge);

        // Tactical Headset with Ear Cup & Boom Microphone
        const headsetCup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.10, 10), darkMat);
        headsetCup.position.set(-0.44, 0.05, 0);
        headsetCup.rotation.z = Math.PI / 2;
        headGroup.add(headsetCup);

        const headsetAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45), darkMat);
        headsetAntenna.position.set(-0.45, 0.35, 0);
        headGroup.add(headsetAntenna);

        const micBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.32), darkMat);
        micBoom.position.set(-0.35, -0.12, -0.32);
        micBoom.rotation.x = Math.PI / 3;
        headGroup.add(micBoom);

        // Combat Tactical Plate Carrier Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.92, 14), camoMat);
        body.position.y = 0.92;
        body.castShadow = true;
        group.add(body);

        // Ammo Pouches on Plate Carrier (Front facing -Z)
        for (const px of [-0.18, 0, 0.18]) {
          const mag = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), darkMat);
          mag.position.set(px, 0.95, -0.42);
          group.add(mag);
        }

        // Radio on shoulder
        const shoulderRadio = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.26, 0.12), darkMat);
        shoulderRadio.position.set(-0.42, 1.25, -0.1);
        group.add(shoulderRadio);

        // Tactical Binoculars / Rangefinder
        const bino = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.22), darkMat);
        bino.position.set(0, 0.65, -0.44);
        group.add(bino);

      } else if (npc.id === "leo") {
        // --- LEO: BEACH STADIUM CHAMPION STRIKER ---
        const jerseyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e1b18, roughness: 0.8 });

        // Dynamic Spiky Anime Soccer Hair
        const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.46, 14, 14, 0, Math.PI, 0, Math.PI), hairMat);
        hairBase.position.set(0, 0.02, 0.06);
        hairBase.rotation.x = -Math.PI / 2;
        headGroup.add(hairBase);

        // Spikes on top and back
        const spikeGeo = new THREE.ConeGeometry(0.14, 0.36, 5);
        const spikeOffsets: [number, number, number, number, number][] = [
          [0, 0.45, -0.15, -0.3, 0],
          [-0.22, 0.42, -0.1, -0.2, 0.4],
          [0.22, 0.42, -0.1, -0.2, -0.4],
          [0, 0.48, 0.15, 0.3, 0],
          [-0.18, 0.45, 0.2, 0.3, 0.3],
          [0.18, 0.45, 0.2, 0.3, -0.3],
        ];
        spikeOffsets.forEach(([sx, sy, sz, rx, rz]) => {
          const spike = new THREE.Mesh(spikeGeo, hairMat);
          spike.position.set(sx, sy, sz);
          spike.rotation.x = rx;
          spike.rotation.z = rz;
          headGroup.add(spike);
        });

        // Crisp White Athletic Headband
        const headband = new THREE.Mesh(new THREE.CylinderGeometry(0.455, 0.455, 0.14, 16), whiteMat);
        headband.position.y = 0.20;
        headGroup.add(headband);

        // Sporty #10 Jersey Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 0.92, 14), jerseyMat);
        body.position.y = 0.92;
        body.castShadow = true;
        group.add(body);

        // White V-Neck Collar
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.1), whiteMat);
        collar.position.y = 1.34;
        group.add(collar);

        // #10 Number Emblem on Chest (Front facing -Z)
        const numberPatch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.26, 0.05), whiteMat);
        numberPatch.position.set(0, 1.05, -0.42);
        group.add(numberPatch);

        // Captain Armband on Left Arm (Yellow)
        const captainArmband = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 10), goldMat);
        captainArmband.position.set(-0.46, 1.15, 0);
        group.add(captainArmband);

        // Animated Mini Juggled Soccer Ball
        const soccerBallTex = createSoccerBallTexture();
        const ballMat = new THREE.MeshStandardMaterial({ map: soccerBallTex, roughness: 0.35 });
        juggledBall = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), ballMat);
        juggledBall.position.set(0.38, 0.45, -0.45);
        group.add(juggledBall);
      }

      group.add(headGroup);

      // Floating Holographic Quest Diamond with Idle Bobbing Bloom
      const beaconGroup = new THREE.Group();
      beaconGroup.position.y = 2.75;
      const beacon = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.34, 0),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.4 })
      );
      beaconGroup.add(beacon);

      const beaconRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.04, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.2 })
      );
      beaconRing.rotation.x = Math.PI / 2;
      beaconGroup.add(beaconRing);

      group.add(beaconGroup);

      this.scene.add(group);
      this.npcMeshMap.set(npc.id, { group, head: headGroup, waveArm, juggledBall });
      this.colliders.push({ x: npc.pos.x, z: npc.pos.z, radius: 0.95, label: npc.id });
    });
  }

  // =========================================================================
  // COLLECTIBLES & SOCCER ARENA
  // =========================================================================
  private spawnTokens() {
    const tokenGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16);
    tokenGeo.rotateX(Math.PI / 2);
    const tokenMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.65,
      metalness: 0.9,
      roughness: 0.1,
    });

    const spawnCoords: [number, number, number][] = [
      // Central Plaza Garden Promenade (6 coins)
      [0, 6.0, -7], [0, 6.0, 7], [-7, 6.0, 0], [7, 6.0, 0], [-8, 6.0, -8], [8, 6.0, 8],

      // Bridge 1 to MOBA (4 coins along arched wooden walkway)
      [-24.8, 7.28, -24.4], [-31.6, 8.16, -30.8], [-38.4, 8.52, -37.2], [-45.2, 8.36, -43.6],

      // Bridge 2 to Battle Royale (4 coins along arched wooden walkway)
      [25.6, 7.36, -21.8], [33.2, 8.32, -27.6], [40.8, 8.76, -33.4], [48.4, 8.68, -39.2],

      // Bridge 3 to Voxel Bay (4 coins along arched wooden walkway)
      [-22.4, 6.78, 24.8], [-28.8, 7.20, 31.6], [-35.2, 7.18, 38.4], [-41.6, 6.72, 45.2],

      // Bridge 4 to Soccer Arena (4 coins along arched wooden walkway)
      [22.4, 6.10, 24.0], [28.8, 5.98, 30.0], [35.2, 5.54, 36.0], [41.6, 4.78, 42.0],

      // MOBA Sanctuary (3 coins)
      [-68, 7.8, -60], [-74, 7.8, -68], [-64, 7.8, -72],

      // Battle Royale Outpost (3 coins)
      [72, 8.2, -54], [78, 8.2, -66], [68, 8.2, -72],

      // Voxel Bay (5 coins elevated above cubic block tops & arrival terrace)
      [-65.0, 7.6, 70.0], // Peak summit of Voxel pyramid hill (block top at 6.2)
      [-60.4, 6.2, 65.4], // Upper terrace step (block top at 4.7)
      [-69.6, 6.2, 74.6], // Upper terrace step (block top at 4.7)
      [-54.0, 6.1, 59.0], // Paved stone pathway leading to bridge (road at 4.7)
      [-48.0, 6.1, 52.0], // Arrival quay at bridge touchdown (quay at 4.7)

      // Arcade Soccer Arena (2 coins)
      [60, 3.8, 60], [70, 3.8, 70],
    ];

    spawnCoords.forEach(([x, y, z]) => {
      const token = new THREE.Mesh(tokenGeo, tokenMat);
      token.position.set(x, y, z);
      token.castShadow = true;
      this.scene.add(token);
      this.tokens.push({ mesh: token, collected: false, baseY: y });
    });

    this.totalCoins = this.tokens.length;
  }

  private spawnSpeedRings() {
    // Sized to frame the 4.2m bridge as an arched portal gate (radius 2.3, bottom clears deck by +0.15m)
    const ringGeo = new THREE.TorusGeometry(2.3, 0.22, 10, 28);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 1.0,
      roughness: 0.1,
    });

    // Placed at the apex of each arched bridge, rotated to align with the bridge axis
    const ringConfigs: [number, number, number, number][] = [
      // Bridge 1 (NW to MOBA): apex deck y=7.30 -> ring center y=9.75 (bottom at 7.45m, clears 7.30m deck)
      [-35, 9.75, -34, Math.atan2(-34, -32)],
      // Bridge 2 (NE to Battle Royale): apex deck y=7.50 -> ring center y=9.95 (bottom at 7.65m, clears 7.50m deck)
      [37, 9.95, -30.5, Math.atan2(38, -29)],
      // Bridge 3 (SW to Voxel): apex deck y=6.15 -> ring center y=8.60 (bottom at 6.30m, clears 6.15m deck)
      [-32, 8.60, 35, Math.atan2(-32, 34)],
      // Bridge 4 (SE to Soccer): apex deck y=4.70 -> ring center y=7.15 (bottom at 4.85m, clears 4.70m deck)
      [32, 7.15, 33, Math.atan2(32, 30)],
    ];

    ringConfigs.forEach(([x, y, z, rotY]) => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.rotation.y = rotY;
      this.scene.add(ring);
      this.speedRings.push(ring);
    });
  }

  private createTubeBetweenPoints(
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    radius: number,
    material: THREE.Material
  ): THREE.Mesh {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(radius, radius, len, 16);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.addVectors(p1, p2).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    mesh.castShadow = true;
    return mesh;
  }

  private spawnSoccerArena() {
    const pos = new THREE.Vector3(65, 0, 65);
    const turfY = 2.66;
    const goalFrontZ = pos.z + 13.0; // z = 78.0
    const topDepth = 1.4;            // horizontal top roof depth -> 79.4
    const totalDepth = 3.5;          // ground base depth -> 81.5
    const goalBackZ = goalFrontZ + totalDepth;
    const goalWidth = 9.0;
    const goalHeight = 3.4;

    const halfW = goalWidth / 2;
    const leftX = pos.x - halfW;  // 60.5
    const rightX = pos.x + halfW; // 69.5

    // Key 3D Vertices of the Stadium Goal Frame
    // Left side vertices:
    const vFrontBotL = new THREE.Vector3(leftX, turfY + 0.1, goalFrontZ);
    const vFrontTopL = new THREE.Vector3(leftX, turfY + goalHeight, goalFrontZ);
    const vTopBackL  = new THREE.Vector3(leftX, turfY + goalHeight, goalFrontZ + topDepth);
    const vBotBackL  = new THREE.Vector3(leftX, turfY + 0.1, goalBackZ);

    // Right side vertices:
    const vFrontBotR = new THREE.Vector3(rightX, turfY + 0.1, goalFrontZ);
    const vFrontTopR = new THREE.Vector3(rightX, turfY + goalHeight, goalFrontZ);
    const vTopBackR  = new THREE.Vector3(rightX, turfY + goalHeight, goalFrontZ + topDepth);
    const vBotBackR  = new THREE.Vector3(rightX, turfY + 0.1, goalBackZ);

    // 1. Glossy White Steel Post Material
    const postMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.65,
    });

    const postRad = 0.14;
    const supportRad = 0.11;

    // A. Front Goal Face (The Main Frame)
    this.scene.add(this.createTubeBetweenPoints(vFrontBotL, vFrontTopL, postRad, postMat));
    this.scene.add(this.createTubeBetweenPoints(vFrontBotR, vFrontTopR, postRad, postMat));
    this.scene.add(this.createTubeBetweenPoints(vFrontTopL, vFrontTopR, postRad, postMat));

    // B. Top Depth Stanchions (Horizontal rails extending backwards from crossbar)
    this.scene.add(this.createTubeBetweenPoints(vFrontTopL, vTopBackL, supportRad, postMat));
    this.scene.add(this.createTubeBetweenPoints(vFrontTopR, vTopBackR, supportRad, postMat));
    this.scene.add(this.createTubeBetweenPoints(vTopBackL, vTopBackR, supportRad, postMat));

    // C. Sloped Diagonal Back Struts (Connecting top-back corner to bottom-back ground corner)
    this.scene.add(this.createTubeBetweenPoints(vTopBackL, vBotBackL, supportRad, postMat));
    this.scene.add(this.createTubeBetweenPoints(vTopBackR, vBotBackR, supportRad, postMat));

    // D. Ground Base Stabilizer Frame
    this.scene.add(this.createTubeBetweenPoints(vFrontBotL, vBotBackL, supportRad, postMat));
    this.scene.add(this.createTubeBetweenPoints(vFrontBotR, vBotBackR, supportRad, postMat));
    this.scene.add(this.createTubeBetweenPoints(vBotBackL, vBotBackR, supportRad, postMat));

    // Spherical Corner Welds at all 8 key vertices for 100% seamless contiguous joints
    const jointGeo = new THREE.SphereGeometry(postRad * 1.05, 16, 16);
    [vFrontTopL, vFrontTopR, vTopBackL, vTopBackR, vBotBackL, vBotBackR, vFrontBotL, vFrontBotR].forEach((v) => {
      const joint = new THREE.Mesh(jointGeo, postMat);
      joint.position.copy(v);
      this.scene.add(joint);
    });

    // Physics Colliders for Front Posts
    this.colliders.push({ x: leftX, z: goalFrontZ, radius: 0.35, label: "goal_post_left" });
    this.colliders.push({ x: rightX, z: goalFrontZ, radius: 0.35, label: "goal_post_right" });

    // 6. Realistic 3D Woven Soccer Netting Panels (White Diamond Pattern)
    const netTex = createGoalNetTexture();
    const netMat = new THREE.MeshStandardMaterial({
      map: netTex,
      transparent: true,
      opacity: 0.70,
      side: THREE.DoubleSide,
      roughness: 0.75,
      depthWrite: false,
    });

    // Helper to generate a 2-triangle Quad BufferGeometry from 4 points
    const createQuadNet = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3, uvScaleU = 6, uvScaleV = 3) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array([
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z,

        p1.x, p1.y, p1.z,
        p3.x, p3.y, p3.z,
        p4.x, p4.y, p4.z,
      ]);
      const uvs = new Float32Array([
        0, 0,
        uvScaleU, 0,
        uvScaleU, uvScaleV,

        0, 0,
        uvScaleU, uvScaleV,
        0, uvScaleV,
      ]);
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, netMat);
    };

    // Roof Net: between front top crossbar and top back crossbar
    this.scene.add(createQuadNet(vFrontTopL, vFrontTopR, vTopBackR, vTopBackL, 8, 2));

    // Sloped Rear Net: between top back crossbar and bottom rear ground crossbar
    this.scene.add(createQuadNet(vTopBackL, vTopBackR, vBotBackR, vBotBackL, 8, 4));

    // Left Side Netting (Quad from front upright, top rail, back diagonal, ground rail)
    this.scene.add(createQuadNet(vFrontBotL, vFrontTopL, vTopBackL, vBotBackL, 3, 3));

    // Right Side Netting (Quad from front upright, top rail, back diagonal, ground rail)
    this.scene.add(createQuadNet(vFrontBotR, vBotBackR, vTopBackR, vFrontTopR, 3, 3));

    // 7. Solid Collision Backstop (Ball cannot escape through back or sides of net)
    this.colliders.push({
      type: "box",
      minX: leftX - 0.2,
      maxX: rightX + 0.2,
      minZ: goalBackZ - 0.2,
      maxZ: goalBackZ + 1.2,
      label: "goal_back_net",
    });
    this.colliders.push({
      type: "box",
      minX: leftX - 0.8,
      maxX: leftX + 0.1,
      minZ: goalFrontZ,
      maxZ: goalBackZ + 0.2,
      label: "goal_side_net_left",
    });
    this.colliders.push({
      type: "box",
      minX: rightX - 0.1,
      maxX: rightX + 0.8,
      minZ: goalFrontZ,
      maxZ: goalBackZ + 0.2,
      label: "goal_side_net_right",
    });

    // 8. Goal Trigger Detection Volume Inside Goal Net
    this.goalBox.set(
      new THREE.Vector3(leftX + 0.3, turfY, goalFrontZ + 0.2),
      new THREE.Vector3(rightX - 0.3, turfY + goalHeight + 0.5, goalBackZ + 0.5)
    );

    // 9. Giant Arcade Soccer Ball
    const soccerTex = createSoccerBallTexture();
    const ballMat = new THREE.MeshStandardMaterial({ map: soccerTex, roughness: 0.35, metalness: 0.1 });
    this.soccerBall = new THREE.Mesh(new THREE.SphereGeometry(1.5, 24, 24), ballMat);
    this.soccerBall.position.set(pos.x, turfY + 1.6, pos.z);
    this.soccerBall.castShadow = true;
    this.scene.add(this.soccerBall);
  }

  private setupParticles() {
    // Water Wake Particles
    const count = 90;
    const geo = new THREE.BufferGeometry();
    this.wakePositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      this.wakePositions[i * 3 + 1] = -100;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(this.wakePositions, 3));
    this.wakeParticles = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.85, transparent: true, opacity: 0.75 })
    );
    this.scene.add(this.wakeParticles);

    // Rainbow Comet Thruster Particles (Space Theme)
    const tCount = 60;
    const tGeo = new THREE.BufferGeometry();
    this.thrusterPositions = new Float32Array(tCount * 3);
    for (let i = 0; i < tCount; i++) {
      this.thrusterPositions[i * 3 + 1] = -100;
    }
    tGeo.setAttribute("position", new THREE.BufferAttribute(this.thrusterPositions, 3));
    this.thrusterParticles = new THREE.Points(
      tGeo,
      new THREE.PointsMaterial({ color: 0x38bdf8, size: 1.1, transparent: true, opacity: 0.9 })
    );
    this.scene.add(this.thrusterParticles);
  }

  // =========================================================================
  // ANIMATION LOOP & PHYSICS
  // =========================================================================
  private animate = () => {
    if (!this.isRunning) return;
    this.reqId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.08);
    const time = this.clock.getElapsedTime();

    this.updateWaterWaves(time);
    this.updatePropsAndAtmosphere(time);
    this.updatePlayerMovement(delta, time);
    this.updateNPCBehaviors(time);
    this.updateCollectibles(time);
    this.updateSoccerBall(delta);
    this.updateMinigame(delta, time);
    this.updateCameraFollow(delta);
    this.checkLocationAndProximity();

    // Render with EffectComposer for cinematic bloom
    this.composer.render();
  };

  private updateWaterWaves(time: number) {
    if (!this.waterGeometry) return;
    const posAttr = this.waterGeometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getY(i);
      const z = Math.sin(u * 0.08 + time * 2.0) * 0.18 + Math.cos(v * 0.08 + time * 1.5) * 0.18;
      posAttr.setZ(i, z);
    }
    posAttr.needsUpdate = true;
  }

  private updatePropsAndAtmosphere(time: number) {
    this.clouds.forEach((cloud, idx) => {
      cloud.position.x += 0.04 * (idx % 2 === 0 ? 1 : -1);
      if (cloud.position.x > 180) cloud.position.x = -180;
      if (cloud.position.x < -180) cloud.position.x = 180;
    });

    const foamAlpha = 0.35 + Math.sin(time * 2.2) * 0.15;
    this.foamRings.forEach((foam) => {
      (foam.material as THREE.MeshBasicMaterial).opacity = foamAlpha;
    });

    this.maritimeBuoys.forEach((buoy, i) => {
      buoy.position.y = 0.2 + Math.sin(time * 3 + i) * 0.08;
      buoy.rotation.z = Math.sin(time * 2.5 + i) * 0.08;
    });

    if (this.lighthouseBeam) {
      this.lighthouseBeam.rotation.z = time * 0.8;
    }

    if (this.mobaCrystal) {
      this.mobaCrystal.position.y = 8.5 + Math.sin(time * 2.5) * 0.35;
      this.mobaCrystal.rotation.y = time * 0.7;
    }
  }

  private updateNPCBehaviors(time: number) {
    this.npcMeshMap.forEach((npcRef, npcId) => {
      // Gentle breathing body bobbing
      npcRef.group.position.y = (this.npcs.find((n) => n.id === npcId)?.pos.y || 0) + Math.sin(time * 2.6) * 0.03;

      const distToPlayer = npcRef.group.position.distanceTo(this.playerPos);
      const isTalking = this.activeDialogueNPC?.id === npcId;

      // Natural heroic idle breathing (face does NOT follow the player)
      npcRef.head.rotation.y = THREE.MathUtils.lerp(npcRef.head.rotation.y, 0, 0.1);
      npcRef.head.rotation.x = Math.sin(time * 2.2) * 0.03; // Subtle natural breathing nod

      // Lexa friendly wave
      if (npcId === "lexa" && npcRef.waveArm) {
        if (distToPlayer < 10 || isTalking) {
          npcRef.waveArm.rotation.z = -1.2 + Math.sin(time * 8) * 0.45;
        } else {
          npcRef.waveArm.rotation.z = THREE.MathUtils.lerp(npcRef.waveArm.rotation.z, 0, 0.1);
        }
      }

      // Leo juggle soccer ball with spin
      if (npcId === "leo" && npcRef.juggledBall) {
        npcRef.juggledBall.position.y = 0.45 + Math.abs(Math.sin(time * 6)) * 0.45;
        npcRef.juggledBall.rotation.x = time * 8;
        npcRef.juggledBall.rotation.y = time * 6;
      }
    });
  }

  private updatePlayerMovement(delta: number, time: number) {
    // 1. Silky Smooth Steering
    const targetTurn = (this.inputs.left ? 1 : 0) - (this.inputs.right ? 1 : 0);
    this.currentTurnSpeed = THREE.MathUtils.lerp(this.currentTurnSpeed, targetTurn * this.turnSpeed, 12 * delta);
    this.playerRotY += this.currentTurnSpeed * delta;

    // 2. Snappy Acceleration & Sprint Dash
    let targetSpeed = 0;
    if (this.inputs.forward) {
      targetSpeed = this.maxSpeed;
    } else if (this.inputs.backward) {
      targetSpeed = -this.maxSpeed * 0.45;
    }

    if (this.inputs.boost && this.nitro > 0 && this.inputs.forward) {
      targetSpeed *= 1.45;
      this.nitro = Math.max(0, this.nitro - 25 * delta);
      this.isBoosting = true;
    } else {
      this.nitro = Math.min(100, this.nitro + 12 * delta);
      this.isBoosting = false;
    }
    this.callbacks.onNitroUpdate?.(this.nitro);

    if (this.onWater) {
      targetSpeed *= 0.65; // Water drag resistance
    }

    const accelRate = targetSpeed !== 0 ? (targetSpeed > this.currentSpeed ? this.acceleration : this.deceleration) : this.deceleration * 1.6;
    this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, targetSpeed, Math.min(1, accelRate * 0.25 * delta));

    // Translation along forward vector (-Z)
    const forwardX = -Math.sin(this.playerRotY) * this.currentSpeed;
    const forwardZ = -Math.cos(this.playerRotY) * this.currentSpeed;
    this.playerVel.x = forwardX;
    this.playerVel.z = forwardZ;

    this.playerPos.x += this.playerVel.x * delta;
    this.playerPos.z += this.playerVel.z * delta;

    this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -165, 165);
    this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -165, 165);

    // 3. SOLID OBSTACLE COLLISION RESOLUTION (Zero clipping through objects!)
    const playerRadius = 0.55;
    for (let iter = 0; iter < 2; iter++) {
      for (const col of this.colliders) {
        if ("type" in col && col.type === "box") {
          const closestX = Math.max(col.minX, Math.min(col.maxX, this.playerPos.x));
          const closestZ = Math.max(col.minZ, Math.min(col.maxZ, this.playerPos.z));
          const dx = this.playerPos.x - closestX;
          const dz = this.playerPos.z - closestZ;
          const distSq = dx * dx + dz * dz;

          if (distSq < playerRadius * playerRadius) {
            if (distSq < 0.0001) {
              const dLeft = this.playerPos.x - col.minX;
              const dRight = col.maxX - this.playerPos.x;
              const dBottom = this.playerPos.z - col.minZ;
              const dTop = col.maxZ - this.playerPos.z;
              const minEdge = Math.min(dLeft, dRight, dBottom, dTop);
              if (minEdge === dLeft) this.playerPos.x = col.minX - playerRadius;
              else if (minEdge === dRight) this.playerPos.x = col.maxX + playerRadius;
              else if (minEdge === dBottom) this.playerPos.z = col.minZ - playerRadius;
              else this.playerPos.z = col.maxZ + playerRadius;
            } else {
              const dist = Math.sqrt(distSq);
              const overlap = playerRadius - dist;
              this.playerPos.x += (dx / dist) * overlap;
              this.playerPos.z += (dz / dist) * overlap;
            }
          }
        } else {
          // Circle collider
          const dx = this.playerPos.x - col.x;
          const dz = this.playerPos.z - col.z;
          const dist = Math.hypot(dx, dz);
          const minDist = col.radius + playerRadius;
          if (dist < minDist) {
            if (dist > 0.0001) {
              const overlap = minDist - dist;
              this.playerPos.x += (dx / dist) * overlap;
              this.playerPos.z += (dz / dist) * overlap;
            } else {
              this.playerPos.z += minDist;
            }
          }
        }
      }
    }

    // 4. Ground Height & Gravity (Firmly planted on terrain/bridges or submerged in ocean)
    const groundHeight = this.calculateGroundHeight(this.playerPos.x, this.playerPos.z);

    // Water state detection (Water plane at y = 0.0; deep ocean returns -1.25)
    const wasOnWater = this.onWater;
    this.onWater = groundHeight <= -0.15;
    if (!wasOnWater && this.onWater) {
      this.audio.playSplash();
    }

    // Jump (Can jump off solid ground OR splash jump / dolphin breach out of water)
    if (this.inputs.jump && (this.isGrounded || this.onWater)) {
      this.playerVel.y = this.onWater ? 7.2 : 8.5;
      this.isGrounded = false;
      if (this.onWater) {
        this.audio.playSplash();
      }
      this.audio.playJump();
    }

    if (!this.isGrounded) {
      this.playerVel.y -= 22 * delta;
      this.playerPos.y += this.playerVel.y * delta;
      if (this.playerPos.y <= groundHeight) {
        this.playerPos.y = groundHeight;
        this.playerVel.y = 0;
        this.isGrounded = true;
        if (this.onWater) {
          this.audio.playSplash();
        }
      }
    } else {
      // Submerged swimming bobbing vs solid ground walking
      const waterBob = this.onWater ? Math.sin(time * 3.5) * 0.08 : 0;
      this.playerPos.y = THREE.MathUtils.lerp(this.playerPos.y, groundHeight + waterBob, (this.onWater ? 10 : 20) * delta);
    }

    // Audio & Speedometer
    this.audio.updateEngineSound(Math.abs(this.currentSpeed), this.isBoosting);
    this.callbacks.onSpeedUpdate?.(Math.round(Math.abs(this.currentSpeed) * 3.6));

    // Dynamic lean roll into turns
    const targetBank = -this.currentTurnSpeed * 0.12;
    this.currentBankZ = THREE.MathUtils.lerp(this.currentBankZ, targetBank, 10 * delta);

    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.y = this.playerRotY;
    this.playerGroup.rotation.z = this.currentBankZ;
    this.playerGroup.rotation.x = 0;

    // 5. MILO NATURAL RUN, WALK & SWIMMING CONTROLLER
    const speedRatio = Math.abs(this.currentSpeed) / this.maxSpeed;

    if (this.onWater) {
      // Swimming in the ocean! (Tenggelam sebatas dada di dalam air & berenang lincah)
      const swimCycle = time * 7.0;
      const paddleSwing = Math.sin(swimCycle) * 0.55;

      // Legs kick and paddle back and forth in water
      if (this.leftLeg) {
        this.leftLeg.rotation.x = paddleSwing;
        this.leftLeg.rotation.z = -0.15;
      }
      if (this.rightLeg) {
        this.rightLeg.rotation.x = -paddleSwing;
        this.rightLeg.rotation.z = 0.15;
      }

      // Front arms do swimming breaststroke / dog-paddle
      if (this.leftArm) {
        this.leftArm.rotation.x = -paddleSwing * 0.8 + 0.3;
        this.leftArm.rotation.z = 0.25;
      }
      if (this.rightArm) {
        this.rightArm.rotation.x = paddleSwing * 0.8 + 0.3;
        this.rightArm.rotation.z = -0.25;
      }

      // Torso tilts horizontally in prone swimming pose, bobs with waves
      this.catMeshGroup.position.y = Math.sin(time * 3.5) * 0.08;
      this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, -0.42, 8 * delta);
      this.catMeshGroup.rotation.y = Math.sin(swimCycle * 0.5) * 0.08;
      this.catMeshGroup.scale.set(1.0, 1.0, 1.0);

      // Head lifts up to face forward over the water surface
      if (this.headGroup) {
        this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, 0.40, 8 * delta);
      }

      // Tail wags gently above water
      if (this.tailGroup) {
        this.tailGroup.rotation.x = 0.85 + Math.sin(time * 4.0) * 0.15;
        this.tailGroup.rotation.z = Math.sin(time * 5.0) * 0.4;
      }

      // Water ripples & wake bubbles trailing behind Milo
      if (this.wakePositions && speedRatio > 0.04) {
        this.wakePositions[this.nextWakeIdx * 3] = this.playerPos.x + (Math.random() - 0.5) * 0.5;
        this.wakePositions[this.nextWakeIdx * 3 + 1] = 0.04;
        this.wakePositions[this.nextWakeIdx * 3 + 2] = this.playerPos.z + (Math.random() - 0.5) * 0.5;
        this.nextWakeIdx = (this.nextWakeIdx + 1) % 90;
        if (this.wakeParticles) {
          this.wakeParticles.geometry.attributes.position.needsUpdate = true;
        }
      }
    } else if (!this.isGrounded) {
      // In air / jumping
      if (this.leftLeg) {
        this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, -0.45, 12 * delta);
        this.leftLeg.rotation.z = 0;
      }
      if (this.rightLeg) {
        this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0.35, 12 * delta);
        this.rightLeg.rotation.z = 0;
      }
      if (this.leftArm) {
        this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.7, 12 * delta);
        this.leftArm.rotation.z = 0;
      }
      if (this.rightArm) {
        this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0.7, 12 * delta);
        this.rightArm.rotation.z = 0;
      }
      this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, -0.15, 10 * delta);
      this.catMeshGroup.scale.set(0.92, 1.12, 0.92);
    } else if (speedRatio > 0.04) {
      // Running / Walking on foot
      const stepRate = this.isBoosting ? 2.0 : 1.5;
      this.walkCycle += Math.abs(this.currentSpeed) * stepRate * delta;

      const legSwing = Math.sin(this.walkCycle) * (0.60 + speedRatio * 0.30);
      const armSwing = -Math.sin(this.walkCycle) * (0.50 + speedRatio * 0.30);

      if (this.leftLeg) {
        this.leftLeg.rotation.x = legSwing;
        this.leftLeg.rotation.z = 0;
      }
      if (this.rightLeg) {
        this.rightLeg.rotation.x = -legSwing;
        this.rightLeg.rotation.z = 0;
      }
      if (this.leftArm) {
        this.leftArm.rotation.x = armSwing;
        this.leftArm.rotation.z = 0;
      }
      if (this.rightArm) {
        this.rightArm.rotation.x = -armSwing;
        this.rightArm.rotation.z = 0;
      }

      // Body bounce and squash
      const bounce = Math.abs(Math.sin(this.walkCycle)) * 0.10;
      this.catMeshGroup.position.y = bounce;

      const squash = Math.sin(this.walkCycle * 2) * 0.04;
      this.catMeshGroup.scale.set(1.0 + squash, 1.0 - squash, 1.0 + squash);

      // Natural forward lean into the run (-Z is forward!)
      const targetLean = -Math.min(0.20, speedRatio * 0.18);
      this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, targetLean, 10 * delta);
      this.catMeshGroup.rotation.y = Math.sin(this.walkCycle * 0.5) * 0.05;

      // Footstep sound on ground contact
      if (Math.abs(Math.sin(this.walkCycle)) < 0.12) {
        this.audio.playFootstep();
      }
    } else {
      // Idle standing
      if (this.leftLeg) {
        this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, 10 * delta);
        this.leftLeg.rotation.z = 0;
      }
      if (this.rightLeg) {
        this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, 10 * delta);
        this.rightLeg.rotation.z = 0;
      }
      if (this.leftArm) {
        this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.05, 10 * delta);
        this.leftArm.rotation.z = 0;
      }
      if (this.rightArm) {
        this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0.05, 10 * delta);
        this.rightArm.rotation.z = 0;
      }

      const breath = Math.sin(time * 2.8) * 0.035;
      this.catMeshGroup.position.y = breath;
      this.catMeshGroup.scale.set(1.0, 1.0, 1.0);
      this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, 0, 10 * delta);
      this.catMeshGroup.rotation.y = THREE.MathUtils.lerp(this.catMeshGroup.rotation.y, 0, 10 * delta);

      if (this.earL) this.earL.rotation.z = 0.25 + Math.sin(time * 2.0) * 0.06;
      if (this.earR) this.earR.rotation.z = -0.25 - Math.sin(time * 2.5) * 0.06;
    }

    // Tabby tail wagging behind Milo
    if (this.tailGroup) {
      this.tailGroup.rotation.z = Math.sin(time * 4.5 + this.walkCycle) * 0.35;
      this.tailGroup.rotation.x = 0.6 - speedRatio * 0.35;
    }

    // Rainbow thruster particles behind Milo when sprinting (jetpack at z = +0.45)
    if (this.isBoosting && this.thrusterPositions) {
      const backOffset = new THREE.Vector3(0, 1.05, 0.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY);
      this.thrusterPositions[this.nextThrusterIdx * 3] = this.playerPos.x + backOffset.x + (Math.random() - 0.5) * 0.3;
      this.thrusterPositions[this.nextThrusterIdx * 3 + 1] = this.playerPos.y + backOffset.y + (Math.random() - 0.5) * 0.2;
      this.thrusterPositions[this.nextThrusterIdx * 3 + 2] = this.playerPos.z + backOffset.z + (Math.random() - 0.5) * 0.3;
      this.nextThrusterIdx = (this.nextThrusterIdx + 1) % 60;
      if (this.thrusterParticles) {
        this.thrusterParticles.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  private calculateGroundHeight(x: number, z: number): number {
    // 1. Arched Wooden Bridges take precedence
    for (const br of this.bridges) {
      const bh = getBridgeHeightAt(x, z, br);
      if (bh !== null) {
        return bh;
      }
    }

    // 2. Connecting Stone Pavements, Roads & Bridge Landing Quays
    for (const p of this.paths) {
      const ph = getPathHeightAt(x, z, p.p1, p.p2, p.width, p.height);
      if (ph !== null) {
        return ph;
      }
    }

    // 3. Pier at Central Plaza
    if (Math.abs(x) < 1.8 && z >= -34 && z <= -23) {
      return 0.8;
    }

    // 4. Island Terrain Height
    return this.getIslandHeight(x, z);
  }

  private getIslandHeight(x: number, z: number): number {
    // 1. Central Plaza (0, 0)
    const dHub = Math.hypot(x, z);
    if (dHub < 34) {
      if (dHub <= 11.5) return 4.90; // Slate and terracotta promenade
      if (dHub <= 24.5) return 4.80; // Grass park plateau (Menyambung langsung ke jembatan)
      if (dHub <= 28.5) {
        const t = (dHub - 24.5) / 4.0;
        return 4.80 * (1 - t) + 1.40 * t; // Slope down to sand beach
      }
      if (dHub <= 32.0) {
        const t = (dHub - 28.5) / 3.5;
        return 1.40 * (1 - t) + (-1.25) * t; // Gentle shoreline into ocean
      }
      return -1.25;
    }

    // 2. MOBA Sanctuary (-70, -65)
    const dMOBA = Math.hypot(x - (-70), z - (-65));
    if (dMOBA < 34) {
      if (dMOBA <= 22.5) return 6.60; // High altar plateau
      if (dMOBA <= 27.5) {
        const t = (dMOBA - 22.5) / 5.0;
        return 6.60 * (1 - t) + 1.40 * t;
      }
      if (dMOBA <= 32.0) {
        const t = (dMOBA - 27.5) / 4.5;
        return 1.40 * (1 - t) + (-1.25) * t;
      }
      return -1.25;
    }

    // 3. Battle Royale Outpost (75, -60)
    const dBR = Math.hypot(x - 75, z - (-60));
    if (dBR < 35) {
      if (dBR <= 23.5) return 7.00; // Lighthouse plateau
      if (dBR <= 28.5) {
        const t = (dBR - 23.5) / 5.0;
        return 7.00 * (1 - t) + 1.40 * t;
      }
      if (dBR <= 33.0) {
        const t = (dBR - 28.5) / 4.5;
        return 1.40 * (1 - t) + (-1.25) * t;
      }
      return -1.25;
    }

    // 4. Arcade Soccer Arena (65, 65)
    const dSoc = Math.hypot(x - 65, z - 65);
    if (dSoc < 35) {
      if (Math.abs(x - 65) <= 11.2 && Math.abs(z - 65) <= 16.2) {
        return 2.66; // Soccer pitch turf
      }
      if (dSoc <= 23.0) return 2.60; // Stadium grass plateau
      if (dSoc <= 28.0) {
        const t = (dSoc - 23.0) / 5.0;
        return 2.60 * (1 - t) + 1.40 * t;
      }
      if (dSoc <= 32.5) {
        const t = (dSoc - 28.0) / 4.5;
        return 1.40 * (1 - t) + (-1.25) * t;
      }
      return -1.25;
    }

    // 5. Voxel Sandbox Bay (-65, 70)
    const dVox = Math.hypot(x - (-65), z - 70);
    if (dVox < 35) {
      const gx = Math.round((x - (-65)) / 4.6);
      const gz = Math.round((z - 70) / 4.6);
      if (Math.abs(gx) <= 4 && Math.abs(gz) <= 4) {
        const dGrid = Math.hypot(gx, gz);
        if (dGrid <= 4.2) {
          const h = Math.max(1, 4 - Math.floor(dGrid * 0.8));
          return h * 1.5 + 0.2;
        }
      }
      if (dVox <= 26.0) return 4.70; // Solid grass & stone plateau flush with bridge & arrival terrace!
      if (dVox <= 30.0) {
        const t = (dVox - 26.0) / 4.0;
        return 4.70 * (1 - t) + 1.40 * t; // Gentle sandy beach slope
      }
      if (dVox <= 34.0) {
        const t = (dVox - 30.0) / 4.0;
        return 1.40 * (1 - t) + (-1.25) * t; // Shoreline into ocean
      }
      return -1.25;
    }

    return -1.25; // Open deep ocean (Milo sinks chest-deep and swims)
  }

  private updateCollectibles(time: number) {
    this.tokens.forEach((t, i) => {
      if (t.collected) return;
      t.mesh.rotation.z = time * 2.5;
      t.mesh.position.y = t.baseY + Math.sin(time * 3.2 + i * 0.7) * 0.15;

      const dist = this.playerPos.distanceTo(t.mesh.position);
      // Magnet attract if close
      if (dist < 4.0 && dist > 1.2) {
        t.mesh.position.lerp(this.playerPos, 0.08);
      }

      if (dist < 2.2) {
        t.collected = true;
        t.mesh.visible = false;
        this.coinsCollected++;
        this.audio.playCoin();
        this.callbacks.onCoinsUpdate?.(this.coinsCollected, this.totalCoins);

        if (this.coinsCollected >= 15) {
          this.callbacks.onQuestProgress?.("tokens");
        }
      }
    });

    this.speedRings.forEach((ring) => {
      ring.rotation.z = time * 1.5;
      if (this.playerPos.distanceTo(ring.position) < 3.5) {
        this.currentSpeed = Math.min(this.currentSpeed + 15, this.maxSpeed * 1.8);
        this.audio.playBoost();
      }
    });
  }

  private updateSoccerBall(delta: number) {
    if (!this.soccerBall) return;

    const dist = this.playerPos.distanceTo(this.soccerBall.position);
    if (dist < 2.9) {
      const pushDir = new THREE.Vector3().subVectors(this.soccerBall.position, this.playerPos).normalize();
      const impulse = Math.max(Math.abs(this.currentSpeed) * 1.5, 9.0);
      this.ballVel.x = pushDir.x * impulse;
      this.ballVel.z = pushDir.z * impulse;
      // Controlled ground rolling when dribbling; lofted strike when sprint boosting
      this.ballVel.y = this.isBoosting ? 3.8 : 1.2;
      this.audio.playKick();
    }

    this.soccerBall.position.x += this.ballVel.x * delta;
    this.soccerBall.position.z += this.ballVel.z * delta;
    this.soccerBall.position.y += this.ballVel.y * delta;

    this.soccerBall.rotation.x += this.ballVel.z * delta * 0.8;
    this.soccerBall.rotation.z -= this.ballVel.x * delta * 0.8;

    const ballGroundY = this.calculateGroundHeight(this.soccerBall.position.x, this.soccerBall.position.z) + 1.6;
    if (this.soccerBall.position.y > ballGroundY) {
      this.ballVel.y -= 20 * delta;
    } else {
      this.soccerBall.position.y = ballGroundY;
      if (Math.abs(this.ballVel.y) > 1.8) {
        this.ballVel.y = -this.ballVel.y * 0.52;
      } else {
        this.ballVel.y = 0;
      }
    }

    this.ballVel.x *= 0.96;
    this.ballVel.z *= 0.96;

    if (this.goalBox.containsPoint(this.soccerBall.position)) {
      this.audio.playGoal();
      this.callbacks.onGoal?.();
      this.callbacks.onQuestProgress?.("soccer");

      setTimeout(() => {
        if (this.soccerBall) {
          this.soccerBall.position.set(65, 4.26, 65);
          this.ballVel.set(0, 0, 0);
        }
      }, 3500);
    }
  }

  public setActiveDialogueNPC(npc: NPCData | null) {
    this.activeDialogueNPC = npc;
    if (npc) {
      // Rotate Milo to face the NPC directly
      const dir = new THREE.Vector3().subVectors(npc.pos, this.playerPos).normalize();
      this.playerRotY = Math.atan2(dir.x, dir.z) + Math.PI;
      this.currentSpeed = 0;
    }
  }

  // =========================================================================
  // ARCADE MINIGAME SYSTEM
  // =========================================================================
  public startMinigame(id: "ring_trial" | "penalty_kick" | "crystal_runes" | "airdrop_hunt") {
    this.cleanupMinigame();

    const configs: Record<string, Omit<ActiveMinigame, "score" | "timeLeft" | "status">> = {
      ring_trial: {
        id: "ring_trial",
        title: "Plaza Slalom Rush",
        island: "Central Plaza",
        instructions: "Sprint through 5 glowing Neon Slalom Rings around Central Plaza before time runs out!",
        targetScore: 5,
        totalTime: 35,
      },
      penalty_kick: {
        id: "penalty_kick",
        title: "Golden Striker Shootout",
        island: "Arcade Soccer Arena",
        instructions: "Dribble and kick the ball into 3 Golden Goal Target Zones inside the stadium!",
        targetScore: 3,
        totalTime: 45,
      },
      crystal_runes: {
        id: "crystal_runes",
        title: "Sanctuary Core Overdrive",
        island: "MOBA Sanctuary",
        instructions: "Attune 4 Ancient Elemental Runes around the Sanctuary Altar within 35 seconds!",
        targetScore: 4,
        totalTime: 35,
      },
      airdrop_hunt: {
        id: "airdrop_hunt",
        title: "Airdrop Supply Intercept",
        island: "Battle Royale Outpost",
        instructions: "Recover 3 Tactical Airdrop Crates along the Outpost cliffs before time runs out!",
        targetScore: 3,
        totalTime: 35,
      },
    };

    const cfg = configs[id];
    if (!cfg) return;

    this.activeMinigame = {
      ...cfg,
      score: 0,
      timeLeft: cfg.totalTime,
      status: "playing",
    };

    this.setupMinigameObjects(id);
    this.audio.playBoost();
    this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });
  }

  public cancelMinigame() {
    this.cleanupMinigame();
    this.activeMinigame = null;
    this.callbacks.onMinigameUpdate?.(null);
  }

  private cleanupMinigame() {
    this.minigameTargets.forEach((t) => {
      this.scene.remove(t.mesh);
    });
    this.minigameTargets = [];
  }

  private setupMinigameObjects(id: string) {
    if (id === "ring_trial") {
      // Central Plaza: High-Speed Cyber Slalom Sprint Gates
      const ringConfigs: [number, number, number, number][] = [
        [-12, 5.4, 0, Math.PI / 2],
        [-6, 5.4, -12, 0],
        [10, 5.4, -8, -Math.PI / 3],
        [12, 5.4, 6, Math.PI / 2],
        [-4, 5.4, 12, -Math.PI / 4],
      ];
      ringConfigs.forEach(([x, y, z, rotY], index) => {
        const group = new THREE.Group();
        group.position.set(x, y, z);
        group.rotation.y = rotY;

        // Double Neon Cyber Ring
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x0891b2,
          emissiveIntensity: 1.8,
          roughness: 0.2,
        });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 16, 32), ringMat);
        group.add(ring);

        // Holographic Chevron Pointer Arrow (pointing through gate)
        const arrowGeo = new THREE.ConeGeometry(0.35, 0.7, 4);
        arrowGeo.rotateX(Math.PI / 2);
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
        const arrow = new THREE.Mesh(arrowGeo, arrowMat);
        arrow.position.set(0, 0, -0.6);
        group.add(arrow);

        // Ground Speed Boost Pad Strip
        const stripGeo = new THREE.PlaneGeometry(2.4, 3.2);
        stripGeo.rotateX(-Math.PI / 2);
        const stripMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        });
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.y = -1.4;
        group.add(strip);

        this.scene.add(group);
        this.minigameTargets.push({
          mesh: group,
          hit: false,
          radius: 2.8,
          pos: new THREE.Vector3(x, y, z),
          type: "nitro_gate",
          update: (delta, time) => {
            ring.rotation.z = time * 2.2;
            arrow.position.z = -0.6 + Math.sin(time * 6 + index) * 0.2;
          },
          onHit: () => {
            // Instant Supercharged Nitro Blast
            this.currentSpeed = Math.min(this.currentSpeed + 18, this.maxSpeed * 2.0);
            this.isBoosting = true;
            this.audio.playBoost();
            this.audio.playCoin();
          },
        });
      });
    } else if (id === "penalty_kick") {
      // Teleport ball & Milo into kick positions at Soccer Arena
      if (this.soccerBall) {
        this.soccerBall.position.set(65, 3.2, 58);
        this.ballVel.set(0, 0, 0);
      }
      this.playerPos.set(65, 2.6, 52);
      this.playerRotY = Math.PI; // Face goal (+Z)
      this.currentSpeed = 0;

      // 3 Target Bullseyes placed inside the 3D goal net frame (Goal front z = 78.0, rear z = 81.5)
      const targetCoords: [number, number, number][] = [
        [62.2, 4.8, 79.4], // Left upper corner inside goal
        [65.0, 3.6, 79.4], // Center low inside goal
        [67.8, 4.8, 79.4], // Right upper corner inside goal
      ];
      targetCoords.forEach(([x, y, z]) => {
        const group = new THREE.Group();
        group.position.set(x, y, z);

        const outerRing = new THREE.Mesh(
          new THREE.RingGeometry(0.7, 0.9, 24),
          new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
        );
        group.add(outerRing);

        const innerRing = new THREE.Mesh(
          new THREE.RingGeometry(0.4, 0.65, 24),
          new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
        );
        group.add(innerRing);

        const centerDot = new THREE.Mesh(
          new THREE.CircleGeometry(0.35, 24),
          new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
        );
        group.add(centerDot);

        this.scene.add(group);
        this.minigameTargets.push({
          mesh: group,
          hit: false,
          radius: 1.8,
          pos: new THREE.Vector3(x, y, z),
          type: "soccer_target",
          update: (delta, time) => {
            group.rotation.z = Math.sin(time * 3) * 0.2;
          },
          onHit: () => {
            this.audio.playGoal();
            this.audio.playChime();
          },
        });
      });
    } else if (id === "crystal_runes") {
      // 4 Elemental Sigil Orbs orbiting around the Ancient Monolith
      const orbConfigs = [
        { pos: [-70, 7.8, -78] as [number, number, number], color: 0xef4444, emissive: 0xdc2626 },
        { pos: [-70, 7.8, -52] as [number, number, number], color: 0x3b82f6, emissive: 0x2563eb },
        { pos: [-83, 7.8, -65] as [number, number, number], color: 0xa855f7, emissive: 0x9333ea },
        { pos: [-57, 7.8, -65] as [number, number, number], color: 0xfacc15, emissive: 0xeab308 },
      ];

      orbConfigs.forEach((cfg, idx) => {
        const group = new THREE.Group();
        group.position.set(...cfg.pos);

        // Core Glowing Elemental Orb
        const orbMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          emissive: cfg.emissive,
          emissiveIntensity: 2.2,
          roughness: 0.1,
        });
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 24), orbMat);
        group.add(orb);

        // Orbiting Crystalline Rings
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: cfg.color,
          emissiveIntensity: 1.2,
          roughness: 0.2,
        });
        const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 8, 24), ringMat);
        const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.05, 8, 24), ringMat);
        ringB.rotation.x = Math.PI / 2;
        group.add(ringA);
        group.add(ringB);

        // Vertical Beacon Light Pillar
        const beamMat = new THREE.MeshBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 14, 12, 1, true), beamMat);
        beam.position.y = 7.0;
        group.add(beam);

        this.scene.add(group);
        this.minigameTargets.push({
          mesh: group,
          hit: false,
          radius: 2.6,
          pos: new THREE.Vector3(...cfg.pos),
          type: "moba_orb",
          update: (delta, time) => {
            orb.position.y = Math.sin(time * 3.5 + idx * 1.5) * 0.3;
            ringA.rotation.x = time * 2.5;
            ringA.rotation.y = time * 1.8;
            ringB.rotation.y = time * -2.0;
            ringB.rotation.z = time * 2.2;
          },
          onHit: () => {
            this.audio.playChime();
            // Celestial Monolith Surge Reaction: spin crystal and pulse bloom
            if (this.mobaCrystal) {
              this.mobaCrystal.rotation.y += Math.PI / 2;
              this.mobaCrystal.scale.set(1.4, 1.4, 1.4);
              setTimeout(() => {
                if (this.mobaCrystal) this.mobaCrystal.scale.set(1.0, 1.0, 1.0);
              }, 400);
            }
          },
        });
      });
    } else if (id === "airdrop_hunt") {
      // 3 Falling Military Airdrop Supply Crates descending from sky with parachutes
      const dropCoords: [number, number, number][] = [
        [66, 7.8, -66],
        [82, 7.8, -54],
        [74, 7.8, -74],
      ];

      dropCoords.forEach(([x, groundY, z], idx) => {
        const group = new THREE.Group();
        const startY = groundY + 14.0 + idx * 3.5;
        group.position.set(x, startY, z);

        // 1. Reinforced Military Supply Crate
        const crateMat = new THREE.MeshStandardMaterial({
          color: 0xb91c1c,
          metalness: 0.5,
          roughness: 0.4,
        });
        const crate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 1.6), crateMat);
        crate.position.y = 0.75;
        group.add(crate);

        // Steel protective roll-cage edge frame
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.25, 1.68), frameMat);
        frame.position.y = 0.75;
        group.add(frame);

        // 2. Billowing Fabric Parachute Canopy
        const chuteMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          roughness: 0.65,
        });
        const chute = new THREE.Mesh(
          new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
          chuteMat
        );
        chute.position.y = 4.8;
        group.add(chute);

        // Parachute suspension cords (4 thin lines connecting chute to crate corners)
        const cordMat = new THREE.LineBasicMaterial({ color: 0xffffff });
        for (const [cx, cz] of [[0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7]]) {
          const cordGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(cx, 1.5, cz),
            new THREE.Vector3(cx * 2.2, 4.7, cz * 2.2),
          ]);
          group.add(new THREE.Line(cordGeo, cordMat));
        }

        // 3. Ground Signal Smoke Flare marking drop zone
        const flareGroup = new THREE.Group();
        flareGroup.position.set(x, groundY, z);

        const canister = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.6, 10),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
        );
        canister.position.y = 0.3;
        flareGroup.add(canister);

        const smokeColumn = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 1.2, 18, 12, 1, true),
          new THREE.MeshBasicMaterial({
            color: 0xfacc15,
            transparent: true,
            opacity: 0.45,
            side: THREE.DoubleSide,
          })
        );
        smokeColumn.position.y = 9.0;
        flareGroup.add(smokeColumn);
        this.scene.add(flareGroup);

        this.scene.add(group);

        let currentY = startY;
        const targetEntry = {
          mesh: group,
          hit: false,
          radius: 2.8,
          pos: new THREE.Vector3(x, currentY, z),
          type: "airdrop_crate" as const,
          update: (delta: number, time: number) => {
            if (currentY > groundY) {
              currentY = Math.max(groundY, currentY - 3.2 * delta);
              group.position.y = currentY;
              group.position.x = x + Math.sin(time * 2.0 + idx) * 0.35;
              group.rotation.z = Math.sin(time * 1.8 + idx) * 0.08;
              targetEntry.pos.set(group.position.x, currentY, z);
            } else {
              chute.scale.set(0.8, 0.3, 0.8);
              chute.position.y = 1.8;
            }
          },
          onHit: () => {
            this.scene.remove(flareGroup);
            this.audio.playCoin();
            this.audio.playBoost();
          },
        };
        this.minigameTargets.push(targetEntry);
      });
    }
  }

  private updateMinigame(delta: number, time: number) {
    if (!this.activeMinigame || this.activeMinigame.status !== "playing") return;

    this.activeMinigame.timeLeft -= delta;

    // Update animated effects on targets
    this.minigameTargets.forEach((t) => {
      if (!t.hit && t.update) {
        t.update(delta, time);
      }
    });

    if (this.activeMinigame.id === "penalty_kick") {
      // Check collision between soccer ball and targets
      if (this.soccerBall) {
        this.minigameTargets.forEach((t) => {
          if (t.hit) return;
          const d = this.soccerBall!.position.distanceTo(t.pos);
          if (d < t.radius) {
            t.hit = true;
            this.scene.remove(t.mesh);
            t.onHit?.();
            this.activeMinigame!.score++;

            // Reset soccer ball to penalty spot
            setTimeout(() => {
              if (this.soccerBall) {
                this.soccerBall.position.set(65, 3.2, 58);
                this.ballVel.set(0, 0, 0);
              }
            }, 600);
          }
        });
      }
    } else {
      // Check collision between Milo and targets
      this.minigameTargets.forEach((t) => {
        if (t.hit) return;
        const d = this.playerPos.distanceTo(t.pos);
        if (d < t.radius) {
          t.hit = true;
          this.scene.remove(t.mesh);
          t.onHit?.();
          this.activeMinigame!.score++;
        }
      });
    }

    // Win condition check
    if (this.activeMinigame.score >= this.activeMinigame.targetScore) {
      this.activeMinigame.status = "won";
      this.audio.playVictory();
      this.coinsCollected += 5;
      this.callbacks.onCoinsUpdate?.(this.coinsCollected, this.totalCoins);
      this.callbacks.onQuestProgress?.(this.activeMinigame.id);
      this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });

      setTimeout(() => {
        if (this.activeMinigame?.status === "won") {
          this.cleanupMinigame();
          this.activeMinigame = null;
          this.callbacks.onMinigameUpdate?.(null);
        }
      }, 4000);
      return;
    }

    // Time-out lose condition check
    if (this.activeMinigame.timeLeft <= 0) {
      this.activeMinigame.timeLeft = 0;
      this.activeMinigame.status = "lost";
      this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });

      setTimeout(() => {
        if (this.activeMinigame?.status === "lost") {
          this.cleanupMinigame();
          this.activeMinigame = null;
          this.callbacks.onMinigameUpdate?.(null);
        }
      }, 3500);
      return;
    }

    this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });
  }

  private updateCameraFollow(delta: number) {
    if (this.activeDialogueNPC) {
      // Cinematic 3/4 angle conversation camera framing the NPC's expressive 3D face and upper body
      const npcPos = this.activeDialogueNPC.pos;
      const npcRef = this.npcMeshMap.get(this.activeDialogueNPC.id);
      const npcRotY = npcRef?.group.rotation.y || 0;

      // Forward vector of NPC (-Z in local space)
      const npcForward = new THREE.Vector3(-Math.sin(npcRotY), 0, -Math.cos(npcRotY));
      const npcRight = new THREE.Vector3(npcForward.z, 0, -npcForward.x);

      // Camera positioned in front of NPC at a flattering 3/4 heroic angle
      const targetCamPos = new THREE.Vector3()
        .copy(npcPos)
        .addScaledVector(npcForward, 2.7)
        .addScaledVector(npcRight, 1.1)
        .add(new THREE.Vector3(0, 1.75, 0));

      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 42, 6 * delta);
      this.camera.updateProjectionMatrix();
      this.camera.position.lerp(targetCamPos, 0.1);

      const targetLook = new THREE.Vector3().copy(npcPos).add(new THREE.Vector3(0, 1.6, 0));
      this.cameraLookAt.lerp(targetLook, 0.12);
      this.camera.lookAt(this.cameraLookAt);
      return;
    }

    // Default Gameplay Follow Cam (Land vs Swimming POV)
    const targetFov = this.isBoosting ? 64 : (this.onWater ? 58 : 54);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 6 * delta);
    this.camera.updateProjectionMatrix();

    const offset = this.onWater
      ? new THREE.Vector3(0, 1.85, 5.2)
      : new THREE.Vector3(0, 4.4, 7.8);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY);

    const targetCamPos = new THREE.Vector3().addVectors(this.playerPos, offset);
    if (this.onWater) {
      targetCamPos.y = Math.max(0.65, targetCamPos.y);
    }
    this.camera.position.lerp(targetCamPos, 0.08);

    const lookTargetY = this.onWater ? 0.75 : 1.6;
    const lookTarget = new THREE.Vector3().copy(this.playerPos).add(new THREE.Vector3(0, lookTargetY, 0));
    this.cameraLookAt.lerp(lookTarget, 0.1);
    this.camera.lookAt(this.cameraLookAt);
  }

  private checkLocationAndProximity() {
    let closestPOI = this.pois[0];
    let minDist = Infinity;

    for (const poi of this.pois) {
      const d = this.playerPos.distanceTo(poi.pos);
      if (d < minDist) {
        minDist = d;
        closestPOI = poi;
      }
    }

    if (closestPOI.name !== this.currentLocationName && minDist < 35) {
      this.currentLocationName = closestPOI.name;
      this.callbacks.onLocationUpdate?.(closestPOI.name);
    }

    let nearestNPC: NPCData | null = null;
    let npcDist = Infinity;

    for (const npc of this.npcs) {
      const d = this.playerPos.distanceTo(npc.pos);
      if (d < 5.0 && d < npcDist) {
        npcDist = d;
        nearestNPC = npc;
      }
    }

    if (nearestNPC !== this.activeProximityNPC) {
      this.activeProximityNPC = nearestNPC;
      this.callbacks.onProximityChange?.(nearestNPC);
    }
  }

  public fastTravel(islandId: string) {
    const targetPOI = this.pois.find((p) => p.id === islandId);
    if (targetPOI) {
      this.playerPos.copy(targetPOI.pos);
      this.playerPos.y = this.calculateGroundHeight(targetPOI.pos.x, targetPOI.pos.z) + 0.1;
      this.playerVel.set(0, 0, 0);
      this.currentSpeed = 0;
      this.audio.playJump();
    }
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  };

  public dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.reqId);
    window.removeEventListener("resize", this.onWindowResize);
    this.composer.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
