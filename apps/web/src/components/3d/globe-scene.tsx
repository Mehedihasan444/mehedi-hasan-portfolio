"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGlobeScroll } from "@/hooks/use-globe-scroll";

const RADIUS = 1.1;
const SEGMENTS = 64;
const DOT_SIZE = 0.019;
/** Dots sit a hair outside the sphere so they never z-fight with its surface. */
const DOT_RADIUS = RADIUS * 1.002;
const MARKER_SIZE = 0.05;
/** Precomputed by `scripts/generate-globe-land-dots.mjs` (flat lng*10,lat*10 pairs). */
const LAND_DOTS_URL = "/globe-land-dots.json";
const LAND_DOTS_ATTEMPTS = 3;

function latLngToPosition(lat: number, lng: number, r = RADIUS) {
  const latRad = lat * (Math.PI / 180);
  const lngRad = lng * (Math.PI / 180);
  return new THREE.Vector3(
    Math.cos(latRad) * Math.sin(lngRad) * r,
    Math.sin(latRad) * r,
    Math.cos(latRad) * Math.cos(lngRad) * r,
  );
}

/**
 * Dot positions are static, so decode them once per page load and reuse them when the
 * hero remounts (client-side navigation). Module scope survives component unmounts.
 */
let landDotPositions: Float32Array | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadLandDotPositions(): Promise<Float32Array> {
  if (landDotPositions) return landDotPositions;

  let lastError: unknown;
  for (let attempt = 0; attempt < LAND_DOTS_ATTEMPTS; attempt++) {
    try {
      // No explicit cache mode: let the HTTP cache (ETag revalidation) govern it, so a
      // regenerated asset is picked up instead of being force-cached forever.
      const res = await fetch(LAND_DOTS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const flat: number[] = await res.json();

      const positions = new Float32Array((flat.length / 2) * 3);
      for (let i = 0, j = 0; i < flat.length; i += 2, j += 3) {
        const lng = flat[i]! / 10;
        const lat = flat[i + 1]! / 10;
        const latRad = lat * (Math.PI / 180);
        const lngRad = lng * (Math.PI / 180);
        positions[j] = Math.cos(latRad) * Math.sin(lngRad) * DOT_RADIUS;
        positions[j + 1] = Math.sin(latRad) * DOT_RADIUS;
        positions[j + 2] = Math.cos(latRad) * Math.cos(lngRad) * DOT_RADIUS;
      }

      landDotPositions = positions;
      return positions;
    } catch (error) {
      lastError = error;
      if (attempt < LAND_DOTS_ATTEMPTS - 1) await delay(400 * 2 ** attempt);
    }
  }

  // Never let a transient failure leave the globe as an invisible sphere: log it and let
  // the caller retry on the next mount (the module cache stays empty on purpose).
  throw lastError instanceof Error ? lastError : new Error("Failed to load globe land dots");
}

function GridLines() {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const spacing = 30;
    for (let lat = -90; lat <= 90; lat += spacing) {
      const ring: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const lng = (i / 64) * 360 - 180;
        ring.push(latLngToPosition(lat, lng));
      }
      pts.push(...ring);
    }
    for (let lng = -180; lng < 180; lng += spacing) {
      const meridian: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const lat = (i / 64) * 180 - 90;
        meridian.push(latLngToPosition(lat, lng));
      }
      pts.push(...meridian);
    }
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#059669" transparent opacity={0.08} />
    </lineSegments>
  );
}

function LandDots() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    let cancelled = false;

    const load = async () => {
      let positions: Float32Array;
      try {
        positions = await loadLandDotPositions();
      } catch (error) {
        console.warn("[globe] land dots unavailable:", error);
        return;
      }
      if (cancelled) return;

      const count = positions.length / 3;
      const geometry = new THREE.SphereGeometry(DOT_SIZE, 6, 4);
      const material = new THREE.MeshBasicMaterial({
        color: "#34d399",
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });

      const mesh = new THREE.InstancedMesh(geometry, material, count);
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < count; i++) {
        matrix.makeTranslation(positions[i * 3]!, positions[i * 3 + 1]!, positions[i * 3 + 2]!);
        mesh.setMatrixAt(i, matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    };

    // Defer the decode + instance build to an idle period so it never competes with the hero,
    // but never depend on idle alone: Chrome starves requestIdleCallback in background tabs,
    // which used to leave the globe without land dots until the next reload.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      void load();
    };

    const hasRIC = typeof window.requestIdleCallback === "function";
    const idle: number = hasRIC
      ? window.requestIdleCallback(start, { timeout: 2000 })
      : (setTimeout(start, 500) as unknown as number);
    const fallback = window.setTimeout(start, 1500);
    const onVisible = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      if (hasRIC) cancelIdleCallback(idle);
      else clearTimeout(idle);
      clearTimeout(fallback);
      document.removeEventListener("visibilitychange", onVisible);
      if (group) {
        while (group.children.length > 0) {
          const child = group.children[0];
          if (!child) break;
          group.remove(child);
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      }
    };
  }, []);

  return <group ref={groupRef} />;
}

function GlobeMesh() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS, SEGMENTS, SEGMENTS]} />
      <meshBasicMaterial color="#050810" />
    </mesh>
  );
}

function MarkerDots() {
  const markers = useMemo(
    () => [
      { lat: 23.8, lng: 90.4 },
      { lat: 40.7, lng: -74 },
      { lat: 51.5, lng: -0.1 },
      { lat: 35.7, lng: 139.7 },
      { lat: -33.9, lng: 151.2 },
      { lat: 48.9, lng: 2.3 },
      { lat: 1.3, lng: 103.8 },
    ],
    [],
  );

  return markers.map((m, i) => (
    <mesh key={i} position={latLngToPosition(m.lat, m.lng)}>
      <sphereGeometry args={[MARKER_SIZE, 8, 8]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
    </mesh>
  ));
}

function GlowRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[RADIUS * 1.12, RADIUS * 1.22, 64]} />
      <meshBasicMaterial
        color="#059669"
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function GlobeScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { progress, rotationSpeed, cameraTilt } = useGlobeScroll();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let ticking = false;
    const onMouse = (e: MouseEvent) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        mouseRef.current = {
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        };
        ticking = false;
      });
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const lerp = 1 - Math.pow(0.05, delta);
    const scrollRotY = progress * Math.PI * 0.3;
    const mouseInfluenceX = mouseRef.current.x * 0.15;
    const mouseInfluenceY = mouseRef.current.y * 0.1;

    targetRotation.current.x += (rotationSpeed * 0.3 + mouseInfluenceX + scrollRotY) * delta;
    targetRotation.current.y += mouseInfluenceY * delta;
    targetRotation.current.y = THREE.MathUtils.clamp(targetRotation.current.y, -0.4, 0.4);

    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerp;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerp;

    groupRef.current.rotation.y = currentRotation.current.x;
    groupRef.current.rotation.x = currentRotation.current.y;
    groupRef.current.rotation.z = cameraTilt * 0.5;
  });

  return (
    <group ref={groupRef}>
      <GlobeMesh />
      <GridLines />
      <LandDots />
      <MarkerDots />
      <GlowRing />
    </group>
  );
}
