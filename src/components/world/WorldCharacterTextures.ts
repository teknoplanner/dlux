"use client";

import * as THREE from "three";

// Cache textures to avoid recreating canvas textures on every spawn
const textureCache = new Map<string, THREE.CanvasTexture>();

interface CharacterVisualConfig {
  skinTone: string;
  eyeColor: string;
  hairColor: number;
  outfitColor: string;
  palette: [string, string, string, string, string, string, string, string];
  role: "lexa" | "valen" | "jax" | "leo" | "kai" | "mamat" | "vendor" | "guard" | "default";
}

function getCharacterConfig(id: string): CharacterVisualConfig {
  const lower = id.toLowerCase();

  if (lower.includes("lexa")) {
    return {
      skinTone: "#fed7aa", // Warm golden peach
      eyeColor: "#10b981", // Sparkling emerald green
      hairColor: 0xd97706, // Golden amber / hazel
      outfitColor: "#f59e0b", // Amber adventurer
      palette: [
        "#78350f", // Trim (deep leather)
        "#b45309", // Pants (explorer brown)
        "#451a03", // Boots (dark leather)
        "#fed7aa", // Skin
        "#f59e0b", // Right limbs (amber)
        "#d97706", // Hair
        "#fcd34d", // Gold accents
        "#f59e0b", // Left limbs (amber)
      ],
      role: "lexa",
    };
  }

  if (lower.includes("valen")) {
    return {
      skinTone: "#fef3c7", // Fair ivory
      eyeColor: "#0284c7", // Sapphire royal blue
      hairColor: 0xe2e8f0, // Platinum silver
      outfitColor: "#4f46e5", // Royal indigo
      palette: [
        "#312e81", // Trim (deep navy)
        "#1e1b4b", // Pants (midnight steel)
        "#475569", // Boots (knight iron)
        "#fef3c7", // Skin
        "#6366f1", // Right limbs (indigo)
        "#94a3b8", // Steel hair / helm
        "#fbbf24", // Royal gold
        "#6366f1", // Left limbs (indigo)
      ],
      role: "valen",
    };
  }

  if (lower.includes("jax")) {
    return {
      skinTone: "#fdba74", // Sun-tanned bronze
      eyeColor: "#0f172a", // Dark sunglasses
      hairColor: 0x1e293b, // Dark sea captain
      outfitColor: "#059669", // Emerald nautical
      palette: [
        "#064e3b", // Trim (forest)
        "#0f172a", // Pants (navy pirate)
        "#1e293b", // Boots (black leather)
        "#fdba74", // Skin
        "#10b981", // Right limbs (emerald)
        "#1e293b", // Dark hair
        "#f59e0b", // Gold pirate trim
        "#10b981", // Left limbs (emerald)
      ],
      role: "jax",
    };
  }

  if (lower.includes("leo")) {
    return {
      skinTone: "#fed7aa", // Athletic peach
      eyeColor: "#f59e0b", // Golden amber
      hairColor: 0x92400e, // Auburn brown
      outfitColor: "#ef4444", // Striker coral red
      palette: [
        "#991b1b", // Trim (dark crimson)
        "#ffffff", // Pants (white soccer shorts)
        "#ef4444", // Boots (red cleats)
        "#fed7aa", // Skin
        "#ef4444", // Right limbs (red jersey)
        "#78350f", // Brown hair
        "#facc15", // Number 10 gold
        "#ef4444", // Left limbs (red jersey)
      ],
      role: "leo",
    };
  }

  if (lower.includes("kai")) {
    return {
      skinTone: "#fde68a", // Warm builder beige
      eyeColor: "#0891b2", // Cyan inventor
      hairColor: 0x475569, // Slate black
      outfitColor: "#0284c7", // Work denim blue
      palette: [
        "#0369a1", // Trim
        "#1e293b", // Work jeans
        "#78350f", // Safety boots
        "#fde68a", // Skin
        "#0ea5e9", // Right limbs (sky blue)
        "#334155", // Hair
        "#eab308", // Hardhat yellow
        "#0ea5e9", // Left limbs (sky blue)
      ],
      role: "kai",
    };
  }

  if (lower.includes("mamat") || lower.includes("fisher")) {
    return {
      skinTone: "#fbb040", // Weathered fisherman tan
      eyeColor: "#78350f", // Warm hazel
      hairColor: 0x94a3b8, // Salt & pepper grey
      outfitColor: "#0284c7", // Marine angler blue
      palette: [
        "#0369a1", // Trim
        "#334155", // Angler waders
        "#0f172a", // Rubber boots
        "#fbb040", // Skin
        "#0284c7", // Right limbs (blue vest)
        "#64748b", // Grey hair
        "#f59e0b", // Lure brass
        "#0284c7", // Left limbs (blue vest)
      ],
      role: "mamat",
    };
  }

  if (lower.includes("vendor")) {
    const isFruit = lower.includes("fruit");
    const isPotion = lower.includes("potion");
    const mainColor = isFruit ? "#16a34a" : isPotion ? "#9333ea" : "#0284c7";
    return {
      skinTone: "#fed7aa",
      eyeColor: "#451a03",
      hairColor: 0x78350f,
      outfitColor: mainColor,
      palette: [
        "#1e293b",
        "#334155",
        "#1e293b",
        "#fed7aa",
        mainColor,
        "#78350f",
        "#facc15",
        mainColor,
      ],
      role: "vendor",
    };
  }

  if (lower.includes("guard")) {
    return {
      skinTone: "#e2e8f0", // Iron plate
      eyeColor: "#38bdf8", // Glowing cyan visor
      hairColor: 0x475569,
      outfitColor: "#475569",
      palette: [
        "#0f172a",
        "#1e293b",
        "#334155",
        "#94a3b8",
        "#64748b",
        "#475569",
        "#eab308",
        "#64748b",
      ],
      role: "guard",
    };
  }

  // Default Villager / Resident
  return {
    skinTone: "#fed7aa",
    eyeColor: "#0284c7",
    hairColor: 0x78350f,
    outfitColor: "#3b82f6",
    palette: [
      "#1e293b",
      "#334155",
      "#1e293b",
      "#fed7aa",
      "#3b82f6",
      "#78350f",
      "#fbbf24",
      "#3b82f6",
    ],
    role: "default",
  };
}

