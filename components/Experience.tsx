import React from 'react';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import { ChristmasTree } from './ChristmasTree';
import { Snow } from './Snow';

interface ExperienceProps {
  imgUrl: string | null;
  isPlaying: boolean;
}

export const Experience: React.FC<ExperienceProps> = ({ imgUrl, isPlaying }) => {
  return (
    <>
      <color attach="background" args={['#050b14']} />
      
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff0000" />
      <pointLight position={[0, -5, 5]} intensity={0.5} color="#00ff00" />

      {/* Controls */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={4}
        maxDistance={15}
        autoRotate={isPlaying}
        autoRotateSpeed={0.5}
      />

      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Snow />
      
      {/* Main Object */}
      <group position={[0, -2.5, 0]}>
        <ChristmasTree imgUrl={imgUrl} />
        {/* Floor Reflection Hint */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <circleGeometry args={[4, 32]} />
          <meshBasicMaterial color="#000" opacity={0.5} transparent />
        </mesh>
      </group>

      <Sparkles count={50} scale={8} size={4} speed={0.4} opacity={0.5} color="#ffd700" />
    </>
  );
};