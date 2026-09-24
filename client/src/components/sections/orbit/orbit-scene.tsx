"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { ORBIT_PLANETS, ORBIT_RADII, planetOrbitRadius, type OrbitPlanet } from "./constants";

export interface OrbitScrollRef {
  current: number;
}

interface SceneProps {
  scrollRef: OrbitScrollRef;
  timeRef: OrbitScrollRef;
  reducedMotion: boolean;
  active: boolean;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onMiss: () => void;
}

function useGlowTexture(inner: string, outer: string): THREE.CanvasTexture | null {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.35, inner);
    grad.addColorStop(1, outer);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [inner, outer]);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}

function Sun({
  onHover,
  onSelect,
  highlighted,
}: {
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  highlighted: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glow = useGlowTexture("rgba(253, 224, 130, 0.9)", "rgba(253, 224, 130, 0)");

  useFrame(({ clock }) => {
    if (!meshRef.current || document.hidden) return;
    const t = clock.elapsedTime;
    const s = highlighted ? 1.12 : 1 + Math.sin(t * 1.4) * 0.02;
    meshRef.current.scale.setScalar(s);
    meshRef.current.rotation.y = t * 0.05;
  });

  const setCursor = (v: string) => {
    document.body.style.cursor = v;
  };

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setCursor("pointer");
    onHover("sun");
  };
  const handleOut = () => {
    setCursor("");
    onHover(null);
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect("sun");
  };

  return (
    <group>
      <mesh ref={meshRef} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[1.05, 48, 48]} />
        <meshBasicMaterial color="#FDE68A" toneMapped={false} />
      </mesh>
      {glow && (
        <sprite scale={[7.5, 7.5, 1]}>
          <spriteMaterial map={glow} transparent depthWrite={false} opacity={0.85} />
        </sprite>
      )}
      <pointLight position={[0, 0, 0]} intensity={140} distance={34} decay={2} color="#FFF7ED" />
    </group>
  );
}

function OrbitRing({
  radius,
  index,
  scrollRef,
}: {
  radius: number;
  index: number;
  scrollRef: OrbitScrollRef;
}) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const SEGMENTS = 160;
    for (let i = 0; i <= SEGMENTS; i++) {
      const a = (i / SEGMENTS) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(() => {
    if (!matRef.current) return;
    const p = scrollRef.current;
    const active = Math.min(ORBIT_RADII.length - 1, Math.floor(p * ORBIT_RADII.length));
    const dist = Math.abs(active - index);
    matRef.current.opacity = dist === 0 ? 0.55 : dist === 1 ? 0.3 : 0.14;
  });

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        color="#34D399"
        transparent
        opacity={0.2}
        depthWrite={false}
      />
    </lineLoop>
  );
}

function Planet({
  planet,
  scrollRef,
  timeRef,
  reducedMotion,
  highlighted,
  dimmed,
  onHover,
  onSelect,
}: {
  planet: OrbitPlanet;
  scrollRef: OrbitScrollRef;
  timeRef: OrbitScrollRef;
  reducedMotion: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current || document.hidden) return;
    const t = timeRef.current;
    const p = scrollRef.current;
    const r = planetOrbitRadius(planet, p);
    const angle = planet.phase + t * planet.speed;
    groupRef.current.position.set(
      Math.cos(angle) * r,
      Math.sin(angle * 2) * r * planet.tilt,
      Math.sin(angle) * r,
    );
    if (!reducedMotion) {
      meshRef.current.rotation.y += Math.min(delta, 0.05) * 0.6;
    }
    const target = highlighted ? 1.3 : 1;
    const s = meshRef.current.scale.x + (target - meshRef.current.scale.x) * 0.15;
    meshRef.current.scale.setScalar(s);
  });

  const setCursor = (v: string) => {
    document.body.style.cursor = v;
  };

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setCursor("pointer");
    onHover(planet.id);
  };
  const handleOut = () => {
    setCursor("");
    onHover(null);
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(planet.id);
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
        scale={1}
      >
        <sphereGeometry args={[planet.size, 40, 40]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={highlighted ? 0.55 : 0.3}
          roughness={0.35}
          metalness={0.15}
          transparent
          opacity={dimmed ? 0.45 : 1}
        />
      </mesh>
      {planet.ringed && (
        <mesh rotation-x={Math.PI / 2.4} rotation-y={0.2}>
          <torusGeometry args={[planet.size * 1.7, planet.size * 0.08, 12, 64]} />
          <meshBasicMaterial color="#DDD6FE" transparent opacity={dimmed ? 0.3 : 0.65} />
        </mesh>
      )}
    </group>
  );
}

function Rig({ scrollRef, children }: { scrollRef: OrbitScrollRef; children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current || document.hidden) return;
    const p = scrollRef.current;
    groupRef.current.rotation.y = p * Math.PI * 0.9;
  });

  return <group ref={groupRef}>{children}</group>;
}

function TimeDriver({
  timeRef,
  reducedMotion,
}: {
  timeRef: OrbitScrollRef;
  reducedMotion: boolean;
}) {
  useFrame((_, delta) => {
    if (reducedMotion || document.hidden) return;
    timeRef.current += Math.min(delta, 0.05);
  });
  return null;
}

export function OrbitScene(props: SceneProps) {
  const { scrollRef, reducedMotion, hoveredId, selectedId } = props;
  const activeId = hoveredId ?? selectedId;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 8.2, 14.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={props.active ? "always" : "never"}
      onPointerMissed={props.onMiss}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <TimeDriver timeRef={props.timeRef} reducedMotion={reducedMotion} />
      <Stars
        radius={70}
        depth={24}
        count={1400}
        factor={3.2}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.4}
      />
      <Rig scrollRef={scrollRef}>
        <Sun onHover={props.onHover} onSelect={props.onSelect} highlighted={activeId === "sun"} />
        {ORBIT_RADII.map((r, i) => (
          <OrbitRing key={r} radius={r} index={i} scrollRef={scrollRef} />
        ))}
        {ORBIT_PLANETS.map((planet) => (
          <Planet
            key={planet.id}
            planet={planet}
            scrollRef={scrollRef}
            timeRef={props.timeRef}
            reducedMotion={reducedMotion}
            highlighted={activeId === planet.id}
            dimmed={activeId !== null && activeId !== planet.id}
            onHover={props.onHover}
            onSelect={props.onSelect}
          />
        ))}
      </Rig>
    </Canvas>
  );
}
