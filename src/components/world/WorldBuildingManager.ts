"use client";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SolidCollider } from "./WorldEngine";

export type BuildingKey =
  | "home_a"
  | "home_b"
  | "tavern"
  | "market"
  | "windmill";

interface BuildingDef {
  key: BuildingKey;
  filename: string;
}

const BUILDING_DEFS: Record<BuildingKey, BuildingDef> = {
  home_a: { key: "home_a", filename: "building_home_A_yellow.gltf" },
  home_b: { key: "home_b", filename: "building_home_B_yellow.gltf" },
  tavern: { key: "tavern", filename: "building_tavern_yellow.gltf" },
  market: { key: "market", filename: "building_market_yellow.gltf" },
  windmill: { key: "windmill", filename: "building_windmill_yellow.gltf" },
};

/**
 * Calculates rotation so building's front door (facing local -Z) points directly
 * toward the island center (cx, cz), ensuring it never faces the abyss or cliffs.
 */
function faceTowardsCenter(x: number, z: number, cx: number, cz: number): number {
  return Math.atan2(x - cx, z - cz);
}

export class WorldBuildingManager {
  private scene: THREE.Scene;
  private colliders: SolidCollider[];
  private getGroundHeight: (x: number, z: number) => number;
  private loader: GLTFLoader;

  private prototypes: Map<BuildingKey, THREE.Group> = new Map();
  private spawnedBuildings: THREE.Object3D[] = [];
  private isLoadingKey: Set<BuildingKey> = new Set();
  private pendingSpawns: Map<BuildingKey, Array<{ pos: THREE.Vector3; rotY: number; scale: number; colliderWidth: number; colliderDepth: number }>> = new Map();

  constructor(
    scene: THREE.Scene,
    colliders: SolidCollider[],
    getGroundHeight: (x: number, z: number) => number
  ) {
    this.scene = scene;
    this.colliders = colliders;
    this.getGroundHeight = getGroundHeight;
    this.loader = new GLTFLoader();
    this.loader.setPath("/assets/3d/buildings/");
  }

  /**
   * Spawns authentic KayKit Medieval Houses and Buildings across all islands.
   * All doors and entrances face inward toward plazas and promenades, never facing cliffs.
   */
  public buildAllHouses() {
    // 1. Central Plaza (Hub at 0, 0) - All buildings well inside flat plateau (dist <= 13.5m, cliff at 18.0m)
    // Tavern on East lawn, facing plaza center (0, 0)
    this.spawnBuilding("tavern", 12.0, -3.0, faceTowardsCenter(12.0, -3.0, 0, 0), 3.8, 4.5, 4.5);
    // West Garden Cottage, facing plaza center (0, 0)
    this.spawnBuilding("home_a", -11.5, 7.5, faceTowardsCenter(-11.5, 7.5, 0, 0), 3.6, 3.2, 3.2);
    // South Promenade Cottage, facing plaza center (0, 0)
    this.spawnBuilding("home_b", 4.5, 12.0, faceTowardsCenter(4.5, 12.0, 0, 0), 3.6, 3.4, 3.4);

    // 2. MOBA Sanctuary (Center at -70, -65) - Firmly on high altar plateau (dist <= 10.5m, cliff at 15.5m)
    // Mystic Windmill on Northern bluff, facing temple center
    this.spawnBuilding("windmill", -65.0, -74.0, faceTowardsCenter(-65.0, -74.0, -70, -65), 4.2, 4.0, 4.0);
    // Alchemist Sanctum on Western bluff, facing temple center
    this.spawnBuilding("home_b", -78.0, -61.0, faceTowardsCenter(-78.0, -61.0, -70, -65), 3.6, 3.4, 3.4);

    // 3. Battle Royale Outpost (Center at 75, -60) - Safe inside Citadel courtyard (dist <= 9.5m, cliff at 16.5m)
    // Command Tavern on Citadel bluff, facing courtyard center
    this.spawnBuilding("tavern", 81.0, -67.0, faceTowardsCenter(81.0, -67.0, 75, -60), 4.0, 4.8, 4.8);
    // Scout Bunkhouse, facing courtyard center
    this.spawnBuilding("home_a", 69.0, -67.0, faceTowardsCenter(69.0, -67.0, 75, -60), 3.6, 3.2, 3.2);

    // 4. Hexagon Sandbox Bay (Center at -65, 70) - Grassy middle terrace (dist <= 9.5m, cliff at 15.5m)
    // Lakeside Chalet, facing lagoon center
    this.spawnBuilding("home_a", -72.0, 64.0, faceTowardsCenter(-72.0, 64.0, -65, 70), 3.8, 3.4, 3.4);
    // Hillside Cottage, facing lagoon center
    this.spawnBuilding("home_b", -58.0, 75.0, faceTowardsCenter(-58.0, 75.0, -65, 70), 3.8, 3.4, 3.4);

    // 5. Arcade Soccer Arena (Center at 65, 65) - East concourse sideline (dist = 14.0m, cliff at 18.0m)
    // Concessions Pavilion on Concourse sideline, facing stadium pitch
    this.spawnBuilding("market", 79.0, 65.0, faceTowardsCenter(79.0, 65.0, 65, 65), 3.6, 6.0, 4.8);
  }

