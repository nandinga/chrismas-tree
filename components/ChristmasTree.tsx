import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChristmasTreeProps {
  imgUrl: string | null;
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ imgUrl }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);
  
  // Configuration
  const particleCount = 4000;
  const height = 6;
  const radius = 2.5;
  const spirals = 8; // Number of times the spiral wraps around

  // Generate Base Geometry
  const { positions, uvs, initialColors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const uvs = new Float32Array(particleCount * 2);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#105e26'); // Dark Green
    const color2 = new THREE.Color('#38b000'); // Bright Green
    const gold = new THREE.Color('#ffd700');
    const red = new THREE.Color('#ff0000');

    for (let i = 0; i < particleCount; i++) {
      // Normalized height (0 at bottom, 1 at top)
      // We bias random slightly towards bottom for volume
      const yNorm = 1 - Math.pow(Math.random(), 0.8); 
      const y = yNorm * height;

      // Radius at this height (cone shape)
      const r = (1 - yNorm) * radius;

      // Spiral angle + random jitter for volume
      const angle = yNorm * Math.PI * 2 * spirals + (Math.random() * Math.PI * 2);
      
      // Add some thickness to the shell
      const thickness = Math.random() * 0.3;
      const finalR = r - thickness;

      const x = Math.cos(angle) * finalR;
      const z = Math.sin(angle) * finalR;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // UV Mapping: x=angle normalized, y=height normalized
      // This allows wrapping an image around the cone
      // Normalize angle to 0-1 range for U
      let u = (angle % (Math.PI * 2)) / (Math.PI * 2);
      if (u < 0) u += 1;
      
      uvs[i * 2] = u;
      uvs[i * 2 + 1] = yNorm;

      // Default coloring logic
      const isOrnament = Math.random() > 0.92;
      let c = color1.clone().lerp(color2, Math.random());
      
      if (isOrnament) {
        c = Math.random() > 0.5 ? gold : red;
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, uvs, initialColors: colors };
  }, []);

  // Handle Image Sampling for Custom Colors
  const [currentColors, setCurrentColors] = useState<Float32Array>(initialColors);

  useEffect(() => {
    if (!imgUrl) {
      setCurrentColors(initialColors);
      return;
    }

    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 128; // Low res is fine for particles
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Flip vertically for correct UV mapping direction
      ctx.translate(0, size);
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, 0, size, size);

      const data = ctx.getImageData(0, 0, size, size).data;
      const newColors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const u = uvs[i * 2];
        const v = uvs[i * 2 + 1];

        const px = Math.floor(u * (size - 1));
        const py = Math.floor(v * (size - 1));
        const idx = (py * size + px) * 4;

        // Mix image color with a bit of emission brightness
        newColors[i * 3] = data[idx] / 255;
        newColors[i * 3 + 1] = data[idx + 1] / 255;
        newColors[i * 3 + 2] = data[idx + 2] / 255;
      }
      setCurrentColors(newColors);
    };
  }, [imgUrl, initialColors, uvs]);

  // Update geometry colors when state changes
  useEffect(() => {
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.color.array.set(currentColors);
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
    // Also update glow/ghost tree if we wanted
  }, [currentColors]);


  // Animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Subtle pulse
      const scale = 1 + Math.sin(t * 2) * 0.01;
      pointsRef.current.scale.set(scale, scale, scale);
      // Gentle Rotation
      pointsRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group>
      {/* Main Particle Tree */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={currentColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Top Star */}
      <mesh position={[0, height + 0.1, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshBasicMaterial color="#ffffaa" />
        <pointLight intensity={1} distance={3} color="#ffff00" />
      </mesh>
    </group>
  );
};