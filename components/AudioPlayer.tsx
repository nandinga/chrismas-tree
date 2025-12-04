import React, { useEffect, useRef } from 'react';

// A classic public domain or creative commons Christmas tune
// "Jingle Bells" Instrumental
const CHRISTMAS_MUSIC_URL = "https://actions.google.com/sounds/v1/holidays/jingle_bells.ogg";

interface AudioPlayerProps {
  isPlaying: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <audio 
      ref={audioRef} 
      src={CHRISTMAS_MUSIC_URL} 
      loop 
      preload="auto"
      onEnded={() => {
        if(isPlaying && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
      }}
    />
  );
};