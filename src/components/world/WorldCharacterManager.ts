"use client";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { getCharacterTexture, attachCharacterAccessories } from "./WorldCharacterTextures";

export interface CharacterSpawnRequest {
  id: string;
  name?: string;
  pos: THREE.Vector3;
  rotY: number;
  scale?: number;
  tintColor?: number;
  initialAnim?: string;
  targetGroup?: THREE.Group;
}

export interface ActiveCharacter {
  id: string;
  group: THREE.Group;
  model: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: Map<string, THREE.AnimationAction>;
  currentAction: THREE.AnimationAction | null;
}

export class WorldCharacterManager {
  private scene: THREE.Scene;
  private loader: GLTFLoader;
  private characterTexture: THREE.Texture | null = null;

  private protoScene: THREE.Group | null = null;
  private animationClips: THREE.AnimationClip[] = [];
  public isLoaded = false;
  private pendingSpawns: CharacterSpawnRequest[] = [];

  public characters: Map<string, ActiveCharacter> = new Map();
  private spawnedRoots: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.loader.setPath("/assets/3d/characters/");

    // 1. Load authentic KayKit character texture
    const texLoader = new THREE.TextureLoader();
    texLoader.load(
      "/assets/3d/characters/mannequin_texture.png",
      (tex) => {
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        this.characterTexture = tex;
        if (this.protoScene) {
          this.applyTextureToHierarchy(this.protoScene);
        }
      },
      undefined,
      (err) => console.warn("[WorldCharacterManager] Texture note:", err)
    );

    // 2. Load General Rig (Idles, Interact, Combat) & Movement Rig (Walking, Running)
    this.loadCharacterModels();
  }

  private applyTextureToHierarchy(root: THREE.Object3D, characterId?: string) {
    const tex = characterId ? getCharacterTexture(characterId) : (this.characterTexture || null);
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          color: 0xffffff, // 100% crisp true color reproduction without mudding details
          roughness: 0.65,
          metalness: 0.05,
        });
        m.material = mat;
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }

  private loadCharacterModels() {
    // Load General rig first (geometry + base animations)
    this.loader.load(
      "Rig_Medium_General.glb",
      (gltf) => {
        this.protoScene = gltf.scene;
        this.animationClips.push(...gltf.animations);

        // Also load Movement rig to get authentic Walking_A, Walking_B, Running
        this.loader.load(
          "Rig_Medium_MovementBasic.glb",
          (moveGltf) => {
            this.animationClips.push(...moveGltf.animations);
            this.onReady();
          },
          undefined,
          () => {
            // If movement glb fails, proceed with general animations
            this.onReady();
          }
        );
      },
      undefined,
      (err) => console.warn("[WorldCharacterManager] Failed to load Rig_Medium_General.glb:", err)
    );
  }

  private onReady() {
    this.isLoaded = true;

    if (this.protoScene && this.characterTexture) {
      this.applyTextureToHierarchy(this.protoScene);
    }

    // Process any queued spawns
    const queue = [...this.pendingSpawns];
    this.pendingSpawns = [];
    queue.forEach((req) => this.instantiateCharacter(req));
  }

  /**
   * Spawns an animated 3D KayKit humanoid character with skeletal animation.
   */
  public spawnCharacter(req: CharacterSpawnRequest): THREE.Group {
    if (!this.isLoaded || !this.protoScene) {
      const placeholder = req.targetGroup || new THREE.Group();
      if (!req.targetGroup) {
        placeholder.position.copy(req.pos);
        placeholder.rotation.y = req.rotY;
        this.scene.add(placeholder);
      }
      this.pendingSpawns.push({ ...req, targetGroup: placeholder });
      return placeholder;
    }

    return this.instantiateCharacter(req);
  }

  private instantiateCharacter(req: CharacterSpawnRequest): THREE.Group {
    if (!this.protoScene) return req.targetGroup || new THREE.Group();

    // MUST use SkeletonUtils.clone for SkinnedMesh in Three.js
    const charModel = SkeletonUtils.clone(this.protoScene);
    const s = req.scale || 1.0;
    charModel.scale.set(s, s, s);

    // Apply personalized high-definition texture
    this.applyTextureToHierarchy(charModel, req.id);

    // Attach authentic 3D headwear, hair, or thematic props to skeletal head bone
    attachCharacterAccessories(req.id, charModel);

    const hostGroup = req.targetGroup || new THREE.Group();
    if (!req.targetGroup) {
      hostGroup.position.copy(req.pos);
      hostGroup.rotation.y = req.rotY;
      this.scene.add(hostGroup);
    }
    hostGroup.add(charModel);

    // Setup skeletal animation mixer and action library
    if (this.animationClips.length > 0) {
      const mixer = new THREE.AnimationMixer(charModel);
      const actions = new Map<string, THREE.AnimationAction>();

      this.animationClips.forEach((clip) => {
        actions.set(clip.name, mixer.clipAction(clip));
      });

      const chosenAnimName = req.initialAnim || "Idle_A";
      const startAction = actions.get(chosenAnimName) || actions.get("Idle_A") || Array.from(actions.values())[0];

      if (startAction) {
        startAction.time = Math.random() * (startAction.getClip().duration || 1);
        startAction.play();
      }

      this.characters.set(req.id, {
        id: req.id,
        group: hostGroup,
        model: charModel,
        mixer,
        actions,
        currentAction: startAction || null,
      });
    }

    this.spawnedRoots.push(hostGroup);
    return hostGroup;
  }

  /**
   * Smoothly crossfades between animations (e.g. Idle_A -> Interact when talking, or Idle -> Walking)
   */
  public playAnimation(id: string, animName: string, duration: number = 0.3) {
    const char = this.characters.get(id);
    if (!char) return;

    const nextAction = char.actions.get(animName);
    if (!nextAction || nextAction === char.currentAction) return;

    if (char.currentAction) {
      char.currentAction.fadeOut(duration);
    }
    nextAction.reset().fadeIn(duration).play();
    char.currentAction = nextAction;
  }

  /**
   * Advances skeletal animations each frame
   */
  public update(delta: number) {
    this.characters.forEach((char) => {
      char.mixer.update(delta);
    });
  }

  public dispose() {
    this.characters.forEach((char) => {
      char.mixer.stopAllAction();
    });
    this.characters.clear();

    this.spawnedRoots.forEach((c) => this.scene.remove(c));
    this.spawnedRoots = [];

    this.protoScene = null;
    this.animationClips = [];
    this.pendingSpawns = [];
    if (this.characterTexture) {
      this.characterTexture.dispose();
      this.characterTexture = null;
    }
  }
}
