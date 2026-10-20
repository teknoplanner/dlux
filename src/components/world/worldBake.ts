import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Merge a finished, never-animated group into one mesh per look (same material values), so
// dozens of small parts cost one draw call each look instead of one per part.
export function bakeStatic(group: THREE.Group) {
  group.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(group.matrixWorld).invert();
  const buckets = new Map<string, { mat: THREE.Material; geos: THREE.BufferGeometry[]; shadow: boolean; recv: boolean }>();
  const meshes: THREE.Mesh[] = [];
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    const mat = m.material as THREE.MeshStandardMaterial;
    if (mat.map || mat.alphaMap || mat.transparent) return; // textured or blended parts keep their own mesh
    meshes.push(m);
  });
  for (const m of meshes) {
    const mat = m.material as THREE.MeshStandardMaterial;
    const key = [mat.type, mat.color?.getHex(), mat.emissive?.getHex(), mat.emissiveIntensity, mat.roughness, mat.metalness, mat.side, mat.opacity, m.castShadow, m.receiveShadow].join("|");
    const g = m.geometry.clone();
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, m.matrixWorld));
    const b = buckets.get(key) ?? { mat, geos: [], shadow: m.castShadow, recv: m.receiveShadow };
    b.geos.push(g);
    buckets.set(key, b);
  }
  const merged: THREE.Mesh[] = [];
  for (const b of Array.from(buckets.values())) {
    const geo = mergeGeometries(b.geos, false);
    b.geos.forEach((g: THREE.BufferGeometry) => g.dispose());
    if (!geo) return; // incompatible attributes: keep the original meshes untouched
    const mesh = new THREE.Mesh(geo, b.mat);
    mesh.castShadow = b.shadow;
    mesh.receiveShadow = b.recv;
    merged.push(mesh);
  }
  for (const m of meshes) {
    m.parent?.remove(m);
    m.geometry.dispose();
  }
  merged.forEach((m) => group.add(m));
}

