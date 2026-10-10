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
  private capeMesh: THREE.Mesh | null = null;
  private tailMesh: THREE.Mesh | null = null;

  // Player Physics
  public playerPos: THREE.Vector3 = new THREE.Vector3(0, 0.4, 0);
  public playerVel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public playerRotY: number = 0;
  public currentSpeed: number = 0;
  public maxSpeed: number = 24; // u/s
  public acceleration: number = 28;
  public deceleration: number = 18;
  public turnSpeed: number = 2.8;
  public isGrounded: boolean = true;
  public onWater: boolean = false;
  public nitro: number = 100; // 0 - 100
  public isBoosting: boolean = false;

  // Ocean Mesh
  private waterMesh: THREE.Mesh | null = null;
  private waterGeometry: THREE.PlaneGeometry | null = null;

  // Soccer Ball & Goal
  private soccerBall: THREE.Mesh | null = null;
  private ballVel: THREE.Vector3 = new THREE.Vector3();
  private goalBox: THREE.Box3 = new THREE.Box3();
  private isGoalCelebration: boolean = false;

  // Collectibles
  private tokens: { mesh: THREE.Mesh; collected: boolean }[] = [];
  public coinsCollected: number = 0;
  public totalCoins: number = 30;

  // Speed Rings
  private speedRings: THREE.Mesh[] = [];

  // Wake & Dust Particles
  private wakeParticles: THREE.Points | null = null;
  private wakePositions: Float32Array | null = null;
  private wakeAlphas: Float32Array | null = null;
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

  // Active NPC in Proximity
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

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8); // Sky blue
    this.scene.fog = new THREE.FogExp2(0xbae6fd, 0.007); // Atmospheric fog

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 800);
    this.camera.position.set(0, 6, 10);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Build Environment (Ocean & Islands)
    this.buildOcean();
    this.buildArchipelago();

    // 6. Build Player Avatar & Vehicle
    this.playerGroup = new THREE.Group();
    this.catMeshGroup = this.buildMiloAvatar();
    this.jetSkiGroup = this.buildJetSki();
    this.playerGroup.add(this.catMeshGroup);
    this.playerGroup.add(this.jetSkiGroup);
    this.scene.add(this.playerGroup);

    // 7. Spawn Collectibles, Soccer Ball & NPCs
    this.spawnTokens();
    this.spawnSpeedRings();
    this.spawnSoccerArena();
    this.spawnNPCMeshes();
    this.setupWakeParticles();

    // 8. Event Listeners
    window.addEventListener("resize", this.onWindowResize);

    // 9. Start Loop
    this.isRunning = true;
    this.animate();
  }

  // =========================================================================
  // LIGHTING & ATMOSPHERE
  // =========================================================================
  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x0284c7, 0.5);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfffbeb, 1.2);
    sun.position.set(70, 90, 50);
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

  // =========================================================================
  // PROCEDURAL OCEAN
  // =========================================================================
  private buildOcean() {
    this.waterGeometry = new THREE.PlaneGeometry(380, 380, 64, 64);
    this.waterGeometry.rotateX(-Math.PI / 2);

    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.35,
      flatShading: true,
    });

    this.waterMesh = new THREE.Mesh(this.waterGeometry, waterMaterial);
    this.waterMesh.position.y = 0;
    this.waterMesh.receiveShadow = true;
    this.scene.add(this.waterMesh);
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
    // Island base (sand shelf)
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

    // Palm trees on island rim
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const dist = cfg.radius * 0.78;
      const x = cfg.center.x + Math.cos(angle) * dist;
      const z = cfg.center.z + Math.sin(angle) * dist;
      this.createPalmTree(x, z, cfg.height + 0.8);
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
  }

  // Central Plaza Landmarks
  private addHubLandmarks(center: THREE.Vector3) {
    // Stone Plaza Circle
    const plazaGeo = new THREE.CylinderGeometry(10, 10, 0.2, 24);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(center.x, 4.35, center.z);
    this.scene.add(plaza);

    // Center Gold Trophy Beacon
    const trophyGeo = new THREE.CylinderGeometry(1.2, 0.4, 2.5, 12);
    const trophyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const trophy = new THREE.Mesh(trophyGeo, trophyMat);
    trophy.position.set(center.x, 5.6, center.z);
    trophy.castShadow = true;
    this.scene.add(trophy);

    // Stunt Jump Ramp to West Ocean
    this.createRamp(new THREE.Vector3(-24, 0, 0), Math.PI / 2);
    // Stunt Jump Ramp to East Ocean
    this.createRamp(new THREE.Vector3(24, 0, 0), -Math.PI / 2);
  }

  // MOBA Sanctuary Landmarks
  private addMOBALandmarks(center: THREE.Vector3) {
    // Giant Mythic Sword (Monolith)
    const bladeGeo = new THREE.BoxGeometry(0.8, 14, 2.2);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.1 });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(center.x, 10, center.z);
    blade.rotation.z = 0.15;
    blade.castShadow = true;
    this.scene.add(blade);

    // Glowing Base Crystal
    const crystalGeo = new THREE.OctahedronGeometry(2.5, 0);
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 0.6, metalness: 0.8, roughness: 0.1 });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.set(center.x + 8, 8, center.z + 5);
    crystal.castShadow = true;
    this.scene.add(crystal);
  }

  // Battle Royale Outpost Landmarks
  private addBRLandmarks(center: THREE.Vector3) {
    // Red Airdrop Crate
    const crateGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 });
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.set(center.x, 8.5, center.z);
    crate.castShadow = true;
    this.scene.add(crate);

    // Yellow Parachute on top
    const chuteGeo = new THREE.ConeGeometry(5, 2.5, 12, 1, true);
    const chuteMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
    const chute = new THREE.Mesh(chuteGeo, chuteMat);
    chute.position.set(center.x, 13, center.z);
    this.scene.add(chute);

    // Water stunt ramp into ocean
    this.createRamp(new THREE.Vector3(center.x - 20, 0, center.z + 10), -Math.PI / 4);
  }

  // Voxel Sandbox Island (Cubic aesthetic)
  private createVoxelIsland(center: THREE.Vector3) {
    const voxelMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9, flatShading: true });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8, flatShading: true });

    // Multi-layer voxel stepping
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
    ramp.rotation.x = -0.22; // Incline
    ramp.castShadow = true;
    ramp.receiveShadow = true;
    this.scene.add(ramp);
  }

  // =========================================================================
  // MILO AVATAR & CYBER JET SKI
  // =========================================================================
  private buildMiloAvatar(): THREE.Group {
    const cat = new THREE.Group();
    const furMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.7 }); // Ginger Cat
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.7, roughness: 0.1 });
    const capeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5, side: THREE.DoubleSide });

    // Torso / Body
    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.55, 1.1, 12);
    const body = new THREE.Mesh(bodyGeo, furMat);
    body.position.y = 1.0;
    body.castShadow = true;
    cat.add(body);

    // White belly
    const bellyGeo = new THREE.BoxGeometry(0.35, 0.7, 0.2);
    const belly = new THREE.Mesh(bellyGeo, bellyMat);
    belly.position.set(0, 0.95, 0.42);
    cat.add(belly);

    // Head
    const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const head = new THREE.Mesh(headGeo, furMat);
    head.position.y = 1.8;
    head.castShadow = true;
    cat.add(head);

    // Cat Ears
    const earGeo = new THREE.ConeGeometry(0.2, 0.35, 4);
    const earL = new THREE.Mesh(earGeo, furMat);
    earL.position.set(-0.3, 2.3, 0);
    earL.rotation.z = 0.25;
    cat.add(earL);

    const earR = new THREE.Mesh(earGeo, furMat);
    earR.position.set(0.3, 2.3, 0);
    earR.rotation.z = -0.25;
    cat.add(earR);

    // Sci-fi Visor Goggles
    const visorGeo = new THREE.BoxGeometry(0.7, 0.22, 0.35);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.85, 0.42);
    cat.add(visor);

    // Hero Cape
    const capeGeo = new THREE.PlaneGeometry(0.8, 1.2, 4, 4);
    this.capeMesh = new THREE.Mesh(capeGeo, capeMat);
    this.capeMesh.position.set(0, 1.25, -0.5);
    this.capeMesh.rotation.x = 0.2;
    cat.add(this.capeMesh);

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8);
    this.tailMesh = new THREE.Mesh(tailGeo, furMat);
    this.tailMesh.position.set(0, 0.8, -0.6);
    this.tailMesh.rotation.x = -0.6;
    cat.add(this.tailMesh);

    return cat;
  }

  private buildJetSki(): THREE.Group {
    const ski = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.7 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6 });

    // Boat Hull
    const hullGeo = new THREE.ConeGeometry(1.2, 3.2, 5);
    hullGeo.rotateX(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.set(0, 0.25, 0.1);
    hull.scale.set(1, 0.45, 1);
    hull.castShadow = true;
    ski.add(hull);

    // Handlebars
    const barGeo = new THREE.BoxGeometry(1.1, 0.1, 0.1);
    const bar = new THREE.Mesh(barGeo, accentMat);
    bar.position.set(0, 0.75, 0.5);
    ski.add(bar);

    // Neon side accents
    const neonGeo = new THREE.BoxGeometry(0.1, 0.12, 2.2);
    const neonL = new THREE.Mesh(neonGeo, accentMat);
    neonL.position.set(-0.85, 0.35, -0.2);
    ski.add(neonL);

    const neonR = new THREE.Mesh(neonGeo, accentMat);
    neonR.position.set(0.85, 0.35, -0.2);
    ski.add(neonR);

    ski.visible = false; // Hidden on land, visible on water
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
      // Central Hub
      [0, 5.2, -6], [0, 5.2, 6], [-6, 5.2, 0], [6, 5.2, 0],
      // Water paths
      [-25, 1.0, -25], [-45, 1.0, -45], [25, 1.0, -25], [45, 1.0, -45],
      [-25, 1.0, 25], [-45, 1.0, 45], [25, 1.0, 25], [45, 1.0, 45],
      // MOBA Island
      [-70, 4.5, -55], [-75, 4.5, -70], [-65, 4.5, -75],
      // Battle Royale Island
      [75, 5.5, -50], [80, 5.5, -65], [70, 5.5, -75],
      // Voxel Island
      [-65, 4.0, 60], [-70, 4.0, 75], [-60, 4.0, 80],
      // Soccer Arena
      [60, 2.2, 55], [70, 2.2, 70], [55, 2.2, 75],
      // Mid-Air Jump ramp rewards
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

    // Goalposts (Floating on water)
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

    // Goal trigger box
    this.goalBox.set(
      new THREE.Vector3(pos.x - 4.5, 0, pos.z + 11.5),
      new THREE.Vector3(pos.x + 4.5, 4.0, pos.z + 15)
    );

    // Giant Interactive Soccer Ball
    const ballGeo = new THREE.SphereGeometry(1.6, 20, 20);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    this.soccerBall = new THREE.Mesh(ballGeo, ballMat);
    this.soccerBall.position.set(pos.x, 1.6, pos.z);
    this.soccerBall.castShadow = true;
    this.scene.add(this.soccerBall);
  }

  private spawnNPCMeshes() {
    this.npcs.forEach((npc) => {
      const group = new THREE.Group();
      group.position.copy(npc.pos);

      // Body pedestal
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.4, 12), bodyMat);
      body.position.y = 0.7;
      body.castShadow = true;
      group.add(body);

      // Head
      const headMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.4 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), headMat);
      head.position.y = 1.7;
      group.add(head);

      // Floating billboard beacon
      const beaconGeo = new THREE.OctahedronGeometry(0.4, 0);
      const beaconMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 2.6;
      group.add(beacon);

      this.scene.add(group);
    });
  }

  private setupWakeParticles() {
    const count = 60;
    const geo = new THREE.BufferGeometry();
    this.wakePositions = new Float32Array(count * 3);
    this.wakeAlphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      this.wakePositions[i * 3 + 1] = -100; // Offscreen
    }

    geo.setAttribute("position", new THREE.BufferAttribute(this.wakePositions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.6,
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

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    this.updateWaterWaves(time);
    this.updatePlayerMovement(delta, time);
    this.updateCollectibles(time);
    this.updateSoccerBall(delta);
    this.updateCameraFollow();
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

  private updatePlayerMovement(delta: number, time: number) {
    // Rotation / Steering
    if (this.inputs.left) {
      this.playerRotY += this.turnSpeed * delta;
    }
    if (this.inputs.right) {
      this.playerRotY -= this.turnSpeed * delta;
    }

    // Acceleration & Reversing
    let targetSpeed = 0;
    if (this.inputs.forward) {
      targetSpeed = this.maxSpeed;
    } else if (this.inputs.backward) {
      targetSpeed = -this.maxSpeed * 0.4;
    }

    // Nitro Boost
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
    if (targetSpeed > this.currentSpeed) {
      this.currentSpeed = Math.min(targetSpeed, this.currentSpeed + this.acceleration * delta);
    } else if (targetSpeed < this.currentSpeed) {
      this.currentSpeed = Math.max(targetSpeed, this.currentSpeed - this.deceleration * delta);
    }

    // Velocity vectors
    const forwardX = -Math.sin(this.playerRotY) * this.currentSpeed;
    const forwardZ = -Math.cos(this.playerRotY) * this.currentSpeed;
    this.playerVel.x = forwardX;
    this.playerVel.z = forwardZ;

    // Apply horizontal translation
    this.playerPos.x += this.playerVel.x * delta;
    this.playerPos.z += this.playerVel.z * delta;

    // Boundary constraints
    this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -160, 160);
    this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -160, 160);

    // Height & Ground calculation
    const groundHeight = this.calculateGroundHeight(this.playerPos.x, this.playerPos.z);
    const waterLevel = 0.2;

    // Jump
    if (this.inputs.jump && this.isGrounded) {
      this.playerVel.y = 12; // Jump force
      this.isGrounded = false;
      this.audio.playJump();
    }

    // Gravity
    if (!this.isGrounded) {
      this.playerVel.y -= 26 * delta;
      this.playerPos.y += this.playerVel.y * delta;
      if (this.playerPos.y <= groundHeight) {
        this.playerPos.y = groundHeight;
        this.playerVel.y = 0;
        this.isGrounded = true;
      }
    } else {
      this.playerPos.y = groundHeight;
    }

    // Detect On-Water vs On-Land
    const wasOnWater = this.onWater;
    this.onWater = groundHeight <= waterLevel + 0.1;

    if (!wasOnWater && this.onWater) {
      this.audio.playSplash();
    }

    // Vehicle Switch
    this.jetSkiGroup.visible = this.onWater;
    this.catMeshGroup.position.y = this.onWater ? 0.35 : 0;

    // Engine Audio
    this.audio.updateEngineSound(Math.abs(this.currentSpeed), this.onWater);
    this.callbacks.onSpeedUpdate?.(Math.round(Math.abs(this.currentSpeed) * 3.6));

    // Banking & Body Tilting
    let bankZ = 0;
    if (this.inputs.left) bankZ = 0.25;
    if (this.inputs.right) bankZ = -0.25;

    this.playerGroup.position.copy(this.playerPos);
    this.playerGroup.rotation.set(0, this.playerRotY, bankZ);

    // Animate Cape & Tail
    if (this.capeMesh) {
      this.capeMesh.rotation.x = 0.2 + (this.currentSpeed / this.maxSpeed) * 0.9 + Math.sin(time * 8) * 0.1;
    }
    if (this.tailMesh) {
      this.tailMesh.rotation.z = Math.sin(time * 6) * 0.3;
    }

    // Wake Particles on Water
    if (this.onWater && Math.abs(this.currentSpeed) > 3 && this.wakePositions) {
      this.wakePositions[this.nextWakeIdx * 3] = this.playerPos.x;
      this.wakePositions[this.nextWakeIdx * 3 + 1] = 0.1;
      this.wakePositions[this.nextWakeIdx * 3 + 2] = this.playerPos.z;
      this.nextWakeIdx = (this.nextWakeIdx + 1) % 60;
      if (this.wakeParticles) {
        this.wakeParticles.geometry.attributes.position.needsUpdate = true;
      }
    }
  }

  private calculateGroundHeight(x: number, z: number): number {
    const islands = [
      { x: 0, z: 0, r: 28, h: 4.5 },      // Central Hub
      { x: -70, z: -65, r: 24, h: 6.2 },  // MOBA
      { x: 75, z: -60, r: 25, h: 6.8 },   // Battle Royale
      { x: -65, z: 70, r: 22, h: 4.8 },   // Voxel
      { x: 65, z: 65, r: 26, h: 3.0 },    // Soccer
    ];

    for (const isl of islands) {
      const dist = Math.hypot(x - isl.x, z - isl.z);
      if (dist < isl.r) {
        const factor = 1 - Math.pow(dist / isl.r, 2);
        return 0.3 + factor * isl.h;
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

    // Speed rings trigger
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

    // Collision with player
    const dist = this.playerPos.distanceTo(this.soccerBall.position);
    if (dist < 3.2) {
      const pushDir = new THREE.Vector3().subVectors(this.soccerBall.position, this.playerPos).normalize();
      const impulse = Math.max(Math.abs(this.currentSpeed) * 1.2, 14);
      this.ballVel.x = pushDir.x * impulse;
      this.ballVel.z = pushDir.z * impulse;
      this.ballVel.y = 4.5;
      this.audio.playKick();
    }

    // Ball physics
    this.soccerBall.position.x += this.ballVel.x * delta;
    this.soccerBall.position.z += this.ballVel.z * delta;
    this.soccerBall.position.y += this.ballVel.y * delta;

    // Gravity & Ground bounce
    if (this.soccerBall.position.y > 1.6) {
      this.ballVel.y -= 18 * delta;
    } else {
      this.soccerBall.position.y = 1.6;
      this.ballVel.y = -this.ballVel.y * 0.45;
    }

    // Friction
    this.ballVel.x *= 0.94;
    this.ballVel.z *= 0.94;

    // Check Goal
    if (!this.isGoalCelebration && this.goalBox.containsPoint(this.soccerBall.position)) {
      this.isGoalCelebration = true;
      this.audio.playGoal();
      this.callbacks.onGoal?.();
      this.callbacks.onQuestProgress?.("soccer");

      // Reset ball position after 3.5s
      setTimeout(() => {
        if (this.soccerBall) {
          this.soccerBall.position.set(65, 1.6, 65);
          this.ballVel.set(0, 0, 0);
          this.isGoalCelebration = false;
        }
      }, 3500);
    }
  }

  private updateCameraFollow() {
    // Camera sits behind and above player
    const offset = new THREE.Vector3(0, 4.2, 7.5);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY);

    const targetCamPos = new THREE.Vector3().addVectors(this.playerPos, offset);
    this.camera.position.lerp(targetCamPos, 0.08);

    const lookTarget = new THREE.Vector3().copy(this.playerPos).add(new THREE.Vector3(0, 1.6, 0));
    this.camera.lookAt(lookTarget);
  }

  private checkLocationAndProximity() {
    // Identify closest island POI
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
      if (closestPOI.id === "br") {
        this.callbacks.onQuestProgress?.("airdrop");
      }
    }

    // Identify closest NPC
    let nearbyNPC: NPCData | null = null;
    for (const npc of this.npcs) {
      if (this.playerPos.distanceTo(npc.pos) < 6.5) {
        nearbyNPC = npc;
        break;
      }
    }

    if (nearbyNPC !== this.activeProximityNPC) {
      this.activeProximityNPC = nearbyNPC;
      this.callbacks.onProximityChange?.(nearbyNPC);
    }
  }

  // Fast Travel Teleportation
  public fastTravel(islandId: string) {
    const poi = this.pois.find((p) => p.id === islandId);
    if (!poi) return;

    this.playerPos.copy(poi.pos);
    this.playerVel.set(0, 0, 0);
    this.currentSpeed = 0;
    this.playerPos.y = this.calculateGroundHeight(poi.pos.x, poi.pos.z) + 0.5;
    this.audio.playSplash();
  }

  // Resize handler
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

    // Geometries & Materials disposal
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
