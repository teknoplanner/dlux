"use client";

import * as THREE from "three";
import { bakeStatic } from "./worldBake";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { NPCData, SolidCollider } from "./WorldEngine";
import { WorldCharacterManager } from "./WorldCharacterManager";
import { getWindWakerWaveElevation } from "./WorldWindWakerWater";
import { WorldWeatherManager } from "./WorldWeatherManager";

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================
export interface Pedestrian {
  group: THREE.Group;
  legL?: THREE.Mesh;
  legR?: THREE.Mesh;
  armL?: THREE.Mesh;
  armR?: THREE.Mesh;
  head?: THREE.Group;
  waypoints: THREE.Vector3[];
  currentWaypointIdx: number;
  speed: number;
  walkCycle: number;
  name: string;
}

export interface BoatThemeConfig {
  hull: number;       // Upper hull exterior
  keel: number;       // Lower hull / waterline underbody
  stripe: number;     // Racing / waterline accent stripe
  deck: number;       // Deck planking
  aftFloor: number;   // Cockpit / stern floor
  cabin: number;      // Wheelhouse / cabin exterior
  roof: number;       // Cabin hardtop / canopy roof
  window: number;     // Marine glass windows
  console: number;    // Dashboard console & instruments
  wheel: number;      // Steering wheel
  seat: number;       // Seats / upholstery
  seatBase: number;   // Seat pedestal / supports
  engine: number;     // Outboard engine, propeller, rudder
  innerTrim: number;  // Gunwale rub rails & interior trim
}

export const BOAT_THEMES: Record<"cruiser" | "fisherman" | "lagoon" | "moored", BoatThemeConfig> = {
  cruiser: {
    hull: 0xf8fafc,       // Luxury Yacht White
    keel: 0x0f172a,       // Deep Oceanic Navy Keel
    stripe: 0xf59e0b,     // Royal Gold Waterline Ribbon
    deck: 0xb45309,       // Golden Teak Wood Planks
    aftFloor: 0x92400e,   // Rich Teak Cockpit
    cabin: 0xf1f5f9,      // Pearl White Wheelhouse
    roof: 0x1e3a8a,       // Royal Navy Hardtop
    window: 0x38bdf8,     // Glossy Tinted Caribbean Glass
    console: 0x334155,    // Slate Grey Marine Dashboard
    wheel: 0x78350f,      // Teak Ship Wheel
    seat: 0x9a3412,       // Cognac Marine Leather
    seatBase: 0x64748b,   // Stainless Steel
    engine: 0xd97706,     // Polished Marine Bronze
    innerTrim: 0xcbd5e1,  // Chrome Gunwale Rails
  },
  fisherman: {
    hull: 0x0891b2,       // Indonesian Maritime Turquoise Cyan
    keel: 0x1e1b4b,       // Midnight Blue Keel
    stripe: 0xea580c,     // High-Visibility Sunset Orange Stripe
    deck: 0xa16207,       // Weathered Cedar Planks
    aftFloor: 0x78350f,   // Rustic Stained Timber Floor
    cabin: 0xd97706,      // Sunburst Amber Wood Cabin
    roof: 0x065f46,       // Deep Tropical Pine Green Roof
    window: 0x22d3ee,     // Aqua Marine Glass
    console: 0x451a03,    // Heavy Timber Helm
    wheel: 0xb45309,      // Classic Wooden Ship Wheel
    seat: 0x047857,       // Nautical Green Vinyl Bench
    seatBase: 0x3f3f46,   // Weathered Iron Stand
    engine: 0x18181b,     // Matte Black Outboard Motor
    innerTrim: 0xf97316,  // Safety Orange Inner Gunwale
  },
  lagoon: {
    hull: 0xfacc15,       // Tropical Sunshine Yellow
    keel: 0xffffff,       // Clean White Keel
    stripe: 0x06b6d4,     // Island Aqua Teal Stripe
    deck: 0xd4b996,       // Light Bleached Birch Deck
    aftFloor: 0xc8a27a,   // Sand Beige Deck Planks
    cabin: 0xffffff,      // Island White Canopy Cabin
    roof: 0xe11d48,       // Coral Red Canopy
    window: 0x38bdf8,     // Crystal Clear Cyan Glass
    console: 0x475569,    // Modern Slate Grey Console
    wheel: 0xffffff,      // Sport White Steering Wheel
    seat: 0x0284c7,       // Tropical Sky Blue Cushions
    seatBase: 0x94a3b8,   // Anodized Aluminum
    engine: 0xf1f5f9,     // Bright White Coastal Outboard
    innerTrim: 0x06b6d4,  // Aqua Teal Rubbing Rail
  },
  moored: {
    hull: 0x78350f,       // Handcrafted Indonesian Teak Wood
    keel: 0x451a03,       // Dark Ironwood Keel Planks
    stripe: 0xb45309,     // Warm Ochre Wood Accent Stripe
    deck: 0x92400e,       // Aged Sandalwood Floor
    aftFloor: 0x78350f,   // Solid Teak Cockpit
    cabin: 0xa16207,      // Rustic Timber Cabin Framing
    roof: 0x5c2005,       // Dark Timber Roof
    window: 0x67e8f9,     // Sky Reflection Window Glass
    console: 0x451a03,    // Carved Wood Console
    wheel: 0x78350f,      // Rustic Wooden Helm
    seat: 0x5c2005,       // Mahogany Rowing Thwarts
    seatBase: 0x451a03,   // Heavy Timber Ribs
    engine: 0x292524,     // Cast Iron Rudder Fittings
    innerTrim: 0x92400e,  // Carved Wood Gunwale
  },
};

export interface CruisingBoat {
  group: THREE.Group;
  hullGroup?: THREE.Group;
  type: "sailboat" | "motorboat" | "rowboat";
  waypoints?: THREE.Vector3[];
  spline?: THREE.CatmullRomCurve3;
  splineLength?: number;
  splineProgress?: number;
  currentYaw?: number;
  turnBank?: number;
  currentWaypointIdx?: number;
  radiusX: number;
  radiusZ: number;
  centerX: number;
  centerZ: number;
  speed: number;
  phase: number;
  foamEmitter?: THREE.Group;
  flagMeshes?: THREE.Mesh[];
  wakeRings?: Array<{ mesh: THREE.Mesh; timer: number; maxLife: number }>;
}

export interface FlyingSeagull {
  group: THREE.Group;
  wingL: THREE.Group;
  wingR: THREE.Group;
  baseRadius: number;
  altitude: number;
  speed: number;
  phase: number;
}

export interface JumpingDolphin {
  group: THREE.Group;
  center: THREE.Vector3;
  timer: number;
  isJumping: boolean;
  jumpProgress: number;
  splashRing: THREE.Mesh;
}

export interface FishingSpot {
  group: THREE.Group;
  rodTip: THREE.Vector3;
  bobber: THREE.Mesh;
  line: THREE.Line;
  jumpingFish: THREE.Mesh;
  fishTimer: number;
  isFishJumping: boolean;
  fishProgress: number;
}

// =============================================================================
// WORLD LIVING ATMOSPHERE MANAGER
// =============================================================================
export class WorldLivingAtmosphere {
  private scene: THREE.Scene;
  private colliders: SolidCollider[];
  private registerNPC: (npc: NPCData) => void;
  private getGroundHeight: (x: number, z: number) => number;
  private characterManager: WorldCharacterManager | null = null;
  private weatherManager: WorldWeatherManager | null = null;

  // Living World entities
  public pedestrians: Pedestrian[] = [];
  public boats: CruisingBoat[] = [];
  public seagulls: FlyingSeagull[] = [];
  public dolphins: JumpingDolphin[] = [];
  public fishingSpots: FishingSpot[] = [];

