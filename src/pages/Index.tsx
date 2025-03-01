
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import MusicPlayer from '@/components/MusicPlayer';
import FeaturedMusic from '@/components/FeaturedMusic';
import useMediaPlayer from '@/hooks/useMediaPlayer';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { 
    playerState, 
    playTrack, 
    togglePlayPause, 
    setVolume, 
    toggleMute, 
    toggleLoop, 
    addToQueue, 
    playNextTrack, 
    playPreviousTrack 
  } = useMediaPlayer();
  
  const { toast } = useToast();
  
  // Show welcome toast on first load
  useEffect(() => {
    toast({
      title: "Welcome to Soundwave",
      description: "Search for your favorite music or explore our recommendations.",
    });
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-dark to-spotify-surface text-white">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-spotify-dark bg-opacity-80 border-b border-gray-800">
        <div className="container px-4 py-4 mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white mr-8">
              Soundwave
            </h1>
          </div>
          
          <SearchBar 
            onPlayTrack={playTrack} 
            onAddToQueue={addToQueue}
          />
          
          <div>
            {/* Right side of header - can add profile, settings, etc. */}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container px-4 py-8 mx-auto pb-28">
        {/* Welcome section */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Welcome to Soundwave
          </h1>
          <p className="text-lg text-spotify-gray animate-fade-in">
            Discover and enjoy music from around the world
          </p>
        </section>
        
        {/* Featured Music */}
        <FeaturedMusic 
          onPlayTrack={playTrack}
          onAddToQueue={addToQueue}
          currentTrack={playerState.currentTrack}
        />
      </main>
      
      {/* Music Player */}
      <MusicPlayer
        currentTrack={playerState.currentTrack}
        isPlaying={playerState.isPlaying}
        volume={playerState.volume}
        isMuted={playerState.isMuted}
        isLooping={playerState.isLooping}
        queue={playerState.queue}
        onPlayPause={togglePlayPause}
        onNextTrack={playNextTrack}
        onPreviousTrack={playPreviousTrack}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onToggleLoop={toggleLoop}
      />
    </div>
  );
};

export default Index;
