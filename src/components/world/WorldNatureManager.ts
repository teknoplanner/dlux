"use client";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SolidCollider } from "./WorldEngine";

export type NatureModelKey =
  | "tree_pine"
  | "tree_pine_tall"
  | "tree_oak"
  | "tree_oak_round"
  | "tree_birch"
  | "tree_canopy"
  | "tree_bare"
  | "rock_boulder"
  | "rock_cliff"
  | "rock_shore"
  | "rock_pebble"
  | "rock_slab"
  | "bush_lush"
  | "bush_round"
  | "grass_tuft";

interface SpawnRequest {
  modelKey: NatureModelKey;
  pos: THREE.Vector3;
  scale: THREE.Vector3;
  rotY: number;
  colliderRadius?: number;
}

const MODEL_FILENAMES: Record<NatureModelKey, string> = {
  tree_pine: "Tree_1_A_Color1.gltf",
  tree_pine_tall: "Tree_1_C_Color1.gltf",
  tree_oak: "Tree_2_A_Color1.gltf",
  tree_oak_round: "Tree_2_C_Color1.gltf",
  tree_birch: "Tree_3_A_Color1.gltf",
  tree_canopy: "Tree_4_A_Color1.gltf",
  tree_bare: "Tree_Bare_1_A_Color1.gltf",
  rock_boulder: "Rock_1_A_Color1.gltf",
  rock_cliff: "Rock_1_F_Color1.gltf",
  rock_shore: "Rock_2_C_Color1.gltf",
  rock_pebble: "Rock_3_A_Color1.gltf",
  rock_slab: "Rock_3_D_Color1.gltf",
  bush_lush: "Bush_1_A_Color1.gltf",
  bush_round: "Bush_2_A_Color1.gltf",
  grass_tuft: "Grass_1_A_Color1.gltf",
};

// Geometric distance from a point to a 2D line segment
function distToSegment(px: number, pz: number, x1: number, z1: number, x2: number, z2: number): number {
  const l2 = (x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1);
  if (l2 === 0) return Math.hypot(px - x1, pz - z1);
  let t = ((px - x1) * (x2 - x1) + (pz - z1) * (z2 - z1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), pz - (z1 + t * (z2 - z1)));
}

export class WorldNatureManager {
  private scene: THREE.Scene;
  private colliders: SolidCollider[];
  private getGroundHeight: (x: number, z: number) => number;
  private loader: GLTFLoader;

  // Cached loaded prototypes
  private prototypes: Map<NatureModelKey, THREE.Group> = new Map();
  private pendingRequests: Map<NatureModelKey, SpawnRequest[]> = new Map();
  private isLoadingKey: Set<NatureModelKey> = new Set();
  public spawnedObjects: THREE.Object3D[] = [];

  // Collision and stacking registry to guarantee clean separation and clear roads
  private spawnedCoords: { x: number; z: number; minSeparation: number }[] = [];

  constructor(
    scene: THREE.Scene,
    colliders: SolidCollider[],
    getGroundHeight: (x: number, z: number) => number
  ) {
    this.scene = scene;
    this.colliders = colliders;
    this.getGroundHeight = getGroundHeight;
    this.loader = new GLTFLoader();
    this.loader.setPath("/assets/3d/nature/");
  }

  /**
   * Preload key prototypes in background
   */
  public preloadEssentialModels() {
    const essentialKeys: NatureModelKey[] = [
      "tree_oak",
      "tree_oak_round",
      "tree_pine",
      "tree_pine_tall",
      "tree_birch",
      "tree_canopy",
      "tree_bare",
      "rock_boulder",
      "rock_cliff",
      "rock_shore",
      "rock_slab",
      "rock_pebble",
      "bush_lush",
      "bush_round",
      "grass_tuft",
    ];
    essentialKeys.forEach((k) => this.loadModel(k));
  }

