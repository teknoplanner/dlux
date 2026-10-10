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
// PROCEDURAL CANVAS TEXTURE HELPERS (Zero-Asset Lightweight Generators)
// =============================================================================

function createSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#0284c7");    // Deep azure zenith
    grad.addColorStop(0.45, "#38bdf8"); // Cerulean
    grad.addColorStop(0.85, "#bae6fd"); // Soft tropical cyan
    grad.addColorStop(1.0, "#fef08a");  // Warm golden sun horizon
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 512);
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
    const r = 22;
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
    ctx.lineWidth = 2.5;
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

    // Digital cyber grid
    ctx.strokeStyle = "#0d9488";
    ctx.lineWidth = 1;
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

    // Glowing cyan visor eyes/reticle
    ctx.fillStyle = "#22d3ee";
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 12;
    ctx.fillRect(52, 46, 40, 16);
    ctx.fillRect(164, 46, 40, 16);
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

  // Loop & Clock
  private clock: THREE.Clock;
  private reqId: number = 0;
  private isRunning: boolean = false;

  // Player & Jet Ski
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

  // Player Physics & Smoothing
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0.4, 0);
  public playerVel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public playerRotY: number = 0;
  public currentSpeed: number = 0;
  public maxSpeed: number = 24;
  public acceleration: number = 32;
  public deceleration: number = 20;
  public turnSpeed: number = 3.0;
  public isGrounded: boolean = true;
  public onWater: boolean = false;
  public nitro: number = 100;
  public isBoosting: boolean = false;

  private walkCycle: number = 0;
  private currentTurnSpeed: number = 0;
  private currentBankZ: number = 0;
  private currentPitchX: number = 0;
  private cameraLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.4, 0);

  // Ocean & Atmosphere
  private waterMesh: THREE.Mesh | null = null;
  private waterGeometry: THREE.PlaneGeometry | null = null;
  private clouds: THREE.Group[] = [];
  private foamRings: THREE.Mesh[] = [];

  // Soccer Ball & Goal
  private soccerBall: THREE.Mesh | null = null;
  private ballVel: THREE.Vector3 = new THREE.Vector3();
  private goalBox: THREE.Box3 = new THREE.Box3();

  // Collectibles
  private tokens: { mesh: THREE.Mesh; collected: boolean }[] = [];
  public coinsCollected: number = 0;
  public totalCoins: number = 30;

  // Speed Rings
  private speedRings: THREE.Mesh[] = [];

  // Wake & Dust Particles
  private wakeParticles: THREE.Points | null = null;
  private wakePositions: Float32Array | null = null;
  private nextWakeIdx: number = 0;

  // Islands & POIs
  public pois: IslandPOI[] = [
    { id: "hub", name: "Central Plaza", pos: new THREE.Vector3(0, 0.5, 0), desc: "The heart of the archipelago", tag: "START" },
    { id: "moba", name: "MOBA Sanctuary", pos: new THREE.Vector3(-70, 2, -65), desc: "Monuments of Legendary Champions", tag: "ARENA" },
    { id: "br", name: "Battle Royale Outpost", pos: new THREE.Vector3(75, 2, -60), desc: "Airdrops, Bunkers & Stunt Ramps", tag: "SURVIVAL" },
    { id: "voxel", name: "Voxel Sandbox Bay", pos: new THREE.Vector3(-65, 2, 70), desc: "Pixel Blocks & Creative Cubes", tag: "SANDBOX" },
    { id: "soccer", name: "Arcade Soccer Arena", pos: new THREE.Vector3(65, 0.5, 65), desc: "Floating Goalposts & Giant Football", tag: "SPORTS" },
  ];

  // NPCs
  public npcs: NPCData[] = [
    {
      id: "valen",
      name: "Valen the Knight",
      title: "MOBA Grandmaster",
      island: "MOBA Sanctuary",
      pos: new THREE.Vector3(-66, 1.8, -60),
      avatar: "⚔️",
      dialogue: [
        "Welcome to the MOBA Sanctuary, traveler!",
        "Behold the Sacred Blade of the Ancients, forged in victory.",
        "To become a legend, master your lane rotation and timing!"
      ],
    },
    {
      id: "jax",
      name: "Jax the Commando",
      title: "Battle Royale Ace",
      island: "Battle Royale Outpost",
      pos: new THREE.Vector3(70, 1.8, -55),
      avatar: "🪂",
      dialogue: [
        "Heads up! Airdrop crate just touched down on the cliff.",
        "Take the wooden ramp at full nitro speed to launch over the bay!",
        "Keep moving — the storm waits for no one!"
      ],
    },
    {
      id: "blocky",
      name: "Blocky the Crafter",
      title: "Voxel Master Builder",
      island: "Voxel Sandbox Bay",
      pos: new THREE.Vector3(-60, 2.0, 65),
      avatar: "🟩",
      dialogue: [
        "Greetings, fellow adventurer! Everything here is built block by block.",
        "Did you collect all the 8-bit golden tokens hidden in the cubic trees?",
        "Remember: with creativity, you can build entire worlds!"
      ],
    },
    {
      id: "leo",
      name: "Striker Leo",
      title: "Soccer Bay Champion",
      island: "Arcade Soccer Arena",
      pos: new THREE.Vector3(60, 1.2, 58),
      avatar: "⚽",
      dialogue: [
        "Hey! Welcome to the Soccer Arena bay!",
        "Think you can score? Ram your jet ski into the giant ball towards the goal net!",
        "Give it a try and show us your world-class strike!"
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

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7dd3fc);
    this.scene.fog = new THREE.FogExp2(0xbae6fd, 0.0035);

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(58, aspect, 0.1, 800);
    this.camera.position.set(0, 6, 10);

    // 3. Renderer setup
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

    // 5. Build Milo Avatar & Cyber Jet Ski
    this.playerGroup = new THREE.Group();
    this.catMeshGroup = this.buildMiloAvatar();
    this.jetSkiGroup = this.buildJetSki();
    this.playerGroup.add(this.catMeshGroup);
    this.playerGroup.add(this.jetSkiGroup);
    this.scene.add(this.playerGroup);

    // 6. Spawn Collectibles, Soccer Ball & NPCs
    this.spawnTokens();
    this.spawnSpeedRings();
    this.spawnSoccerArena();
    this.spawnNPCMeshes();
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x0369a1, 0.55);
    hemiLight.position.set(0, 60, 0);
    this.scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sun.position.set(70, 95, 55);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 300;
    sun.shadow.camera.left = -120;
    sun.shadow.camera.right = 120;
    sun.shadow.camera.top = 120;
    sun.shadow.camera.bottom = -120;
    this.scene.add(sun);
  }

  private buildSkyDome() {
    // Sky Dome Sphere
    const skyTex = createSkyTexture();
    const skyGeo = new THREE.SphereGeometry(360, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(skyDome);

    // Stylized Low-Poly Drifting Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });

    const cloudCoords: [number, number, number][] = [
      [-120, 75, -80],
      [80, 80, -110],
      [-90, 70, 90],
      [110, 85, 70],
      [0, 90, 0],
      [-40, 82, -140],
      [50, 78, 120],
    ];

    cloudCoords.forEach(([cx, cy, cz]) => {
      const cloud = new THREE.Group();
      cloud.position.set(cx, cy, cz);
      for (let i = 0; i < 5; i++) {
        const puffGeo = new THREE.DodecahedronGeometry(5.5 + (i % 3) * 2, 1);
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set((i - 2) * 5.2, ((i % 2) - 0.5) * 2, ((i % 3) - 1) * 3);
        cloud.add(puff);
      }
      this.scene.add(cloud);
      this.clouds.push(cloud);
    });
  }

  // =========================================================================
  // PROCEDURAL OCEAN & SHORELINE FOAM
  // =========================================================================
  private buildOcean() {
    this.waterGeometry = new THREE.PlaneGeometry(380, 380, 64, 64);
    this.waterGeometry.rotateX(-Math.PI / 2);

    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.12,
      metalness: 0.35,
      flatShading: true,
    });

    this.waterMesh = new THREE.Mesh(this.waterGeometry, waterMaterial);
    this.waterMesh.position.y = 0;
    this.waterMesh.receiveShadow = true;
    this.scene.add(this.waterMesh);
  }

  private createShorelineFoam(center: THREE.Vector3, radius: number) {
    const foamGeo = new THREE.RingGeometry(radius * 0.92, radius * 1.25, 32);
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
  // ARCHIPELAGO ISLANDS
  // =========================================================================
  private buildArchipelago() {
    // 1. Central Plaza (Hub)
    this.createIsland({
      center: new THREE.Vector3(0, 0, 0),
      radius: 28,
      height: 3.5,
      sandColor: 0xfef08a,
      grassColor: 0x4ade80,
    });
    this.addHubLandmarks(new THREE.Vector3(0, 0, 0));

    // 2. MOBA Sanctuary (NW)
    this.createIsland({
      center: new THREE.Vector3(-70, 0, -65),
      radius: 24,
      height: 5.5,
      sandColor: 0xfde047,
      grassColor: 0x38bdf8,
    });
    this.addMOBALandmarks(new THREE.Vector3(-70, 0, -65));

    // 3. Battle Royale Outpost (NE)
    this.createIsland({
      center: new THREE.Vector3(75, 0, -60),
      radius: 25,
      height: 6.0,
      sandColor: 0xfde047,
      grassColor: 0xf97316,
    });
    this.addBRLandmarks(new THREE.Vector3(75, 0, -60));

    // 4. Voxel Sandbox Bay (SW)
    this.createVoxelIsland(new THREE.Vector3(-65, 0, 70));

    // 5. Soccer Arena Island (SE)
    this.createIsland({
      center: new THREE.Vector3(65, 0, 65),
      radius: 26,
      height: 2.2,
      sandColor: 0xfef08a,
      grassColor: 0x22c55e,
    });
  }

  private createIsland(cfg: { center: THREE.Vector3; radius: number; height: number; sandColor: number; grassColor: number }) {
    // Shoreline foam ring
    this.createShorelineFoam(cfg.center, cfg.radius);

    // Sand shelf
    const baseGeo = new THREE.CylinderGeometry(cfg.radius * 0.95, cfg.radius * 1.25, 2.5, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: cfg.sandColor, roughness: 0.9, flatShading: true });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(cfg.center.x, 0.4, cfg.center.z);
    baseMesh.receiveShadow = true;
    this.scene.add(baseMesh);

    // Green hill plateau
    const hillGeo = new THREE.CylinderGeometry(cfg.radius * 0.75, cfg.radius * 0.95, cfg.height, 20);
    const hillMat = new THREE.MeshStandardMaterial({ color: cfg.grassColor, roughness: 0.8, flatShading: true });
    const hillMesh = new THREE.Mesh(hillGeo, hillMat);
    hillMesh.position.set(cfg.center.x, cfg.height / 2 + 0.8, cfg.center.z);
    hillMesh.castShadow = true;
    hillMesh.receiveShadow = true;
    this.scene.add(hillMesh);

    // Palm trees & coastal rocks
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const dist = cfg.radius * 0.78;
      const x = cfg.center.x + Math.cos(angle) * dist;
      const z = cfg.center.z + Math.sin(angle) * dist;
      this.createPalmTree(x, z, cfg.height + 0.8);
      if (i % 2 === 0) {
        this.createBeachRock(x + 2, z - 2, 0.4);
      }
    }
  }

  private createPalmTree(x: number, z: number, y: number) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 3.5, 6);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, y + 1.75, z);
    trunk.rotation.z = (Math.random() - 0.5) * 0.2;
    trunk.castShadow = true;
    this.scene.add(trunk);

    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, flatShading: true });
    for (let j = 0; j < 4; j++) {
      const leafGeo = new THREE.ConeGeometry(1.2, 2.2, 5);
      const leaf = new THREE.Mesh(leafGeo, leavesMat);
      leaf.position.set(x, y + 3.8, z);
      leaf.rotation.z = Math.PI / 3;
      leaf.rotation.y = (j / 4) * Math.PI * 2;
      leaf.castShadow = true;
      this.scene.add(leaf);
    }

    // Coconuts
    const nutMat = new THREE.MeshStandardMaterial({ color: 0x582a0b, roughness: 0.8 });
    for (let k = 0; k < 3; k++) {
      const nut = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), nutMat);
      nut.position.set(x + (k - 1) * 0.2, y + 3.5, z + (k % 2 === 0 ? 0.2 : -0.2));
      this.scene.add(nut);
    }
  }

  private createBeachRock(x: number, z: number, y: number) {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85, flatShading: true });
    const rockGeo = new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.6, 0);
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(x, y, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    this.scene.add(rock);
  }

  private addHubLandmarks(center: THREE.Vector3) {
    const plazaGeo = new THREE.CylinderGeometry(10, 10, 0.2, 24);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(center.x, 4.35, center.z);
    this.scene.add(plaza);

    const trophyGeo = new THREE.CylinderGeometry(1.2, 0.4, 2.5, 12);
    const trophyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const trophy = new THREE.Mesh(trophyGeo, trophyMat);
    trophy.position.set(center.x, 5.6, center.z);
    trophy.castShadow = true;
    this.scene.add(trophy);

    this.createRamp(new THREE.Vector3(-24, 0, 0), Math.PI / 2);
    this.createRamp(new THREE.Vector3(24, 0, 0), -Math.PI / 2);
  }

  private addMOBALandmarks(center: THREE.Vector3) {
    const bladeGeo = new THREE.BoxGeometry(0.8, 14, 2.2);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.1 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(center.x, 10, center.z);
    blade.rotation.z = 0.15;
    blade.castShadow = true;
    this.scene.add(blade);

    const crystalGeo = new THREE.OctahedronGeometry(2.5, 0);
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 0.6, metalness: 0.8, roughness: 0.1 });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(center.x + 8, 8, center.z + 5);
    crystal.castShadow = true;
    this.scene.add(crystal);
  }

  private addBRLandmarks(center: THREE.Vector3) {
    const crateGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.set(center.x, 8.5, center.z);
    crate.castShadow = true;
    this.scene.add(crate);

    const chuteGeo = new THREE.ConeGeometry(5, 2.5, 12, 1, true);
    const chuteMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
    const chute = new THREE.Mesh(chuteGeo, chuteMat);
    chute.position.set(center.x, 13, center.z);
    this.scene.add(chute);

    this.createRamp(new THREE.Vector3(center.x - 20, 0, center.z + 10), -Math.PI / 4);
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
        const boxGeo = new THREE.BoxGeometry(4.5, h * 1.5, 4.5);
        const box = new THREE.Mesh(boxGeo, dist > 2 ? stoneMat : voxelMat);
        box.position.set(center.x + x * 4.6, (h * 1.5) / 2 + 0.2, center.z + z * 4.6);
        box.castShadow = true;
        box.receiveShadow = true;
        this.scene.add(box);
      }
    }
  }

  private createRamp(pos: THREE.Vector3, rotY: number) {
    const rampGeo = new THREE.BoxGeometry(4, 1.8, 7);
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
    const ramp = new THREE.Mesh(rampGeo, rampMat);
    ramp.position.set(pos.x, 0.6, pos.z);
    ramp.rotation.y = rotY;
    ramp.rotation.x = -0.22;
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    this.scene.add(ramp);
  }

  // =========================================================================
  // MILO ARTICULATED AVATAR & CYBER JET SKI
  // =========================================================================
  private buildMiloAvatar(): THREE.Group {
    const cat = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.65 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const capeMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, side: THREE.DoubleSide });

    const visorTex = createVisorTexture();
    const visorMat = new THREE.MeshStandardMaterial({
      map: visorTex,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.6,
      metalness: 0.7,
      roughness: 0.2,
    });

    // 1. Torso
    const torso = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.42, 0.52, 1.0, 16);
    const body = new THREE.Mesh(bodyGeo, furMat);
    body.position.y = 1.05;
    body.castShadow = true;
    torso.add(body);

    const bellyGeo = new THREE.BoxGeometry(0.36, 0.65, 0.22);
    const belly = new THREE.Mesh(bellyGeo, whiteMat);
    belly.position.set(0, 1.0, 0.42);
    torso.add(belly);

    const beltGeo = new THREE.CylinderGeometry(0.53, 0.53, 0.14, 16);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 0.65;
    torso.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.2, 0.16, 0.1);
    const buckle = new THREE.Mesh(buckleGeo, goldMat);
    buckle.position.set(0, 0.65, 0.52);
    torso.add(buckle);
    cat.add(torso);

    // 2. Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.85, 0);

    const headGeo = new THREE.SphereGeometry(0.55, 20, 20);
    const head = new THREE.Mesh(headGeo, furMat);
    head.castShadow = true;
    this.headGroup.add(head);

    const muzzleGeo = new THREE.SphereGeometry(0.24, 14, 14);
    const muzzle = new THREE.Mesh(muzzleGeo, whiteMat);
    muzzle.position.set(0, -0.12, 0.42);
    muzzle.scale.set(1.1, 0.7, 0.8);
    this.headGroup.add(muzzle);

    const noseGeo = new THREE.ConeGeometry(0.07, 0.08, 4);
    const nose = new THREE.Mesh(noseGeo, pinkMat);
    nose.position.set(0, -0.06, 0.58);
    nose.rotation.x = Math.PI / 2;
    this.headGroup.add(nose);

    // Ears with inner pink cones
    const earGeo = new THREE.ConeGeometry(0.2, 0.38, 5);
    const innerEarGeo = new THREE.ConeGeometry(0.12, 0.26, 4);

    const earLGroup = new THREE.Group();
    earLGroup.position.set(-0.32, 0.46, 0);
    earLGroup.rotation.z = 0.25;
    this.earL = new THREE.Mesh(earGeo, furMat);
    const innerL = new THREE.Mesh(innerEarGeo, pinkMat);
    innerL.position.set(0, -0.02, 0.06);
    earLGroup.add(this.earL);
    earLGroup.add(innerL);
    this.headGroup.add(earLGroup);

    const earRGroup = new THREE.Group();
    earRGroup.position.set(0.32, 0.46, 0);
    earRGroup.rotation.z = -0.25;
    this.earR = new THREE.Mesh(earGeo, furMat);
    const innerR = new THREE.Mesh(innerEarGeo, pinkMat);
    innerR.position.set(0, -0.02, 0.06);
    earRGroup.add(this.earR);
    earRGroup.add(innerR);
    this.headGroup.add(earRGroup);

    // Sci-fi Visor
    const visorGeo = new THREE.BoxGeometry(0.78, 0.24, 0.38);
    const visor = new THREE.Mesh(visorGeo, visorMat);
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
    const capeGeo = new THREE.PlaneGeometry(0.85, 1.35, 6, 6);
    this.capeMesh = new THREE.Mesh(capeGeo, capeMat);
    this.capeMesh.position.set(0, 1.35, -0.48);
    this.capeMesh.rotation.x = 0.2;
    cat.add(this.capeMesh);

    // 6. Tail (Fluid wag group)
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.75, -0.48);

    const tailPartGeo = new THREE.CylinderGeometry(0.08, 0.11, 0.45, 8);
    const tailBase = new THREE.Mesh(tailPartGeo, furMat);
    tailBase.position.set(0, 0.1, -0.15);
    tailBase.rotation.x = -0.8;
    this.tailGroup.add(tailBase);

    const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), whiteMat);
    tailTip.position.set(0, 0.25, -0.35);
    this.tailGroup.add(tailTip);
    cat.add(this.tailGroup);

    return cat;
  }

  private buildJetSki(): THREE.Group {
    const ski = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const cyanNeonMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const orangeNeonMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.9,
    });

    // 1. Sleek hydrodynamic hull
    const hullGeo = new THREE.ConeGeometry(1.25, 3.6, 6);
    hullGeo.rotateX(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.set(0, 0.3, 0.2);
    hull.scale.set(1.05, 0.42, 1.0);
    hull.castShadow = true;
    ski.add(hull);

    // 2. Windshield / Cockpit Cowling
    const shieldGeo = new THREE.BoxGeometry(0.9, 0.4, 0.8);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.85 });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(0, 0.65, 0.6);
    shield.rotation.x = -0.4;
    ski.add(shield);

    // 3. Handlebars
    const barGeo = new THREE.BoxGeometry(1.2, 0.1, 0.1);
    const bar = new THREE.Mesh(barGeo, cyanNeonMat);
    bar.position.set(0, 0.82, 0.55);
    ski.add(bar);

    // 4. Twin Neon Running Lights
    const neonGeo = new THREE.BoxGeometry(0.12, 0.14, 2.8);
    const neonL = new THREE.Mesh(neonGeo, cyanNeonMat);
    neonL.position.set(-0.95, 0.38, -0.1);
    ski.add(neonL);

    const neonR = new THREE.Mesh(neonGeo, cyanNeonMat);
    neonR.position.set(0.95, 0.38, -0.1);
    ski.add(neonR);

    // 5. Dual Jet Exhaust Thrusters with Nitro Flame Cones
    const exhaustGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.4, 8);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaustL = new THREE.Mesh(exhaustGeo, hullMat);
    exhaustL.position.set(-0.45, 0.32, -1.5);
    ski.add(exhaustL);

    const exhaustR = new THREE.Mesh(exhaustGeo, hullMat);
    exhaustR.position.set(0.45, 0.32, -1.5);
    ski.add(exhaustR);

    const flameGeo = new THREE.ConeGeometry(0.16, 0.8, 6);
    flameGeo.rotateX(-Math.PI / 2);
    const flameL = new THREE.Mesh(flameGeo, orangeNeonMat);
    flameL.position.set(-0.45, 0.32, -1.9);
    flameL.visible = false;
    ski.add(flameL);

    const flameR = new THREE.Mesh(flameGeo, orangeNeonMat);
    flameR.position.set(0.45, 0.32, -1.9);
    flameR.visible = false;
    ski.add(flameR);

    this.jetSkiThrusters = [flameL, flameR];

    ski.visible = false;
    return ski;
  }

  // =========================================================================
  // COLLECTIBLES & SOCCER ARENA
  // =========================================================================
  private spawnTokens() {
    const tokenGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16);
    tokenGeo.rotateX(Math.PI / 2);
    const tokenMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.1 });

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
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.9, roughness: 0.1 });

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

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.5), postMat);
    postL.position.set(pos.x - 4, 1.75, pos.z + 12);
    this.scene.add(postL);

    const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.5), postMat);
    postR.position.set(pos.x + 4, 1.75, pos.z + 12);
    this.scene.add(postR);

    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 8), postMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(pos.x, 3.5, pos.z + 12);
    this.scene.add(crossbar);

    this.goalBox.set(
      new THREE.Vector3(pos.x - 4.5, 0, pos.z + 11.5),
      new THREE.Vector3(pos.x + 4.5, 4.0, pos.z + 15)
    );

    // Giant Interactive Soccer Ball with Authentic Procedural Pentagon Texture
    const soccerTex = createSoccerBallTexture();
    const ballMat = new THREE.MeshStandardMaterial({
      map: soccerTex,
      roughness: 0.35,
      metalness: 0.1,
    });
    this.soccerBall = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), ballMat);
    this.soccerBall.position.set(pos.x, 1.6, pos.z);
    this.soccerBall.castShadow = true;
    this.scene.add(this.soccerBall);
  }

  private spawnNPCMeshes() {
    this.npcs.forEach((npc) => {
      const group = new THREE.Group();
      group.position.copy(npc.pos);

      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.4, 12), bodyMat);
      body.position.y = 0.7;
      body.castShadow = true;
      group.add(body);

      const headMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), headMat);
      head.position.y = 1.7;
      group.add(head);

      const beaconGeo = new THREE.OctahedronGeometry(0.4, 0);
      const beaconMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 2.6;
      group.add(beacon);

      this.scene.add(group);
    });
  }

  private setupWakeParticles() {
    const count = 70;
    const geo = new THREE.BufferGeometry();
    this.wakePositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      this.wakePositions[i * 3 + 1] = -100;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(this.wakePositions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.75,
      transparent: true,
      opacity: 0.65,
    });
    this.wakeParticles = new THREE.Points(geo, mat);
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
    this.updateCloudsAndFoam(time);
    this.updatePlayerMovement(delta, time);
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

  private updateCloudsAndFoam(time: number) {
    // Drifting clouds
    this.clouds.forEach((cloud, idx) => {
      cloud.position.x += 0.04 * (idx % 2 === 0 ? 1 : -1);
      if (cloud.position.x > 180) cloud.position.x = -180;
      if (cloud.position.x < -180) cloud.position.x = 180;
    });

    // Shoreline foam gentle pulsing
    const foamAlpha = 0.35 + Math.sin(time * 2.2) * 0.15;
    this.foamRings.forEach((foam) => {
      (foam.material as THREE.MeshBasicMaterial).opacity = foamAlpha;
    });
  }

  private updatePlayerMovement(delta: number, time: number) {
    // 1. Smooth Steering
    const targetTurn = (this.inputs.left ? 1 : 0) - (this.inputs.right ? 1 : 0);
    this.currentTurnSpeed = THREE.MathUtils.lerp(this.currentTurnSpeed, targetTurn * this.turnSpeed, 12 * delta);
    this.playerRotY += this.currentTurnSpeed * delta;

    // 2. Acceleration & Nitro
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

    // Speed interpolation
    const accelRate = targetSpeed !== 0 ? (targetSpeed > this.currentSpeed ? this.acceleration : this.deceleration) : this.deceleration * 1.4;
    this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, targetSpeed, Math.min(1, accelRate * 0.25 * delta));

    // Translation vectors
    const forwardX = -Math.sin(this.playerRotY) * this.currentSpeed;
    const forwardZ = -Math.cos(this.playerRotY) * this.currentSpeed;
    this.playerVel.x = forwardX;
    this.playerVel.z = forwardZ;

    this.playerPos.x += this.playerVel.x * delta;
    this.playerPos.z += this.playerVel.z * delta;

    this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -160, 160);
    this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -160, 160);

    // Height & Ground calculation
    const groundHeight = this.calculateGroundHeight(this.playerPos.x, this.playerPos.z);
    const waterLevel = 0.2;

    // Jump
    if (this.inputs.jump && this.isGrounded) {
      this.playerVel.y = 12.5;
      this.isGrounded = false;
      this.audio.playJump();
    }

    // Gravity
    if (!this.isGrounded) {
      this.playerVel.y -= 28 * delta;
      this.playerPos.y += this.playerVel.y * delta;
      if (this.playerPos.y <= groundHeight) {
        this.playerPos.y = groundHeight;
        this.playerVel.y = 0;
        this.isGrounded = true;
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

    // Vehicle Switch
    this.jetSkiGroup.visible = this.onWater;

    // Engine Audio & Speedometer
    this.audio.updateEngineSound(Math.abs(this.currentSpeed), this.onWater);
    this.callbacks.onSpeedUpdate?.(Math.round(Math.abs(this.currentSpeed) * 3.6));

    // Smooth Banking Roll into turns
    const targetBank = -this.currentTurnSpeed * 0.16;
    this.currentBankZ = THREE.MathUtils.lerp(this.currentBankZ, targetBank, 10 * delta);

    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.y = this.playerRotY;
    this.playerGroup.rotation.z = this.currentBankZ;

    // =========================================================================
    // MILO ANIMATION BLENDING & POSE CONTROLLER
    // =========================================================================
    const speedRatio = Math.abs(this.currentSpeed) / this.maxSpeed;

    if (this.onWater) {
      // ---------------------------------------------------------------------
      // WATER MODE: JET SKI RIDING STANCE
      // ---------------------------------------------------------------------
      this.catMeshGroup.position.y = 0.28;
      this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, 0.36, 10 * delta);
      this.catMeshGroup.rotation.y = THREE.MathUtils.lerp(this.catMeshGroup.rotation.y, 0, 10 * delta);

      // Grip handlebars
      if (this.leftArm) this.leftArm.rotation.x = -1.18;
      if (this.rightArm) this.rightArm.rotation.x = -1.18;

      // Riding crouch legs
      if (this.leftLeg) this.leftLeg.rotation.x = -0.75;
      if (this.rightLeg) this.rightLeg.rotation.x = -0.75;

      // Wave pitch & jet ski bow planing
      const waveBob = Math.sin(time * 3.5 + this.playerPos.x * 0.1) * 0.06;
      this.playerPos.y = groundHeight + waveBob;

      const targetPitch = -(this.currentSpeed / this.maxSpeed) * 0.15;
      this.currentPitchX = THREE.MathUtils.lerp(this.currentPitchX, targetPitch, 8 * delta);
      this.playerGroup.rotation.x = this.currentPitchX;

      // Thruster flame cones during nitro boost
      this.jetSkiThrusters.forEach((thruster) => {
        thruster.visible = this.isBoosting;
        if (this.isBoosting) {
          thruster.scale.z = 1.0 + Math.sin(time * 30) * 0.3;
        }
      });
    } else {
      // ---------------------------------------------------------------------
      // LAND MODE: NATURAL WALKING / SPRINTING / JUMPING / IDLE
      // ---------------------------------------------------------------------
      this.playerGroup.rotation.x = THREE.MathUtils.lerp(this.playerGroup.rotation.x, 0, 10 * delta);

      if (!this.isGrounded) {
        // AIRBORNE JUMP / STUNT POSE
        if (this.leftLeg) this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, -0.45, 12 * delta);
        if (this.rightLeg) this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, -0.35, 12 * delta);
        if (this.leftArm) this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.7, 12 * delta);
        if (this.rightArm) this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0.7, 12 * delta);
        this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, -0.15, 10 * delta);
      } else if (speedRatio > 0.05) {
        // WALKING / SPRINTING
        this.walkCycle += Math.abs(this.currentSpeed) * 1.5 * delta;

        // Alternating limbs
        const legSwing = Math.sin(this.walkCycle) * (0.55 + speedRatio * 0.35);
        const armSwing = -Math.sin(this.walkCycle) * (0.45 + speedRatio * 0.35);

        if (this.leftLeg) this.leftLeg.rotation.x = legSwing;
        if (this.rightLeg) this.rightLeg.rotation.x = -legSwing;
        if (this.leftArm) this.leftArm.rotation.x = armSwing;
        if (this.rightArm) this.rightArm.rotation.x = -armSwing;

        // Natural bouncing weight
        const bounce = Math.abs(Math.sin(this.walkCycle)) * 0.12;
        this.catMeshGroup.position.y = bounce;

        // Sprint lean & hip sway
        const targetLean = Math.min(0.28, speedRatio * 0.25);
        this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, targetLean, 10 * delta);
        this.catMeshGroup.rotation.y = Math.sin(this.walkCycle * 0.5) * 0.08;
      } else {
        // IDLE BREATHING & TAIL WAG
        if (this.leftLeg) this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, 10 * delta);
        if (this.rightLeg) this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, 10 * delta);
        if (this.leftArm) this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0.1, 10 * delta);
        if (this.rightArm) this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0.1, 10 * delta);

        const breath = Math.sin(time * 2.8) * 0.035;
        this.catMeshGroup.position.y = breath;
        this.catMeshGroup.rotation.x = THREE.MathUtils.lerp(this.catMeshGroup.rotation.x, 0, 10 * delta);
        this.catMeshGroup.rotation.y = THREE.MathUtils.lerp(this.catMeshGroup.rotation.y, 0, 10 * delta);

        // Ear twitches
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
      this.nextWakeIdx = (this.nextWakeIdx + 1) % 70;
      if (this.wakeParticles) {
        this.wakeParticles.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  private calculateGroundHeight(x: number, z: number): number {
    const islands = [
      { x: 0, z: 0, r: 28, h: 4.5 },
      { x: -70, z: -65, r: 24, h: 6.2 },
      { x: 75, z: -60, r: 25, h: 6.8 },
      { x: -65, z: 70, r: 22, h: 4.8 },
      { x: 65, z: 65, r: 26, h: 3.0 },
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
      const impulse = Math.max(Math.abs(this.currentSpeed) * 1.2, 14);
      this.ballVel.x = pushDir.x * impulse;
      this.ballVel.z = pushDir.z * impulse;
      this.ballVel.y = 4.5;
      this.audio.playKick();
    }

    this.soccerBall.position.x += this.ballVel.x * delta;
    this.soccerBall.position.z += this.ballVel.z * delta;
    this.soccerBall.position.y += this.ballVel.y * delta;

    // Realistic ball rolling spin
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
    // Dynamic FOV on boost
    const targetFov = this.isBoosting ? 68 : 58;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 6 * delta);
    this.camera.updateProjectionMatrix();

    // Damped camera position follow
    const offset = new THREE.Vector3(0, 4.2, 7.8);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY);

    const targetCamPos = new THREE.Vector3().addVectors(this.playerPos, offset);
    this.camera.position.lerp(targetCamPos, 0.07);

    // Damped camera lookAt
    const lookTarget = new THREE.Vector3().copy(this.playerPos).add(new THREE.Vector3(0, 1.4, 0));
    this.cameraLookAt.lerp(lookTarget, 0.09);
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
      if (d < 4.5 && d < npcDist) {
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
