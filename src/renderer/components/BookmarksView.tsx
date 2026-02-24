import React from 'react'
import { IconBookmark, IconStarFilled, IconExternalLink, IconWorld } from '@tabler/icons-react'

interface BookmarkItem {
    id: string;
    title: string;
    url: string;
}

interface BookmarksViewProps {
    bookmarks: BookmarkItem[];
    onNavigate: (url: string) => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ bookmarks, onNavigate }) => {
    return (
        <div className="discovery-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <IconBookmark size={24} color="#f59e0b" />
                <h1 style={{ fontWeight: 300, fontSize: '24px', margin: 0 }}>Saved Bookmarks</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {bookmarks.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                        <IconStarFilled size={48} style={{ opacity: 0.2, marginBottom: '16px', color: '#f59e0b' }} />
                        <p>You haven't saved any bookmarks yet.</p>
                    </div>
                ) : (
                    bookmarks.map(item => (
                        <div
                            key={item.id}
                            onClick={() => onNavigate(item.url)}
                            style={{
                                background: 'var(--bg-sidebar)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '16px',
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}
                            className="bookmark-card"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '6px', borderRadius: '6px' }}>
                                    <IconWorld size={16} color="#f59e0b" />
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{item.title}</div>
                            </div>
                            <div style={{ color: 'var(--text-dim)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.url}</div>
                            <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end' }}>
                                <IconExternalLink size={14} color="var(--text-dim)" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default BookmarksView
