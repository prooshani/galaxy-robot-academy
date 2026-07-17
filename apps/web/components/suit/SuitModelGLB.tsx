"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SuitAsset } from "@/components/suit/suits.catalog";

/**
 * Renders a real GLB cadet suit (from Meshy.ai) inside the Forge stage.
 * Auto-fits the model to a ~3.4-unit standing height with feet at the origin so
 * every suit frames identically, and keeps each model's authored PBR materials
 * intact (only nudging envMapIntensity for consistent reflections). Materials
 * are cloned per-instance so nothing leaks into the shared cached glTF.
 */
export function SuitModelGLB({ asset }: { asset: SuitAsset }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(asset.file);

  // Deep-clone so instances / edits never mutate the cached glTF.
  const model = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        const clone = (mat: THREE.Material) => {
          const n = mat.clone() as THREE.MeshStandardMaterial;
          if ("envMapIntensity" in n) n.envMapIntensity = 1.1;
          return n;
        };
        m.material = Array.isArray(m.material) ? m.material.map(clone) : clone(m.material);
      }
    });
    return c;
  }, [scene]);

  // Center on origin, scale to a standing height, drop feet to y=0.
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = (3.4 / (size.y || 1)) * (asset.scale ?? 1);
    return { s, cx: center.x, cz: center.z, minY: box.min.y };
  }, [model, asset.scale]);

  // Gentle idle breathing.
  useFrame((state) => {
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.015;
  });

  return (
    <group ref={group} rotation={[0, asset.rotationY ?? 0, 0]}>
      <group scale={fit.s} position={[-fit.cx * fit.s, -fit.minY * fit.s, -fit.cz * fit.s]}>
        <primitive object={model} />
      </group>
    </group>
  );
}
