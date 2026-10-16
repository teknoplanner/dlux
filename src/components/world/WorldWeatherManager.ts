"use client";

import * as THREE from "three";
import { WorldAudio } from "./WorldAudio";

export type WeatherType = "day" | "night" | "rain" | "snow";

export interface RealtimeWeatherInfo {
  weather: WeatherType;
  hour: number;
  minute: number;
  timeString: string;
  timeZone: string;
  isDaytime: boolean;
}

/**
 * Detects real-life local time from player's device/browser (matching IP geolocation).
 * 06:00 - 17:59 -> Day (☀️)
 * 18:00 - 05:59 -> Night (🌙)
 */
export function getPlayerRealtimeWeather(): RealtimeWeatherInfo {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const isDaytime = hour >= 6 && hour < 18;
  const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  let timeZone = "WIB";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      timeZone = tz.replace(/_/g, " ");
    }
  } catch {}
  return {
    weather: isDaytime ? "day" : "night",
    hour,
    minute,
    timeString,
    timeZone,
    isDaytime,
  };
}

export interface WeatherSettings {
  sunColor: number;
  sunIntensity: number;
  sunPosition: THREE.Vector3;
  ambientColor: number;
  ambientIntensity: number;
  fogColor: number;
  fogNear: number;
  fogFar: number;
  bgColor: number;
}

const WEATHER_PRESETS: Record<WeatherType, WeatherSettings> = {
  day: {
    sunColor: 0xfff7ed, // Soft warm sunlight
    sunIntensity: 1.30, // Perfectly balanced - NOT washed out or glaring!
    sunPosition: new THREE.Vector3(70, 110, 50),
    ambientColor: 0xfffbeb,
    ambientIntensity: 0.70,
    fogColor: 0x7dd3fc,
    fogNear: 240,
    fogFar: 500,
    bgColor: 0x38bdf8,
  },
  night: {
    sunColor: 0xc7d2fe, // Luminous cool moonlight
    sunIntensity: 1.55, // Bright and crisp so the island is well lit
    sunPosition: new THREE.Vector3(-80, 115, -75),
    ambientColor: 0x312e81, // Vibrant royal indigo ambient so everything is clearly visible
    ambientIntensity: 1.15, // Bright ambient so the game is not too dark
    fogColor: 0x081329,
    fogNear: 180,
    fogFar: 380,
    bgColor: 0x060c18,
  },
  rain: {
    sunColor: 0x94a3b8, // Overcast stormy light
    sunIntensity: 0.85,
    sunPosition: new THREE.Vector3(40, 90, 40),
    ambientColor: 0x475569, // Slate gray ambient
    ambientIntensity: 0.70,
    fogColor: 0x64748b, // Moody rain mist
    fogNear: 100,
    fogFar: 260,
    bgColor: 0x475569,
  },
  snow: {
    sunColor: 0xf1f5f9, // Pale winter sun
    sunIntensity: 1.15,
    sunPosition: new THREE.Vector3(50, 100, 50),
    ambientColor: 0xbae6fd, // Crisp frosty ice-blue
    ambientIntensity: 0.82,
    fogColor: 0xdbeafe, // Soft snowy mist
    fogNear: 120,
    fogFar: 280,
    bgColor: 0xbfdbfe,
  },
};

const WEATHER_SKY_PRESETS: Record<WeatherType, { top: number; bottom: number }> = {
  day: { top: 0x0284c7, bottom: 0x7dd3fc },    // Rich tropical azure to soft cyan - NO gray, NO glare!
  night: { top: 0x020617, bottom: 0x0a1128 },  // Deep velvet midnight
  rain: { top: 0x1e293b, bottom: 0x475569 },   // Moody overcast storm
  snow: { top: 0x64748b, bottom: 0xbfdbfe },   // Frosty winter twilight
};

const WEATHER_HEMI_PRESETS: Record<WeatherType, { sky: number; ground: number; intensity: number }> = {
  day: { sky: 0x7dd3fc, ground: 0x15803d, intensity: 0.50 },
  night: { sky: 0x312e81, ground: 0x111827, intensity: 0.38 },
  rain: { sky: 0x64748b, ground: 0x1e293b, intensity: 0.35 },
  snow: { sky: 0xdbeafe, ground: 0x94a3b8, intensity: 0.55 },
};

const WEATHER_WATER_PRESETS: Record<WeatherType, { deep: number; shallow: number; crest: number; foam: number }> = {
  day: { deep: 0x0c4a9e, shallow: 0x1d72db, crest: 0x38bdf8, foam: 0xffffff },
  night: { deep: 0x051b38, shallow: 0x0c3a6b, crest: 0x2563eb, foam: 0xdbeafe },
  rain: { deep: 0x1e293b, shallow: 0x334155, crest: 0x64748b, foam: 0x94a3b8 },
  snow: { deep: 0x162c46, shallow: 0x2563eb, crest: 0x93c5fd, foam: 0xffffff },
};

