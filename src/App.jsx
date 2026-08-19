import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import Library from './components/Library';
import Player from './components/Player';
import Visualizer from './components/Visualizer';
import { Menu, Music, Sparkles, Heart, Shuffle, SkipBack, Pause, Play, SkipForward, Repeat, Zap, RotateCw, X } from 'lucide-react';
import './App.css';

// Fallback initial commercial tracks
const PRELOADED_TRACKS = [
  {
    id: 'track-kesariya',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam, Amitabh Bhattacharya',
    album: 'Brahmastra',
    duration: '4:28',
    coverUrl: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
    category: 'chill',
    language: 'hindi'
  },
  {
    id: 'track-apna-bana-le',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar, Amitabh Bhattacharya',
    album: 'Bhediya',
    duration: '4:21',
    coverUrl: 'https://c.saavncdn.com/675/Trending-Love-Songs-Hindi-2026-20260506185328-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/675/1456dc2903d0fb4465d2d2904008803b_320.mp4',
    category: 'chill',
    language: 'hindi'
  },
  {
    id: 'track-heat-waves',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    duration: '3:59',
    coverUrl: 'https://c.saavncdn.com/923/HASHTAG-TRENDING-English-2026-20260501024422-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/923/f744fbf9cfd9f61ca6d4d239e3be34de_320.mp4',
    category: 'synthwave',
    language: 'english'
  },
  {
    id: 'track-kahani-suno',
    title: 'Kahani Suno 2.0',
    artist: 'Kaifi Khalil',
    album: 'Kahani Suno',
    duration: '2:53',
    coverUrl: 'https://c.saavncdn.com/232/Kahani-Suno-2-0-Urdu-2022-20221223190827-500x500.jpg',
    audioUrl: 'https://aac.saavncdn.com/232/08f7db0101b0f5b1d428b4d8ab38ccb3_320.mp4',
    category: 'chill',
    language: 'hindi'
  }
];

const LANGUAGE_QUERIES = {
  hindi: [
    "arijit singh hits", "pritam hits", "hindi lofi", "hindi sad songs", 
    "hindi romantic", "bramhastra hits", "amitabh bhattacharya", "atif aslam hits", 
    "jubin nautiyal hits", "lofi hindi", "shreya ghoshal hindi hits", "mohit chauhan hits", 
    "kishore kumar hindi hits", "lata mangeshkar hindi hits", "kumarsanu hits", "sonu nigam hits", 
    "badshah rap hits", "udit narayan romantic hits"
  ],
  english: [
    "taylor swift hits", "weeknd blinding lights", "english pop hits", "ed sheeran divide", 
    "english lofi", "glass animals dreamland", "post malone", "bruno mars hits", 
    "billie eilish", "coldplay hits", "dua lipa pop", "justin bieber hits", 
    "drake rap hits", "maroon 5 hits", "eminem rap hits", "rihanna classics"
  ],
  bengali: [
    "rabindra sangeet hits", "bengali pop hits", "anupam roy hits", "bengali romantic hits", 
    "arijit singh bengali", "bengali lofi", "shreya ghoshal bengali", "nachiketa hits", 
    "fossils bengali band", "cactus bengali band", "manna dey bengali hits", "hemanta mukherjee classics"
  ],
  tamil: [
    "anirudh ravichander hits", "ar rahman tamil", "tamil melody hits", "tamil romantic hits", 
    "tamil dance hits", "tamil lofi", "yuvan shankar raja", "harris jayaraj hits", 
    "sp balasubrahmanyam tamil", "dhanush hits", "sid sriram tamil"
  ],
  telugu: [
    "dsp telugu hits", "ar rahman telugu", "telugu melody hits", "telugu romantic hits", 
    "telugu latest hits", "sid sriram telugu", "thaman s hits", "devi sri prasad hits", 
    "sp balasubrahmanyam telugu"
  ],
  bhojpuri: [
    "khesari lal yadav", "pawan singh hits", "shilpi raj bhojpuri", "bhojpuri hits", 
    "bhojpuri dance", "bhojpuri folk", "bhojpuri sad songs", "bhojpuri romantic hits"
  ]
};

