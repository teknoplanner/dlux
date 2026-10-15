"use client";

import * as THREE from "three";
import { NPCData, SolidCollider } from "./WorldEngine";

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================
export interface Pedestrian {
  group: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  head: THREE.Group;
  waypoints: THREE.Vector3[];
  currentWaypointIdx: number;
  speed: number;
  walkCycle: number;
  name: string;
}

export interface CruisingBoat {
  group: THREE.Group;
  type: "sailboat" | "motorboat" | "rowboat";
  waypoints?: THREE.Vector3[];
  currentWaypointIdx?: number;
  radiusX: number;
  radiusZ: number;
  centerX: number;
  centerZ: number;
  speed: number;
  phase: number;
  foamEmitter?: THREE.Group;
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

  constructor(
    scene: THREE.Scene,
    colliders: SolidCollider[],
    registerNPC: (npc: NPCData) => void,
    getGroundHeight: (x: number, z: number) => number
  ) {
    this.scene = scene;
    this.colliders = colliders;
    this.registerNPC = registerNPC;
    this.getGroundHeight = getGroundHeight;
  }

  public init() {
    this.spawnMarketStallsAndVendors();
    this.spawnFishermen();
    this.spawnBoats();
    this.spawnPedestrians();
    this.spawnSeagulls();
    this.spawnDolphins();
  }

  // ===========================================================================
  // 1. MARKET STALLS & VENDORS (ADA YANG BERDAGANG)
  // ===========================================================================
  private spawnMarketStallsAndVendors() {
    // A. Toko Buah Tropis Mang Ujang (Central Plaza)
    this.createMarketStall({
      pos: new THREE.Vector3(-9.5, 4.80, 11.5),
      rotY: 0.35,
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
      pos: new THREE.Vector3(-9.5, 4.80, 11.5),
      avatar: "🍉",
      dialogue: [
        "Halo Milo! Wah, segar banget kan udara pulau hari ini?",
        "Mang Ujang jualan semangka manis, apel merah renyah, dan pisang tropis baru dipetik dari Voxel Bay!",
        "Makan buah bikin stamina sprint kamu makin kencang. Jangan lupa jelajahi pulau dan kumpulkan koin emas ya!"
      ],
    });

    // B. Kios Ramuan & Elixir Alchemist Luna (Dekat Akses Jembatan MOBA)
    this.createMarketStall({
      pos: new THREE.Vector3(-13.5, 4.80, -9.0),
      rotY: -0.65,
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
      pos: new THREE.Vector3(-13.5, 4.80, -9.0),
      avatar: "🧪",
      dialogue: [
        "Salam, penjelajah Milo! Butuh ramuan peningkat kelincahan?",
        "Elixir Kecepatan kami diseduh dengan esensi kristal kecubung dari Kuil MOBA Sanctuary.",
        "Gunakan tombol Shift untuk dash kilat melintasi jembatan gantung antar pulau!"
      ],
    });

    // C. Pondok Es Kelapa Muda Pantai (Central Plaza Beach / Sand Shelf)
    const rikoY = this.getGroundHeight(12.0, -18.0);
    this.createMarketStall({
      pos: new THREE.Vector3(12.0, rikoY, -18.0),
      rotY: -1.2,
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
      pos: new THREE.Vector3(12.0, rikoY, -18.0),
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
    const actualY = Math.max(cfg.pos.y, groundY);
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

    // 2. Corner Wooden Posts supporting Awning
    const postGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.4, 8);
    for (const px of [-1.35, 1.35]) {
      for (const pz of [-0.6, 0.6]) {
        const post = new THREE.Mesh(postGeo, this.darkWoodMat);
        post.position.set(px, 1.2, pz);
        post.castShadow = true;
        stallGroup.add(post);
      }
    }

    // 3. Striped Canvas Awning (Canopy Roof)
    const awningGroup = new THREE.Group();
    awningGroup.position.set(0, 2.35, 0);

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
      stripeMesh.rotation.x = 0.12; // Slight forward slope
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

    // 5. Vendor Chibi Figure behind the counter (Z = -0.55)
    const vendorGroup = new THREE.Group();
    vendorGroup.position.set(0, 0, -0.6);

    // Body
    const vendorBodyMat = new THREE.MeshStandardMaterial({
      color: cfg.stallType === "fruit" ? 0x16a34a : cfg.stallType === "potion" ? 0x6b21a8 : 0x0284c7,
      roughness: 0.6,
    });
    const vendorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.85, 12), vendorBodyMat);
    vendorBody.position.y = 0.85;
    vendorGroup.add(vendorBody);

