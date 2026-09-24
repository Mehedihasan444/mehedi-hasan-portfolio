"use client";

import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

const MAX_PARTICLES = 120;

/** Shared mutable clock value — advanced once per frame by <ClockDriver/>. */
interface TimeRef {
  current: number;
}

interface AnimatedProps {
  progress: number;
  timeRef: TimeRef;
}

/** Single clock for the whole scene: accumulates delta once per frame. */
function ClockDriver({ timeRef }: { timeRef: TimeRef }) {
  useFrame((_, delta) => {
    if (document.hidden) return;
    timeRef.current += Math.min(delta, 0.05);
  });
  return null;
}

function FloatingIcosahedron({ progress, timeRef }: AnimatedProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current || document.hidden) return;
    const t = timeRef.current;
    const scrollOffset = progress * 3;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.3 + progress * 1.5;
    meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.3 + progress * 2;
    meshRef.current.position.x = pointer.x * 0.2;
    meshRef.current.position.y = pointer.y * 0.2 - scrollOffset * 0.3;
    meshRef.current.scale.setScalar(1.2 - progress * 0.8);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={1.2}>
        <icosahedronGeometry args={[1, 0]} />
        {/* Cheap standard material: replaces MeshDistortMaterial (no per-frame shader displacement). */}
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.2}
          roughness={0.25}
          metalness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ progress, timeRef }: AnimatedProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current || document.hidden) return;
    const t = timeRef.current;
    const scrollOffset = progress * 3;
    meshRef.current.rotation.x = Math.sin(t * 0.15 + 1) * 0.5 + progress;
    meshRef.current.rotation.y = Math.sin(t * 0.25 + 1) * 0.5 + progress * 1.5;
    meshRef.current.position.x = pointer.x * 0.15 + 1.5;
    meshRef.current.position.y = pointer.y * 0.15 - 0.5 - scrollOffset * 0.2;
    meshRef.current.scale.setScalar(0.8 - progress * 0.5);
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} scale={0.8}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        {/* Cheap physical material WITHOUT transmission: replaces MeshTransmissionMaterial
            (which renders the scene into a separate transmission target every frame). */}
        <meshPhysicalMaterial
          color="#059669"
          roughness={0.15}
          metalness={0.3}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron({ progress, timeRef }: AnimatedProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current || document.hidden) return;
    const t = timeRef.current;
    const scrollOffset = progress * 3;
    meshRef.current.rotation.x = Math.sin(t * 0.25 + 2) * 0.4 + progress * 0.8;
    meshRef.current.rotation.y = Math.sin(t * 0.35 + 2) * 0.4 + progress * 1.2;
    meshRef.current.position.x = pointer.x * 0.1 - 1.8;
    meshRef.current.position.y = pointer.y * 0.1 + 1 - scrollOffset * 0.25;
    meshRef.current.scale.setScalar(0.6 - progress * 0.4);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={0.6}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#34D399"
          emissive="#34D399"
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function Particles3D({ progress, timeRef }: AnimatedProps) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    // Deterministic PRNG (mulberry32) — stable across re-renders, no impure Math.random in render.
    let seed = 0x2f6e2b1;
    const rand = () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const pos = new Float32Array(MAX_PARTICLES * 3);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      pos[i * 3] = (rand() - 0.5) * 20;
      pos[i * 3 + 1] = (rand() - 0.5) * 20;
      pos[i * 3 + 2] = (rand() - 0.5) * 20;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(() => {
    if (!ref.current || document.hidden) return;
    const t = timeRef.current * 0.05;
    ref.current.rotation.y = t + progress * 2;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.3 + progress * 0.5;
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 0.4 - progress * 0.3;
  });

  return (
    <points ref={ref} geometry={geometry}>
      {/* pointsMaterial is auto-disposed by R3F on unmount. */}
      <pointsMaterial size={0.03} color="#059669" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function SceneContent() {
  // Single scroll subscription + single clock shared by all meshes.
  const { progress } = useScrollProgress();
  const timeRef = useRef(0);

  return (
    <>
      <ClockDriver timeRef={timeRef} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#059669" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#10B981" />
      <FloatingIcosahedron progress={progress} timeRef={timeRef} />
      <FloatingTorus progress={progress} timeRef={timeRef} />
      <FloatingOctahedron progress={progress} timeRef={timeRef} />
      <Particles3D progress={progress} timeRef={timeRef} />
    </>
  );
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [staticFallback, setStaticFallback] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Rule 1: no WebGL for reduced-motion or touch devices — static CSS fallback instead.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      setStaticFallback(true);
      return;
    }
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!mounted) return null;

  if (staticFallback) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[15%] top-[40%] h-48 w-48 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute bottom-[20%] left-[30%] h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={paused ? "never" : "always"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
