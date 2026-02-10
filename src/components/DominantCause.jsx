import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
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

// ── Raw transition data (t1-t2-t3-t4|area) ──
const RAW_DATA = `Croplands - OpenFields - OpenFields - OpenFields|217.485939
Croplands - OpenFields - OpenFields - Croplands|137.83361
Croplands - OpenFields - OpenFields - BuiltUp|117.679303
OpenFields - OpenFields - OpenFields - OpenFields|160.762914
OpenFields - OpenFields - OpenFields - Croplands|114.768857
Croplands - Croplands - OpenFields - OpenFields|104.573202
OpenFields - OpenFields - OpenFields - BuiltUp|81.598757
Croplands - Croplands - OpenFields - Croplands|86.707598
Croplands - OpenFields - Croplands - Croplands|72.118311
Croplands - OpenFields - Croplands - OpenFields|75.681831
OpenFields - OpenFields - Croplands - Croplands|45.832401
OpenFields - OpenFields - Croplands - OpenFields|60.285344
Croplands - OpenFields - OpenFields - Trees|23.311507
Trees - Trees - Trees - Trees|53.411547
SandySoil - OpenFields - OpenFields - OpenFields|55.336196
Croplands - BuiltUp - OpenFields - BuiltUp|26.218046
Croplands - BuiltUp - OpenFields - Croplands|26.336938
Croplands - BuiltUp - OpenFields - OpenFields|27.887264
Croplands - Trees - OpenFields - Croplands|37.436147
Croplands - Trees - OpenFields - OpenFields|37.994888
Croplands - BuiltUp - BuiltUp - BuiltUp|39.000111
Croplands - OpenFields - BuiltUp - BuiltUp|38.921241
Croplands - OpenFields - BuiltUp - Croplands|36.67465
Croplands - OpenFields - BuiltUp - OpenFields|33.711287
Croplands - Croplands - Croplands - Croplands|42.195809
Croplands - Croplands - OpenFields - BuiltUp|38.398081
OpenFields - Croplands - OpenFields - OpenFields|45.405238
OpenFields - OpenFields - OpenFields - Water|19.637142
Trees - Trees - Trees - Croplands|15.671278
Trees - Croplands - OpenFields - Croplands|14.860618
Croplands - Trees - BuiltUp - Croplands|25.65027
Croplands - Trees - BuiltUp - BuiltUp|25.335523
Croplands - BuiltUp - BuiltUp - Croplands|24.382266
Trees - Trees - OpenFields - Croplands|13.194377
Trees - Trees - OpenFields - Trees|13.161293
Croplands - Trees - OpenFields - BuiltUp|27.75723
Croplands - Trees - OpenFields - Trees|13.311867
Croplands - OpenFields - OpenFields - SandySoil|7.174127
Croplands - OpenFields - OpenFields - Water|13.014787
SandySoil - OpenFields - OpenFields - BuiltUp|25.420927
OpenFields - Croplands - Croplands - OpenFields|38.341585
OpenFields - Croplands - Croplands - Croplands|24.536335
Trees - Trees - BuiltUp - Croplands|16.463333
Croplands - Croplands - Croplands - OpenFields|14.641729
Croplands - Croplands - Trees - OpenFields|15.459909
OpenFields - Croplands - OpenFields - Croplands|38.569748
OpenFields - OpenFields - OpenFields - Trees|19.408209
OpenFields - OpenFields - OpenFields - SandySoil|8.257052
Croplands - Trees - Trees - Croplands|12.07662
Croplands - Croplands - Croplands - Trees|12.294067
OpenFields - Croplands - OpenFields - BuiltUp|15.047161
Croplands - BuiltUp - BuiltUp - OpenFields|15.114833
Croplands - OpenFields - SandySoil - Croplands|14.149481
Croplands - OpenFields - Trees - OpenFields|17.178922
Croplands - Trees - Croplands - Croplands|15.483032
Trees - Trees - BuiltUp - BuiltUp|10.991839
Trees - OpenFields - OpenFields - Croplands|15.91986
Trees - OpenFields - OpenFields - OpenFields|13.971524
Croplands - Croplands - Trees - Croplands|11.535303
OpenFields - OpenFields - Croplands - BuiltUp|27.04279
Trees - OpenFields - OpenFields - BuiltUp|10.502633
Croplands - OpenFields - SandySoil - OpenFields|11.726531
Trees - Croplands - OpenFields - OpenFields|10.526523
Croplands - OpenFields - SandySoil - BuiltUp|12.626418
Trees - Trees - BuiltUp - OpenFields|2.834814
Croplands - Trees - Trees - Trees|17.76863
Trees - Trees - Trees - OpenFields|2.362235
Trees - Trees - BuiltUp - Trees|9.775876
Trees - Croplands - Trees - Trees|14.201534`;

function parseAndAggregate() {
    const agg = {};
    RAW_DATA.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const [transition, area] = trimmed.split('|');
        if (!transition || area == null) return;
        const parts = transition.split(' - ');
        if (parts.length !== 4) return;
        const key = `${parts[0]} → ${parts[3]}`;
        agg[key] = (agg[key] || 0) + parseFloat(area);
    });
    return Object.entries(agg)
        .map(([name, area]) => ({ name, area: Math.round(area * 100) / 100 }))
        .sort((a, b) => b.area - a.area);
}

const CHART_COLORS = ['#E74C3C', '#f39c12', '#2ecc71', '#27ae60', '#3498db', '#d4a574', '#9b59b6', '#e67e22', '#1abc9c', '#e74c3c'];

function getToColor(name) {
    const to = name.split(' → ')[1];
    return LAND_USE_COLORS[to] || '#95a5a6';
}