// =========================================================================
// PROCEDURAL TEXTURE GENERATORS (Eliminates ugly square point boxes!)
// =========================================================================

/** Slender tapered rain streak texture for natural, non-square rain */
function createRainStreakTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(8, 0, 8, 64);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.0)");
  grad.addColorStop(0.3, "rgba(224, 242, 254, 0.55)");
  grad.addColorStop(0.85, "rgba(186, 230, 253, 0.95)");
  grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(8, 32, 3, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/** Soft feathered circular snowflake texture for tiny delicate flakes (butiran halus) */
function createSnowflakeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
  grad.addColorStop(0.4, "rgba(240, 248, 255, 0.85)");
  grad.addColorStop(0.75, "rgba(224, 242, 254, 0.25)");
  grad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/** Circular twinkling star texture */
function createRoundStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
  grad.addColorStop(0.25, "rgba(240, 249, 255, 0.9)");
  grad.addColorStop(0.6, "rgba(186, 230, 253, 0.3)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

/** 4-pointed diamond starburst texture for major hero stars */
function createSparkleStarTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  
  // Center glow
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
  grad.addColorStop(0.18, "rgba(224, 242, 254, 0.85)");
  grad.addColorStop(0.5, "rgba(147, 197, 253, 0.25)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  // 4-pointed diamond star
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.beginPath();
  ctx.moveTo(32, 2);
  ctx.lineTo(34, 30);
  ctx.lineTo(62, 32);
  ctx.lineTo(34, 34);
  ctx.lineTo(32, 62);
  ctx.lineTo(30, 34);
  ctx.lineTo(2, 32);
  ctx.lineTo(30, 30);
  ctx.closePath();
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

/** Procedural glowing moon texture with crater details */
function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // Glowing pearlescent ivory base
  const grad = ctx.createRadialGradient(100, 100, 10, 128, 128, 128);
  grad.addColorStop(0, "#fffef0");
  grad.addColorStop(0.5, "#fef9c3");
  grad.addColorStop(0.85, "#fef08a");
  grad.addColorStop(1.0, "#fde047");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Soft lunar maria / craters
  ctx.fillStyle = "rgba(217, 119, 6, 0.16)";
  const craters: [number, number, number][] = [
    [75, 85, 28],
    [155, 75, 36],
    [115, 145, 42],
    [180, 155, 24],
    [85, 190, 30],
    [145, 200, 20],
    [200, 100, 16],
  ];
  craters.forEach(([cx, cy, r]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}

export class WorldWeatherManager {
  private scene: THREE.Scene;
  private dirLight: THREE.DirectionalLight;
  private ambLight: THREE.AmbientLight;
  private hemiLight: THREE.HemisphereLight | null = null;

  public currentWeather: WeatherType = "day";
  public isAutoRealtime: boolean = true;
  private realtimeCheckTimer: number = 0;
  private targetSettings: WeatherSettings;
  private waterUniforms: Record<string, { value: any }> | null = null;
  private skyDome: THREE.Mesh | null = null;
  private cloudMatRef: THREE.MeshStandardMaterial | null = null;

  // Island Street Lamps & Milo Night Illumination
  private lampPosts: Array<{ group: THREE.Group; light: THREE.PointLight; glassMesh: THREE.Mesh }> = [];
  private customLamps: Array<{
    light: THREE.PointLight;
    glassMesh?: THREE.Mesh | THREE.Mesh[];
    nightIntensity: number;
    rainIntensity: number;
  }> = [];
  private miloNightLight: THREE.PointLight | null = null;

  // Night Sky Elements (1800 Twinkling Radiant Stars, 80 Hero Sparkle Stars & Glowing Moon)
  private starPoints: THREE.Points | null = null;
  private sparklePoints: THREE.Points | null = null;
  private moonMesh: THREE.Group | null = null;
  private moonLight: THREE.PointLight | null = null;

  // Rain Particles & Ground Splash Ripples
  private rainCount = 2200;
  private rainGeometry: THREE.BufferGeometry | null = null;
  private rainPoints: THREE.Points | null = null;
  private rainSplashes: THREE.Mesh[] = [];

  // Snow Particles
  private snowCount = 1400;
  private snowGeometry: THREE.BufferGeometry | null = null;
  private snowPoints: THREE.Points | null = null;

  // Color interpolators
  private currentSunColor: THREE.Color;
  private currentAmbColor: THREE.Color;
  private currentFogColor: THREE.Color;

  private audio: WorldAudio | null = null;
  private onWeatherChange?: (w: WeatherType) => void;

  constructor(
    scene: THREE.Scene,
    dirLight: THREE.DirectionalLight,
    ambLight: THREE.AmbientLight,
    hemiLight?: THREE.HemisphereLight | null,
    audio?: WorldAudio | null,
    onWeatherChange?: (w: WeatherType) => void
  ) {
    this.scene = scene;
    this.dirLight = dirLight;
    this.ambLight = ambLight;
    this.hemiLight = hemiLight || null;
    this.audio = audio || null;
    this.onWeatherChange = onWeatherChange;

    // Detect player's real-life local time
    const rt = getPlayerRealtimeWeather();
    const initialWeather: WeatherType = rt.weather;
    this.currentWeather = initialWeather;
    this.targetSettings = { ...WEATHER_PRESETS[initialWeather] };
    this.isAutoRealtime = true;

    this.currentSunColor = new THREE.Color(this.targetSettings.sunColor);
    this.currentAmbColor = new THREE.Color(this.targetSettings.ambientColor);
    this.currentFogColor = new THREE.Color(this.targetSettings.fogColor);

    // Apply initial lighting immediately
    this.dirLight.color.copy(this.currentSunColor);
    this.dirLight.intensity = this.targetSettings.sunIntensity;
    this.dirLight.position.copy(this.targetSettings.sunPosition);

    this.ambLight.color.copy(this.currentAmbColor);
    this.ambLight.intensity = this.targetSettings.ambientIntensity;

    if (this.hemiLight) {
      const hSetting = WEATHER_HEMI_PRESETS[initialWeather];
      this.hemiLight.color.setHex(hSetting.sky);
      this.hemiLight.groundColor.setHex(hSetting.ground);
      this.hemiLight.intensity = hSetting.intensity;
    }

    if (this.scene.fog && this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.copy(this.currentFogColor);
      this.scene.fog.near = this.targetSettings.fogNear;
      this.scene.fog.far = this.targetSettings.fogFar;
    }
    this.scene.background = new THREE.Color(this.targetSettings.bgColor);

    // Build sub-systems
    this.initNightSky();
    this.initIslandLamps();
    this.initRainSystem();
    this.initSnowSystem();

    // Notify initial weather
    this.onWeatherChange?.(initialWeather);
  }

  public setWaterUniforms(uniforms: Record<string, { value: any }> | null) {
    this.waterUniforms = uniforms;
    if (this.waterUniforms) {
      const palette = WEATHER_WATER_PRESETS[this.currentWeather];
      const deepKey = this.waterUniforms["uDeepColor"] ? "uDeepColor" : "colorDeep";
      const shallowKey = this.waterUniforms["uShallowColor"] ? "uShallowColor" : "colorShallow";
      const crestKey = this.waterUniforms["uCrestColor"] ? "uCrestColor" : "colorWaveCrest";
      const foamKey = this.waterUniforms["uFoamColor"] ? "uFoamColor" : "colorFoam";

      if (this.waterUniforms[deepKey]?.value?.setHex) this.waterUniforms[deepKey].value.setHex(palette.deep);
      if (this.waterUniforms[shallowKey]?.value?.setHex) this.waterUniforms[shallowKey].value.setHex(palette.shallow);
      if (this.waterUniforms[crestKey]?.value?.setHex) this.waterUniforms[crestKey].value.setHex(palette.crest);
      if (this.waterUniforms[foamKey]?.value?.setHex) this.waterUniforms[foamKey].value.setHex(palette.foam);
    }
  }

  public setSkyDome(mesh: THREE.Mesh | null) {
    this.skyDome = mesh;
    if (this.skyDome && this.skyDome.material instanceof THREE.ShaderMaterial) {
      const skySetting = WEATHER_SKY_PRESETS[this.currentWeather];
      const uTop = this.skyDome.material.uniforms?.["topColor"]?.value as THREE.Color | undefined;
      const uBot = this.skyDome.material.uniforms?.["bottomColor"]?.value as THREE.Color | undefined;
      if (uTop?.setHex) uTop.setHex(skySetting.top);
      if (uBot?.setHex) uBot.setHex(skySetting.bottom);
    }
  }

  public setCloudMaterial(cloudMat: THREE.MeshStandardMaterial | null) {
    this.cloudMatRef = cloudMat;
    if (this.cloudMatRef) {
      if (this.currentWeather === "night") {
        this.cloudMatRef.color.setHex(0x2a3656);
        this.cloudMatRef.opacity = 0.50;
      } else if (this.currentWeather === "rain") {
        this.cloudMatRef.color.setHex(0x475569);
        this.cloudMatRef.opacity = 0.95;
      } else if (this.currentWeather === "snow") {
        this.cloudMatRef.color.setHex(0xcfd8dc);
        this.cloudMatRef.opacity = 0.95;
      } else {
        this.cloudMatRef.color.setHex(0xffffff);
        this.cloudMatRef.opacity = 0.9;
      }
    }
  }

  // Backward compatibility alias
  public setSkyAndClouds(sky: THREE.Object3D | null, cloudMat: THREE.MeshStandardMaterial | null) {
    if (sky && (sky as any).isMesh) {
      this.setSkyDome(sky as THREE.Mesh);
    }
    this.setCloudMaterial(cloudMat);
  }

  // =========================================================================
  // 1. NIGHT SKY (1800 Round Stars, 80 Hero Sparkle Stars & Glowing Moon)
  // =========================================================================
  private initNightSky() {
    const isNight = this.currentWeather === "night";

    // 1A. Distant Twinkling Starfield (Round fine sparkling dots)
    const starCount = 1800;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 220 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI / 2.1); // upper sky dome

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) + 10;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const rType = Math.random();
      if (rType < 0.6) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      } else if (rType < 0.82) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.94; colors[i * 3 + 2] = 0.72;
      } else {
        colors[i * 3] = 0.75; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0;
      }
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starTex = createRoundStarTexture();
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      sizeAttenuation: false, // Ensures perfectly crisp, distinct circular stars
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: isNight ? 0.98 : 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starPoints);

    // 1B. Major Hero 4-Pointed Sparkle Stars
    const sparkleCount = 80;
    const sPositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const radius = 210 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * (Math.PI / 2.3);

      sPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      sPositions[i * 3 + 1] = radius * Math.cos(phi) + 14;
      sPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const sparkleGeo = new THREE.BufferGeometry();
    sparkleGeo.setAttribute("position", new THREE.BufferAttribute(sPositions, 3));

    const sparkleTex = createSparkleStarTexture();
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 28.0,
      sizeAttenuation: true,
      map: sparkleTex,
      transparent: true,
      opacity: isNight ? 0.98 : 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
    this.scene.add(this.sparklePoints);

    // 1C. Glowing Prominent 3D Moon
    this.moonMesh = new THREE.Group();
    const moonGeo = new THREE.SphereGeometry(22, 32, 32);
    const moonTex = createMoonTexture();
    const moonMat = new THREE.MeshBasicMaterial({
      map: moonTex,
      color: 0xffffff,
      transparent: true,
      opacity: isNight ? 0.98 : 0.0,
    });
    const moonBody = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.add(moonBody);

    // Inner Warm Golden Aura Halo
    const haloGeo = new THREE.RingGeometry(22.5, 46, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: isNight ? 0.70 : 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = -0.2;
    this.moonMesh.add(halo);

    // Outer Celestial Cyan Corona
    const coronaGeo = new THREE.RingGeometry(38, 85, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: isNight ? 0.45 : 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    corona.position.z = -0.4;
    this.moonMesh.add(corona);

    this.moonMesh.position.set(-80, 115, -75);
    this.moonMesh.lookAt(0, 0, 0);
    this.scene.add(this.moonMesh);

    // Dedicated Moonlight Point Light casting cool radiance
    this.moonLight = new THREE.PointLight(0xdbeafe, isNight ? 3.8 : 0.0, 420, 1.1);
    this.moonLight.position.set(-80, 115, -75);
    this.scene.add(this.moonLight);
  }

  // =========================================================================
  // 1.5 MILO NIGHT ILLUMINATION
  // =========================================================================
  private initIslandLamps() {
    const isNight = this.currentWeather === "night";
    // Milo's Night Lantern / Chest Light
    this.miloNightLight = new THREE.PointLight(0xffd670, isNight ? 2.8 : 0.0, 20, 1.8);
    this.scene.add(this.miloNightLight);
  }

  // =========================================================================
  // 2. RAIN SYSTEM (Slender Falling Streaks & Surface Splash Ripples)
  // =========================================================================
  private initRainSystem() {
    const positions = new Float32Array(this.rainCount * 3);
    const velocities = new Float32Array(this.rainCount);

    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = Math.random() * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      velocities[i] = 34 + Math.random() * 18; // Fast realistic fall speed
    }

    this.rainGeometry = new THREE.BufferGeometry();
    this.rainGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.rainGeometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 1));

    // Slender rain streak texture prevents square boxes!
    const rainTex = createRainStreakTexture();
    const rainMat = new THREE.PointsMaterial({
      color: 0xc7d2fe,
      size: 0.75, // Slender and delicate!
      map: rainTex,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.rainPoints = new THREE.Points(this.rainGeometry, rainMat);
    this.scene.add(this.rainPoints);

    // 16 Animated Expanding Rain Splash Ripples on ground / sea
    const splashMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (let i = 0; i < 16; i++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.45, 12), splashMat.clone());
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(
        (Math.random() - 0.5) * 40,
        0.05,
        (Math.random() - 0.5) * 40
      );
      this.rainSplashes.push(ring);
      this.scene.add(ring);
    }
  }

  // =========================================================================
  // 3. SNOW SYSTEM (Delicate Tiny Drifting Snowflakes - Butiran Halus)
  // =========================================================================
  private initSnowSystem() {
    const positions = new Float32Array(this.snowCount * 3);
    const seeds = new Float32Array(this.snowCount * 2);

    for (let i = 0; i < this.snowCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 130;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 130;
      seeds[i * 2] = Math.random() * Math.PI * 2; // phase
      seeds[i * 2 + 1] = 4.0 + Math.random() * 3.5; // gentle fall rate
    }

    this.snowGeometry = new THREE.BufferGeometry();
    this.snowGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.snowGeometry.setAttribute("seeds", new THREE.BufferAttribute(seeds, 2));

    // Feathered circular snowflake texture prevents square boxes!
    const snowTex = createSnowflakeTexture();
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.65, // Small, delicate round snowflakes!
      map: snowTex,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.snowPoints = new THREE.Points(this.snowGeometry, snowMat);
    this.scene.add(this.snowPoints);
  }

  // =========================================================================
  // WEATHER SWITCHING & CONTROLS
  // =========================================================================
  public setWeather(type: WeatherType, manual: boolean = true) {
    if (manual) {
      this.isAutoRealtime = false;
    }
    this.currentWeather = type;
    this.targetSettings = { ...WEATHER_PRESETS[type] };

    // Update ocean water palette
    if (this.waterUniforms) {
      const palette = WEATHER_WATER_PRESETS[type];
      const deepKey = this.waterUniforms["uDeepColor"] ? "uDeepColor" : "colorDeep";
      const shallowKey = this.waterUniforms["uShallowColor"] ? "uShallowColor" : "colorShallow";
      const crestKey = this.waterUniforms["uCrestColor"] ? "uCrestColor" : "colorWaveCrest";
      const foamKey = this.waterUniforms["uFoamColor"] ? "uFoamColor" : "colorFoam";

      if (this.waterUniforms[deepKey]?.value?.setHex) this.waterUniforms[deepKey].value.setHex(palette.deep);
      if (this.waterUniforms[shallowKey]?.value?.setHex) this.waterUniforms[shallowKey].value.setHex(palette.shallow);
      if (this.waterUniforms[crestKey]?.value?.setHex) this.waterUniforms[crestKey].value.setHex(palette.crest);
      if (this.waterUniforms[foamKey]?.value?.setHex) this.waterUniforms[foamKey].value.setHex(palette.foam);
    }

    // Update cloud material immediately
    if (this.cloudMatRef) {
      if (type === "night") {
        this.cloudMatRef.color.setHex(0x2a3656);
        this.cloudMatRef.opacity = 0.50;
      } else if (type === "rain") {
        this.cloudMatRef.color.setHex(0x475569);
        this.cloudMatRef.opacity = 0.95;
      } else if (type === "snow") {
        this.cloudMatRef.color.setHex(0xcfd8dc);
        this.cloudMatRef.opacity = 0.95;
      } else {
        this.cloudMatRef.color.setHex(0xffffff);
        this.cloudMatRef.opacity = 0.90;
      }
    }

    this.audio?.playChime();
    this.onWeatherChange?.(type);

    // Update custom registered lamps immediately
    const isNightNow = type === "night";
    this.customLamps.forEach((lamp) => {
      const targetI = isNightNow ? lamp.nightIntensity : (type === "rain" ? lamp.rainIntensity : 0.0);
      lamp.light.intensity = targetI;
    });
  }

  public registerLamp(
    light: THREE.PointLight,
    glassMesh?: THREE.Mesh | THREE.Mesh[],
    nightIntensity: number = 3.4,
    rainIntensity: number = 1.0
  ) {
    const isNight = this.currentWeather === "night";
    light.intensity = isNight ? nightIntensity : (this.currentWeather === "rain" ? rainIntensity : 0.0);
    this.customLamps.push({ light, glassMesh, nightIntensity, rainIntensity });
  }

  public unregisterLamp(light: THREE.PointLight) {
    this.customLamps = this.customLamps.filter((l) => l.light !== light);
  }

  public setAutoRealtime(enable: boolean) {
    this.isAutoRealtime = enable;
    if (enable) {
      const rt = getPlayerRealtimeWeather();
      this.setWeather(rt.weather, false);
    }
  }

  public cycleNextWeather(): WeatherType {
    const list: WeatherType[] = ["day", "night", "rain", "snow"];
    const idx = list.indexOf(this.currentWeather);
    const next = list[(idx + 1) % list.length];
    this.setWeather(next, true);
    return next;
  }

  // =========================================================================
  // FRAME UPDATE LOOP
  // =========================================================================
  public update(delta: number, time: number, playerPos: THREE.Vector3) {
    // 0. Periodic Auto Real-time Day/Night boundary check (every 15s)
    if (this.isAutoRealtime) {
      this.realtimeCheckTimer += delta;
      if (this.realtimeCheckTimer > 15.0) {
        this.realtimeCheckTimer = 0;
        const rt = getPlayerRealtimeWeather();
        if (this.currentWeather !== rt.weather && (rt.weather === "day" || rt.weather === "night")) {
          this.setWeather(rt.weather, false);
        }
      }
    }

    // 1. Smoothly interpolate lighting & fog
    const lerpSpeed = Math.min(1.0, delta * 2.2);

    const targetSunCol = new THREE.Color(this.targetSettings.sunColor);
    const targetAmbCol = new THREE.Color(this.targetSettings.ambientColor);
    const targetFogCol = new THREE.Color(this.targetSettings.fogColor);

    this.currentSunColor.lerp(targetSunCol, lerpSpeed);
    this.currentAmbColor.lerp(targetAmbCol, lerpSpeed);
    this.currentFogColor.lerp(targetFogCol, lerpSpeed);

    this.dirLight.color.copy(this.currentSunColor);
    this.dirLight.intensity = THREE.MathUtils.lerp(this.dirLight.intensity, this.targetSettings.sunIntensity, lerpSpeed);
    this.dirLight.position.lerp(this.targetSettings.sunPosition, lerpSpeed);

    this.ambLight.color.copy(this.currentAmbColor);
    this.ambLight.intensity = THREE.MathUtils.lerp(this.ambLight.intensity, this.targetSettings.ambientIntensity, lerpSpeed);

    // Update Hemisphere Light
    if (this.hemiLight) {
      const targetHemi = WEATHER_HEMI_PRESETS[this.currentWeather];
      this.hemiLight.color.lerp(new THREE.Color(targetHemi.sky), lerpSpeed);
      this.hemiLight.groundColor.lerp(new THREE.Color(targetHemi.ground), lerpSpeed);
      this.hemiLight.intensity = THREE.MathUtils.lerp(this.hemiLight.intensity, targetHemi.intensity, lerpSpeed);
    }

    // Update Stylized Sky Dome colors smoothly
    if (this.skyDome && this.skyDome.material instanceof THREE.ShaderMaterial) {
      const targetSky = WEATHER_SKY_PRESETS[this.currentWeather];
      const uTop = this.skyDome.material.uniforms?.["topColor"]?.value as THREE.Color | undefined;
      const uBot = this.skyDome.material.uniforms?.["bottomColor"]?.value as THREE.Color | undefined;
      if (uTop?.lerp) uTop.lerp(new THREE.Color(targetSky.top), lerpSpeed);
      if (uBot?.lerp) uBot.lerp(new THREE.Color(targetSky.bottom), lerpSpeed);
    }

    if (this.scene.fog && this.scene.fog instanceof THREE.Fog) {
      this.scene.fog.color.copy(this.currentFogColor);
      this.scene.fog.near = THREE.MathUtils.lerp(this.scene.fog.near, this.targetSettings.fogNear, lerpSpeed);
      this.scene.fog.far = THREE.MathUtils.lerp(this.scene.fog.far, this.targetSettings.fogFar, lerpSpeed);
    }
    if (this.scene.background && this.scene.background instanceof THREE.Color) {
      this.scene.background.copy(this.currentFogColor);
    }

    const isNight = this.currentWeather === "night";

    // =========================================================================
    // 1.8 LIGHT CULLING OPTIMIZATION
    // Only compute dynamic surface lighting for the 6 closest PointLights to Milo.
    // All glowing glass and bulbs remain visible with bloom across the island!
    // =========================================================================
    const needsLighting = isNight || this.currentWeather === "rain";
    const targetLampGlassOpacity = isNight ? 0.95 : (this.currentWeather === "rain" ? 0.35 : 0.0);
    const targetLampIntensity = isNight ? 3.4 : (this.currentWeather === "rain" ? 1.0 : 0.0);

    if (!needsLighting) {
      // In daytime, turn off all point lights to save GPU fragment overhead
      for (let i = 0; i < this.lampPosts.length; i++) {
        this.lampPosts[i].light.visible = false;
        (this.lampPosts[i].glassMesh.material as THREE.MeshBasicMaterial).opacity = 0.0;
      }
      for (let i = 0; i < this.customLamps.length; i++) {
        this.customLamps[i].light.visible = false;
        if (this.customLamps[i].glassMesh) {
          const meshes = Array.isArray(this.customLamps[i].glassMesh)
            ? (this.customLamps[i].glassMesh as THREE.Mesh[])
            : [this.customLamps[i].glassMesh as THREE.Mesh];
          meshes.forEach((m) => {
            if (m?.material && "opacity" in m.material) (m.material as any).opacity = 0.0;
          });
        }
      }
    } else {
      const candidates: Array<{ light: THREE.PointLight; distSq: number }> = [];

      this.lampPosts.forEach((lamp, idx) => {
        const mat = lamp.glassMesh.material as THREE.MeshBasicMaterial;
        mat.opacity = targetLampGlassOpacity;

        const lx = lamp.group.position.x;
        const lz = lamp.group.position.z;
        const distSq = (lx - playerPos.x) * (lx - playerPos.x) + (lz - playerPos.z) * (lz - playerPos.z);
        candidates.push({ light: lamp.light, distSq });

        lamp.light.intensity = targetLampIntensity + (isNight ? Math.sin(time * 5.0 + idx * 1.5) * 0.06 : 0.0);
      });

      this.customLamps.forEach((lamp, idx) => {
        if (lamp.glassMesh) {
          const meshes = Array.isArray(lamp.glassMesh) ? lamp.glassMesh : [lamp.glassMesh];
          meshes.forEach((m) => {
            if (m?.material && "opacity" in m.material) (m.material as any).opacity = targetLampGlassOpacity;
          });
        }

        const targetI = isNight ? lamp.nightIntensity : lamp.rainIntensity;
        lamp.light.intensity = targetI + (isNight ? Math.sin(time * 4.2 + idx * 1.3) * 0.05 : 0.0);

        let lx = lamp.light.position.x;
        let lz = lamp.light.position.z;
        if (lamp.light.parent) {
          lx += lamp.light.parent.position.x;
          lz += lamp.light.parent.position.z;
        }
        const distSq = (lx - playerPos.x) * (lx - playerPos.x) + (lz - playerPos.z) * (lz - playerPos.z);
        candidates.push({ light: lamp.light, distSq });
      });

      // Sort by proximity and enable only the 6 closest PointLights within 36m
      candidates.sort((a, b) => a.distSq - b.distSq);
      const MAX_ACTIVE_LIGHTS = 6;
      const MAX_DIST_SQ = 36 * 36;
      for (let i = 0; i < candidates.length; i++) {
        candidates[i].light.visible = i < MAX_ACTIVE_LIGHTS && candidates[i].distSq < MAX_DIST_SQ;
      }
    }

    if (this.miloNightLight) {
      this.miloNightLight.visible = isNight || this.currentWeather === "rain";
      if (this.miloNightLight.visible) {
        const targetMiloLight = isNight ? 2.8 : 0.9;
        this.miloNightLight.intensity = THREE.MathUtils.lerp(this.miloNightLight.intensity, targetMiloLight, lerpSpeed * 2);
        this.miloNightLight.position.set(playerPos.x, playerPos.y + 1.4, playerPos.z + 0.3);
      }
    }

    // 2. Stars & Moon Opacity Transition (Night mode)
    const targetNightAlpha = isNight ? 0.98 : 0.0;
    if (this.starPoints) {
      const mat = this.starPoints.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetNightAlpha, lerpSpeed * 1.5);
      this.starPoints.visible = mat.opacity > 0.02;
      if (this.starPoints.visible) {
        this.starPoints.position.set(playerPos.x * 0.05, 0, playerPos.z * 0.05);
        this.starPoints.rotation.y = time * 0.005;
      }
    }

    if (this.sparklePoints) {
      const mat = this.sparklePoints.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetNightAlpha, lerpSpeed * 1.5);
      this.sparklePoints.visible = mat.opacity > 0.02;
      if (this.sparklePoints.visible) {
        this.sparklePoints.rotation.y = -time * 0.003;
      }
    }

    if (this.moonMesh) {
      this.moonMesh.visible = isNight || targetNightAlpha > 0.02;
      if (this.moonMesh.visible) {
        this.moonMesh.children.forEach((child) => {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetNightAlpha, lerpSpeed * 1.5);
        });
      }
    }

    if (this.moonLight) {
      this.moonLight.visible = isNight;
      if (isNight) {
        this.moonLight.intensity = THREE.MathUtils.lerp(this.moonLight.intensity, 3.8, lerpSpeed * 1.5);
      }
    }

    // 3. Rain Particles & Splashes
    const targetRainAlpha = this.currentWeather === "rain" ? 0.88 : 0.0;
    if (this.rainPoints && this.rainGeometry) {
      const mat = this.rainPoints.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetRainAlpha, lerpSpeed * 2);
      this.rainPoints.visible = mat.opacity > 0.02;

      if (this.rainPoints.visible) {
        const posAttr = this.rainGeometry.attributes.position;
        const velAttr = this.rainGeometry.attributes.velocity;

        for (let i = 0; i < this.rainCount; i++) {
          let y = posAttr.getY(i) - velAttr.getX(i) * delta;
          let x = posAttr.getX(i);
          let z = posAttr.getZ(i);

          // Slanted wind drift
          x += delta * 4.5;

          if (y < 0.2) {
            y = 35 + Math.random() * 10;
            x = playerPos.x + (Math.random() - 0.5) * 110;
            z = playerPos.z + (Math.random() - 0.5) * 110;
          }
          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
      }
    }

    // Rain Splashes animation
    if (this.rainSplashes.length > 0) {
      const splashAlpha = this.currentWeather === "rain" ? 0.6 : 0.0;
      this.rainSplashes.forEach((ring, idx) => {
        const rMat = ring.material as THREE.MeshBasicMaterial;
        rMat.opacity = THREE.MathUtils.lerp(rMat.opacity, splashAlpha, delta * 3);

        if (this.currentWeather === "rain") {
          const s = (time * 4.0 + idx * 0.4) % 1.0;
          ring.scale.set(0.6 + s * 1.8, 0.6 + s * 1.8, 1);
          rMat.opacity = (1.0 - s) * 0.65;

          if (s < 0.05) {
            ring.position.set(
              playerPos.x + (Math.random() - 0.5) * 36,
              0.05,
              playerPos.z + (Math.random() - 0.5) * 36
            );
          }
        }
      });
    }

    // 4. Snow Particles
    const targetSnowAlpha = this.currentWeather === "snow" ? 0.90 : 0.0;
    if (this.snowPoints && this.snowGeometry) {
      const mat = this.snowPoints.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetSnowAlpha, lerpSpeed * 2);
      this.snowPoints.visible = mat.opacity > 0.02;

      if (this.snowPoints.visible) {
        const posAttr = this.snowGeometry.attributes.position;
        const seedAttr = this.snowGeometry.attributes.seeds;

        for (let i = 0; i < this.snowCount; i++) {
          const phase = seedAttr.getX(i);
          const fallRate = seedAttr.getY(i);

          let y = posAttr.getY(i) - fallRate * delta;
          let x = posAttr.getX(i) + Math.sin(time * 1.8 + phase) * delta * 2.2;
          let z = posAttr.getZ(i) + Math.cos(time * 1.4 + phase) * delta * 1.8;

          if (y < 0.2) {
            y = 32 + Math.random() * 8;
            x = playerPos.x + (Math.random() - 0.5) * 120;
            z = playerPos.z + (Math.random() - 0.5) * 120;
          }
          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
      }
    }
  }

  public dispose() {
    if (this.starPoints) {
      this.scene.remove(this.starPoints);
      this.starPoints.geometry.dispose();
      (this.starPoints.material as THREE.Material).dispose();
      this.starPoints = null;
    }
    if (this.sparklePoints) {
      this.scene.remove(this.sparklePoints);
      this.sparklePoints.geometry.dispose();
      (this.sparklePoints.material as THREE.Material).dispose();
      this.sparklePoints = null;
    }
    if (this.moonMesh) {
      this.scene.remove(this.moonMesh);
      this.moonMesh = null;
    }
    if (this.moonLight) {
      this.scene.remove(this.moonLight);
      this.moonLight = null;
    }
    if (this.rainPoints) {
      this.scene.remove(this.rainPoints);
      this.rainPoints.geometry.dispose();
      (this.rainPoints.material as THREE.Material).dispose();
      this.rainPoints = null;
    }
    this.rainSplashes.forEach((ring) => {
      this.scene.remove(ring);
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
    });
    this.rainSplashes = [];

    if (this.snowPoints) {
      this.scene.remove(this.snowPoints);
      this.snowGeometry?.dispose();
      (this.snowPoints.material as THREE.Material).dispose();
      this.snowPoints = null;
    }

    this.lampPosts.forEach((l) => {
      this.scene.remove(l.group);
    });
    this.lampPosts = [];
    this.customLamps = [];

    if (this.miloNightLight) {
      this.scene.remove(this.miloNightLight);
      this.miloNightLight = null;
    }
  }
}
