import React, { useState } from 'react';
import { 
  Home, Compass, Radio, Mic, Folder, Music, User, 
  Search, Plus, Trash2, Upload, X, Disc, Heart
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  playlists, 
  onCreatePlaylist, 
  onSelectPlaylist,
  selectedPlaylistId,
  isSidebarOpen,
  setIsSidebarOpen,
  onUploadTrack,
  searchQuery,
  setSearchQuery,
  onDeletePlaylist
}) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    const trimmed = newPlaylistName.trim();
    if (!trimmed) return;
    
    const safeName = trimmed.slice(0, 30);
    onCreatePlaylist(safeName);
    setNewPlaylistName('');
    setIsCreatingPlaylist(false);
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    onSelectPlaylist(null);
    setIsSidebarOpen(false);
  };

  return (
    <aside 
      className={`sidebar-container ${isSidebarOpen ? 'sidebar-open' : ''}`}
      id="app-sidebar"
    >
      {/* Top macOS Control Dots */}
      <div className="mac-window-controls">
        <span className="mac-dot mac-dot-close" title="Close"></span>
        <span className="mac-dot mac-dot-minimize" title="Minimize"></span>
        <span className="mac-dot mac-dot-maximize" title="Maximize"></span>

        <button 
          className="interactive-btn mobile-close-btn" 
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Brand Header */}
      <div className="sidebar-brand-header">
        <div className="brand-logo-icon">
          <Music size={20} className="brand-svg" />
        </div>
        <span className="brand-logo-text font-display">OMusic</span>
      </div>

      {/* Search Input Bar */}
      <div className="sidebar-search-box">
        <div className="search-pill-container">
          <Search size={15} className="search-pill-icon" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'search') {
                setActiveTab('search');
              }
            }}
            className="search-pill-input"
            aria-label="Search music"
          />
          {searchQuery && (
            <button 
              className="interactive-btn clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Navigation Sections */}
      <div className="sidebar-scrollable-content">
        {/* Section: MENU */}
        <div className="nav-group-section">
          <span className="nav-group-title">MENU</span>
          <nav className="nav-list">
            <button 
              className={`nav-item-btn ${activeTab === 'home' && !selectedPlaylistId ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <Home size={17} className="nav-item-icon" />
              <span className="nav-item-label">Home</span>
              {activeTab === 'home' && !selectedPlaylistId && <span className="nav-active-pill"></span>}
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'discover' ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick('discover')}
            >
              <Compass size={17} className="nav-item-icon" />
              <span className="nav-item-label">Discover</span>
              {activeTab === 'discover' && <span className="nav-active-pill"></span>}
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'radio' ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick('radio')}
            >
              <Radio size={17} className="nav-item-icon" />
              <span className="nav-item-label">Radio</span>
              {activeTab === 'radio' && <span className="nav-active-pill"></span>}
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'podcast' ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick('podcast')}
            >
              <Mic size={17} className="nav-item-icon" />
              <span className="nav-item-label">Podcast</span>
              {activeTab === 'podcast' && <span className="nav-active-pill"></span>}
            </button>
          </nav>
        </div>

        {/* Section: LIBRARY */}
        <div className="nav-group-section">
          <span className="nav-group-title">LIBRARY</span>
          <nav className="nav-list">
            <button 
              className={`nav-item-btn ${activeTab === 'albums' ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick('albums')}
            >
              <Folder size={17} className="nav-item-icon" />
              <span className="nav-item-label">Albums</span>
              {activeTab === 'albums' && <span className="nav-active-pill"></span>}
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'favorites' ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick('favorites')}
            >
              <Music size={17} className="nav-item-icon" />
              <span className="nav-item-label">Song</span>
              {activeTab === 'favorites' && <span className="nav-active-pill"></span>}
            </button>

            <button 
              className={`nav-item-btn ${activeTab === 'artists' ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick('artists')}
            >
              <User size={17} className="nav-item-icon" />
              <span className="nav-item-label">Artist</span>
              {activeTab === 'artists' && <span className="nav-active-pill"></span>}
            </button>
          </nav>
        </div>

        {/* Section: PLAYLIST */}
        <div className="nav-group-section playlist-nav-section">
          <div className="playlist-section-header">
            <span className="nav-group-title">PLAYLIST</span>
            <button 
              className="interactive-btn add-playlist-toggle-btn"
              onClick={() => setIsCreatingPlaylist(!isCreatingPlaylist)}
              title="Create new playlist"
              aria-label="Add playlist"
            >
              <Plus size={14} />
            </button>
          </div>

          {isCreatingPlaylist && (
            <form onSubmit={handleCreatePlaylist} className="sidebar-playlist-form">
              <input 
                type="text" 
                placeholder="Playlist name..." 
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                maxLength={30}
                autoFocus
                className="sidebar-pl-input"
              />
              <button type="submit" className="interactive-btn sidebar-pl-submit-btn">
                <Plus size={14} />
              </button>
            </form>
          )}

          <div className="playlist-items-list">
            {playlists.length === 0 ? (
              <div className="no-playlists-hint">No playlists yet</div>
            ) : (
              playlists.map((pl) => (
                <div 
                  key={pl.id}
                  className={`playlist-row-item ${selectedPlaylistId === pl.id ? 'pl-item-active' : ''}`}
                >
                  <button 
                    className="playlist-item-btn"
                    onClick={() => {
                      onSelectPlaylist(pl.id);
                      setActiveTab('playlist');
                      setIsSidebarOpen(false);
                    }}
                  >
                    <Folder size={14} className="pl-item-icon" />
                    <span className="pl-item-name">{pl.name}</span>
                  </button>

                  <button 
                    className="interactive-btn pl-delete-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePlaylist && onDeletePlaylist(pl.id);
                    }}
                    title="Delete playlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section: Import MP3 Local Upload */}
        <div className="sidebar-upload-section">
          <button 
            className="sidebar-upload-btn"
            onClick={() => document.getElementById('sidebar-file-input').click()}
          >
            <Upload size={14} />
            <span>Import MP3</span>
          </button>
          <input 
            type="file" 
            id="sidebar-file-input" 
            accept="audio/mp3,audio/*"
            style={{ display: 'none' }} 
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                onUploadTrack(file);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </aside>
  );
}
