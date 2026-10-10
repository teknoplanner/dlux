# D Lucky World 3D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive 3D browser-playable open-world game ("D Lucky World 3D") inspired directly by Coastal World (Merci-Michel), featuring mascot Milo the Cat, procedural archipelago islands, soccer physics, collectible tokens, and an authentic virtual smartphone UI.

**Architecture:** A lightweight Three.js 3D engine (`WorldEngine.ts`) embedded inside Next.js (`/world`), paired with a Coastal World replica HUD (`WorldHUD.tsx`), Web Audio procedural synthesizer (`WorldAudio.ts`), and interactive virtual smartphone drawer (`WorldSmartphone.tsx`) providing live GPS minimap navigation, fast travel, quests, and gear locker.

**Tech Stack:** Next.js 14 App Router, React 18, Three.js (`three`), Lucide Icons, Web Audio API, Tailwind CSS.

**Spec:** [`docs/superpowers/specs/2026-10-10-dlucky-world-3d-design.md`](file:///Users/dederpl/Documents/ProjectExternal/dluckyx/docs/superpowers/specs/2026-10-10-dlucky-world-3d-design.md)

## Global Constraints
- Target route: `/world` and navbar entry `World` in `src/components/layout/Navbar.tsx`.
- Zero external heavy 3D asset downloads (.gltf/.obj/.mp3): use procedural Three.js geometries and procedural Web Audio API synthesis.
- 60 FPS performance on mobile and desktop devices.
- Support both desktop (Keyboard/Mouse) and mobile (Virtual Joystick/Touch buttons) controls.
- Clean memory cleanup on unmount: dispose geometries, materials, listeners, and animation loop.

## Review Focus
- Browser resize during gameplay: canvas and camera aspect ratio must update without distortion.
- Audio context user-gesture policy: Web Audio context must initialize only after player interacts (click/touch/key) without browser console errors.
- Fast travel teleport: player coordinate and physics velocity must cleanly reset to target island without camera snapping or falling through terrain.
- Soccer ball boundary: ball physics must stay within the soccer bay area and reset after goal celebration.
- Mobile touch multi-touch handling: simultaneous steering via joystick and jumping/nitro via touch buttons without ghost touches.

---

### Task 1: Navigation Bar & Page Scaffolding

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Create: `src/app/world/page.tsx`

**Interfaces:**
- Produces: Route `/world` and navbar link `World` with `Compass` icon and badge `3D`.

- [ ] **Step 1: Update `src/components/layout/Navbar.tsx`**
  Add `World` link in desktop navigation between `Featured` and `Blog`, and in mobile menu drawer with `Compass` icon.
- [ ] **Step 2: Create placeholder page `src/app/world/page.tsx`**
  Full-viewport layout with metadata (`title: "D Lucky World 3D | Interactive Gaming Archipelago"`).
- [ ] **Step 3: Verify navigation renders**
  Run `npm run build` or inspect page routing.
- [ ] **Step 4: Commit**
  `git add src/components/layout/Navbar.tsx src/app/world/page.tsx`  
  `git commit -m "feat(world): add World route and navbar navigation"`

---

### Task 2: Procedural Web Audio Synthesizer

**Files:**
- Create: `src/components/world/WorldAudio.ts`

**Interfaces:**
- Produces: `WorldAudio` class with methods `playFootstep()`, `playSplash()`, `playEngine(speed: number)`, `playCoin()`, `playJump()`, `playBoost()`, `playGoal()`, `playFanfare()`, and `toggleMute()`.

- [ ] **Step 1: Implement `WorldAudio.ts` using browser Web Audio API**
  Create lazy `AudioContext` initiated on user gesture. Synthesize oscillator frequencies for footsteps, coin chimes (sine B5->E6), whoosh noise sweeps, engine sawtooth hum, and trumpet goal fanfare.
- [ ] **Step 2: Add audio mute & volume toggle state**
  Support safe audio suspension and volume gain node.
- [ ] **Step 3: Commit**
  `git add src/components/world/WorldAudio.ts`  
  `git commit -m "feat(world): add procedural Web Audio synthesizer"`

---

### Task 3: Three.js Archipelago World Engine

**Files:**
- Create: `src/components/world/WorldEngine.ts`

**Interfaces:**
- Produces: `WorldEngine` class managing Scene, Camera, Renderer, Clock, stylized ocean water plane, 5 islands (Central Hub, MOBA Sanctuary, Battle Royale Outpost, Voxel Bay, Soccer Arena), and animation loop.

- [ ] **Step 1: Initialize Three.js scene, perspective camera, renderer, and lighting**
  Setup directional sunlight, hemisphere ambient lighting, and sky fog.
- [ ] **Step 2: Build stylized animated ocean mesh**
  Implement wavy water surface with cyan-turquoise gradient material.
- [ ] **Step 3: Construct the 5 thematic islands**
  - Central Plaza: Sand base, green plateau, gazebo, stone pathways.
  - MOBA Sanctuary: Cliff island, towering glowing sword monolith, crystal towers.
  - Battle Royale Outpost: Rocky plateaus, wooden jump ramps, red airdrop crate.
  - Voxel Sandbox Bay: Stepped cubic grass blocks and voxel trees.
  - Soccer Arena: Floating goal net and bay boundary buoys.
- [ ] **Step 4: Commit**
  `git add src/components/world/WorldEngine.ts`  
  `git commit -m "feat(world): create Three.js archipelago environment and ocean"`

---

### Task 4: Third-Person Milo Character & Locomotion Physics

**Files:**
- Modify: `src/components/world/WorldEngine.ts`

**Interfaces:**
- Produces: Milo 3D procedural character model (cat hero with goggles and cape), walking/running/jumping physics, watercraft jet ski model, and smooth follow camera.

- [ ] **Step 1: Construct Milo procedural 3D model**
  Body, head, cat ears, tail, cyan sci-fi goggles, and animated blue hero cape.
- [ ] **Step 2: Construct Cyber Jet Ski model**
  Sleek watercraft with neon trim; automatically appears when Milo is on water.
- [ ] **Step 3: Implement physics & camera follow**
  Velocity integration, friction damping, gravity, water buoyancy, and smooth third-person camera lerp.
- [ ] **Step 4: Commit**
  `git add src/components/world/WorldEngine.ts`  
  `git commit -m "feat(world): implement Milo avatar controller, physics and camera follow"`

---

### Task 5: Collectibles, Soccer Ball Physics & NPC Proximity

**Files:**
- Modify: `src/components/world/WorldEngine.ts`

**Interfaces:**
- Produces: 30 spinning golden tokens, 4 speed boost rings, interactive soccer ball with bounce/goal detection, and NPC entities with proximity detection.

- [ ] **Step 1: Spawn golden tokens & speed rings**
  Add rotational animation, magnetic pull, and collision collection callback.
- [ ] **Step 2: Implement interactive soccer ball in Soccer Arena**
  Spherical physics with velocity, friction, bounce off buoys, and net goal trigger (`onGoal`).
- [ ] **Step 3: Spawn island NPCs with proximity markers**
  Place NPCs (Valen, Jax, Blocky, Striker) with 3D coordinate tracking for screen HUD markers.
- [ ] **Step 4: Commit**
  `git add src/components/world/WorldEngine.ts`  
  `git commit -m "feat(world): add collectible tokens, soccer ball physics and NPCs"`

---

### Task 6: Coastal World HUD & Screen Overlays

**Files:**
- Create: `src/components/world/WorldHUD.tsx`
- Create: `src/components/world/WorldControls.tsx`
- Create: `src/components/world/WorldDialogueModal.tsx`

**Interfaces:**
- Produces: Complete Coastal World-style HUD (Brand pill, location banner, coin counter, audio toggle, fullscreen, 3D billboard interact prompts, dialogue bottom sheet).

- [ ] **Step 1: Build `WorldHUD.tsx`**
  Top brand pill, current island location banner, coin stats, and bottom-right phone button.
- [ ] **Step 2: Build `WorldControls.tsx`**
  Keyboard event listeners (`WASD`, Arrow keys, Space, Shift, E) and mobile on-screen virtual joystick & action buttons.
- [ ] **Step 3: Build `WorldDialogueModal.tsx`**
  NPC dialogue bottom sheet with typewriter animation, NPC portraits, and response choices.
- [ ] **Step 4: Commit**
  `git add src/components/world/WorldHUD.tsx src/components/world/WorldControls.tsx src/components/world/WorldDialogueModal.tsx`  
  `git commit -m "feat(world): add Coastal World HUD, dialogue sheet and controls"`

---

### Task 7: Virtual Smartphone Hub & GPS Minimap

**Files:**
- Create: `src/components/world/WorldSmartphone.tsx`
- Create: `src/components/world/WorldGameCanvas.tsx`
- Modify: `src/app/world/page.tsx`

**Interfaces:**
- Produces: Virtual smartphone drawer with Minimap GPS (with Fast Travel teleportation), Quests checklist, Milo's Gear Locker, and Game Showcase.

- [ ] **Step 1: Build `WorldSmartphone.tsx`**
  Curved device bezel, status bar, and 4 functional tabs:
  - Tab 1: **GPS Map**: SVG archipelago map with live Milo coordinates and clickable Fast Travel teleport buttons.
  - Tab 2: **Quests**: 4 gaming missions with status checkboxes.
  - Tab 3: **Locker**: Toggle accessories (Jetpack, Speed Shoes, Cyber Visor).
  - Tab 4: **Games**: App cards linking to D Lucky X Google Play Store.
- [ ] **Step 2: Build `WorldGameCanvas.tsx`**
  Assemble Three.js canvas, Engine loop, HUD, Smartphone drawer, and Dialogues.
- [ ] **Step 3: Mount in `src/app/world/page.tsx`**
  Ensure responsive full-screen mounting with loading screen.
- [ ] **Step 4: Commit**
  `git add src/components/world/WorldSmartphone.tsx src/components/world/WorldGameCanvas.tsx src/app/world/page.tsx`  
  `git commit -m "feat(world): implement virtual smartphone hub, minimap and game canvas"`

---

### Task 8: Verification, Build & Remote Push

**Files:**
- Verify: Full static build & linting

- [ ] **Step 1: Run static export test**
  Execute `npm run build` to verify all static pages compile cleanly.
- [ ] **Step 2: Verify game features and edge cases**
  Check resize handler, audio initialization, mobile touch responsiveness, and fast-travel teleport.
- [ ] **Step 3: Commit & push to origin main**
  Stage all files and push to GitHub remote.
