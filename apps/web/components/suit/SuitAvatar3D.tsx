"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SuitModelGLB } from "@/components/suit/SuitModelGLB";
import { resolveSuitAsset } from "@/components/suit/suits.catalog";

function Kick({ dep }: { dep: string }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let n = 0;
    let raf = 0;
    const tick = () => {
      invalidate();
      if (n++ < 50) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [invalidate, dep]);
  return null;
}

function Sway({ children }: { children: React.ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.32) * 0.4;
  });
  return <group ref={g}>{children}</group>;
}

/**
 * Compact live 3D cadet avatar — renders the selected GLB suit (upper-body
 * framing) in a small canvas so the avatar always reflects the chosen suit.
 * `animate` adds a gentle sway (hero); leave it off for tiny always-on slots
 * like the nav bar so there's no site-wide render loop.
 */
export function SuitAvatar3D({
  modelId,
  size = 96,
  animate = true,
  className,
}: {
  modelId?: string | null;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const asset = resolveSuitAsset(modelId);
  const model = <SuitModelGLB key={asset.id} asset={asset} />;
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas
        key={asset.id}
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: true }}
        camera={{ position: [0, 0.25, 4.3], fov: 32 }}
        frameloop={animate ? "always" : "demand"}
      >
        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#cdd7ff", "#0a0f1e", 0.6]} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
        <directionalLight position={[-4, 3, -3]} intensity={1} color="#9db4ff" />
        <Suspense fallback={null}>
          <Kick dep={asset.id} />
          {/* Shift up so the framing sits on the head + torso. */}
          <group position={[0, -2.25, 0]}>{animate ? <Sway>{model}</Sway> : model}</group>
          <Environment resolution={128}>
            <Lightformer form="rect" intensity={2} position={[3, 3, 3]} scale={[5, 5, 1]} />
            <Lightformer form="ring" intensity={1.4} position={[0, 3, -5]} scale={[6, 6, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}
