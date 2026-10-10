import * as THREE from "three";
import { WorldAudio } from "./WorldAudio";

export interface NPCData {
  id: string;
  name: string;
  title: string;
  island: string;
  pos: THREE.Vector3;
  dialogue: string[];
  avatar: string;
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
}

// =============================================================================
// PROCEDURAL CANVAS TEXTURE GENERATORS (Zero Asset Downloads, Studio Quality)
// =============================================================================

function createSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#0284c7");    // Deep azure zenith
    grad.addColorStop(0.35, "#38bdf8"); // Vibrant cerulean
    grad.addColorStop(0.75, "#bae6fd"); // Soft tropical cyan
    grad.addColorStop(1.0, "#fef3c7");  // Warm golden sun horizon
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

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

function createVisorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#042f2e";
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = "#0d9488";
    ctx.lineWidth = 1.5;
    for (let x = 0; x < 256; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 128);
      ctx.stroke();
    }
    for (let y = 0; y < 128; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }

    // Glowing cute digital cat eyes
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 14;
    // Left eye (caret shape)
    ctx.beginPath();
    ctx.moveTo(50, 68);
    ctx.lineTo(75, 46);
    ctx.lineTo(100, 68);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#22d3ee";
    ctx.stroke();

    // Right eye
    ctx.beginPath();
    ctx.moveTo(156, 68);
    ctx.lineTo(181, 46);
    ctx.lineTo(206, 68);
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#22d3ee";
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

export class WorldEngine {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public audio: WorldAudio;
  public callbacks: EngineCallbacks;

  // Clock & Loop
  private clock: THREE.Clock;
  private reqId: number = 0;
  private isRunning: boolean = false;

  // Milo Character Model
  public playerGroup: THREE.Group;
  private catMeshGroup: THREE.Group;
  private jetSkiGroup: THREE.Group;
  private leftLeg: THREE.Group | null = null;
  private rightLeg: THREE.Group | null = null;
  private leftArm: THREE.Group | null = null;
  private rightArm: THREE.Group | null = null;
  private headGroup: THREE.Group | null = null;
  private earL: THREE.Mesh | null = null;
  private earR: THREE.Mesh | null = null;
  private tailGroup: THREE.Group | null = null;
  private capeMesh: THREE.Mesh | null = null;
  private jetSkiThrusters: THREE.Mesh[] = [];

