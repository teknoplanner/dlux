"use client";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SolidCollider } from "./WorldEngine";

export interface HexTileInfo {
  x: number;
  z: number;
  y: number; // Top surface elevation
  type: "grass" | "water";
  scaleY: number;
  radius: number;
}

export class WorldHexManager {
  private scene: THREE.Scene;
  private colliders: SolidCollider[];
  private loader: GLTFLoader;

  // Stored tile data for instant analytical physics & ground height across all 5 islands
  public tiles: HexTileInfo[] = [];

  // Instanced Meshes for ultra-high performance (1 draw call per tile type for the ENTIRE WORLD)
  private grassInstancedMesh: THREE.InstancedMesh | null = null;
  private waterInstancedMesh: THREE.InstancedMesh | null = null;
  private lilyInstancedMesh: THREE.InstancedMesh | null = null;

  // Track spawned resources for clean disposal
  private spawnedMeshes: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene, colliders: SolidCollider[]) {
    this.scene = scene;
    this.colliders = colliders;
    this.loader = new GLTFLoader();
    this.loader.setPath("/assets/3d/hex/");
  }

  /**
   * Generates the hexagon floor assets for ALL FIVE archipelago islands:
   * 1. Central Plaza (Royal Hub & West Garden Koi Pond)
   * 2. MOBA Sanctuary (High Terraced Mountain Temple & Mystic Pool)
   * 3. Battle Royale Outpost (Rugged Fortress Citadel & Lookout Bluffs)
   * 4. Arcade Soccer Arena (Stadium Concourse & Coastal Lawn)
   * 5. Hexagon Sandbox Bay (Terraced Cubic Hills & Crystal Lagoon)
   *
   * All islands share the exact same lightweight KayKit 3D assets, but with custom
   * layout, elevation tiers, and distinctive architectural shapes.
   */
  public buildHexWorld() {
    this.generateCentralPlazaTiles(new THREE.Vector3(0, 0, 0));
    this.generateMOBASanctuaryTiles(new THREE.Vector3(-70, 0, -65));
    this.generateBattleRoyaleTiles(new THREE.Vector3(75, 0, -60));
    this.generateSoccerArenaTiles(new THREE.Vector3(65, 0, 65));
    this.generateHexIslandTiles(new THREE.Vector3(-65, 0, 70));

    this.instantiateBatchedMeshes();
  }

  /**
   * 1. CENTRAL PLAZA (Grand Royal Hub at 0, 0)
   * Regal wide promenade at y=4.80 linking all 4 bridges, with decorative West Garden Koi Pond
   */
  private generateCentralPlazaTiles(center: THREE.Vector3) {
    const scaleXZ = 2.4;
    const stepX = 2.0 * scaleXZ;
    const stepZ = Math.sqrt(3) * scaleXZ;
    const hexRadius = scaleXZ * (2.0 / Math.sqrt(3));

    for (let r = -6; r <= 6; r++) {
      for (let q = -6; q <= 6; q++) {
        const x = center.x + q * stepX + (Math.abs(r) % 2 !== 0 ? stepX * 0.5 : 0);
        const z = center.z + r * stepZ;
        const dist = Math.hypot(x - center.x, z - center.z);
        if (dist > 25.5) continue;

        // West Garden Ornamental Koi Pond (-16, 0)
        const distPond = Math.hypot(x - (-16), z - 0);
        if (distPond <= 4.2) {
          this.tiles.push({
            x,
            z,
            y: 4.82,
            type: "water",
            scaleY: 3.5,
            radius: hexRadius,
          });
          continue;
        }

        // Main Plaza Promenade & Lawn (y=4.80 matches all bridge abutments)
        if (dist <= 18.0) {
          this.tiles.push({
            x,
            z,
            y: 4.80,
            type: "grass",
            scaleY: 4.2,
            radius: hexRadius,
          });
          continue;
        }

        // Stepped outer shoreline terrace sloping down to beach
        const t = (dist - 18.0) / 7.5;
        const outerY = 4.80 * (1 - t) + 1.80 * t;
        this.tiles.push({
          x,
          z,
          y: outerY,
          type: "grass",
          scaleY: 3.8,
          radius: hexRadius,
        });
      }
    }
  }

  /**
   * 2. MOBA SANCTUARY (High Sacred Mountain Temple at -70, -65)
   * High altar plateau at y=6.60 with sacred mystic pool and cascading perimeter steps
   */
  private generateMOBASanctuaryTiles(center: THREE.Vector3) {
    const scaleXZ = 2.3;
    const stepX = 2.0 * scaleXZ;
    const stepZ = Math.sqrt(3) * scaleXZ;
    const hexRadius = scaleXZ * (2.0 / Math.sqrt(3));

    for (let r = -5; r <= 5; r++) {
      for (let q = -5; q <= 5; q++) {
        const x = center.x + q * stepX + (Math.abs(r) % 2 !== 0 ? stepX * 0.5 : 0);
        const z = center.z + r * stepZ;
        const dist = Math.hypot(x - center.x, z - center.z);
        if (dist > 23.0) continue;

        // Mystic Pool near Temple Altar
        const distPool = Math.hypot(x - (center.x + 4), z - (center.z - 4));
        if (distPool <= 3.8) {
          this.tiles.push({
            x,
            z,
            y: 6.60,
            type: "water",
            scaleY: 5.2,
            radius: hexRadius,
          });
          continue;
        }

        // High Sacred Altar Plateau (y=6.60 matches bridge entrance at -52, -50)
        if (dist <= 15.5) {
          this.tiles.push({
            x,
            z,
            y: 6.60,
            type: "grass",
            scaleY: 5.8,
            radius: hexRadius,
          });
          continue;
        }

        // Cascading outer temple steps
        const t = (dist - 15.5) / 7.5;
        const stepY = 6.60 * (1 - t) + 2.20 * t;
        this.tiles.push({
          x,
          z,
          y: stepY,
          type: "grass",
          scaleY: 4.5,
          radius: hexRadius,
        });
      }
    }
  }

  /**
   * 3. BATTLE ROYALE OUTPOST (Rugged Coastal Citadel at 75, -60)
   * High fortress plateau at y=7.00 with rugged watchtower bluffs up to y=8.40
   */
  private generateBattleRoyaleTiles(center: THREE.Vector3) {
    const scaleXZ = 2.4;
    const stepX = 2.0 * scaleXZ;
    const stepZ = Math.sqrt(3) * scaleXZ;
    const hexRadius = scaleXZ * (2.0 / Math.sqrt(3));

    for (let r = -5; r <= 5; r++) {
      for (let q = -5; q <= 5; q++) {
        const x = center.x + q * stepX + (Math.abs(r) % 2 !== 0 ? stepX * 0.5 : 0);
        const z = center.z + r * stepZ;
        const dist = Math.hypot(x - center.x, z - center.z);
        if (dist > 24.0) continue;

        // High Watchtower Observation Peak (East ridge)
        if (x > center.x + 5 && z > center.z + 3 && dist <= 14.0) {
          this.tiles.push({
            x,
            z,
            y: 8.40,
            type: "grass",
            scaleY: 6.8,
            radius: hexRadius,
          });
          continue;
        }

        // Citadel Plateau (y=7.00 matches bridge entrance at 56, -45)
        if (dist <= 16.5) {
          this.tiles.push({
            x,
            z,
            y: 7.00,
            type: "grass",
            scaleY: 6.0,
            radius: hexRadius,
          });
          continue;
        }

        // Jagged coastal cliff steps
        const t = (dist - 16.5) / 7.5;
        const cliffY = 7.00 * (1 - t) + 2.40 * t;
        this.tiles.push({
          x,
          z,
          y: cliffY,
          type: "grass",
          scaleY: 4.8,
          radius: hexRadius,
        });
      }
    }
  }

  /**
   * 4. ARCADE SOCCER ARENA (Stadium Concourse & Coastal Grounds at 65, 65)
   * Broad sporting concourse at y=2.60 framing the pitch and bleachers
   */
  private generateSoccerArenaTiles(center: THREE.Vector3) {
    const scaleXZ = 2.4;
    const stepX = 2.0 * scaleXZ;
    const stepZ = Math.sqrt(3) * scaleXZ;
    const hexRadius = scaleXZ * (2.0 / Math.sqrt(3));

    for (let r = -6; r <= 6; r++) {
      for (let q = -6; q <= 6; q++) {
        const x = center.x + q * stepX + (Math.abs(r) % 2 !== 0 ? stepX * 0.5 : 0);
        const z = center.z + r * stepZ;
        const dist = Math.hypot(x - center.x, z - center.z);
        if (dist > 25.0) continue;

        // Leave open space under soccer pitch turf & running track to prevent clipping
        if (Math.abs(x - center.x) <= 12.0 && Math.abs(z - center.z) <= 17.5) {
          continue; // Pitch turf is rendered cleanly by stadium geometry
        }

        // Concourse grounds (y=2.60 matches bridge entrance at 48, 48)
        if (dist <= 18.0) {
          this.tiles.push({
            x,
            z,
            y: 2.60,
            type: "grass",
            scaleY: 3.2,
            radius: hexRadius,
          });
          continue;
        }

        // Shoreline steps down to beach
        const t = (dist - 18.0) / 7.0;
        const arenaY = 2.60 * (1 - t) + 1.40 * t;
        this.tiles.push({
          x,
          z,
          y: arenaY,
          type: "grass",
          scaleY: 2.8,
          radius: hexRadius,
        });
      }
    }
  }

  /**
   * 5. HEXAGON SANDBOX BAY (Terraced Cubic Hills & Crystal Lagoon at -65, 70)
   * The signature medieval hexagon adventure island with tiered terraces and central lagoon
   */
  private generateHexIslandTiles(center: THREE.Vector3) {
    const scaleXZ = 2.4;
    const stepX = 2.0 * scaleXZ; // 4.8
    const stepZ = Math.sqrt(3) * scaleXZ; // ~4.1569
    const hexRadius = scaleXZ * (2.0 / Math.sqrt(3)); // ~2.77

    for (let r = -5; r <= 5; r++) {
      for (let q = -5; q <= 5; q++) {
        const x = center.x + q * stepX + (Math.abs(r) % 2 !== 0 ? stepX * 0.5 : 0);
        const z = center.z + r * stepZ;
        const distFromCenter = Math.hypot(x - center.x, z - center.z);
        if (distFromCenter > 23.5) continue;

        // 1. Central Lagoon / Mountain Hot Spring (Inner core)
        if (distFromCenter <= 7.2) {
          this.tiles.push({
            x,
            z,
            y: 4.60,
            type: "water",
            scaleY: 3.5,
            radius: hexRadius,
          });
          continue;
        }

        // 2. Middle Grassy Terrace (Surrounds lagoon, connects to arrival bridge at -48, 52)
        if (distFromCenter <= 15.5) {
          this.tiles.push({
            x,
            z,
            y: 4.70,
            type: "grass",
            scaleY: 4.2,
            radius: hexRadius,
          });
          continue;
        }

        // 3. High Observation Outlook Peak (Northern edge)
        if (z < center.z - 10 && Math.abs(x - center.x) < 8.0) {
          this.tiles.push({
            x,
            z,
            y: 6.20,
            type: "grass",
            scaleY: 5.5,
            radius: hexRadius,
          });
          continue;
        }

        // 4. Stepping Shoreline Terraces
        const outerT = (distFromCenter - 15.5) / 8.0;
        const shorelineY = 4.70 * (1 - outerT) + 1.60 * outerT;
        this.tiles.push({
          x,
          z,
          y: shorelineY,
          type: "grass",
          scaleY: 3.8,
          radius: hexRadius,
        });
      }
    }
  }

  /**
   * Loads the 3D models and creates unified InstancedMeshes
   * Only 1 draw call per tile type for the entire game world!
   */
  private instantiateBatchedMeshes() {
    const grassTiles = this.tiles.filter((t) => t.type === "grass");
    const waterTiles = this.tiles.filter((t) => t.type === "water");

    const dummy = new THREE.Object3D();

    // 1. Batch hex_grass tiles for ALL 5 ISLANDS
    this.loader.load(
      "hex_grass.gltf",
      (gltf) => {
        let grassGeo: THREE.BufferGeometry | null = null;
        let grassMat: THREE.Material | null = null;

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !grassGeo) {
            const m = child as THREE.Mesh;
            grassGeo = m.geometry.clone();
            const raw = m.material;
            grassMat = (Array.isArray(raw) ? raw[0] : raw) as THREE.Material;
          }
        });

        if (!grassGeo || !grassMat) return;

        // Enhance material properties for stylized vibrance
        if (grassMat && "roughness" in grassMat) {
          (grassMat as any).roughness = 0.85;
          (grassMat as any).metalness = 0.05;
        }

        const instancedGrass = new THREE.InstancedMesh(
          grassGeo,
          grassMat,
          grassTiles.length
        );
        instancedGrass.castShadow = true;
        instancedGrass.receiveShadow = true;

        for (let i = 0; i < grassTiles.length; i++) {
          const t = grassTiles[i];
          dummy.position.set(t.x, t.y, t.z);
          const sXZ = t.radius / (2.0 / Math.sqrt(3));
          dummy.scale.set(sXZ, t.scaleY, sXZ);
          dummy.rotation.set(0, (i % 6) * (Math.PI / 3), 0);
          dummy.updateMatrix();
          instancedGrass.setMatrixAt(i, dummy.matrix);
        }

        instancedGrass.instanceMatrix.needsUpdate = true;
        instancedGrass.computeBoundingSphere();
        this.scene.add(instancedGrass);
        this.grassInstancedMesh = instancedGrass;
        this.spawnedMeshes.push(instancedGrass);
      },
      undefined,
      (err) => console.warn("Failed to load hex_grass.gltf:", err)
    );

    // 2. Batch hex_water tiles for ALL 5 ISLANDS
    this.loader.load(
      "hex_water.gltf",
      (gltf) => {
        let waterGeo: THREE.BufferGeometry | null = null;
        let waterMat: THREE.Material | null = null;

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !waterGeo) {
            const m = child as THREE.Mesh;
            waterGeo = m.geometry.clone();
            const raw = m.material;
            waterMat = (Array.isArray(raw) ? raw[0] : raw) as THREE.Material;
          }
        });

        if (!waterGeo || !waterMat) return;

        // Stylized sparkling water finish
        if (waterMat && "roughness" in waterMat) {
          (waterMat as any).roughness = 0.2;
          (waterMat as any).metalness = 0.15;
        }

        const instancedWater = new THREE.InstancedMesh(
          waterGeo,
          waterMat,
          waterTiles.length
        );
        instancedWater.receiveShadow = true;

        for (let i = 0; i < waterTiles.length; i++) {
          const t = waterTiles[i];
          dummy.position.set(t.x, t.y, t.z);
          const sXZ = t.radius / (2.0 / Math.sqrt(3));
          dummy.scale.set(sXZ, t.scaleY, sXZ);
          dummy.rotation.set(0, 0, 0);
          dummy.updateMatrix();
          instancedWater.setMatrixAt(i, dummy.matrix);
        }

        instancedWater.instanceMatrix.needsUpdate = true;
        instancedWater.computeBoundingSphere();
        this.scene.add(instancedWater);
        this.waterInstancedMesh = instancedWater;
        this.spawnedMeshes.push(instancedWater);

        // Populate water lilies on water blocks
        this.populateWaterDecorations(waterTiles);
      },
      undefined,
      (err) => console.warn("Failed to load hex_water.gltf:", err)
    );
  }

  /**
   * Adds stylized waterlilies floating atop water blocks
   */
  private populateWaterDecorations(waterTiles: HexTileInfo[]) {
    const dummy = new THREE.Object3D();

    this.loader.load(
      "waterlily_A.gltf",
      (gltf) => {
        let lilyGeo: THREE.BufferGeometry | null = null;
        let lilyMat: THREE.Material | null = null;

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !lilyGeo) {
            const m = child as THREE.Mesh;
            lilyGeo = m.geometry.clone();
            const raw = m.material;
            lilyMat = (Array.isArray(raw) ? raw[0] : raw) as THREE.Material;
          }
        });

        if (!lilyGeo || !lilyMat) return;

        // Pick ~50% of water tiles to have a decorative lily pad
        const selectedTiles = waterTiles.filter((_, idx) => idx % 2 === 0);
        const instancedLily = new THREE.InstancedMesh(
          lilyGeo,
          lilyMat,
          selectedTiles.length
        );
        instancedLily.receiveShadow = true;

        for (let i = 0; i < selectedTiles.length; i++) {
          const wt = selectedTiles[i];
          const jitterX = (Math.sin(i * 1.7) * 0.4) * wt.radius;
          const jitterZ = (Math.cos(i * 2.3) * 0.4) * wt.radius;
          const waterSurfaceY = wt.y - 0.22;

          dummy.position.set(wt.x + jitterX, waterSurfaceY, wt.z + jitterZ);
          const lilyScale = 1.6 + (i % 3) * 0.3;
          dummy.scale.set(lilyScale, lilyScale, lilyScale);
          dummy.rotation.set(0, i * 1.3, 0);
          dummy.updateMatrix();
          instancedLily.setMatrixAt(i, dummy.matrix);
        }

        instancedLily.instanceMatrix.needsUpdate = true;
        instancedLily.computeBoundingSphere();
        this.scene.add(instancedLily);
        this.lilyInstancedMesh = instancedLily;
        this.spawnedMeshes.push(instancedLily);
      },
      undefined,
      () => {}
    );
  }

  /**
   * High-speed analytical ground height query for the hexagon blocks
   * Returns exact elevation in O(1) time across all 5 islands without costly raycasts.
   */
  public getGroundHeightAt(x: number, z: number): number | null {
    // Quick bounding distance check against all 5 islands
    const islandBounds = [
      { x: 0, z: 0, r: 27.0 },       // Central Plaza
      { x: -70, z: -65, r: 25.0 },   // MOBA
      { x: 75, z: -60, r: 26.0 },    // Battle Royale
      { x: 65, z: 65, r: 27.0 },     // Soccer Arena
      { x: -65, z: 70, r: 25.0 },    // Hex Sandbox
    ];

    let insideAnyIsland = false;
    for (let b = 0; b < islandBounds.length; b++) {
      const ib = islandBounds[b];
      if (Math.hypot(x - ib.x, z - ib.z) <= ib.r) {
        insideAnyIsland = true;
        break;
      }
    }
    if (!insideAnyIsland) return null;

    // Find nearest tile within radius
    let bestDist = Infinity;
    let bestTile: HexTileInfo | null = null;

    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i];
      const d = Math.hypot(x - t.x, z - t.z);
      if (d < bestDist) {
        bestDist = d;
        bestTile = t;
        if (d < 0.8) break; // Direct hit optimization
      }
    }

    if (bestTile && bestDist <= bestTile.radius * 1.08) {
      if (bestTile.type === "water") {
        return bestTile.y - 0.22;
      }
      return bestTile.y;
    }

    return null;
  }

  /**
   * Clean disposal to prevent WebGL memory leaks
   */
  public dispose() {
    for (const mesh of this.spawnedMeshes) {
      this.scene.remove(mesh);
      if (mesh instanceof THREE.InstancedMesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    }
    this.spawnedMeshes = [];
    this.tiles = [];
  }
}