export default function DominantCause({ onBack, onZoom }) {
    const [showStats, setShowStats] = useState(false);

    const aggregated = useMemo(() => parseAndAggregate(), []);
    const barData = useMemo(() => aggregated.slice(0, 8), [aggregated]);
    const pieData = useMemo(() => aggregated.slice(0, 8), [aggregated]);

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
                    gap: 8,
                    paddingTop: 10,
                }}>
                    {/* Top Area — Images Left, Info+Charts Right */}
                    <div className="dominant-cause-main responsive-grid-2" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 10,
                        flex: 1,
                        minHeight: 0,
                    }}>

                        {/* Left — 2×2 Satellite Image Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6, minHeight: 0 }}>
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
                                    }}
                                    onClick={() => onZoom(img.src)}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: 4,
                                        left: 4,
                                        background: 'rgba(239,83,80,0.9)',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.62rem',
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-mono)',
                                        zIndex: 2,
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

                        {/* Right — Info panel + Charts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
                            {/* Dominant Cause Info (compact) */}
                            <div className="glass-card" style={{ padding: '10px 14px', flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '0.72rem',
                                            fontFamily: 'var(--font-heading)',
                                            color: 'var(--text-primary)',
                                            fontWeight: 700,
                                            textDecoration: 'underline',
                                            textDecorationColor: 'var(--accent-teal)',
                                            textUnderlineOffset: 3,
                                            marginBottom: 4,
                                        }}>
                                            Dominant Cause:
                                        </h3>
                                        <p style={{
                                            fontSize: '0.82rem',
                                            fontFamily: 'var(--font-heading)',
                                            color: 'var(--text-primary)',
                                            fontStyle: 'italic',
                                            fontWeight: 500,
                                            lineHeight: 1.3,
                                        }}>
                                            Cropland Conversion and Built-up Pressure
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowStats(true)}
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(26, 198, 218, 0.1), rgba(79, 195, 247, 0.06))',
                                            border: '1px solid rgba(26, 198, 218, 0.2)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '6px 12px',
                                            color: 'var(--accent-sky)',
                                            fontSize: '0.65rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontFamily: 'var(--font-heading)',
                                            transition: 'all 0.25s',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        📈 Statistical Analysis
                                    </button>
                                </div>
                                <p style={{ fontSize: '0.66rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                    Satellite imagery reveals significant land use transformation (1995–2025). Built-up areas expanded 542% while croplands fragmented.
                                </p>
                            </div>

                            {/* Charts Section — Bar + Pie side by side */}
                            <div className="responsive-grid-2" style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 8,
                                flex: 1,
                                minHeight: 0,
                            }}>
                                {/* Bar Chart */}
                                <div className="glass-card" style={{ padding: '10px 10px 4px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{
                                        fontSize: '0.62rem',
                                        fontFamily: 'var(--font-heading)',
                                        color: 'var(--accent-amber)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: 6,
                                        flexShrink: 0,
                                    }}>
                                        🎯 Top Land Use Changes (km²)
                                    </h4>
                                    <div style={{ flex: 1, minHeight: 0 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={barData}
                                                layout="vertical"
                                                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
                                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                                />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    width={100}
                                                    tick={{ fill: 'var(--text-secondary)', fontSize: 8 }}
                                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: 'rgba(10, 14, 39, 0.95)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        fontSize: '0.72rem',
                                                        color: '#fff',
                                                    }}
                                                    formatter={(value) => [`${value.toFixed(2)} km²`, 'Area']}
                                                />
                                                <Bar dataKey="area" radius={[0, 4, 4, 0]}>
                                                    {barData.map((entry, index) => (
                                                        <Cell key={`bar-${index}`} fill={getToColor(entry.name)} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="glass-card" style={{ padding: '10px 10px 4px', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                                    <h4 style={{
                                        fontSize: '0.62rem',
                                        fontFamily: 'var(--font-heading)',
                                        color: 'var(--accent-amber)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: 6,
                                        flexShrink: 0,
                                    }}>
                                        🥧 Change Distribution
                                    </h4>
                                    <div style={{ flex: 1, minHeight: 0 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    dataKey="area"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius="80%"
                                                    innerRadius="35%"
                                                    label={({ name, percent }) =>
                                                        `${name.split(' → ')[1]} ${(percent * 100).toFixed(1)}%`
                                                    }
                                                    labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                                                    strokeWidth={1}
                                                    stroke="rgba(0,0,0,0.3)"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`pie-${index}`} fill={getToColor(entry.name)} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        background: 'rgba(10, 14, 39, 0.95)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: 8,
                                                        fontSize: '0.72rem',
                                                        color: '#fff',
                                                    }}
                                                    formatter={(value) => [`${value.toFixed(2)} km²`, 'Area']}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Ribbon — Legend + Zoom Hint */}
                    <div className="glass-card animate-in animate-in-delay-2" style={{
                        padding: '6px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                        flexWrap: 'wrap',
                        gap: 8,
                    }}>
                        {/* Legend — horizontal */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                fontFamily: 'var(--font-heading)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginRight: 4,
                            }}>
                                Land Use Classes:
                            </span>
                            {LAND_USE_CLASSES.map((item) => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{
                                        width: 12,
                                        height: 10,
                                        borderRadius: 2,
                                        background: item.color,
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        flexShrink: 0,
                                    }} />
                                    <span style={{
                                        fontSize: '0.6rem',
                                        color: 'var(--text-secondary)',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Zoom Hint */}
                        <span style={{
                            background: 'rgba(239, 83, 80, 0.08)',
                            border: '1px solid rgba(239, 83, 80, 0.2)',
                            color: 'var(--accent-rose)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-heading)',
                            whiteSpace: 'nowrap',
                        }}>
                            🔎 Click images to zoom
                        </span>
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
