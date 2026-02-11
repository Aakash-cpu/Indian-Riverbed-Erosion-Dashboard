import { useState, useMemo, useEffect, useRef } from 'react';

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

const LAND_USE_COLORS = {
    BuiltUp: '#E74C3C',
    Croplands: '#f39c12',
    OpenFields: '#2ecc71',
    SandySoil: '#d4a574',
    Trees: '#27ae60',
    Water: '#3498db',
};



export default function DominantCause({ onBack, onZoom }) {
    const [showStats, setShowStats] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', gap: 0 }}>

            {/* Section Header */}
            <div className="section-header animate-in">
                <h2>🔍 Dominant Cause</h2>
            </div>

            {/* Main Content */}
            {!showStats ? (
                <div className="animate-in animate-in-delay-1" style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    paddingTop: 12,
                }}>
                    {/* Two Column Layout - 38:62 Split for better balance */}
                    <div className="dominant-cause-main responsive-grid-2" style={{
                        display: 'grid',
                        gridTemplateColumns: '38fr 62fr',
                        gap: 12,
                        flex: 1,
                        minHeight: 0,
                    }}>

                        {/* Left — Info Panel + Bar Chart (Full Height) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0, height: '100%' }}>
                            {/* Dominant Cause Info */}
                            <div className="glass-card" style={{ padding: '22px 26px' }}>
                                <div style={{ marginBottom: 10 }}>
                                    <h3 style={{
                                        fontSize: '0.88rem',
                                        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                        color: 'rgba(255, 255, 255, 0.95)',
                                        fontWeight: 700,
                                        marginBottom: 10,
                                        letterSpacing: '0.03em',
                                        textTransform: 'uppercase',
                                    }}>
                                        Dominant Cause:
                                    </h3>
                                    <p style={{
                                        fontSize: '1.15rem',
                                        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                        color: 'rgba(255, 255, 255, 0.98)',
                                        fontWeight: 600,
                                        lineHeight: 1.5,
                                        marginBottom: 18,
                                        letterSpacing: '-0.01em',
                                    }}>
                                        Cropland Conversion and Built-up Pressure
                                    </p>
                                    <h4 style={{
                                        fontSize: '0.82rem',
                                        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                        color: '#ffb74d',
                                        fontWeight: 700,
                                        marginBottom: 10,
                                        letterSpacing: '0.02em',
                                        textTransform: 'uppercase',
                                    }}>
                                        Year-wise Analysis (1995–2025)
                                    </h4>
                                    <p style={{
                                        fontSize: '0.82rem',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        lineHeight: 1.7,
                                        marginBottom: 16,
                                        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                    }}>
                                        Satellite imagery reveals significant land use transformation across the river corridor. Built-up areas expanded dramatically while croplands fragmented.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowStats(true)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(26, 198, 218, 0.1)',
                                        border: '1px solid rgba(26, 198, 218, 0.35)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '11px 18px',
                                        color: 'var(--accent-sky)',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                        transition: 'all 0.25s',
                                        letterSpacing: '0.02em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    📊 Open Statistical Analysis
                                </button>
                            </div>

                            {/* Bar Chart — Full Remaining Height */}
                            <div
                                onClick={() => onZoom('/images/top_20_land_use_chart1.png')}
                                style={{
                                    flex: 1,
                                    minHeight: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'rgba(255, 255, 255, 0.04)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                                    backdropFilter: 'blur(12px)',
                                    position: 'relative',
                                    cursor: 'zoom-in',
                                    transition: 'all 0.2s ease',
                                }}>
                                <img
                                    src="/images/top_20_land_use_chart1.png"
                                    alt="Land Use Transition Analysis"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                        padding: 0
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right — Satellite Images + Legend */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
                            {/* 2×2 Satellite Image Grid */}
                            <div style={{
                                flex: 1,
                                minHeight: 0,
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gridTemplateRows: '1fr 1fr',
                                gap: 8
                            }}>
                                {SATELLITE_IMAGES.map((img) => (
                                    <div
                                        key={img.year}
                                        className="glass-card"
                                        style={{
                                            overflow: 'hidden',
                                            cursor: 'zoom-in',
                                            position: 'relative',
                                            padding: 0,
                                            minHeight: 0,
                                            transition: 'all 0.3s ease',
                                        }}
                                        onClick={() => onZoom(img.src)}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: 6,
                                            left: 6,
                                            background: 'rgba(239,83,80,0.92)',
                                            color: '#fff',
                                            padding: '3px 10px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.68rem',
                                            fontWeight: 800,
                                            fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI Mono', monospace",
                                            zIndex: 2,
                                            letterSpacing: '0.03em',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                        }}>
                                            {img.year}
                                        </div>
                                        <img
                                            src={img.src}
                                            alt={`Land use ${img.year}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Legend Ribbon + Zoom Hint */}
                            <div className="glass-card animate-in animate-in-delay-2" style={{
                                padding: '8px 18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0,
                                flexWrap: 'wrap',
                                gap: 10,
                            }}>
                                {/* Legend — horizontal */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                                    <span style={{
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        color: 'rgba(255, 255, 255, 0.95)',
                                        fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        marginRight: 4,
                                    }}>
                                        Land Use Classes:
                                    </span>
                                    {LAND_USE_CLASSES.map((item) => (
                                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <div style={{
                                                width: 13,
                                                height: 11,
                                                borderRadius: 2.5,
                                                background: item.color,
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                flexShrink: 0,
                                            }} />
                                            <span style={{
                                                fontSize: '0.66rem',
                                                color: 'rgba(255, 255, 255, 0.75)',
                                                whiteSpace: 'nowrap',
                                                fontWeight: 600,
                                                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                                letterSpacing: '0.01em',
                                            }}>
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Zoom Hint */}
                                <span style={{
                                    background: 'rgba(239, 83, 80, 0.1)',
                                    border: '1px solid rgba(239, 83, 80, 0.25)',
                                    color: 'var(--accent-rose)',
                                    padding: '5px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.66rem',
                                    fontWeight: 700,
                                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                    whiteSpace: 'nowrap',
                                    letterSpacing: '0.02em',
                                }}>
                                    🔎 Click images to zoom
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Statistical Analysis View — full viewport */
                <div className="animate-in" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', paddingTop: 12 }}>
                    <div className="glass-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{
                            padding: '10px 22px',
                            background: 'rgba(255, 183, 77, 0.06)',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                        }}>
                            <h3 style={{
                                fontSize: '0.8rem',
                                fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                color: 'var(--accent-amber)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.07em',
                                fontWeight: 800,
                            }}>
                                📈 Land Use Change Detection (1995–2025)
                            </h3>
                            <button
                                onClick={() => setShowStats(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '5px 14px',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontFamily: "'Inter', -apple-system, system-ui, 'Segoe UI', sans-serif",
                                    transition: 'all 0.25s',
                                    fontWeight: 600,
                                }}
                            >
                                ← Back to Images
                            </button>
                        </div>
                        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 18 }}>
                            <LandUseChangeDashboard />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}