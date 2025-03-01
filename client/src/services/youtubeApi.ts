import { YOUTUBE_API_KEY, YOUTUBE_API_BASE_URL } from '@/lib/constants';
import { SearchResult, YouTubeSearchResponse } from '@/types';

/**
 * Search for tracks on YouTube
 */
export const searchTracks = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  try {
    // Step 1: Search for videos
    const searchUrl = `${YOUTUBE_API_BASE_URL}/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchData: YouTubeSearchResponse = await searchResponse.json();

    // Extract video IDs
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    if (!videoIds) return [];

    // Step 2: Fetch video details (including duration)
    const videoUrl = `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    const videoResponse = await fetch(videoUrl);
    const videoData: any = await videoResponse.json();

    // Map search results with duration
    return searchData.items.map(item => {
      const videoDetails = videoData.items.find((v: any) => v.id === item.id.videoId);
      const duration = videoDetails ? formatDuration(videoDetails.contentDetails.duration) : 'N/A';

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        videoId: item.id.videoId,
        duration: duration,
      };
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    return [];
  }
};

/**
 * Get track details
 */
export const getTrackDetails = async (videoId: string) => {
  try {
    const url = `${YOUTUBE_API_BASE_URL}/videos?part=contentDetails,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.items.length) return null;
    
    const item = data.items[0];
    console.log(item.contentDetails);
    return {
      id: item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      videoId: item.id,
      duration: formatDuration(item.contentDetails.duration)
    };
  } catch (error) {
    console.error('Error getting track details:', error);
    return null;
  }
};

/**
 * Format ISO 8601 duration to mm:ss
 */
const formatDuration = (isoDuration: string): string => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = match && match[1] ? parseInt(match[1]) : 0;
  const minutes = match && match[2] ? parseInt(match[2]) : 0;
  const seconds = match && match[3] ? parseInt(match[3]) : 0;
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours}:`;
    result += `${minutes.toString().padStart(2, '0')}:`;
  } else {
    result += `${minutes}:`;
  }
  
  result += seconds.toString().padStart(2, '0');
  
  return result;
};
