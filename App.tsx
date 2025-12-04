import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { TreeState } from './types';

export default function App() {
  const [treeState, setTreeState] = useState<TreeState>({
    imageColors: null,
    useImage: false,
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Handler to process uploaded image and extract colors
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create a temporary canvas to read pixel data
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize for performance (we don't need massive resolution for particles)
        const size = 200; 
        canvas.width = size;
        canvas.height = size;
        
        // Draw image flipped vertically because UV coordinates in 3D usually start bottom-left
        ctx.translate(0, size);
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0, size, size);

        const imageData = ctx.getImageData(0, 0, size, size);
        const pixelData = imageData.data;
        
        // We will store colors in a flat Float32Array (r, g, b, r, g, b...)
        // But since we map particles procedurally, we'll actually pass the pixel data
        // and let the Tree component sample it based on UVs.
        // To simplify, we'll just pass the raw pixel data and dimensions to the tree 
        // via a texture or sampled array. 
        // However, for this implementation, let's just pass the raw ImageData object context 
        // isn't easily transferable, so let's use a helper in the Tree component.
        // Instead, we will pass the Image object source to the tree component to create a texture,
        // or we handle sampling here.
        
        // Let's go with the Texture approach in the Tree component for better performance using standard materials,
        // OR manually sampling to set vertex colors. Vertex colors give that "LED" look.
        
        // Let's Sample here to a flat array of normalized RGB values based on UV mapping of the tree.
        // This is complex to pre-calculate without knowing particle positions.
        // Better approach: Pass the image source URL to the Tree component.
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  // Revised approach: pass the data URL string
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <Experience imgUrl={imgUrl} isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>
      
      <Overlay 
        onUpload={(file) => {
          const reader = new FileReader();
          reader.onload = (e) => setImgUrl(e.target?.result as string);
          reader.readAsDataURL(file);
        }}
        isPlaying={isPlaying}
        onToggleAudio={() => setIsPlaying(!isPlaying)}
        hasImage={!!imgUrl}
        onResetImage={() => setImgUrl(null)}
      />
    </div>
  );
}