"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* Drive the render loop from a rAF that always invalidates. r3f can otherwise
 * leave freshly-loaded async content undrawn; `once` renders a short burst then
 * stops (reduced-motion / static), otherwise it renders continuously. */
function RenderDriver({ once = false }: { once?: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let n = 0;
    let raf = 0;
    const tick = () => {
      invalidate();
      if (!once || n++ < 80) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate, once]);
  return null;
}

/**
 * A single celestial body loaded from a GLB and normalized to `diameter` world
 * units regardless of the source model's scale, then slowly spun.
 */
function Body({
  url,
  position,
  diameter,
  spin = 0.05,
  tiltZ = 0.15,
}: {
  url: string;
  position: [number, number, number];
  diameter: number;
  spin?: number;
  tiltZ?: number;
}) {
  const { scene } = useGLTF(url);
  const spinner = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = diameter / (Math.max(size.x, size.y, size.z) || 1);
    // Re-center then scale.
    c.position.set(-center.x, -center.y, -center.z);
    const wrap = new THREE.Group();
    wrap.add(c);
    wrap.scale.setScalar(s);
    return wrap;
  }, [scene, diameter]);

  useFrame((_, dt) => {
    if (spinner.current) spinner.current.rotation.y += spin * dt;
  });

  return (
    <group position={position} rotation={[0, 0, tiltZ]}>
      <group ref={spinner}>
        <primitive object={model} />
      </group>
    </group>
  );
}

/** A craft that drifts slowly across the far field and loops. */
function Drifter({ url, y, z, scale, speed }: { url: string; y: number; z: number; scale: number; speed: number }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);
  const model = useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = scale / (Math.max(size.x, size.y, size.z) || 1);
    c.position.set(-center.x, -center.y, -center.z);
    const wrap = new THREE.Group();
    wrap.add(c);
    wrap.scale.setScalar(s);
    return wrap;
  }, [scene, scale]);

  useFrame((state) => {
    if (!ref.current) return;
    // A long, shallow diagonal crossing — a ship on a real trajectory, not a loop.
    const span = 44;
    const t = (((state.clock.elapsedTime * speed) % span) + span) % span - span / 2;
    ref.current.position.set(t, y + t * 0.18, z + Math.sin(t * 0.1) * 1.5);
    ref.current.rotation.set(0.1, Math.PI * 0.5 + 0.35, 0.12);
  });

  return (
    <group ref={ref}>
      <primitive object={model} />
    </group>
  );
}

/** Normalize any GLB to a target size (longest axis) and re-center. */
function useNormalized(url: string, size: number) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const c = scene.clone(true);
    const box = new THREE.Box3().setFromObject(c);
    const bs = new THREE.Vector3();
    const bc = new THREE.Vector3();
    box.getSize(bs);
    box.getCenter(bc);
    const s = size / (Math.max(bs.x, bs.y, bs.z) || 1);
    c.position.set(-bc.x, -bc.y, -bc.z);
    const wrap = new THREE.Group();
    wrap.add(c);
    wrap.scale.setScalar(s);
    return wrap;
  }, [scene, size]);
}

/** A satellite that actually orbits a body on a tilted plane. */
function Orbiter({
  url,
  center,
  radius,
  size,
  speed,
  tilt,
  phase = 0,
}: {
  url: string;
  center: [number, number, number];
  radius: number;
  size: number;
  speed: number;
  tilt: number;
  phase?: number;
}) {
  const model = useNormalized(url, size);
  const pivot = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (pivot.current) pivot.current.rotation.y = phase + state.clock.elapsedTime * speed;
  });
  return (
    <group position={center} rotation={[tilt, 0, 0]}>
      <group ref={pivot}>
        <group position={[radius, 0, 0]} rotation={[0, 0, 0.3]}>
          <primitive object={model} />
        </group>
      </group>
    </group>
  );
}

/** Subtle cursor parallax on the camera (zero-g drift). */
function CameraRig({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);
  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (-target.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const P = "/models/planets";

/**
 * Real-3D deep-space backdrop for the homepage: actual planet models (Earth,
 * Saturn, Jupiter, Mars) with a sun terminator, a drifting satellite, and a
 * rocket, replacing the earlier CSS/SVG planets. Fixed behind page content.
 */
export function PlanetScene3D() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    // Static (no continuous render) for reduced-motion and touch/mobile — saves battery.
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 900;
    setReduced(rm || mobile);
    // r3f in a fixed/pointer-events-none container can skip its first frame until
    // a resize fires the ResizeObserver — nudge it a few times after mount.
    let n = 0;
    const kick = () => {
      window.dispatchEvent(new Event("resize"));
      if (n++ < 6) setTimeout(kick, 250);
    };
    const t = setTimeout(kick, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 13], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
      >
        {/* Atmospheric depth — distant bodies fade into the void */}
        <fog attach="fog" args={["#05070f", 20, 66]} />
        {/* One sun, consistent terminator across every body */}
        <directionalLight position={[9, 3, 7]} intensity={3.4} color="#fff4e6" />
        <ambientLight intensity={0.13} />
        <hemisphereLight args={["#33406e", "#05070f", 0.28]} />

        {reduced && <RenderDriver once />}
        <CameraRig enabled={!reduced} />

        {/* FOREGROUND — Earth, our launch point: huge, sharp, low-left */}
        <Suspense fallback={null}>
          <Body url={`${P}/earth.glb`} position={[-9.5, -8, 0.5]} diameter={20} spin={0.02} tiltZ={0.4} />
        </Suspense>
        {/* A satellite in low Earth orbit */}
        <Suspense fallback={null}>
          <Orbiter url={`${P}/space_satellite.glb`} center={[-9.5, -8, 0.5]} radius={12.5} size={1.1} speed={0.22} tilt={0.7} phase={0.6} />
        </Suspense>

        {/* MID FIELD — Saturn, clearly smaller & further, rings lifted above the fold */}
        <Suspense fallback={null}>
          <Body url={`${P}/saturn.glb`} position={[11.5, 6.5, -14]} diameter={7.5} spin={0.05} tiltZ={0.52} />
        </Suspense>

        {/* FAR — Jupiter the distant giant (big body, far away → hazed), red Mars */}
        <Suspense fallback={null}>
          <Body url={`${P}/jupiter.glb`} position={[-11.5, 7.5, -32]} diameter={12} spin={0.04} tiltZ={0.15} />
        </Suspense>
        <Suspense fallback={null}>
          <Body url={`${P}/mars.glb`} position={[10.5, -4.5, -20]} diameter={3.2} spin={0.06} tiltZ={0.25} />
        </Suspense>

        {/* DEEP FIELD — tiny distant worlds for parallax depth */}
        <Suspense fallback={null}>
          <Body url={`${P}/venus.glb`} position={[3, 9, -36]} diameter={3.4} spin={0.03} tiltZ={0.1} />
        </Suspense>
        <Suspense fallback={null}>
          <Body url={`${P}/mercury.glb`} position={[-4, 1, -44]} diameter={3} spin={0.04} tiltZ={0.1} />
        </Suspense>

        {/* A ship crossing mid-field on a shallow trajectory */}
        <Suspense fallback={null}>
          <Drifter url={`${P}/explorative_space_craft.glb`} y={-2} z={-9} scale={1.3} speed={0.8} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(`${P}/earth.glb`);