/**
 * Creates a vibrant, high-definition 512x512 texture for a character model.
 * - Top half (0..256): 8 Color Palette columns (sleeves, gloves, pants, boots, hair).
 * - Bottom-left (0..256 x 256..512): Full expressively-rendered anime/chibi face!
 * - Bottom-right (256..512 x 256..512): Unique themed chest outfit insignia!
 */
export function getCharacterTexture(id: string): THREE.CanvasTexture {
  const cacheKey = id.toLowerCase().split("_")[0];
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const cfg = getCharacterConfig(id);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    textureCache.set(cacheKey, fallback);
    return fallback;
  }

  // -------------------------------------------------------------------------
  // 1. TOP HALF (Y: 0..256): 8 Color Palette Columns
  // -------------------------------------------------------------------------
  const colWidth = 64;
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = cfg.palette[i] || "#ffffff";
    ctx.fillRect(i * colWidth, 0, colWidth, 256);
  }

  // -------------------------------------------------------------------------
  // 2. BOTTOM-LEFT (X: 0..256, Y: 256..512): Authentic Expressive 3D Face
  // -------------------------------------------------------------------------
  // Base Skin Tone for entire head & jaw area
  ctx.fillStyle = cfg.skinTone;
  ctx.fillRect(0, 256, 256, 256);

  // Subtle gradient shading for 3D depth around chin and cheeks
  const skinGrad = ctx.createRadialGradient(128, 410, 20, 128, 410, 120);
  skinGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
  skinGrad.addColorStop(0.8, "rgba(0, 0, 0, 0.0)");
  skinGrad.addColorStop(1, "rgba(180, 83, 9, 0.12)");
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 256, 256, 256);

  if (cfg.role === "jax") {
    // -----------------------------------------------------------------------
    // CAPTAIN JAX: Aviator Sunglasses, Gold Rims, Glare & Pirate Smirk
    // -----------------------------------------------------------------------
    ctx.save();
    // Sunglasses Frame (Gold)
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 4;

    // Left Aviator Lens
    ctx.beginPath();
    ctx.ellipse(96, 390, 28, 22, 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right Aviator Lens
    ctx.beginPath();
    ctx.ellipse(160, 390, 28, 22, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Gold Bridge & Brow Bar
    ctx.beginPath();
    ctx.moveTo(122, 386);
    ctx.lineTo(134, 386);
    ctx.moveTo(80, 375);
    ctx.lineTo(176, 375);
    ctx.stroke();

    // Lens Reflection Glare (Diagonal High-tech sheen)
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.beginPath();
    ctx.ellipse(88, 384, 8, 14, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(152, 384, 8, 14, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Charismatic Captain's Smirk Mouth
    ctx.strokeStyle = "#7c2d12";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(116, 432);
    ctx.quadraticCurveTo(134, 436, 148, 424);
    ctx.stroke();

    // Stubble / Goatee shadow
    ctx.fillStyle = "rgba(30, 41, 59, 0.18)";
    ctx.beginPath();
    ctx.ellipse(128, 442, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (cfg.role === "guard") {
    // -----------------------------------------------------------------------
    // ROYAL GATE GUARD: Iron Helmet Visor Slit with Glowing Energy Line
    // -----------------------------------------------------------------------
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(40, 380, 176, 24);
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 380, 176, 24);

    // Cyan glowing visor line
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#0284c7";
    ctx.shadowBlur = 10;
    ctx.fillRect(60, 388, 136, 8);
    ctx.shadowBlur = 0;

  } else {
    // -----------------------------------------------------------------------
    // ANIME / CHIBI EXPRESSIVE EYES, BROWS, BLUSH & SMILE
    // -----------------------------------------------------------------------
    const eyeY = 390;
    const leftEyeX = 96;
    const rightEyeX = 160;

    // 1. Soft Blushing Rosy Cheeks
    ctx.fillStyle = "rgba(244, 114, 182, 0.40)";
    ctx.beginPath();
    ctx.ellipse(leftEyeX - 16, eyeY + 22, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rightEyeX + 16, eyeY + 22, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. White Sclera
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, 20, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rightEyeX, eyeY, 20, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Colored Vibrant Iris
    ctx.fillStyle = cfg.eyeColor;
    ctx.beginPath();
    ctx.ellipse(leftEyeX + 2, eyeY, 14, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rightEyeX - 2, eyeY, 14, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Deep Dark Pupils
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.ellipse(leftEyeX + 2, eyeY + 1, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(rightEyeX - 2, eyeY + 1, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Sparkling Dual Anime Catchlights (Shining Eyes)
    ctx.fillStyle = "#ffffff";
    // Primary large sparkle
    ctx.beginPath();
    ctx.arc(leftEyeX - 2, eyeY - 6, 5.5, 0, Math.PI * 2);
    ctx.arc(rightEyeX - 6, eyeY - 6, 5.5, 0, Math.PI * 2);
    ctx.fill();
    // Secondary micro sparkle
    ctx.beginPath();
    ctx.arc(leftEyeX + 6, eyeY + 6, 2.8, 0, Math.PI * 2);
    ctx.arc(rightEyeX + 2, eyeY + 6, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // 6. Eyelashes / Eye Rim Eyeliner
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    // Left eye top lid
    ctx.beginPath();
    ctx.arc(leftEyeX, eyeY - 3, 20, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    // Right eye top lid
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY - 3, 20, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // 7. Expressive Eyebrows
    ctx.strokeStyle = cfg.role === "valen" ? "#475569" : "#451a03";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    if (cfg.role === "leo") {
      // Determined sporty brows
      ctx.moveTo(leftEyeX - 16, eyeY - 26);
      ctx.lineTo(leftEyeX + 16, eyeY - 20);
      ctx.moveTo(rightEyeX - 16, eyeY - 20);
      ctx.lineTo(rightEyeX + 16, eyeY - 26);
    } else {
      // Gentle arched friendly brows
      ctx.moveTo(leftEyeX - 16, eyeY - 20);
      ctx.quadraticCurveTo(leftEyeX, eyeY - 27, leftEyeX + 16, eyeY - 22);
      ctx.moveTo(rightEyeX - 16, eyeY - 22);
      ctx.quadraticCurveTo(rightEyeX, eyeY - 27, rightEyeX + 16, eyeY - 20);
    }
    ctx.stroke();

    // 8. Cheerful Mouth
    ctx.strokeStyle = "#991b1b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (cfg.role === "leo" || cfg.role === "lexa") {
      // Open joyful smile
      ctx.arc(128, 428, 12, 0.15, Math.PI - 0.15);
      ctx.stroke();
    } else {
      // Gentle confident curve
      ctx.arc(128, 429, 10, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }

    // 9. Special Details per NPC
    if (cfg.role === "leo") {
      // Athletic yellow band-aid with white cross on right cheek
      ctx.save();
      ctx.translate(176, 414);
      ctx.rotate(0.25);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-12, -6, 24, 12);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-2, -5, 4, 10);
      ctx.fillRect(-5, -2, 10, 4);
      ctx.restore();
    }

    if (cfg.role === "mamat") {
      // Friendly salt-and-pepper fisherman mustache
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.ellipse(118, 425, 12, 6, -0.2, 0, Math.PI * 2);
      ctx.ellipse(138, 425, 12, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (cfg.role === "kai") {
      // Brass mechanic goggles band across forehead
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(40, 362);
      ctx.lineTo(216, 362);
      ctx.stroke();
    }
  }

  // -------------------------------------------------------------------------
  // 3. BOTTOM-RIGHT (X: 256..512, Y: 256..512): Themed Chest Outfit & Emblems
  // -------------------------------------------------------------------------
  ctx.fillStyle = cfg.outfitColor;
  ctx.fillRect(256, 256, 256, 256);

  // Chest emblem center
  const chestX = 384;
  const chestY = 384;

  ctx.save();
  if (cfg.role === "lexa") {
    // Lexa: Adventurer Compass Star & Golden Lapels
    ctx.fillStyle = "#facc15";
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 3;

    // 8-point compass star
    ctx.beginPath();
    ctx.moveTo(chestX, chestY - 28);
    ctx.lineTo(chestX + 8, chestY - 8);
    ctx.lineTo(chestX + 28, chestY);
    ctx.lineTo(chestX + 8, chestY + 8);
    ctx.lineTo(chestX, chestY + 28);
    ctx.lineTo(chestX - 8, chestY + 8);
    ctx.lineTo(chestX - 28, chestY);
    ctx.lineTo(chestX - 8, chestY - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (cfg.role === "valen") {
    // Valen: Royal Iron Knight Shield & Golden Cross Crest
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 4;

    // Knight Shield outline
    ctx.beginPath();
    ctx.moveTo(chestX - 24, chestY - 24);
    ctx.lineTo(chestX + 24, chestY - 24);
    ctx.lineTo(chestX + 24, chestY + 8);
    ctx.quadraticCurveTo(chestX, chestY + 32, chestX, chestY + 36);
    ctx.quadraticCurveTo(chestX, chestY + 32, chestX - 24, chestY + 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Golden cross inside shield
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(chestX - 4, chestY - 18, 8, 38);
    ctx.fillRect(chestX - 16, chestY - 8, 32, 8);

  } else if (cfg.role === "jax") {
    // Jax: Speedboat Racing Nautical Anchor & Checkered Ring
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(chestX, chestY - 10, 10, 0, Math.PI * 2);
    ctx.moveTo(chestX, chestY);
    ctx.lineTo(chestX, chestY + 24);
    ctx.stroke();

    // Anchor hook
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(chestX, chestY + 12, 18, 0.2, Math.PI - 0.2);
    ctx.stroke();

  } else if (cfg.role === "leo") {
    // Leo: #10 Striker Soccer Jersey with Dual Racing Stripes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(chestX - 35, 256, 12, 256);
    ctx.fillRect(chestX + 23, 256, 12, 256);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("10", chestX, chestY);

  } else if (cfg.role === "kai") {
    // Kai: Master Builder Crossed Hammers & Cogwheel
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(chestX, chestY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(chestX, chestY, 10, 0, Math.PI * 2);
    ctx.fill();

  } else if (cfg.role === "mamat") {
    // Pak Mamat: Fishing Hook & Waves
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(chestX, chestY, 16, 0, Math.PI);
    ctx.moveTo(chestX + 16, chestY);
    ctx.lineTo(chestX + 16, chestY - 18);
    ctx.stroke();

  } else {
    // Generic Resident Pocket & Gold Badge
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(chestX - 22, chestY - 16, 44, 40);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(chestX, chestY - 16, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Create texture and configure properties for Three.js GLTF shaders
  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Attaches tailored 3D headwear, hair, or thematic props to the character's skeletal head bone.
 * Because these are added as children of the `head` bone, they animate synchronously with
 * breathing, walking, and dialogue gestures!
 */
export function attachCharacterAccessories(id: string, model: THREE.Object3D) {
  const headBone = model.getObjectByName("head") as THREE.Bone | undefined;
  if (!headBone) return;

  const lower = id.toLowerCase();

  // ---------------------------------------------------------------------------
  // 1. LEXA: Adventurer Ponytail & Golden Feather Hairband
  // ---------------------------------------------------------------------------
  if (lower.includes("lexa")) {
    const hairGroup = new THREE.Group();
    // Headband
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 });
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 24), bandMat);
    band.position.set(0, 0.65, 0.05);
    band.rotation.x = Math.PI / 2.2;
    hairGroup.add(band);

    // Ponytail trailing down behind the head
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const ponyBase = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), hairMat);
    ponyBase.position.set(0, 0.72, -0.36);
    hairGroup.add(ponyBase);

    const ponytail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 8), hairMat);
    ponytail.position.set(0, 0.50, -0.44);
    ponytail.rotation.x = -0.45;
    hairGroup.add(ponytail);

    // Adventurer Emerald Feather
    const featherMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 });
    const feather = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.28, 5), featherMat);
    feather.position.set(0.30, 0.80, -0.05);
    feather.rotation.z = -0.55;
    feather.rotation.x = -0.2;
    hairGroup.add(feather);

    headBone.add(hairGroup);
    return;
  }

  // ---------------------------------------------------------------------------
  // 2. VALEN: Knight Silver Helm Brow & Royal Feather Plume
  // ---------------------------------------------------------------------------
  if (lower.includes("valen")) {
    const helmGroup = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.85,
      roughness: 0.25,
    });

    // Silver Visor Arch
    const visor = new THREE.Mesh(new THREE.TorusGeometry(0.40, 0.05, 8, 24), steelMat);
    visor.position.set(0, 0.62, 0.08);
    visor.rotation.x = Math.PI / 2.1;
    helmGroup.add(visor);

    // Crest Mount on Top of Helm
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.50), steelMat);
    crest.position.set(0, 0.88, 0.02);
    helmGroup.add(crest);

    // Royal Blue Feather Plume arching back
    const plumeMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3,
      roughness: 0.4,
    });
    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.48, 8), plumeMat);
    plume.position.set(0, 1.05, -0.15);
    plume.rotation.x = -0.75;
    helmGroup.add(plume);

    headBone.add(helmGroup);
    return;
  }

  // ---------------------------------------------------------------------------
  // 3. JAX: Captain's Nautical Tricorn Hat & Golden Anchor Pin
  // ---------------------------------------------------------------------------
  if (lower.includes("jax")) {
    const hatGroup = new THREE.Group();
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.55 });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.25,
    });

    // Wide Upturned Brim
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.50, 0.08, 16), hatMat);
    brim.position.set(0, 0.82, 0.05);
    hatGroup.add(brim);

    // Hat Crown
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.24, 16), hatMat);
    crown.position.set(0, 0.94, 0.05);
    hatGroup.add(crown);

    // Gold Anchor Badge
    const badge = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 16), goldMat);
    badge.position.set(0, 0.96, 0.44);
    hatGroup.add(badge);

    headBone.add(hatGroup);
    return;
  }

  // ---------------------------------------------------------------------------
  // 4. LEO: Red Athletic Sweatband & Spiky Anime Hair Tufts
  // ---------------------------------------------------------------------------
  if (lower.includes("leo")) {
    const sportsGroup = new THREE.Group();
    // Red Sweatband
    const bandMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 });
    const headband = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 8, 24), bandMat);
    headband.position.set(0, 0.65, 0.05);
    headband.rotation.x = Math.PI / 2.15;
    sportsGroup.add(headband);

    // Messy Spiky Hair Tufts on Top
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 });
    const hairSpikes = [
      { x: 0, y: 0.92, z: 0.12, s: 0.16, rx: 0.2 },
      { x: -0.16, y: 0.88, z: 0.04, s: 0.14, rz: 0.3 },
      { x: 0.16, y: 0.88, z: 0.04, s: 0.14, rz: -0.3 },
      { x: 0, y: 0.88, z: -0.18, s: 0.15, rx: -0.3 },
    ];
    hairSpikes.forEach((sp) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(sp.s, 0.28, 6), hairMat);
      spike.position.set(sp.x, sp.y, sp.z);
      if (sp.rx) spike.rotation.x = sp.rx;
      if (sp.rz) spike.rotation.z = sp.rz;
      sportsGroup.add(spike);
    });

    headBone.add(sportsGroup);
    return;
  }

  // ---------------------------------------------------------------------------
  // 5. KAI: Master Builder Yellow Safety Hardhat & Front Lamp
  // ---------------------------------------------------------------------------
  if (lower.includes("kai")) {
    const hardhatGroup = new THREE.Group();
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.1,
    });

    // Dome
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), helmetMat);
    dome.position.set(0, 0.76, 0.02);
    hardhatGroup.add(dome);

    // Front Brim
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 16), helmetMat);
    brim.position.set(0, 0.74, 0.08);
    hardhatGroup.add(brim);

    // Headlamp
    const lampMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
    });
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12), lampMat);
    lamp.position.set(0, 0.88, 0.43);
    lamp.rotation.x = Math.PI / 2;
    hardhatGroup.add(lamp);

    headBone.add(hardhatGroup);
    return;
  }

  // ---------------------------------------------------------------------------
  // 6. PAK MAMAT: Traditional Conical Bamboo Fishing Hat (Caping Nelayan)
  // ---------------------------------------------------------------------------
  if (lower.includes("mamat") || lower.includes("fisher")) {
    const bambooMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.85,
    });
    const caping = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.28, 18, 1, true), bambooMat);
    caping.position.set(0, 0.85, 0.05);
    caping.rotation.x = 0.15; // Slightly tilted jaunty angle
    headBone.add(caping);
    return;
  }

  // ---------------------------------------------------------------------------
  // 7. VENDORS & RESIDENTS: Colorful Merchant Head Bandana
  // ---------------------------------------------------------------------------
  if (lower.includes("vendor")) {
    const isFruit = lower.includes("fruit");
    const isPotion = lower.includes("potion");
    const bandanaColor = isFruit ? 0x16a34a : isPotion ? 0x9333ea : 0x0284c7;

    const bandanaMat = new THREE.MeshStandardMaterial({ color: bandanaColor, roughness: 0.7 });
    const bandana = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 8, 24), bandanaMat);
    bandana.position.set(0, 0.65, 0.05);
    bandana.rotation.x = Math.PI / 2.2;

    // Knot at the back
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), bandanaMat);
    knot.position.set(0, 0.65, -0.35);
    bandana.add(knot);

    headBone.add(bandana);
    return;
  }
}
