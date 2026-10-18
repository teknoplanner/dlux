import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { WorldAudio } from "./WorldAudio";
import { WorldLivingAtmosphere } from "./WorldLivingAtmosphere";
import { WorldNatureManager } from "./WorldNatureManager";
import { WorldHexManager } from "./WorldHexManager";
import { WorldBuildingManager } from "./WorldBuildingManager";
import { WorldCharacterManager } from "./WorldCharacterManager";
import { getCharacterTexture } from "./WorldCharacterTextures";
import { WorldWindWakerWater, getWindWakerWaveElevation } from "./WorldWindWakerWater";
import { WorldWeatherManager, WeatherType } from "./WorldWeatherManager";

export type ArcadeChallengeId = "ring_trial" | "penalty_kick" | "crystal_runes" | "airdrop_hunt" | "hex_mario_run";

export interface ActiveMinigame {
  id: ArcadeChallengeId;
  title: string;
  island: string;
  instructions: string;
  score: number;
  targetScore: number;
  timeLeft: number;
  totalTime: number;
  status: "playing" | "won" | "lost";
  loseReason?: "drowned" | "timeout" | "second_place";
  checkpointReached?: boolean;
  checkpointRespawnCount?: number;
  racePosition?: number;
  raceProgressPct?: number;
  raceRingsCollected?: number;
  raceTotalRings?: number;
  currentLap?: number;
  totalLaps?: number;
  lapNotification?: string;
  raceCountdown?: number;
  nextTurnGuide?: string;
  npcDistanceText?: string;
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
    id: ArcadeChallengeId;
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
  onWeatherUpdate?: (weather: WeatherType) => void;
  onCinematicUpdate?: (active: boolean) => void;
}

export type SolidCollider =
  | { type?: "circle"; x: number; z: number; radius: number; label?: string; minY?: number; maxY?: number }
  | { type: "box"; minX: number; maxX: number; minZ: number; maxZ: number; label?: string; minY?: number; maxY?: number };

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

