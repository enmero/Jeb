import React from 'react'
import {
    IconLayoutGrid,
    IconMessageCode,
    IconBrandGithub,
    IconBrandWikipedia,
    IconSparkles,
    IconWorld
} from '@tabler/icons-react'

interface DiscoveryProps {
    query: string;
    onBrowse: () => void;
}

const Discovery: React.FC<DiscoveryProps> = ({ query, onBrowse }) => {
    // Mock data for "Unique" experience
    const isGithub = query.toLowerCase().includes('github')
    const isWiki = query.toLowerCase().includes('wiki')

    return (
        <div className="discovery-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconSparkles size={24} color="var(--accent)" />
                    <h1 style={{ fontWeight: 300, fontSize: '24px', margin: 0 }}>Discovering: <span style={{ fontWeight: 500 }}>{query}</span></h1>
                </div>
                <button
                    onClick={onBrowse}
                    style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}
                >
                    <IconWorld size={16} /> Open in Web Browser
                </button>
            </div>

            <div className="discovery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Journey Card 1 */}
                <div className="journey-card" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', transition: 'transform 0.2s', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '8px' }}>
                            <IconLayoutGrid size={20} color="var(--accent)" />
                        </div>
                        <div style={{ fontWeight: 600 }}>Overview</div>
                    </div>
                    <p style={{ color: 'var(--text-dim)', fontSize: '13px', lineHeight: '1.6' }}>
                        JEB has analyzed your request. This Journey involves exploring {query} through a curated set of data points and AI-driven insights.
                    </p>
                    <div style={{ marginTop: '16px', color: 'var(--accent)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IconSparkles size={14} /> AI Context Engine: ACTIVE (Background)
                    </div>
                </div>

                {/* Journey Card 2 (Source Specific) */}
                <div className="journey-card" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px', borderRadius: '8px' }}>
                            {isGithub ? <IconBrandGithub size={20} /> : isWiki ? <IconBrandWikipedia size={20} /> : <IconMessageCode size={20} />}
                        </div>
                        <div style={{ fontWeight: 600 }}>Source Context</div>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                        Primary node: <strong>{isGithub ? 'github.com' : isWiki ? 'wikipedia.org' : 'Web Archive'}</strong>
                        <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            "The most efficient way to navigate {query} is via direct node interaction."
                        </div>
                    </div>
                </div>

                {/* "Beyond" Node */}
                <div className="journey-card" style={{ background: 'var(--bg-main)', border: '1px dashed var(--accent)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                        <IconSparkles size={80} color="var(--accent)" />
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: '16px' }}>Beyond Insight</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                        JEB Suggests: Explore the historical context of {query} to unlock deeper understanding.
                    </div>
                    <div style={{ marginTop: '20px', color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Beyond Protocol Layer 1 Active
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Discovery
