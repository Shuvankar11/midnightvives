import React, { useState } from 'react';
import { 
  Play, Pause, Heart, Plus, Trash2, Search, Sparkles, 
  Check, RotateCw, ChevronLeft, ChevronRight, MoreVertical, 
  Music, Radio, Mic, Disc, User, Flame, Clock, Compass
} from 'lucide-react';

const POPULAR_ARTISTS = [
  { name: 'Sammy Simorangkir', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', count: '20 Albums' },
  { name: 'Rossa', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', count: '15 Albums' },
  { name: 'Dewa 19', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80', count: '10 Albums' },
  { name: 'Juicy Luicy', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', count: '11 Albums' },
  { name: 'Arijit Singh', image: 'https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_500x500.jpg', count: '45 Albums' },
  { name: 'Shreya Ghoshal', image: 'https://c.saavncdn.com/artists/Shreya_Ghoshal_007_20241101074144_500x500.jpg', count: '38 Albums' },
  { name: 'Pritam', image: 'https://c.saavncdn.com/artists/Pritam_Chakraborty-20170711073326_500x500.jpg', count: '50 Albums' },
  { name: 'Atif Aslam', image: 'https://c.saavncdn.com/artists/Atif_Aslam_004_20230623091702_500x500.jpg', count: '25 Albums' },
  { name: 'Taylor Swift', image: 'https://c.saavncdn.com/artists/Taylor_Swift_003_20200226074119_500x500.jpg', count: '24 Albums' },
  { name: 'Diljit Dosanjh', image: 'https://c.saavncdn.com/artists/Diljit_Dosanjh_005_20231025073054_500x500.jpg', count: '18 Albums' }
];

const RADIO_STATIONS = [
  { id: 'rad-1', title: 'Midnight Chill FM', tag: 'Lofi & Ambient', color: 'linear-gradient(135deg, #1e1b4b, #4338ca)', query: 'lofi hindi chill' },
  { id: 'rad-2', title: 'Retro Evergreen 90s', tag: 'Classic Golden Hits', color: 'linear-gradient(135deg, #4c0519, #be123c)', query: 'kishore kumar lata mangeshkar 90s hits' },
  { id: 'rad-3', title: 'Romantic Melody Wave', tag: 'Love & Acoustic', color: 'linear-gradient(135deg, #3b0764, #9333ea)', query: 'arijit singh romantic melody hits' },
  { id: 'rad-4', title: 'Club & Dance Beats', tag: 'EDM & Remix Hits', color: 'linear-gradient(135deg, #022c22, #059669)', query: 'badshah party dance remix hits' }
];

const PODCAST_SHOWS = [
  { id: 'pod-1', title: 'The Musician Diary', host: 'SoundLab Studio', episodes: '42 Episodes', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&auto=format&fit=crop&q=80' },
  { id: 'pod-2', title: 'Behind The Melodies', host: 'Audio Stories', episodes: '28 Episodes', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80' },
  { id: 'pod-3', title: 'Lofi Late Night Talks', host: 'Midnight Vibes', episodes: '65 Episodes', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80' }
];

export default function Library({
  activeTab,
  setActiveTab,
  tracks,
  currentTrack,
  isPlaying,
  likedTrackIds,
  playlists,
  selectedPlaylistId,
  onPlayTrack,
  onToggleLike,
  onAddTrackToPlaylist,
  onDeletePlaylist,
  searchQuery,
  setSearchQuery,
  searchResults = [],
  isSearching = false,
  onArtistClick,
  selectedLanguage = 'hindi',
  onLanguageChange,
  onRefreshHome,
  isRefreshing = false,
  onNavigateBack,
  onNavigateForward,
  canGoBack = true,
  canGoForward = false
}) {
  const [activeDropdownTrackId, setActiveDropdownTrackId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedVibeTag, setSelectedVibeTag] = useState('all');

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleOutside = () => setActiveDropdownTrackId(null);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  const getPlaylist = () => playlists.find(p => p.id === selectedPlaylistId);
  const getPlaylistTracks = () => {
    const pl = getPlaylist();
    if (!pl) return [];
    return tracks.filter(t => pl.trackIds.includes(t.id));
  };
  const getLikedTracks = () => tracks.filter(t => likedTrackIds.includes(t.id));

  // Top trending song for Hero Card
  const heroTrack = tracks[0] || currentTrack;

  // Render song rows table matching target UI
  const renderTrackTable = (trackList, emptyMessage) => {
    if (!trackList || trackList.length === 0) {
      return (
        <div className="empty-track-placeholder">
          <Music size={36} className="empty-icon text-muted" />
          <span className="empty-title">{emptyMessage || "No songs available"}</span>
        </div>
      );
    }

    return (
      <div className="song-table-wrapper">
        <table className="song-table">
          <thead>
            <tr>
              <th className="th-num">#</th>
              <th className="th-name">Name Song</th>
              <th className="th-artist">Artist</th>
              <th className="th-time">Time</th>
              <th className="th-like">Like</th>
              <th className="th-actions"></th>
            </tr>
          </thead>
          <tbody>
            {trackList.map((track, idx) => {
              const isTrackCurrent = currentTrack && currentTrack.id === track.id;
              const isTrackPlaying = isTrackCurrent && isPlaying;
              const isLiked = likedTrackIds.includes(track.id);
              const rankStr = (idx + 1) < 10 ? `0${idx + 1}` : `${idx + 1}`;

              return (
                <tr 
                  key={track.id || idx}
                  className={`song-row ${isTrackCurrent ? 'song-row-active' : ''}`}
                  onClick={() => onPlayTrack(track)}
                >
                  {/* # Column */}
                  <td className="td-num">
                    <span className="row-num-text">{rankStr}</span>
                    <button 
                      className="row-play-btn interactive-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayTrack(track);
                      }}
                      aria-label={isTrackPlaying ? "Pause" : "Play"}
                    >
                      {isTrackPlaying ? (
                        <div className="mini-pulse-wave">
                          <span className="pulse-bar"></span>
                          <span className="pulse-bar"></span>
                          <span className="pulse-bar"></span>
                        </div>
                      ) : (
                        <Play size={13} fill="currentColor" />
                      )}
                    </button>
                  </td>

                  {/* Name Song Column */}
                  <td className="td-name">
                    <div className="song-cell-info">
                      <div className="song-cover-thumb-box">
                        <img 
                          src={track.coverUrl} 
                          alt={track.title} 
                          className="song-cover-thumb"
                          loading="lazy"
                        />
                        <div className="thumb-play-overlay">
                          {isTrackPlaying ? (
                            <Pause size={14} fill="#ffffff" color="#ffffff" />
                          ) : (
                            <Play size={14} fill="#ffffff" color="#ffffff" />
                          )}
                        </div>
                      </div>
                      <span className="song-name-title" title={track.title}>
                        {track.title}
                      </span>
                    </div>
                  </td>

                  {/* Artist Column */}
                  <td className="td-artist">
                    <span 
                      className="song-artist-name" 
                      title={track.artist}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onArtistClick) onArtistClick(track.artist.split(',')[0].trim());
                      }}
                    >
                      {track.artist}
                    </span>
                  </td>

                  {/* Time Column */}
                  <td className="td-time">
                    <span className="song-duration-text">{track.duration || '3:20'}</span>
                  </td>

                  {/* Like Column */}
                  <td className="td-like">
                    <button 
                      className={`interactive-btn table-like-btn ${isLiked ? 'liked-icon-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(track.id);
                      }}
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart 
                        size={15} 
                        fill={isLiked ? "#f43f5e" : "none"} 
                        color={isLiked ? "#f43f5e" : "var(--text-secondary)"} 
                      />
                      <span className="like-count-text">{isLiked ? '1.1k' : '1k'}</span>
                    </button>
                  </td>

                  {/* Action Menu (3 Dots) Column */}
                  <td className="td-actions">
                    <div className="row-dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="interactive-btn row-more-btn"
                        onClick={() => setActiveDropdownTrackId(activeDropdownTrackId === track.id ? null : track.id)}
                        title="More options"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeDropdownTrackId === track.id && (
                        <div className="row-action-dropdown">
                          <div className="dropdown-title-label">Add to Playlist</div>
                          <div className="dropdown-divider-line"></div>
                          {playlists.length === 0 ? (
                            <div className="dropdown-empty-text">No playlists yet</div>
                          ) : (
                            playlists.map(pl => {
                              const alreadyIn = pl.trackIds.includes(track.id);
                              return (
                                <button
                                  key={pl.id}
                                  className="dropdown-action-item"
                                  onClick={() => {
                                    onAddTrackToPlaylist(track.id, pl.id);
                                    setActiveDropdownTrackId(null);
                                  }}
                                >
                                  <span>{pl.name}</span>
                                  {alreadyIn && <Check size={13} className="cyan-text" />}
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Switch Render by activeTab
  switch (activeTab) {
    case 'favorites':
      return (
        <div className="library-main-panel" id="main-content-area">
          {/* Top Nav Controls */}
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button 
                className="interactive-btn history-circle-btn" 
                onClick={onNavigateBack}
                disabled={!canGoBack}
                title="Go Back"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                className="interactive-btn history-circle-btn" 
                onClick={onNavigateForward}
                disabled={!canGoForward}
                title="Go Forward"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="top-bar-page-title font-display">Liked Songs</h2>
          </div>

          <div className="library-page-body">
            <div className="hero-category-banner banner-favorites-theme">
              <div className="hero-banner-inner">
                <div className="banner-icon-badge">
                  <Heart size={32} fill="#f43f5e" color="#f43f5e" />
                </div>
                <div className="banner-text-details">
                  <span className="banner-micro-tag">PLAYLIST</span>
                  <h1 className="banner-main-heading font-display">Liked Songs</h1>
                  <span className="banner-info-sub">{getLikedTracks().length} Songs in Library</span>
                </div>
              </div>
            </div>

            <div className="main-section-block">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Your</span>
                  <h2 className="block-main-title font-display">Favorite Collection</h2>
                </div>
              </div>
              {renderTrackTable(getLikedTracks(), "You haven't liked any songs yet. Click the heart icon on any track to add it here.")}
            </div>
          </div>
        </div>
      );

    case 'playlist': {
      const pl = getPlaylist();
      if (!pl) {
        return (
          <div className="library-main-panel">
            <div className="empty-track-placeholder">Playlist not found</div>
          </div>
        );
      }
      const plTracks = getPlaylistTracks();

      return (
        <div className="library-main-panel" id="main-content-area">
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button className="interactive-btn history-circle-btn" onClick={onNavigateBack} disabled={!canGoBack}>
                <ChevronLeft size={18} />
              </button>
              <button className="interactive-btn history-circle-btn" onClick={onNavigateForward} disabled={!canGoForward}>
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="top-bar-page-title font-display">{pl.name}</h2>
          </div>

          <div className="library-page-body">
            <div className="hero-category-banner banner-playlist-theme">
              <div className="hero-banner-inner">
                <div className="banner-icon-badge">
                  <Sparkles size={32} className="cyan-text" />
                </div>
                <div className="banner-text-details">
                  <span className="banner-micro-tag">PLAYLIST</span>
                  <h1 className="banner-main-heading font-display">{pl.name}</h1>
                  <div className="banner-pl-actions">
                    <span className="banner-info-sub">{plTracks.length} tracks</span>
                    {!showDeleteConfirm ? (
                      <button 
                        className="interactive-btn delete-playlist-action"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 size={14} />
                        <span>Delete Playlist</span>
                      </button>
                    ) : (
                      <div className="delete-confirm-pill">
                        <span>Delete?</span>
                        <button 
                          className="confirm-yes-btn"
                          onClick={() => {
                            onDeletePlaylist(pl.id);
                            setShowDeleteConfirm(false);
                          }}
                        >
                          Yes
                        </button>
                        <button className="confirm-no-btn" onClick={() => setShowDeleteConfirm(false)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="main-section-block">
              {renderTrackTable(plTracks, "This playlist is empty. Add songs using the '+' icon on any track.")}
            </div>
          </div>
        </div>
      );
    }

    case 'search':
      return (
        <div className="library-main-panel" id="main-content-area">
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button className="interactive-btn history-circle-btn" onClick={onNavigateBack} disabled={!canGoBack}>
                <ChevronLeft size={18} />
              </button>
              <button className="interactive-btn history-circle-btn" onClick={onNavigateForward} disabled={!canGoForward}>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="top-search-field-wrapper">
              <Search size={16} className="top-search-icon" />
              <input 
                type="text" 
                placeholder="Search any song, artist, album..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="top-search-input"
                autoFocus
              />
            </div>
          </div>

          <div className="library-page-body">
            <div className="main-section-block">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Search</span>
                  <h2 className="block-main-title font-display">Results for "{searchQuery || '...'}"</h2>
                </div>
              </div>

              {isSearching ? (
                <div className="searching-indicator-box">
                  <div className="loading-spinner-ring"></div>
                  <span>Searching online catalog...</span>
                </div>
              ) : (
                renderTrackTable(searchResults, searchQuery ? "No tracks found for this search." : "Type a query in the search bar above.")
              )}
            </div>
          </div>
        </div>
      );

    case 'discover':
      return (
        <div className="library-main-panel" id="main-content-area">
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button className="interactive-btn history-circle-btn" onClick={onNavigateBack} disabled={!canGoBack}>
                <ChevronLeft size={18} />
              </button>
              <button className="interactive-btn history-circle-btn" onClick={onNavigateForward} disabled={!canGoForward}>
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="top-bar-page-title font-display">Discover</h2>
          </div>

          <div className="library-page-body">
            {/* Trending Hero */}
            <div className="top-trending-section">
              <div className="trending-hero-card">
                <div className="hero-gradient-mesh"></div>
                <div className="hero-content-col">
                  <span className="hero-tag-pill">Discover New Music</span>
                  <h1 className="hero-title-bold font-display">
                    Fresh Releases &amp;<br />Trending Beats
                  </h1>
                  <div className="hero-action-buttons">
                    <button 
                      className="hero-play-main-btn"
                      onClick={() => onPlayTrack(tracks[0])}
                    >
                      <Play size={16} fill="currentColor" />
                      <span>Play Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-section-block">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Recommended</span>
                  <h2 className="block-main-title font-display">Trending Now</h2>
                </div>
              </div>
              {renderTrackTable(tracks, "No tracks available.")}
            </div>
          </div>
        </div>
      );

    case 'radio':
      return (
        <div className="library-main-panel" id="main-content-area">
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button className="interactive-btn history-circle-btn" onClick={onNavigateBack} disabled={!canGoBack}>
                <ChevronLeft size={18} />
              </button>
              <button className="interactive-btn history-circle-btn" onClick={onNavigateForward} disabled={!canGoForward}>
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="top-bar-page-title font-display">Radio Stations</h2>
          </div>

          <div className="library-page-body">
            <div className="main-section-block">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Live</span>
                  <h2 className="block-main-title font-display">Popular Stations</h2>
                </div>
              </div>

              <div className="radio-stations-grid">
                {RADIO_STATIONS.map((station) => (
                  <div 
                    key={station.id}
                    className="radio-card"
                    style={{ background: station.color }}
                    onClick={() => {
                      setSearchQuery(station.query);
                      setActiveTab('search');
                    }}
                  >
                    <div className="radio-icon-circle">
                      <Radio size={22} color="#ffffff" />
                    </div>
                    <div className="radio-meta">
                      <h3 className="radio-title font-display">{station.title}</h3>
                      <span className="radio-tag">{station.tag}</span>
                    </div>
                    <button className="radio-play-bubble">
                      <Play size={16} fill="#ffffff" color="#ffffff" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="main-section-block" style={{ marginTop: '32px' }}>
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Radio</span>
                  <h2 className="block-main-title font-display">Featured Tracks</h2>
                </div>
              </div>
              {renderTrackTable(tracks, "No radio tracks loaded.")}
            </div>
          </div>
        </div>
      );

    case 'podcast':
      return (
        <div className="library-main-panel" id="main-content-area">
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button className="interactive-btn history-circle-btn" onClick={onNavigateBack} disabled={!canGoBack}>
                <ChevronLeft size={18} />
              </button>
              <button className="interactive-btn history-circle-btn" onClick={onNavigateForward} disabled={!canGoForward}>
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="top-bar-page-title font-display">Podcasts</h2>
          </div>

          <div className="library-page-body">
            <div className="main-section-block">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Featured</span>
                  <h2 className="block-main-title font-display">Shows &amp; Episodes</h2>
                </div>
              </div>

              <div className="podcast-grid">
                {PODCAST_SHOWS.map((show) => (
                  <div key={show.id} className="podcast-card">
                    <div className="podcast-cover-box">
                      <img src={show.image} alt={show.title} className="podcast-cover-img" />
                      <div className="podcast-mic-badge">
                        <Mic size={14} />
                      </div>
                    </div>
                    <div className="podcast-meta">
                      <h4 className="podcast-title font-display">{show.title}</h4>
                      <span className="podcast-host">{show.host}</span>
                      <span className="podcast-episodes">{show.episodes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'albums':
      return (
        <div className="library-main-panel" id="main-content-area">
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button className="interactive-btn history-circle-btn" onClick={onNavigateBack} disabled={!canGoBack}>
                <ChevronLeft size={18} />
              </button>
              <button className="interactive-btn history-circle-btn" onClick={onNavigateForward} disabled={!canGoForward}>
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="top-bar-page-title font-display">Albums</h2>
          </div>

          <div className="library-page-body">
            <div className="main-section-block">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Library</span>
                  <h2 className="block-main-title font-display">Featured Albums</h2>
                </div>
              </div>

              <div className="albums-grid">
                {tracks.slice(0, 8).map((track) => (
                  <div 
                    key={track.id} 
                    className="album-card"
                    onClick={() => onPlayTrack(track)}
                  >
                    <div className="album-cover-box">
                      <img src={track.coverUrl} alt={track.album || track.title} className="album-cover-img" />
                      <button className="album-play-overlay">
                        <Play size={20} fill="#ffffff" color="#ffffff" />
                      </button>
                    </div>
                    <div className="album-meta">
                      <h4 className="album-title font-display">{track.album || track.title}</h4>
                      <span className="album-artist">{track.artist}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'artists':
      return (
        <div className="library-main-panel" id="main-content-area">
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button className="interactive-btn history-circle-btn" onClick={onNavigateBack} disabled={!canGoBack}>
                <ChevronLeft size={18} />
              </button>
              <button className="interactive-btn history-circle-btn" onClick={onNavigateForward} disabled={!canGoForward}>
                <ChevronRight size={18} />
              </button>
            </div>
            <h2 className="top-bar-page-title font-display">Artists</h2>
          </div>

          <div className="library-page-body">
            <div className="main-section-block">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Top</span>
                  <h2 className="block-main-title font-display">Popular Artists</h2>
                </div>
              </div>

              <div className="all-artists-grid">
                {POPULAR_ARTISTS.map((artist, idx) => (
                  <div 
                    key={idx} 
                    className="artist-profile-card"
                    onClick={() => onArtistClick && onArtistClick(artist.name)}
                  >
                    <div className="artist-profile-avatar-box">
                      <img src={artist.image} alt={artist.name} className="artist-profile-avatar" />
                    </div>
                    <div className="artist-profile-meta">
                      <h4 className="artist-profile-name font-display">{artist.name}</h4>
                      <span className="artist-profile-albums">{artist.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'home':
    default:
      return (
        <div className="library-main-panel" id="main-content-area">
          {/* Top Bar with Navigation Arrows & Language Selector */}
          <div className="top-navigation-bar">
            <div className="history-nav-group">
              <button 
                className="interactive-btn history-circle-btn" 
                onClick={onNavigateBack}
                disabled={!canGoBack}
                title="Go Back"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                className="interactive-btn history-circle-btn" 
                onClick={onNavigateForward}
                disabled={!canGoForward}
                title="Go Forward"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Language filter pills & Refresh hits */}
            <div className="top-bar-right-controls">
              <div className="language-pills-row">
                {['hindi', 'english', 'bengali', 'tamil', 'telugu', 'bhojpuri'].map(lang => (
                  <button
                    key={lang}
                    className={`lang-pill-btn ${selectedLanguage === lang ? 'lang-pill-active' : ''}`}
                    onClick={() => onLanguageChange && onLanguageChange(lang)}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>

              <button 
                className={`interactive-btn refresh-catalog-btn ${isRefreshing ? 'refreshing-spin' : ''}`}
                onClick={onRefreshHome}
                disabled={isRefreshing}
                title="Refresh Catalog Hits"
              >
                <RotateCw size={13} className={isRefreshing ? 'spin-anim' : ''} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          <div className="library-page-body">
            {/* Top Trending Section */}
            <div className="top-trending-section">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Top</span>
                  <h2 className="block-main-title font-display">Trending</h2>
                </div>
                <button 
                  className="interactive-btn see-all-link-btn"
                  onClick={() => setActiveTab('discover')}
                >
                  See all
                </button>
              </div>

              {/* Hero Banner Card */}
              <div className="trending-hero-card">
                {/* Radiant mesh gradient aura on the right */}
                <div className="hero-gradient-mesh"></div>

                <div className="hero-content-col">
                  <span className="hero-tag-pill">Playlist</span>
                  <h1 className="hero-title-bold font-display">
                    Top Song<br />Of The Week
                  </h1>
                  <div className="hero-action-buttons">
                    <button 
                      className="hero-play-main-btn"
                      onClick={() => onPlayTrack(heroTrack || tracks[0])}
                    >
                      <Play size={16} fill="currentColor" />
                      <span>Play</span>
                    </button>

                    <button 
                      className="hero-view-playlist-btn"
                      onClick={() => setActiveTab('discover')}
                    >
                      <span>View Playlist</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Top 50 Section */}
            <div className="main-section-block global-top-50-section">
              <div className="block-header-row">
                <div className="block-title-group">
                  <span className="block-subtitle">Global</span>
                  <h2 className="block-main-title font-display">Top 50</h2>
                </div>
                <button 
                  className="interactive-btn see-all-link-btn"
                  onClick={() => onRefreshHome && onRefreshHome()}
                >
                  See all
                </button>
              </div>

              {/* Table of songs matching target design */}
              {renderTrackTable(tracks, "Loading top songs...")}
            </div>
          </div>
        </div>
      );
  }
}
