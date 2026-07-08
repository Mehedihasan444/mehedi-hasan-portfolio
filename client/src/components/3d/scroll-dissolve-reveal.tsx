"use client";

import { useRef, useMemo } from "react";
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
  className?: string;
}

export function ScrollDissolveReveal({ imageSrc, progress }: ScrollDissolveRevealProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniformsRef = useRef({
    uTexture: { value: null as THREE.Texture | null },
    uProgress: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  });

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  useMemo(() => {
    textureLoader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      uniformsRef.current.uTexture.value = texture;
    });
  }, [imageSrc, textureLoader]);

  useFrame(() => {
    uniformsRef.current.uProgress.value += (progress - uniformsRef.current.uProgress.value) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
