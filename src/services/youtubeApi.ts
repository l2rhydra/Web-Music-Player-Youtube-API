
import { YOUTUBE_API_KEY, YOUTUBE_API_BASE_URL } from '@/lib/constants';
import { SearchResult, YouTubeSearchResponse } from '@/types';

/**
 * Search for tracks on YouTube
 */
export const searchTracks = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];
  
  try {
    // For demo purposes, we'll use a mock implementation with setTimeout
    // In production, you would replace this with actual API calls to YouTube
    const url = `${YOUTUBE_API_BASE_URL}/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;
    
    // For demo, returning mock data instead of actual fetch
    // const response = await fetch(url);
    // const data: YouTubeSearchResponse = await response.json();
    
    // Mock data based on the query
    return await new Promise(resolve => {
      setTimeout(() => {
        // Filter sample data that includes the query
        const results = mockSearchResults.filter(
          result => result.title.toLowerCase().includes(query.toLowerCase()) || 
                  result.artist.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 500);
    });
    
    /* Actual implementation would be:
    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      videoId: item.id.videoId,
      duration: '3:30' // Duration would require another API call to get contentDetails
    }));
    */
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
    
    // For demo, returning mock data
    return await new Promise(resolve => {
      setTimeout(() => {
        const track = mockSearchResults.find(r => r.videoId === videoId);
        resolve(track || null);
      }, 300);
    });
    
    /* Actual implementation:
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items.length === 0) return null;
    
    const item = data.items[0];
    
    return {
      id: item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
      videoId: item.id,
      duration: formatDuration(item.contentDetails.duration)
    };
    */
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

// Mock data for development
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    thumbnailUrl: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543168?q=80&w=2070&auto=format&fit=crop',
    videoId: 'Zi_XfUi4vL0',
    duration: '4:54'
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
    videoId: '4NRXx6U8ABQ',
    duration: '3:20'
  },
  {
    id: '3',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    videoId: 'mrZRURcb1cM',
    duration: '4:14'
  },
  {
    id: '4',
    title: 'Levitating',
    artist: 'Dua Lipa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop',
    videoId: 'TUVcZfQe-Kw',
    duration: '3:23'
  },
  {
    id: '5',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    videoId: 'fJ9rUzIMcZQ',
    duration: '5:54'
  },
  {
    id: '6',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    videoId: 'JGwWNGJdvx8',
    duration: '3:54'
  },
  {
    id: '7',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    thumbnailUrl: 'https://images.unsplash.com/photo-1525362081669-2b476c0f9760?q=80&w=2024&auto=format&fit=crop',
    videoId: 'OPf0YbXqDm0',
    duration: '4:30'
  },
  {
    id: '8',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    thumbnailUrl: 'https://images.unsplash.com/photo-1619983081593-e2ba5b543168?q=80&w=2070&auto=format&fit=crop',
    videoId: 'DyDfgMOUjCI',
    duration: '3:14'
  }
];
