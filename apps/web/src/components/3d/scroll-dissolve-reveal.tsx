"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uTexture, uv);

    float dissolve = smoothstep(0.0, 0.3, uv.y - uProgress);
    float edge = smoothstep(0.0, 0.05, dissolve);

    vec3 edgeColor = vec3(0.067, 0.725, 0.506);
    vec3 finalColor = mix(edgeColor, tex.rgb, edge);

    float alpha = dissolve;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface ScrollDissolveRevealProps {
  imageSrc: string;
  progress: number;
}

export function ScrollDissolveReveal({ imageSrc, progress }: ScrollDissolveRevealProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTexture: { value: null as THREE.Texture | null },
      uProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  useEffect(() => {
    let cancelled = false;

    textureLoader.load(
      imageSrc,
      (texture) => {
        if (cancelled) {
          // Loaded after unmount / src change — dispose immediately, no leak.
          texture.dispose();
          return;
        }
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        const prev = uniforms.uTexture.value;
        if (prev) prev.dispose();
        uniforms.uTexture.value = texture;
      },
      undefined,
      () => {
        // Load failure: leave the plane transparent rather than crashing.
      },
    );

    return () => {
      cancelled = true;
      const current = uniforms.uTexture.value;
      if (current) {
        uniforms.uTexture.value = null;
        current.dispose();
      }
    };
  }, [imageSrc, textureLoader, uniforms]);

  // Final safety net: release the GPU texture if the mesh unmounts.
  useEffect(() => {
    return () => {
      uniforms.uTexture.value?.dispose();
      uniforms.uTexture.value = null;
    };
  }, [uniforms]);

  useFrame(() => {
    if (document.hidden) return;
    const u = uniforms.uProgress;
    // Reduced-motion bypass (belt-and-braces; the wrapper already renders a
    // static image instead): jump straight to the target, no smoothing.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      // eslint-disable-next-line react-hooks/immutability -- three.js uniform mutation in useFrame is the sanctioned pattern; identity never changes
      u.value = progress;
      return;
    }
    u.value += (progress - u.value) * 0.05;
    if (Math.abs(progress - u.value) < 0.0005) u.value = progress;
  });

  return (
    <mesh ref={meshRef}>
      {/* planeGeometry/shaderMaterial are auto-disposed by R3F on unmount. */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
