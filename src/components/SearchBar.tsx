
import React, { useState, useEffect, useRef } from 'react';
import { searchTracks } from '@/services/youtubeApi';
import { SearchResult, Track } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  onPlayTrack: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPlayTrack, onAddToQueue }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);
  
  // Save recent searches to localStorage
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const newRecentSearches = [
      searchTerm,
      ...recentSearches.filter(term => term !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  };
  
  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim()) {
      setIsLoading(true);
      setIsDropdownOpen(true);
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchTracks(query);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          toast({
            title: "Search Error",
            description: "There was an error searching for tracks.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  // Handle search result selection
  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(result.title);
    onPlayTrack(result);
    setIsDropdownOpen(false);
  };
  
  // Handle recent search selection
  const handleSelectRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };
  
  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };
  
  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists..."
          className="w-full px-4 py-2 pl-10 bg-spotify-secondary bg-opacity-70 text-white rounded-full border border-transparent focus:border-spotify-accent focus:outline-none transition-all"
          onFocus={() => query.trim() && setIsDropdownOpen(true)}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-gray">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        {query && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spotify-gray hover:text-white transition-colors"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-20 w-full mt-2 bg-spotify-secondary rounded-md shadow-lg overflow-hidden animate-scale-in origin-top">
          {isLoading ? (
            <div className="p-4 text-center text-spotify-gray">
              <div className="inline-block animate-pulse">Searching...</div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="search-result-item flex items-center"
                  onClick={() => handleSelectResult(result)}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden mr-3">
                    <img 
                      src={result.thumbnailUrl} 
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">{result.title}</h4>
                    <p className="text-spotify-gray text-xs truncate">{result.artist}</p>
                  </div>
                  <div className="flex-shrink-0 flex space-x-1">
                    <button
                      className="text-spotify-gray hover:text-spotify-accent p-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack(result);
                      }}
                      aria-label={`Play ${result.title}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                    <button
                      className="text-spotify-gray hover:text-spotify-accent p-1 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToQueue(result);
                      }}
                      aria-label={`Add ${result.title} to queue`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-plus">
                        <path d="M11 12H3" />
                        <path d="M16 6H3" />
                        <path d="M16 18H3" />
                        <path d="M18 9v6" />
                        <path d="M21 12h-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-spotify-gray">
              No results found for "{query}"
            </div>
          ) : recentSearches.length > 0 ? (
            <div>
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <h3 className="text-sm font-medium text-white">Recent Searches</h3>
                <button
                  className="text-xs text-spotify-gray hover:text-white"
                  onClick={clearRecentSearches}
                >
                  Clear All
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleSelectRecentSearch(term)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-spotify-gray">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <span className="text-sm text-white">{term}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-spotify-gray">
              Start typing to search for music
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
