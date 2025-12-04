import React from 'react';
import { Upload, Music, Volume2, RefreshCw, X, Gift } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

interface OverlayProps {
  onUpload: (file: File) => void;
  isPlaying: boolean;
  onToggleAudio: () => void;
  hasImage: boolean;
  onResetImage: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ 
  onUpload, 
  isPlaying, 
  onToggleAudio, 
  hasImage,
  onResetImage
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      {/* Header */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-lg">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 via-green-400 to-red-500 bg-clip-text text-transparent animate-pulse">
            Merry Christmas
          </h1>
          <p className="text-xs text-slate-300 mt-1">Interactive Particle Tree</p>
        </div>

        <div className="flex gap-2">
           <button 
            onClick={onToggleAudio}
            className={`p-3 rounded-full border transition-all duration-300 ${
              isPlaying 
                ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]' 
                : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isPlaying ? <Volume2 size={20} /> : <Music size={20} />}
          </button>
        </div>
      </header>

      {/* Main Controls */}
      <div className="pointer-events-auto flex flex-col items-center gap-4 self-center mb-8">
        
        {/* Upload Control */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-xs transition-all hover:border-white/20">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h3 className="text-white font-medium flex items-center gap-2 justify-center">
                <Gift size={16} className="text-red-400" />
                Customize Tree
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Upload a photo to tint the lights with your memories.
              </p>
            </div>

            {hasImage ? (
              <div className="flex gap-2 w-full">
                <button 
                  onClick={onResetImage}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/50 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X size={14} /> Remove
                </button>
                <label className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50">
                  <RefreshCw size={14} /> Change
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if(e.target.files?.[0]) onUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            ) : (
              <label className="w-full cursor-pointer group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2">
                <Upload size={18} className="group-hover:scale-110 transition-transform" />
                <span>Upload Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if(e.target.files?.[0]) onUpload(e.target.files[0]);
                  }}
                />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </label>
            )}
          </div>
        </div>
        
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
          Drag to rotate • Scroll to zoom
        </p>
      </div>

      <div className="hidden">
         <AudioPlayer isPlaying={isPlaying} />
      </div>
    </div>
  );
};