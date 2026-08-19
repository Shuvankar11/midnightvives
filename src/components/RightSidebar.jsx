import React, { useState } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Heart, Bell, ChevronDown, Volume2, Volume1, VolumeX, 
  Zap, Maximize2, Sparkles, Music
} from 'lucide-react';

const DEFAULT_TOP_ARTISTS = [
  {
    id: 'art-1',
    rank: '01',
    name: 'Sammy Simorangkir',
    albums: '20 Albums',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-2',
    rank: '02',
    name: 'Rossa',
    albums: '15 Albums',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-3',
    rank: '03',
    name: 'Dewa 19',
    albums: '10 Albums',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-4',
    rank: '04',
    name: 'Juicy Luicy',
    albums: '11 Albums',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-5',
    rank: '05',
    name: 'Arijit Singh',
    albums: '45 Albums',
    image: 'https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_500x500.jpg'
  },
  {
    id: 'art-6',
    rank: '06',
    name: 'Taylor Swift',
    albums: '24 Albums',
    image: 'https://c.saavncdn.com/artists/Taylor_Swift_003_20200226074119_500x500.jpg'
  }
];

export default function RightSidebar({
  currentTrack,
  isPlaying,
  volume,
  muted,
  progress,
  duration,
  shuffleActive,
  repeatActive,
  likedTrackIds,
  onPlayPause,
  onNext,
  onPrev,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onSeek,
  onVolumeChange,
  onToggleMute,
  showVisualizer,
  setShowVisualizer,
  bassBoostActive,
  onToggleBassBoost,
  onArtistClick,
  onViewAllArtists
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLiked = currentTrack && likedTrackIds.includes(currentTrack.id);

  const renderVolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX size={15} />;
    if (volume < 0.5) return <Volume1 size={15} />;
    return <Volume2 size={15} />;
  };

  return (
    <aside className="right-sidebar-container" id="app-right-sidebar">
      {/* Top Section: User Profile & Notification */}
      <div className="right-sidebar-header">
        <div className="user-profile-widget" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="user-avatar-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Oji Ganteng" 
              className="user-avatar-img"
            />
            <span className="user-online-status"></span>
          </div>
          <div className="user-info">
            <span className="user-name font-display">Oji Ganteng</span>
            <span className="user-badge">Member</span>
          </div>
          <ChevronDown size={14} className="user-chevron" />
        </div>

        <button 
          className="interactive-btn notification-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={17} />
          <span className="notification-dot"></span>
        </button>
      </div>

      {/* Top Artist Section */}
      <div className="top-artists-section">
        <div className="section-header-row">
          <div className="section-header-title">
            <span className="section-subtitle">Top</span>
            <h3 className="section-main-title font-display">Artist</h3>
          </div>
          <button 
            className="interactive-btn see-all-btn"
            onClick={onViewAllArtists}
          >
            See all
          </button>
        </div>

        <div className="top-artists-list">
          {DEFAULT_TOP_ARTISTS.slice(0, 4).map((artist) => (
            <div 
              key={artist.id} 
              className="artist-row-item"
              onClick={() => onArtistClick && onArtistClick(artist.name)}
            >
              <div className="artist-avatar-container">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="artist-thumb-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="artist-meta">
                <span className="artist-item-name">{artist.name}</span>
                <span className="artist-item-albums">
                  <Music size={11} className="artist-album-icon" />
                  {artist.albums}
                </span>
              </div>
              <span className="artist-rank-num">{artist.rank}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Now Playing Card Widget */}
      <div className="mini-player-card-container">
        {currentTrack ? (
          <div className="mini-player-card">
            {/* Background Cover Image with Blur */}
            <div 
              className="mini-player-bg"
              style={{ backgroundImage: `url(${currentTrack.coverUrl})` }}
            >
              <div className="mini-player-bg-overlay"></div>
            </div>

            {/* Content Overlay */}
            <div className="mini-player-content">
              {/* Cover Art Box */}
              <div className="mini-cover-frame">
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title} 
                  className="mini-cover-art" 
                />
                <div className="mini-cover-badge">pro-M</div>
                <button 
                  className={`interactive-btn mini-heart-btn ${isLiked ? 'liked-active' : ''}`}
                  onClick={() => onToggleLike(currentTrack.id)}
                  aria-label="Like song"
                >
                  <Heart size={14} fill={isLiked ? "#f43f5e" : "none"} color={isLiked ? "#f43f5e" : "#ffffff"} />
                </button>
              </div>

              {/* Glass Details Card */}
              <div className="mini-glass-details">
                <div className="mini-track-info">
                  <h4 className="mini-track-title" title={currentTrack.title}>
                    {currentTrack.title}
                  </h4>
                  <span className="mini-track-artist" title={currentTrack.artist}>
                    {currentTrack.artist}
                  </span>
                </div>

                {/* Progress Bar with times */}
                <div className="mini-timeline-box">
                  <span className="mini-time-text">{formatTime(progress)}</span>
                  <div className="mini-slider-track">
                    <input 
                      type="range" 
                      min={0} 
                      max={duration || 100} 
                      value={progress}
                      onChange={(e) => onSeek(parseFloat(e.target.value))}
                      className="mini-seekbar"
                      aria-label="Track seeker"
                    />
                  </div>
                  <span className="mini-time-text">{formatTime(duration)}</span>
                </div>

                {/* Controls Row */}
                <div className="mini-controls-row">
                  <button 
                    className={`interactive-btn mini-ctrl-btn ${shuffleActive ? 'ctrl-active' : ''}`}
                    onClick={onToggleShuffle}
                    title="Shuffle"
                  >
                    <Shuffle size={14} />
                  </button>

                  <button 
                    className="interactive-btn mini-ctrl-btn"
                    onClick={onPrev}
                    title="Previous"
                  >
                    <SkipBack size={16} fill="currentColor" />
                  </button>

                  <button 
                    className="interactive-btn mini-play-pause-btn"
                    onClick={onPlayPause}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={17} fill="currentColor" />
                    ) : (
                      <Play size={17} fill="currentColor" style={{ marginLeft: '2px' }} />
                    )}
                  </button>

                  <button 
                    className="interactive-btn mini-ctrl-btn"
                    onClick={onNext}
                    title="Next"
                  >
                    <SkipForward size={16} fill="currentColor" />
                  </button>

                  <button 
                    className={`interactive-btn mini-ctrl-btn ${repeatActive ? 'ctrl-active' : ''}`}
                    onClick={onToggleRepeat}
                    title="Repeat"
                  >
                    <Repeat size={14} />
                  </button>
                </div>

                {/* Secondary Utility Controls */}
                <div className="mini-utility-row">
                  <button 
                    className={`interactive-btn mini-util-btn ${bassBoostActive ? 'bass-glow-active' : ''}`}
                    onClick={onToggleBassBoost}
                    title="Bass Boost"
                  >
                    <Zap size={11} fill={bassBoostActive ? "currentColor" : "none"} />
                    <span>BASS</span>
                  </button>

                  <div className="mini-volume-wrapper">
                    <button 
                      className="interactive-btn mini-util-btn"
                      onClick={onToggleMute}
                      title="Volume / Mute"
                    >
                      {renderVolumeIcon()}
                    </button>
                    <input 
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={muted ? 0 : volume}
                      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                      className="mini-volume-slider"
                      aria-label="Volume"
                    />
                  </div>

                  <button 
                    className={`interactive-btn mini-util-btn ${showVisualizer ? 'util-active' : ''}`}
                    onClick={() => setShowVisualizer(!showVisualizer)}
                    title="Visualizer"
                  >
                    <Maximize2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mini-player-card empty-card">
            <div className="empty-player-content">
              <div className="empty-icon-circle">
                <Music size={24} className="cyan-text" />
              </div>
              <span className="empty-player-text font-display">No Track Playing</span>
              <span className="empty-player-sub">Select any song to start listening</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