  // Movement & Camera Physics
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0.4, 0);
  public playerVel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public playerRotY: number = 0;
  public currentSpeed: number = 0;
  public maxSpeed: number = 25;
  public acceleration: number = 34;
  public deceleration: number = 22;
  public turnSpeed: number = 3.2;
  public isGrounded: boolean = true;
  public onWater: boolean = false;
  public nitro: number = 100;
  public isBoosting: boolean = false;

  private walkCycle: number = 0;
  private currentTurnSpeed: number = 0;
  private currentBankZ: number = 0;
  private currentPitchX: number = 0;
  private stuntSpin: number = 0;
  private cameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.4, 0);

  // Environment Meshes
  private waterGeometry: THREE.PlaneGeometry | null = null;
  private clouds: THREE.Group[] = [];
  private foamRings: THREE.Mesh[] = [];
  private maritimeBuoys: THREE.Group[] = [];
  private lighthouseBeam: THREE.Mesh | null = null;
  private mobaCrystal: THREE.Mesh | null = null;

  // Soccer Ball
  private soccerBall: THREE.Mesh | null = null;
  private ballVel: THREE.Vector3 = new THREE.Vector3();
  private goalBox: THREE.Box3 = new THREE.Box3();

  // Collectibles & Speed Rings
  private tokens: { mesh: THREE.Mesh; collected: boolean }[] = [];
  public coinsCollected: number = 0;
  public totalCoins: number = 30;
  private speedRings: THREE.Mesh[] = [];

  // Water Wake Particles
  private wakeParticles: THREE.Points | null = null;
  private wakePositions: Float32Array | null = null;
  private nextWakeIdx: number = 0;

  // Animated NPC mesh references
  private npcMeshMap: Map<string, { group: THREE.Group; head: THREE.Group; waveArm?: THREE.Group; juggledBall?: THREE.Mesh }> = new Map();

  // POIs
  public pois: IslandPOI[] = [
    { id: "hub", name: "Central Plaza", pos: new THREE.Vector3(0, 0.5, 0), desc: "The vibrant heart of the archipelago", tag: "START" },
    { id: "moba", name: "MOBA Sanctuary", pos: new THREE.Vector3(-70, 2, -65), desc: "Ancient Champions Monolith & Amethyst Crystal", tag: "ARENA" },
    { id: "br", name: "Battle Royale Outpost", pos: new THREE.Vector3(75, 2, -60), desc: "Coastal Lighthouse, Airdrop & Stunt Ramps", tag: "SURVIVAL" },
    { id: "voxel", name: "Voxel Sandbox Bay", pos: new THREE.Vector3(-65, 2, 70), desc: "Terraced Cubic Hills & Pixel Palms", tag: "SANDBOX" },
    { id: "soccer", name: "Arcade Soccer Arena", pos: new THREE.Vector3(65, 0.5, 65), desc: "Beach Stadium, Bleachers & Giant Ball", tag: "SPORTS" },
  ];

  // NPCs
  public npcs: NPCData[] = [
    {
      id: "lexa",
      name: "Lexa the Explorer",
      title: "Archipelago Navigator",
      island: "Central Plaza",
      pos: new THREE.Vector3(6, 4.4, 5),
      avatar: "🧭",
      dialogue: [
        "Hi Milo! Welcome to the Coastal Gaming Archipelago!",
        "Every island represents a gaming realm: MOBA, Battle Royale, Voxel Sandbox, and Beach Soccer.",
        "Take the Cyber Jet Ski out onto the waves, collect tokens, and score a world-class goal!"
      ],
    },
    {
      id: "valen",
      name: "Valen the Knight",
      title: "MOBA Grandmaster",
      island: "MOBA Sanctuary",
      pos: new THREE.Vector3(-66, 1.8, -60),
      avatar: "⚔️",
      dialogue: [
        "Greetings, young traveler! You stand before the Monolith of Ancients.",
        "The floating amethyst crystal radiates energy from legendary victories.",
        "Precision timing and seamless lane rotation win every battle!"
      ],
    },
    {
      id: "jax",
      name: "Jax the Ranger",
      title: "Survival Outpost Ace",
      island: "Battle Royale Outpost",
      pos: new THREE.Vector3(70, 1.8, -55),
      avatar: "🪂",
      dialogue: [
        "Heads up! A legendary airdrop crate just landed by the lighthouse cliff.",
        "Hit the wooden ramp at full nitro speed to launch an epic stunt over the bay!",
        "Keep moving fast — victory favors the bold!"
      ],
    },
    {
      id: "leo",
      name: "Striker Leo",
      title: "Beach Stadium Champion",
      island: "Arcade Soccer Arena",
      pos: new THREE.Vector3(60, 1.2, 58),
      avatar: "⚽",
      dialogue: [
        "Hey Milo! Welcome to the Arcade Beach Stadium!",
        "Think you can score on me? Ram your jet ski or run into the giant football towards the net!",
        "Give it your best strike and let the crowd cheer!"
      ],
    },
  ];

  public activeProximityNPC: NPCData | null = null;
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

    // 1. Scene & Coastal Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7dd3fc);
    this.scene.fog = new THREE.FogExp2(0xbae6fd, 0.0035);

    // 2. Camera (Coastal World signature isometric-perspective)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(54, aspect, 0.1, 900);
    this.camera.position.set(0, 8, 14);

    // 3. Renderer with Soft Shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting & Environment
    this.setupLighting();
    this.buildSkyDome();
    this.buildOcean();
    this.buildArchipelago();

    // 5. Milo Character & Cyber Jet Ski
    this.playerGroup = new THREE.Group();
    this.catMeshGroup = this.buildMiloAvatar();
    this.jetSkiGroup = this.buildJetSki();
    this.playerGroup.add(this.catMeshGroup);
    this.playerGroup.add(this.jetSkiGroup);
    this.scene.add(this.playerGroup);

    // 6. Spawn Collectibles, Soccer Stadium & Animated NPCs
    this.spawnTokens();
    this.spawnSpeedRings();
    this.spawnSoccerArena();
    this.spawnAnimatedNPCs();
    this.setupWakeParticles();

    // 7. Event Listeners
    window.addEventListener("resize", this.onWindowResize);

    // 8. Start Loop
    this.isRunning = true;
    this.animate();
  }

  // =========================================================================
  // LIGHTING & SKY DOME
  // =========================================================================
  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x99f6e4, 0.65);
    hemiLight.position.set(0, 60, 0);
    this.scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfffbeb, 1.35);
    sun.position.set(80, 110, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 320;
    sun.shadow.camera.left = -130;
    sun.shadow.camera.right = 130;
    sun.shadow.camera.top = 130;
    sun.shadow.camera.bottom = -130;
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);
  }

  private buildSkyDome() {
    const skyTex = createSkyTexture();
    const skyGeo = new THREE.SphereGeometry(380, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(skyGeo, skyMat));

    // Low-poly drifting clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
    });

    const cloudPositions: [number, number, number][] = [
      [-120, 80, -90],
      [90, 85, -120],
      [-100, 75, 100],
      [120, 90, 80],
      [0, 95, 0],
      [-50, 85, -150],
      [60, 80, 130],
    ];

    cloudPositions.forEach(([cx, cy, cz]) => {
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
    this.waterGeometry = new THREE.PlaneGeometry(420, 420, 72, 72);
    this.waterGeometry.rotateX(-Math.PI / 2);

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.14,
      metalness: 0.35,
      flatShading: true,
    });

    const waterMesh = new THREE.Mesh(this.waterGeometry, waterMat);
    waterMesh.position.y = 0;
    waterMesh.receiveShadow = true;
    this.scene.add(waterMesh);

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
    });
  }

  private createShorelineFoam(center: THREE.Vector3, radius: number) {
    const foamGeo = new THREE.RingGeometry(radius * 0.92, radius * 1.28, 36);
    foamGeo.rotateX(-Math.PI / 2);
    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
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
      height: 3.8,
      sandColor: 0xfef08a,
      grassColor: 0x4ade80,
    });
    this.addHubProps(new THREE.Vector3(0, 0, 0));

    // 2. MOBA Sanctuary (NW)
    this.createOrganicIsland({
      center: new THREE.Vector3(-70, 0, -65),
      radius: 25,
      height: 5.8,
      sandColor: 0xfde047,
      grassColor: 0x38bdf8,
    });
    this.addMOBAProps(new THREE.Vector3(-70, 0, -65));

    // 3. Battle Royale Outpost (NE)
    this.createOrganicIsland({
      center: new THREE.Vector3(75, 0, -60),
      radius: 26,
      height: 6.2,
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
      height: 2.2,
      sandColor: 0xfef08a,
      grassColor: 0x22c55e,
    });
    this.addSoccerStadiumProps(new THREE.Vector3(65, 0, 65));
  }

  private createOrganicIsland(cfg: { center: THREE.Vector3; radius: number; height: number; sandColor: number; grassColor: number }) {
    this.createShorelineFoam(cfg.center, cfg.radius);

    // Gently sloping sand beach shelf
    const sandGeo = new THREE.CylinderGeometry(cfg.radius * 0.92, cfg.radius * 1.3, 2.6, 28);
    const sandMat = new THREE.MeshStandardMaterial({ color: cfg.sandColor, roughness: 0.9, flatShading: true });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.set(cfg.center.x, 0.4, cfg.center.z);
    sandMesh.receiveShadow = true;
    this.scene.add(sandMesh);

    // Green plateau with natural terrace
    const hillGeo = new THREE.CylinderGeometry(cfg.radius * 0.74, cfg.radius * 0.94, cfg.height, 24);
    const hillMat = new THREE.MeshStandardMaterial({ color: cfg.grassColor, roughness: 0.8, flatShading: true });
    const hillMesh = new THREE.Mesh(hillGeo, hillMat);
    hillMesh.position.set(cfg.center.x, cfg.height / 2 + 0.8, cfg.center.z);
    hillMesh.castShadow = true;
    hillMesh.receiveShadow = true;
    this.scene.add(hillMesh);

    // Coastal Palm Groves & Rocks
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const dist = cfg.radius * 0.76;
      const x = cfg.center.x + Math.cos(angle) * dist;
      const z = cfg.center.z + Math.sin(angle) * dist;
      this.createPalmTree(x, z, cfg.height + 0.8);
      if (i % 2 === 0) {
        this.createBeachRock(x + 2.5, z - 2.5, 0.3);
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

    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65, flatShading: true });
    for (let j = 0; j < 5; j++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.4, 5), leavesMat);
      leaf.position.set(x, y + 4.0, z);
      leaf.rotation.z = Math.PI / 3.2;
      leaf.rotation.y = (j / 5) * Math.PI * 2;
      leaf.castShadow = true;
      this.scene.add(leaf);
    }

    // Coconut clusters
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

    // Beach lounger chair next to umbrella
    const chairMat = new THREE.MeshStandardMaterial({ color: colorB, roughness: 0.7 });
    const chair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 1.8), chairMat);
    chair.position.set(x + 1.2, y + 0.15, z);
    chair.rotation.y = 0.3;
    chair.castShadow = true;
    this.scene.add(chair);
  }

  private createWoodenPier(start: THREE.Vector3, rotY: number, length: number = 8) {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    // Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.2, length), woodMat);
    deck.position.set(start.x, 0.7, start.z);
    deck.rotation.y = rotY;
    deck.castShadow = true;
    deck.receiveShadow = true;
    this.scene.add(deck);

    // Mooring Posts
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
    // Stone Plaza & Golden Trophy
    const plaza = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.2, 28), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 }));
    plaza.position.set(center.x, 4.65, center.z);
    this.scene.add(plaza);

    const trophy = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 0.45, 2.8, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.15 }));
    trophy.position.set(center.x, 6.1, center.z);
    trophy.castShadow = true;
    this.scene.add(trophy);

    // Wooden boat dock extending into North water
    this.createWoodenPier(new THREE.Vector3(0, 0, -28), 0, 10);

    // Beach Umbrellas & Loungers on South Beach
    this.createBeachUmbrella(center.x - 12, center.z + 18, 0.4, 0xf43f5e, 0x38bdf8);
    this.createBeachUmbrella(center.x + 12, center.z + 18, 0.4, 0x06b6d4, 0xfbbf24);

    // Stunt Jump Ramps
    this.createRamp(new THREE.Vector3(-24, 0, 0), Math.PI / 2);
    this.createRamp(new THREE.Vector3(24, 0, 0), -Math.PI / 2);
  }

  private addMOBAProps(center: THREE.Vector3) {
    // Giant Mythic Monolith Blade
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 15, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5, metalness: 0.9, roughness: 0.1 })
    );
    blade.position.set(center.x, 10.5, center.z);
    blade.rotation.z = 0.15;
    blade.castShadow = true;
    this.scene.add(blade);

    // Floating Orbiting Amethyst Power Crystal
    this.mobaCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.4, 0),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 0.8, metalness: 0.8, roughness: 0.1 })
    );
    this.mobaCrystal.position.set(center.x + 8, 8.5, center.z + 6);
    this.mobaCrystal.castShadow = true;
    this.scene.add(this.mobaCrystal);

    // Ancient Ruin Pillars
    const ruinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    for (let p = 0; p < 4; p++) {
      const angle = (p / 4) * Math.PI * 2;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 4.5, 8), ruinMat);
      pillar.position.set(center.x + Math.cos(angle) * 12, 7.5, center.z + Math.sin(angle) * 12);
      pillar.castShadow = true;
      this.scene.add(pillar);
    }
  }

  private addBRProps(center: THREE.Vector3) {
    // Coastal Lighthouse (Red-and-white banded tower)
    const lhBase = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.0, 14, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }));
    lhBase.position.set(center.x - 8, 14, center.z - 8);
    lhBase.castShadow = true;
    this.scene.add(lhBase);

    // Red bands
    const redBand = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 3.5, 16), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 }));
    redBand.position.set(center.x - 8, 14, center.z - 8);
    this.scene.add(redBand);

    // Lighthouse Lantern & Rotating Searchlight Beam
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.0, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
    lantern.position.set(center.x - 8, 22, center.z - 8);
    this.scene.add(lantern);

    const beamMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });
    this.lighthouseBeam = new THREE.Mesh(new THREE.ConeGeometry(8, 35, 12, 1, true), beamMat);
    this.lighthouseBeam.position.set(center.x - 8, 22, center.z - 8);
    this.lighthouseBeam.rotation.x = Math.PI / 2;
    this.scene.add(this.lighthouseBeam);

    // Red Airdrop Crate with Cargo Webbing & Parachute
    const crate = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.5, 3.5), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 }));
    crate.position.set(center.x + 6, 8.8, center.z + 6);
    crate.castShadow = true;
    this.scene.add(crate);

    const chute = new THREE.Mesh(new THREE.ConeGeometry(5.5, 2.8, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide }));
    chute.position.set(center.x + 6, 13.5, center.z + 6);
    this.scene.add(chute);

    // Stunt launch ramp into ocean
    this.createRamp(new THREE.Vector3(center.x - 18, 0, center.z + 8), -Math.PI / 4);
  }

  private createVoxelIsland(center: THREE.Vector3) {
    this.createShorelineFoam(center, 22);

    const voxelMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9, flatShading: true });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, flatShading: true });

    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        const dist = Math.hypot(x, z);
        if (dist > 4.2) continue;
        const h = Math.max(1, 4 - Math.floor(dist * 0.8));
        const box = new THREE.Mesh(new THREE.BoxGeometry(4.5, h * 1.5, 4.5), dist > 2 ? stoneMat : voxelMat);
        box.position.set(center.x + x * 4.6, (h * 1.5) / 2 + 0.2, center.z + z * 4.6);
        box.castShadow = true;
        box.receiveShadow = true;
        this.scene.add(box);
      }
    }
  }

  private addSoccerStadiumProps(center: THREE.Vector3) {
    // Green Turf Pitch
    const pitch = new THREE.Mesh(new THREE.BoxGeometry(22, 0.15, 32), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
    pitch.position.set(center.x, 2.3, center.z);
    pitch.receiveShadow = true;
    this.scene.add(pitch);

    // Chalk line markings
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const centerLine = new THREE.Mesh(new THREE.BoxGeometry(21, 0.18, 0.3), lineMat);
    centerLine.position.set(center.x, 2.32, center.z);
    this.scene.add(centerLine);

    // Bleachers / Spectator Benches
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    for (let b = 0; b < 3; b++) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6 * (b + 1), 24), benchMat);
      bench.position.set(center.x - 13 - b * 2.2, 2.3 + (0.6 * (b + 1)) / 2, center.z);
      bench.castShadow = true;
      this.scene.add(bench);
    }
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
  // CHIBI MILO THE CAT AVATAR & CYBER JET SKI
  // =========================================================================
  private buildMiloAvatar(): THREE.Group {
    const cat = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.65 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.15 });
    const capeMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, side: THREE.DoubleSide });

    const visorTex = createVisorTexture();
    const visorMat = new THREE.MeshStandardMaterial({
      map: visorTex,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.65,
      metalness: 0.7,
      roughness: 0.2,
    });

    // 1. Torso
    const torso = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.54, 1.05, 16), furMat);
    body.position.y = 1.05;
    body.castShadow = true;
    torso.add(body);

    const belly = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.7, 0.22), whiteMat);
    belly.position.set(0, 1.0, 0.44);
    torso.add(belly);

    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.14, 16), beltMat);
    belt.position.y = 0.65;
    torso.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.1), goldMat);
    buckle.position.set(0, 0.65, 0.54);
    torso.add(buckle);
    cat.add(torso);

    // 2. Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.85, 0);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.56, 22, 22), furMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Cute chubby cheeks
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), whiteMat);
    cheekL.position.set(-0.25, -0.12, 0.35);
    this.headGroup.add(cheekL);

    const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), whiteMat);
    cheekR.position.set(0.25, -0.12, 0.35);
    this.headGroup.add(cheekR);

    // Muzzle & Pink Nose
    const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), whiteMat);
    muzzle.position.set(0, -0.1, 0.42);
    muzzle.scale.set(1.1, 0.7, 0.8);
    this.headGroup.add(muzzle);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.08, 4), pinkMat);
    nose.position.set(0, -0.05, 0.58);
    nose.rotation.x = Math.PI / 2;
    this.headGroup.add(nose);

    // Ears
    const earLGroup = new THREE.Group();
    earLGroup.position.set(-0.32, 0.46, 0);
    earLGroup.rotation.z = 0.25;
    this.earL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.38, 5), furMat);
    const innerL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 4), pinkMat);
    innerL.position.set(0, -0.02, 0.06);
    earLGroup.add(this.earL);
    earLGroup.add(innerL);
    this.headGroup.add(earLGroup);

    const earRGroup = new THREE.Group();
    earRGroup.position.set(0.32, 0.46, 0);
    earRGroup.rotation.z = -0.25;
    this.earR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.38, 5), furMat);
    const innerR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 4), pinkMat);
    innerR.position.set(0, -0.02, 0.06);
    earRGroup.add(this.earR);
    earRGroup.add(innerR);
    this.headGroup.add(earRGroup);

    // Sci-fi Visor Goggles
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.24, 0.38), visorMat);
    visor.position.set(0, 0.04, 0.44);
    this.headGroup.add(visor);
    cat.add(this.headGroup);

    // 3. Articulated Legs
    const legGeo = new THREE.CylinderGeometry(0.14, 0.13, 0.65, 12);
    const pawGeo = new THREE.SphereGeometry(0.17, 12, 12);

    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.25, 0.65, 0);
    const legMeshL = new THREE.Mesh(legGeo, furMat);
    legMeshL.position.y = -0.3;
    legMeshL.castShadow = true;
    this.leftLeg.add(legMeshL);

    const pawL = new THREE.Mesh(pawGeo, whiteMat);
    pawL.position.set(0, -0.6, 0.06);
    pawL.scale.set(1.0, 0.7, 1.2);
    this.leftLeg.add(pawL);
    cat.add(this.leftLeg);

    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.25, 0.65, 0);
    const legMeshR = new THREE.Mesh(legGeo, furMat);
    legMeshR.position.y = -0.3;
    legMeshR.castShadow = true;
    this.rightLeg.add(legMeshR);

    const pawR = new THREE.Mesh(pawGeo, whiteMat);
    pawR.position.set(0, -0.6, 0.06);
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
    handPawL.position.set(0, -0.55, 0.04);
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
    handPawR.position.set(0, -0.55, 0.04);
    handPawR.scale.set(0.9, 0.7, 1.0);
    this.rightArm.add(handPawR);
    cat.add(this.rightArm);

    // 5. Hero Cape
    this.capeMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.35, 6, 6), capeMat);
    this.capeMesh.position.set(0, 1.35, -0.48);
    this.capeMesh.rotation.x = 0.2;
    cat.add(this.capeMesh);

    // 6. Tail (Fluid S-Curve Wag)
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.75, -0.48);

    const tailBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.45, 8), furMat);
    tailBase.position.set(0, 0.1, -0.15);
    tailBase.rotation.x = -0.8;
    this.tailGroup.add(tailBase);

    const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), whiteMat);
    tailTip.position.set(0, 0.25, -0.35);
    this.tailGroup.add(tailTip);
    cat.add(this.tailGroup);

    return cat;
  }

  private buildJetSki(): THREE.Group {
    const ski = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.85 });
    const cyanNeonMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.85,
      roughness: 0.1,
    });
    const orangeNeonMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.95,
    });

    // Sleek Hydrodynamic Hull
    const hullGeo = new THREE.ConeGeometry(1.25, 3.8, 6);
    hullGeo.rotateX(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.set(0, 0.32, 0.2);
    hull.scale.set(1.05, 0.44, 1.0);
    hull.castShadow = true;
    ski.add(hull);

    // Aerodynamic Windshield
    const shield = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.42, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.85 })
    );
    shield.position.set(0, 0.68, 0.6);
    shield.rotation.x = -0.42;
    ski.add(shield);

    // Handlebars
    const bar = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.1, 0.1), cyanNeonMat);
    bar.position.set(0, 0.84, 0.55);
    ski.add(bar);

    // Twin Neon Side Runners
    const neonGeo = new THREE.BoxGeometry(0.12, 0.14, 2.9);
    const neonL = new THREE.Mesh(neonGeo, cyanNeonMat);
    neonL.position.set(-0.95, 0.38, -0.1);
    ski.add(neonL);

    const neonR = new THREE.Mesh(neonGeo, cyanNeonMat);
    neonR.position.set(0.95, 0.38, -0.1);
    ski.add(neonR);

    // Dual Exhaust Ports with Nitro Thruster Flames
    const exhaustGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.45, 8);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaustL = new THREE.Mesh(exhaustGeo, hullMat);
    exhaustL.position.set(-0.45, 0.32, -1.6);
    ski.add(exhaustL);

    const exhaustR = new THREE.Mesh(exhaustGeo, hullMat);
    exhaustR.position.set(0.45, 0.32, -1.6);
    ski.add(exhaustR);

    const flameGeo = new THREE.ConeGeometry(0.16, 0.85, 6);
    flameGeo.rotateX(-Math.PI / 2);
    const flameL = new THREE.Mesh(flameGeo, orangeNeonMat);
    flameL.position.set(-0.45, 0.32, -2.0);
    flameL.visible = false;
    ski.add(flameL);

    const flameR = new THREE.Mesh(flameGeo, orangeNeonMat);
    flameR.position.set(0.45, 0.32, -2.0);
    flameR.visible = false;
    ski.add(flameR);

    this.jetSkiThrusters = [flameL, flameR];

    ski.visible = false;
    return ski;
  }

  // =========================================================================
  // ANIMATED 3D CHIBI NPCS (Studio Quality)
  // =========================================================================
  private spawnAnimatedNPCs() {
    this.npcs.forEach((npc) => {
      const group = new THREE.Group();
      group.position.copy(npc.pos);

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

      // Head Group (for dynamic head-tracking)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.7, 0);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 14), skinMat);
      head.castShadow = true;
      headGroup.add(head);

      let waveArm: THREE.Group | undefined;
      let juggledBall: THREE.Mesh | undefined;

      if (npc.id === "lexa") {
        // Lexa: Explorer with Safari Hat & Waving Arm
        const vestMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 0.9, 12), vestMat);
        body.position.y = 0.9;
        body.castShadow = true;
        group.add(body);

        // Safari Hat
        const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.08, 16), vestMat);
        hatBrim.position.y = 0.32;
        headGroup.add(hatBrim);
        const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 0.35, 12), vestMat);
        hatCrown.position.y = 0.52;
        headGroup.add(hatCrown);

        // Backpack
        const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3), darkMat);
        backpack.position.set(0, 0.9, -0.35);
        group.add(backpack);

        // Waving Right Arm
        waveArm = new THREE.Group();
        waveArm.position.set(0.45, 1.25, 0);
        const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.55), vestMat);
        armMesh.position.y = 0.25;
        waveArm.add(armMesh);
        group.add(waveArm);
      } else if (npc.id === "valen") {
        // Valen: Mythic Knight in Silver & Cyan Armor
        const armorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.2 });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.95, 12), armorMat);
        body.position.y = 0.92;
        body.castShadow = true;
        group.add(body);

        // Winged Knight Helmet
        const helm = new THREE.Mesh(new THREE.SphereGeometry(0.44, 14, 14), armorMat);
        headGroup.add(helm);

        // Broadsword held in hand
        const sword = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 1.8, 0.35),
          new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0284c7, emissiveIntensity: 0.6, metalness: 0.9 })
        );
        sword.position.set(0.55, 0.9, 0.3);
        sword.rotation.z = -0.3;
        group.add(sword);
      } else if (npc.id === "jax") {
        // Jax: Survival Ace with Camo Beret & Binoculars
        const camoMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.45, 0.9, 12), camoMat);
        body.position.y = 0.9;
        body.castShadow = true;
        group.add(body);

        // Beret
        const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.45, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
        beret.position.set(0.08, 0.38, 0);
        beret.rotation.z = -0.2;
        headGroup.add(beret);

        // Binoculars
        const bino = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.25), darkMat);
        bino.position.set(0, 0.1, 0.45);
        headGroup.add(bino);
      } else if (npc.id === "leo") {
        // Leo: Striker with Jersey #10 & Juggled Soccer Ball
        const jerseyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.44, 0.9, 12), jerseyMat);
        body.position.y = 0.9;
        body.castShadow = true;
        group.add(body);

        // Headband
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.12, 14), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        band.position.y = 0.15;
        headGroup.add(band);

        // Juggled Mini Football
        juggledBall = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }));
        juggledBall.position.set(0.35, 0.4, 0.5);
        group.add(juggledBall);
      }

      group.add(headGroup);

      // Floating interactive avatar billboard above NPC
      const beacon = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.32, 0),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.9 })
      );
      beacon.position.y = 2.65;
      group.add(beacon);

      this.scene.add(group);
      this.npcMeshMap.set(npc.id, { group, head: headGroup, waveArm, juggledBall });
    });
  }

  // =========================================================================
  // COLLECTIBLES & SOCCER ARENA
  // =========================================================================
  private spawnTokens() {
    const tokenGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16);
    tokenGeo.rotateX(Math.PI / 2);
    const tokenMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.45, metalness: 0.9, roughness: 0.1 });

    const spawnCoords: [number, number, number][] = [
      [0, 5.2, -6], [0, 5.2, 6], [-6, 5.2, 0], [6, 5.2, 0],
      [-25, 1.0, -25], [-45, 1.0, -45], [25, 1.0, -25], [45, 1.0, -45],
      [-25, 1.0, 25], [-45, 1.0, 45], [25, 1.0, 25], [45, 1.0, 45],
      [-70, 4.5, -55], [-75, 4.5, -70], [-65, 4.5, -75],
      [75, 5.5, -50], [80, 5.5, -65], [70, 5.5, -75],
      [-65, 4.0, 60], [-70, 4.0, 75], [-60, 4.0, 80],
      [60, 2.2, 55], [70, 2.2, 70], [55, 2.2, 75],
      [-30, 4.0, 0], [30, 4.0, 0], [55, 4.0, -45], [0, 1.0, -40],
      [0, 1.0, 40], [-40, 1.0, 0], [40, 1.0, 0], [0, 2.0, 0]
    ];

    spawnCoords.forEach(([x, y, z]) => {
      const token = new THREE.Mesh(tokenGeo, tokenMat);
      token.position.set(x, y, z);
      token.castShadow = true;
      this.scene.add(token);
      this.tokens.push({ mesh: token, collected: false });
    });

    this.totalCoins = this.tokens.length;
  }

  private spawnSpeedRings() {
    const ringGeo = new THREE.TorusGeometry(3.2, 0.25, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.95, roughness: 0.1 });

    const ringPositions: [number, number, number, number][] = [
      [0, 1.8, -45, 0],
      [0, 1.8, 45, 0],
      [-45, 1.8, 0, Math.PI / 2],
      [45, 1.8, 0, Math.PI / 2],
    ];

    ringPositions.forEach(([x, y, z, rotY]) => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.rotation.y = rotY;
      this.scene.add(ring);
      this.speedRings.push(ring);
    });
  }

  private spawnSoccerArena() {
    const pos = new THREE.Vector3(65, 0, 65);

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.8), postMat);
    postL.position.set(pos.x - 4, 1.9, pos.z + 12);
    this.scene.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.8), postMat);
    postR.position.set(pos.x + 4, 1.9, pos.z + 12);
    this.scene.add(postR);

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 8.2), postMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(pos.x, 3.8, pos.z + 12);
    this.scene.add(crossbar);

    this.goalBox.set(
      new THREE.Vector3(pos.x - 4.5, 0, pos.z + 11.5),
      new THREE.Vector3(pos.x + 4.5, 4.2, pos.z + 15)
    );

    // Giant Interactive Soccer Ball
    const soccerTex = createSoccerBallTexture();
    const ballMat = new THREE.MeshStandardMaterial({ map: soccerTex, roughness: 0.35, metalness: 0.1 });
    this.soccerBall = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), ballMat);
    this.soccerBall.position.set(pos.x, 1.6, pos.z);
    this.soccerBall.castShadow = true;
    this.scene.add(this.soccerBall);
  }

  private setupWakeParticles() {
    const count = 80;
    const geo = new THREE.BufferGeometry();
    this.wakePositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      this.wakePositions[i * 3 + 1] = -100;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(this.wakePositions, 3));
    this.wakeParticles = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.8, transparent: true, opacity: 0.7 })
    );
    this.scene.add(this.wakeParticles);
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
    this.updateCameraFollow(delta);
    this.checkLocationAndProximity();

    this.renderer.render(this.scene, this.camera);
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
    // Drifting Clouds
    this.clouds.forEach((cloud, idx) => {
      cloud.position.x += 0.04 * (idx % 2 === 0 ? 1 : -1);
      if (cloud.position.x > 180) cloud.position.x = -180;
      if (cloud.position.x < -180) cloud.position.x = 180;
    });

    // Shoreline foam pulsing
    const foamAlpha = 0.35 + Math.sin(time * 2.2) * 0.15;
    this.foamRings.forEach((foam) => {
      (foam.material as THREE.MeshBasicMaterial).opacity = foamAlpha;
    });

    // Buoys gentle bobbing on ocean waves
    this.maritimeBuoys.forEach((buoy, i) => {
      buoy.position.y = 0.2 + Math.sin(time * 3 + i) * 0.08;
      buoy.rotation.z = Math.sin(time * 2.5 + i) * 0.08;
    });

    // Lighthouse searchlight beam rotation
    if (this.lighthouseBeam) {
      this.lighthouseBeam.rotation.z = time * 0.8;
    }

    // MOBA Amethyst Crystal floating & rotation
    if (this.mobaCrystal) {
      this.mobaCrystal.position.y = 8.5 + Math.sin(time * 2.5) * 0.35;
      this.mobaCrystal.rotation.y = time * 0.7;
    }
  }

  private updateNPCBehaviors(time: number) {
    this.npcMeshMap.forEach((npcRef, npcId) => {
      // Subtle idle breathing
      npcRef.group.position.y = (this.npcs.find((n) => n.id === npcId)?.pos.y || 0) + Math.sin(time * 2.6) * 0.03;

      // Head-tracking: turn head smoothly towards player when nearby
      const distToPlayer = npcRef.group.position.distanceTo(this.playerPos);
      if (distToPlayer < 14) {
        const dir = new THREE.Vector3().subVectors(this.playerPos, npcRef.group.position).normalize();
        const targetAngle = Math.atan2(dir.x, dir.z);
        npcRef.head.rotation.y = THREE.MathUtils.lerp(npcRef.head.rotation.y, targetAngle, 0.08);
      } else {
        npcRef.head.rotation.y = THREE.MathUtils.lerp(npcRef.head.rotation.y, 0, 0.05);
      }

      // Unique NPC animations
      if (npcId === "lexa" && npcRef.waveArm) {
        if (distToPlayer < 12) {
          npcRef.waveArm.rotation.z = -1.2 + Math.sin(time * 8) * 0.45;
        } else {
          npcRef.waveArm.rotation.z = THREE.MathUtils.lerp(npcRef.waveArm.rotation.z, 0, 0.1);
        }
      }

      if (npcId === "leo" && npcRef.juggledBall) {
        npcRef.juggledBall.position.y = 0.35 + Math.abs(Math.sin(time * 6)) * 0.45;
      }
    });
  }

  private updatePlayerMovement(delta: number, time: number) {
    // 1. Silky Smooth Steering
    const targetTurn = (this.inputs.left ? 1 : 0) - (this.inputs.right ? 1 : 0);
    this.currentTurnSpeed = THREE.MathUtils.lerp(this.currentTurnSpeed, targetTurn * this.turnSpeed, 12 * delta);
    this.playerRotY += this.currentTurnSpeed * delta;

    // 2. Snappy Acceleration & Deceleration
    let targetSpeed = 0;
    if (this.inputs.forward) {
      targetSpeed = this.maxSpeed;
    } else if (this.inputs.backward) {
      targetSpeed = -this.maxSpeed * 0.4;
    }

    if (this.inputs.boost && this.nitro > 0 && this.inputs.forward) {
      targetSpeed *= 1.6;
      this.nitro = Math.max(0, this.nitro - 25 * delta);
      this.isBoosting = true;
      this.audio.playBoost();
    } else {
      this.nitro = Math.min(100, this.nitro + 12 * delta);
      this.isBoosting = false;
    }
    this.callbacks.onNitroUpdate?.(this.nitro);

    const accelRate = targetSpeed !== 0 ? (targetSpeed > this.currentSpeed ? this.acceleration : this.deceleration) : this.deceleration * 1.5;
    this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, targetSpeed, Math.min(1, accelRate * 0.25 * delta));

    // Translation
    const forwardX = -Math.sin(this.playerRotY) * this.currentSpeed;
    const forwardZ = -Math.cos(this.playerRotY) * this.currentSpeed;
    this.playerVel.x = forwardX;
    this.playerVel.z = forwardZ;

    this.playerPos.x += this.playerVel.x * delta;
    this.playerPos.z += this.playerVel.z * delta;

    this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -165, 165);
    this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -165, 165);

    // Height & Ground calculation
    const groundHeight = this.calculateGroundHeight(this.playerPos.x, this.playerPos.z);
    const waterLevel = 0.2;

    // Jump & Airborne Stunts
    if (this.inputs.jump && this.isGrounded) {
      this.playerVel.y = 13.0;
      this.isGrounded = false;
      this.stuntSpin = Math.PI * 2;
      this.audio.playJump();
    }

    if (!this.isGrounded) {
      this.playerVel.y -= 28 * delta;
      this.playerPos.y += this.playerVel.y * delta;
      if (this.stuntSpin > 0) {
        this.catMeshGroup.rotation.y += 8 * delta;
        this.stuntSpin -= 8 * delta;
      }
      if (this.playerPos.y <= groundHeight) {
        this.playerPos.y = groundHeight;
        this.playerVel.y = 0;
        this.isGrounded = true;
        this.stuntSpin = 0;
      }
    } else {
      this.playerPos.y = groundHeight;
    }

    // Water Detection
    const wasOnWater = this.onWater;
    this.onWater = groundHeight <= waterLevel + 0.1;
    if (!wasOnWater && this.onWater) {
      this.audio.playSplash();
    }

    this.jetSkiGroup.visible = this.onWater;

    // Audio & Speedometer
    this.audio.updateEngineSound(Math.abs(this.currentSpeed), this.onWater);
    this.callbacks.onSpeedUpdate?.(Math.round(Math.abs(this.currentSpeed) * 3.6));

    // Dynamic Banking Roll into turns
    const targetBank = -this.currentTurnSpeed * 0.18;
    this.currentBankZ = THREE.MathUtils.lerp(this.currentBankZ, targetBank, 10 * delta);

    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.y = this.playerRotY;
    this.playerGroup.rotation.z = this.currentBankZ;

    // =========================================================================
    // SQUASH & STRETCH ANIMATION CONTROLLER
    // =========================================================================
    const speedRatio = Math.abs(this.currentSpeed) / this.maxSpeed;

    if (this.onWater) {
      // ---------------------------------------------------------------------
      // WATER MODE: JET SKI RIDING STANCE
      // ---------------------------------------------------------------------
      this.catMeshGroup.position.y = 0.28;
      this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, 0.38, 10 * delta);
      this.catMeshGroup.rotation.y = THREE.MathUtils.lerp(this.catMeshGroup.rotation.y, 0, 10 * delta);

      if (this.leftArm) this.leftArm.rotation.x = -1.18;
      if (this.rightArm) this.rightArm.rotation.x = -1.18;
      if (this.leftLeg) this.leftLeg.rotation.x = -0.75;
      if (this.rightLeg) this.rightLeg.rotation.x = -0.75;

      // Wave pitch & jet ski bow planing
      const waveBob = Math.sin(time * 3.5 + this.playerPos.x * 0.1) * 0.06;
      this.playerPos.y = groundHeight + waveBob;

      const targetPitch = -(this.currentSpeed / this.maxSpeed) * 0.16;
      this.currentPitchX = THREE.MathUtils.lerp(this.currentPitchX, targetPitch, 8 * delta);
      this.playerGroup.rotation.x = this.currentPitchX;

      this.jetSkiThrusters.forEach((thruster) => {
        thruster.visible = this.isBoosting;
        if (this.isBoosting) {
          thruster.scale.z = 1.0 + Math.sin(time * 30) * 0.3;
        }
      });
    } else {
      // ---------------------------------------------------------------------
      // LAND MODE: SQUASH & STRETCH NATURAL RUN CYCLE
      // ---------------------------------------------------------------------
      this.playerGroup.rotation.x = THREE.MathUtils.lerp(this.playerGroup.rotation.x, 0, 10 * delta);

      if (!this.isGrounded) {
        // Airborne hero flight pose
        if (this.leftLeg) this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, -0.45, 12 * delta);
        if (this.rightLeg) this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, -0.35, 12 * delta);
        if (this.leftArm) this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.7, 12 * delta);
        if (this.rightArm) this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0.7, 12 * delta);
        this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, -0.15, 10 * delta);
        this.catMeshGroup.scale.set(0.92, 1.12, 0.92); // Stretch in air
      } else if (speedRatio > 0.05) {
        // Natural bouncy run stride with squash and stretch
        this.walkCycle += Math.abs(this.currentSpeed) * 1.55 * delta;

        const legSwing = Math.sin(this.walkCycle) * (0.6 + speedRatio * 0.35);
        const armSwing = -Math.sin(this.walkCycle) * (0.5 + speedRatio * 0.35);

        if (this.leftLeg) this.leftLeg.rotation.x = legSwing;
        if (this.rightLeg) this.rightLeg.rotation.x = -legSwing;
        if (this.leftArm) this.leftArm.rotation.x = armSwing;
        if (this.rightArm) this.rightArm.rotation.x = -armSwing;

        const bounce = Math.abs(Math.sin(this.walkCycle)) * 0.14;
        this.catMeshGroup.position.y = bounce;

        // Cute squash and stretch
        const squash = Math.sin(this.walkCycle * 2) * 0.06;
        this.catMeshGroup.scale.set(1.0 + squash, 1.0 - squash, 1.0 + squash);

        const targetLean = Math.min(0.28, speedRatio * 0.25);
        this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, targetLean, 10 * delta);
        this.catMeshGroup.rotation.y = Math.sin(this.walkCycle * 0.5) * 0.08;
      } else {
        // Idle breathing & tail wag
        if (this.leftLeg) this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, 10 * delta);
        if (this.rightLeg) this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, 10 * delta);
        if (this.leftArm) this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.1, 10 * delta);
        if (this.rightArm) this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0.1, 10 * delta);

        const breath = Math.sin(time * 2.8) * 0.035;
        this.catMeshGroup.position.y = breath;
        this.catMeshGroup.scale.set(1.0, 1.0, 1.0);
        this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, 0, 10 * delta);
        this.catMeshGroup.rotation.y = THREE.MathUtils.lerp(this.catMeshGroup.rotation.y, 0, 10 * delta);

        if (this.earL) this.earL.rotation.z = 0.25 + Math.sin(time * 2.0) * 0.06;
        if (this.earR) this.earR.rotation.z = -0.25 - Math.sin(time * 2.5) * 0.06;
      }
    }

    // Cape flutter
    if (this.capeMesh) {
      const flutter = Math.sin(time * 12 + this.walkCycle) * 0.15;
      this.capeMesh.rotation.x = 0.22 + speedRatio * 0.95 + flutter;
    }

    // Tail fluid wag
    if (this.tailGroup) {
      this.tailGroup.rotation.z = Math.sin(time * 4.5 + this.walkCycle) * 0.35;
      this.tailGroup.rotation.x = -0.6 + speedRatio * 0.5;
    }

    // Wake Particles on Water
    if (this.onWater && Math.abs(this.currentSpeed) > 3 && this.wakePositions) {
      this.wakePositions[this.nextWakeIdx * 3] = this.playerPos.x;
      this.wakePositions[this.nextWakeIdx * 3 + 1] = 0.1;
      this.wakePositions[this.nextWakeIdx * 3 + 2] = this.playerPos.z;
      this.nextWakeIdx = (this.nextWakeIdx + 1) % 80;
      if (this.wakeParticles) {
        this.wakeParticles.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  private calculateGroundHeight(x: number, z: number): number {
    const islands = [
      { x: 0, z: 0, r: 28, h: 4.6 },
      { x: -70, z: -65, r: 25, h: 6.4 },
      { x: 75, z: -60, r: 26, h: 6.8 },
      { x: -65, z: 70, r: 22, h: 4.8 },
      { x: 65, z: 65, r: 27, h: 3.0 },
    ];

    for (const isl of islands) {
      const dist = Math.hypot(x - isl.x, z - isl.z);
      if (dist < isl.r) {
        const factor = (1 - dist / isl.r);
        return 0.4 + factor * (isl.h - 0.4);
      }
    }
    return 0.2; // Sea level
  }

  private updateCollectibles(time: number) {
    this.tokens.forEach((t) => {
      if (t.collected) return;
      t.mesh.rotation.z = time * 2.5;

      const dist = this.playerPos.distanceTo(t.mesh.position);
      if (dist < 2.4) {
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
    if (dist < 3.2) {
      const pushDir = new THREE.Vector3().subVectors(this.soccerBall.position, this.playerPos).normalize();
      const impulse = Math.max(Math.abs(this.currentSpeed) * 1.25, 15);
      this.ballVel.x = pushDir.x * impulse;
      this.ballVel.z = pushDir.z * impulse;
      this.ballVel.y = 4.8;
      this.audio.playKick();
    }

    this.soccerBall.position.x += this.ballVel.x * delta;
    this.soccerBall.position.z += this.ballVel.z * delta;
    this.soccerBall.position.y += this.ballVel.y * delta;

    this.soccerBall.rotation.x += this.ballVel.z * delta * 0.8;
    this.soccerBall.rotation.z -= this.ballVel.x * delta * 0.8;

    if (this.soccerBall.position.y > 1.6) {
      this.ballVel.y -= 18 * delta;
    } else {
      this.soccerBall.position.y = 1.6;
      if (Math.abs(this.ballVel.y) > 1.5) {
        this.ballVel.y = -this.ballVel.y * 0.6;
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
          this.soccerBall.position.set(65, 1.6, 65);
          this.ballVel.set(0, 0, 0);
        }
      }, 3500);
    }
  }

  private updateCameraFollow(delta: number) {
    const targetFov = this.isBoosting ? 68 : 54;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 6 * delta);
    this.camera.updateProjectionMatrix();

    // Coastal World smooth isometric third-person follow
    const offset = new THREE.Vector3(0, 5.2, 9.5);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY);

    const targetCamPos = new THREE.Vector3().addVectors(this.playerPos, offset);
    this.camera.position.lerp(targetCamPos, 0.065);

    const lookTarget = new THREE.Vector3().copy(this.playerPos).add(new THREE.Vector3(0, 1.5, 0));
    this.cameraLookAt.lerp(lookTarget, 0.085);
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
      this.playerPos.y += 1.0;
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
  };

  public dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.reqId);
    window.removeEventListener("resize", this.onWindowResize);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
