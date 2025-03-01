
export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoId: string;
  duration: string;
}

export interface PlaylistItem {
  id: string;
  tracks: Track[];
  name: string;
}

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  videoId: string;
  duration: string;
}

export interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeSearchItem {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: YouTubeThumbnail;
      medium: YouTubeThumbnail;
      high: YouTubeThumbnail;
    };
    channelTitle: string;
    publishTime: string;
  };
  contentDetails?: {
    duration: string;
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  queue: Track[];
  history: Track[];
}
