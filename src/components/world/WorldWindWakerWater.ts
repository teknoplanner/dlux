"use client";

import * as THREE from "three";

/**
 * Calculates exact wave elevation at world coordinates (x, z) at time t.
 * Matches the vertex shader displacement so player, boats, and items bob realistically.
 */
export function getWindWakerWaveElevation(x: number, z: number, time: number, waveHeight: number = 0.32, waveSpeed: number = 1.4): number {
  const t = time * waveSpeed;
  // Gerstner components
  const k1 = 6.2831853 / 28.0;
  const c1 = Math.sqrt(9.8 / k1) * 0.9;
  const d1x = 1.0 / Math.sqrt(1.16);
  const d1z = 0.4 / Math.sqrt(1.16);
  const f1 = k1 * (d1x * x + d1z * z - c1 * t);
  const a1 = 0.16 / k1;
  const g1y = a1 * Math.sin(f1);

  const k2 = 6.2831853 / 18.0;
  const c2 = Math.sqrt(9.8 / k2) * 1.1;
  const d2x = -0.5 / Math.sqrt(0.89);
  const d2z = 0.8 / Math.sqrt(0.89);
  const f2 = k2 * (d2x * x + d2z * z - c2 * t);
  const a2 = 0.12 / k2;
  const g2y = a2 * Math.sin(f2);

  const k3 = 6.2831853 / 11.0;
  const c3 = Math.sqrt(9.8 / k3) * 1.3;
  const d3x = 0.3 / Math.sqrt(0.9);
  const d3z = -0.9 / Math.sqrt(0.9);
  const f3 = k3 * (d3x * x + d3z * z - c3 * t);
  const a3 = 0.08 / k3;
  const g3y = a3 * Math.sin(f3);

  return (g1y + g2y + g3y) * (waveHeight / 0.32);
}

/**
 * Stylized The Legend of Zelda: The Wind Waker Ocean for Three.js.
 * Features rolling Gerstner waves, cel-shaded two-tone ocean blue, and
 * animated voronoi caustic foam webs.
 */
export class WorldWindWakerWater {
  public mesh: THREE.Mesh;
  public material: THREE.ShaderMaterial;
  private geometry: THREE.PlaneGeometry;

