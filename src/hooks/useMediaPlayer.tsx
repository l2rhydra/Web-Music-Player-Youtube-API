import { useState, useRef, useEffect, useCallback } from 'react';
import { PlayerState, Track } from '@/types';
import { useToast } from "@/hooks/use-toast";

const useMediaPlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    isMuted: false,
    isLooping: false,
    queue: [],
    history: []
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set initial volume
      audioRef.current.volume = playerState.volume;
      
      // Add event listeners
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('error', handleAudioError);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.removeEventListener('error', handleAudioError);
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle track changes
  useEffect(() => {
    if (playerState.currentTrack && audioRef.current) {
      // In a real implementation, we would use the YouTube API to get the audio stream
      // For demo purposes, we're using a placeholder URL
      const audioUrl = `https://www.youtube.com/watch?v=${playerState.currentTrack.videoId}`;
      
      // In a real app, we would use a library like youtube-audio-stream or yt-dlp
      // audioRef.current.src = audioUrl;
      
      // For demo, we'll simulate playing audio
      audioRef.current.src = 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg';
      
      if (playerState.isPlaying) {
        const playPromise = audioRef.current.play();
        
        // Handle autoplay restrictions
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Playback prevented:', error);
            setPlayerState(prev => ({ ...prev, isPlaying: false }));
            
            toast({
              title: "Playback Error",
              description: "Please interact with the page to enable audio playback.",
              variant: "destructive"
            });
          });
        }
      }
    }
  }, [playerState.currentTrack]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (playerState.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Playback error:', error);
          setPlayerState(prev => ({ ...prev, isPlaying: false }));
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playerState.isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.isMuted ? 0 : playerState.volume;
    }
  }, [playerState.volume, playerState.isMuted]);
  
  // Handle loop changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = playerState.isLooping;
    }
  }, [playerState.isLooping]);
  
  // Handle track end
  const handleTrackEnd = useCallback(() => {
    if (playerState.isLooping) {
      // If looping, just restart the current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      // Otherwise, play the next track in queue
      playNextTrack();
    }
  }, [playerState.isLooping]);
  
  // Handle audio errors
  const handleAudioError = useCallback((error: Event) => {
    console.error('Audio error:', error);
    toast({
      title: "Playback Error",
      description: "There was an error playing this track. Please try another.",
      variant: "destructive"
    });
    
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  }, []);
  
  // Play a track
  const playTrack = useCallback((track: Track) => {
    setPlayerState(prev => {
      // If there's a current track, add it to history
      const newHistory = prev.currentTrack 
        ? [prev.currentTrack, ...prev.history].slice(0, 20) 
        : [...prev.history];
      
      return {
        ...prev,
        currentTrack: track,
        isPlaying: true,
        history: newHistory
      };
    });
    
    toast({
      title: "Now Playing",
      description: `${track.title} by ${track.artist}`,
    });
  }, []);
  
  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  }, []);
  
  // Set volume
  const setVolume = useCallback((volume: number) => {
    setPlayerState(prev => ({
      ...prev,
      volume: volume,
      isMuted: volume === 0
    }));
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isMuted: !prev.isMuted
    }));
  }, []);
  
  // Toggle loop
  const toggleLoop = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      isLooping: !prev.isLooping
    }));
  }, []);
  
  // Add track to queue
  const addToQueue = useCallback((track: Track) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, track]
    }));
    
    toast({
      title: "Added to Queue",
      description: `${track.title} by ${track.artist}`,
    });
  }, []);
  
  // Play next track
  const playNextTrack = useCallback(() => {
    setPlayerState(prev => {
      if (prev.queue.length === 0) {
        // No more tracks in queue
        return prev;
      }
      
      const [nextTrack, ...remainingQueue] = prev.queue;
      const newHistory = prev.currentTrack 
        ? [prev.currentTrack, ...prev.history].slice(0, 20) 
        : [...prev.history];
      
      return {
        ...prev,
        currentTrack: nextTrack,
        isPlaying: true,
        queue: remainingQueue,
        history: newHistory
      };
    });
  }, []);
  
  // Play previous track
  const playPreviousTrack = useCallback(() => {
    setPlayerState(prev => {
      if (prev.history.length === 0) {
        // No history to go back to
        return prev;
      }
      
      const [previousTrack, ...remainingHistory] = prev.history;
      const newQueue = prev.currentTrack 
        ? [prev.currentTrack, ...prev.queue] 
        : [...prev.queue];
      
      return {
        ...prev,
        currentTrack: previousTrack,
        isPlaying: true,
        queue: newQueue,
        history: remainingHistory
      };
    });
  }, []);
  
  return {
    playerState,
    playTrack,
    togglePlayPause,
    setVolume,
    toggleMute,
    toggleLoop,
    addToQueue,
    playNextTrack,
    playPreviousTrack
  };
};

export default useMediaPlayer;