const cleanSongTitle = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\(.*\)/g, '')
    .replace(/\[.*\]/g, '')
    .split('-')[0]
    .replace(/[^a-z0-9]/g, '')
    .trim();
};

const deduplicateTracks = (trackList) => {
  const unique = [];
  for (const track of trackList) {
    const cleanT = cleanSongTitle(track.title);
    const isDuplicate = unique.some(t => 
      t.id === track.id || cleanSongTitle(t.title) === cleanT
    );
    if (!isDuplicate) {
      unique.push(track);
    }
  }
  return unique;
};

export default function App() {
  // Navigation & UI state with history stack for < > arrows
  const [activeTab, setActiveTab] = useState('home');
  const [navHistory, setNavHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Online search API states
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dynamic language & refresh states
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffleActive, setShuffleActive] = useState(false);
  const [repeatActive, setRepeatActive] = useState(false);

  // Playback queue tracking
  const [tracks, setTracks] = useState(PRELOADED_TRACKS);
  const [playbackQueue, setPlaybackQueue] = useState(PRELOADED_TRACKS);
  const [playedHistoryQueue, setPlayedHistoryQueue] = useState([]);

  // User Library states (synced to localStorage)
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    try {
      const saved = localStorage.getItem('mv_liked_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('mv_playlists');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  // Audio Ref
  const audioRef = useRef(null);

  // Bass Boost & Web Audio States
  const [bassBoostActive, setBassBoostActive] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const bassFilterRef = useRef(null);

  // Navigation History management
  const navigateToTab = (newTab) => {
    if (newTab === activeTab) return;
    const newHistory = navHistory.slice(0, historyIndex + 1);
    newHistory.push(newTab);
    setNavHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setActiveTab(newTab);
  };

  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setActiveTab(navHistory[newIndex]);
    }
  };

  const handleNavigateForward = () => {
    if (historyIndex < navHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setActiveTab(navHistory[newIndex]);
    }
  };

  const initAudioGraph = () => {
    if (audioContextRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowshelf';
      filter.frequency.value = 150;
      filter.gain.value = bassBoostActive ? 6.5 : 0;
      bassFilterRef.current = filter;

      const audio = audioRef.current;
      if (audio && !audio.dataset.audioConnected) {
        const source = audioCtx.createMediaElementSource(audio);
        const compressor = audioCtx.createDynamicsCompressor();
        
        compressor.threshold.setValueAtTime(-2.0, audioCtx.currentTime);
        compressor.knee.setValueAtTime(30, audioCtx.currentTime);
        compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
        compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
        compressor.release.setValueAtTime(0.15, audioCtx.currentTime);

        source.connect(filter);
        filter.connect(analyser);
        analyser.connect(compressor);
        compressor.connect(audioCtx.destination);
        audio.dataset.audioConnected = "true";
      }
    } catch (err) {
      console.warn('Failed to initialize Audio Graph:', err.message);
    }
  };

  useEffect(() => {
    if (bassFilterRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      bassFilterRef.current.gain.setTargetAtTime(bassBoostActive ? 6.5 : 0, now, 0.08);
    }
  }, [bassBoostActive]);

  // Live search debouncing for online API
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`https://jiosaavn-api-private.vercel.app/search/songs?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        if (data.status === 'Success' && data.data && data.data.results) {
          const formatDuration = (sec) => {
            if (!sec) return '3:20';
            const minutes = Math.floor(sec / 60);
            const seconds = Math.floor(sec % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          };

          const mapped = data.data.results.map(song => {
            const coverUrl = song.image && song.image.length > 0 
              ? song.image[song.image.length - 1].link 
              : '/assets/synthwave_city_midnight.png';

            const audioUrl = song.download_url && song.download_url.length > 0
              ? song.download_url[song.download_url.length - 1].link
              : '';

            return {
              id: `track-online-${song.id}`,
              title: song.name,
              artist: song.subtitle.split(' - ')[0] || 'Unknown Artist',
              album: song.album || 'Online Stream',
              duration: formatDuration(song.duration),
              coverUrl: coverUrl,
              audioUrl: audioUrl,
              category: 'chill',
              language: song.language
            };
          });
          setSearchResults(mapped);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Save Liked Tracks & Playlists to localStorage
  useEffect(() => {
    localStorage.setItem('mv_liked_tracks', JSON.stringify(likedTrackIds));
  }, [likedTrackIds]);

  useEffect(() => {
    localStorage.setItem('mv_playlists', JSON.stringify(playlists));
  }, [playlists]);

  // Fetch online trending catalog
  const fetchHomeCatalog = async (lang, isRefresh = false) => {
    setIsRefreshing(true);
    try {
      const queries = LANGUAGE_QUERIES[lang] || LANGUAGE_QUERIES['hindi'];
      const shuffledQueries = [...queries].sort(() => Math.random() - 0.5);
      const selectedQueries = shuffledQueries.slice(0, 3);
      const randomPage = Math.floor(Math.random() * 4) + 1;
      
      const fetchPromises = selectedQueries.map(async (query) => {
        try {
          const response = await fetch(`https://jiosaavn-api-private.vercel.app/search/songs?q=${encodeURIComponent(query)}&page=${randomPage}&limit=12`);
          if (!response.ok) return [];
          const data = await response.json();
          if (data.status === 'Success' && data.data && data.data.results) {
            return data.data.results;
          }
        } catch (err) {
          console.error(`Failed to fetch query: ${query}`, err);
        }
        return [];
      });
      
      const resultsArray = await Promise.all(fetchPromises);
      const allResults = resultsArray.flat();
      
      if (allResults.length > 0) {
        const formatDuration = (sec) => {
          if (!sec) return '3:20';
          const minutes = Math.floor(sec / 60);
          const seconds = Math.floor(sec % 60);
          return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        const targetLang = lang.toLowerCase().trim();

        const mapped = allResults
          .map((song, idx) => {
            const coverUrl = song.image && song.image.length > 0 
              ? song.image[song.image.length - 1].link 
              : '/assets/synthwave_city_midnight.png';

            const audioUrl = song.download_url && song.download_url.length > 0
              ? song.download_url[song.download_url.length - 1].link
              : '';

            return {
              id: `track-online-${song.id}`,
              title: song.name,
              artist: song.subtitle.split(' - ')[0] || 'Unknown Artist',
              album: song.album || 'Online Stream',
              duration: formatDuration(song.duration),
              coverUrl: coverUrl,
              audioUrl: audioUrl,
              category: 'chill',
              language: song.language
            };
          })
          .filter(song => {
            const songLang = (song.language || '').toLowerCase().trim();
            if (songLang && songLang !== targetLang) return false;
            return true;
          });

        const uniqueMapped = deduplicateTracks(mapped);
        const shuffledMapped = uniqueMapped.sort(() => Math.random() - 0.5);
        
        if (shuffledMapped.length > 0) {
          setTracks(shuffledMapped);
          if (!currentTrack) {
            setPlaybackQueue(shuffledMapped);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load online hits:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeCatalog('hindi');
  }, []);

  // Audio element management
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack) {
      const wasPlaying = isPlaying;
      audio.src = currentTrack.audioUrl;
      audio.load();
      
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album,
          artwork: [{ src: currentTrack.coverUrl, sizes: '512x512', type: 'image/png' }]
        });
      }

      if (wasPlaying || isPlaying) {
        initAudioGraph();
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    } else {
      audio.src = '';
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      initAudioGraph();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnded = () => {
    if (repeatActive) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    } else {
      handleNextTrack();
    }
  };

  const handlePlayPause = () => {
    if (!currentTrack) {
      if (tracks.length > 0) {
        setCurrentTrack(tracks[0]);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlayTrack = (track) => {
    if (currentTrack && currentTrack.id !== track.id) {
      setPlayedHistoryQueue(prev => {
        if (prev.length > 0 && prev[prev.length - 1].id === currentTrack.id) return prev;
        return [...prev, currentTrack];
      });
    }

    let queue = tracks;
    if (!tracks.some(t => t.id === track.id)) {
      const updatedTracks = [track, ...tracks];
      setTracks(updatedTracks);
      queue = updatedTracks;
    }

    const clickedIdx = queue.findIndex(t => t.id === track.id);
    const upcoming = clickedIdx !== -1 ? queue.slice(clickedIdx + 1) : queue.filter(t => t.id !== track.id);

    setPlaybackQueue(upcoming);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    if (playbackQueue.length === 0) {
      if (tracks.length > 0) {
        setCurrentTrack(tracks[0]);
        setIsPlaying(true);
      }
      return;
    }
    
    let nextTrack;
    let newQueue;
    
    if (shuffleActive) {
      const randomIndex = Math.floor(Math.random() * playbackQueue.length);
      nextTrack = playbackQueue[randomIndex];
      newQueue = playbackQueue.filter((_, idx) => idx !== randomIndex);
    } else {
      nextTrack = playbackQueue[0];
      newQueue = playbackQueue.slice(1);
    }
    
    if (currentTrack) {
      setPlayedHistoryQueue(prev => {
        if (prev.length > 0 && prev[prev.length - 1].id === currentTrack.id) return prev;
        return [...prev, currentTrack];
      });
    }
    
    setPlaybackQueue(newQueue);
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (playedHistoryQueue.length === 0) return;
    
    const prevTrack = playedHistoryQueue[playedHistoryQueue.length - 1];
    const newHistory = playedHistoryQueue.slice(0, playedHistoryQueue.length - 1);
    
    if (currentTrack) {
      setPlaybackQueue(prev => [currentTrack, ...prev]);
    }
    
    setPlayedHistoryQueue(newHistory);
    setCurrentTrack(prevTrack);
    setIsPlaying(true);
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    if (newVol > 0) setMuted(false);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleToggleLike = (trackId) => {
    setLikedTrackIds(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId) 
        : [...prev, trackId]
    );
  };

  const handleCreatePlaylist = (playlistName) => {
    const newPlaylist = {
      id: `pl-${Date.now()}`,
      name: playlistName,
      trackIds: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const handleAddTrackToPlaylist = (trackId, playlistId) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        const isAlreadyIn = pl.trackIds.includes(trackId);
        return {
          ...pl,
          trackIds: isAlreadyIn 
            ? pl.trackIds.filter(id => id !== trackId)
            : [...pl.trackIds, trackId]
        };
      }
      return pl;
    }));
  };

  const handleDeletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      navigateToTab('home');
    }
  };

  const handleUploadTrack = (file) => {
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    const parts = nameWithoutExt.split(" - ");
    const title = parts[1] || parts[0];
    const artist = parts[0] && parts[1] ? parts[0] : "Local Upload";
    const blobUrl = URL.createObjectURL(file);

    const newTrack = {
      id: `track-local-${Date.now()}`,
      title: title.slice(0, 40),
      artist: artist.slice(0, 40),
      album: "Local Device File",
      duration: "3:30",
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      audioUrl: blobUrl,
      category: 'chill',
      language: selectedLanguage
    };

    setTracks(prev => [newTrack, ...prev]);
    setCurrentTrack(newTrack);
    setIsPlaying(true);
  };

  const handleArtistClick = (artistName) => {
    setSearchQuery(artistName);
    navigateToTab('search');
  };

  return (
    <div id="root-app-layout">
      {/* Hidden Native Audio Element */}
      <audio 
        ref={audioRef}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
      />

      {/* Mobile Header Bar */}
      <header className="mobile-app-header">
        <button 
          className="interactive-btn mobile-menu-btn"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="mobile-brand-title font-display">
          <Music size={18} className="cyan-text" />
          <span>OMusic</span>
        </div>
        <div style={{ width: 22 }}></div>
      </header>

      {/* Main 3-Column macOS Window Layout */}
      <div className="app-main-window-container">
        {/* Left Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={navigateToTab}
          playlists={playlists}
          onCreatePlaylist={handleCreatePlaylist}
          onSelectPlaylist={setSelectedPlaylistId}
          selectedPlaylistId={selectedPlaylistId}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onUploadTrack={handleUploadTrack}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onDeletePlaylist={handleDeletePlaylist}
        />

        {/* Center Main Content */}
        <main className="center-content-panel">
          {showVisualizer ? (
            <div className="visualizer-fullscreen-overlay">
              <div className="visualizer-fullscreen-header">
                <div className="v-header-title">
                  <Sparkles size={16} className="cyan-text" />
                  <span className="font-display">NOW PLAYING SPECTRUM</span>
                </div>
                <button 
                  className="interactive-btn close-visualizer-btn"
                  onClick={() => setShowVisualizer(false)}
                >
                  <X size={18} />
                  <span>Close</span>
                </button>
              </div>

              <div className="visualizer-fullscreen-body">
                <div className="v-spectrum-box">
                  <Visualizer analyser={analyserRef.current} isPlaying={isPlaying} />
                </div>
                {currentTrack && (
                  <div className="v-track-meta">
                    <img src={currentTrack.coverUrl} alt={currentTrack.title} className="v-track-cover" />
                    <h2 className="v-track-title font-display">{currentTrack.title}</h2>
                    <span className="v-track-artist">{currentTrack.artist}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Library 
              activeTab={activeTab}
              setActiveTab={navigateToTab}
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              likedTrackIds={likedTrackIds}
              playlists={playlists}
              selectedPlaylistId={selectedPlaylistId}
              onPlayTrack={handlePlayTrack}
              onToggleLike={handleToggleLike}
              onAddTrackToPlaylist={handleAddTrackToPlaylist}
              onDeletePlaylist={handleDeletePlaylist}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              onArtistClick={handleArtistClick}
              selectedLanguage={selectedLanguage}
              onLanguageChange={(lang) => {
                setSelectedLanguage(lang);
                fetchHomeCatalog(lang);
              }}
              onRefreshHome={() => fetchHomeCatalog(selectedLanguage, true)}
              isRefreshing={isRefreshing}
              onNavigateBack={handleNavigateBack}
              onNavigateForward={handleNavigateForward}
              canGoBack={historyIndex > 0}
              canGoForward={historyIndex < navHistory.length - 1}
            />
          )}
        </main>

        {/* Right Sidebar with Top Artist & Mini Player Card */}
        <RightSidebar 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          volume={volume}
          muted={muted}
          progress={progress}
          duration={duration}
          shuffleActive={shuffleActive}
          repeatActive={repeatActive}
          likedTrackIds={likedTrackIds}
          onPlayPause={handlePlayPause}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onToggleShuffle={() => setShuffleActive(!shuffleActive)}
          onToggleRepeat={() => setRepeatActive(!repeatActive)}
          onToggleLike={handleToggleLike}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
          onToggleMute={handleToggleMute}
          showVisualizer={showVisualizer}
          setShowVisualizer={setShowVisualizer}
          bassBoostActive={bassBoostActive}
          onToggleBassBoost={() => setBassBoostActive(!bassBoostActive)}
          onArtistClick={handleArtistClick}
          onViewAllArtists={() => navigateToTab('artists')}
        />
      </div>

      {/* Responsive Bottom Player Bar (For Mobile/Small Screen fallback) */}
      <Player 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        muted={muted}
        progress={progress}
        duration={duration}
        shuffleActive={shuffleActive}
        repeatActive={repeatActive}
        likedTrackIds={likedTrackIds}
        onPlayPause={handlePlayPause}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onToggleShuffle={() => setShuffleActive(!shuffleActive)}
        onToggleRepeat={() => setRepeatActive(!repeatActive)}
        onToggleLike={handleToggleLike}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        showVisualizer={showVisualizer}
        setShowVisualizer={setShowVisualizer}
        bassBoostActive={bassBoostActive}
        onToggleBassBoost={() => setBassBoostActive(!bassBoostActive)}
      />
    </div>
  );
}