  constructor(size: number = 620, segments: number = 72) {
    this.geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    this.geometry.rotateX(-Math.PI / 2);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uWaveHeight: { value: 0.32 },
        uWaveSpeed: { value: 1.4 },
        uDeepColor: { value: new THREE.Color(0x0c4a9e) },     // Wind Waker deep royal blue
        uShallowColor: { value: new THREE.Color(0x1d72db) },  // Mid azure blue
        uCrestColor: { value: new THREE.Color(0x38bdf8) },    // Vibrant cyan crest
        uFoamColor: { value: new THREE.Color(0xffffff) },     // Brilliant white caustic foam
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWaveHeight;
        uniform float uWaveSpeed;

        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying float vElevation;
        varying vec3 vNormal;

        // Gerstner wave displacement
        vec3 gerstnerWave(vec2 dir, float steepness, float wavelength, float speed, vec2 pos, float time) {
          float k = 6.2831853 / wavelength;
          float c = sqrt(9.8 / k) * speed;
          vec2 d = normalize(dir);
          float f = k * (dot(d, pos) - c * time);
          float a = steepness / k;
          return vec3(
            d.x * (a * cos(f)),
            a * sin(f),
            d.y * (a * cos(f))
          );
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Plane was rotated -PI/2 around X:
          // pos.x is world X, pos.y is world -Z, pos.z is world Y
          vec2 worldXZ = vec2(pos.x, -pos.y);
          float t = uTime * uWaveSpeed;

          // Compound Gerstner waves matching Wind Waker rolling swell
          vec3 g1 = gerstnerWave(vec2(1.0, 0.4), 0.16, 28.0, 0.9, worldXZ, t);
          vec3 g2 = gerstnerWave(vec2(-0.5, 0.8), 0.12, 18.0, 1.1, worldXZ, t);
          vec3 g3 = gerstnerWave(vec2(0.3, -0.9), 0.08, 11.0, 1.3, worldXZ, t);

          float elevation = (g1.y + g2.y + g3.y) * (uWaveHeight / 0.32);

          // Trochoidal horizontal drift
          pos.x += (g1.x + g2.x + g3.x) * 0.4;
          pos.y -= (g1.z + g2.z + g3.z) * 0.4;
          pos.z += elevation;

          vElevation = elevation;
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos.xyz;

          // Approximate normal for cel lighting
          float dX = -cos(worldXZ.x * 0.05 + t) * 0.12;
          float dZ = -cos(worldXZ.y * 0.05 + t * 0.9) * 0.12;
          vNormal = normalize(vec3(dX, 1.0, dZ));

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;
        uniform vec3 uCrestColor;
        uniform vec3 uFoamColor;

        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying float vElevation;
        varying vec3 vNormal;

        // 2D Hash
        vec2 hash2(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }

        // Fast 1-Pass Worley F2 - F1 Caustic Web (Only 9 iterations!)
        float fastCaustic(vec2 p, float timeOffset) {
          vec2 n = floor(p);
          vec2 f = fract(p);
          float d1 = 8.0;
          float d2 = 8.0;

          for (int j = -1; j <= 1; j++) {
            for (int i = -1; i <= 1; i++) {
              vec2 g = vec2(float(i), float(j));
              vec2 o = 0.5 + 0.45 * sin(timeOffset + 6.2831853 * (0.5 + 0.5 * hash2(n + g)));
              vec2 r = g + o - f;
              float d = dot(r, r);
              if (d < d1) {
                d2 = d1;
                d1 = d;
              } else if (d < d2) {
                d2 = d;
              }
            }
          }
          return sqrt(d2) - sqrt(d1);
        }

        void main() {
          // Animated scrolling caustic web at optimized sample rate
          float t = uTime * 0.35;
          vec2 uv1 = vWorldPos.xz * 0.16 + vec2(t * 0.3, t * 0.2);
          vec2 uv2 = vWorldPos.xz * 0.22 + vec2(-t * 0.25, t * 0.32);

          float c1 = fastCaustic(uv1, uTime * 0.6);
          float c2 = fastCaustic(uv2, uTime * 0.75 + 2.1);
          float causticDist = min(c1, c2 * 1.1);

          // Threshold caustic distance into sharp Wind Waker foam lines
          float crestFactor = smoothstep(-0.1, 0.3, vElevation);
          float lineThickness = mix(0.04, 0.08, crestFactor);

          float foamLine = 1.0 - smoothstep(0.01, lineThickness, causticDist);
          foamLine = pow(foamLine, 1.5);

          // Two-tone cel-shaded ocean gradient: deep blue in troughs, azure near crests
          float waveGrad = smoothstep(-0.35, 0.35, vElevation);
          vec3 waterCol = mix(uDeepColor, uShallowColor, waveGrad);

          // Subtle tropical cyan rim on wave peaks
          waterCol = mix(waterCol, uCrestColor, smoothstep(0.18, 0.45, vElevation) * 0.45);

          // Cel-shaded directional light sheen (Sun glint)
          vec3 lightDir = normalize(vec3(0.4, 0.8, -0.4));
          float NdotL = max(0.0, dot(vNormal, lightDir));
          waterCol += uCrestColor * smoothstep(0.75, 0.95, NdotL) * 0.18;

          // Composite the crisp white Wind Waker foam web
          vec3 finalColor = mix(waterCol, uFoamColor, foamLine * 0.95);

          // Soft atmospheric fog towards the horizon
          float dist = length(vWorldPos.xz);
          float fogFactor = smoothstep(190.0, 320.0, dist);
          vec3 fogColor = vec3(0.55, 0.78, 0.96); // Soft sky horizon blue
          finalColor = mix(finalColor, fogColor, fogFactor * 0.75);

          gl_FragColor = vec4(finalColor, 0.96);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 0;
    this.mesh.receiveShadow = false;
  }

  public update(time: number) {
    this.material.uniforms.uTime.value = time;
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
