"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGlobeScroll } from "@/hooks/use-globe-scroll";

const RADIUS = 1.1;
const SEGMENTS = 64;
const DOT_SIZE = 0.03;
const MARKER_SIZE = 0.05;

function latLngToPosition(lat: number, lng: number, r = RADIUS) {
  const latRad = lat * (Math.PI / 180);
  const lngRad = lng * (Math.PI / 180);
  return new THREE.Vector3(
    Math.cos(latRad) * Math.sin(lngRad) * r,
    Math.sin(latRad) * r,
    Math.cos(latRad) * Math.cos(lngRad) * r,
  );
}

function isOnLand(lng: number, lat: number, pixels: Uint8ClampedArray, w: number, h: number) {
  const rawX = Math.round(((lng + 180) / 360) * w) % w;
  const x = ((rawX % w) + w) % w;
  const y = Math.round(((90 - lat) / 180) * h);
  const clampedY = Math.max(0, Math.min(h - 1, y));
  return (pixels[(clampedY * w + x) * 4] ?? 0) > 128;
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
      <lineBasicMaterial color="#059669" transparent opacity={0.12} />
    </lineSegments>
  );
}

function LandDots() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/50m/physical/ne_50m_land.json",
          { signal: controller.signal, cache: "force-cache" },
        );
        if (!res.ok) return;
        if (cancelled || document.hidden) return;
        const geo: { features: unknown[] } = await res.json();

        const w = 1024,
          h = 512;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff";

        const { geoPath, geoEquirectangular } = await import("d3-geo");
        const projection = geoEquirectangular().fitSize([w, h], {
          type: "Sphere",
        });
        const path = geoPath().projection(projection).context(ctx);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geo.features.forEach((f: any) => path(f));
        ctx.fill();

        const imgData = ctx.getImageData(0, 0, w, h);
        const pixels = imgData.data;

        if (cancelled) return;

        const dotCoords: number[][] = [];
        const step = 0.12;
        for (let lat = -90; lat <= 90; lat += step) {
          const cosLat = Math.cos(Math.abs(lat) * (Math.PI / 180));
          const lngStep = cosLat > 0.01 ? step / Math.max(0.3, cosLat) : 360;
          for (let lng = -180; lng < 180; lng += lngStep) {
            if (isOnLand(lng, lat, pixels, w, h)) {
              dotCoords.push([lng, lat]);
            }
          }
        }

        if (cancelled || !group) return;

        const geometry = new THREE.SphereGeometry(DOT_SIZE, 4, 4);
        const material = new THREE.MeshBasicMaterial({
          color: "#34d399",
          transparent: true,
          opacity: 0.7,
        });

        const mesh = new THREE.InstancedMesh(geometry, material, dotCoords.length);
        const matrix = new THREE.Matrix4();
        dotCoords.forEach(([lng, lat], i) => {
          if (lng === undefined || lat === undefined) return;
          const pos = latLngToPosition(lat, lng);
          matrix.setPosition(pos);
          mesh.setMatrixAt(i, matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        group.add(mesh);
      } catch {
        // silently fail
      }
    };

    // Defer heavy parsing to idle period
    const hasRIC = typeof window.requestIdleCallback === "function";
    const idle: number = hasRIC
      ? window.requestIdleCallback(() => load(), { timeout: 2000 })
      : (setTimeout(load, 500) as unknown as number);
    return () => {
      cancelled = true;
      controller.abort();
      if (hasRIC) cancelIdleCallback(idle);
      else clearTimeout(idle);
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
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.9} />
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
        opacity={0.08}
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
