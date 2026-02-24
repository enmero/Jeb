import React from 'react'
import { IconHistory, IconTrash, IconWorld, IconClock } from '@tabler/icons-react'

interface HistoryItem {
    id: string;
    title: string;
    url: string;
    timestamp: number;
}

interface HistoryViewProps {
    history: HistoryItem[];
    onNavigate: (url: string) => void;
    onClear: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onNavigate, onClear }) => {
    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '40px' }} className="history-scroll-container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <IconHistory size={24} color="var(--accent)" />
                        <h1 style={{ fontWeight: 300, fontSize: '24px', margin: 0 }}>Browsing History</h1>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={onClear}
                            className="sidebar-btn"
                            style={{ color: '#ef4444', gap: '8px', fontSize: '12px', padding: '8px 16px' }}
                        >
                            <IconTrash size={16} /> Clear All
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {history.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                            <IconClock size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <p>Your browsing history is empty.</p>
                        </div>
                    ) : (
                        history.map(item => (
                            <div
                                key={item.id}
                                onClick={() => onNavigate(item.url)}
                                style={{
                                    background: 'var(--bg-sidebar)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    transition: 'all 0.2s'
                                }}
                                className="history-item"
                            >
                                <div style={{ background: 'var(--bg-hover)', padding: '8px', borderRadius: '8px' }}>
                                    <IconWorld size={18} color="var(--text-dim)" />
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                                    <div style={{ color: 'var(--text-dim)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.url}</div>
                                </div>
                                <div style={{ color: 'var(--text-dim)', fontSize: '11px', fontWeight: 600 }}>
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default HistoryView
