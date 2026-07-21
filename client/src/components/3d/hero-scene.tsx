"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

function FloatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef(new THREE.Timer());
  const { pointer } = useThree();
  const { progress } = useScrollProgress();

  useFrame(() => {
    if (!meshRef.current) return;
    timerRef.current.update();
    const t = timerRef.current.getElapsed();
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
        <MeshDistortMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={0.2}
          distort={0.2}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef(new THREE.Timer());
  const { pointer } = useThree();
  const { progress } = useScrollProgress();

  useFrame(() => {
    if (!meshRef.current) return;
    timerRef.current.update();
    const t = timerRef.current.getElapsed();
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
        <MeshTransmissionMaterial
          backside
          thickness={0.5}
          roughness={0.1}
          metalness={0.1}
          ior={1.5}
          chromaticAberration={0.3}
          transparent
          opacity={0.8}
          color="#059669"
        />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef(new THREE.Timer());
  const { pointer } = useThree();
  const { progress } = useScrollProgress();

  useFrame(() => {
    if (!meshRef.current) return;
    timerRef.current.update();
    const t = timerRef.current.getElapsed();
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
        <meshPhysicalMaterial
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

function Particles3D() {
  const count = 200;
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  });

  const ref = useRef<THREE.Points>(null);
  const timerRef = useRef(new THREE.Timer());
  const { progress } = useScrollProgress();

  useFrame(() => {
    if (!ref.current) return;
    timerRef.current.update();
    const t = timerRef.current.getElapsed() * 0.05;
    ref.current.rotation.y = t + progress * 2;
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.3 + progress * 0.5;
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 0.4 - progress * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#059669" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#059669" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#10B981" />
      <FloatingIcosahedron />
      <FloatingTorus />
      <FloatingOctahedron />
      <Particles3D />
    </>
  );
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
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
