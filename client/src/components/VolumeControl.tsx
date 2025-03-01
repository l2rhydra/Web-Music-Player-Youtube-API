
import React, { useRef, useState } from 'react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ 
  volume, 
  isMuted, 
  onVolumeChange, 
  onToggleMute 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  
  const effectiveVolume = isMuted ? 0 : volume;
  
  // Determine which volume icon to show
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-x">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" x2="17" y1="9" y2="15" />
          <line x1="17" x2="23" y1="9" y2="15" />
        </svg>
      );
    } else if (volume <= 0.5) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-1">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    }
  };
  
  return (
    <div 
      className="flex items-center space-x-2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button 
        className="player-control-button focus:outline-none"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </button>
      
      <div className={`w-20 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-70'}`}>
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
          style={{
            background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${effectiveVolume * 100}%, #4D4D4D ${effectiveVolume * 100}%, #4D4D4D 100%)`
          }}
          aria-label="Volume Control"
        />
      </div>
    </div>
  );
};

export default VolumeControl;
