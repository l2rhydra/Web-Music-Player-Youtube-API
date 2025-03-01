
import React, { useState, useEffect } from 'react';
import { Track } from '@/types';
import VolumeControl from './VolumeControl';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  queue: Track[];
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleLoop: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  volume,
  isMuted,
  isLooping,
  queue,
  onPlayPause,
  onNextTrack,
  onPreviousTrack,
  onVolumeChange,
  onToggleMute,
  onToggleLoop
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [showQueue, setShowQueue] = useState(false);
  
  // Simulate progress update
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 0;
          }
          return prev + 0.5;
        });
        
        // Update current time display
        const duration = parseDuration(currentTrack.duration);
        const current = Math.floor((progress / 100) * duration);
        setCurrentTime(formatTime(current));
        
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, progress, currentTrack]);
  
  // Reset progress when track changes
  useEffect(() => {
    setProgress(0);
    setCurrentTime('0:00');
  }, [currentTrack]);
  
  // Parse duration string (mm:ss) to seconds
  const parseDuration = (duration: string): number => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    return 0;
  };
  
  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    
    setProgress(percentage);
    
    // Update current time display
    const duration = parseDuration(currentTrack.duration);
    const current = Math.floor((percentage / 100) * duration);
    setCurrentTime(formatTime(current));
  };
  
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-spotify-dark bg-opacity-95 backdrop-blur-md p-4 text-center text-spotify-gray border-t border-gray-800 animate-slide-up">
        <p>Select a track to start playing</p>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-player border-t border-gray-800 p-3 px-4 animate-slide-up z-10">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center space-x-3 w-1/4">
          <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 animate-scale-in">
            <img 
              src={currentTrack.thumbnailUrl} 
              alt={currentTrack.title} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{currentTrack.title}</h4>
            <p className="text-xs text-spotify-gray truncate">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Player Controls */}
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          {/* Control buttons */}
          <div className="flex items-center justify-center space-x-4 mb-2">
            <button 
              className="player-control-button"
              onClick={onPreviousTrack}
              disabled={!currentTrack}
              aria-label="Previous track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-back">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" x2="5" y1="19" y2="5" />
              </svg>
            </button>
            
            <button 
              className="player-control-button bg-white text-black p-2 rounded-full hover:scale-105 transition-transform"
              onClick={onPlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause">
                  <rect width="4" height="16" x="6" y="4" />
                  <rect width="4" height="16" x="14" y="4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            
            <button 
              className="player-control-button"
              onClick={onNextTrack}
              disabled={!currentTrack}
              aria-label="Next track"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-forward">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" x2="19" y1="5" y2="19" />
              </svg>
            </button>
            
            <button 
              className={`player-control-button ${isLooping ? 'text-spotify-accent' : ''}`}
              onClick={onToggleLoop}
              aria-label={isLooping ? "Disable loop" : "Enable loop"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat">
                <path d="m17 2 4 4-4 4" />
                <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                <path d="m7 22-4-4 4-4" />
                <path d="M21 13v1a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-2">
            <span className="text-xs text-spotify-gray w-10 text-right">{currentTime}</span>
            <div 
              className="h-1 bg-gray-600 rounded-full flex-1 cursor-pointer"
              
            >
              <div 
                className="h-full bg-spotify-accent rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs text-spotify-gray w-10">{currentTrack.duration}</span>
          </div>
        </div>
        
        {/* Volume and Queue Controls */}
        <div className="flex items-center justify-end space-x-3 w-1/4">
          <button 
            className={`player-control-button ${showQueue ? 'text-spotify-accent' : ''}`}
            onClick={() => setShowQueue(!showQueue)}
            aria-label={showQueue ? "Hide queue" : "Show queue"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-music">
              <path d="M12 18V6" />
              <path d="M8 14h8" />
              <path d="M8 10h8" />
              <path d="M20 4v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4" />
            </svg>
          </button>
          
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
        </div>
      </div>
      
      {/* Queue Dropdown */}
      {showQueue && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-player-light rounded-md shadow-lg overflow-hidden animate-scale-in z-20">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Queue</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {queue.length > 0 ? (
              queue.map((track, index) => (
                <div key={`${track.id}-${index}`} className="flex items-center p-2 hover:bg-gray-700">
                  <div className="h-10 w-10 mr-3 flex-shrink-0">
                    <img 
                      src={track.thumbnailUrl} 
                      alt={track.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm text-white truncate">{track.title}</h4>
                    <p className="text-xs text-spotify-gray truncate">{track.artist}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-spotify-gray">
                Your queue is empty
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