  // Shared reusable materials
  private woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
  private darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  private whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  private skinMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.7 });
  private goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.7 });

  // 3D Model Assets Loader (from folder assets/3d/boat)
  private fbxLoader = new FBXLoader();
  private boatPrototype: THREE.Group | null = null;
  private rodPrototype: THREE.Group | null = null;
  private pendingBoatClones: Array<{
    group: THREE.Group;
    scale: number;
    theme: BoatThemeConfig;
    rotYOffset: number;
  }> = [];
  private pendingRodClones: Array<{
    group: THREE.Group;
    scale: number;
  }> = [];

  constructor(
    scene: THREE.Scene,
    colliders: SolidCollider[],
    registerNPC: (npc: NPCData) => void,
    getGroundHeight: (x: number, z: number) => number,
    characterManager: WorldCharacterManager | null = null,
    weatherManager?: WorldWeatherManager | null
  ) {
    this.scene = scene;
    this.colliders = colliders;
    this.registerNPC = registerNPC;
    this.getGroundHeight = getGroundHeight;
    this.characterManager = characterManager;
    this.weatherManager = weatherManager || null;
  }

  public init() {
    this.load3DAssets();
    this.spawnMarketStallsAndVendors();
    this.spawnFishermen();
    this.spawnBoats();
    this.spawnPedestrians();
    this.spawnSeagulls();
    this.spawnDolphins();
  }

  private load3DAssets() {
    this.fbxLoader.load(
      "/assets/3d/boat/Fisher_Boat.fbx",
      (fbx) => {
        this.boatPrototype = fbx;
        // Process any queued boat attachments
        this.pendingBoatClones.forEach((req) => {
          this.attachBoatMesh(req.group, req.scale, req.theme, req.rotYOffset);
        });
        this.pendingBoatClones = [];
      },
      undefined,
      (err) => {
        console.warn("Could not load /assets/3d/boat/Fisher_Boat.fbx", err);
      }
    );

    this.fbxLoader.load(
      "/assets/3d/boat/Fishing_Rod.fbx",
      (fbx) => {
        this.rodPrototype = fbx;
        // Process any queued rod attachments
        this.pendingRodClones.forEach((req) => {
          this.attachRodMesh(req.group, req.scale);
        });
        this.pendingRodClones = [];
      },
      undefined,
      (err) => {
        console.warn("Could not load /assets/3d/boat/Fishing_Rod.fbx", err);
      }
    );
  }

  private applyBoatTheme(mesh: THREE.Mesh, theme: BoatThemeConfig) {
    const geom = mesh.geometry.clone();
    const uvs = geom.attributes.uv?.array;
    if (!uvs) return;

    const numVerts = uvs.length / 2;
    const colors = new Float32Array(numVerts * 3);

    const cMap = {
      hull: new THREE.Color(theme.hull),
      keel: new THREE.Color(theme.keel),
      stripe: new THREE.Color(theme.stripe),
      deck: new THREE.Color(theme.deck),
      aftFloor: new THREE.Color(theme.aftFloor),
      cabin: new THREE.Color(theme.cabin),
      roof: new THREE.Color(theme.roof),
      window: new THREE.Color(theme.window),
      console: new THREE.Color(theme.console),
      wheel: new THREE.Color(theme.wheel),
      seat: new THREE.Color(theme.seat),
      seatBase: new THREE.Color(theme.seatBase),
      engine: new THREE.Color(theme.engine),
      innerTrim: new THREE.Color(theme.innerTrim),
    };

    for (let i = 0; i < numVerts; i++) {
      const u = uvs[i * 2];
      const v = uvs[i * 2 + 1];
      let part: keyof BoatThemeConfig = "hull";

      if (Math.abs(u - 0.0997) < 0.02) part = "hull";
      else if (Math.abs(u - 0.053) < 0.02) part = "deck";
      else if (Math.abs(u - 0.3343) < 0.02) part = "cabin";
      else if (Math.abs(u - 0.7874) < 0.02 && v > 0.04) part = "roof";
      else if (Math.abs(u - 0.7952) < 0.02) part = "seat";
      else if (Math.abs(u - 0.8889) < 0.02) part = "seatBase";
      else if (Math.abs(u - 0.3108) < 0.02) part = "stripe";
      else if (Math.abs(u - 0.4358) < 0.02 && v < 0.02) part = "keel";
      else if (Math.abs(u - 0.4202) < 0.02) part = "engine";
      else if (Math.abs(u - 0.4496) < 0.02 && Math.abs(v - 0.0276) < 0.015) part = "aftFloor";
      else if (Math.abs(u - 0.5461) < 0.02) part = "innerTrim";
      else if (Math.abs(u - 0.0296) < 0.02) part = "wheel";
      else if (Math.abs(u - 0.2718) < 0.02) part = "console";
      else if (Math.abs(u - 0.2874) < 0.02) part = "cabin";
      else if (u > 0.89 && v > 0.04) part = "window";
      else if (
        Math.abs(u - 0.4124) < 0.02 ||
        Math.abs(u - 0.4358) < 0.02 ||
        Math.abs(u - 0.4514) < 0.02 ||
        Math.abs(u - 0.3499) < 0.02
      )
        part = "console";

      const col = cMap[part];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    mesh.geometry = geom;
    mesh.material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.42,
      metalness: 0.15,
    });
  }

  private attachBoatMesh(
    targetGroup: THREE.Group,
    scale: number = 0.013,
    theme: BoatThemeConfig = BOAT_THEMES.cruiser,
    rotYOffset: number = -Math.PI / 2
  ) {
    if (!this.boatPrototype) return;
    const model = this.boatPrototype.clone(true);
    // FBX length is along X (+X bow). Rotate -Math.PI / 2 around Y so bow points along +Z sailing direction!
    model.rotation.y = rotYOffset;
    model.scale.set(scale, scale, scale);
    model.position.set(0, 0.04, 0);

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.applyBoatTheme(mesh, theme);
      }
    });

    targetGroup.add(model);
  }

  private queueOrAttachBoat(
    targetGroup: THREE.Group,
    scale: number = 0.013,
    theme: BoatThemeConfig = BOAT_THEMES.cruiser,
    rotYOffset: number = -Math.PI / 2
  ) {
    if (this.boatPrototype) {
      this.attachBoatMesh(targetGroup, scale, theme, rotYOffset);
    } else {
      this.pendingBoatClones.push({
        group: targetGroup,
        scale,
        theme,
        rotYOffset,
      });
    }
  }

  private attachRodMesh(targetGroup: THREE.Group, scale: number = 0.012) {
    if (!this.rodPrototype) return;
    const model = this.rodPrototype.clone(true);
    model.scale.set(scale, scale, scale);
    model.rotation.set(Math.PI / 4.8, 0, 0);
    model.position.set(0, 0, 0);

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0x92400e,
          roughness: 0.45,
          metalness: 0.25,
        });
      }
    });

    targetGroup.add(model);
  }

  private queueOrAttachRod(targetGroup: THREE.Group, scale: number = 0.012) {
    if (this.rodPrototype) {
      this.attachRodMesh(targetGroup, scale);
    } else {
      this.pendingRodClones.push({ group: targetGroup, scale });
    }
  }

  // ===========================================================================
  // 1. MARKET STALLS & VENDORS (ADA YANG BERDAGANG)
  // ===========================================================================
  private spawnMarketStallsAndVendors() {
    // A. Toko Buah Tropis Mang Ujang (Central Plaza - West lawn arcade, facing inward toward plaza center)
    const ujangY = this.getGroundHeight(-8.0, 2.5);
    this.createMarketStall({
      pos: new THREE.Vector3(-8.0, ujangY, 2.5),
      rotY: Math.atan2(8.0, -2.5), // Faces inward toward center (0, 0)
      awningColor1: 0xef4444, // Red
      awningColor2: 0xfef08a, // Cream yellow
      signText: "🍎 BUAH SEGAR",
      stallType: "fruit",
    });

    this.registerNPC({
      id: "ujang",
      name: "Mang Ujang",
      title: "Pedagang Buah Tropis",
      island: "Central Plaza",
      pos: new THREE.Vector3(-8.0, ujangY, 2.5),
      avatar: "🍉",
      dialogue: [
        "Halo Milo! Wah, segar banget kan udara pulau hari ini?",
        "Mang Ujang jualan semangka manis, apel merah renyah, dan pisang tropis baru dipetik dari Voxel Bay!",
        "Makan buah bikin stamina sprint kamu makin kencang. Jangan lupa jelajahi pulau dan kumpulkan koin emas ya!"
      ],
    });

    // B. Kios Ramuan & Elixir Alchemist Luna (Central Plaza - West lawn arcade, facing inward toward plaza center)
    const lunaY = this.getGroundHeight(-8.0, -2.5);
    this.createMarketStall({
      pos: new THREE.Vector3(-8.0, lunaY, -2.5),
      rotY: Math.atan2(8.0, 2.5), // Faces inward toward center (0, 0)
      awningColor1: 0x7e22ce, // Purple
      awningColor2: 0xfacc15, // Gold
      signText: "🧪 ELIXIR & RAMUAN",
      stallType: "potion",
    });

    this.registerNPC({
      id: "luna",
      name: "Alchemist Luna",
      title: "Peracik Elixir Ajaib",
      island: "Central Plaza",
      pos: new THREE.Vector3(-8.0, lunaY, -2.5),
      avatar: "🧪",
      dialogue: [
        "Salam, penjelajah Milo! Butuh ramuan peningkat kelincahan?",
        "Elixir Kecepatan kami diseduh dengan esensi kristal kecubung dari Kuil MOBA Sanctuary.",
        "Gunakan tombol Shift untuk dash kilat melintasi jembatan gantung antar pulau!"
      ],
    });

    // C. Pondok Es Kelapa Muda Pantai (Central Plaza - North promenade lawn overlooking pier, facing inward)
    const rikoY = this.getGroundHeight(6.5, -10.0);
    this.createMarketStall({
      pos: new THREE.Vector3(6.5, rikoY, -10.0),
      rotY: Math.atan2(-6.5, 10.0), // Faces inward toward promenade
      awningColor1: 0x059669, // Emerald
      awningColor2: 0xfef3c7, // Warm ivory
      signText: "🥥 ES KELAPA PANTAI",
      stallType: "coconut",
    });

    this.registerNPC({
      id: "riko",
      name: "Riko si Barista Pantai",
      title: "Ahli Minuman Tropis",
      island: "Central Plaza Beach",
      pos: new THREE.Vector3(6.5, rikoY, -10.0),
      avatar: "🥥",
      dialogue: [
        "Yo Milo! Capek habis keliling kepulauan dan cetak gol di Beach Stadium?",
        "Duduk santai di tepi pantai sambil minum es kelapa muda dingin paling nikmat!",
        "Lihat ke arah dermaga, ada Pak Mamat yang lagi asyik mancing ikan di laut lepas."
      ],
    });
  }

  private createMarketStall(cfg: {
    pos: THREE.Vector3;
    rotY: number;
    awningColor1: number;
    awningColor2: number;
    signText: string;
    stallType: "fruit" | "potion" | "coconut";
  }) {
    const groundY = this.getGroundHeight(cfg.pos.x, cfg.pos.z);
    const actualY = groundY;
    const stallGroup = new THREE.Group();
    stallGroup.position.set(cfg.pos.x, actualY, cfg.pos.z);
    stallGroup.rotation.y = cfg.rotY;

    // 1. Wooden Counter Table
    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.0, 1.4), this.woodMat);
    counter.position.set(0, 0.5, 0);
    counter.castShadow = true;
    counter.receiveShadow = true;
    stallGroup.add(counter);

    // Front wood panel grooves
    const panelTrim = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.08, 1.5), this.darkWoodMat);
    panelTrim.position.set(0, 1.02, 0);
    stallGroup.add(panelTrim);

    // 2. Corner Wooden Posts supporting Awning (Height 2.9m for full headroom)
    const postGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.9, 8);
    for (const px of [-1.35, 1.35]) {
      for (const pz of [-0.6, 0.6]) {
        const post = new THREE.Mesh(postGeo, this.darkWoodMat);
        post.position.set(px, 1.45, pz);
        post.castShadow = true;
        stallGroup.add(post);
      }
    }

    // 3. Striped Canvas Awning (Canopy Roof at 2.85m height, preventing any head clipping)
    const awningGroup = new THREE.Group();
    awningGroup.position.set(0, 2.85, 0);

    const stripeWidth = 0.32;
    const numStripes = 9;
    const mat1 = new THREE.MeshStandardMaterial({ color: cfg.awningColor1, roughness: 0.65 });
    const mat2 = new THREE.MeshStandardMaterial({ color: cfg.awningColor2, roughness: 0.65 });

    for (let s = 0; s < numStripes; s++) {
      const sx = -1.44 + s * stripeWidth;
      const stripeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(stripeWidth, 0.08, 1.6),
        s % 2 === 0 ? mat1 : mat2
      );
      stripeMesh.position.set(sx + stripeWidth / 2, 0, 0);
      stripeMesh.rotation.x = 0.08; // Gentle forward slope
      stripeMesh.castShadow = true;
      awningGroup.add(stripeMesh);

      // Scalloped front edge drape
      const drape = new THREE.Mesh(
        new THREE.BoxGeometry(stripeWidth, 0.22, 0.04),
        s % 2 === 0 ? mat1 : mat2
      );
      drape.position.set(sx + stripeWidth / 2, -0.15, 0.8);
      awningGroup.add(drape);
    }
    stallGroup.add(awningGroup);

    // =========================================================================
    // LAMPU PENERANGAN WARUNG DI MALAM HARI
    // =========================================================================
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const lanternGlassMat = new THREE.MeshBasicMaterial({ color: 0xffedd5, transparent: true, opacity: 0.95 });

    // 1. Lampu Lentera Kuningan Gantung di Bawah Tenda Warung
    const hangingLantern = new THREE.Group();
    hangingLantern.position.set(0, 2.50, 0.15);

    // Rantai / tali gantung kayu gelap
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6), this.darkWoodMat);
    chain.position.y = 0.20;
    hangingLantern.add(chain);

    // Kap tudung kuningan
    const lanternHood = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.14, 8), brassMat);
    lanternHood.position.y = 0.05;
    hangingLantern.add(lanternHood);

    // Kaca lentera hangat
    const stallGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.095, 0.22, 8), lanternGlassMat.clone());
    stallGlass.position.y = -0.07;
    hangingLantern.add(stallGlass);

    // Titik cahaya keemasan menerangi meja dagangan
    const stallCenterLight = new THREE.PointLight(0xffa000, 0.0, 18, 1.8);
    stallCenterLight.position.y = -0.12;
    hangingLantern.add(stallCenterLight);

    stallGroup.add(hangingLantern);

    // 2. Untaian Lampu Hias Peri (Fairy String Lights) di Sepanjang Depan Kanopi
    const stringGroup = new THREE.Group();
    stringGroup.position.set(0, 2.68, 0.84);

    const bulbColors = [0xfef08a, 0xf472b6, 0x38bdf8, 0xfacc15, 0x4ade80];
    const bulbMeshes: THREE.Mesh[] = [];
    for (let b = 0; b < 5; b++) {
      const bx = -1.2 + b * 0.6;
      const bMat = new THREE.MeshBasicMaterial({ color: bulbColors[b % bulbColors.length], transparent: true, opacity: 0.95 });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), bMat);
      bulb.position.set(bx, Math.sin(b * 0.8) * 0.04 - 0.06, 0);
      stringGroup.add(bulb);
      bulbMeshes.push(bulb);
    }

    const frontStallLight = new THREE.PointLight(0xffb74d, 0.0, 15, 1.8);
    frontStallLight.position.set(0, -0.12, 0.25);
    stringGroup.add(frontStallLight);

    stallGroup.add(stringGroup);

    // Daftarkan lampu warung ke Weather Manager
    if (this.weatherManager) {
      this.weatherManager.registerLamp(stallCenterLight, stallGlass, 3.4, 1.2);
      this.weatherManager.registerLamp(frontStallLight, bulbMeshes, 2.6, 0.9);
    }

    // 4. Stall Products on Counter
    if (cfg.stallType === "fruit") {
      // 3 Crates with Apples, Watermelons, and Coconuts
      for (let c = -1; c <= 1; c++) {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 0.5), this.darkWoodMat);
        crate.position.set(c * 0.9, 1.15, 0.1);
        crate.rotation.x = -0.2;
        stallGroup.add(crate);
      }
      // Watermelons (Green spheres)
      const melonMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
      for (let m = 0; m < 3; m++) {
        const melon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), melonMat);
        melon.position.set(-0.9 + (m - 1) * 0.22, 1.30, 0.1);
        stallGroup.add(melon);
      }
      // Red Apples
      const appleMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 });
      for (let a = 0; a < 6; a++) {
        const apple = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), appleMat);
        apple.position.set((a % 3 - 1) * 0.2, 1.25 + Math.floor(a / 3) * 0.12, 0.1);
        stallGroup.add(apple);
      }
      // Yellow Bananas / Tropical Citrus
      const citrusMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
      for (let ct = 0; ct < 5; ct++) {
        const orange = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), citrusMat);
        orange.position.set(0.9 + (ct % 3 - 1) * 0.2, 1.25, 0.1);
        stallGroup.add(orange);
      }
    } else if (cfg.stallType === "potion") {
      // Glowing Alchemy Flasks
      const cyanFlask = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.15, 0.32, 10),
        new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 1.4, roughness: 0.2 })
      );
      cyanFlask.position.set(-0.7, 1.22, 0.1);
      stallGroup.add(cyanFlask);

      const pinkFlask = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.16, 0.35, 10),
        new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xdb2777, emissiveIntensity: 1.4, roughness: 0.2 })
      );
      pinkFlask.position.set(0, 1.24, 0.1);
      stallGroup.add(pinkFlask);

      const amberFlask = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.14, 0.30, 10),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 1.4, roughness: 0.2 })
      );
      amberFlask.position.set(0.7, 1.21, 0.1);
      stallGroup.add(amberFlask);

      // Bubbling Alchemist Cauldron beside stall
      const cauldron = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 0.55, 14),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 })
      );
      cauldron.position.set(-1.9, 0.3, 0.2);
      stallGroup.add(cauldron);

      const potionLiquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.05, 14),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 1.5 })
      );
      potionLiquid.position.set(-1.9, 0.52, 0.2);
      stallGroup.add(potionLiquid);
    } else if (cfg.stallType === "coconut") {
      // Tiki Coconuts with straws
      const cocoMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.7 });
      for (let c = -1; c <= 1; c++) {
        const coco = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), cocoMat);
        coco.position.set(c * 0.65, 1.24, 0.1);
        stallGroup.add(coco);

        const straw = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6),
          new THREE.MeshStandardMaterial({ color: 0xf43f5e })
        );
        straw.position.set(c * 0.65 + 0.05, 1.45, 0.1);
        straw.rotation.z = 0.2;
        stallGroup.add(straw);
      }
    }

    bakeStatic(stallGroup); // the stall is fixed; the vendor is added after, so it stays animated

    // 5. Vendor 3D KayKit Character behind counter (Z = -0.90)
    const vendorGroup = new THREE.Group();
    vendorGroup.position.set(0, 0, -0.90);
    // Counter faces +Z, vendor faces +Z
    vendorGroup.rotation.y = 0;

    if (this.characterManager) {
      const tint = cfg.stallType === "fruit" ? 0x16a34a : cfg.stallType === "potion" ? 0x7e22ce : 0x0284c7;
      this.characterManager.spawnCharacter({
        id: `vendor_${cfg.stallType}`,
        name: `Vendor ${cfg.stallType}`,
        pos: new THREE.Vector3(0, 0, 0),
        rotY: 0,
        scale: 0.95,
        tintColor: tint,
        initialAnim: cfg.stallType === "fruit" ? "Interact" : "Idle_A",
        targetGroup: vendorGroup,
      });
    }

    stallGroup.add(vendorGroup);

    this.scene.add(stallGroup);
    this.colliders.push({ x: cfg.pos.x, z: cfg.pos.z, radius: 1.8, label: "market_stall" });
  }

  // ===========================================================================
  // 2. FISHERMEN (ADA YANG SEDANG MANCING)
  // ===========================================================================
  private spawnFishermen() {
    // Spot 1: Pak Mamat sitting at Central Plaza North Pier facing open sea (North / -Z)
    this.createPierFisherman({
      pos: new THREE.Vector3(0, 0.80, -32.5),
      rotY: Math.PI,
      name: "Pak Mamat",
    });

    this.registerNPC({
      id: "mamat",
      name: "Pak Mamat the Veteran Angler",
      title: "Master Nelayan Kepulauan",
      island: "Central Plaza Pier",
      pos: new THREE.Vector3(0, 0.80, -32.5),
      avatar: "🎣",
      dialogue: [
        "Ssshh... pelan-pelan Milo! Ikan kakap emasnya lagi mengendus umpan nih!",
        "Dermaga utara ini tempat terbaik memancing di seluruh kepulauan D Lucky X.",
        "Suara deburan ombak dan semilir angin laut bikin hati tenang dan pikiran jernih."
      ],
    });
  }

  private createPierFisherman(cfg: { pos: THREE.Vector3; rotY: number; name: string }) {
    const group = new THREE.Group();
    group.position.copy(cfg.pos);
    group.rotation.y = cfg.rotY;

    if (this.characterManager) {
      this.characterManager.spawnCharacter({
        id: "fisherman_pier",
        name: cfg.name,
        pos: new THREE.Vector3(0, 0, 0),
        rotY: 0,
        scale: 1.0,
        tintColor: 0x0284c7,
        initialAnim: "Idle_B",
        targetGroup: group,
      });
    }

    // 3D Fishing Rod from folder assets/3d/boat
    const rodGroup = new THREE.Group();
    rodGroup.position.set(0.22, 0.65, 0.28);
    this.queueOrAttachRod(rodGroup, 0.010);
    group.add(rodGroup);

    // Fishing Tackle Box & Bucket behind him on the pier deck (-Z in local space)
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.4), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    box.position.set(0.65, 0.18, -0.65);
    group.add(box);

    const bucket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.2, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5, roughness: 0.4 })
    );
    bucket.position.set(-0.65, 0.22, -0.65);
    group.add(bucket);

    // Fish tail sticking out of bucket!
    const fishTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.3, 6),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
    );
    fishTail.position.set(-0.65, 0.48, -0.65);
    fishTail.rotation.z = 0.4;
    group.add(fishTail);



    this.scene.add(group);

    // Calculate rod tip in world space
    const localTip = new THREE.Vector3(0.22, 0.65 + 3.0 * Math.cos(Math.PI / 4.8), 0.28 + 3.0 * Math.sin(Math.PI / 4.8));
    const worldTip = localTip.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), cfg.rotY).add(group.position);

    // Fishing Line & Floating Bobber on the water
    const bobber = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 })
    );
    // Lower half white
    const bobberWhite = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.02, 0.12, 10),
      this.whiteMat
    );
    bobberWhite.position.y = -0.08;
    bobber.add(bobberWhite);

    const forwardDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), cfg.rotY);
    const bobberPos = group.position.clone().add(forwardDir.clone().multiplyScalar(6.5));
    bobberPos.y = 0.15;
    bobber.position.copy(bobberPos);
    this.scene.add(bobber);

    // Line from rod tip to bobber
    const lineGeo = new THREE.BufferGeometry().setFromPoints([worldTip, bobber.position]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
    const line = new THREE.Line(lineGeo, lineMat);
    this.scene.add(line);

    // Animated Jumping Fish near the bobber
    const fishGeo = new THREE.ConeGeometry(0.16, 0.6, 6);
    fishGeo.rotateZ(Math.PI / 2);
    const jumpingFish = new THREE.Mesh(
      fishGeo,
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.4, roughness: 0.3 })
    );
    jumpingFish.visible = false;
    this.scene.add(jumpingFish);

    this.fishingSpots.push({
      group,
      rodTip: worldTip,
      bobber,
      line,
      jumpingFish,
      fishTimer: 4.0,
      isFishJumping: false,
      fishProgress: 0,
    });
  }

  private createRockFisherman(cfg: { pos: THREE.Vector3; rotY: number; name: string }) {
    const groundY = this.getGroundHeight(cfg.pos.x, cfg.pos.z);
    const actualY = Math.max(cfg.pos.y, groundY);
    const group = new THREE.Group();
    group.position.set(cfg.pos.x, actualY, cfg.pos.z);
    group.rotation.y = cfg.rotY;

    if (this.characterManager) {
      this.characterManager.spawnCharacter({
        id: "fisherman_rock",
        name: cfg.name,
        pos: new THREE.Vector3(0, 0, 0),
        rotY: 0,
        scale: 1.0,
        tintColor: 0xd97706,
        initialAnim: "Idle_A",
        targetGroup: group,
      });
    }

    // Bamboo Fishing Rod held in hands, angled forward towards the sea (+Z in group local space)
    const rodGroup = new THREE.Group();
    rodGroup.position.set(0.22, 0.65, 0.28);
    rodGroup.rotation.x = Math.PI / 4.8;

    const bambooMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.045, 3.4, 8), bambooMat);
    rod.position.set(0, 1.6, 0);
    rodGroup.add(rod);

    const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), this.goldMat);
    reel.position.set(0.05, 0.35, 0);
    reel.rotation.z = Math.PI / 2;
    rodGroup.add(reel);

    group.add(rodGroup);

    // Fishing Tackle Box & Bucket behind him on the rock (-Z in local space)
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.4), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    box.position.set(0.65, 0.18, -0.65);
    group.add(box);

    const bucket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.2, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5, roughness: 0.4 })
    );
    bucket.position.set(-0.65, 0.22, -0.65);
    group.add(bucket);

    this.scene.add(group);

    // Calculate rod tip in world space
    const localTip = new THREE.Vector3(0.22, 0.65 + 3.2 * Math.cos(Math.PI / 4.8), 0.28 + 3.2 * Math.sin(Math.PI / 4.8));
    const worldTip = localTip.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), cfg.rotY).add(group.position);

    // Floating bobber in the sea below the cliff
    const forwardDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), cfg.rotY);
    const bobber = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 })
    );
    const bobberWhite = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.02, 0.12, 10),
      this.whiteMat
    );
    bobberWhite.position.y = -0.08;
    bobber.add(bobberWhite);

    const bobberPos = group.position.clone().add(forwardDir.clone().multiplyScalar(7.5));
    bobberPos.y = 0.15;
    bobber.position.copy(bobberPos);
    this.scene.add(bobber);

    // Fishing line from rod tip down to bobber
    const lineGeo = new THREE.BufferGeometry().setFromPoints([worldTip, bobber.position]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
    const line = new THREE.Line(lineGeo, lineMat);
    this.scene.add(line);

    // Animated Jumping Fish near the bobber
    const fishGeo = new THREE.ConeGeometry(0.16, 0.6, 6);
    fishGeo.rotateZ(Math.PI / 2);
    const jumpingFish = new THREE.Mesh(
      fishGeo,
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.4, roughness: 0.3 })
    );
    jumpingFish.visible = false;
    this.scene.add(jumpingFish);

    this.fishingSpots.push({
      group,
      rodTip: worldTip,
      bobber,
      line,
      jumpingFish,
      fishTimer: 5.5,
      isFishJumping: false,
      fishProgress: 0,
    });
  }

  // ===========================================================================
  // 3. BOATS (DESAIN KAPAL & PERAHU MEWAH, VIBRAN, DAN TIDAK POLOS)
  // ===========================================================================
  private spawnBoats() {
    // A. Perahu Utama Samudra "Dewi Samudra" (The Grand Oceanic Flagship Cruiser)
    // Berlayar di Samudra Luas mengelilingi kepulauan (clearance aman 35m+ dari daratan & jembatan)
    this.createSailboat({
      waypoints: [
        new THREE.Vector3(0, 0.18, -145),     // Teluk Utara Lepas (antara Kuil MOBA & Outpost)
        new THREE.Vector3(125, 0.18, -115),   // Tebing Timur Laut (jauh di luar mercusuar BR)
        new THREE.Vector3(145, 0.18, 0),      // Selat Samudra Timur
        new THREE.Vector3(120, 0.18, 120),    // Laut Tenggara (jauh di luar Stadion Sepak Bola)
        new THREE.Vector3(0, 0.18, 145),      // Samudra Selatan Lepas
        new THREE.Vector3(-120, 0.18, 120),   // Laut Barat Daya (jauh di luar Voxel Bay)
        new THREE.Vector3(-145, 0.18, 0),     // Selat Samudra Barat
        new THREE.Vector3(-125, 0.18, -115),  // Laut Barat Laut (jauh di luar Kuil MOBA)
      ],
      speed: 6.8,
      phase: 0,
      theme: BOAT_THEMES.cruiser,
    });

    // B. Perahu Motor Nelayan "Nelayan Nusantara" (Fishing Boat)
    // Berpatroli di Teluk Utara di depan Dermaga Pancing Pak Mamat (100% air dalam, bebas pulau)
    this.createMotorboat({
      waypoints: [
        new THREE.Vector3(28, 0.18, -50),
        new THREE.Vector3(0, 0.18, -52),
        new THREE.Vector3(-28, 0.18, -50),
        new THREE.Vector3(-32, 0.18, -78),
        new THREE.Vector3(0, 0.18, -96),
        new THREE.Vector3(32, 0.18, -78),
      ],
      speed: 6.2,
      phase: 0,
      theme: BOAT_THEMES.fisherman,
      role: "fisherman",
    });

    // C. Perahu Turis Laguna "Laguna Safari" (South Bay Safari Cruiser)
    // Berpatroli di Laguna Selatan antara Central Plaza, Voxel Bay & Stadion (100% air dalam)
    this.createMotorboat({
      waypoints: [
        new THREE.Vector3(-24, 0.18, 52),
        new THREE.Vector3(0, 0.18, 55),
        new THREE.Vector3(24, 0.18, 52),
        new THREE.Vector3(28, 0.18, 78),
        new THREE.Vector3(0, 0.18, 92),
        new THREE.Vector3(-28, 0.18, 78),
      ],
      speed: 5.6,
      phase: Math.PI,
      theme: BOAT_THEMES.lagoon,
      role: "lagoon",
    });

    // D. Perahu Dayung Bersandar di Dermaga "Sampan Dermaga" (Authentic Moored Teak Sampan)
    this.createMooredRowboat(new THREE.Vector3(2.6, 0.15, -28.0), BOAT_THEMES.moored);
  }

  private createCruiserAccessories(hullGroup: THREE.Group): THREE.Mesh[] {
    const flagMeshes: THREE.Mesh[] = [];

    // A. Indonesian / Maritime Flagstaff at Stern
    const staffMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.6 });
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 2.4, 8), staffMat);
    staff.position.set(0, 1.8, -3.7);
    staff.rotation.x = -0.15;
    hullGroup.add(staff);

    // Gold Finial Ball
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), this.goldMat);
    finial.position.set(0, 1.2, 0);
    staff.add(finial);

    // Indonesian Merah Putih Maritime Flag
    const flagGroup = new THREE.Group();
    flagGroup.position.set(0, 0.85, 0);

    const redStripe = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, side: THREE.DoubleSide })
    );
    redStripe.position.set(0.38, 0.11, 0);
    redStripe.rotation.y = Math.PI / 2;

    const whiteStripe = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    whiteStripe.position.set(0.38, -0.11, 0);
    whiteStripe.rotation.y = Math.PI / 2;

    flagGroup.add(redStripe, whiteStripe);
    staff.add(flagGroup);
    flagMeshes.push(redStripe, whiteStripe);

    // B. Navigation Lights (Port Red, Starboard Green, Masthead Warm Beacon)
    const portLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.15, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.85 })
    );
    portLight.position.set(-1.62, 1.35, 1.1);
    hullGroup.add(portLight);

    const stbdLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.15, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.85 })
    );
    stbdLight.position.set(1.62, 1.35, 1.1);
    hullGroup.add(stbdLight);

    const mastBeacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.16, 8),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.9 })
    );
    mastBeacon.position.set(0, 2.7, 0.45);
    hullGroup.add(mastBeacon);

    // C. Realistic Orange & White Lifebuoys on Cabin Port & Starboard
    for (const bx of [-1.22, 1.22]) {
      const buoyGroup = new THREE.Group();
      buoyGroup.position.set(bx, 1.45, 0.8);
      buoyGroup.rotation.y = Math.PI / 2;

      const mainTorus = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.075, 10, 20),
        new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
      );
      buoyGroup.add(mainTorus);

      for (let a = 0; a < 4; a++) {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.11, 0.16, 0.04),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
        );
        strap.rotation.z = (a * Math.PI) / 2;
        strap.position.set(Math.cos(strap.rotation.z) * 0.28, Math.sin(strap.rotation.z) * 0.28, 0);
        buoyGroup.add(strap);
      }
      hullGroup.add(buoyGroup);
    }

    // D. Captain at Helm (Inside wheelhouse)
    const captain = new THREE.Group();
    captain.position.set(0, 0.55, 0.6);

    const capBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.28, 0.7, 10),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
    );
    capBody.position.y = 0.35;
    captain.add(capBody);

    for (const by of [0.25, 0.4, 0.55]) {
      const btn = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), this.goldMat);
      btn.position.set(0, by, 0.25);
      captain.add(btn);
    }

    const capHead = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), this.skinMat);
    capHead.position.y = 0.85;
    captain.add(capHead);

    const capHat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.28, 0.14, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    capHat.position.y = 1.0;
    captain.add(capHat);

    const capVisor = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.04, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 })
    );
    capVisor.position.set(0, 0.94, 0.2);
    captain.add(capVisor);

    hullGroup.add(captain);

    return flagMeshes;
  }

  private createFishermanAccessories(hullGroup: THREE.Group): THREE.Mesh[] {
    const flagMeshes: THREE.Mesh[] = [];

    // A. Dual Fishing Rods at the Stern Quarters
    for (const side of [-1, 1]) {
      const rodHolder = new THREE.Group();
      rodHolder.position.set(side * 1.35, 1.25, -3.2);
      rodHolder.rotation.set(-0.55, side * 0.35, 0);

      const socket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
      );
      rodHolder.add(socket);

      const rodShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.03, 2.6, 6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      );
      rodShaft.position.y = 1.2;
      rodHolder.add(rodShaft);

      const reel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7 })
      );
      reel.position.set(0, 0.35, 0.06);
      reel.rotation.z = Math.PI / 2;
      rodHolder.add(reel);

      hullGroup.add(rodHolder);
    }

    // B. Wooden Fish Crates on the Aft Deck
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 });
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.32, 0.5), crateMat);
    crate.position.set(-0.45, 0.72, -2.2);
    hullGroup.add(crate);

    const fishMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
    for (let f = 0; f < 3; f++) {
      const fish = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 5), fishMat);
      fish.position.set(-0.45 + (f - 1) * 0.14, 0.89, -2.2);
      fish.rotation.set(Math.PI / 2, 0, f * 0.4);
      hullGroup.add(fish);
    }

    // Wooden Barrel
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.22, 0.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    barrel.position.set(0.5, 0.78, -2.2);
    hullGroup.add(barrel);

    // C. Brass Fisherman Deck Lantern
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(0, 1.85, -0.9);
    const lanternBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.09, 0.18, 8),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.85 })
    );
    lanternGroup.add(lanternBody);
    hullGroup.add(lanternGroup);

    // D. Rooftop Fisherman Pennant Flag
    const pennantPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.9, 6),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    pennantPole.position.set(0, 2.7, 0.5);
    hullGroup.add(pennantPole);

    const pennant = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.55, 3),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, side: THREE.DoubleSide })
    );
    pennant.position.set(0.26, 0.3, 0);
    pennant.rotation.z = -Math.PI / 2;
    pennantPole.add(pennant);
    flagMeshes.push(pennant);

    return flagMeshes;
  }

  private createLagoonAccessories(hullGroup: THREE.Group): THREE.Mesh[] {
    const flagMeshes: THREE.Mesh[] = [];

    // A. Island Safari Sun Bimini Canopy over Aft Deck
    const biminiGroup = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
    for (const px of [-1.15, 1.15]) {
      for (const pz of [-1.1, -2.7]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 6), poleMat);
        pole.position.set(px, 1.35, pz);
        biminiGroup.add(pole);
      }
    }

    const canopyRoof = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.06, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.6 })
    );
    canopyRoof.position.set(0, 2.05, -1.9);
    biminiGroup.add(canopyRoof);

    const fringe = new THREE.Mesh(
      new THREE.BoxGeometry(2.44, 0.12, 1.84),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
    );
    fringe.position.set(0, 2.0, -1.9);
    biminiGroup.add(fringe);

    hullGroup.add(biminiGroup);

    // B. Rubbing Fenders on side gunwales
    const fenderMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    for (const fx of [-1.48, 1.48]) {
      for (const fz of [-0.5, -2.2]) {
        const fender = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 8), fenderMat);
        fender.position.set(fx, 1.05, fz);
        hullGroup.add(fender);
      }
    }

    // C. Tropical Expedition Pennant
    const pennantPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    pennantPole.position.set(0, 2.5, 1.8);
    hullGroup.add(pennantPole);

    const pennant = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.5, 3),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, side: THREE.DoubleSide })
    );
    pennant.position.set(0.24, 0.25, 0);
    pennant.rotation.z = -Math.PI / 2;
    pennantPole.add(pennant);
    flagMeshes.push(pennant);

    return flagMeshes;
  }

  private createMooredSampanAccessories(boatGroup: THREE.Group, hullGroup: THREE.Group, pos: THREE.Vector3) {
    // A. Sepasang Dayung Kayu (Pair of Handcrafted Wooden Oars)
    const oarMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });

    for (const [side, angleZ] of [[-1, 0.25], [1, -0.22]] as const) {
      const oar = new THREE.Group();
      oar.position.set(side * 0.25, 0.72, -0.2);
      oar.rotation.set(0.12, side * 0.4, angleZ);

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.025, 1.9, 8), oarMat);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.018, 0.45), bladeMat);
      blade.position.y = -0.92;
      oar.add(shaft, blade);
      hullGroup.add(oar);
    }

    // B. Wicker Fish Basket
    const basket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.28, 8),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 })
    );
    basket.position.set(0.4, 0.65, 0.8);
    hullGroup.add(basket);

    // C. 3D Braided Mooring Rope (Tali Tambat Dermaga)
    const bowBitWorld = new THREE.Vector3(pos.x + 0.1, 0.42, pos.z + 1.8);
    const dockPostWorld = new THREE.Vector3(pos.x - 0.4, 0.75, -27.2);
    const midSag = new THREE.Vector3(
      (bowBitWorld.x + dockPostWorld.x) * 0.5,
      Math.min(bowBitWorld.y, dockPostWorld.y) - 0.15,
      (bowBitWorld.z + dockPostWorld.z) * 0.5
    );

    const ropeCurve = new THREE.CatmullRomCurve3([bowBitWorld, midSag, dockPostWorld]);
    const ropeGeo = new THREE.TubeGeometry(ropeCurve, 12, 0.03, 6, false);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd4b996, roughness: 0.95 });
    const ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
    this.scene.add(ropeMesh);
  }

  private createBoatWake(boat: CruisingBoat) {
    const wakeRings: Array<{ mesh: THREE.Mesh; timer: number; maxLife: number }> = [];
    const ringGeo = new THREE.RingGeometry(0.35, 0.75, 14);
    ringGeo.rotateX(-Math.PI / 2);

    for (let i = 0; i < 5; i++) {
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.position.set(0, -999, 0);
      this.scene.add(mesh);
      wakeRings.push({
        mesh,
        timer: (i / 5) * 1.5,
        maxLife: 1.5,
      });
    }
    boat.wakeRings = wakeRings;
  }

  private createSailboat(cfg: {
    waypoints?: THREE.Vector3[];
    centerX?: number;
    centerZ?: number;
    radiusX?: number;
    radiusZ?: number;
    speed: number;
    phase: number;
    theme?: BoatThemeConfig;
  }) {
    const boat = new THREE.Group();
    const hullGroup = new THREE.Group();
    boat.add(hullGroup);

    let spline: THREE.CatmullRomCurve3 | undefined;
    let splineLength: number | undefined;
    let splineProgress: number = 0;

    if (cfg.waypoints && cfg.waypoints.length > 2) {
      spline = new THREE.CatmullRomCurve3(cfg.waypoints, true, "catmullrom", 0.5);
      splineLength = spline.getLength();
      splineProgress = (cfg.phase / (Math.PI * 2)) % 1.0;
      const initialPt = spline.getPointAt(splineProgress);
      boat.position.set(initialPt.x, 0.18, initialPt.z);
    } else if (cfg.waypoints && cfg.waypoints.length > 0) {
      boat.position.copy(cfg.waypoints[0]);
    }

    // Attach Authentic 3D Boat Model with Luxury Yacht Theme
    this.queueOrAttachBoat(hullGroup, 0.016, cfg.theme ?? BOAT_THEMES.cruiser);

    // Add Cruiser Accessories (Flag, Lanterns, Captain, Lifebuoys)
    const flagMeshes = this.createCruiserAccessories(hullGroup);

    this.scene.add(boat);

    const boatRecord: CruisingBoat = {
      group: boat,
      hullGroup,
      type: "sailboat",
      waypoints: cfg.waypoints,
      spline,
      splineLength,
      splineProgress,
      currentYaw: 0,
      turnBank: 0,
      currentWaypointIdx: 0,
      radiusX: cfg.radiusX ?? 0,
      radiusZ: cfg.radiusZ ?? 0,
      centerX: cfg.centerX ?? 0,
      centerZ: cfg.centerZ ?? 0,
      speed: cfg.speed,
      phase: cfg.phase,
      flagMeshes,
    };

    this.createBoatWake(boatRecord);
    this.boats.push(boatRecord);
  }

  private createMotorboat(cfg: {
    waypoints?: THREE.Vector3[];
    centerX?: number;
    centerZ?: number;
    radiusX?: number;
    radiusZ?: number;
    speed: number;
    phase: number;
    theme?: BoatThemeConfig;
    role?: "fisherman" | "lagoon";
  }) {
    const boat = new THREE.Group();
    const hullGroup = new THREE.Group();
    boat.add(hullGroup);

    let spline: THREE.CatmullRomCurve3 | undefined;
    let splineLength: number | undefined;
    let splineProgress: number = 0;

    if (cfg.waypoints && cfg.waypoints.length > 2) {
      spline = new THREE.CatmullRomCurve3(cfg.waypoints, true, "catmullrom", 0.5);
      splineLength = spline.getLength();
      splineProgress = (cfg.phase / (Math.PI * 2)) % 1.0;
      const initialPt = spline.getPointAt(splineProgress);
      boat.position.set(initialPt.x, 0.18, initialPt.z);
    } else if (cfg.waypoints && cfg.waypoints.length > 0) {
      boat.position.copy(cfg.waypoints[0]);
    }

    // Attach Model with Multi-Color Themed Palette
    this.queueOrAttachBoat(hullGroup, 0.0135, cfg.theme ?? BOAT_THEMES.fisherman);

    // Decorate with distinct role-specific accessories
    let flagMeshes: THREE.Mesh[] = [];
    if (cfg.role === "fisherman") {
      flagMeshes = this.createFishermanAccessories(hullGroup);
    } else if (cfg.role === "lagoon") {
      flagMeshes = this.createLagoonAccessories(hullGroup);
    }

    this.scene.add(boat);

    const boatRecord: CruisingBoat = {
      group: boat,
      hullGroup,
      type: "motorboat",
      waypoints: cfg.waypoints,
      spline,
      splineLength,
      splineProgress,
      currentYaw: 0,
      turnBank: 0,
      currentWaypointIdx: 0,
      radiusX: cfg.radiusX ?? 0,
      radiusZ: cfg.radiusZ ?? 0,
      centerX: cfg.centerX ?? 0,
      centerZ: cfg.centerZ ?? 0,
      speed: cfg.speed,
      phase: cfg.phase,
      flagMeshes,
    };

    this.createBoatWake(boatRecord);
    this.boats.push(boatRecord);
  }

  private createMooredRowboat(pos: THREE.Vector3, theme: BoatThemeConfig = BOAT_THEMES.moored) {
    const boat = new THREE.Group();
    const hullGroup = new THREE.Group();
    boat.add(hullGroup);
    boat.position.copy(pos);
    boat.rotation.y = 0.2;

    // Authentic 3D Boat Model with Handcrafted Teak Wood Theme
    this.queueOrAttachBoat(hullGroup, 0.0115, theme, -Math.PI / 2 + 0.15);

    // Add Pier Mooring Accessories (Braided Rope to Dock, Oars, Fish Basket)
    this.createMooredSampanAccessories(boat, hullGroup, pos);

    this.scene.add(boat);

    this.boats.push({
      group: boat,
      hullGroup,
      type: "rowboat",
      radiusX: 0,
      radiusZ: 0,
      centerX: pos.x,
      centerZ: pos.z,
      speed: 0,
      phase: 0,
    });
  }

  // ===========================================================================
  // 4. WALKING PEDESTRIANS (LALU LALANG ORANG BERJALAN)
  // ===========================================================================
  private spawnPedestrians() {
    // Pedestrian 1: Nadia (Tourist circling Central Plaza promenade)
    this.createWalkingPedestrian({
      name: "Nadia",
      shirtColor: 0xec4899, // Pink
      pantsColor: 0x0284c7, // Denim blue
      hairColor: 0x92400e,  // Chestnut brown
      hat: "sunhat",
      speed: 2.4,
      waypoints: [
        new THREE.Vector3(12, 4.80, 0),
        new THREE.Vector3(8, 4.80, 11),
        new THREE.Vector3(-8, 4.80, 11),
        new THREE.Vector3(-12, 4.80, 0),
        new THREE.Vector3(-8, 4.80, -11),
        new THREE.Vector3(8, 4.80, -11),
      ],
    });

    // Pedestrian 2: Kenji (Bridge Jogger running to Soccer Arena)
    this.createWalkingPedestrian({
      name: "Kenji",
      shirtColor: 0xdc2626, // Red athletic shirt
      pantsColor: 0xf8fafc, // White sport shorts
      hairColor: 0x1e293b,  // Dark hair
      hat: "headband",
      speed: 3.8, // Brisk jog
      waypoints: [
        new THREE.Vector3(14, 4.80, 14),
        new THREE.Vector3(26, 4.20, 26),
        new THREE.Vector3(42, 3.20, 42),
        new THREE.Vector3(55, 2.60, 52),
        new THREE.Vector3(42, 3.20, 42),
        new THREE.Vector3(26, 4.20, 26),
      ],
    });

    // Pedestrian 3: Hana (Scholar walking to MOBA Sanctuary)
    this.createWalkingPedestrian({
      name: "Hana",
      shirtColor: 0x2563eb, // Royal blue
      pantsColor: 0x475569, // Slate
      hairColor: 0xf59e0b,  // Blonde
      hat: "beret",
      speed: 2.2,
      waypoints: [
        new THREE.Vector3(-14, 4.80, -14),
        new THREE.Vector3(-28, 5.40, -28),
        new THREE.Vector3(-45, 6.20, -45),
        new THREE.Vector3(-60, 6.60, -55),
        new THREE.Vector3(-45, 6.20, -45),
        new THREE.Vector3(-28, 5.40, -28),
      ],
    });

    // Pedestrian 4: Budi (Beach Stroller exploring sandy shore)
    this.createWalkingPedestrian({
      name: "Budi",
      shirtColor: 0xfacc15, // Yellow polo
      pantsColor: 0xd97706, // Khaki
      hairColor: 0x451a03,  // Brown
      hat: "cap",
      speed: 2.0,
      waypoints: [
        new THREE.Vector3(18, 1.40, -14),
        new THREE.Vector3(14, 1.40, -24),
        new THREE.Vector3(5, 1.40, -27),
        new THREE.Vector3(-5, 1.40, -27),
        new THREE.Vector3(-15, 1.40, -22),
        new THREE.Vector3(-5, 1.40, -27),
        new THREE.Vector3(5, 1.40, -27),
        new THREE.Vector3(14, 1.40, -24),
      ],
    });

    // Pedestrian 5: Maya (Messenger walking towards Voxel Bay)
    this.createWalkingPedestrian({
      name: "Maya",
      shirtColor: 0x10b981, // Emerald green
      pantsColor: 0x1e293b, // Dark navy
      hairColor: 0x78350f,  // Auburn
      hat: "none",
      speed: 2.6,
      waypoints: [
        new THREE.Vector3(-12, 4.80, 14),
        new THREE.Vector3(-24, 4.80, 28),
        new THREE.Vector3(-38, 4.70, 42),
        new THREE.Vector3(-50, 4.70, 56),
        new THREE.Vector3(-38, 4.70, 42),
        new THREE.Vector3(-24, 4.80, 28),
      ],
    });
  }

  private createWalkingPedestrian(cfg: {
    name: string;
    shirtColor: number;
    pantsColor: number;
    hairColor: number;
    hat: "sunhat" | "headband" | "beret" | "cap" | "none";
    speed: number;
    waypoints: THREE.Vector3[];
  }) {
    const group = new THREE.Group();
    group.position.copy(cfg.waypoints[0]);

    if (this.characterManager) {
      // Spawn authentic KayKit 3D humanoid character with Walking_A skeletal animation
      this.characterManager.spawnCharacter({
        id: `ped_${cfg.name.toLowerCase()}`,
        name: cfg.name,
        pos: new THREE.Vector3(0, 0, 0),
        rotY: 0,
        scale: 0.95,
        tintColor: cfg.shirtColor,
        initialAnim: "Walking_A",
        targetGroup: group,
      });
    }

    this.scene.add(group);

    this.pedestrians.push({
      group,
      waypoints: cfg.waypoints,
      currentWaypointIdx: 0,
      speed: cfg.speed,
      walkCycle: Math.random() * Math.PI * 2,
      name: cfg.name,
    });
  }

  // ===========================================================================
  // 5. SEAGULLS & DOLPHINS (SATWA & KEHIDUPAN ALAMI)
  // ===========================================================================
  private spawnSeagulls() {
    for (let i = 0; i < 7; i++) {
      const gull = new THREE.Group();

      // Body
      const body = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.8, 6),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 })
      );
      body.rotation.x = Math.PI / 2;
      gull.add(body);

      // Yellow Beak
      const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.25, 4),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
      );
      beak.rotation.x = -Math.PI / 2;
      beak.position.set(0, 0, -0.48);
      gull.add(beak);

      // Left Wing
      const wingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
      const wingL = new THREE.Group();
      wingL.position.set(-0.12, 0.05, 0);
      const wingMeshL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.35), wingMat);
      wingMeshL.position.set(-0.42, 0, 0);
      wingL.add(wingMeshL);
      gull.add(wingL);

      // Right Wing
      const wingR = new THREE.Group();
      wingR.position.set(0.12, 0.05, 0);
      const wingMeshR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.35), wingMat);
      wingMeshR.position.set(0.42, 0, 0);
      wingR.add(wingMeshR);
      gull.add(wingR);

      this.scene.add(gull);

      this.seagulls.push({
        group: gull,
        wingL,
        wingR,
        baseRadius: 65 + i * 8,
        altitude: 16 + (i % 3) * 4,
        speed: 0.28 + (i % 2) * 0.06,
        phase: (i / 7) * Math.PI * 2,
      });
    }
  }

  private spawnDolphins() {
    const dolphin = new THREE.Group();

    // Curved Dolphin Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.45, 1.8, 10),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.3, roughness: 0.4 })
    );
    body.rotation.x = Math.PI / 2;
    dolphin.add(body);

    // Snout / Beak
    const snout = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.3, roughness: 0.4 })
    );
    snout.rotation.x = -Math.PI / 2;
    snout.position.set(0, 0, -1.05);
    dolphin.add(snout);

    // Dorsal Fin
    const fin = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.45, 4),
      new THREE.MeshStandardMaterial({ color: 0x0369a1 })
    );
    fin.position.set(0, 0.42, 0);
    fin.rotation.x = -0.5;
    dolphin.add(fin);

    // Tail Flukes
    const flukes = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.04, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x0369a1 })
    );
    flukes.position.set(0, 0, 0.95);
    dolphin.add(flukes);

    dolphin.position.set(40, -2, -30); // Under water initially
    this.scene.add(dolphin);

    // Splash Ring Mesh
    const splashRing = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.85, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide })
    );
    splashRing.rotation.x = -Math.PI / 2;
    splashRing.position.set(40, 0.08, -30);
    this.scene.add(splashRing);

    this.dolphins.push({
      group: dolphin,
      center: new THREE.Vector3(40, 0, -30),
      timer: 5.0,
      isJumping: false,
      jumpProgress: 0,
      splashRing,
    });
  }

  // ===========================================================================
  // UPDATE LOOP (CALLED EVERY FRAME FROM ANIMATE())
  // ===========================================================================
  public update(delta: number, time: number) {
    this.updateBoats(delta, time);
    this.updatePedestrians(delta, time);
    this.updateSeagulls(delta, time);
    this.updateDolphins(delta, time);
    this.updateFishermen(delta, time);
  }

  private updateBoats(delta: number, time: number) {
    this.boats.forEach((boat) => {
      if (boat.type === "rowboat") {
        // Moored bobbing at pier with Wind Waker waves
        const waveY = getWindWakerWaveElevation(boat.group.position.x, boat.group.position.z, time);
        boat.group.position.y = 0.15 + waveY * 0.4 + Math.sin(time * 2.8) * 0.04;
        if (boat.hullGroup) {
          boat.hullGroup.rotation.z = Math.sin(time * 2.2) * 0.04;
          boat.hullGroup.rotation.x = Math.cos(time * 1.8) * 0.03;
        } else {
          boat.group.rotation.z = Math.sin(time * 2.2) * 0.04;
          boat.group.rotation.x = Math.cos(time * 1.8) * 0.03;
        }
        return;
      }

      // 1. Spline-based Smooth Cruising (Guaranteed Silky Curve, Zero Crabbing, Natural Banking)
      if (boat.spline && boat.splineLength && boat.splineLength > 0) {
        const deltaProgress = (boat.speed * delta) / boat.splineLength;
        boat.splineProgress = ((boat.splineProgress ?? 0) + deltaProgress) % 1.0;

        const currentPt = boat.spline.getPointAt(boat.splineProgress);
        const tangent = boat.spline.getTangentAt(boat.splineProgress);

        const waveY = getWindWakerWaveElevation(currentPt.x, currentPt.z, time);
        boat.group.position.set(currentPt.x, 0.18 + waveY * 0.7, currentPt.z);

        // Desired yaw heading from velocity tangent
        const targetYaw = Math.atan2(tangent.x, tangent.z);
        if (boat.currentYaw === undefined) {
          boat.currentYaw = targetYaw;
        } else {
          let diff = targetYaw - boat.currentYaw;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;

          // Silky smooth nautical yaw rate
          const turnFactor = Math.min(1, 4.5 * delta);
          boat.currentYaw += diff * turnFactor;

          // Natural banking roll into turns (boat leans inwards along curved trajectory)
          const turnRate = diff / Math.max(delta, 0.001);
          const targetBank = THREE.MathUtils.clamp(-turnRate * 0.08, -0.15, 0.15);
          boat.turnBank = THREE.MathUtils.lerp(boat.turnBank ?? 0, targetBank, 5 * delta);
        }

        boat.group.rotation.y = boat.currentYaw;

        // Wave dynamics & heave on hullGroup
        const heaveY = Math.sin(time * 2.4 + boat.phase) * 0.07;
        const waveRoll = Math.sin(time * 2.0 + boat.phase) * 0.035 + (boat.turnBank ?? 0);
        const wavePitch = Math.cos(time * 1.6 + boat.phase) * 0.025 + 0.015; // slight nose rise when cruising

        if (boat.hullGroup) {
          boat.hullGroup.position.y = heaveY;
          boat.hullGroup.rotation.z = waveRoll;
          boat.hullGroup.rotation.x = wavePitch;
        } else {
          boat.group.position.y = 0.18 + heaveY;
          boat.group.rotation.z = waveRoll;
          boat.group.rotation.x = wavePitch;
        }
      } else if (boat.waypoints && boat.waypoints.length > 0) {
        // 2. Fallback Waypoint Navigation if spline not available
        const wpIdx = boat.currentWaypointIdx ?? 0;
        const target = boat.waypoints[wpIdx];
        const curPos = boat.group.position;

        const dirX = target.x - curPos.x;
        const dirZ = target.z - curPos.z;
        const dist = Math.hypot(dirX, dirZ);

        if (dist < 5.0) {
          boat.currentWaypointIdx = (wpIdx + 1) % boat.waypoints.length;
        } else {
          const moveStep = boat.speed * delta;
          curPos.x += (dirX / dist) * moveStep;
          curPos.z += (dirZ / dist) * moveStep;

          const targetYaw = Math.atan2(dirX, dirZ);
          let angleDiff = targetYaw - boat.group.rotation.y;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          boat.group.rotation.y += angleDiff * Math.min(1, 3.5 * delta);
        }

        curPos.y = 0.18 + Math.sin(time * 2.4 + boat.phase) * 0.07;
        if (boat.hullGroup) {
          boat.hullGroup.rotation.z = Math.sin(time * 2.0 + boat.phase) * 0.035;
          boat.hullGroup.rotation.x = Math.cos(time * 1.6 + boat.phase) * 0.025;
        }
      } else {
        // 3. Fallback Elliptical trajectory
        const t = time * boat.speed + boat.phase;
        const x = boat.centerX + Math.cos(t) * boat.radiusX;
        const z = boat.centerZ + Math.sin(t) * boat.radiusZ;

        const dx = -Math.sin(t) * boat.radiusX;
        const dz = Math.cos(t) * boat.radiusZ;
        const heading = Math.atan2(dx, dz);

        boat.group.position.set(x, 0.18 + Math.sin(time * 2.5 + boat.phase) * 0.10, z);
        boat.group.rotation.y = heading;
        if (boat.hullGroup) {
          boat.hullGroup.rotation.z = Math.sin(time * 2.2) * 0.04;
          boat.hullGroup.rotation.x = Math.cos(time * 1.8) * 0.02;
        }
      }

      // Update dynamic water foam wake trailing the moving boat
      if (boat.wakeRings && boat.speed > 0) {
        const yaw = boat.group.rotation.y;
        const sternDist = 2.4;
        const sternX = boat.group.position.x - Math.sin(yaw) * sternDist;
        const sternZ = boat.group.position.z - Math.cos(yaw) * sternDist;

        boat.wakeRings.forEach((ring) => {
          ring.timer += delta;
          if (ring.timer >= ring.maxLife) {
            ring.timer = 0;
            const waveY = getWindWakerWaveElevation(sternX, sternZ, time);
            ring.mesh.position.set(sternX, 0.08 + waveY * 0.7, sternZ);
            ring.mesh.rotation.y = yaw;
          }
          const progress = ring.timer / ring.maxLife;
          const scale = 0.8 + progress * 3.2;
          ring.mesh.scale.set(scale * 0.85, 1, scale * 1.4);
          (ring.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(progress * Math.PI) * 0.55;
        });
      }

      // Fluttering maritime flags
      if (boat.flagMeshes) {
        boat.flagMeshes.forEach((flag, idx) => {
          flag.rotation.y = Math.sin(time * 5.5 + idx + boat.phase) * 0.16;
        });
      }
    });
  }

  private updatePedestrians(delta: number, time: number) {
    this.pedestrians.forEach((ped) => {
      const target = ped.waypoints[ped.currentWaypointIdx];
      const curPos = ped.group.position;

      const dirX = target.x - curPos.x;
      const dirZ = target.z - curPos.z;
      const dist = Math.hypot(dirX, dirZ);

      if (dist < 0.8) {
        // Advance to next waypoint
        ped.currentWaypointIdx = (ped.currentWaypointIdx + 1) % ped.waypoints.length;
      } else {
        // Move towards target
        const step = ped.speed * delta;
        curPos.x += (dirX / dist) * step;
        curPos.z += (dirZ / dist) * step;

        // Smooth yaw rotation
        const targetYaw = Math.atan2(dirX, dirZ);
        ped.group.rotation.y = THREE.MathUtils.lerp(ped.group.rotation.y, targetYaw, 8 * delta);
      }

      // Terrain / Bridge Height attachment
      const groundY = this.getGroundHeight(curPos.x, curPos.z);
      curPos.y = groundY;

      ped.walkCycle += ped.speed * delta * 4.2;

      // Limb swing for legacy procedural meshes (if present)
      if (ped.legL && ped.legR) {
        const legSwing = Math.sin(ped.walkCycle) * 0.55;
        ped.legL.rotation.x = legSwing;
        ped.legR.rotation.x = -legSwing;
      }
      if (ped.armL && ped.armR) {
        const armSwing = -Math.sin(ped.walkCycle) * 0.45;
        ped.armL.rotation.x = armSwing;
        ped.armR.rotation.x = -armSwing;
      }
      if (ped.head) {
        ped.head.rotation.y = Math.sin(ped.walkCycle * 0.5) * 0.08;
      }
    });
  }

  private updateSeagulls(delta: number, time: number) {
    this.seagulls.forEach((gull) => {
      const t = time * gull.speed + gull.phase;
      const x = Math.cos(t) * gull.baseRadius;
      const z = Math.sin(t) * (gull.baseRadius * 0.85) - 15;
      const y = gull.altitude + Math.sin(time * 1.5 + gull.phase) * 2.2;

      gull.group.position.set(x, y, z);

      // Tangent heading
      const dx = -Math.sin(t) * gull.baseRadius;
      const dz = Math.cos(t) * (gull.baseRadius * 0.85);
      gull.group.rotation.y = Math.atan2(dx, dz);
      gull.group.rotation.z = -0.18; // Banked flight turn

      // Wing flapping
      const flap = Math.sin(time * 12 + gull.phase) * 0.45;
      gull.wingL.rotation.z = flap;
      gull.wingR.rotation.z = -flap;
    });
  }

  private updateDolphins(delta: number, time: number) {
    this.dolphins.forEach((d) => {
      d.timer -= delta;
      if (d.timer <= 0 && !d.isJumping) {
        d.isJumping = true;
        d.jumpProgress = 0;
        d.timer = 7.0 + Math.random() * 4.0;
        (d.splashRing.material as THREE.MeshBasicMaterial).opacity = 0.8;
        d.splashRing.scale.set(1, 1, 1);
      }

      if (d.isJumping) {
        d.jumpProgress += delta * 0.85; // ~1.2s jump
        if (d.jumpProgress >= 1.0) {
          d.isJumping = false;
          d.group.position.y = -2;
        } else {
          const p = d.jumpProgress;
          // Parabolic jump arc
          const arcY = Math.sin(p * Math.PI) * 3.2;
          const arcZ = (p - 0.5) * 6.0;

          d.group.position.set(d.center.x, arcY - 0.2, d.center.z + arcZ);

          // Pitch rotation: heads up on rise, diving on descent
          d.group.rotation.x = -Math.PI / 2.8 + p * Math.PI * 0.75;

          // Splash ring expansion and fade
          const splashMat = d.splashRing.material as THREE.MeshBasicMaterial;
          if (p > 0.8) {
            splashMat.opacity = Math.max(0, (1.0 - p) * 4);
            d.splashRing.scale.addScalar(delta * 2);
          }
        }
      }
    });
  }

  private updateFishermen(delta: number, time: number) {
    this.fishingSpots.forEach((spot) => {
      // Bobber floats and oscillates with water waves
      spot.bobber.position.y = 0.12 + Math.sin(time * 3.2) * 0.08;
      spot.bobber.rotation.z = Math.sin(time * 2.5) * 0.15;

      // Update fishing line from rod tip to bobber
      const positions = spot.line.geometry.attributes.position;
      positions.setXYZ(0, spot.rodTip.x, spot.rodTip.y, spot.rodTip.z);
      positions.setXYZ(1, spot.bobber.position.x, spot.bobber.position.y + 0.12, spot.bobber.position.z);
      positions.needsUpdate = true;

      // Periodic jumping fish near bobber
      spot.fishTimer -= delta;
      if (spot.fishTimer <= 0 && !spot.isFishJumping) {
        spot.isFishJumping = true;
        spot.fishProgress = 0;
        spot.jumpingFish.visible = true;
        spot.fishTimer = 6.0 + Math.random() * 4.0;
      }

      if (spot.isFishJumping) {
        spot.fishProgress += delta * 1.8;
        if (spot.fishProgress >= 1.0) {
          spot.isFishJumping = false;
          spot.jumpingFish.visible = false;
        } else {
          const fp = spot.fishProgress;
          const fishY = Math.sin(fp * Math.PI) * 1.4;
          const fishZ = spot.bobber.position.z + (fp - 0.5) * 1.8;
          spot.jumpingFish.position.set(spot.bobber.position.x + 0.3, fishY, fishZ);
          spot.jumpingFish.rotation.x = -0.8 + fp * 1.6;
        }
      }
    });
  }

  public destroy() {
    this.boats.forEach((boat) => {
      boat.wakeRings?.forEach((ring) => {
        this.scene.remove(ring.mesh);
        ring.mesh.geometry.dispose();
        (ring.mesh.material as THREE.Material).dispose();
      });
    });
    this.pedestrians = [];
    this.boats = [];
    this.seagulls = [];
    this.dolphins = [];
    this.fishingSpots = [];
  }
}
