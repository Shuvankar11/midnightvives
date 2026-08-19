import React from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Volume2, Volume1, VolumeX, Heart, Maximize2, Minimize2, Zap 
} from 'lucide-react';

export default function Player({
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
  onToggleBassBoost
}) {
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === null) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLiked = currentTrack && likedTrackIds.includes(currentTrack.id);

  const renderVolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  if (!currentTrack) return null;

  return (
    <div className="mobile-responsive-player-bar" id="mobile-player-bar">
      {/* Top micro progress line */}
      <div className="mobile-progress-line-container">
        <div 
          className="mobile-progress-line-fill" 
          style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
        />
      </div>

      <div className="mobile-player-bar-inner">
        {/* Left: Track Thumb & Title */}
        <div 
          className="mobile-player-track-info"
          onClick={() => setShowVisualizer && setShowVisualizer(true)}
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="mobile-player-thumb" 
          />
          <div className="mobile-player-meta">
            <span className="mobile-player-title font-display">{currentTrack.title}</span>
            <span className="mobile-player-artist">{currentTrack.artist}</span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="mobile-player-actions">
          <button 
            className={`interactive-btn mobile-action-btn ${isLiked ? 'liked-icon-active' : ''}`}
            onClick={() => onToggleLike(currentTrack.id)}
            aria-label="Like"
          >
            <Heart size={18} fill={isLiked ? "#f43f5e" : "none"} color={isLiked ? "#f43f5e" : "currentColor"} />
          </button>

          <button 
            className="interactive-btn mobile-action-btn"
            onClick={onPrev}
            aria-label="Previous"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>

          <button 
            className="interactive-btn mobile-play-pause-btn"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />
            )}
          </button>

          <button 
            className="interactive-btn mobile-action-btn"
            onClick={onNext}
            aria-label="Next"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