  public spawnBuilding(
    key: BuildingKey,
    x: number,
    z: number,
    rotY: number = 0,
    scaleNum: number = 3.6,
    colliderWidth: number = 3.5,
    colliderDepth: number = 3.5
  ) {
    const groundY = this.getGroundHeight(x, z);
    // Sink by 5cm to guarantee stone base is firmly embedded into the ground
    const pos = new THREE.Vector3(x, groundY - 0.05, z);

    const proto = this.prototypes.get(key);
    if (proto) {
      this.instantiateBuilding(proto, pos, rotY, scaleNum, colliderWidth, colliderDepth);
    } else {
      let list = this.pendingSpawns.get(key);
      if (!list) {
        list = [];
        this.pendingSpawns.set(key, list);
      }
      list.push({ pos, rotY, scale: scaleNum, colliderWidth, colliderDepth });
      this.loadModel(key);
    }
  }

  private loadModel(key: BuildingKey) {
    if (this.prototypes.has(key) || this.isLoadingKey.has(key)) return;
    this.isLoadingKey.add(key);

    const def = BUILDING_DEFS[key];
    if (!def) return;

    this.loader.load(
      def.filename,
      (gltf) => {
        const root = gltf.scene;

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;
            if (m.material && (m.material as any).roughness !== undefined) {
              (m.material as any).roughness = 0.8;
            }
          }
        });

        this.prototypes.set(key, root);
        this.isLoadingKey.delete(key);

        const pending = this.pendingSpawns.get(key);
        if (pending) {
          pending.forEach((req) => {
            this.instantiateBuilding(root, req.pos, req.rotY, req.scale, req.colliderWidth, req.colliderDepth);
          });
          this.pendingSpawns.delete(key);
        }
      },
      undefined,
      (err) => console.warn(`[WorldBuildingManager] Failed to load ${def.filename}:`, err)
    );
  }

  private instantiateBuilding(
    proto: THREE.Group,
    pos: THREE.Vector3,
    rotY: number,
    scale: number,
    colliderWidth: number,
    colliderDepth: number
  ) {
    const instance = proto.clone(true);
    instance.position.copy(pos);
    instance.rotation.y = rotY;
    instance.scale.set(scale, scale, scale);

    this.scene.add(instance);
    this.spawnedBuildings.push(instance);

    // Register solid physical box collider
    const halfW = colliderWidth / 2;
    const halfD = colliderDepth / 2;
    this.colliders.push({
      type: "box",
      minX: pos.x - halfW,
      maxX: pos.x + halfW,
      minZ: pos.z - halfD,
      maxZ: pos.z + halfD,
      label: "kaykit_building",
    });
  }

  public dispose() {
    this.spawnedBuildings.forEach((b) => this.scene.remove(b));
    this.spawnedBuildings = [];
    this.prototypes.clear();
    this.pendingSpawns.clear();
  }
}
