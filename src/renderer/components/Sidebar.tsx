import React from 'react'
import {
    IconHome,
    IconSearch,
    IconBookmark,
    IconHistory,
    IconSettings,
    IconDownload
} from '@tabler/icons-react'

interface SidebarProps {
    onSettingsClick: () => void;
    isSettingsActive: boolean;
    onHomeClick: () => void;
    onHistoryClick: () => void;
    onBookmarksClick: () => void;
    onDownloadsClick: () => void;
    currentView: string;
    isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    onSettingsClick,
    onHomeClick,
    onHistoryClick,
    onBookmarksClick,
    onDownloadsClick,
    currentView,
    isDarkMode
}) => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={isDarkMode ? "/logo_dark.png" : "/logo.png"} alt="JEB Logo" />
            </div>
            <div className="sidebar-items">
                <button className={`sidebar-btn ${currentView === 'home' ? 'active' : ''}`} onClick={onHomeClick}>
                    <IconHome size={20} />
                </button>
                <button className={`sidebar-btn ${currentView === 'bookmarks' ? 'active' : ''}`} onClick={onBookmarksClick}>
                    <IconBookmark size={20} />
                </button>
                <button className={`sidebar-btn ${currentView === 'downloads' ? 'active' : ''}`} onClick={onDownloadsClick}>
                    <IconDownload size={20} />
                </button>
                <button className={`sidebar-btn ${currentView === 'history' ? 'active' : ''}`} onClick={onHistoryClick}>
                    <IconHistory size={20} />
                </button>
                <button className={`sidebar-btn ${currentView === 'search-view' ? 'active' : ''}`}>
                    <IconSearch size={20} />
                </button>
            </div>
            <div className="sidebar-bottom" style={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
                <button
                    className={`sidebar-btn ${currentView === 'settings' ? 'active' : ''}`}
                    onClick={onSettingsClick}
                >
                    <IconSettings size={20} />
                </button>
            </div>
        </div>
    )
}

export default Sidebar
