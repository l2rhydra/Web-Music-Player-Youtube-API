
import React, { useState } from 'react';
import { Track } from '@/types';

interface MusicCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  isActive?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({ track, onPlay, onAddToQueue, isActive = false }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className={`relative rounded-md overflow-hidden music-card-transition ${
        isActive ? 'ring-2 ring-spotify-accent' : ''
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-square overflow-hidden group">
        <img 
          src={track.thumbnailUrl} 
          alt={`${track.title} by ${track.artist}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div 
          className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            className="bg-spotify-accent rounded-full p-3 transform transition-transform duration-200 hover:scale-110"
            onClick={() => onPlay(track)}
            aria-label={`Play ${track.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
              <polygon points="5 3 19 12 5 21 5 3" fill="white" />
            </svg>
          </button>
          
          <button
            className="bg-spotify-secondary bg-opacity-90 rounded-full p-2 ml-2 transform transition-transform duration-200 hover:scale-110"
            onClick={() => onAddToQueue(track)}
            aria-label={`Add ${track.title} to queue`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-plus">
              <path d="M11 12H3" />
              <path d="M16 6H3" />
              <path d="M16 18H3" />
              <path d="M18 9v6" />
              <path d="M21 12h-6" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-3 bg-spotify-secondary">
        <h3 className="font-medium text-white truncate">{track.title}</h3>
        <p className="text-sm text-spotify-gray truncate">{track.artist}</p>
        <p className="text-xs text-spotify-gray mt-1">{track.duration}</p>
      </div>
    </div>
  );
};

export default MusicCard;
