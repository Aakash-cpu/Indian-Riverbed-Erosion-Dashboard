export default function PresentErosionRate({ onBack, onZoom }) {
    const erosionLegend = [
        { color: '#1a7a32', label: 'Very Low (<2)' },
        { color: '#90ee90', label: 'Low (2-5)' },
        { color: '#ffd700', label: 'Moderate (5-10)' },
        { color: '#ffa500', label: 'High (10-20)' },
        { color: '#ff4500', label: 'Severe (20-40)' },
        { color: '#8b0000', label: 'Extreme (>40)' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', gap: 0 }}>

            {/* Section Header */}
            <div className="section-header animate-in">
                <h2>📊 Present Erosion Rate</h2>
            </div>

            {/* Map — fills available width, covers the container, no side gaps */}
            <div className="animate-in animate-in-delay-1" style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                paddingTop: 10,
            }}>
                <div
                    className="glass-card"
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                        cursor: 'zoom-in',
                        position: 'relative',
                    }}
                    onClick={() => onZoom('/images/PNG 1.png')}
                >
                    <img
                        src="/images/PNG 1.png"
                        alt="Erosion Susceptibility Map"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                    {/* Overlay label — top left */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 100%)',
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <h3 style={{
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-heading)',
                            color: '#fff',
                            fontStyle: 'italic',
                            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                        }}>
                            Erosion Susceptibility — Ganga Basin (Patna)
                        </h3>
                        <span style={{
                            fontSize: '0.62rem',
                            color: 'rgba(255,255,255,0.7)',
                            fontFamily: 'var(--font-mono)',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                        }}>
                            🔍 Click to zoom
                        </span>
                    </div>
                </div>

                {/* Bottom info strip — RUSLE + Legend + Link — all horizontal */}
                <div className="responsive-grid-3" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    gap: 10,
                    flexShrink: 0,
                }}>
                    {/* RUSLE Panel */}
                    <div className="rusle-panel animate-in animate-in-delay-2" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <div style={{ flexShrink: 0 }}>
                            <div className="rusle-title" style={{ marginBottom: 6 }}>RUSLE Model</div>
                            <div className="rusle-formula" style={{ marginBottom: 0, fontSize: '0.82rem' }}>
                                Ep = R × K × LS × C × P
                            </div>
                        </div>
                        <dl className="rusle-params" style={{ fontSize: '0.7rem' }}>
                            <dt>R</dt><dd>Rainfall Erosivity</dd>
                            <dt>K</dt><dd>Soil Erodibility</dd>
                            <dt>LS</dt><dd>Slope Length & Steepness</dd>
                            <dt>C</dt><dd>Cover Management</dd>
                            <dt>P</dt><dd>Conservation Practice</dd>
                        </dl>
                    </div>

                    {/* Erosion Risk Legend — compact horizontal */}
                    <div className="legend-card animate-in animate-in-delay-3" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '10px 18px',
                    }}>
                        <h4 style={{ whiteSpace: 'nowrap', marginBottom: 0, fontSize: '0.7rem' }}>
                            Erosion Risk<br /><span style={{ fontSize: '0.6rem', fontWeight: 400, color: '#666' }}>(t/ha/yr)</span>
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px 14px' }}>
                            {erosionLegend.map((item) => (
                                <div className="legend-item" key={item.label} style={{ padding: '1px 0' }}>
                                    <div className="legend-color" style={{ background: item.color, width: 14, height: 10 }} />
                                    <span style={{ fontSize: '0.66rem' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RUSLE Mapper Link */}
                    <div className="glass-card animate-in animate-in-delay-4" style={{
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                    }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                                Analyze erosion rate in high resolution using the <strong style={{ color: 'var(--accent-sky)' }}>RUSLE Erosion Mapper</strong>.
                            </p>
                            <a
                                href="https://my-project-68659-rusle.projects.earthengine.app/view/rusle-soil-erosion-mapper-tool"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-button"
                                style={{ width: '100%', justifyContent: 'center', fontSize: '0.74rem' }}
                            >
                                🗺️ Open RUSLE Erosion Mapper
                            </a>
                            <p style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 4, textAlign: 'center' }}>
                                By River HOP Team · Opens in new tab
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
