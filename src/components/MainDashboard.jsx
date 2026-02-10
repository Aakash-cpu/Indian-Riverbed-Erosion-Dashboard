import { useState } from 'react';

const RIVERS = [
    { id: 1, name: 'Ganga (Main Stem)', state: 'Bihar', district: 'Patna', active: true, location: 'Patna, Bihar', coverage: '~151 Kms' },
    { id: 2, name: 'Kosi River', state: 'Bihar', district: 'Supaul', active: false },
    { id: 3, name: 'Brahmaputra', state: 'Assam', district: 'Dhubri', active: false },
    { id: 4, name: 'Ghaghara River', state: 'Uttar Pradesh', district: 'Ballia', active: false },
    { id: 5, name: 'Gandak River', state: 'Bihar', district: 'Saran', active: false },
    { id: 6, name: 'Yamuna River', state: 'Uttar Pradesh', district: 'Prayagraj', active: false },
    { id: 7, name: 'Son River', state: 'Bihar', district: 'Bhojpur', active: false },
    { id: 8, name: 'Teesta River', state: 'West Bengal', district: 'Jalpaiguri', active: false },
    { id: 9, name: 'Mahananda River', state: 'Bihar', district: 'Katihar', active: false },
    { id: 10, name: 'Damodar River', state: 'Jharkhand', district: 'Dhanbad', active: false },
];

const TIMELAPSE_GIF = '/images/timelapse.gif';

export default function MainDashboard({ selectedRiver, onSelectRiver, onNavigate }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    const actionCards = [
        { key: 'erosion-rate', title: 'Present Erosion Rate', icon: '📊', desc: 'RUSLE-based susceptibility mapping' },
        { key: 'dominant-cause', title: 'Dominant Cause', icon: '🔍', desc: 'Land-use change & driving factors' },
        { key: 'predicted-risk', title: 'Predicted Erosion Risk', icon: '⚠️', desc: 'Future risk projections' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflow: 'hidden' }}>

            {/* Top — Intro + Table */}
            <div className="animate-in responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: selectedRiver ? '0 0 auto' : '1 1 auto', minHeight: 0 }}>

                {/* Left — Intro */}
                <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.65 }}>
                        Riverbank erosion is intensifying globally as climate-induced changes in rainfall and discharge amplify hydraulic forces along river margins. Increasing erosion rates pose serious risks to land resources, riparian stability, and long-term river system sustainability.
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.65 }}>
                        This is an integrated database on Indian riverbank erosion, offering present conditions, key drivers, and future risk predictions under climate change. The analysis involved usage of <strong style={{ color: 'var(--accent-teal)' }}>LiDAR DEMs</strong> and <strong style={{ color: 'var(--accent-teal)' }}>satellite images</strong>.
                    </p>

                    {/* Google Earth Engine Timelapse GIF */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        flex: 1,
                        minHeight: 0,
                    }}>
                        <img
                            src={TIMELAPSE_GIF}
                            alt="Satellite timelapse — Ganga near Patna (1995–2024)"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                        />
                    </div>
                    <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 2 }}>
                        🛰️ RGB Optical Timelapse (1995–2024) · Google Earth Engine
                    </p>
                </div>

                {/* Right — Data Table */}
                <div className="glass-card animate-slide-right" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        background: 'rgba(26, 198, 218, 0.05)',
                        padding: '10px 16px',
                        borderBottom: '1px solid var(--border-subtle)',
                        flexShrink: 0,
                    }}>
                        <h3 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            River / Basin Database
                        </h3>
                    </div>
                    <div style={{ flex: 1, overflow: 'auto' }}>
                        <table className="river-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 40 }}>Sr.</th>
                                    <th>River / Basin Name</th>
                                    <th>State</th>
                                    <th>District</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RIVERS.map((river) => (
                                    <tr
                                        key={river.id}
                                        className={river.active ? 'active-row' : 'inactive-row'}
                                        onClick={() => river.active && onSelectRiver(river)}
                                        style={selectedRiver?.id === river.id ? {
                                            background: 'rgba(26, 198, 218, 0.15)',
                                            boxShadow: 'inset 3px 0 0 var(--accent-teal)',
                                        } : {}}
                                    >
                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>{river.id}</td>
                                        <td style={{ fontWeight: river.active ? 600 : 400 }}>
                                            {river.active && <span style={{ color: 'var(--accent-teal)', marginRight: 4 }}>●</span>}
                                            {river.name}
                                        </td>
                                        <td>{river.state}</td>
                                        <td>{river.district}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{
                        padding: '8px 16px',
                        borderTop: '1px solid var(--border-subtle)',
                        background: 'rgba(0,0,0,0.1)',
                        fontSize: '0.65rem',
                        color: 'var(--text-muted)',
                        flexShrink: 0,
                    }}>
                        Select an active river to proceed with erosion analysis.
                    </div>
                </div>
            </div>

            {/* Bottom — Prompt or Cards */}
            {!selectedRiver ? (
                <div className="glass-card animate-in animate-in-delay-1" style={{
                    padding: '20px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    flexShrink: 0,
                }}>
                    <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>👆</span>
                    <div>
                        <h3 style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Select a River in the Above Table to Proceed
                        </h3>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            Click on an active river row to view its erosion analysis
                        </p>
                    </div>
                </div>
            ) : (
                <div className="animate-in responsive-grid-4" style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr 1fr', gap: 10, flexShrink: 0 }}>

                    {/* Info Card */}
                    <div className="info-panel animate-scale">
                        <h3>Selected River</h3>
                        <div className="info-row">
                            <span className="info-label">River</span>
                            <span className="info-value" style={{ fontSize: '0.74rem' }}>{selectedRiver.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Location</span>
                            <span className="info-value">{selectedRiver.location}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Coverage</span>
                            <span className="info-value">{selectedRiver.coverage}</span>
                        </div>
                        <div style={{
                            marginTop: 10,
                            padding: '6px 10px',
                            background: 'rgba(102, 187, 106, 0.08)',
                            border: '1px solid rgba(102, 187, 106, 0.18)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.65rem',
                            color: 'var(--accent-emerald)',
                        }}>
                            ✓ Data Available
                        </div>
                    </div>

                    {/* Action Cards */}
                    {actionCards.map((card, i) => (
                        <div
                            key={card.key}
                            className={`action-card animate-slide-right`}
                            style={{ animationDelay: `${0.08 * (i + 1)}s` }}
                            onClick={() => onNavigate(card.key)}
                            onMouseEnter={() => setHoveredCard(card.key)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className="action-card-icon">{card.icon}</div>
                            <div className="action-card-title">{card.title}</div>
                            <p style={{
                                fontSize: '0.68rem',
                                color: 'var(--text-muted)',
                                marginTop: 4,
                                position: 'relative',
                                zIndex: 1,
                            }}>{card.desc}</p>
                            <div style={{
                                marginTop: 8,
                                fontSize: '0.65rem',
                                color: 'var(--accent-teal)',
                                fontFamily: 'var(--font-mono)',
                                position: 'relative',
                                zIndex: 1,
                                opacity: hoveredCard === card.key ? 1 : 0.5,
                                transition: 'opacity 0.25s',
                            }}>
                                Click to explore →
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
