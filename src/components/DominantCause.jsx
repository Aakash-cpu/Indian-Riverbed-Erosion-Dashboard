import { useState } from 'react';
import LandUseChangeDashboard from './LandUseChangeDashboard';

const SATELLITE_IMAGES = [
    { year: '1995', src: '/images/PNG 3.png' },
    { year: '2005', src: '/images/PNG 4.png' },
    { year: '2015', src: '/images/PNG 5.png' },
    { year: '2025', src: '/images/PNG 6.png' },
];

const LAND_USE_CLASSES = [
    { color: '#00008B', label: 'Water Bodies' },
    { color: '#E74C3C', label: 'Built-Up' },
    { color: '#C9956B', label: 'Sandy Soil' },
    { color: '#1a6b32', label: 'Trees' },
    { color: '#FFD700', label: 'Open Fields' },
    { color: '#FFFF99', label: 'Croplands' },
];

export default function DominantCause({ onBack, onZoom }) {
    const [showStats, setShowStats] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', gap: 0 }}>

            {/* Section Header */}
            <div className="section-header animate-in">
                <h2>🔍 Dominant Cause</h2>
            </div>

            {/* Main Content — fills remaining space */}
            {!showStats ? (
                <div className="animate-in animate-in-delay-1 responsive-grid-sidebar" style={{
                    display: 'grid',
                    gridTemplateColumns: '300px 1fr',
                    gap: 12,
                    flex: 1,
                    minHeight: 0,
                    paddingTop: 12,
                }}>

                    {/* Left Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
                        <div className="glass-card" style={{ padding: '16px 18px', flexShrink: 0 }}>
                            <h3 style={{
                                fontSize: '0.82rem',
                                fontFamily: 'var(--font-heading)',
                                color: 'var(--text-primary)',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                textDecorationColor: 'var(--accent-teal)',
                                textUnderlineOffset: 3,
                                marginBottom: 10,
                            }}>
                                Dominant Cause:
                            </h3>
                            <p style={{
                                fontSize: '0.95rem',
                                fontFamily: 'var(--font-heading)',
                                color: 'var(--text-primary)',
                                fontStyle: 'italic',
                                fontWeight: 500,
                                lineHeight: 1.35,
                                marginBottom: 12,
                            }}>
                                Cropland Conversion and Built-up Pressure
                            </p>

                            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-amber)', fontStyle: 'italic', marginBottom: 8 }}>
                                    Year-wise Analysis of Area Under Change
                                </h4>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                                    Satellite imagery reveals significant land use transformation across the river corridor from 1995 to 2025. Built-up areas expanded dramatically while croplands fragmented.
                                </p>
                                <button
                                    onClick={() => setShowStats(true)}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(26, 198, 218, 0.1), rgba(79, 195, 247, 0.06))',
                                        border: '1px solid rgba(26, 198, 218, 0.2)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '8px 14px',
                                        color: 'var(--accent-sky)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-heading)',
                                        width: '100%',
                                        transition: 'all 0.25s',
                                    }}
                                >
                                    📈 Open Statistical Analysis
                                </button>
                            </div>
                        </div>

                        {/* Land Use Legend */}
                        <div className="legend-card animate-slide-left animate-in-delay-3" style={{ flex: 1, minHeight: 0 }}>
                            <h4>Land Use Classes</h4>
                            {LAND_USE_CLASSES.map((item) => (
                                <div className="legend-item" key={item.label}>
                                    <div className="legend-color" style={{ background: item.color }} />
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Satellite Images */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
                        <div className="image-grid animate-scale" style={{ flex: 1, minHeight: 0 }}>
                            {SATELLITE_IMAGES.map((img) => (
                                <div
                                    key={img.year}
                                    className="image-card"
                                    onClick={() => onZoom(img.src)}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="image-card-label">{img.year}</div>
                                    <img src={img.src} alt={`Land use ${img.year}`} />
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <span style={{
                                display: 'inline-block',
                                background: 'rgba(239, 83, 80, 0.08)',
                                border: '1px solid rgba(239, 83, 80, 0.2)',
                                color: 'var(--accent-rose)',
                                padding: '5px 14px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                fontFamily: 'var(--font-heading)',
                            }}>
                                🔎 Click images to zoom
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                /* Statistical Analysis View — full viewport */
                <div className="animate-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', paddingTop: 12 }}>
                    <div className="glass-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{
                            padding: '8px 20px',
                            background: 'rgba(255, 183, 77, 0.05)',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                        }}>
                            <h3 style={{
                                fontSize: '0.75rem',
                                fontFamily: 'var(--font-heading)',
                                color: 'var(--accent-amber)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                            }}>
                                📈 Land Use Change Detection (1995–2025)
                            </h3>
                            <button
                                onClick={() => setShowStats(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '4px 12px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-body)',
                                    transition: 'all 0.25s',
                                }}
                            >
                                ← Back to Images
                            </button>
                        </div>
                        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 16 }}>
                            <LandUseChangeDashboard />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
