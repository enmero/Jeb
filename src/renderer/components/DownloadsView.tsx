import React from 'react'
import { IconDownload, IconFile, IconX, IconCheck, IconProgress } from '@tabler/icons-react'

export interface DownloadItem {
    id: string;
    name: string;
    totalBytes: number;
    receivedBytes: number;
    url: string;
    state: 'progressing' | 'completed' | 'interrupted' | 'paused';
    timestamp: number;
}

interface DownloadsViewProps {
    downloads: DownloadItem[];
    onClear: () => void;
}

const DownloadsView: React.FC<DownloadsViewProps> = ({ downloads, onClear }) => {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '40px' }} className="history-scroll-container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <IconDownload size={24} color="var(--accent)" />
                        <h1 style={{ fontWeight: 300, fontSize: '24px', margin: 0 }}>Downloads</h1>
                    </div>
                    {downloads.length > 0 && (
                        <button
                            onClick={onClear}
                            className="sidebar-btn"
                            style={{ color: 'var(--text-dim)', fontSize: '12px', padding: '8px 16px' }}
                        >
                            Clear List
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {downloads.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                            <IconDownload size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <p>No downloads yet.</p>
                        </div>
                    ) : (
                        downloads.map(item => (
                            <div
                                key={item.id}
                                style={{
                                    background: 'var(--bg-sidebar)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                            >
                                <div style={{ background: 'var(--bg-hover)', padding: '10px', borderRadius: '10px' }}>
                                    {item.state === 'completed' ? (
                                        <IconCheck size={20} color="#10b981" />
                                    ) : item.state === 'progressing' ? (
                                        <IconProgress size={20} color="var(--accent)" className="spin" />
                                    ) : (
                                        <IconFile size={20} color="var(--text-dim)" />
                                    )}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                        <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                                            {formatBytes(item.receivedBytes)} of {item.totalBytes > 0 ? formatBytes(item.totalBytes) : 'Unknown size'}
                                        </div>
                                        <div style={{ color: 'var(--accent)', fontSize: '11px', fontWeight: 600, textTransform: 'capitalize' }}>
                                            {item.state}
                                        </div>
                                    </div>
                                    {item.state === 'progressing' && item.totalBytes > 0 && (
                                        <div style={{ width: '100%', height: '3px', background: 'var(--bg-hover)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${(item.receivedBytes / item.totalBytes) * 100}%`,
                                                height: '100%',
                                                background: 'var(--accent)',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    )}
                                </div>
                                {item.state === 'progressing' && (
                                    <button className="tab-close-btn">
                                        <IconX size={14} />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default DownloadsView