const createNPCFaceTexture = getCharacterTexture;

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
  public isTitleScreen: boolean = true;
  public isIntroCinematic: boolean = false;
  private introTimer: number = 0;
  private readonly INTRO_DURATION: number = 1.8;

  private walkCycle: number = 0;
  private currentTurnSpeed: number = 0;
  private currentBankZ: number = 0;
  private currentPitchX: number = 0;
  private cameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 5.8, 0);

  // Mouse / Pointer Camera Orbit & Pan Controls
  public cameraOrbitYaw: number = 0;        // Horizontal orbit offset relative to player (radians)
  public cameraOrbitPitch: number = 0;      // Vertical elevation pitch offset (radians)
  public cameraDistanceScale: number = 1.0; // Zoom multiplier (0.65x to 1.75x)
  private isPointerOrbiting: boolean = false;
  private lastPointerX: number = 0;
  private lastPointerY: number = 0;
  private pointerMovedDist: number = 0;

  // Environment Meshes & Lighting
  public weatherManager: WorldWeatherManager | null = null;
  private dirLight: THREE.DirectionalLight | null = null;
  private ambientLight: THREE.AmbientLight | null = null;
  private windWakerWater: WorldWindWakerWater | null = null;
  private waterGeometry: THREE.PlaneGeometry | null = null;
  private clouds: THREE.Group[] = [];
  private foamRings: THREE.Mesh[] = [];
  private maritimeBuoys: THREE.Group[] = [];
  private lighthouseBeam: THREE.Mesh | null = null;
  private mobaCrystal: THREE.Mesh | null = null;
  private sky: THREE.Mesh | null = null;
  private cloudMaterial: THREE.MeshStandardMaterial | null = null;
  private hemiLight: THREE.HemisphereLight | null = null;

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

  // Living World System (Pedestrians, Market Vendors, Fishermen, Cruising Boats, Wildlife)
  private livingAtmosphere: WorldLivingAtmosphere | null = null;

  // 3D Nature Asset Manager (KayKit Forest Nature Pack 3D Models: Trees, Boulders, Foliage)
  private natureManager: WorldNatureManager | null = null;

  // 3D Medieval Hexagon Asset Manager (KayKit Medieval Hexagon: Ground & Water Blocks)
  private hexManager: WorldHexManager | null = null;

  // 3D Medieval Buildings & Architecture Manager (KayKit Medieval Hexagon Pack: Houses, Taverns, Windmill, Market)
  private buildingManager: WorldBuildingManager | null = null;

  // 3D Animated Humanoid Character Manager (KayKit Character Animations 1.1: Rigged Humanoid NPCs)
  private characterManager: WorldCharacterManager | null = null;

  // POIs
  public pois: IslandPOI[] = [
    { id: "hub", name: "Central Plaza", pos: new THREE.Vector3(0, 4.80, 8.0), desc: "The vibrant heart of the archipelago", tag: "START" },
    { id: "moba", name: "MOBA Sanctuary", pos: new THREE.Vector3(-70, 6.6, -65), desc: "Ancient Champions Monolith & Amethyst Crystal", tag: "ARENA" },
    { id: "br", name: "Battle Royale Outpost", pos: new THREE.Vector3(75, 7.0, -60), desc: "Coastal Lighthouse, Airdrop & Cliff Boardwalk", tag: "SURVIVAL" },
    { id: "voxel", name: "Hexagon Sandbox Bay", pos: new THREE.Vector3(-65, 4.7, 70), desc: "Medieval Hexagon Terraces, Crystal Lagoon & Waterlilies", tag: "SANDBOX" },
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
      name: "Captain Jax",
      title: "Speedboat Racing Ace",
      island: "Battle Royale Outpost",
      pos: new THREE.Vector3(74, 7.8, -58),
      avatar: "🛥️",
      dialogue: [
        "Milo! Selamat datang di Markas Pos Pengawas Battle Royale!",
        "Aku menantangmu balapan perahu cepat mengelilingi samudra pulau ini!",
        "Ikuti panah belokan di laut, lewati cincin emas untuk koin ekstra, dan kalahkan perahuku ke garis finis!"
      ],
      arcadeChallenge: {
        id: "airdrop_hunt",
        title: "Grand Prix Perahu Lautan",
        instructions: "Kemudikan perahu balap mengelilingi pulau, lewati cincin koin, dan capai garis Finish di depan Jax!",
        badge: "🛥️ SPEEDBOAT CHAMPION",
      },
    },
    {
      id: "kai",
      name: "Kai the Builder",
      title: "Master Mason of Hex Bay",
      island: "Hexagon Sandbox Bay",
      pos: new THREE.Vector3(-60, 4.80, 65),
      avatar: "🧱",
      dialogue: [
        "Welcome to Hexagon Sandbox Bay, Milo!",
        "Every single terrace and lake step here is crafted from modular 3D medieval hexagon blocks.",
        "Take a stroll along the crystal lagoon, inspect the stone chalets, and enjoy the architecture!"
      ],
      arcadeChallenge: {
        id: "hex_mario_run",
        badge: "⭐ SUPER MARIO 3D",
        title: "Tantangan Balok Super Milo",
        instructions: "Lompati balok melayang, benturkan balok [?], dan capai Tiang Bendera Finish sebelum waktu habis!",
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

  // Super Mario 3D Hexagon Run State & Course Meshes
  public isMarioWarping: boolean = false;
  private marioWarpTimer: number = 0;
  public isMarioCourseActive: boolean = false;
  private marioPlatforms: {
    x: number;
    z: number;
    y: number;
    width: number;
    depth: number;
    isMoving?: boolean;
    axis?: "x" | "y" | "z";
    amp?: number;
    speed?: number;
    basePos?: THREE.Vector3;
    mesh: THREE.Object3D;
  }[] = [];
  private marioQuestionBlocks: {
    mesh: THREE.Group;
    basePos: THREE.Vector3;
    hit: boolean;
    bounceTimer: number;
    coinMesh?: THREE.Mesh;
    coinTimer?: number;
  }[] = [];
  private marioFlagPole: {
    group: THREE.Group;
    polePos: THREE.Vector3;
    flagMesh: THREE.Mesh;
    isFinishTriggered: boolean;
    flagProgress: number;
  } | null = null;
  private marioConfettiParticles: THREE.Points | null = null;
  private marioCheckpointPos: THREE.Vector3 = new THREE.Vector3(-50, 5.5, 56);
  private marioSpawnedCourseGroup: THREE.Group | null = null;

  // Speedboat Grand Prix Marine Racing System
  public isBoatRacing: boolean = false;
  private playerCurrentLap: number = 1;
  private playerTotalLaps: number = 2;
  private playerCurrentWpIdx: number = 1;
  private playerBoatGroup: THREE.Group | null = null;
  private playerBoatPropellers: THREE.Mesh[] = [];
  private npcBoatGroup: THREE.Group | null = null;
  private npcBoatPropellers: THREE.Mesh[] = [];
  private npcBoatNameplate: THREE.Mesh | null = null;
  private npcBoatPos: THREE.Vector3 = new THREE.Vector3(38.5, 0.05, -52);
  private npcBoatRotY: number = 0;
  private npcBoatSpeed: number = 0;
  private npcCurrentWpIdx: number = 1;
  private npcCurrentLap: number = 1;
  private npcFinished: boolean = false;
  private boatRaceCountdown: number = 0;
  private lastCountdownNumber: number = 4;
  private npcTotalDistance: number = 0;
  private playerTotalDistance: number = 0;
  private boatRaceCourseGroup: THREE.Group | null = null;
  private boatRaceRings: { mesh: THREE.Group; coinMesh: THREE.Mesh; hit: boolean; pos: THREE.Vector3 }[] = [];
  private boatRaceObstacles: { mesh: THREE.Group; pos: THREE.Vector3; radius: number }[] = [];
  private boatRaceWaypoints: { pos: THREE.Vector3; name: string }[] = [];
  private boatRaceFinishGate: { archGroup: THREE.Group; pos: THREE.Vector3; triggered: boolean } | null = null;

  public currentLocationName: string = "Central Plaza";

  // Inputs & Jump Mechanics
  public inputs = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    boost: false,
    interact: false,
  };
  private prevJumpInput: boolean = false;
  private jumpCount: number = 0;

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
    this.renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.25));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.96;
    container.appendChild(this.renderer.domElement);

    // 4. Post-processing (UnrealBloomPass for Cinematic Glow, half-res for high performance)
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(Math.floor(container.clientWidth * 0.5), Math.floor(container.clientHeight * 0.5)),
      0.28, // Soft cinematic bloom strength
      0.30, // Radius
      0.88  // High threshold so only neon emissive elements bloom, no water/sky blowout
    );
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    // 5. Lighting, Stylized Sky, Clouds, Ocean & Weather
    this.setupLighting();
    this.buildStylizedSky();
    this.buildDriftingClouds();
    this.buildOcean();
    this.initWeatherManager();
    this.buildArchipelago();

    // 6. Milo Space Hero Cat (Walking on Foot!)
    this.playerGroup = new THREE.Group();
    this.catMeshGroup = this.buildMiloAvatar();
    this.playerGroup.add(this.catMeshGroup);
    this.scene.add(this.playerGroup);

    // 7. Initialize 3D Character Manager
    this.characterManager = new WorldCharacterManager(this.scene);

    // 8. 3D Medieval Hexagon Blocks (Build world terrain FIRST so all ground queries are exact)
    this.hexManager = new WorldHexManager(this.scene, this.colliders);
    this.hexManager.buildHexWorld();

    // 9. Collectibles, Soccer Arena & Animated Quest NPCs
    this.spawnTokens();
    this.spawnSoccerArena();
    this.spawnAnimatedNPCs();
    this.setupParticles();

    // 10. 3D Medieval Buildings & Houses (Facing inward toward village squares, safe from cliffs)
    this.buildingManager = new WorldBuildingManager(
      this.scene,
      this.colliders,
      (x: number, z: number) => this.calculateGroundHeight(x, z),
      this.weatherManager
    );
    this.buildingManager.buildAllHouses();

    // 11. 3D Stylized Nature Models (Rooted firmly in soil, zero floating, clear of roads)
    this.natureManager = new WorldNatureManager(
      this.scene,
      this.colliders,
      (x: number, z: number) => this.calculateGroundHeight(x, z)
    );
    this.natureManager.decorateAllIslands();

    // 12. Living World: Pedestrians, Market Vendors, Fishermen, Cruising Boats & Wildlife
    this.livingAtmosphere = new WorldLivingAtmosphere(
      this.scene,
      this.colliders,
      (npc: NPCData) => {
        this.npcs.push(npc);
      },
      (x: number, z: number) => this.calculateGroundHeight(x, z),
      this.characterManager,
      this.weatherManager
    );
    this.livingAtmosphere.init();

    // 13. Event Listeners
    window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.setupPointerControls();

    // 14. Start Loop
    this.isRunning = true;
    this.animate();
  }

  // =========================================================================
  // MOUSE / POINTER CAMERA CONTROLS
  // =========================================================================
  private onPointerDown = (e: PointerEvent) => {
    // Only capture primary button (0) or secondary button (2)
    if (e.button !== 0 && e.button !== 2) return;
    this.isPointerOrbiting = true;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.pointerMovedDist = 0;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isPointerOrbiting) return;
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.pointerMovedDist += Math.hypot(dx, dy);

    // Orbit sensitivity: dragging right orbits camera to the right around character
    this.cameraOrbitYaw -= dx * 0.0055;
    // Dragging down lowers elevation, dragging up raises elevation
    this.cameraOrbitPitch = THREE.MathUtils.clamp(
      this.cameraOrbitPitch - dy * 0.004,
      -0.35,
      0.65
    );
  };

  private onPointerUp = () => {
    this.isPointerOrbiting = false;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.cameraDistanceScale = THREE.MathUtils.clamp(
      this.cameraDistanceScale + e.deltaY * 0.0008,
      0.65,
      1.75
    );
  };

  private onDoubleClick = () => {
    // Quick double click resets camera POV to default
    this.cameraOrbitYaw = 0;
    this.cameraOrbitPitch = 0;
    this.cameraDistanceScale = 1.0;
  };

  private onContextMenu = (e: MouseEvent) => {
    // Prevent default context menu on right click drag
    e.preventDefault();
  };

  private setupPointerControls() {
    this.container.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
    this.container.addEventListener("wheel", this.onWheel, { passive: false });
    this.container.addEventListener("dblclick", this.onDoubleClick);
    this.container.addEventListener("contextmenu", this.onContextMenu);
  }

  private removePointerControls() {
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
    this.container.removeEventListener("wheel", this.onWheel);
    this.container.removeEventListener("dblclick", this.onDoubleClick);
    this.container.removeEventListener("contextmenu", this.onContextMenu);
  }

  // =========================================================================
  // LIGHTING & STYLIZED SKY DOME
  // =========================================================================
  private setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xfffbeb, 0.70);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x15803d, 0.50);
    this.hemiLight.position.set(0, 70, 0);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff7ed, 1.30);
    this.dirLight.position.set(70, 110, 50);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 340;
    this.dirLight.shadow.camera.left = -140;
    this.dirLight.shadow.camera.right = 140;
    this.dirLight.shadow.camera.top = 140;
    this.dirLight.shadow.camera.bottom = -140;
    this.dirLight.shadow.bias = -0.0004;
    this.scene.add(this.dirLight);
  }

  // Stylized Sky Dome (Wind Waker / Ghibli aesthetic: rich tropical azure blue, zero gray haze, zero glare blowout!)
  private buildStylizedSky(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(420, 32, 20);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0284c7) },     // Deep tropical azure at zenith
        bottomColor: { value: new THREE.Color(0x7dd3fc) },  // Soft clear cyan at horizon
        offset: { value: 15.0 },
        exponent: { value: 0.65 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);
    this.sky = mesh;
    return mesh;
  }

  private buildDriftingClouds() {
    this.cloudMaterial = new THREE.MeshStandardMaterial({
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
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(6 + (i % 3) * 2, 1), this.cloudMaterial!);
        puff.position.set((i - 2) * 5.5, ((i % 2) - 0.5) * 2, ((i % 3) - 1) * 3);
        cloud.add(puff);
      }
      this.scene.add(cloud);
      this.clouds.push(cloud);
    });
  }

  private initWeatherManager() {
    this.weatherManager = new WorldWeatherManager(
      this.scene,
      this.dirLight!,
      this.ambientLight!,
      this.hemiLight,
      this.audio,
      (w) => this.callbacks.onWeatherUpdate?.(w)
    );
    this.weatherManager.setSkyDome(this.sky);
    this.weatherManager.setCloudMaterial(this.cloudMaterial);
    if (this.windWakerWater) {
      this.weatherManager.setWaterUniforms(this.windWakerWater.material.uniforms);
    }
  }

  // =========================================================================
  // ZELDA WIND WAKER PROCEDURAL OCEAN & MARITIME BUOYS
  // =========================================================================
  private buildOcean() {
    // 1. High-Performance Stylized Zelda Wind Waker Ocean with Rolling Waves & Caustic Foam Webs
    this.windWakerWater = new WorldWindWakerWater(650, 72);
    this.scene.add(this.windWakerWater.mesh);
    if (this.weatherManager) {
      this.weatherManager.setWaterUniforms(this.windWakerWater.material.uniforms);
    }

    // Deep ocean seabed plane (prevents hollow white voids underneath translucent water)
    const seaBed = new THREE.Mesh(
      new THREE.PlaneGeometry(650, 650),
      new THREE.MeshStandardMaterial({ color: 0x07316b, roughness: 0.95 })
    );
    seaBed.rotateX(-Math.PI / 2);
    seaBed.position.y = -1.4;
    this.scene.add(seaBed);

    // Floating Maritime Channel Buoys (Red & Green) placed in open navigational sea channels (away from bridges)
    const buoyMatRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const buoyMatGreen = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const buoyMatBase = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    const buoyPositions: [number, number, boolean][] = [
      [0, -48, true],   // North sea channel
      [0, 48, false],   // South sea channel
      [-52, 0, false],  // West sea channel
      [52, 0, true],    // East sea channel
      [-42, -75, true], // Northwest outer maritime route
      [42, -75, false], // Northeast outer maritime route
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
      this.colliders.push({ x: bx, z: bz, radius: 1.1, label: "buoy", minY: -1.5, maxY: 1.8 });
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

    // 1. Golden Sand Beach Shelf at sea level (Top face at y = 1.30, submerged in ocean perimeter)
    const sandGeo = new THREE.CylinderGeometry(cfg.radius * 0.94, cfg.radius * 1.25, 2.0, 36);
    const sandMat = new THREE.MeshStandardMaterial({ color: cfg.sandColor, roughness: 0.9, flatShading: true });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.set(cfg.center.x, 0.3, cfg.center.z);
    sandMesh.receiveShadow = true;
    this.scene.add(sandMesh);
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

  // Mekar Sempurna: Bunga 3D Realistis dengan Tangkai, Daun Hijau, Kelopak Mekar Melengkung & Putik Emas
  private createBloomingFlower(color: number, scale: number = 1.0): THREE.Group {
    const flower = new THREE.Group();

    // 1. Slender Green Stem (Tangkai hijau alami)
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 });
    const stemH = 0.36 * scale;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022 * scale, 0.03 * scale, stemH, 6), stemMat);
    stem.position.y = stemH / 2;
    stem.castShadow = true;
    flower.add(stem);

    // 2. Green Leaves (Daun hijau di tangkai)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.65, side: THREE.DoubleSide });
    for (let l = 0; l < 2; l++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.065 * scale, 0.18 * scale, 5), leafMat);
      leaf.rotation.z = (l === 0 ? 1 : -1) * 0.85;
      leaf.rotation.y = l * Math.PI + 0.35;
      leaf.position.set((l === 0 ? 0.045 : -0.045) * scale, stemH * 0.45, 0);
      flower.add(leaf);
    }

    // Flower blossom crown
    const crown = new THREE.Group();
    crown.position.y = stemH;
    flower.add(crown);

    // 3. Flower Calyx / Sepal (Kelopak dasar penopang hijau)
    const calyxMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
    const calyx = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 0.09 * scale, 6), calyxMat);
    calyx.rotation.x = Math.PI;
    calyx.position.y = -0.02 * scale;
    crown.add(calyx);

    // 4. Blooming Petals (Kelopak mekar 6 helai dengan lengkungan mangkuk mekar)
    const petalMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const numPetals = 5;
    for (let p = 0; p < numPetals; p++) {
      const petalAngle = (p / numPetals) * Math.PI * 2;
      const pGroup = new THREE.Group();
      pGroup.rotation.y = petalAngle;

      // Wide curved blooming petal (Kelopak mekar bervolume lembut)
      const outerPetal = new THREE.Mesh(new THREE.SphereGeometry(0.11 * scale, 6, 5), petalMat);
      outerPetal.scale.set(0.68, 0.22, 1.35);
      outerPetal.position.set(0, 0.04 * scale, 0.10 * scale);
      outerPetal.rotation.x = 0.52; // Open blooming angle!
      pGroup.add(outerPetal);

      crown.add(pGroup);
    }

    // 5. Golden Center Pistil / Stamen (Putik bunga tengah bulat kuning berseri)
    const pistilMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    });
    const pistil = new THREE.Mesh(new THREE.SphereGeometry(0.065 * scale, 6, 6), pistilMat);
    pistil.scale.set(1.0, 0.65, 1.0);
    pistil.position.y = 0.04 * scale;
    crown.add(pistil);

    return flower;
  }

  // Taman Bunga & Tanah Subur (Flowerbeds with rich soil & colorful petals)
  private createGardenFlowerBed(center: THREE.Vector3, radius: number, flowerCount: number = 8) {
    const bedGroup = new THREE.Group();
    bedGroup.position.copy(center);

    // Rich Dark Garden Soil (Tanah Subur Hitam Cokelat)
    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 1.05, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0x3f2305, roughness: 0.95 })
    );
    soil.position.y = 0.08;
    soil.receiveShadow = true;
    bedGroup.add(soil);

    // Cobblestone curb ring
    const curb = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.14, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 })
    );
    curb.rotateX(Math.PI / 2);
    curb.position.y = 0.12;
    bedGroup.add(curb);

    // Low trimmed hedge ring
    const hedge = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 0.86, 0.16, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 })
    );
    hedge.rotateX(Math.PI / 2);
    hedge.position.y = 0.20;
    bedGroup.add(hedge);

    // Colorful realistic blooming flowers (9 plush blooming flowers)
    const flowerColors = [
      0xf43f5e, // Crimson Rose
      0xfbbf24, // Sunflower Gold
      0xa855f7, // Royal Violet
      0xf472b6, // Carnation Pink
      0xffffff, // White Lily
      0x06b6d4, // Cyan Blossom
      0xf97316, // Orange Marigold
    ];

    const actualCount = Math.max(flowerCount, 9);
    for (let f = 0; f < actualCount; f++) {
      const angle = (f / actualCount) * Math.PI * 2 + (f % 3) * 0.4;
      const r = (radius * 0.25) + ((f * 5) % 6) * (radius * 0.10);
      const fx = Math.cos(angle) * r;
      const fz = Math.sin(angle) * r;
      const scale = 1.15 + (f % 3) * 0.15;

      const flower = this.createBloomingFlower(flowerColors[f % flowerColors.length], scale);
      flower.position.set(fx, 0.16, fz);
      flower.rotation.y = f * 1.5;
      flower.rotation.z = Math.sin(f * 2.2) * 0.08;
      bedGroup.add(flower);
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

    // Center plaza is kept wide, open, and unobstructed for smooth exploration and gathering

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

    // 4. Wooden Park Benches along the promenade
    this.createParkBench(center.x - 8, center.z - 5, 4.80, Math.PI / 4);
    this.createParkBench(center.x + 8, center.z - 5, 4.80, -Math.PI / 4);
    this.createParkBench(center.x - 8, center.z + 5, 4.80, (3 * Math.PI) / 4);
    this.createParkBench(center.x + 8, center.z + 5, 4.80, -(3 * Math.PI) / 4);

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

    // Ancient park benches
    this.createParkBench(center.x - 9, center.z - 2, 6.6, Math.PI / 3);
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

    // Park bench
    this.createParkBench(center.x + 2, center.z - 12, 7.0, -Math.PI / 4);

    this.createRamp(new THREE.Vector3(center.x - 18, 0, center.z + 8), -Math.PI / 4);
  }

  private createVoxelIsland(center: THREE.Vector3) {
    this.createShorelineFoam(center, 22);

    // 1. Solid Stone Arrival Quay & Foundation directly under Bridge Touchdown (-48, 52)
    // Ensures seamless physical ground connecting bridge abutment directly into Hexagon island
    const quayMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85, flatShading: true });
    const arrivalQuay = new THREE.Mesh(new THREE.BoxGeometry(8.5, 5.2, 9.5), quayMat);
    arrivalQuay.position.set(-48, 2.1, 52); // Top surface flush at y = 4.70, anchored to seabed at y = -0.5
    arrivalQuay.receiveShadow = true;
    arrivalQuay.castShadow = true;
    this.scene.add(arrivalQuay);

    // Paved stone road from bridge (-48, 52) to island arrival promenade
    this.createPathSegment(new THREE.Vector3(-48, 0, 52), new THREE.Vector3(center.x + 8, 0, center.z - 8), 4.2, 0x475569, 4.7);
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

    // Garden flowerbeds around stadium
    this.createGardenFlowerBed(new THREE.Vector3(center.x + 13, 2.60, center.z - 10), 2.5, 7);
    this.createGardenFlowerBed(new THREE.Vector3(center.x + 13, 2.60, center.z + 10), 2.5, 7);

    // Park bench for spectators
    this.createParkBench(center.x + 14, center.z, 2.60, -Math.PI / 2);
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
  // ANIMATED 3D KAYKIT HUMANOID NPCS
  // =========================================================================
  private spawnAnimatedNPCs() {
    const defaultRotY: Record<string, number> = {
      lexa: 0.15,
      valen: 0.85,
      jax: -0.75,
      kai: 0.20,
      leo: 0.45,
    };

    const tintColors: Record<string, number> = {
      lexa: 0xf59e0b, // Adventurer Amber
      valen: 0x6366f1, // Knight Indigo
      jax: 0x10b981,   // Ranger Emerald
      kai: 0x0ea5e9,   // Builder Sky Blue
      leo: 0xef4444,   // Striker Coral Red
    };

    const initialAnims: Record<string, string> = {
      lexa: "Idle_A",
      valen: "Idle_B",
      jax: "Idle_A",
      kai: "Idle_A",
      leo: "Idle_B",
    };

    this.npcs.forEach((npc) => {
      npc.pos.y = this.calculateGroundHeight(npc.pos.x, npc.pos.z);
      const group = new THREE.Group();
      group.position.copy(npc.pos);
      const rotY = defaultRotY[npc.id] ?? 0;

      // Spawn authentic KayKit rigged 3D character with skeletal animation
      if (this.characterManager) {
        this.characterManager.spawnCharacter({
          id: npc.id,
          name: npc.name,
          pos: npc.pos,
          rotY,
          scale: 1.0,
          tintColor: tintColors[npc.id],
          initialAnim: initialAnims[npc.id] || "Idle_A",
          targetGroup: group,
        });
      }

      // Sports prop for Leo (Mini Soccer Ball on the turf)
      let juggledBall: THREE.Mesh | undefined;
      if (npc.id === "leo") {
        const soccerBallTex = createSoccerBallTexture();
        const ballMat = new THREE.MeshStandardMaterial({ map: soccerBallTex, roughness: 0.35 });
        juggledBall = new THREE.Mesh(new THREE.SphereGeometry(0.20, 16, 16), ballMat);
        juggledBall.position.set(0.28, 0.20, 0.18);
        juggledBall.castShadow = true;
        group.add(juggledBall);
      }

      // Floating Holographic Quest Diamond with Idle Bobbing Bloom
      const beaconGroup = new THREE.Group();
      beaconGroup.position.y = 1.75;
      const beacon = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.24, 0),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 1.4 })
      );
      beaconGroup.add(beacon);

      const beaconRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.03, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.2 })
      );
      beaconRing.rotation.x = Math.PI / 2;
      beaconGroup.add(beaconRing);

      group.add(beaconGroup);

      this.scene.add(group);
      this.npcMeshMap.set(npc.id, { group, head: group, juggledBall });
      this.colliders.push({ x: npc.pos.x, z: npc.pos.z, radius: 0.65, label: npc.id });
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

    spawnCoords.forEach(([x, _rawY, z]) => {
      const groundY = this.calculateGroundHeight(x, z);
      const y = groundY + 1.25; // Floating gracefully at chest height
      const token = new THREE.Mesh(tokenGeo, tokenMat);
      token.position.set(x, y, z);
      token.castShadow = true;
      this.scene.add(token);
      this.tokens.push({ mesh: token, collected: false, baseY: y });
    });

    this.totalCoins = this.tokens.length;
  }

  private spawnSpeedRings() {
    // Bridges are kept completely open and natural without floating rings
    this.speedRings = [];
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
  private waveFrameCounter: number = 0;
  private isTabPaused: boolean = false;

  private onVisibilityChange = () => {
    if (typeof document !== "undefined" && document.hidden) {
      this.isTabPaused = true;
    } else {
      this.isTabPaused = false;
      this.clock.getDelta(); // flush delta so no giant time jump occurs
    }
  };

  private animate = () => {
    if (!this.isRunning) return;
    this.reqId = requestAnimationFrame(this.animate);

    // Pause physics and rendering when tab is inactive to preserve battery & CPU
    if (this.isTabPaused) return;

    const delta = Math.min(this.clock.getDelta(), 0.08);
    const time = this.clock.getElapsedTime();

    this.updateWaterWaves(time);
    this.updatePropsAndAtmosphere(time, delta);
    this.updatePlayerMovement(delta, time);
    this.updateNPCBehaviors(time);
    if (this.characterManager) {
      this.characterManager.update(delta);
    }
    this.updateCollectibles(time);
    this.updateSoccerBall(delta);
    this.updateMinigame(delta, time);
    if (this.livingAtmosphere) {
      this.livingAtmosphere.update(delta, time);
    }
    this.updateCameraFollow(delta);
    this.checkLocationAndProximity();

    // Render with EffectComposer for cinematic bloom
    this.composer.render();
  };

  private updateWaterWaves(time: number) {
    if (this.windWakerWater) {
      this.windWakerWater.update(time);
    }
  }

  private updatePropsAndAtmosphere(time: number, delta: number = 0.016) {
    if (this.weatherManager) {
      this.weatherManager.update(delta, time, this.playerPos);
    }

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

  public setWeather(w: WeatherType) {
    this.weatherManager?.setWeather(w, true);
    this.callbacks.onWeatherUpdate?.(w);
  }

  public setAutoRealtime(enable: boolean) {
    this.weatherManager?.setAutoRealtime(enable);
    if (enable) {
      const cur = this.weatherManager?.currentWeather ?? "day";
      this.callbacks.onWeatherUpdate?.(cur);
    }
  }

  public startIntroCinematic() {
    this.isIntroCinematic = true;
    this.introTimer = 0;
    this.isTitleScreen = false;
    // Milo performs an introductory joyful greeting hop
    this.playerVel.y = 5.2;
    this.audio?.playJump();
    this.callbacks.onCinematicUpdate?.(true);
  }

  public skipIntroCinematic() {
    this.isIntroCinematic = false;
    this.introTimer = this.INTRO_DURATION;
    this.callbacks.onCinematicUpdate?.(false);
  }

  public cycleWeather(): WeatherType {
    const next = this.weatherManager?.cycleNextWeather() ?? "day";
    this.callbacks.onWeatherUpdate?.(next);
    return next;
  }

  public getWeather(): WeatherType {
    return this.weatherManager?.currentWeather ?? "day";
  }

  private updateNPCBehaviors(time: number) {
    this.npcMeshMap.forEach((npcRef, npcId) => {
      const isTalking = this.activeDialogueNPC?.id === npcId;

      if (this.characterManager) {
        if (isTalking) {
          this.characterManager.playAnimation(npcId, "Interact");
        } else {
          const defaultAnim = (npcId === "valen" || npcId === "leo") ? "Idle_B" : "Idle_A";
          this.characterManager.playAnimation(npcId, defaultAnim);
        }
      }

      // Leo juggle soccer ball with spin
      if (npcId === "leo" && npcRef.juggledBall) {
        npcRef.juggledBall.position.y = 0.28 + Math.abs(Math.sin(time * 5)) * 0.18;
        npcRef.juggledBall.rotation.x = time * 4;
        npcRef.juggledBall.rotation.y = time * 3;
      }
    });
  }

  private updateBoatMovement(delta: number, time: number) {
    // Lock player at open-sea starting line while countdown is ticking (3... 2... 1...)
    if (this.boatRaceCountdown > 0) {
      this.currentSpeed = 0;
      this.playerVel.set(0, 0, 0);
      this.playerPos.set(33.5, 0.05, -52);
      this.playerRotY = 0;
      this.playerGroup.position.copy(this.playerPos);
      this.playerGroup.rotation.y = 0;
      return;
    }

    // 1. Marine Rudder Steering
    const targetTurn = (this.inputs.left ? 1 : 0) - (this.inputs.right ? 1 : 0);
    this.currentTurnSpeed = THREE.MathUtils.lerp(this.currentTurnSpeed, targetTurn * 1.85, 8 * delta);
    this.playerRotY += this.currentTurnSpeed * delta;

    // 2. High-Speed Hydroplane Marine Throttle & Nitro
    const maxBoatSpeed = 17.5;
    let targetSpeed = 0;
    if (this.inputs.forward) {
      targetSpeed = maxBoatSpeed;
    } else if (this.inputs.backward) {
      targetSpeed = -5.5;
    }

    const isMoving = this.inputs.forward || this.inputs.backward;
    if (this.inputs.boost && this.nitro > 0 && isMoving) {
      targetSpeed = 23.5;
      this.nitro = Math.max(0, this.nitro - 28 * delta);
      this.isBoosting = true;
    } else {
      this.nitro = Math.min(100, this.nitro + 14 * delta);
      this.isBoosting = false;
    }
    this.callbacks.onNitroUpdate?.(this.nitro);

    const accelRate = targetSpeed !== 0
      ? (targetSpeed > this.currentSpeed ? 4.2 : 5.8)
      : 3.5;
    this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, targetSpeed, Math.min(1, accelRate * delta));

    // Marine translation along heading
    this.playerVel.x = -Math.sin(this.playerRotY) * this.currentSpeed;
    this.playerVel.z = -Math.cos(this.playerRotY) * this.currentSpeed;
    this.playerPos.x += this.playerVel.x * delta;
    this.playerPos.z += this.playerVel.z * delta;

    this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -165, 165);
    this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -165, 165);

    // 3. SOLID ISLAND TERRAIN COLLISION (Zero clipping/penetration through islands!)
    // A. Battle Royale Outpost island boundary (Center: 75, -60; Shoreline R: 30.5m)
    const dxBR = this.playerPos.x - 75;
    const dzBR = this.playerPos.z - (-60);
    const distBR = Math.hypot(dxBR, dzBR);
    const minBRRadius = 30.2;
    if (distBR < minBRRadius && distBR > 0.001) {
      const pushX = (dxBR / distBR) * minBRRadius;
      const pushZ = (dzBR / distBR) * minBRRadius;
      this.playerPos.x = 75 + pushX;
      this.playerPos.z = -60 + pushZ;
      if (this.currentSpeed > 3.0) {
        this.currentSpeed = 3.0; // Bump off island coast
        this.audio.playSplash();
      }
    }

    // B. Central Plaza island boundary (Center: 0, 0; Shoreline R: 31.5m)
    const distHub = Math.hypot(this.playerPos.x, this.playerPos.z);
    const minHubRadius = 31.5;
    if (distHub < minHubRadius && distHub > 0.001) {
      const pushX = (this.playerPos.x / distHub) * minHubRadius;
      const pushZ = (this.playerPos.z / distHub) * minHubRadius;
      this.playerPos.x = pushX;
      this.playerPos.z = pushZ;
      if (this.currentSpeed > 3.0) {
        this.currentSpeed = 3.0;
        this.audio.playSplash();
      }
    }

    // C. General terrain elevation safeguard (cannot drive up on land / shallow beach)
    const landElevation = this.getIslandHeight(this.playerPos.x, this.playerPos.z);
    if (landElevation > -0.2) {
      this.playerPos.x -= this.playerVel.x * delta * 1.5;
      this.playerPos.z -= this.playerVel.z * delta * 1.5;
      this.currentSpeed = Math.min(this.currentSpeed * 0.3, 2.5);
    }

    // Stay firmly floating on water surface with wave bobbing
    const waveElev = getWindWakerWaveElevation(this.playerPos.x, this.playerPos.z, time);
    this.playerPos.y = THREE.MathUtils.lerp(this.playerPos.y, Math.max(0.04, waveElev + 0.05), 10 * delta);

    // Dynamic banking into turns & bow rise on acceleration
    const targetBank = -this.currentTurnSpeed * 0.16;
    this.currentBankZ = THREE.MathUtils.lerp(this.currentBankZ, targetBank, 10 * delta);

    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.y = this.playerRotY;
    this.playerGroup.rotation.z = this.currentBankZ;
    this.playerGroup.rotation.x = Math.max(0, this.currentSpeed / maxBoatSpeed) * 0.11;

    // Spin propellers with throttle
    for (const prop of this.playerBoatPropellers) {
      prop.rotation.z += (Math.abs(this.currentSpeed) * 4.5 + 8.0) * delta;
    }

    // Audio & Speedometer
    this.audio.updateEngineSound(Math.abs(this.currentSpeed), this.isBoosting);
    this.callbacks.onSpeedUpdate?.(Math.round(Math.abs(this.currentSpeed) * 3.6));

    // Milo captain pose at cockpit
    if (this.catMeshGroup) {
      this.catMeshGroup.position.set(0, 0.28, -0.15);
      this.catMeshGroup.rotation.x = -0.15;
    }
  }

  private updatePlayerMovement(delta: number, time: number) {
    if (this.isBoatRacing) {
      this.updateBoatMovement(delta, time);
      return;
    }

    // 1. Silky Smooth Steering
    const targetTurn = (this.inputs.left ? 1 : 0) - (this.inputs.right ? 1 : 0);
    this.currentTurnSpeed = THREE.MathUtils.lerp(this.currentTurnSpeed, targetTurn * this.turnSpeed, 12 * delta);
    this.playerRotY += this.currentTurnSpeed * delta;

    // 2. Snappy Acceleration & Pure Directional Forward/Backward Movement
    let targetSpeed = 0;
    if (this.inputs.forward) {
      targetSpeed = this.maxSpeed;
    } else if (this.inputs.backward) {
      targetSpeed = -this.maxSpeed * 0.55;
    }

    const isMoving = this.inputs.forward || this.inputs.backward;

    if (this.inputs.boost && this.nitro > 0 && isMoving) {
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

    const accelRate = targetSpeed !== 0
      ? (targetSpeed > this.currentSpeed ? this.acceleration : this.deceleration)
      : this.deceleration * 1.6;
    this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, targetSpeed, Math.min(1, accelRate * 0.25 * delta));

    // Translation along forward facing direction (-Z in local player space)
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
        // Vertical height filter (prevents water/ground objects from blocking bridges overhead)
        if (col.minY !== undefined && this.playerPos.y < col.minY) continue;
        if (col.maxY !== undefined && this.playerPos.y > col.maxY) continue;

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
    const groundHeight = this.calculateGroundHeight(this.playerPos.x, this.playerPos.z, this.playerPos.y);

    // Water state detection (Water plane at y = 0.0; deep ocean returns -1.25)
    const wasOnWater = this.onWater;
    this.onWater = groundHeight <= -0.15;
    if (!wasOnWater && this.onWater) {
      this.audio.playSplash();
    }

    // Jump & Double Jump Mechanics (1st jump off ground, 2nd jump in mid-air launches even higher!)
    const jumpJustPressed = this.inputs.jump && !this.prevJumpInput;

    if (this.isGrounded || this.onWater) {
      this.jumpCount = 0;
      if (jumpJustPressed) {
        this.playerVel.y = this.onWater ? 7.2 : 8.5;
        this.isGrounded = false;
        this.jumpCount = 1;
        if (this.onWater) {
          this.audio.playSplash();
        }
        this.audio.playJump();
      }
    } else {
      // In mid-air: 2nd jump gives higher vertical lift!
      if (jumpJustPressed && this.jumpCount < 2) {
        this.playerVel.y = 11.8; // Higher second jump launch
        this.jumpCount = 2;
        this.audio.playBoost();
        this.audio.playJump();
        if (this.catMeshGroup) {
          this.catMeshGroup.rotation.x -= Math.PI * 0.45;
        }
      }
    }
    this.prevJumpInput = this.inputs.jump;

    if (!this.isGrounded) {
      this.playerVel.y -= 22 * delta;
      this.playerPos.y += this.playerVel.y * delta;
      if (this.playerPos.y <= groundHeight) {
        this.playerPos.y = groundHeight;
        this.playerVel.y = 0;
        this.isGrounded = true;
        this.jumpCount = 0;
        if (this.onWater) {
          this.audio.playSplash();
        }
      }
    } else {
      // Submerged swimming bobbing on Wind Waker waves vs solid ground walking
      const waveElev = this.onWater ? getWindWakerWaveElevation(this.playerPos.x, this.playerPos.z, time) : 0;
      const targetWaterY = this.onWater ? Math.max(groundHeight, waveElev - 0.05) : groundHeight;
      this.playerPos.y = THREE.MathUtils.lerp(this.playerPos.y, targetWaterY, (this.onWater ? 10 : 20) * delta);
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

  private calculateGroundHeight(x: number, z: number, currentY?: number): number {
    // 0. Super Mario Course Floating & Moving Platforms
    if (this.isMarioCourseActive) {
      for (const plat of this.marioPlatforms) {
        const curX = plat.isMoving ? plat.mesh.position.x : plat.x;
        const curZ = plat.isMoving ? plat.mesh.position.z : plat.z;
        const curY = plat.isMoving ? plat.mesh.position.y : plat.y;
        const hw = plat.width * 0.5;
        const hd = plat.depth * 0.5;
        if (Math.abs(x - curX) <= hw && Math.abs(z - curZ) <= hd) {
          if (currentY !== undefined && currentY < curY - 0.85) {
            continue;
          }
          return curY;
        }
      }
    }

    // 1. Arched Wooden Bridges take precedence (only if player is on or above the bridge deck)
    for (const br of this.bridges) {
      const bh = getBridgeHeightAt(x, z, br);
      if (bh !== null) {
        // If currentY is provided and player is below the bridge deck, do not snap back up!
        if (currentY !== undefined && currentY < bh - 0.9) {
          continue;
        }
        return bh;
      }
    }

    // 2. Connecting Stone Pavements, Roads & Bridge Landing Quays
    for (const p of this.paths) {
      const ph = getPathHeightAt(x, z, p.p1, p.p2, p.width, p.height);
      if (ph !== null) {
        if (currentY !== undefined && currentY < ph - 0.9) {
          continue;
        }
        return ph;
      }
    }

    // 3. Pier at Central Plaza
    if (Math.abs(x) < 1.8 && z >= -34 && z <= -23) {
      return 0.8;
    }

    // 4. Medieval Hexagon Blocks (Terraces, Lagoons, Ponds)
    if (this.hexManager) {
      const hexH = this.hexManager.getGroundHeightAt(x, z);
      if (hexH !== null) {
        return hexH;
      }
    }

    // 5. Island Terrain Height
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

    // 5. Hexagon Sandbox Bay (-65, 70)
    const dVox = Math.hypot(x - (-65), z - 70);
    if (dVox < 35) {
      if (this.hexManager) {
        const hexH = this.hexManager.getGroundHeightAt(x, z);
        if (hexH !== null) return hexH;
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

      const playerChest = new THREE.Vector3(this.playerPos.x, this.playerPos.y + 0.85, this.playerPos.z);
      const dist3D = playerChest.distanceTo(t.mesh.position);
      const distXZ = Math.hypot(t.mesh.position.x - this.playerPos.x, t.mesh.position.z - this.playerPos.z);

      // Magnet pull towards player chest
      if (dist3D < 4.8 && dist3D > 0.8) {
        t.mesh.position.lerp(playerChest, 0.16);
        t.baseY = THREE.MathUtils.lerp(t.baseY, playerChest.y, 0.14);
      } else {
        // Subtle vertical hover bobbing only when resting
        t.mesh.position.y = t.baseY + Math.sin(time * 3.2 + i * 0.7) * 0.15;
      }

      // Collect when close
      if (dist3D < 2.4 || (distXZ < 1.6 && Math.abs(t.mesh.position.y - playerChest.y) < 2.0)) {
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
  public startMinigame(id: ArcadeChallengeId) {
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
        title: "Grand Prix Perahu Lautan",
        island: "Battle Royale Outpost",
        instructions: "Balapan 2 putaran keliling seluruh pulau! Masuki cincin emas & kalahkan Jax ke garis finis!",
        targetScore: 1,
        totalTime: 130,
      },
      hex_mario_run: {
        id: "hex_mario_run",
        title: "Tantangan Balok Super Milo",
        island: "Hexagon Sandbox Bay",
        instructions: "Lompati balok melayang, benturkan balok [?], dan capai Tiang Bendera Finish!",
        targetScore: 1,
        totalTime: 95,
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

    if (id === "hex_mario_run") {
      this.isMarioCourseActive = true;
      this.isMarioWarping = true;
      this.marioWarpTimer = 0;
      this.marioCheckpointPos.set(-48, 5.8, 54);
      this.playerPos.set(-48, 5.8, 54);
      // Milo directly faces forward towards Platform 1 at (-52, 60)
      this.playerRotY = Math.atan2(4, -6); // 2.5536 rad (~146.3°)
      this.currentSpeed = 0;
      this.jumpCount = 0;
      this.prevJumpInput = false;
      this.cameraOrbitYaw = 0;
      this.cameraOrbitPitch = 0;
      this.cameraDistanceScale = 1.0;
      this.playerVel.set(0, 4.5, 0); // Energized intro hop
      this.audio.playJump();
    } else if (id === "airdrop_hunt") {
      this.isBoatRacing = true;
      this.boatRaceCountdown = 3.6;
      this.lastCountdownNumber = 4;
      this.playerCurrentLap = 1;
      this.playerTotalLaps = 2;
      this.npcCurrentLap = 1;
      this.npcFinished = false;
      this.playerCurrentWpIdx = 1;
      this.npcCurrentWpIdx = 1;
      this.playerPos.set(33.5, 0.05, -52);
      this.playerRotY = 0; // Directly face North towards WP 1!
      this.playerVel.set(0, 0, 0);
      this.currentSpeed = 0;
      this.jumpCount = 0;
      this.prevJumpInput = false;
      this.cameraOrbitYaw = 0;
      this.cameraOrbitPitch = 0.05;
      this.cameraDistanceScale = 1.0;
      this.activeMinigame.currentLap = 1;
      this.activeMinigame.totalLaps = 2;
      this.activeMinigame.racePosition = 1;
      this.activeMinigame.raceProgressPct = 0;
      this.activeMinigame.raceRingsCollected = 0;
      this.activeMinigame.raceTotalRings = 20;
      this.activeMinigame.raceCountdown = 3;
      this.activeMinigame.lapNotification = undefined;
      this.activeMinigame.nextTurnGuide = "▲ LURUS (Selat Barat Terbuka)";
      this.audio.playChime();

      // Hide stationary quest giver NPC on the island so Captain Jax is exclusively on the speedboat!
      const jaxNPC = this.npcMeshMap.get("jax");
      if (jaxNPC) {
        jaxNPC.group.visible = false;
      }
    } else {
      this.audio.playBoost();
    }

    this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });
  }

  public cancelMinigame() {
    if (this.isMarioCourseActive) {
      this.playerPos.set(-48, 5.8, 54);
      this.playerVel.set(0, 0, 0);
      this.currentSpeed = 0;
    }
    if (this.isBoatRacing) {
      this.playerPos.set(74, 7.8, -58); // Teleport back to center of Battle Royale Island!
      this.playerVel.set(0, 0, 0);
      this.currentSpeed = 0;
      this.jumpCount = 0;
    }
    this.cleanupMinigame();
    this.activeMinigame = null;
    this.callbacks.onMinigameUpdate?.(null);
  }

  private cleanupMinigame() {
    this.minigameTargets.forEach((t) => {
      this.scene.remove(t.mesh);
    });
    this.minigameTargets = [];

    if (this.marioSpawnedCourseGroup) {
      this.scene.remove(this.marioSpawnedCourseGroup);
      this.marioSpawnedCourseGroup = null;
    }
    this.marioPlatforms = [];
    this.marioQuestionBlocks = [];
    this.marioFlagPole = null;
    if (this.marioConfettiParticles) {
      this.scene.remove(this.marioConfettiParticles);
      this.marioConfettiParticles = null;
    }
    this.isMarioCourseActive = false;
    this.isMarioWarping = false;

    // Boat Race cleanup
    if (this.playerBoatGroup) {
      this.playerGroup.remove(this.playerBoatGroup);
      this.playerBoatGroup = null;
    }
    this.playerBoatPropellers = [];
    if (this.npcBoatGroup) {
      this.scene.remove(this.npcBoatGroup);
      this.npcBoatGroup = null;
    }
    this.npcBoatPropellers = [];
    this.npcBoatNameplate = null;
    if (this.boatRaceCourseGroup) {
      this.scene.remove(this.boatRaceCourseGroup);
      this.boatRaceCourseGroup = null;
    }
    this.boatRaceRings = [];
    this.boatRaceObstacles = [];
    this.boatRaceWaypoints = [];
    this.boatRaceFinishGate = null;
    this.isBoatRacing = false;
    if (this.catMeshGroup) {
      this.catMeshGroup.position.set(0, 0, 0);
      this.catMeshGroup.rotation.set(0, 0, 0);
    }

    // Restore stationary Captain Jax NPC on Battle Royale island
    const jaxNPC = this.npcMeshMap.get("jax");
    if (jaxNPC) {
      jaxNPC.group.visible = true;
    }
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
      this.setupBoatRaceCourse();
    } else if (id === "hex_mario_run") {
      this.setupMarioCourse();
    }
  }

  private buildSpeedboatMesh(colorTheme: "player" | "rival"): { group: THREE.Group; propellers: THREE.Mesh[] } {
    const group = new THREE.Group();
    const isPlayer = colorTheme === "player";
    const hullColor = isPlayer ? 0x0284c7 : 0xdc2626; // Cyan vs Crimson
    const bottomColor = isPlayer ? 0x0f172a : 0x18181b; // Navy vs Graphite
    const stripeColor = isPlayer ? 0xfacc15 : 0xffffff; // Gold vs White

    // 1. Lower Hull (V-keel cutting through water)
    const hullMat = new THREE.MeshStandardMaterial({
      color: bottomColor,
      roughness: 0.35,
      metalness: 0.4,
    });
    const bottomHull = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.55, 3.8, 8),
      hullMat
    );
    bottomHull.rotation.x = Math.PI / 2;
    bottomHull.scale.set(1.1, 1.0, 0.55);
    bottomHull.position.set(0, 0.08, 0);
    group.add(bottomHull);

    // 2. Bow Wedge (Tapered nose slicing forward)
    const bowMat = new THREE.MeshStandardMaterial({
      color: hullColor,
      roughness: 0.25,
      metalness: 0.5,
    });
    const bowGeo = new THREE.ConeGeometry(0.85, 1.8, 4);
    bowGeo.rotateY(Math.PI / 4);
    bowGeo.rotateX(-Math.PI / 2);
    const bow = new THREE.Mesh(bowGeo, bowMat);
    bow.scale.set(1.15, 0.5, 1.0);
    bow.position.set(0, 0.22, -1.9);
    group.add(bow);

    // 3. Main Deck Body
    const deckGeo = new THREE.BoxGeometry(1.65, 0.42, 2.8);
    const deckMesh = new THREE.Mesh(deckGeo, bowMat);
    deckMesh.position.set(0, 0.22, 0.3);
    group.add(deckMesh);

    // 4. Racing Stripe
    const stripeMat = new THREE.MeshStandardMaterial({
      color: stripeColor,
      roughness: 0.3,
      metalness: 0.6,
    });
    const stripeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 4.4), stripeMat);
    stripeMesh.position.set(0, 0.44, -0.4);
    group.add(stripeMesh);

    // 5. Cockpit Recess
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
    });
    const cockpit = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.3, 1.6), cockpitMat);
    cockpit.position.set(0, 0.28, 0.1);
    group.add(cockpit);

    // Dashboard & Steering Wheel
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.35, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
    );
    dash.position.set(0, 0.45, -0.65);
    group.add(dash);

    const wheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.035, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    wheel.rotation.x = Math.PI / 4;
    wheel.position.set(0, 0.55, -0.55);
    group.add(wheel);

    // 6. Tinted Windshield
    const windshieldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.9,
    });
    const windshield = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.95, 0.45, 12, 1, false, Math.PI, Math.PI),
      windshieldMat
    );
    windshield.rotation.y = -Math.PI / 2;
    windshield.position.set(0, 0.62, -0.7);
    group.add(windshield);

    // 7. Twin Chrome Outboard Marine Engines at Stern
    const engineMat = new THREE.MeshStandardMaterial({
      color: bottomColor,
      metalness: 0.8,
      roughness: 0.25,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });
    const propMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Bronze propeller
      metalness: 0.85,
      roughness: 0.2,
    });

    const propellers: THREE.Mesh[] = [];

    for (const side of [-0.48, 0.48]) {
      const motorGroup = new THREE.Group();
      motorGroup.position.set(side, 0.2, 1.85);

      // Engine Cowling
      const cowl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 0.45), engineMat);
      cowl.position.set(0, 0.2, 0);
      motorGroup.add(cowl);

      // Chrome top cover
      const cowlTop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.36, 10), chromeMat);
      cowlTop.rotation.z = Math.PI / 2;
      cowlTop.position.set(0, 0.52, 0);
      motorGroup.add(cowlTop);

      // Shaft down into water
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.6, 8), chromeMat);
      shaft.position.set(0, -0.22, 0.05);
      motorGroup.add(shaft);

      // Propeller Hub
      const propHub = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 8), chromeMat);
      propHub.rotation.x = -Math.PI / 2;
      propHub.position.set(0, -0.42, 0.18);
      motorGroup.add(propHub);

      // Propeller Blades (3 blades)
      const propGroup = new THREE.Group();
      propGroup.position.set(0, -0.42, 0.14);
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.02), propMat);
        blade.rotation.z = (b * Math.PI * 2) / 3;
        blade.position.y = 0.08 * Math.cos((b * Math.PI * 2) / 3);
        blade.position.x = 0.08 * Math.sin((b * Math.PI * 2) / 3);
        propGroup.add(blade);
      }
      motorGroup.add(propGroup);
      propellers.push(propGroup as any);

      group.add(motorGroup);
    }

    // 8. Rival Jax 3D Pilot Model (if rival boat)
    if (!isPlayer) {
      const jaxGroup = new THREE.Group();
      jaxGroup.position.set(0, 0.35, -0.1);

      // Torso with orange life vest
      const vestMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
      const vest = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.35), vestMat);
      vest.position.y = 0.24;
      jaxGroup.add(vest);

      // Head with tactical ranger cap
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), skinMat);
      head.position.y = 0.62;
      jaxGroup.add(head);

      const capMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 }); // Tactical green ranger cap
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12), capMat);
      cap.position.y = 0.74;
      jaxGroup.add(cap);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.03, 0.15), capMat);
      visor.position.set(0, 0.72, -0.15);
      jaxGroup.add(visor);

      // Aviator sunglasses
      const shadesMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
      const shades = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.05), shadesMat);
      shades.position.set(0, 0.64, -0.17);
      jaxGroup.add(shades);

      // Arms gripping helm
      const armMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
      for (const side of [-0.26, 0.26]) {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.36, 8), armMat);
        arm.position.set(side, 0.3, -0.2);
        arm.rotation.x = Math.PI / 3;
        arm.rotation.z = side * 0.2;
        jaxGroup.add(arm);
      }

      // 9. Floating 3D Overhead Nameplate for Captain Jax
      const nameplateCanvas = document.createElement("canvas");
      nameplateCanvas.width = 384;
      nameplateCanvas.height = 96;
      const npCtx = nameplateCanvas.getContext("2d");
      if (npCtx) {
        npCtx.fillStyle = "rgba(15, 23, 42, 0.92)";
        npCtx.beginPath();
        npCtx.roundRect(8, 8, 368, 80, 20);
        npCtx.fill();
        npCtx.lineWidth = 4;
        npCtx.strokeStyle = "#facc15";
        npCtx.stroke();
        npCtx.fillStyle = "#ffffff";
        npCtx.font = "bold 32px sans-serif";
        npCtx.textAlign = "center";
        npCtx.textBaseline = "middle";
        npCtx.fillText("🛥️ KAPTEN JAX", 192, 48);
      }
      const npTex = new THREE.CanvasTexture(nameplateCanvas);
      const npMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, 0.65),
        new THREE.MeshBasicMaterial({ map: npTex, transparent: true, side: THREE.DoubleSide })
      );
      npMesh.position.set(0, 2.3, 0);
      group.add(npMesh);
      this.npcBoatNameplate = npMesh;

      group.add(jaxGroup);
    }

    return { group, propellers };
  }

  private setupBoatRaceCourse() {
    this.boatRaceCourseGroup = new THREE.Group();

    // 1. Grand Open-Sea Circuit Waypoints around entire Battle Royale Island (Farther out in deep ocean!)
    this.boatRaceWaypoints = [
      { pos: new THREE.Vector3(32, 0.05, -50), name: "Garis Start" },
      { pos: new THREE.Vector3(32, 0.05, -95), name: "Selat Barat Terbuka" },
      { pos: new THREE.Vector3(42, 0.05, -135), name: "Tanjung Barat Laut Samudra" },
      { pos: new THREE.Vector3(75, 0.05, -145), name: "Tanjung Mercusuar Lepas Pantai" },
      { pos: new THREE.Vector3(125, 0.05, -130), name: "Samudra Timur Laut Terbuka" },
      { pos: new THREE.Vector3(148, 0.05, -80), name: "Selat Karang Timur Dalam" },
      { pos: new THREE.Vector3(148, 0.05, -40), name: "Trek Samudra Timur" },
      { pos: new THREE.Vector3(126, 0.05, -8), name: "Tanjung Tenggara Lepas Pantai" },
      { pos: new THREE.Vector3(80, 0.05, -4), name: "Teluk Selatan Terbuka" },
      { pos: new THREE.Vector3(46, 0.05, -14), name: "Kolong Jembatan Kayu" },
      { pos: new THREE.Vector3(32, 0.05, -30), name: "Tikungan Terakhir Selat Luas" },
      { pos: new THREE.Vector3(32, 0.05, -48), name: "Garis Finis Lepas Pantai" },
    ];

    // 2. Animated Floating Chevron Turn Guidance Arrows pointing accurately towards next waypoint
    const chevronMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xfacc15,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    const bendIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    bendIndices.forEach((idx) => {
      const currWp = this.boatRaceWaypoints[idx];
      const nextWp = this.boatRaceWaypoints[idx + 1];
      if (!currWp || !nextWp) return;

      const g = new THREE.Group();
      g.position.set(currWp.pos.x, 0.75, currWp.pos.z);

      // Buoy float base
      const buoy = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1.0, 0.4, 12),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
      );
      buoy.position.y = -0.15;
      g.add(buoy);

      // Yellow safety ring
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.08, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 })
      );
      ringMesh.rotation.x = Math.PI / 2;
      g.add(ringMesh);

      // 2 Glowing V-shaped chevrons pointing along local -Z
      for (let c = 0; c < 2; c++) {
        const zOff = (c - 0.5) * 0.9;
        const armGeo = new THREE.BoxGeometry(0.14, 0.38, 0.75);
        const leftArm = new THREE.Mesh(armGeo, chevronMat);
        leftArm.position.set(-0.25, 0.45, zOff + 0.22);
        leftArm.rotation.y = -Math.PI / 4;
        g.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, chevronMat);
        rightArm.position.set(0.25, 0.45, zOff + 0.22);
        rightArm.rotation.y = Math.PI / 4;
        g.add(rightArm);
      }

      // In Three.js, lookAt rotates the object so that local -Z faces the target point!
      g.lookAt(nextWp.pos.x, g.position.y, nextWp.pos.z);
      this.boatRaceCourseGroup!.add(g);
    });

    // Nautical Fairway Channel Buoys (Red Port / Green Starboard with blinking beacons)
    const buoyPairs: [number, number, number, number][] = [
      [24, -72, 40, -72],
      [24, -115, 42, -115],
      [50, -150, 60, -134],
      [100, -150, 100, -130],
      [156, -105, 138, -112],
      [158, -60, 138, -60],
      [148, -14, 130, -28],
      [105, 2, 105, -14],
      [62, -2, 62, -18],
      [24, -36, 40, -36],
    ];

    const buoyRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const buoyGreenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3 });
    const buoyLightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    buoyPairs.forEach(([rx, rz, gx, gz]) => {
      // Red Buoy (Port / Outer)
      const redBuoy = new THREE.Group();
      redBuoy.position.set(rx, 0, rz);
      const floatR = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.2, 10), buoyRedMat);
      floatR.position.y = 0.45;
      redBuoy.add(floatR);
      const lightR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), buoyLightMat);
      lightR.position.y = 1.15;
      redBuoy.add(lightR);
      this.boatRaceCourseGroup!.add(redBuoy);

      // Green Buoy (Starboard / Inner)
      const greenBuoy = new THREE.Group();
      greenBuoy.position.set(gx, 0, gz);
      const floatG = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 1.2, 10), buoyGreenMat);
      floatG.position.y = 0.45;
      greenBuoy.add(floatG);
      const lightG = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), buoyLightMat);
      lightG.position.y = 1.15;
      greenBuoy.add(lightG);
      this.boatRaceCourseGroup!.add(greenBuoy);
    });

    // 3. Golden Coin Boost Rings (10 rings placed across the open ocean, matching world coin material & shape!)
    const ringCoords: [number, number, number, number][] = [
      [32, 1.4, -72, 0],                        // Ring 1: Selat Barat Terbuka
      [34, 1.4, -115, 0],                       // Ring 2: Tanjung Barat Laut Samudra
      [55, 1.4, -142, -Math.PI / 4],            // Ring 3: Northern cape turn
      [100, 1.4, -140, Math.PI / 4],            // Ring 4: North-East turn
      [138, 1.4, -105, (2 * Math.PI) / 3],      // Ring 5: Eastern entrance
      [148, 1.4, -60, Math.PI],                 // Ring 6: Eastern straightaway
      [138, 1.4, -22, (3 * Math.PI) / 4],       // Ring 7: South-East cape
      [105, 1.4, -6, -Math.PI / 2],             // Ring 8: Southern bay
      [62, 1.4, -10, -Math.PI / 2],             // Ring 9: Approach to wooden bridge channel
      [32, 1.4, -36, 0],                        // Ring 10: Final home stretch to finish line
    ];

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xca8a04,
      emissiveIntensity: 0.6,
    });

    // IDENTICAL SHAPE AND MATERIAL AS WORLD COLLECTIBLE COINS
    const ringCoinMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.65,
      metalness: 0.9,
      roughness: 0.1,
    });

    this.boatRaceRings = [];
    ringCoords.forEach(([x, y, z, rotY]) => {
      const ringGroup = new THREE.Group();
      ringGroup.position.set(x, y, z);
      ringGroup.rotation.y = rotY;

      // Outer Torus Ring
      const torus = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.22, 16, 32), ringMat);
      ringGroup.add(torus);

      // Inner Floating Rotating Coin (exact shape as world collectible coins)
      const coinGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16);
      coinGeo.rotateX(Math.PI / 2);
      const coin = new THREE.Mesh(coinGeo, ringCoinMat);
      ringGroup.add(coin);

      this.boatRaceCourseGroup!.add(ringGroup);
      this.boatRaceRings.push({
        mesh: ringGroup,
        coinMesh: coin,
        hit: false,
        pos: new THREE.Vector3(x, y, z),
      });
    });

    // 4. Floating Sea Obstacles (Hazard buoys in open water)
    const obstacleCoords: [number, number][] = [
      [26, -90],
      [38, -140],
      [75, -152],
      [132, -140],
      [156, -75],
      [156, -30],
      [120, -2],
      [82, 4],
      [26, -26],
    ];

    this.boatRaceObstacles = [];
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.4,
      metalness: 0.3,
    });
    const stripeHazardMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });

    obstacleCoords.forEach(([x, z]) => {
      const obsGroup = new THREE.Group();
      obsGroup.position.set(x, 0, z);

      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 12), barrelMat);
      barrel.position.y = 0.45;
      obsGroup.add(barrel);

      const stripe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.18, 12), stripeHazardMat);
      stripe1.position.y = 0.55;
      obsGroup.add(stripe1);

      this.boatRaceCourseGroup!.add(obsGroup);
      this.boatRaceObstacles.push({
        mesh: obsGroup,
        pos: new THREE.Vector3(x, 0, z),
        radius: 1.1,
      });
    });

    // 5. Grand Finish Arch Gate at (32, 0.05, -48) in open water
    const gateGroup = new THREE.Group();
    gateGroup.position.set(32, 0.05, -48);

    const gatePylonMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.7,
    });
    const gateCheckMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3,
    });

    // Left & Right Floating Towers
    for (const side of [-3.8, 3.8]) {
      const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 6.0, 12), gatePylonMat);
      pylon.position.set(side, 3.0, 0);
      gateGroup.add(pylon);

      // Checkered rings on pylons
      for (let r = 0; r < 4; r++) {
        const cRing = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 12), gateCheckMat);
        cRing.position.set(side, 1.0 + r * 1.2, 0);
        gateGroup.add(cRing);
      }

      // Strobe Light on top of tower
      const strobe = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      strobe.position.set(side, 6.2, 0);
      gateGroup.add(strobe);
    }

    // Overhead Checkered Banner Truss
    const truss = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.2, 0.35), gatePylonMat);
    truss.position.set(0, 5.5, 0);
    gateGroup.add(truss);

    const bannerCanvas = document.createElement("canvas");
    bannerCanvas.width = 512;
    bannerCanvas.height = 128;
    const bctx = bannerCanvas.getContext("2d");
    if (bctx) {
      bctx.fillStyle = "#0f172a";
      bctx.fillRect(0, 0, 512, 128);
      // Checkered borders
      const cw = 32;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 16; col++) {
          bctx.fillStyle = (row + col) % 2 === 0 ? "#ffffff" : "#000000";
          bctx.fillRect(col * cw, row * 16, cw, 16);
          bctx.fillRect(col * cw, 128 - 32 + row * 16, cw, 16);
        }
      }
      bctx.fillStyle = "#facc15";
      bctx.font = "900 48px sans-serif";
      bctx.textAlign = "center";
      bctx.textBaseline = "middle";
      bctx.fillText("FINISH 🏁", 256, 64);
    }
    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(7.8, 1.0),
      new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide })
    );
    banner.position.set(0, 5.5, 0.2);
    gateGroup.add(banner);

    this.boatRaceCourseGroup.add(gateGroup);
    this.boatRaceFinishGate = {
      archGroup: gateGroup,
      pos: new THREE.Vector3(32, 0.05, -48),
      triggered: false,
    };

    this.scene.add(this.boatRaceCourseGroup);

    // 6. Build & Attach Player Speedboat
    const playerBoat = this.buildSpeedboatMesh("player");
    this.playerBoatGroup = playerBoat.group;
    this.playerBoatPropellers = playerBoat.propellers;
    this.playerGroup.add(this.playerBoatGroup);

    // 7. Build Rival Jax Speedboat (starts alongside player facing North towards WP 1)
    const rivalBoat = this.buildSpeedboatMesh("rival");
    this.npcBoatGroup = rivalBoat.group;
    this.npcBoatPropellers = rivalBoat.propellers;
    this.npcBoatPos.set(30.5, 0.05, -52);
    this.npcBoatRotY = 0; // Facing North towards WP 1!
    this.npcBoatGroup.position.copy(this.npcBoatPos);
    this.npcBoatGroup.rotation.y = this.npcBoatRotY;
    this.npcBoatSpeed = 0;
    this.npcCurrentWpIdx = 1;
    this.npcCurrentLap = 1;
    this.npcFinished = false;
    this.npcTotalDistance = 0;
    this.playerTotalDistance = 0;
    this.scene.add(this.npcBoatGroup);
  }

  private updateBoatRace(delta: number, time: number) {
    if (!this.activeMinigame || this.activeMinigame.id !== "airdrop_hunt") return;

    // 0. RACE COUNTDOWN (3... 2... 1... GO!)
    if (this.boatRaceCountdown > -1.2) {
      this.boatRaceCountdown -= delta;
      const countNum = Math.ceil(this.boatRaceCountdown);
      if (countNum > 0) {
        if (countNum !== this.lastCountdownNumber) {
          this.lastCountdownNumber = countNum;
          this.audio.playChime();
        }
        this.activeMinigame.raceCountdown = countNum;
        // Lock boats securely at open-sea start line
        this.currentSpeed = 0;
        this.playerVel.set(0, 0, 0);
        this.playerPos.set(33.5, 0.05, -52);
        this.playerRotY = 0;
        this.playerGroup.position.copy(this.playerPos);
        this.playerGroup.rotation.y = this.playerRotY;
        if (this.npcBoatGroup) {
          this.npcBoatSpeed = 0;
          this.npcBoatPos.set(30.5, 0.05, -52);
          this.npcBoatRotY = 0;
          this.npcBoatGroup.position.copy(this.npcBoatPos);
          this.npcBoatGroup.rotation.y = this.npcBoatRotY;
        }
        this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });
        return; // Pause race action and timer during countdown!
      } else if (this.boatRaceCountdown > -1.0) {
        // "GO! 🚀" Trigger
        if (this.lastCountdownNumber !== 0) {
          this.lastCountdownNumber = 0;
          this.audio.playBoost();
          // Instant green-light launch surge so Jax roars forward alongside player!
          this.npcBoatSpeed = 14.5;
        }
        this.activeMinigame.raceCountdown = 0;
      } else {
        // Dismiss countdown overlay
        this.activeMinigame.raceCountdown = undefined;
      }
    }

    // Orient Captain Jax overhead billboard nameplate towards player camera
    if (this.npcBoatNameplate) {
      this.npcBoatNameplate.lookAt(this.camera.position);
    }

    // 1. Animate Course Elements (Rings bobbing, coins spinning)
    for (let i = 0; i < this.boatRaceRings.length; i++) {
      const ring = this.boatRaceRings[i];
      if (!ring.hit) {
        ring.mesh.position.y = ring.pos.y + Math.sin(time * 3.0 + i) * 0.15;
        if (ring.coinMesh) {
          ring.coinMesh.rotation.z = time * 3.5;
        }

        // Collision with player boat
        const d = this.playerPos.distanceTo(ring.pos);
        if (d < 3.8) {
          ring.hit = true;
          ring.coinMesh.visible = false;
          // Flare effect on ring
          const torusMesh = ring.mesh.children[0] as THREE.Mesh;
          if (torusMesh) {
            torusMesh.scale.set(1.4, 1.4, 1.4);
            setTimeout(() => {
              if (torusMesh) torusMesh.scale.set(1.0, 1.0, 1.0);
            }, 300);
          }

          this.audio.playCoin();
          this.audio.playBoost();
          this.coinsCollected++;
          this.callbacks.onCoinsUpdate?.(this.coinsCollected, this.totalCoins);

          // Boost speed surge!
          this.nitro = Math.min(100, this.nitro + 35);
          this.currentSpeed = Math.min(24.0, this.currentSpeed + 4.5);

          this.activeMinigame.raceRingsCollected = (this.activeMinigame.raceRingsCollected || 0) + 1;
        }
      }
    }

    // 2. Obstacle Collisions
    for (const obs of this.boatRaceObstacles) {
      const d = Math.hypot(this.playerPos.x - obs.pos.x, this.playerPos.z - obs.pos.z);
      if (d < obs.radius + 0.9) {
        if (this.currentSpeed > 4.0) {
          this.currentSpeed = 3.5; // Slam brakes / knockback on impact
          this.audio.playSplash();
        }
      }
    }

    // 3. Rival Jax AI Navigation (Across 2 Laps)
    if (this.npcBoatGroup && this.boatRaceWaypoints.length > 0) {
      if (this.npcFinished) {
        // Jax already finished: continue cruising smoothly at gentle celebration speed (never stop dead!)
        this.npcBoatSpeed = THREE.MathUtils.lerp(this.npcBoatSpeed, 7.5, 1.2 * delta);
        this.npcBoatPos.x += -Math.sin(this.npcBoatRotY) * this.npcBoatSpeed * delta;
        this.npcBoatPos.z += -Math.cos(this.npcBoatRotY) * this.npcBoatSpeed * delta;
        this.npcBoatGroup.position.copy(this.npcBoatPos);
        for (const prop of this.npcBoatPropellers) {
          prop.rotation.z += (this.npcBoatSpeed * 4.5 + 8.0) * delta;
        }
      } else {
        const targetWp = this.boatRaceWaypoints[this.npcCurrentWpIdx];
        const dx = targetWp.pos.x - this.npcBoatPos.x;
        const dz = targetWp.pos.z - this.npcBoatPos.z;
        const distToWp = Math.hypot(dx, dz);

        // Advance WP / Lap for Jax (generous 16m radius so Jax flows smoothly through turns)
        if (distToWp < 16.0) {
          if (this.npcCurrentWpIdx < this.boatRaceWaypoints.length - 1) {
            this.npcCurrentWpIdx++;
          } else {
            // Reached finish line of current lap
            if (this.npcCurrentLap < this.playerTotalLaps) {
              this.npcCurrentLap++;
              this.npcCurrentWpIdx = 1;
            } else {
              // Jax finished the entire race!
              this.npcFinished = true;
              if (this.activeMinigame && this.activeMinigame.status === "playing") {
                this.activeMinigame.racePosition = 2; // Jax finished first, player is in 2nd!
              }
            }
          }
        }

        // Steer towards target waypoint
        const targetAngle = Math.atan2(-dx, -dz);
        let angleDiff = targetAngle - this.npcBoatRotY;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        this.npcBoatRotY += THREE.MathUtils.clamp(angleDiff, -3.5 * delta, 3.5 * delta);

        // Dynamic Competitive AI Regulation (Rubber-banding)
        // Keep the race close and thrilling: if Jax pulls ahead, he moderates; if behind, he pushes hard!
        const totalWpsPerLap = this.boatRaceWaypoints.length - 1;
        const playerTotalWps = (this.playerCurrentLap - 1) * totalWpsPerLap + (this.playerCurrentWpIdx - 1);
        const npcTotalWps = (this.npcCurrentLap - 1) * totalWpsPerLap + (this.npcCurrentWpIdx - 1);
        const wpDiff = npcTotalWps - playerTotalWps;

        const isSharpTurn = Math.abs(angleDiff) > 0.45;
        let targetNpcSpeed = isSharpTurn ? 11.5 : 14.8;

        if (wpDiff > 0) {
          // Jax is ahead: tone down speed slightly so player can duel and overtake
          targetNpcSpeed = Math.max(11.0, targetNpcSpeed - 2.2);
        } else if (wpDiff < 0) {
          // Jax is behind: apply boost to catch up and challenge player
          targetNpcSpeed = Math.min(17.5, targetNpcSpeed + 2.5);
        }

        this.npcBoatSpeed = THREE.MathUtils.lerp(this.npcBoatSpeed, targetNpcSpeed, 3.0 * delta);

        this.npcBoatPos.x += -Math.sin(this.npcBoatRotY) * this.npcBoatSpeed * delta;
        this.npcBoatPos.z += -Math.cos(this.npcBoatRotY) * this.npcBoatSpeed * delta;
        this.npcBoatPos.y = 0.05 + Math.sin(time * 3.8 + 1.0) * 0.04;

        this.npcBoatGroup.position.copy(this.npcBoatPos);
        this.npcBoatGroup.rotation.y = this.npcBoatRotY;
        this.npcBoatGroup.rotation.z = -angleDiff * 0.35;
        this.npcBoatGroup.rotation.x = Math.max(0, this.npcBoatSpeed / 15.2) * 0.1;

        // Spin Jax propellers
        for (const prop of this.npcBoatPropellers) {
          prop.rotation.z += (this.npcBoatSpeed * 4.5 + 8.0) * delta;
        }
      }
    }

    // 4. Sequential Circuit Progress & Dynamic Relative Turn Guidance (Across 2 Laps)
    if (this.boatRaceWaypoints.length > 0) {
      const targetWp = this.boatRaceWaypoints[this.playerCurrentWpIdx];
      const dx = targetWp.pos.x - this.playerPos.x;
      const dz = targetWp.pos.z - this.playerPos.z;
      const distToWp = Math.hypot(dx, dz);

      // Advance player waypoint when within passing distance
      if (distToWp < 18.0 && this.playerCurrentWpIdx < this.boatRaceWaypoints.length - 1) {
        this.playerCurrentWpIdx++;
      }

      // Compute dynamic heading angle relative to current boat heading
      const currentTargetWp = this.boatRaceWaypoints[this.playerCurrentWpIdx];
      const tdx = currentTargetWp.pos.x - this.playerPos.x;
      const tdz = currentTargetWp.pos.z - this.playerPos.z;
      const targetAngle = Math.atan2(-tdx, -tdz);
      let angleDiff = targetAngle - this.playerRotY;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      let guideDir = "▲ LURUS";
      if (angleDiff < -0.32) {
        guideDir = "➔ BELOK KANAN";
      } else if (angleDiff > 0.32) {
        guideDir = "⬅ BELOK KIRI";
      }
      this.activeMinigame.nextTurnGuide = `${guideDir} (${currentTargetWp.name})`;
      this.activeMinigame.currentLap = this.playerCurrentLap;
      this.activeMinigame.totalLaps = this.playerTotalLaps;

      // 2-Lap Circuit Progress Calculation
      const totalWpsPerLap = this.boatRaceWaypoints.length - 1;
      const playerTotalWps = (this.playerCurrentLap - 1) * totalWpsPerLap + (this.playerCurrentWpIdx - 1);
      const npcTotalWps = (this.npcCurrentLap - 1) * totalWpsPerLap + (this.npcCurrentWpIdx - 1);
      const maxRaceWps = this.playerTotalLaps * totalWpsPerLap;

      const wpDistNorm = Math.max(0, 1 - Math.min(36, Math.hypot(tdx, tdz)) / 36);
      const playerProgress = Math.min(1.0, (playerTotalWps + wpDistNorm) / maxRaceWps);
      this.activeMinigame.raceProgressPct = Math.round(playerProgress * 100);

      // Live position (1st vs 2nd, strictly tracking Jax's finish)
      if (this.npcFinished) {
        this.activeMinigame.racePosition = 2;
      } else if (playerTotalWps > npcTotalWps) {
        this.activeMinigame.racePosition = 1;
      } else if (playerTotalWps < npcTotalWps) {
        this.activeMinigame.racePosition = 2;
      } else {
        const playerDist = Math.hypot(tdx, tdz);
        const npcDist = Math.hypot(currentTargetWp.pos.x - this.npcBoatPos.x, currentTargetWp.pos.z - this.npcBoatPos.z);
        this.activeMinigame.racePosition = playerDist <= npcDist ? 1 : 2;
      }

      // Live Jax distance readout
      const dJax = Math.hypot(this.playerPos.x - this.npcBoatPos.x, this.playerPos.z - this.npcBoatPos.z);
      const jaxDistRound = Math.round(dJax);
      if (this.activeMinigame.racePosition === 1) {
        this.activeMinigame.npcDistanceText = `Jax: -${jaxDistRound}m (Belakang)`;
      } else {
        this.activeMinigame.npcDistanceText = `Jax: +${jaxDistRound}m (Depan)`;
      }
    }

    // 5. Finish Gate Crossing Check (Lap Transition & Grand Finish)
    if (this.boatRaceFinishGate && this.activeMinigame.status === "playing") {
      const dFinish = this.playerPos.distanceTo(this.boatRaceFinishGate.pos);
      if (dFinish < 9.5 && this.playerCurrentWpIdx >= this.boatRaceWaypoints.length - 2) {
        if (this.playerCurrentLap < this.playerTotalLaps) {
          // LAP 1 COMPLETED -> ENTER FINAL LAP 2!
          this.playerCurrentLap++;
          this.playerCurrentWpIdx = 1;
          this.activeMinigame.currentLap = this.playerCurrentLap;
          this.activeMinigame.lapNotification = "🏁 PUTARAN TERAKHIR! (LAP 2/2)";
          this.audio.playChime();
          this.audio.playBoost();

          // Respawn rings for Lap 2 so player can collect coins again
          for (const ring of this.boatRaceRings) {
            ring.hit = false;
            ring.coinMesh.visible = true;
          }

          setTimeout(() => {
            if (this.activeMinigame) {
              this.activeMinigame.lapNotification = undefined;
            }
          }, 3500);
        } else if (!this.boatRaceFinishGate.triggered) {
          // LAP 2 COMPLETED -> GRAND FINISH!
          this.boatRaceFinishGate.triggered = true;

          const isPlayerFirst = !this.npcFinished && this.activeMinigame.racePosition === 1;

          if (isPlayerFirst) {
            // JUARA 1 -> WON & AWARD +15 PRIZE COINS!
            this.activeMinigame.racePosition = 1;
            this.activeMinigame.score = 1;
            this.activeMinigame.status = "won";
            this.audio.playVictory();
            this.audio.playGoal();
            this.coinsCollected += 15; // Prize coins only for 1st place!
            this.callbacks.onCoinsUpdate?.(this.coinsCollected, this.totalCoins);
            this.callbacks.onQuestProgress?.(this.activeMinigame.id);
            this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });

            setTimeout(() => {
              if (this.activeMinigame?.status === "won") {
                this.playerPos.set(74, 7.8, -58); // Teleport back to center of Battle Royale Island!
                this.playerVel.set(0, 0, 0);
                this.currentSpeed = 0;
                this.cleanupMinigame();
                this.activeMinigame = null;
                this.callbacks.onMinigameUpdate?.(null);
              }
            }, 5000);
            return;
          } else {
            // JUARA 2 / KALAH -> NO PRIZE COINS! Must win 1st to get coins.
            this.activeMinigame.racePosition = 2;
            this.activeMinigame.score = 0;
            this.activeMinigame.status = "lost";
            this.activeMinigame.loseReason = "second_place";
            this.audio.playGameOver();
            this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });

            setTimeout(() => {
              if (this.activeMinigame?.status === "lost") {
                this.playerPos.set(74, 7.8, -58); // Teleport back to center of Battle Royale Island!
                this.playerVel.set(0, 0, 0);
                this.currentSpeed = 0;
                this.cleanupMinigame();
                this.activeMinigame = null;
                this.callbacks.onMinigameUpdate?.(null);
              }
            }, 4500);
            return;
          }
        }
      }
    }

    this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });
  }

  private createMarioQuestionTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(0, 0, 128, 128);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#b45309";
      ctx.strokeRect(5, 5, 118, 118);
      ctx.fillStyle = "#78350f";
      for (const [bx, by] of [[16, 16], [112, 16], [16, 112], [112, 112]]) {
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 80px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#78350f";
      ctx.shadowBlur = 6;
      ctx.fillText("?", 64, 66);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createMarioFlagTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(0, 0, 128, 128);
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#15803d";
      ctx.strokeRect(4, 4, 120, 120);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(64, 64, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#15803d";
      ctx.font = "bold 46px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("★", 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private setupMarioCourse() {
    this.marioSpawnedCourseGroup = new THREE.Group();
    this.marioPlatforms = [];
    this.marioQuestionBlocks = [];
    this.marioFlagPole = null;

    const qTex = this.createMarioQuestionTexture();
    const flagTex = this.createMarioFlagTexture();

    // High quality non-flickering materials
    const startMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.35,
      metalness: 0.1,
    });
    const stonePlatMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.4,
      metalness: 0.15,
    });
    const movingPlatMatA = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
      roughness: 0.25,
    });
    const movingPlatMatB = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      roughness: 0.25,
    });
    const bounceMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const questionMat = new THREE.MeshStandardMaterial({
      map: qTex,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
      roughness: 0.3,
    });

    // Helper: Add solid box platform without overlapping coplanar trim (zero flickering!)
    const addPlatform = (
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      options?: {
        isMoving?: boolean;
        axis?: "x" | "y" | "z";
        amp?: number;
        speed?: number;
      }
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(x, y - h * 0.5, z);
      this.marioSpawnedCourseGroup!.add(mesh);

      // Support pillar below (strictly below platform bottom, zero Z-fighting!)
      const pillarGeo = new THREE.CylinderGeometry(w * 0.32, w * 0.16, 3.2, 6);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.85 });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(0, -h * 0.5 - 1.6, 0);
      mesh.add(pillar);

      this.marioPlatforms.push({
        x,
        y,
        z,
        width: w,
        depth: d,
        isMoving: options?.isMoving,
        axis: options?.axis,
        amp: options?.amp,
        speed: options?.speed,
        basePos: new THREE.Vector3(x, y - h * 0.5, z),
        mesh,
      });

      return mesh;
    };

    // Helper to spawn a question block with pop-up gold coin
    const spawnQuestionBlock = (bx: number, by: number, bz: number) => {
      const qGroup = new THREE.Group();
      qGroup.position.set(bx, by, bz);
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), questionMat);
      bMesh.castShadow = true;
      qGroup.add(bMesh);

      const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16);
      coinGeo.rotateZ(Math.PI / 2);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xeab308,
        emissiveIntensity: 0.5,
      });
      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      coinMesh.visible = false;
      qGroup.add(coinMesh);

      this.marioSpawnedCourseGroup!.add(qGroup);
      this.marioQuestionBlocks.push({
        mesh: qGroup,
        basePos: new THREE.Vector3(bx, by, bz),
        hit: false,
        bounceTimer: 0,
        coinMesh,
        coinTimer: 0,
      });
    };

    // Decal material with polygonOffset to guarantee zero Z-fighting
    const createDecalMat = (color: number) => new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      depthWrite: false,
    });

    // =========================================================================
    // 16-PLATFORM EPIC RALLY TRACK
    // =========================================================================

    // Stage 0: Start Platform (Hex Bay Quay)
    addPlatform(-48, 5.2, 54, 4.4, 0.8, 4.4, startMat);
    const startRing = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.6, 32), createDecalMat(0x4ade80));
    startRing.rotation.x = -Math.PI / 2;
    startRing.position.set(-48, 5.24, 54);
    this.marioSpawnedCourseGroup.add(startRing);

    // Stage 1: Stepping Stone 1
    addPlatform(-52, 5.8, 60, 3.2, 0.8, 3.2, stonePlatMat);

    // Stage 2: Stepping Stone 2 + Question Block 1 (Elevated to y=10.3, reachable with Double Jump!)
    addPlatform(-56, 6.4, 66, 3.2, 0.8, 3.2, stonePlatMat);
    spawnQuestionBlock(-55.2, 10.3, 65.5);

    // Stage 3: Moving Horizontal Platform A (X oscillation across lagoon gap)
    addPlatform(-61, 7.2, 72, 3.2, 0.6, 3.2, movingPlatMatA, {
      isMoving: true,
      axis: "x",
      amp: 3.2,
      speed: 1.6,
    });

    // Stage 4: Stone Island Step 4
    addPlatform(-67, 7.8, 77, 3.4, 0.8, 3.4, stonePlatMat);

    // Stage 5: Stone Island Step 5 + Question Block 2 (Elevated to y=12.3, reachable with Double Jump!)
    addPlatform(-72, 8.5, 83, 3.2, 0.8, 3.2, stonePlatMat);
    spawnQuestionBlock(-71.2, 12.3, 82.5);

    // Stage 6: Moving Elevator Platform B (Vertical Y elevator)
    addPlatform(-77, 9.4, 88, 3.2, 0.6, 3.2, movingPlatMatB, {
      isMoving: true,
      axis: "y",
      amp: 1.5,
      speed: 1.8,
    });

    // Stage 7: MIDWAY CHECKPOINT ALTAR
    addPlatform(-82, 10.8, 93, 5.2, 1.0, 5.2, startMat);
    const cpRing = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.8, 32), createDecalMat(0x38bdf8));
    cpRing.rotation.x = -Math.PI / 2;
    cpRing.position.set(-82, 10.84, 93);
    this.marioSpawnedCourseGroup.add(cpRing);

    // Midway Checkpoint Pennant
    const cpFlagGroup = new THREE.Group();
    cpFlagGroup.position.set(-83.6, 10.8, 93);
    const cpPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.4, 12),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8 })
    );
    cpPole.position.y = 1.7;
    cpFlagGroup.add(cpPole);
    const cpBanner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
    );
    cpBanner.position.set(0.6, 2.9, 0);
    cpFlagGroup.add(cpBanner);
    this.marioSpawnedCourseGroup.add(cpFlagGroup);

    // Stage 8: High Pillar Step 8
    addPlatform(-85, 11.6, 100, 3.0, 0.8, 3.0, stonePlatMat);

    // Stage 9: High Step 9 + Question Block 3 (Elevated to y=16.1, reachable with Double Jump!)
    addPlatform(-88, 12.3, 107, 3.2, 0.8, 3.2, stonePlatMat);
    spawnQuestionBlock(-87.0, 16.1, 106.5);

    // Stage 10: Moving Longitudinal Platform C (Z oscillation forward-backward)
    addPlatform(-88, 13.0, 114, 3.2, 0.6, 3.2, movingPlatMatA, {
      isMoving: true,
      axis: "z",
      amp: 2.8,
      speed: 1.6,
    });

    // Stage 11: High Mountain Terrace 11
    addPlatform(-86, 13.8, 121, 3.4, 0.8, 3.4, stonePlatMat);

    // Stage 12: Sky Bridge Step 12
    addPlatform(-81, 14.4, 126, 3.2, 0.8, 3.2, stonePlatMat);

    // Stage 13: SUPER BOUNCER SPRING PAD (Launches Milo high into the summit!)
    addPlatform(-75, 14.8, 129, 3.4, 0.6, 3.4, bounceMat);
    const springRing = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.2, 24), createDecalMat(0xfacc15));
    springRing.rotation.x = -Math.PI / 2;
    springRing.position.set(-75, 14.84, 129);
    this.marioSpawnedCourseGroup.add(springRing);

    // Stage 14: Summit Approach Terrace 14
    addPlatform(-69, 15.6, 132, 3.6, 0.8, 3.6, stonePlatMat);

    // Stage 15: GRAND SUMMIT CASTLE TERRACE & SUPER MARIO FLAGPOLE
    addPlatform(-60, 16.2, 135, 8.5, 1.4, 8.5, startMat);

    const finishRing = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.4, 32), createDecalMat(0xfacc15));
    finishRing.rotation.x = -Math.PI / 2;
    finishRing.position.set(-60, 16.24, 135);
    this.marioSpawnedCourseGroup.add(finishRing);

    // Magnificent Golden Super Mario Flagpole (Height 7.5m)
    const flagGroup = new THREE.Group();
    flagGroup.position.set(-60, 16.2, 135);

    const baseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.2, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
    );
    baseMesh.position.y = 0.22;
    flagGroup.add(baseMesh);

    const poleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 7.5, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.15 })
    );
    poleMesh.position.y = 4.2;
    flagGroup.add(poleMesh);

    const orbMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.95,
        roughness: 0.1,
        emissive: 0xeab308,
        emissiveIntensity: 0.4,
      })
    );
    orbMesh.position.y = 7.95;
    flagGroup.add(orbMesh);

    const flagGeo = new THREE.PlaneGeometry(2.0, 1.25);
    const flagMesh = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({
      map: flagTex,
      side: THREE.DoubleSide,
      roughness: 0.4,
    }));
    flagMesh.position.set(1.0, 7.2, 0);
    flagGroup.add(flagMesh);

    this.marioSpawnedCourseGroup.add(flagGroup);
    this.marioFlagPole = {
      group: flagGroup,
      polePos: new THREE.Vector3(-60, 16.2, 135),
      flagMesh,
      isFinishTriggered: false,
      flagProgress: 0,
    };

    this.scene.add(this.marioSpawnedCourseGroup);
  }

  private triggerMarioFireworks(pos: THREE.Vector3) {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    const palette = [
      new THREE.Color(0xef4444),
      new THREE.Color(0xfacc15),
      new THREE.Color(0x22c55e),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xa855f7),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y + 6.8;
      positions[i * 3 + 2] = pos.z;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.5;
      velocities.push(
        new THREE.Vector3(
          Math.cos(angle) * speed,
          3.5 + Math.random() * 4.0,
          Math.sin(angle) * speed
        )
      );
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
    this.marioConfettiParticles = particles;
    (particles as any).velocities = velocities;
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

    if (this.activeMinigame.id === "airdrop_hunt") {
      this.updateBoatRace(delta, time);
    } else if (this.activeMinigame.id === "hex_mario_run") {
      // 1. Update Moving Platforms
      for (const plat of this.marioPlatforms) {
        if (plat.isMoving && plat.basePos) {
          const offset = Math.sin(time * (plat.speed || 1.5)) * (plat.amp || 2.0);
          if (plat.axis === "x") {
            const oldX = plat.mesh.position.x;
            plat.mesh.position.x = plat.basePos.x + offset;
            plat.x = plat.mesh.position.x;
            // Carry Milo if standing on this moving platform
            const hw = plat.width * 0.5;
            const hd = plat.depth * 0.5;
            if (
              Math.abs(this.playerPos.x - oldX) <= hw &&
              Math.abs(this.playerPos.z - plat.z) <= hd &&
              Math.abs(this.playerPos.y - plat.y) < 0.35
            ) {
              this.playerPos.x += (plat.mesh.position.x - oldX);
            }
          } else if (plat.axis === "y") {
            const oldY = plat.mesh.position.y;
            plat.mesh.position.y = plat.basePos.y + offset;
            plat.y = plat.mesh.position.y + 0.3;
            // Carry Milo vertically
            const hw = plat.width * 0.5;
            const hd = plat.depth * 0.5;
            if (
              Math.abs(this.playerPos.x - plat.x) <= hw &&
              Math.abs(this.playerPos.z - plat.z) <= hd &&
              Math.abs(this.playerPos.y - (oldY + 0.3)) < 0.4
            ) {
              this.playerPos.y += (plat.mesh.position.y - oldY);
            }
          } else if (plat.axis === "z") {
            const oldZ = plat.mesh.position.z;
            plat.mesh.position.z = plat.basePos.z + offset;
            plat.z = plat.mesh.position.z;
            const hw = plat.width * 0.5;
            const hd = plat.depth * 0.5;
            if (
              Math.abs(this.playerPos.x - plat.x) <= hw &&
              Math.abs(this.playerPos.z - oldZ) <= hd &&
              Math.abs(this.playerPos.y - plat.y) < 0.35
            ) {
              this.playerPos.z += (plat.mesh.position.z - oldZ);
            }
          }
        }
      }

      // Midway Checkpoint Save (Platform 7 at [-82, 93])
      if (
        Math.hypot(this.playerPos.x - (-82), this.playerPos.z - 93) < 2.5 &&
        !this.activeMinigame.checkpointReached
      ) {
        this.activeMinigame.checkpointReached = true;
        this.marioCheckpointPos.set(-82, 11.4, 93);
        this.audio.playChime();
        this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });
      }

      // Super Bounce Spring Pad (Platform 13 at [-75, 129])
      if (
        Math.hypot(this.playerPos.x - (-75), this.playerPos.z - 129) < 1.7 &&
        Math.abs(this.playerPos.y - 14.8) < 0.6 &&
        this.playerVel.y <= 0
      ) {
        this.playerVel.y = 8.6;
        this.audio.playBoost();
        this.audio.playJump();
      }

      // 2. Update Question Blocks [?]
      for (const qb of this.marioQuestionBlocks) {
        const dHoriz = Math.hypot(this.playerPos.x - qb.basePos.x, this.playerPos.z - qb.basePos.z);
        const dVert = Math.abs(this.playerPos.y + 0.9 - qb.basePos.y);
        if (!qb.hit && dHoriz < 1.7 && dVert < 1.6) {
          qb.hit = true;
          qb.bounceTimer = 0.35;
          qb.coinTimer = 0.6;
          this.audio.playCoin();
          this.coinsCollected++;
          this.callbacks.onCoinsUpdate?.(this.coinsCollected, this.totalCoins);
          if (qb.coinMesh) {
            qb.coinMesh.visible = true;
            qb.coinMesh.position.set(0, 0.8, 0);
          }
        }

        if (qb.bounceTimer > 0) {
          qb.bounceTimer -= delta;
          const t = Math.max(0, qb.bounceTimer) / 0.35;
          qb.mesh.position.y = qb.basePos.y + Math.sin((1 - t) * Math.PI) * 0.45;
        }

        if (qb.coinTimer && qb.coinTimer > 0) {
          qb.coinTimer -= delta;
          const progress = 1 - Math.max(0, qb.coinTimer) / 0.6;
          if (qb.coinMesh) {
            qb.coinMesh.position.y = 0.8 + Math.sin(progress * Math.PI) * 1.5;
            qb.coinMesh.rotation.y = time * 12;
            if (progress >= 1.0) {
              qb.coinMesh.visible = false;
              // Kotak tanda tanya yang sudah keluar koin langsung dihilangkan
              qb.mesh.visible = false;
            }
          }
        }
      }

      // 3. Check Flagpole Finish
      if (this.marioFlagPole && !this.marioFlagPole.isFinishTriggered) {
        const dGoal = Math.hypot(
          this.playerPos.x - this.marioFlagPole.polePos.x,
          this.playerPos.z - this.marioFlagPole.polePos.z
        );
        if (dGoal < 2.4 && this.playerPos.y >= this.marioFlagPole.polePos.y - 0.5) {
          this.marioFlagPole.isFinishTriggered = true;
          this.marioFlagPole.flagProgress = 0;
          this.currentSpeed = 0;
          this.playerVel.y = 5.2; // Celebratory victory hop
          this.audio.playGoal();
          this.audio.playVictory();
          this.triggerMarioFireworks(this.marioFlagPole.polePos);
          this.activeMinigame.score = 1;
        }
      }

      if (this.marioFlagPole?.isFinishTriggered) {
        this.marioFlagPole.flagProgress = Math.min(1.0, this.marioFlagPole.flagProgress + delta * 1.4);
        const topY = 6.2;
        const botY = 1.2;
        this.marioFlagPole.flagMesh.position.y =
          topY * (1 - this.marioFlagPole.flagProgress) + botY * this.marioFlagPole.flagProgress;
        this.marioFlagPole.flagMesh.rotation.y = Math.sin(time * 6) * 0.2;

        if (this.marioConfettiParticles) {
          const posAttr = this.marioConfettiParticles.geometry.attributes.position as THREE.BufferAttribute;
          const vels = (this.marioConfettiParticles as any).velocities as THREE.Vector3[];
          if (vels) {
            for (let i = 0; i < vels.length; i++) {
              posAttr.setX(i, posAttr.getX(i) + vels[i].x * delta);
              posAttr.setY(i, posAttr.getY(i) + vels[i].y * delta);
              posAttr.setZ(i, posAttr.getZ(i) + vels[i].z * delta);
              vels[i].y -= 9.8 * delta;
            }
            posAttr.needsUpdate = true;
          }
        }
      }

      // 4. Fall Off Lagoon Check (Respawn if checkpoint reached, else GAME OVER!)
      if (!this.marioFlagPole?.isFinishTriggered && this.playerPos.y < 3.2 && this.activeMinigame.status === "playing") {
        if (this.activeMinigame.checkpointReached) {
          // Has Checkpoint: Do NOT Game Over! Respawn back at Checkpoint Altar and continue playing!
          this.playerPos.set(-82, 11.8, 93);
          this.playerVel.set(0, 3.2, 0);
          this.currentSpeed = 0;
          this.jumpCount = 0;
          this.prevJumpInput = false;
          // Milo directly faces forward towards Platform 8 at (-85, 100)
          this.playerRotY = Math.atan2(3, -7); // ~2.736 rad (~156.8°)
          this.audio.playSplash();
          this.audio.playJump();
          this.activeMinigame.checkpointRespawnCount = (this.activeMinigame.checkpointRespawnCount || 0) + 1;
          this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });
        } else {
          // No Checkpoint: Immediate GAME OVER!
          this.activeMinigame.status = "lost";
          this.activeMinigame.loseReason = "drowned";
          this.currentSpeed = 0;
          this.audio.playSplash();
          this.audio.playGameOver();
          this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });

          setTimeout(() => {
            if (this.activeMinigame?.status === "lost") {
              this.playerPos.set(-48, 5.8, 54);
              this.playerVel.set(0, 0, 0);
              this.currentSpeed = 0;
              this.cleanupMinigame();
              this.activeMinigame = null;
              this.callbacks.onMinigameUpdate?.(null);
            }
          }, 3200);
          return;
        }
      }
    } else if (this.activeMinigame.id === "penalty_kick") {
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
      const rewardCoins = (this.activeMinigame.id === "hex_mario_run" || this.activeMinigame.id === "airdrop_hunt") ? 10 : 5;
      this.coinsCollected += rewardCoins;
      this.callbacks.onCoinsUpdate?.(this.coinsCollected, this.totalCoins);
      this.callbacks.onQuestProgress?.(this.activeMinigame.id);
      this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });

      const cleanupDelay = (this.activeMinigame.id === "hex_mario_run" || this.activeMinigame.id === "airdrop_hunt") ? 5000 : 4000;
      setTimeout(() => {
        if (this.activeMinigame?.status === "won") {
          if (this.isBoatRacing) {
            this.playerPos.set(74, 7.8, -58);
            this.playerVel.set(0, 0, 0);
            this.currentSpeed = 0;
          }
          this.cleanupMinigame();
          this.activeMinigame = null;
          this.callbacks.onMinigameUpdate?.(null);
        }
      }, cleanupDelay);
      return;
    }

    // Time-out lose condition check
    if (this.activeMinigame.timeLeft <= 0) {
      this.activeMinigame.timeLeft = 0;
      this.activeMinigame.status = "lost";
      this.activeMinigame.loseReason = "timeout";
      this.audio.playGameOver();
      this.callbacks.onMinigameUpdate?.({ ...this.activeMinigame });

      setTimeout(() => {
        if (this.activeMinigame?.status === "lost") {
          if (this.isMarioCourseActive) {
            this.playerPos.set(-48, 5.8, 54);
            this.playerVel.set(0, 0, 0);
            this.currentSpeed = 0;
          }
          if (this.isBoatRacing) {
            this.playerPos.set(74, 7.8, -58);
            this.playerVel.set(0, 0, 0);
            this.currentSpeed = 0;
          }
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
        .addScaledVector(npcForward, 2.1)
        .addScaledVector(npcRight, 0.8)
        .add(new THREE.Vector3(0, 1.25, 0));

      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 42, 6 * delta);
      this.camera.updateProjectionMatrix();
      this.camera.position.lerp(targetCamPos, 0.1);

      const targetLook = new THREE.Vector3().copy(npcPos).add(new THREE.Vector3(0, 1.0, 0));
      this.cameraLookAt.lerp(targetLook, 0.12);
      this.camera.lookAt(this.cameraLookAt);
      return;
    }

    // Dedicated Speedboat Grand Prix Marine Racing Camera
    if (this.isBoatRacing) {
      const targetFov = this.isBoosting ? 68 : 58;
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 6 * delta);
      this.camera.updateProjectionMatrix();

      if (!this.isPointerOrbiting && (this.inputs.forward || this.inputs.backward) && Math.abs(this.currentSpeed) > 2.0) {
        this.cameraOrbitYaw = THREE.MathUtils.lerp(this.cameraOrbitYaw, 0, 0.4 * delta);
      }

      const pitch = THREE.MathUtils.clamp(this.cameraOrbitPitch, -0.25, 0.5);
      const baseDist = 8.5 * this.cameraDistanceScale;
      const baseHeight = (2.8 + pitch * 5.0) * this.cameraDistanceScale;
      const horizDist = baseDist * Math.cos(pitch);

      const totalYaw = this.playerRotY + this.cameraOrbitYaw;
      const camOffset = new THREE.Vector3(
        Math.sin(totalYaw) * horizDist,
        Math.max(1.2, baseHeight),
        Math.cos(totalYaw) * horizDist
      );

      const targetCamPos = new THREE.Vector3().addVectors(this.playerPos, camOffset);
      this.camera.position.lerp(targetCamPos, 0.14);

      const lookTarget = new THREE.Vector3(this.playerPos.x, this.playerPos.y + 1.1, this.playerPos.z);
      this.cameraLookAt.lerp(lookTarget, 0.12);
      this.camera.lookAt(this.cameraLookAt);
      return;
    }

    // 0A. Super Mario 3D Warp-in Camera Dive Transition
    if (this.isMarioWarping) {
      this.marioWarpTimer += delta;
      const duration = 1.6;
      const progress = Math.min(1.0, this.marioWarpTimer / duration);
      const ease = progress * progress * (3 - 2 * progress);

      const warpStartCam = new THREE.Vector3(this.playerPos.x + 16, this.playerPos.y + 14, this.playerPos.z - 16);
      const warpEndCam = new THREE.Vector3(this.playerPos.x + 6.8, this.playerPos.y + 5.8, this.playerPos.z - 7.8);
      this.camera.position.lerpVectors(warpStartCam, warpEndCam, ease);

      const lookStart = new THREE.Vector3(this.playerPos.x - 12, this.playerPos.y, this.playerPos.z + 12);
      const lookEnd = new THREE.Vector3(this.playerPos.x - 2.5, this.playerPos.y + 1.8, this.playerPos.z + 3.0);
      this.cameraLookAt.lerpVectors(lookStart, lookEnd, ease);
      this.camera.lookAt(this.cameraLookAt);

      this.camera.fov = THREE.MathUtils.lerp(72, 50, ease);
      this.camera.updateProjectionMatrix();

      if (progress >= 1.0) {
        this.isMarioWarping = false;
      }
      return;
    }

    // 0B. Super Mario 3D Platformer Active Camera
    if (this.isMarioCourseActive) {
      if (this.marioFlagPole?.isFinishTriggered) {
        const time = this.clock.getElapsedTime();
        const pole = this.marioFlagPole.polePos;
        const orbitRadius = 7.5;
        const camX = pole.x + Math.sin(time * 0.9) * orbitRadius;
        const camZ = pole.z + Math.cos(time * 0.9) * orbitRadius;
        const camY = pole.y + 4.2;
        this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.08);
        this.cameraLookAt.lerp(new THREE.Vector3(pole.x, pole.y + 2.8, pole.z), 0.1);
        this.camera.lookAt(this.cameraLookAt);
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 48, 4 * delta);
        this.camera.updateProjectionMatrix();
        return;
      }

      // Interactive mouse orbit yaw, elevation pitch tilt & wheel zoom for Super Milo
      if (!this.isPointerOrbiting && (this.inputs.forward || this.inputs.backward) && Math.abs(this.currentSpeed) > 1.8) {
        this.cameraOrbitYaw = THREE.MathUtils.lerp(this.cameraOrbitYaw, 0, 0.35 * delta);
      }

      const dist = 10.35 * this.cameraDistanceScale;
      const pitch = THREE.MathUtils.clamp(this.cameraOrbitPitch, -0.4, 0.65);
      const horizDist = dist * Math.cos(pitch);
      const vertDist = (5.8 + pitch * 6.5) * this.cameraDistanceScale;

      const angle = 0.717 + this.cameraOrbitYaw; // 0.717 rad gives default (+6.8, -7.8) offset
      const offsetX = Math.sin(angle) * horizDist;
      const offsetZ = -Math.cos(angle) * horizDist;

      const targetCamPos = new THREE.Vector3(
        this.playerPos.x + offsetX,
        this.playerPos.y + Math.max(1.8, vertDist),
        this.playerPos.z + offsetZ
      );

      const targetLook = new THREE.Vector3(
        this.playerPos.x,
        this.playerPos.y + 1.8,
        this.playerPos.z
      );

      this.camera.position.lerp(targetCamPos, 0.14);
      this.cameraLookAt.lerp(targetLook, 0.12);
      this.camera.lookAt(this.cameraLookAt);
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 50, 6 * delta);
      this.camera.updateProjectionMatrix();
      return;
    }

    // 0. Cinematic Intro Fly-in Camera (Windland style POV swoop from sky down to Milo)
    if (this.isIntroCinematic) {
      if (this.inputs.forward || this.inputs.backward || this.inputs.left || this.inputs.right || this.inputs.jump) {
        this.skipIntroCinematic();
      } else {
        this.introTimer += delta;
        const progress = Math.min(1.0, this.introTimer / this.INTRO_DURATION);
        // Smoothstep cubic easing: 3*t^2 - 2*t^3
        const ease = progress * progress * (3 - 2 * progress);

        // Panoramic starting position overlooking Central Plaza & the archipelago
        const startCamPos = new THREE.Vector3(this.playerPos.x - 28, 48, this.playerPos.z + 52);
        // Ending behind Milo
        const endCamOffset = new THREE.Vector3(0, 4.4, 7.8);
        const endCamPos = new THREE.Vector3().copy(this.playerPos).add(endCamOffset);

        this.camera.position.lerpVectors(startCamPos, endCamPos, ease);

        const startLook = new THREE.Vector3(this.playerPos.x + 4, 3.0, this.playerPos.z - 12);
        const endLook = new THREE.Vector3(this.playerPos.x, this.playerPos.y + 1.6, this.playerPos.z);
        this.cameraLookAt.lerpVectors(startLook, endLook, ease);
        this.camera.lookAt(this.cameraLookAt);

        this.camera.fov = THREE.MathUtils.lerp(62, 54, ease);
        this.camera.updateProjectionMatrix();

        if (progress >= 1.0) {
          this.isIntroCinematic = false;
          this.callbacks.onCinematicUpdate?.(false);
        }
        return;
      }
    }

    // Cinematic Title Screen Orbiting Camera
    if (this.isTitleScreen) {
      const time = this.clock.getElapsedTime();
      const radius = 22;
      const camX = Math.sin(time * 0.08) * radius;
      const camZ = Math.cos(time * 0.08) * radius;
      const camY = 10.5 + Math.sin(time * 0.12) * 1.5;
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, 48, 4 * delta);
      this.camera.updateProjectionMatrix();
      this.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
      this.cameraLookAt.lerp(new THREE.Vector3(0, 3.8, 4.0), 0.05);
      this.camera.lookAt(this.cameraLookAt);
      return;
    }

    // Default Gameplay Follow Cam (Land vs Swimming POV with Interactive Mouse Orbit / Zoom)
    const targetFov = this.isBoosting ? 64 : (this.onWater ? 58 : 54);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 6 * delta);
    this.camera.updateProjectionMatrix();

    // Smoothly ease camera back behind player when running if not actively dragging
    if (!this.isPointerOrbiting && (this.inputs.forward || this.inputs.right || this.inputs.left) && Math.abs(this.currentSpeed) > 2.0) {
      this.cameraOrbitYaw = THREE.MathUtils.lerp(this.cameraOrbitYaw, 0, 0.45 * delta);
    }

    // Calculate spherical camera offset around player with pitch & orbit yaw
    const pitch = THREE.MathUtils.clamp(this.cameraOrbitPitch, -0.35, 0.65);
    const baseDist = (this.onWater ? 5.2 : 7.8) * this.cameraDistanceScale;
    const baseHeight = (this.onWater ? 1.85 : 4.4) * this.cameraDistanceScale;

    const horizDist = baseDist * Math.cos(pitch);
    const vertDist = baseHeight + baseDist * Math.sin(pitch);

    const totalYaw = this.playerRotY + this.cameraOrbitYaw;
    const offset = new THREE.Vector3(
      Math.sin(totalYaw) * horizDist,
      Math.max(0.65, vertDist),
      Math.cos(totalYaw) * horizDist
    );

    const targetCamPos = new THREE.Vector3().addVectors(this.playerPos, offset);
    if (this.onWater) {
      targetCamPos.y = Math.max(0.65, targetCamPos.y);
    }
    this.camera.position.lerp(targetCamPos, 0.12);

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
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.removePointerControls();
    if (this.livingAtmosphere) {
      this.livingAtmosphere.destroy();
      this.livingAtmosphere = null;
    }
    if (this.natureManager) {
      this.natureManager.destroy();
      this.natureManager = null;
    }
    if (this.hexManager) {
      this.hexManager.dispose();
      this.hexManager = null;
    }
    if (this.buildingManager) {
      this.buildingManager.dispose();
      this.buildingManager = null;
    }
    if (this.characterManager) {
      this.characterManager.dispose();
      this.characterManager = null;
    }
    if (this.windWakerWater) {
      this.windWakerWater.dispose();
      this.windWakerWater = null;
    }
    if (this.weatherManager) {
      this.weatherManager.dispose();
      this.weatherManager = null;
    }
    this.composer.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
