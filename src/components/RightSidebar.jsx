import React, { useState } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Heart, Bell, ChevronDown, Volume2, Volume1, VolumeX, 
  Zap, Maximize2, Sparkles, Music, Check, User
} from 'lucide-react';

const REAL_ARTISTS_BY_LANG = {
  hindi: [
    {
      id: 'art-arijit',
      rank: '01',
      name: 'Arijit Singh',
      albums: '50+ Albums',
      image: 'https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_500x500.jpg'
    },
    {
      id: 'art-shreya',
      rank: '02',
      name: 'Shreya Ghoshal',
      albums: '40+ Albums',
      image: 'https://c.saavncdn.com/artists/Shreya_Ghoshal_007_20241101074144_500x500.jpg'
    },
    {
      id: 'art-pritam',
      rank: '03',
      name: 'Pritam',
      albums: '60+ Albums',
      image: 'https://c.saavncdn.com/artists/Pritam_Chakraborty-20170711073326_500x500.jpg'
    },
    {
      id: 'art-atif',
      rank: '04',
      name: 'Atif Aslam',
      albums: '35+ Albums',
      image: 'https://c.saavncdn.com/artists/Atif_Aslam_004_20230623091702_500x500.jpg'
    },
    {
      id: 'art-kk',
      rank: '05',
      name: 'KK',
      albums: '45+ Albums',
      image: 'https://c.saavncdn.com/artists/KK_002_20220601044439_500x500.jpg'
    },
    {
      id: 'art-sonu',
      rank: '06',
      name: 'Sonu Nigam',
      albums: '55+ Albums',
      image: 'https://c.saavncdn.com/artists/Sonu_Nigam_003_20241118063907_500x500.jpg'
    }
  ],
  english: [
    {
      id: 'art-taylor',
      rank: '01',
      name: 'Taylor Swift',
      albums: '24 Albums',
      image: 'https://c.saavncdn.com/artists/Taylor_Swift_003_20200226074119_500x500.jpg'
    },
    {
      id: 'art-weeknd',
      rank: '02',
      name: 'The Weeknd',
      albums: '18 Albums',
      image: 'https://c.saavncdn.com/artists/The_Weeknd_005_20231020084424_500x500.jpg'
    },
    {
      id: 'art-edsheeran',
      rank: '03',
      name: 'Ed Sheeran',
      albums: '16 Albums',
      image: 'https://c.saavncdn.com/artists/Ed_Sheeran_003_20200226074211_500x500.jpg'
    },
    {
      id: 'art-billie',
      rank: '04',
      name: 'Billie Eilish',
      albums: '12 Albums',
      image: 'https://c.saavncdn.com/artists/Billie_Eilish_003_20200226074312_500x500.jpg'
    }
  ],
  bengali: [
    {
      id: 'art-anupam',
      rank: '01',
      name: 'Anupam Roy',
      albums: '25 Albums',
      image: 'https://c.saavncdn.com/artists/Anupam_Roy_003_20241118064030_500x500.jpg'
    },
    {
      id: 'art-arijit-b',
      rank: '02',
      name: 'Arijit Singh',
      albums: '30 Albums',
      image: 'https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_500x500.jpg'
    },
    {
      id: 'art-shreya-b',
      rank: '03',
      name: 'Shreya Ghoshal',
      albums: '28 Albums',
      image: 'https://c.saavncdn.com/artists/Shreya_Ghoshal_007_20241101074144_500x500.jpg'
    },
    {
      id: 'art-nachiketa',
      rank: '04',
      name: 'Nachiketa',
      albums: '22 Albums',
      image: 'https://c.saavncdn.com/artists/Nachiketa_Chakraborty_002_20220601050012_500x500.jpg'
    }
  ],
  tamil: [
    {
      id: 'art-anirudh',
      rank: '01',
      name: 'Anirudh Ravichander',
      albums: '35 Albums',
      image: 'https://c.saavncdn.com/artists/Anirudh_Ravichander_003_20241118063945_500x500.jpg'
    },
    {
      id: 'art-arrahman',
      rank: '02',
      name: 'A. R. Rahman',
      albums: '60 Albums',
      image: 'https://c.saavncdn.com/artists/A_R_Rahman_004_20241118063836_500x500.jpg'
    },
    {
      id: 'art-sidsriram',
      rank: '03',
      name: 'Sid Sriram',
      albums: '30 Albums',
      image: 'https://c.saavncdn.com/artists/Sid_Sriram_003_20241118063851_500x500.jpg'
    },
    {
      id: 'art-yuvan',
      rank: '04',
      name: 'Yuvan Shankar Raja',
      albums: '45 Albums',
      image: 'https://c.saavncdn.com/artists/Yuvan_Shankar_Raja_003_20241118064000_500x500.jpg'
    }
  ],
  telugu: [
    {
      id: 'art-dsp',
      rank: '01',
      name: 'Devi Sri Prasad',
      albums: '40 Albums',
      image: 'https://c.saavncdn.com/artists/Devi_Sri_Prasad_002_20220601044320_500x500.jpg'
    },
    {
      id: 'art-thaman',
      rank: '02',
      name: 'Thaman S',
      albums: '35 Albums',
      image: 'https://c.saavncdn.com/artists/Thaman_S_003_20241118063920_500x500.jpg'
    },
    {
      id: 'art-sidsriram-tel',
      rank: '03',
      name: 'Sid Sriram',
      albums: '25 Albums',
      image: 'https://c.saavncdn.com/artists/Sid_Sriram_003_20241118063851_500x500.jpg'
    },
    {
      id: 'art-rahman-tel',
      rank: '04',
      name: 'A. R. Rahman',
      albums: '50 Albums',
      image: 'https://c.saavncdn.com/artists/A_R_Rahman_004_20241118063836_500x500.jpg'
    }
  ],
  bhojpuri: [
    {
      id: 'art-khesari',
      rank: '01',
      name: 'Khesari Lal Yadav',
      albums: '50 Albums',
      image: 'https://c.saavncdn.com/artists/Khesari_Lal_Yadav_003_20241118064110_500x500.jpg'
    },
    {
      id: 'art-pawan',
      rank: '02',
      name: 'Pawan Singh',
      albums: '45 Albums',
      image: 'https://c.saavncdn.com/artists/Pawan_Singh_003_20241118064125_500x500.jpg'
    },
    {
      id: 'art-shilpi',
      rank: '03',
      name: 'Shilpi Raj',
      albums: '35 Albums',
      image: 'https://c.saavncdn.com/artists/Shilpi_Raj_003_20241118064140_500x500.jpg'
    },
    {
      id: 'art-arvind',
      rank: '04',
      name: 'Arvind Akela Kallu',
      albums: '30 Albums',
      image: 'https://c.saavncdn.com/artists/Arvind_Akela_Kallu_002_20220601050210_500x500.jpg'
    }
  ]
};

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
  onViewAllArtists,
  selectedLanguage = 'hindi'
}) {
  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('mv_user_name') || 'Shuvankar';
    } catch {
      return 'Shuvankar';
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
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

  const handleSaveName = (e) => {
    e.preventDefault();
    const clean = tempName.trim() || 'Shuvankar';
    setUserName(clean);
    localStorage.setItem('mv_user_name', clean);
    setIsEditingName(false);
  };

  // Get real artists based on selected language
  const topArtists = REAL_ARTISTS_BY_LANG[selectedLanguage] || REAL_ARTISTS_BY_LANG['hindi'];

  return (
    <aside className="right-sidebar-container" id="app-right-sidebar">
      {/* Top Section: User Profile & Notification */}
      <div className="right-sidebar-header">
        {isEditingName ? (
          <form onSubmit={handleSaveName} className="user-name-edit-form">
            <input 
              type="text" 
              value={tempName} 
              onChange={(e) => setTempName(e.target.value)}
              className="user-name-input"
              maxLength={20}
              autoFocus
            />
            <button type="submit" className="interactive-btn save-name-btn">
              <Check size={14} />
            </button>
          </form>
        ) : (
          <div 
            className="user-profile-widget" 
            onClick={() => setIsEditingName(true)}
            title="Click to edit name"
          >
            <div className="user-avatar-wrapper">
              <div className="user-avatar-initials font-display">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="user-online-status"></span>
            </div>
            <div className="user-info">
              <span className="user-name font-display">{userName}</span>
              <span className="user-badge">PRO Member</span>
            </div>
            <ChevronDown size={14} className="user-chevron" />
          </div>
        )}

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
          {topArtists.slice(0, 4).map((artist) => (
            <div 
              key={artist.id} 
              className="artist-row-item"
              onClick={() => onArtistClick && onArtistClick(artist.name)}
              title={`Play ${artist.name}`}
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