  private loadModel(key: NatureModelKey) {
    if (this.prototypes.has(key) || this.isLoadingKey.has(key)) return;
    this.isLoadingKey.add(key);

    const filename = MODEL_FILENAMES[key];
    if (!filename) return;

    this.loader.load(
      filename,
      (gltf) => {
        const root = gltf.scene;

        // Configure shadows & materials on prototype
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.75;
              mat.metalness = 0.05;
              if (mat.map) {
                mat.map.colorSpace = THREE.SRGBColorSpace;
              }
            }
          }
        });

        this.prototypes.set(key, root);
        this.isLoadingKey.delete(key);

        // Process any queued spawn requests for this model
        const requests = this.pendingRequests.get(key);
        if (requests) {
          requests.forEach((req) => this.instantiateModel(key, req));
          this.pendingRequests.delete(key);
        }
      },
      undefined,
      (err) => {
        console.warn(`[WorldNatureManager] Failed to load 3D model ${filename}:`, err);
        this.isLoadingKey.delete(key);
      }
    );
  }

  private instantiateModel(key: NatureModelKey, req: SpawnRequest) {
    const proto = this.prototypes.get(key);
    if (!proto) return;

    const instance = proto.clone(true);
    instance.position.copy(req.pos);
    instance.scale.copy(req.scale);
    instance.rotation.y = req.rotY;

    // Ensure all cloned children cast & receive shadows
    instance.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.scene.add(instance);
    this.spawnedObjects.push(instance);

    // Register solid physical collision if specified
    if (req.colliderRadius && req.colliderRadius > 0) {
      this.colliders.push({
        x: req.pos.x,
        z: req.pos.z,
        radius: req.colliderRadius,
        label: `nature_${key}`,
      });
    }
  }

  /**
   * Evaluates if a given coordinate is too close to a walkway, bridge,
   * player spawn, or critical game arena.
   */
  private isNearRoadOrBridge(x: number, z: number, clearance: number = 3.6): boolean {
    // 1. Central Plaza Open Core & Spawn (0, 8)
    if (Math.hypot(x, z) < 9.2) return true;

    // 2. Central Hub Walkway Corridors
    // NW path to MOBA Bridge (-6, -6) -> (-18, -18)
    if (distToSegment(x, z, -6, -6, -18, -18) < clearance) return true;
    // NE path to BR Bridge (6, -6) -> (18, -16)
    if (distToSegment(x, z, 6, -6, 18, -16) < clearance) return true;
    // SW path to Hex Bridge (-6, 6) -> (-16, 18)
    if (distToSegment(x, z, -6, 6, -16, 18) < clearance) return true;
    // SE path to Soccer Bridge (6, 6) -> (16, 18)
    if (distToSegment(x, z, 6, 6, 16, 18) < clearance) return true;
    // North Pier Walkway (0, -6) -> (0, -34)
    if (distToSegment(x, z, 0, -6, 0, -34) < 3.2) return true;

    // 3. Bridge Landing Touchdowns & Spans
    const bridgeTouchdowns: [number, number][] = [
      [-18, -18],
      [18, -16],
      [-16, 18],
      [16, 18],
      [-52, -50], // MOBA entrance
      [56, -45],  // BR entrance
      [-48, 52],  // Hex entrance
      [48, 48],   // Soccer entrance
    ];
    for (const [bx, bz] of bridgeTouchdowns) {
      if (Math.hypot(x - bx, z - bz) < 5.2) return true;
    }

    // 4. Outpost & Arena Road Segments
    // MOBA Path: (-52, -50) -> (-70, -65)
    if (distToSegment(x, z, -52, -50, -70, -65) < clearance) return true;
    // BR Path: (56, -45) -> (71, -64)
    if (distToSegment(x, z, 56, -45, 71, -64) < clearance) return true;
    // Hex Path: (-48, 52) -> (-57, 62)
    if (distToSegment(x, z, -48, 52, -57, 62) < clearance) return true;
    // Soccer Path: (48, 48) -> (54, 65)
    if (distToSegment(x, z, 48, 48, 54, 65) < clearance) return true;

    // 5. Soccer Pitch & Bleachers Zone (Arcade Soccer Arena: center 65, 65)
    if (x >= 52 && x <= 78 && z >= 47 && z <= 83) return true; // Pitch
    if (x >= 43 && x <= 53 && z >= 51 && z <= 79) return true; // Bleachers

    // 6. Central Plaza Hex Koi Pond (-16, 0)
    if (Math.hypot(x - (-16), z - 0) < 4.8) return true;

    // 7. Market Stalls clearances (Mang Ujang, Luna, Riko)
    if (Math.hypot(x - (-8.0), z - 2.5) < 3.8) return true;
    if (Math.hypot(x - (-8.0), z - (-2.5)) < 3.8) return true;
    if (Math.hypot(x - 6.5, z - (-10.0)) < 3.8) return true;

    // 8. Joko Rock Fishing Pier (56, -63)
    if (Math.hypot(x - 56, z - (-63)) < 3.5) return true;

    // 9. All Island Buildings clearances (prevents trees/rocks spawning inside or blocking houses)
    const buildings: [number, number, number][] = [
      [12.0, -3.0, 4.5],   // Central Plaza Tavern
      [-11.5, 7.5, 4.0],   // Central Plaza West Cottage
      [4.5, 12.0, 4.0],    // Central Plaza South Cottage
      [-65.0, -74.0, 4.5], // MOBA Windmill
      [-78.0, -61.0, 4.0], // MOBA Alchemist Sanctum
      [81.0, -67.0, 4.5],  // Outpost Tavern
      [69.0, -67.0, 4.0],  // Outpost Bunkhouse
      [-72.0, 64.0, 4.0],  // Hex Lakeside Chalet
      [-58.0, 75.0, 4.0],  // Hex Hillside Cottage
      [79.0, 65.0, 4.5],   // Soccer Concessions Pavilion
    ];
    for (const [bx, bz, br] of buildings) {
      if (Math.hypot(x - bx, z - bz) < br) return true;
    }

    return false;
  }

  /**
   * Verifies coordinate is valid, does not block roads, and does not overlap existing props.
   */
  private canSpawnAt(x: number, z: number, reqRadius: number): boolean {
    // Check road and bridge clearance
    if (this.isNearRoadOrBridge(x, z, reqRadius + 1.2)) {
      return false;
    }

    // Check anti-stacking separation with existing props
    for (const s of this.spawnedCoords) {
      const dist = Math.hypot(x - s.x, z - s.z);
      if (dist < reqRadius + s.minSeparation) {
        return false; // Prevents clutter & overlapping!
      }
    }

    return true;
  }

  /**
   * Spawns a 3D nature model at the given coordinates, snapping cleanly to terrain height.
   * Enforces road clearance and anti-stacking automatically.
   */
  public spawn(
    modelKey: NatureModelKey,
    x: number,
    z: number,
    scaleNum: number = 1.0,
    rotY: number = Math.random() * Math.PI * 2,
    colliderRadius?: number,
    yOffset: number = 0
  ): boolean {
    const isTree = modelKey.startsWith("tree");
    const isRock = modelKey.startsWith("rock");
    const separation = isTree ? 2.6 : isRock ? 1.8 : 1.2;

    if (!this.canSpawnAt(x, z, separation)) {
      return false; // Cleanly rejected: would block road or stack on another object
    }

    this.spawnedCoords.push({ x, z, minSeparation: separation });

    const groundY = this.getGroundHeight(x, z);
    // Guard against deep water or void
    if (groundY <= 0.6) {
      return false;
    }

    // Embed base slightly into turf so trunks are firmly rooted with zero floating
    const rootSink = isTree ? -0.25 : isRock ? -0.15 : -0.05;
    const pos = new THREE.Vector3(x, groundY + rootSink + yOffset, z);
    const scale = new THREE.Vector3(scaleNum, scaleNum, scaleNum);

    const req: SpawnRequest = {
      modelKey,
      pos,
      scale,
      rotY,
      colliderRadius,
    };

    if (this.prototypes.has(modelKey)) {
      this.instantiateModel(modelKey, req);
    } else {
      let list = this.pendingRequests.get(modelKey);
      if (!list) {
        list = [];
        this.pendingRequests.set(modelKey, list);
      }
      list.push(req);
      this.loadModel(modelKey);
    }

    return true;
  }

  // =========================================================================
  // ISLAND FLORA & ROCK FORMATION PLACEMENT (100% KAYKIT 3D ASSETS)
  // Perfectly spaced along road verges & lawns, zero obstruction, zero stacking
  // =========================================================================

  /**
   * Decorates Central Plaza with KayKit Oak Trees, Birch Trees & Perimeter Palms
   * Walkways to all 4 bridges and the North pier remain completely clear.
   */
  public decorateCentralPlaza(center: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
    // 1. Shaded Park Lawn Trees (Positioned in 4 open quadrants away from diagonal roads)
    // North-West Park Lawn
    this.spawn("tree_oak", center.x - 13, center.z - 7, 2.2, 0.4, 0.85);
    this.spawn("bush_lush", center.x - 16, center.z - 8, 1.1);

    // North-East Park Lawn
    this.spawn("tree_oak_round", center.x + 13, center.z - 7, 2.1, 1.2, 0.85);
    this.spawn("bush_round", center.x + 16, center.z - 8, 1.0);

    // South-West Park Lawn
    this.spawn("tree_birch", center.x - 13, center.z + 7, 2.3, 2.1, 0.85);
    this.spawn("bush_lush", center.x - 16, center.z + 8, 1.1);

    // South-East Park Lawn
    this.spawn("tree_oak", center.x + 13, center.z + 7, 2.2, -0.8, 0.85);
    this.spawn("bush_round", center.x + 16, center.z + 8, 1.0);

    // 2. Island Perimeter Grove (Safely on flat lawn plateau at r=16.5m, avoiding all roads and slopes)
    const safePerimeterAngles = [
      0.0,            // East
      Math.PI / 2,    // South
      Math.PI,        // West
      (2 * Math.PI) / 3,
      Math.PI / 3,
      (4 * Math.PI) / 3,
    ];

    safePerimeterAngles.forEach((ang, idx) => {
      const px = center.x + Math.cos(ang) * 16.5;
      const pz = center.z + Math.sin(ang) * 16.5;
      const pModel: NatureModelKey = idx % 2 === 0 ? "tree_oak" : "tree_birch";
      this.spawn(pModel, px, pz, 2.0, ang + Math.PI / 2, 0.85);
    });

    // 3. Shoreline Rocks on Central Plaza Beach
    const beachRockAngles = [0.2, 1.2, 1.9, 3.2, 4.3, 5.4];
    beachRockAngles.forEach((ang) => {
      const rx = center.x + Math.cos(ang) * 28.5;
      const rz = center.z + Math.sin(ang) * 28.5;
      this.spawn("rock_shore", rx, rz, 1.6, ang, 1.2);
    });
  }

  /**
   * Decorates MOBA Sanctuary with Majestic Pine Conifers & Ancient Monolith Boulders
   * Approach road from Bridge 1 (-52, -50) to Center (-70, -65) is 100% open.
   */
  public decorateMOBASanctuary(center: THREE.Vector3 = new THREE.Vector3(-70, 0, -65)) {
    // 1. Towering Conifers on Sanctuary Perimeter Cliffs (Excluding SE bridge approach sector)
    const mobaAngles = [
      Math.PI * 0.6,
      Math.PI * 0.9,
      Math.PI * 1.1,
      Math.PI * 1.4,
      Math.PI * 1.6,
      Math.PI * 1.8,
    ];

    mobaAngles.forEach((ang, idx) => {
      const px = center.x + Math.cos(ang) * 21.0;
      const pz = center.z + Math.sin(ang) * 21.0;
      const pModel: NatureModelKey = idx % 2 === 0 ? "tree_pine_tall" : "tree_pine";
      this.spawn(pModel, px, pz, 2.2, ang, 0.9);
      this.spawn("bush_lush", px - Math.cos(ang) * 2.5, pz - Math.sin(ang) * 2.5, 1.1);
    });

    // 2. Birches flanking temple altar (Carefully offset from the central walkway)
    this.spawn("tree_birch", center.x - 14, center.z - 12, 2.1, 0.4, 0.75);
    this.spawn("tree_birch", center.x + 14, center.z - 12, 2.2, -0.6, 0.75);
    this.spawn("tree_birch", center.x - 16, center.z + 4, 2.0, 1.1, 0.75);

    // 3. Ancient Rune Boulders along outer temple terraces
    const monolithRocks: [number, number, number][] = [
      [-16, -16, 2.2],
      [16, -16, 2.4],
      [-18, 10, 2.0],
      [16, 8, 2.1],
    ];
    monolithRocks.forEach(([mx, mz, scale]) => {
      this.spawn("rock_boulder", center.x + mx, center.z + mz, scale, Math.random() * Math.PI * 2, 1.4);
    });

    // 4. Shoreline Rocks
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2 + 0.5;
      const rx = center.x + Math.cos(ang) * 26.0;
      const rz = center.z + Math.sin(ang) * 26.0;
      this.spawn("rock_shore", rx, rz, 1.6, ang, 1.2);
    }
  }

  /**
   * Decorates Battle Royale Outpost with Rugged Pines & Sea-Facing Cliff Bluffs
   * Bridge landing at (56, -45) and connecting road are completely free of rocks and trees.
   */
  public decorateBattleRoyaleOutpost(center: THREE.Vector3 = new THREE.Vector3(75, 0, -60)) {
    // 1. Rugged Coastal Pines on East and South bluff terraces
    const brTrees: [number, number, NatureModelKey][] = [
      [14, -14, "tree_pine"],
      [16, 10, "tree_pine_tall"],
      [-10, -18, "tree_bare"],
      [6, 18, "tree_pine"],
      [-16, -12, "tree_bare"],
    ];

    brTrees.forEach(([ox, oz, key]) => {
      this.spawn(key, center.x + ox, center.z + oz, 2.1, Math.random() * Math.PI * 2, 0.85);
      this.spawn("bush_round", center.x + ox + 2.4, center.z + oz, 1.0);
    });

    // 2. Sea-Facing Cliff Boulders strictly on outer perimeter rim (0 boulders near bridge 56, -45)
    const cliffBoulders: [number, number, number][] = [
      [18, -18, 2.8],
      [19, 16, 2.6],
      [-8, -22, 2.3],
      [12, -22, 2.5],
      [8, 20, 2.2],
    ];

    cliffBoulders.forEach(([cx, cz, scale]) => {
      this.spawn("rock_cliff", center.x + cx, center.z + cz, scale, Math.random() * Math.PI * 2, 1.6);
    });

    // 3. Rocky shoreline where Joko fishes (safely on water edge near 56, -63)
    this.spawn("rock_boulder", center.x - 19, center.z - 3, 2.2, 0.4, 1.5);
    this.spawn("rock_shore", center.x - 21, center.z - 1, 1.8, -0.6, 1.3);
  }

  /**
   * Decorates Arcade Soccer Arena with Shade Canopy Trees along grass borders
   * Road from bridge (48, 48) to pitch, spectator bleachers, and pitch turf are 100% open.
   */
  public decorateSoccerArena(center: THREE.Vector3 = new THREE.Vector3(65, 0, 65)) {
    // 1. Canopy Shade Trees on East & Outer Grass Lawns (Safely behind stadium perimeter)
    const stadiumTrees: [number, number, NatureModelKey][] = [
      [18, -14, "tree_canopy"],
      [18, 0, "tree_oak"],
      [18, 14, "tree_canopy"],
      [-22, -18, "tree_canopy"], // Behind bleachers with 5m+ clearance
      [-22, 18, "tree_canopy"],  // Behind bleachers with 5m+ clearance
      [0, -22, "tree_oak_round"],
      [0, 22, "tree_canopy"],
    ];

    stadiumTrees.forEach(([sx, sz, key]) => {
      this.spawn(key, center.x + sx, center.z + sz, 2.2, Math.random() * Math.PI * 2, 0.85);
      this.spawn("bush_lush", center.x + sx + 2.5, center.z + sz, 1.1);
    });

    // 2. Beach Rocks on Sand Perimeter
    const arenaRocks: [number, number][] = [
      [22, -12],
      [22, 12],
      [-12, 24],
      [12, -24],
    ];
    arenaRocks.forEach(([rx, rz]) => {
      this.spawn("rock_shore", center.x + rx, center.z + rz, 1.6, Math.random() * Math.PI * 2, 1.2);
    });
  }

  /**
   * Decorates Hexagon Sandbox Bay with Terraced Trees
   * Arrival quay at (-48, 52) and central crystal lagoon remain completely unobstructed.
   */
  public decorateVoxelBay(center: THREE.Vector3 = new THREE.Vector3(-65, 0, 70)) {
    // 1. Terraced Trees on Elevated Hills (Excluding bridge landing quay at -48, 52)
    const hexTrees: [number, number][] = [
      [-14, -14],
      [-18, 12],
      [-8, 16],
      [14, 14],
      [0, 18],
      [-16, -2],
    ];

    hexTrees.forEach(([vx, vz]) => {
      this.spawn("tree_canopy", center.x + vx, center.z + vz, 2.0, Math.random() * Math.PI * 2, 0.85);
      this.spawn("bush_round", center.x + vx + 2.6, center.z + vz, 1.0);
    });

    // 2. Stepping Stone Slabs on outer shoreline
    const hexRocks: [number, number][] = [
      [-22, -8],
      [22, 10],
      [-10, 22],
      [10, -22],
    ];
    hexRocks.forEach(([rx, rz]) => {
      this.spawn("rock_slab", center.x + rx, center.z + rz, 1.6, Math.random() * Math.PI * 2, 1.2);
    });
  }

  /**
   * Decorates all 5 islands in one coordinated pass
   */
  public decorateAllIslands() {
    this.preloadEssentialModels();
    this.decorateCentralPlaza(new THREE.Vector3(0, 0, 0));
    this.decorateMOBASanctuary(new THREE.Vector3(-70, 0, -65));
    this.decorateBattleRoyaleOutpost(new THREE.Vector3(75, 0, -60));
    this.decorateSoccerArena(new THREE.Vector3(65, 0, 65));
    this.decorateVoxelBay(new THREE.Vector3(-65, 0, 70));
  }

  public destroy() {
    this.spawnedObjects.forEach((obj) => {
      this.scene.remove(obj);
    });
    this.spawnedObjects = [];
    this.spawnedCoords = [];
    this.prototypes.clear();
    this.pendingRequests.clear();
  }
}