    // Apron or sash
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.08), this.whiteMat);
    apron.position.set(0, 0.8, 0.22);
    vendorGroup.add(apron);

    // Head
    const vendorHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), this.skinMat);
    vendorHead.position.y = 1.5;
    vendorGroup.add(vendorHead);

    // Hat / Bandana
    if (cfg.stallType === "fruit") {
      const bandana = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.15, 14),
        new THREE.MeshStandardMaterial({ color: 0xd97706 })
      );
      bandana.position.y = 1.75;
      vendorGroup.add(bandana);
    } else if (cfg.stallType === "potion") {
      const wizardHat = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 0.85, 12),
        new THREE.MeshStandardMaterial({ color: 0x4c1d95 })
      );
      wizardHat.position.y = 1.95;
      wizardHat.rotation.x = -0.15;
      vendorGroup.add(wizardHat);
    } else {
      // Sunglasses
      const shades = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 0.12, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 })
      );
      shades.position.set(0, 1.52, 0.35);
      vendorGroup.add(shades);
    }

    // Waving Hand
    const armMat = vendorBodyMat;
    const waveArm = new THREE.Group();
    waveArm.position.set(0.42, 1.15, 0);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.45), armMat);
    arm.position.y = 0.2;
    arm.rotation.z = -0.4;
    waveArm.add(arm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), this.skinMat);
    hand.position.set(0.12, 0.42, 0);
    waveArm.add(hand);
    vendorGroup.add(waveArm);

    stallGroup.add(vendorGroup);

    this.scene.add(stallGroup);
    this.colliders.push({ x: cfg.pos.x, z: cfg.pos.z, radius: 1.8, label: "market_stall" });
  }

  // ===========================================================================
  // 2. FISHERMEN (ADA YANG SEDANG MANCING)
  // ===========================================================================
  private spawnFishermen() {
    // Spot 1: Pak Mamat sitting at Central Plaza Pier
    this.createPierFisherman({
      pos: new THREE.Vector3(0, 0.80, -32.5),
      rotY: 0,
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

    // Spot 2: Coastal Rock Fisherman Joko at Battle Royale Outpost Bluffs
    const jokoY = this.getGroundHeight(56.0, -63.0);
    this.createRockFisherman({
      pos: new THREE.Vector3(56.0, jokoY, -63.0),
      rotY: 0.8,
      name: "Joko",
    });

    this.registerNPC({
      id: "joko",
      name: "Joko si Pemancing Karang",
      title: "Nelayan Pesisir Outpost",
      island: "Battle Royale Outpost",
      pos: new THREE.Vector3(56.0, jokoY, -63.0),
      avatar: "🐟",
      dialogue: [
        "Halo Milo! Di tebing karang Outpost ini airnya dalam dan ikannya gesit-gesit!",
        "Tadi barusan ada perahu layar melintas di depan karang, keren banget ya!",
        "Hati-hati waktu sprint di tebing karang, jangan sampai jatuh ke laut!"
      ],
    });
  }

  private createPierFisherman(cfg: { pos: THREE.Vector3; rotY: number; name: string }) {
    const group = new THREE.Group();
    group.position.copy(cfg.pos);
    group.rotation.y = cfg.rotY;

    // Body sitting on the dock edge (Z = 0)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.75, 12), bodyMat);
    body.position.set(0, 0.42, 0);
    group.add(body);

    // Legs dangling over the pier edge (front is -Z)
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    for (const lx of [-0.14, 0.14]) {
      const upperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.45), pantsMat);
      upperLeg.position.set(lx, 0.12, -0.2);
      group.add(upperLeg);

      const lowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.14), pantsMat);
      lowerLeg.position.set(lx, -0.15, -0.42);
      group.add(lowerLeg);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.22), this.darkWoodMat);
      boot.position.set(lx, -0.36, -0.46);
      group.add(boot);
    }

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), this.skinMat);
    head.position.set(0, 0.98, 0);
    group.add(head);

    // Conical Straw Fisherman Hat (Caping bambu)
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.85 });
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.32, 16), strawMat);
    hat.position.set(0, 1.25, 0);
    group.add(hat);

    // Bamboo Fishing Rod held in hands, angled forward towards -Z
    const rodGroup = new THREE.Group();
    rodGroup.position.set(0.25, 0.55, -0.2);
    rodGroup.rotation.x = -Math.PI / 4.5;

    const bambooMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.6 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 3.8, 8), bambooMat);
    rod.position.set(0, 1.8, 0);
    rodGroup.add(rod);

    // Reel
    const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 10), this.goldMat);
    reel.position.set(0.05, 0.4, 0);
    reel.rotation.z = Math.PI / 2;
    rodGroup.add(reel);

    group.add(rodGroup);

    // Fishing Tackle Box & Bucket beside him
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.4), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    box.position.set(0.7, 0.18, 0.3);
    group.add(box);

    const bucket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.2, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5, roughness: 0.4 })
    );
    bucket.position.set(-0.7, 0.22, 0.3);
    group.add(bucket);

    // Fish tail sticking out of bucket!
    const fishTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.3, 6),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
    );
    fishTail.position.set(-0.7, 0.48, 0.3);
    fishTail.rotation.z = 0.4;
    group.add(fishTail);

    this.scene.add(group);

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
    bobber.position.set(cfg.pos.x, 0.15, cfg.pos.z - 6.0);
    this.scene.add(bobber);

    // Line from rod tip to bobber
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(cfg.pos.x + 0.25, cfg.pos.y + 2.8, cfg.pos.z - 2.8),
      bobber.position,
    ]);
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
      rodTip: new THREE.Vector3(cfg.pos.x + 0.25, cfg.pos.y + 2.8, cfg.pos.z - 2.8),
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

    // Standing Fisherman
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.9, 12), bodyMat);
    body.position.y = 0.9;
    group.add(body);

    for (const lx of [-0.15, 0.15]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.6, 8), this.darkWoodMat);
      leg.position.set(lx, 0.3, 0);
      group.add(leg);
    }

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), this.skinMat);
    head.position.y = 1.55;
    group.add(head);

    const bucketHat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.45, 0.22, 14),
      new THREE.MeshStandardMaterial({ color: 0x065f46 })
    );
    bucketHat.position.y = 1.75;
    group.add(bucketHat);

    // Fishing rod pointing to open sea
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.04, 4.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    rod.position.set(0.35, 1.8, -1.5);
    rod.rotation.x = -Math.PI / 4;
    group.add(rod);

    this.scene.add(group);
  }

  // ===========================================================================
  // 3. BOATS (ADA PERAHU JUGA DI LAUT - RUTE BEBAS TABRAKAN PULAU)
  // ===========================================================================
  private spawnBoats() {
    // A. Perahu Layar Utama "Dewi Samudra" (The Grand Sloop)
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
      speed: 6.2,
      phase: 0,
      sailColor1: 0x06b6d4, // Vibrant cyan
      sailColor2: 0xf97316, // Vibrant orange
    });

    // B. Perahu Motor Nelayan (Fishing Motorboat)
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
      speed: 6.0,
      phase: 0,
      hullColor: 0x0284c7,
    });

    // C. Perahu Katamaran Turis (South Bay Lagoon Cruiser)
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
      speed: 5.4,
      phase: Math.PI,
      hullColor: 0x059669,
    });

    // D. Perahu Dayung Bersandar di Dermaga (Moored Rowboat)
    this.createMooredRowboat(new THREE.Vector3(2.6, 0.15, -28.0));
  }

  private createSailboat(cfg: {
    waypoints?: THREE.Vector3[];
    centerX?: number;
    centerZ?: number;
    radiusX?: number;
    radiusZ?: number;
    speed: number;
    phase: number;
    sailColor1: number;
    sailColor2: number;
  }) {
    const boat = new THREE.Group();
    if (cfg.waypoints && cfg.waypoints.length > 0) {
      boat.position.copy(cfg.waypoints[0]);
    }

    // 1. Sleek Wooden Hull with pointed bow and flat transom stern
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const hull = new THREE.Mesh(new THREE.ConeGeometry(1.6, 6.5, 16), hullMat);
    hull.rotation.x = Math.PI / 2;
    hull.rotation.z = Math.PI;
    hull.scale.set(1.0, 1.0, 0.45);
    hull.position.set(0, 0.25, 0);
    hull.castShadow = true;
    boat.add(hull);

    // Teak Deck
    const deckMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.8 });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 5.5), deckMat);
    deck.position.set(0, 0.55, 0.2);
    deck.receiveShadow = true;
    boat.add(deck);

    // Cabin Hatch
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.65, 1.8), this.darkWoodMat);
    cabin.position.set(0, 0.9, -0.4);
    boat.add(cabin);

    // 2. Tall Timber Mast & Rigging
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 7.8, 10), this.darkWoodMat);
    mast.position.set(0, 4.2, 0.4);
    mast.castShadow = true;
    boat.add(mast);

    // Boom horizontal spar
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.2, 8), this.darkWoodMat);
    boom.position.set(0, 1.5, 2.2);
    boom.rotation.x = Math.PI / 2;
    boat.add(boom);

    // 3. Large Curved Triangular Mainsail with Two-tone stripes
    const sailGeo = new THREE.BufferGeometry();
    const sailVertices = new Float32Array([
      // Triangle: Top of mast, tack at boom, clew at boom end
      0, 7.5, 0.4,
      0, 1.6, 0.4,
      0, 1.6, 4.2,
    ]);
    sailGeo.setAttribute("position", new THREE.BufferAttribute(sailVertices, 3));
    sailGeo.computeVertexNormals();

    const sailMat = new THREE.MeshStandardMaterial({
      color: cfg.sailColor1,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const mainsail = new THREE.Mesh(sailGeo, sailMat);
    boat.add(mainsail);

    // Front Jib Sail
    const jibGeo = new THREE.BufferGeometry();
    const jibVertices = new Float32Array([
      0, 6.2, 0.4,
      0, 0.7, -3.2,
      0, 0.7, 0.2,
    ]);
    jibGeo.setAttribute("position", new THREE.BufferAttribute(jibVertices, 3));
    jibGeo.computeVertexNormals();
    const jibMat = new THREE.MeshStandardMaterial({
      color: cfg.sailColor2,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const jibSail = new THREE.Mesh(jibGeo, jibMat);
    boat.add(jibSail);

    // 4. Captain at the Helm (Steering)
    const captain = new THREE.Group();
    captain.position.set(0, 0.55, 2.2);

    const capBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.7, 10), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    capBody.position.y = 0.35;
    captain.add(capBody);

    const capHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 14), this.skinMat);
    capHead.position.y = 0.9;
    captain.add(capHead);

    const capHat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.32, 0.16, 12),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    capHat.position.y = 1.08;
    captain.add(capHat);

    boat.add(captain);

    // Orange Lifebuoy rings on the hull
    const buoyMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    for (const bx of [-1.25, 1.25]) {
      const buoy = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.08, 8, 16), buoyMat);
      buoy.position.set(bx, 0.5, 0.8);
      buoy.rotation.y = Math.PI / 2;
      boat.add(buoy);
    }

    this.scene.add(boat);

    this.boats.push({
      group: boat,
      type: "sailboat",
      waypoints: cfg.waypoints,
      currentWaypointIdx: 0,
      radiusX: cfg.radiusX ?? 0,
      radiusZ: cfg.radiusZ ?? 0,
      centerX: cfg.centerX ?? 0,
      centerZ: cfg.centerZ ?? 0,
      speed: cfg.speed,
      phase: cfg.phase,
    });
  }

  private createMotorboat(cfg: {
    waypoints?: THREE.Vector3[];
    centerX?: number;
    centerZ?: number;
    radiusX?: number;
    radiusZ?: number;
    speed: number;
    phase: number;
    hullColor?: number;
  }) {
    const boat = new THREE.Group();
    if (cfg.waypoints && cfg.waypoints.length > 0) {
      boat.position.copy(cfg.waypoints[0]);
    }

    // Wooden hull
    const hullMat = new THREE.MeshStandardMaterial({
      color: cfg.hullColor ?? 0x0284c7,
      roughness: 0.6,
    });
    const hull = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.7, 4.6),
      hullMat
    );
    hull.position.y = 0.35;
    boat.add(hull);

    // Pointed bow
    const bow = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 1.8, 4),
      new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.6 })
    );
    bow.position.set(0, 0.35, -2.8);
    bow.rotation.y = Math.PI / 4;
    bow.rotation.x = Math.PI / 2;
    boat.add(bow);

    // Canvas Sun Canopy
    const canopyRoof = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.08, 2.8),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.7 })
    );
    canopyRoof.position.set(0, 1.8, 0.2);
    boat.add(canopyRoof);

    // Canopy frame poles
    for (const px of [-0.95, 0.95]) {
      for (const pz of [-1.0, 1.4]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6), this.whiteMat);
        pole.position.set(px, 1.25, pz);
        boat.add(pole);
      }
    }

    // Outboard motor at the back
    const motor = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.75, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
    );
    motor.position.set(0, 0.4, 2.4);
    boat.add(motor);

    this.scene.add(boat);

    this.boats.push({
      group: boat,
      type: "motorboat",
      waypoints: cfg.waypoints,
      currentWaypointIdx: 0,
      radiusX: cfg.radiusX ?? 0,
      radiusZ: cfg.radiusZ ?? 0,
      centerX: cfg.centerX ?? 0,
      centerZ: cfg.centerZ ?? 0,
      speed: cfg.speed,
      phase: cfg.phase,
    });
  }

  private createMooredRowboat(pos: THREE.Vector3) {
    const boat = new THREE.Group();
    boat.position.copy(pos);
    boat.rotation.y = 0.2;

    const hull = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.6, 3.2, 8),
      this.woodMat
    );
    hull.rotation.x = Math.PI / 2;
    hull.scale.set(1.0, 0.5, 1.0);
    boat.add(hull);

    // Oars
    for (const ox of [-0.6, 0.6]) {
      const oar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6),
        this.darkWoodMat
      );
      oar.position.set(ox, 0.3, 0);
      oar.rotation.z = ox * 0.4;
      oar.rotation.y = 0.3;
      boat.add(oar);
    }

    this.scene.add(boat);

    this.boats.push({
      group: boat,
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

    // Torso
    const shirtMat = new THREE.MeshStandardMaterial({ color: cfg.shirtColor, roughness: 0.65 });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.75, 10), shirtMat);
    torso.position.y = 0.85;
    torso.castShadow = true;
    group.add(torso);

    // Legs
    const pantsMat = new THREE.MeshStandardMaterial({ color: cfg.pantsColor, roughness: 0.7 });
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.52, 8), pantsMat);
    legL.position.set(-0.14, 0.28, 0);
    legL.castShadow = true;
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.52, 8), pantsMat);
    legR.position.set(0.14, 0.28, 0);
    legR.castShadow = true;
    group.add(legR);

    // Arms
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 6), shirtMat);
    armL.position.set(-0.35, 0.8, 0);
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 6), shirtMat);
    armR.position.set(0.35, 0.8, 0);
    group.add(armR);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.45, 0);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), this.skinMat);
    head.castShadow = true;
    headGroup.add(head);

    // Hair
    const hairMat = new THREE.MeshStandardMaterial({ color: cfg.hairColor, roughness: 0.8 });
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7), hairMat);
    hair.position.set(0, 0.06, 0);
    headGroup.add(hair);

    // Hat Accessory
    if (cfg.hat === "sunhat") {
      const sunhat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.06, 16),
        new THREE.MeshStandardMaterial({ color: 0xfef08a })
      );
      sunhat.position.y = 0.26;
      headGroup.add(sunhat);
    } else if (cfg.hat === "headband") {
      const headband = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.08, 14),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      headband.position.y = 0.12;
      headGroup.add(headband);
    } else if (cfg.hat === "beret") {
      const beret = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.36, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: 0xbe123c })
      );
      beret.position.set(0.08, 0.28, 0);
      beret.rotation.z = -0.2;
      headGroup.add(beret);
    } else if (cfg.hat === "cap") {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.36, 0.14, 12),
        new THREE.MeshStandardMaterial({ color: 0x0369a1 })
      );
      cap.position.y = 0.25;
      headGroup.add(cap);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.28), new THREE.MeshStandardMaterial({ color: 0x0369a1 }));
      visor.position.set(0, 0.18, -0.32);
      headGroup.add(visor);
    }

    group.add(headGroup);

    this.scene.add(group);

    this.pedestrians.push({
      group,
      legL,
      legR,
      armL,
      armR,
      head: headGroup,
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
        // Moored bobbing
        boat.group.position.y = 0.15 + Math.sin(time * 2.8) * 0.06;
        boat.group.rotation.z = Math.sin(time * 2.2) * 0.04;
        boat.group.rotation.x = Math.cos(time * 1.8) * 0.03;
        return;
      }

      // 1. Waypoint Navigation (Guaranteed Collision-Free Open Sea Routes)
      if (boat.waypoints && boat.waypoints.length > 0) {
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

          // Smooth nautical yaw turning without snapping
          const targetYaw = Math.atan2(dirX, dirZ);
          let angleDiff = targetYaw - boat.group.rotation.y;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          boat.group.rotation.y += angleDiff * Math.min(1, 2.5 * delta);
        }

        // Realistic ocean swell & gentle wave roll
        curPos.y = 0.18 + Math.sin(time * 2.4 + boat.phase) * 0.08;
        boat.group.rotation.z = Math.sin(time * 2.0 + boat.phase) * 0.035;
        boat.group.rotation.x = Math.cos(time * 1.6 + boat.phase) * 0.02;
        return;
      }

      // 2. Fallback Elliptical trajectory
      const t = time * boat.speed + boat.phase;
      const x = boat.centerX + Math.cos(t) * boat.radiusX;
      const z = boat.centerZ + Math.sin(t) * boat.radiusZ;

      // Tangent direction for yaw heading
      const dx = -Math.sin(t) * boat.radiusX;
      const dz = Math.cos(t) * boat.radiusZ;
      const heading = Math.atan2(dx, dz);

      boat.group.position.set(x, 0.18 + Math.sin(time * 2.5 + boat.phase) * 0.10, z);
      boat.group.rotation.y = heading;
      boat.group.rotation.z = Math.sin(time * 2.2) * 0.04;
      boat.group.rotation.x = Math.cos(time * 1.8) * 0.02;
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
      ped.walkCycle += ped.speed * delta * 4.2;

      // Realistic Walking limb swing & body bounce
      const legSwing = Math.sin(ped.walkCycle) * 0.55;
      const armSwing = -Math.sin(ped.walkCycle) * 0.45;

      ped.legL.rotation.x = legSwing;
      ped.legR.rotation.x = -legSwing;
      ped.armL.rotation.x = armSwing;
      ped.armR.rotation.x = -armSwing;

      curPos.y = groundY + Math.abs(Math.sin(ped.walkCycle)) * 0.08;
      ped.head.rotation.y = Math.sin(ped.walkCycle * 0.5) * 0.08;
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
    this.pedestrians = [];
    this.boats = [];
    this.seagulls = [];
    this.dolphins = [];
    this.fishingSpots = [];
  }
}
