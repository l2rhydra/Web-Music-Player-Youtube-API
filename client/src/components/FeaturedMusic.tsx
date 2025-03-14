
import React from 'react';
import { FEATURED_PLAYLISTS, SAMPLE_TRACKS } from '@/lib/constants';
import MusicCard from '@/components/MusicCard';
import { Track } from '@/types';

interface FeaturedMusicProps {
  onPlayTrack: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  currentTrack: Track | null;
}

const FeaturedMusic: React.FC<FeaturedMusicProps> = ({ 
  onPlayTrack, 
  onAddToQueue,
  currentTrack
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Tracks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Top Tracks</h2>
          <a href="#" className="text-spotify-gray hover:text-white text-sm transition-colors">
            See All
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SAMPLE_TRACKS.map((track) => (
            <MusicCard 
              key={track.id} 
              track={track} 
              onPlay={onPlayTrack} 
              onAddToQueue={onAddToQueue}
              isActive={currentTrack?.id === track.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FeaturedMusic;
