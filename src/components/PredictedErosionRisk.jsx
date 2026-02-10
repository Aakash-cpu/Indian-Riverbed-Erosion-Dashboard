import { useState, useEffect } from 'react';

const RISK_FACTORS = [
    {
        icon: '🌧️', title: 'Rainfall Intensity', level: 'High', levelColor: '#ffb74d',
        description: 'Increasing monsoon intensity and erratic rainfall projected to amplify hydraulic erosion forces.',
        trend: '+18% projected by 2040', barWidth: 78,
        barColor: 'linear-gradient(90deg, #ffb74d, #ef5350)',
    },
    {
        icon: '🏗️', title: 'Land Use Pressure', level: 'Very High', levelColor: '#ef5350',
        description: 'Built-up expansion (542% in 30 years) destabilizes riparian zones and increases runoff.',
        trend: '929 km² and growing', barWidth: 92,
        barColor: 'linear-gradient(90deg, #ef5350, #c62828)',
    },
    {
        icon: '⛰️', title: 'Slope Vulnerability', level: 'Moderate', levelColor: '#26c6da',
        description: 'Bank slope gradients with sandy soil create zones of heightened lateral erosion vulnerability.',
        trend: 'Sandy soil reduced 65%', barWidth: 55,
        barColor: 'linear-gradient(90deg, #26c6da, #0288d1)',
    },
    {
        icon: '🌊', title: 'Discharge Variability', level: 'High', levelColor: '#ffb74d',
        description: 'Seasonal discharge peaks increase frequency and magnitude of erosive events.',
        trend: 'Peak discharge +12%', barWidth: 72,
        barColor: 'linear-gradient(90deg, #ffb74d, #ff7043)',
    },
];

export default function PredictedErosionRisk({ onBack }) {
    const [animateGauge, setAnimateGauge] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateGauge(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const riskScore = 7.2;
    const maxScore = 10;
    const gaugePercentage = riskScore / maxScore;
    const circumference = Math.PI * 100;
    const dashOffset = circumference * (1 - gaugePercentage);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', gap: 0 }}>

            {/* Section Header */}
            <div className="section-header animate-in">
                <h2>⚠️ Predicted Erosion Risk</h2>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12 }}>

                {/* Top Row — Gauge + Summary + Stats */}
                <div className="animate-in animate-in-delay-1 responsive-grid-3-uneven" style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 12, flexShrink: 0 }}>

                    {/* Gauge */}
                    <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h3 style={{
                            fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: 'var(--accent-teal)', fontFamily: 'var(--font-heading)', marginBottom: 10,
                        }}>Overall Risk</h3>

                        <svg width="200" height="115" viewBox="0 0 220 120">
                            <path d="M 10 110 A 100 100 0 0 1 210 110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
                            <path
                                d="M 10 110 A 100 100 0 0 1 210 110"
                                fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round"
                                strokeDasharray={`${circumference}`}
                                strokeDashoffset={animateGauge ? dashOffset : circumference}
                                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                            />
                            <defs>
                                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#66bb6a" />
                                    <stop offset="40%" stopColor="#ffb74d" />
                                    <stop offset="70%" stopColor="#ef5350" />
                                    <stop offset="100%" stopColor="#c62828" />
                                </linearGradient>
                            </defs>
                            <text x="110" y="95" textAnchor="middle" fill="var(--text-primary)" fontSize="36" fontWeight="800" fontFamily="var(--font-heading)">
                                {riskScore}
                            </text>
                            <text x="110" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-mono)">
                                / {maxScore}
                            </text>
                        </svg>

                        <div style={{
                            marginTop: 6,
                            background: 'rgba(239, 83, 80, 0.1)',
                            border: '1px solid rgba(239, 83, 80, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '4px 16px',
                            color: '#ef5350',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-heading)',
                        }}>
                            🔴 HIGH RISK
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="glass-card animate-slide-right" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', marginBottom: 10, fontWeight: 700 }}>
                            Erosion Risk Forecast
                        </h3>
                        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 8 }}>
                            The Ganga Main Stem near Patna shows <strong style={{ color: 'var(--accent-rose)' }}>elevated and increasing vulnerability</strong> driven by rapid urban expansion (542% built-up increase) that has significantly reduced natural riparian buffers.
                        </p>
                        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                            Erosion rates projected to increase <strong style={{ color: 'var(--accent-amber)' }}>22–35%</strong> by 2040, with highest vulnerability in upstream meander zones where cropland-to-urban conversion is most aggressive.
                        </p>
                    </div>

                    {/* Key Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                            { label: 'Annual Land Loss', value: '~12.4', unit: 'km²/yr', color: '#ef5350' },
                            { label: 'Peak Risk Zone', value: 'Upstream', unit: 'meanders', color: '#ffb74d' },
                            { label: 'Vulnerable Pop.', value: '~2.1M', unit: 'people', color: '#ab47bc' },
                        ].map((stat) => (
                            <div key={stat.label} className="glass-card animate-slide-right" style={{ padding: '10px 14px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                                    {stat.label}
                                </div>
                                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: stat.color, fontFamily: 'var(--font-heading)' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    {stat.unit}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom — Risk Factors Grid */}
                <div className="animate-in animate-in-delay-2" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{
                        padding: '8px 18px',
                        background: 'rgba(0,0,0,0.1)',
                        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                        borderBottom: '1px solid var(--border-subtle)',
                        flexShrink: 0,
                    }}>
                        <h3 style={{
                            fontSize: '0.68rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-amber)',
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>Contributing Risk Factors</h3>
                    </div>
                    <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', flex: 1, minHeight: 0 }}>
                        {RISK_FACTORS.map((factor, i) => (
                            <div
                                key={factor.title}
                                className="glass-card"
                                style={{
                                    padding: '14px 16px',
                                    borderRadius: 0,
                                    borderRight: i % 2 === 0 ? '1px solid var(--border-subtle)' : 'none',
                                    borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: '1.2rem' }}>{factor.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{factor.title}</div>
                                        <span style={{ fontSize: '0.62rem', fontWeight: 700, color: factor.levelColor, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{factor.level}</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 8 }}>
                                    {factor.description}
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', height: 4, overflow: 'hidden', marginBottom: 4 }}>
                                    <div style={{ width: `${factor.barWidth}%`, height: '100%', background: factor.barColor, borderRadius: 'var(--radius-sm)', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                                </div>
                                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{factor.trend}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="glass-card animate-in animate-in-delay-3" style={{ padding: '8px 16px', textAlign: 'center', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        <strong style={{ color: 'var(--accent-amber)' }}>⚠️</strong> Predictions based on RUSLE outputs, CMIP6 climate projections, and land-use extrapolation. Actual rates may vary.
                    </p>
                </div>
            </div>
        </div>
    );
}
