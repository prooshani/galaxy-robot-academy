"use client";

import { Suspense, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Lightformer, AdaptiveDpr, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { type SuitConfig } from "@galaxy/types";
import { SuitModelGLB } from "@/components/suit/SuitModelGLB";
import { SUIT_ASSETS, resolveSuitAsset } from "@/components/suit/suits.catalog";

/* Kick the render loop after async content resolves — r3f can otherwise leave
 * the freshly-loaded model undrawn until the next invalidate (resize, etc.). */
function RenderKick({ dep }: { dep: string }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let n = 0;
    let raf = 0;
    const tick = () => {
      invalidate();
      if (n++ < 40) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [invalidate, dep]);
  return null;
}

/* When the selected suit changes, snap the turntable back to a front view so
 * each new suit is presented head-on rather than mid-spin from the last one. */
function FrontOnSelect({ dep }: { dep: string }) {
  const controls = useThree((s) => s.controls) as { setAzimuthalAngle?: (a: number) => void; update?: () => void } | null;
  useEffect(() => {
    controls?.setAzimuthalAngle?.(0);
    controls?.update?.();
  }, [controls, dep]);
  return null;
}

/* ----------------------------- 3D viewport ----------------------------- */
function Viewport({ modelId }: { modelId: string | null }) {
  const asset = resolveSuitAsset(modelId);
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.35, 6.9], fov: 32 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#070A14"]} />
      <fog attach="fog" args={["#070A14", 7, 14]} />

      <Suspense
        fallback={
          <Html center>
            <span className="stamp-label text-xs text-muted">Loading suit…</span>
          </Html>
        }
      >
        {/* Cinematic key / fill / rim */}
        <ambientLight intensity={0.4} />
        <hemisphereLight args={["#cdd7ff", "#0a0f1e", 0.55]} />
        <directionalLight position={[4, 6.5, 4]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]}>
          <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 20]} />
        </directionalLight>
        <directionalLight position={[-5, 4, -4]} intensity={1.2} color="#9db4ff" />
        <pointLight position={[0, 2.4, 2.2]} intensity={2} color="#ffffff" distance={7} />

        <RenderKick dep={asset.id} />
        <FrontOnSelect dep={asset.id} />
        <group position={[0, -1.7, 0]}>
          <SuitModelGLB key={asset.id} asset={asset} />
          {/* Hangar platform */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[1.15, 1.35, 64]} />
            <meshStandardMaterial color="#AF50FF" emissive="#AF50FF" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
          <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={7} blur={2.6} far={4} color="#000000" />
        </group>

        {/* Reflection environment built from lightformers — no network fetch */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} position={[3, 3, 3]} scale={[5, 5, 1]} />
          <Lightformer form="rect" intensity={1.1} position={[-4, 2, 2]} scale={[4, 4, 1]} color="#9db4ff" />
          <Lightformer form="ring" intensity={1.6} position={[0, 3, -5]} scale={[7, 7, 1]} />
          <Lightformer form="rect" intensity={0.8} position={[0, -3, 2]} scale={[6, 3, 1]} color="#5a6480" />
        </Environment>

        <EffectComposer enableNormalPass={false}>
          <Bloom mipmapBlur luminanceThreshold={1.05} intensity={0.8} radius={0.7} />
          <Vignette eskil={false} offset={0.3} darkness={0.5} />
        </EffectComposer>

        <OrbitControls
          makeDefault
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
          minDistance={3.6}
          maxDistance={9}
          minPolarAngle={0.55}
          maxPolarAngle={1.95}
          target={[0, -0.1, 0]}
          enableDamping
        />
        <AdaptiveDpr pixelated />
      </Suspense>
    </Canvas>
  );
}

/**
 * The cadet Suit Forge: a live 3D character selector. Rotate/zoom the stage and
 * pick from the authored suit roster. Controlled — the parent owns the
 * {@link SuitConfig} (here just `modelId`) and persists it.
 */
export default function SuitStudio({
  value,
  onChange,
  className,
}: {
  value: SuitConfig;
  onChange: (next: SuitConfig) => void;
  className?: string;
}) {
  const pick = useCallback((id: string) => onChange({ ...value, modelId: id }), [value, onChange]);
  const active = resolveSuitAsset(value.modelId);

  return (
    <div className={`flex min-h-0 flex-col gap-3 ${className ?? ""}`}>
      {/* Stage */}
      <div className="relative min-h-[300px] flex-[3] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#0B1020] to-[#05070F]">
        <Viewport modelId={value.modelId} />
        <div className="pointer-events-none absolute left-4 top-4">
          <span className="stamp-label text-[.6rem] text-halo">CADET IDENTITY</span>
          <p className="mt-0.5 font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-foreground">{active.name}</p>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
          <span className="stamp-label flex flex-col items-center gap-0.5 rounded-2xl border border-white/10 bg-black/40 px-4 py-1.5 text-center text-[.55rem] leading-tight text-muted backdrop-blur">
            <span className="whitespace-nowrap">DRAG TO ROTATE</span>
            <span className="whitespace-nowrap">SCROLL TO ZOOM</span>
          </span>
        </div>
      </div>

      {/* Roster */}
      <div className="flex min-h-0 flex-[2] flex-col gap-2 overflow-y-auto rounded-2xl border border-border bg-panel/50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="stamp-label text-[.6rem] text-muted">Choose your suit</h3>
          <span className="text-[.6rem] text-muted">{SUIT_ASSETS.length} suits</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUIT_ASSETS.map((a) => {
            const isActive = active.id === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => pick(a.id)}
                aria-pressed={isActive}
                className={`relative rounded-xl border px-3 py-3 text-left text-xs font-semibold transition ${
                  isActive
                    ? "border-brand bg-brand/10 text-brand shadow-[0_0_0_1px_var(--color-brand)]"
                    : "border-border text-muted hover:border-brand/50 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {a.name}
                {a.premium && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-energy px-1.5 py-0.5 text-[.45rem] font-bold uppercase text-black">
                    Pro
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
