# D Lucky World 3D — Architecture & Design Specification
**Date:** 2026-10-10  
**Status:** Approved  
**Reference Inspiration:** [Coastal World by Merci-Michel](https://coastalworld.merci-michel.com/)  
**Platform:** Next.js 14 App Router, Three.js (`three`), Web Audio API, Tailwind CSS  

---

## 1. Overview & Vision

**D Lucky World 3D** is an interactive, browser-based 3D open-world adventure game set in an expansive tropical archipelago. Directly modeled on the design patterns and interface paradigms of **Coastal World by Merci-Michel**, the experience features:
- **Hero Character:** Third-person avatar control of **Milo the Space Hero Cat** (the official mascot of D Lucky X).
- **Dual Locomotion:** On-foot island exploration (running, jumping, jetpack boosting) and seamless transition to watercraft (Jet Ski / Speedboat) when entering the ocean.
- **Iconic Virtual Smartphone UI:** A fully functional in-game smartphone serving as the player's primary navigation hub, housing a live GPS Minimap with fast travel, Quests tracker, Milo's Gear Locker, and Game Showcase.
- **100% Gaming Context:** Four uniquely themed islands celebrating gaming genres (MOBA Arena, Battle Royale Outpost, Voxel Sandbox, Arcade Soccer Bay).
- **Interactive Mechanics:** Floating proximity-aware 3D Billboard icons, NPC dialogue sheets, physics-driven soccer ball kicking into a floating goal, jump ramps with airtime, and collectible golden gaming tokens.
- **Universal Controls:** Keyboard & Mouse for Desktop; responsive on-screen Virtual Joystick and touch action buttons for Mobile.
- **Zero Heavy Assets:** Procedural low-poly Three.js geometry, stylized shaders/materials, and Web Audio API synthesis ensuring sub-1-second load times and steady 60 FPS performance on both mobile and desktop.

---

## 2. Information Architecture & Navigation

### 2.1 Navigation Bar Updates
- **Desktop Navbar (`src/components/layout/Navbar.tsx`):**
  - Add `World` link between `Featured` and `Blog`.
  - Icon: `Globe` / `Compass` with subtle highlight badge (`3D`).
- **Mobile Menu Drawer:**
  - Add `World` link with icon and clear touch target.
- **Route:** `/world` (`src/app/world/page.tsx`).

---

## 3. Detailed Component Architecture

```
src/
├── app/
│   └── world/
│       └── page.tsx              # Full-screen Next.js page wrapper with metadata
├── components/
│   └── world/
│       ├── WorldGameCanvas.tsx    # Three.js Canvas container & game loop orchestrator
│       ├── WorldEngine.ts         # Three.js 3D world, terrain, physics, entities & camera
│       ├── WorldHUD.tsx           # Coastal World style screen overlays (HUD, stats, banners)
│       ├── WorldSmartphone.tsx    # Virtual Smartphone drawer (Minimap GPS, Quests, Gear, Apps)
│       ├── WorldDialogueModal.tsx # NPC dialogue bottom sheet with typewriter effect
│       ├── WorldControls.tsx      # Mobile virtual joystick & desktop key listeners
│       └── WorldAudio.ts          # Procedural Web Audio API sound synthesizer
```

---

## 4. Subsystem Specifications

### 4.1 3D World & Terrain (`WorldEngine.ts`)
* **Ocean & Water Shader:**
  * PlaneGeometry (200x200 units) with vertex wave displacement.
  * Stylized tropical ocean colors: deep cyan to turquoise gradient, specular sun reflections, shoreline foam ring around islands.
* **Island Archipelago Layout:**
  1. **Central Plaza (Hub Island):** Spawn point, welcoming gazebo, golden fountain, training ramps.
  2. **MOBA Sanctuary (North-West):** Rocky citadel with giant glowing sword monolith, crystal towers, and NPC *"Valen the MOBA Knight"*.
  3. **Battle Royale Outpost (North-East):** Cliff plateau with red airdrop crate, parachute, wooden stunt jump ramps, and NPC *"Jax the Commando"*.
  4. **Voxel Sandbox Bay (South-West):** Stepped cubic terrain (Minecraft/Roblox aesthetic), voxel trees, golden coin stacks, and NPC *"Blocky the Architect"*.
  5. **Arcade Soccer Arena (South-East):** Floating goalposts with net and an interactive giant soccer ball (sphere with dynamic velocity & bounce physics) that triggers a **"GOAL!"** fanfare and particle explosion when knocked into the net.
* **Collectibles & Props:**
  * 30 Golden Gaming Tokens floating and spinning above ground and water with animated magnetic attraction when Milo is close.
  * 4 Speed Boost Rings emitting pulsing neon particles.
  * Stunt jump ramps placed along oceanic channels.

### 4.2 Character Controller & Physics
* **Milo Avatar:**
  * Procedural 3D cat hero model: orange fur, white chest, tail, sci-fi visor goggles, and animated blue hero cape.
  * States: `IDLE` (gentle breathing), `RUN` (bobbing stride & tilted torso), `JUMP` (tucked legs in air), `WATER` (hops onto sleek Cyber Jet Ski with wake trail).
  * Physics: Horizontal velocity with friction/damping, vertical gravity (-22 u/s²), collision detection with terrain and island boundaries.
  * Jetpack / Sprint: Holding Shift (or tapping Turbo button) activates high-speed thruster with particle trail.
* **Camera System:**
  * Third-person smooth follow camera (offset: x=0, y=4.5, z=7.5 behind player).
  * Damped interpolation (`lerp`) to prevent abrupt motion sickness.
  * Dynamic elevation adjustment when climbing hills or jumping.

### 4.3 Coastal World UI & Virtual Smartphone (`WorldHUD.tsx` & `WorldSmartphone.tsx`)
* **HUD Overlay:**
  * **Top-Left:** `D LUCKY WORLD` pill with online indicator dot.
  * **Top-Center:** Dynamic Location Pill (`📍 Central Plaza`, `📍 MOBA Sanctuary`, etc.).
  * **Top-Right:**
    * Coin Counter: `🪙 <count> / 30`.
    * Sound Toggle (Mute / Unmute).
    * Fullscreen Button (`⛶`).
    * How-To-Play Guide Button (`ℹ️`).
  * **Floating 3D Proximity Markers:**
    * Above NPCs and interactive points, rendered as 2D screen-projected badges (`💬 Talk`, `⚽ Play`, `🏆 Inspect`).
    * Distance threshold: Scales up with pulse effect when player is within 6 units, displaying `[E] / Ketuk untuk Berinteraksi`.
* **The Virtual Smartphone:**
  * Triggered via bottom-right floating pill button (`📱 Phone Hub`).
  * Slides up as a realistic mobile device mockup (curved bezel, status bar with 100% battery, Wi-Fi icon, clock):
    * **App 1: Archipelago GPS Map:** Vector map of the 5 islands with live player coordinate pin, orientation compass, and **Fast Travel** buttons allowing instant teleportation.
    * **App 2: Quests & Missions:** 4 active gamer quests:
      1. *"The Sacred Blade"* — Speak with Valen at MOBA Sanctuary.
      2. *"Strike the Post"* — Kick the soccer ball into the goal at Soccer Arena.
      3. *"Airdrop Hunter"* — Discover the Battle Royale Outpost.
      4. *"Token Collector"* — Collect at least 15 golden tokens across the archipelago.
    * **App 3: Milo's Locker:** Toggle accessories (Neon Jetpack, Speed Boots, Cyber Visor).
    * **App 4: Games Library:** Showcase cards for D Lucky X's published games on Google Play.

### 4.4 Audio Synthesis (`WorldAudio.ts`)
* Procedural sound generation using standard browser **Web Audio API**:
  * Footsteps / Water Splash: White noise bursts with bandpass filter.
  * Jet Ski Engine: Low frequency sawtooth oscillator with frequency tied to speed.
  * Coin Pickup: Dual sine-wave arpeggio (B5 -> E6) chime.
  * Jump / Boost: Filter sweep whoosh.
  * Goal Fanfare: Brass-chord synthesis sequence with festive arpeggio.
  * Quest Completion: Victory fanfare chime.
* No external `.mp3` or `.wav` network downloads; zero latency and offline-ready.

---

## 5. Verification & Testing Strategy
1. **Desktop Keyboard & Mouse Controls:** Verify `WASD`, `Arrow Keys`, `Space` (jump), `Shift` (boost), and `E` (interact) function smoothly.
2. **Mobile Touch Controls:** Verify on-screen virtual joystick and touch buttons respond with zero delay on touch devices.
3. **Gameplay Mechanics:**
   - Walking on land vs riding jet ski on water.
   - Coin collection updates HUD counter and plays audio chime.
   - Soccer ball physics: Player can ram ball into net; verifies "GOAL!" celebration.
   - NPC proximity trigger: pressing [E] opens dialogue sheet with typewriter effect.
   - Virtual Smartphone: Opens smoothly, displays live map, fast travel teleports player, and quests update state.
4. **Build & Performance:**
   - Run `npm run build` to guarantee Next.js static export succeeds without errors.
   - Verify 60 FPS performance without memory leaks across route changes.
