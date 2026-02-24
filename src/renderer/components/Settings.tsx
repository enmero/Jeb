import React, { useState } from 'react'
import {
    IconShieldLock,
    IconWorld,
    IconDownload,
    IconRocket,
    IconBrowser,
    IconPalette,
    IconLock,
    IconInfoCircle,
    IconCheck
} from '@tabler/icons-react'

interface SettingsProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
    searchEngine: string;
    onSearchEngineChange: (engine: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleTheme, searchEngine, onSearchEngineChange }) => {
    const [activeCategory, setActiveCategory] = useState('General')

    const categories = [
        { name: 'General', icon: <IconBrowser size={18} /> },
        { name: 'Appearance', icon: <IconPalette size={18} /> },
        { name: 'Search', icon: <IconWorld size={18} /> },
        { name: 'Privacy', icon: <IconLock size={18} /> },
        { name: 'Advanced', icon: <IconRocket size={18} /> },
        { name: 'About', icon: <IconInfoCircle size={18} /> },
    ]

    const renderContent = () => {
        switch (activeCategory) {
            case 'General':
                return (
                    <>
                        <div className="settings-category">General</div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">On startup</div>
                                <div className="settings-item-desc">Open the New Tab page or continue where you left off.</div>
                            </div>
                            <select className="settings-select">
                                <option>Open Start Page</option>
                                <option>Continue previous session</option>
                            </select>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Downloads</div>
                                <div className="settings-item-desc">/home/user/Downloads</div>
                            </div>
                            <button className="settings-btn" style={{ background: 'var(--bg-hover)' }}>Change <IconDownload size={14} style={{ marginLeft: '4px' }} /></button>
                        </div>
                    </>
                )
            case 'Appearance':
                return (
                    <>
                        <div className="settings-category">Appearance</div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Dark Mode</div>
                                <div className="settings-item-desc">High-contrast industrial dark theme.</div>
                            </div>
                            <button
                                onClick={onToggleTheme}
                                className="settings-btn"
                                style={{
                                    background: isDarkMode ? 'var(--accent)' : 'var(--bg-hover)',
                                    color: isDarkMode ? '#fff' : 'var(--text-main)',
                                    width: '40px',
                                    height: '24px',
                                    borderRadius: '12px',
                                    padding: '2px',
                                    display: 'flex',
                                    transition: 'all 0.3s ease',
                                    justifyContent: isDarkMode ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
                            </button>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Contrast Level</div>
                                <div className="settings-item-desc">Adjust the deepness of the black palette.</div>
                            </div>
                            <input type="range" className="settings-range" />
                        </div>
                    </>
                )
            case 'Search':
                return (
                    <>
                        <div className="settings-category">Search</div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Search Engine</div>
                                <div className="settings-item-desc">Choose between Google or DuckDuckGo for global web search.</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['DuckDuckGo', 'Google'].map(engine => (
                                    <button
                                        key={engine}
                                        onClick={() => onSearchEngineChange(engine)}
                                        className="settings-btn"
                                        style={{
                                            background: searchEngine === engine ? 'var(--accent)' : 'var(--bg-sidebar)',
                                            color: searchEngine === engine ? '#fff' : 'var(--text-main)',
                                            borderColor: searchEngine === engine ? 'var(--accent)' : 'var(--border-color)',
                                            padding: '8px 16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {searchEngine === engine && <IconCheck size={14} />}
                                        {engine}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Suggestions</div>
                                <div className="settings-item-desc">Show search history and predictions in the omnibar.</div>
                            </div>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </>
                )
            case 'Privacy':
                return (
                    <>
                        <div className="settings-category">Privacy & Security</div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Tracking Protection</div>
                                <div className="settings-item-desc">Block cross-site trackers and fingerprinters.</div>
                            </div>
                            <button className="settings-btn" style={{ background: 'var(--accent)', color: '#fff' }}><IconShieldLock size={14} style={{ marginRight: '4px' }} /> Strict</button>
                        </div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Clear browsing data</div>
                                <div className="settings-item-desc">Delete history, cookies, and cache from this device.</div>
                            </div>
                            <button className="settings-btn" style={{ border: '1px solid #ff4b2b', color: '#ff4b2b' }}>Clear Data</button>
                        </div>
                    </>
                )
            case 'Advanced':
                return (
                    <>
                        <div className="settings-category">Advanced</div>
                        <div className="settings-item">
                            <div className="settings-item-info">
                                <div className="settings-item-title">Journey Depth</div>
                                <div className="settings-item-desc">Set AI analysis level for Discovery Nodes.</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <IconRocket size={18} color="var(--accent)" />
                                <input type="range" className="settings-range" defaultValue="80" />
                                <span style={{ fontSize: '11px', fontWeight: 600 }}>DEEP</span>
                            </div>
                        </div>
                    </>
                )
            case 'About':
                return (
                    <>
                        <div className="settings-category">About JEB</div>
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <img src="/logo.png" alt="JEB Logo" style={{ width: '64px', opacity: 0.8, marginBottom: '16px' }} />
                            <div style={{ fontSize: '18px', fontWeight: 600 }}>JEB Browser</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>Version 0.1.0 (Alpha)</div>
                        </div>
                    </>
                )
            default:
                return null
        }
    }

    return (
        <div className="settings-overlay">
            <div className="settings-drawer">
                <div className="settings-nav">
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', padding: '24px 24px 12px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Settings</div>
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            className={`settings-nav-item ${activeCategory === cat.name ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.name)}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>
                <div className="settings-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default Settings
