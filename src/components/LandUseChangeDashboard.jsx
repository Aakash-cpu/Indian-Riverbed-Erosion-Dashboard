import { useState, useMemo, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const CATEGORIES = ["BuiltUp", "Croplands", "OpenFields", "SandySoil", "Trees", "Water"];
const PERIODS = ["1995", "2005", "2015", "2025"];

const COLORS = {
    BuiltUp: "#E74C3C",
    Croplands: "#F39C12",
    OpenFields: "#E8D5A3",
    SandySoil: "#C9956B",
    Trees: "#27AE60",
    Water: "#3498DB",
};

const LABELS = {
    BuiltUp: "Built-Up",
    Croplands: "Croplands",
    OpenFields: "Open Fields",
    SandySoil: "Sandy Soil",
    Trees: "Trees",
    Water: "Water",
};

const TOTALS = {
    "1995": { BuiltUp: 144.75, Croplands: 1945.69, OpenFields: 1104.51, SandySoil: 422.18, Trees: 416.05, Water: 242.88 },
    "2005": { BuiltUp: 476.14, Croplands: 795.71, OpenFields: 1968.21, SandySoil: 152.50, Trees: 573.18, Water: 310.32 },
    "2015": { BuiltUp: 606.60, Croplands: 730.62, OpenFields: 2179.04, SandySoil: 251.81, Trees: 297.09, Water: 210.90 },
    "2025": { BuiltUp: 928.97, Croplands: 1123.64, OpenFields: 1361.31, SandySoil: 146.50, Trees: 376.45, Water: 339.20 },
};

const FLOWS = {
    "1995-2005": { "BuiltUp->BuiltUp": 60.73, "BuiltUp->Croplands": 11.93, "BuiltUp->OpenFields": 55.44, "BuiltUp->SandySoil": 0.91, "BuiltUp->Trees": 10.23, "BuiltUp->Water": 5.50, "Croplands->BuiltUp": 237.53, "Croplands->Croplands": 437.83, "Croplands->OpenFields": 942.56, "Croplands->SandySoil": 14.89, "Croplands->Trees": 269.72, "Croplands->Water": 43.17, "OpenFields->BuiltUp": 64.25, "OpenFields->Croplands": 214.24, "OpenFields->OpenFields": 645.55, "OpenFields->SandySoil": 22.43, "OpenFields->Trees": 103.48, "OpenFields->Water": 54.57, "SandySoil->BuiltUp": 45.27, "SandySoil->Croplands": 22.13, "SandySoil->OpenFields": 172.69, "SandySoil->SandySoil": 67.87, "SandySoil->Trees": 13.15, "SandySoil->Water": 101.06, "Trees->BuiltUp": 41.91, "Trees->Croplands": 106.53, "Trees->OpenFields": 92.02, "Trees->SandySoil": 0.33, "Trees->Trees": 171.73, "Trees->Water": 3.53, "Water->BuiltUp": 26.46, "Water->Croplands": 3.05, "Water->OpenFields": 59.94, "Water->SandySoil": 46.07, "Water->Trees": 4.87, "Water->Water": 102.49 },
    "2005-2015": { "BuiltUp->BuiltUp": 176.05, "BuiltUp->Croplands": 51.97, "BuiltUp->OpenFields": 184.07, "BuiltUp->SandySoil": 17.87, "BuiltUp->Trees": 30.64, "BuiltUp->Water": 15.52, "Croplands->BuiltUp": 75.88, "Croplands->Croplands": 184.06, "Croplands->OpenFields": 429.70, "Croplands->SandySoil": 24.75, "Croplands->Trees": 75.53, "Croplands->Water": 5.79, "OpenFields->BuiltUp": 188.37, "OpenFields->Croplands": 396.46, "OpenFields->OpenFields": 1159.38, "OpenFields->SandySoil": 109.58, "OpenFields->Trees": 57.12, "OpenFields->Water": 57.29, "SandySoil->BuiltUp": 9.79, "SandySoil->Croplands": 3.86, "SandySoil->OpenFields": 79.34, "SandySoil->SandySoil": 31.90, "SandySoil->Trees": 2.85, "SandySoil->Water": 24.77, "Trees->BuiltUp": 129.99, "Trees->Croplands": 88.45, "Trees->OpenFields": 218.70, "Trees->SandySoil": 5.87, "Trees->Trees": 127.59, "Trees->Water": 2.59, "Water->BuiltUp": 26.52, "Water->Croplands": 5.82, "Water->OpenFields": 107.85, "Water->SandySoil": 61.85, "Water->Trees": 3.35, "Water->Water": 104.94 },
    "2015-2025": { "BuiltUp->BuiltUp": 235.77, "BuiltUp->Croplands": 173.93, "BuiltUp->OpenFields": 118.14, "BuiltUp->SandySoil": 7.55, "BuiltUp->Trees": 44.46, "BuiltUp->Water": 26.75, "Croplands->BuiltUp": 138.92, "Croplands->Croplands": 260.48, "Croplands->OpenFields": 251.26, "Croplands->SandySoil": 1.97, "Croplands->Trees": 67.41, "Croplands->Water": 10.58, "OpenFields->BuiltUp": 444.65, "OpenFields->Croplands": 558.56, "OpenFields->OpenFields": 828.62, "OpenFields->SandySoil": 70.06, "OpenFields->Trees": 136.43, "OpenFields->Water": 140.71, "SandySoil->BuiltUp": 50.08, "SandySoil->Croplands": 50.65, "SandySoil->OpenFields": 70.35, "SandySoil->SandySoil": 32.30, "SandySoil->Trees": 3.45, "SandySoil->Water": 44.97, "Trees->BuiltUp": 37.98, "Trees->Croplands": 70.65, "Trees->OpenFields": 60.78, "Trees->SandySoil": 0.35, "Trees->Trees": 124.00, "Trees->Water": 3.33, "Water->BuiltUp": 21.57, "Water->Croplands": 9.37, "Water->OpenFields": 32.16, "Water->SandySoil": 34.26, "Water->Trees": 0.70, "Water->Water": 112.85 },
};

// Custom Sankey Component
function SankeyDiagram({ periodPair, highlightCat }) {
    const svgRef = useRef(null);
    const [tooltip, setTooltip] = useState(null);
    const [hovered, setHovered] = useState(null);

    const [fromPeriod, toPeriod] = periodPair.split("-");
    const flows = FLOWS[periodPair];
    const W = 800, H = 420, PAD = 50, NODE_W = 24, GAP = 12;

    const layout = useMemo(() => {
        const fromTotals = TOTALS[fromPeriod];
        const toTotals = TOTALS[toPeriod];
        const totalArea = Object.values(fromTotals).reduce((a, b) => a + b, 0);
        const usableH = H - PAD * 2 - GAP * (CATEGORIES.length - 1);

        const leftNodes = {};
        let ly = PAD;
        CATEGORIES.forEach((cat) => {
            const h = Math.max(4, (fromTotals[cat] / totalArea) * usableH);
            leftNodes[cat] = { x: PAD, y: ly, w: NODE_W, h, val: fromTotals[cat] };
            ly += h + GAP;
        });

        const rightNodes = {};
        let ry = PAD;
        CATEGORIES.forEach((cat) => {
            const h = Math.max(4, (toTotals[cat] / totalArea) * usableH);
            rightNodes[cat] = { x: W - PAD - NODE_W, y: ry, w: NODE_W, h, val: toTotals[cat] };
            ry += h + GAP;
        });

        const links = [];
        const leftOffsets = {};
        const rightOffsets = {};
        CATEGORIES.forEach((c) => { leftOffsets[c] = 0; rightOffsets[c] = 0; });

        CATEGORIES.forEach((from) => {
            CATEGORIES.forEach((to) => {
                const key = `${from}->${to}`;
                const val = flows[key] || 0;
                if (val < 0.5) return;

                const lNode = leftNodes[from];
                const rNode = rightNodes[to];
                const lh = (val / lNode.val) * lNode.h;
                const rh = (val / rNode.val) * rNode.h;

                const sy = lNode.y + leftOffsets[from];
                const ty = rNode.y + rightOffsets[to];

                leftOffsets[from] += lh;
                rightOffsets[to] += rh;

                links.push({ from, to, val, sy, sy2: sy + lh, ty, ty2: ty + rh, key });
            });
        });

        return { leftNodes, rightNodes, links };
    }, [periodPair, fromPeriod, toPeriod, flows]);

    const makePath = (link) => {
        const x0 = PAD + NODE_W;
        const x1 = W - PAD - NODE_W;
        const mx = (x0 + x1) / 2;
        return `M ${x0} ${link.sy} C ${mx} ${link.sy}, ${mx} ${link.ty}, ${x1} ${link.ty} L ${x1} ${link.ty2} C ${mx} ${link.ty2}, ${mx} ${link.sy2}, ${x0} ${link.sy2} Z`;
    };

    const isLinkHighlighted = (link) => {
        if (hovered) return link.key === hovered;
        if (highlightCat) return link.from === highlightCat || link.to === highlightCat;
        return true;
    };

    return (
        <div style={{ position: "relative" }}>
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
                <defs>
                    {layout.links.map((link) => (
                        <linearGradient key={link.key} id={`grad-${link.key}`} x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0%" stopColor={COLORS[link.from]} />
                            <stop offset="100%" stopColor={COLORS[link.to]} />
                        </linearGradient>
                    ))}
                </defs>

                {layout.links.map((link) => (
                    <path
                        key={link.key}
                        d={makePath(link)}
                        fill={`url(#grad-${link.key})`}
                        opacity={isLinkHighlighted(link) ? 0.45 : 0.06}
                        stroke="none"
                        style={{ transition: "opacity 0.3s", cursor: "pointer" }}
                        onMouseEnter={(e) => {
                            setHovered(link.key);
                            setTooltip({ x: e.clientX, y: e.clientY, from: link.from, to: link.to, val: link.val });
                        }}
                        onMouseMove={(e) => setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                        onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                    />
                ))}

                {CATEGORIES.map((cat) => {
                    const ln = layout.leftNodes[cat];
                    const rn = layout.rightNodes[cat];
                    const isHL = !highlightCat || highlightCat === cat;
                    return (
                        <g key={cat}>
                            <rect x={ln.x} y={ln.y} width={ln.w} height={ln.h} rx={4} fill={COLORS[cat]} opacity={isHL ? 1 : 0.2} style={{ transition: "opacity 0.3s" }} />
                            <text x={ln.x + ln.w + 8} y={ln.y + ln.h / 2} dominantBaseline="central" fill={isHL ? "#ddd" : "#555"} fontSize="11" fontFamily="'Inter', sans-serif" style={{ transition: "fill 0.3s" }}>
                                {LABELS[cat]} ({ln.val.toFixed(0)})
                            </text>
                            <rect x={rn.x} y={rn.y} width={rn.w} height={rn.h} rx={4} fill={COLORS[cat]} opacity={isHL ? 1 : 0.2} style={{ transition: "opacity 0.3s" }} />
                            <text x={rn.x - 8} y={rn.y + rn.h / 2} dominantBaseline="central" textAnchor="end" fill={isHL ? "#ddd" : "#555"} fontSize="11" fontFamily="'Inter', sans-serif" style={{ transition: "fill 0.3s" }}>
                                {LABELS[cat]} ({rn.val.toFixed(0)})
                            </text>
                        </g>
                    );
                })}

                <text x={PAD + NODE_W / 2} y={20} textAnchor="middle" fill="#888" fontSize="13" fontWeight="600" fontFamily="'Inter', sans-serif">{fromPeriod}</text>
                <text x={W - PAD - NODE_W / 2} y={20} textAnchor="middle" fill="#888" fontSize="13" fontWeight="600" fontFamily="'Inter', sans-serif">{toPeriod}</text>
            </svg>

            {tooltip && (
                <div style={{
                    position: "fixed", left: tooltip.x + 14, top: tooltip.y - 10, background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px",
                    color: "#eee", fontSize: 13, fontFamily: "'Inter', sans-serif", pointerEvents: "none",
                    zIndex: 1000, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[tooltip.from], display: "inline-block" }} />
                        <strong>{LABELS[tooltip.from]}</strong>
                        <span style={{ color: "#888" }}>→</span>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[tooltip.to], display: "inline-block" }} />
                        <strong>{LABELS[tooltip.to]}</strong>
                    </div>
                    <div style={{ color: "#aaa" }}>{tooltip.val.toFixed(2)} km²</div>
                </div>
            )}
        </div>
    );
}

// Change matrix heatmap
function ChangeMatrix({ periodPair }) {
    const [hovered, setHovered] = useState(null);
    const flows = FLOWS[periodPair];
    const [fromP, toP] = periodPair.split("-");
    const maxVal = Math.max(...Object.values(flows));

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 12 }}>
                <thead>
                    <tr>
                        <th style={{ padding: "8px 10px", color: "#888", textAlign: "left", borderBottom: "1px solid #333", fontSize: 11 }}>
                            {fromP} ↓ / {toP} →
                        </th>
                        {CATEGORIES.map((c) => (
                            <th key={c} style={{ padding: "8px 6px", color: COLORS[c], textAlign: "center", borderBottom: "1px solid #333", fontSize: 11 }}>{LABELS[c]}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {CATEGORIES.map((from) => (
                        <tr key={from}>
                            <td style={{ padding: "6px 10px", color: COLORS[from], fontWeight: 600, fontSize: 11 }}>{LABELS[from]}</td>
                            {CATEGORIES.map((to) => {
                                const key = `${from}->${to}`;
                                const val = flows[key] || 0;
                                const intensity = Math.pow(val / maxVal, 0.5);
                                const isHov = hovered === key;
                                const bg = from === to
                                    ? `rgba(100, 200, 255, ${intensity * 0.6})`
                                    : `rgba(255, 160, 60, ${intensity * 0.6})`;
                                return (
                                    <td
                                        key={to}
                                        onMouseEnter={() => setHovered(key)}
                                        onMouseLeave={() => setHovered(null)}
                                        style={{
                                            padding: "6px", textAlign: "center", color: val > 0 ? "#eee" : "#555",
                                            background: isHov ? "rgba(255,255,255,0.15)" : bg,
                                            borderRadius: 4, cursor: "default", transition: "background 0.2s",
                                            fontVariantNumeric: "tabular-nums", fontSize: 11,
                                            border: from === to ? "1px solid rgba(100,200,255,0.3)" : "1px solid transparent",
                                        }}
                                    >
                                        {val > 0.5 ? val.toFixed(1) : val > 0 ? "<1" : "—"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Main component
export default function LandUseChangeDashboard() {
    const [activeView, setActiveView] = useState("sankey");
    const [selectedPeriod, setSelectedPeriod] = useState("1995-2005");
    const [highlightCat, setHighlightCat] = useState(null);

    const stackedData = PERIODS.map((p) => ({ period: p, ...TOTALS[p] }));

    const changeData = useMemo(() => {
        return CATEGORIES.map((cat) => {
            const row = { category: LABELS[cat] };
            PERIODS.forEach((p) => { row[p] = TOTALS[p][cat]; });
            row.change = TOTALS["2025"][cat] - TOTALS["1995"][cat];
            row.changePct = ((TOTALS["2025"][cat] - TOTALS["1995"][cat]) / TOTALS["1995"][cat] * 100);
            return row;
        });
    }, []);

    const periodPairs = ["1995-2005", "2005-2015", "2015-2025"];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload) return null;
        return (
            <div style={{
                background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                padding: "12px 16px", fontFamily: "'Inter', sans-serif", fontSize: 13,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}>
                <div style={{ color: "#fff", fontWeight: 600, marginBottom: 6 }}>{label}</div>
                {payload.map((p) => (
                    <div key={p.dataKey} style={{ display: "flex", justifyContent: "space-between", gap: 20, padding: "2px 0" }}>
                        <span style={{ color: p.color }}>{LABELS[p.dataKey] || p.dataKey}</span>
                        <span style={{ color: "#eee", fontVariantNumeric: "tabular-nums" }}>{p.value.toFixed(1)} km²</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))", gap: 10, marginBottom: 20 }}>
                {changeData.map((d) => {
                    const cat = CATEGORIES.find((c) => LABELS[c] === d.category);
                    const isPos = d.change > 0;
                    return (
                        <div
                            key={d.category}
                            onClick={() => setHighlightCat(highlightCat === cat ? null : cat)}
                            style={{
                                background: highlightCat === cat ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${highlightCat === cat ? COLORS[cat] + "66" : "rgba(255,255,255,0.06)"}`,
                                borderRadius: 12, padding: "14px", cursor: "pointer", transition: "all 0.3s",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[cat] }} />
                                <span style={{ fontSize: 11, color: "#aaa", fontWeight: 500 }}>{d.category}</span>
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                                {TOTALS["2025"][cat].toFixed(0)}
                                <span style={{ fontSize: 10, color: "#666", fontWeight: 400 }}> km²</span>
                            </div>
                            <div style={{ fontSize: 11, color: isPos ? "#4ade80" : "#f87171", fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                                {isPos ? "▲" : "▼"} {Math.abs(d.changePct).toFixed(0)}%
                                <span style={{ color: "#555", marginLeft: 6 }}>since '95</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 0 }}>
                {[
                    { key: "sankey", label: "Flow Diagram" },
                    { key: "stacked", label: "Area Composition" },
                    { key: "matrix", label: "Change Matrix" },
                    { key: "bars", label: "Category Trends" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveView(tab.key)}
                        style={{
                            background: activeView === tab.key ? "rgba(255,255,255,0.1)" : "transparent",
                            border: "1px solid " + (activeView === tab.key ? "rgba(255,255,255,0.15)" : "transparent"),
                            borderRadius: "10px 10px 0 0", padding: "9px 18px", color: activeView === tab.key ? "#fff" : "#667",
                            fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                            transition: "all 0.2s",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main content */}
            <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: "0 12px 12px 12px",
                padding: "20px",
            }}>
                {/* Sankey View */}
                {activeView === "sankey" && (
                    <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            {periodPairs.map((pp) => (
                                <button
                                    key={pp}
                                    onClick={() => setSelectedPeriod(pp)}
                                    style={{
                                        background: selectedPeriod === pp ? "rgba(100,160,255,0.15)" : "rgba(255,255,255,0.04)",
                                        border: `1px solid ${selectedPeriod === pp ? "rgba(100,160,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                                        borderRadius: 8, padding: "7px 16px", color: selectedPeriod === pp ? "#8bc4ff" : "#888",
                                        fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {pp}
                                </button>
                            ))}
                        </div>
                        <SankeyDiagram periodPair={selectedPeriod} highlightCat={highlightCat} />
                        <p style={{ color: "#556", fontSize: 11, marginTop: 10, textAlign: "center" }}>
                            Hover over flows to see transition details. Click category cards above to highlight.
                        </p>
                    </div>
                )}

                {/* Stacked Area View */}
                {activeView === "stacked" && (
                    <div>
                        <h3 style={{ color: "#aaa", fontSize: 13, fontWeight: 500, margin: "0 0 14px" }}>Land Use Composition Over Time (km²)</h3>
                        <ResponsiveContainer width="100%" height={360}>
                            <AreaChart data={stackedData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                                <XAxis dataKey="period" stroke="#555" tick={{ fill: "#888", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} />
                                <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                {CATEGORIES.map((cat) => (
                                    <Area
                                        key={cat} type="monotone" dataKey={cat} stackId="1"
                                        fill={COLORS[cat]} stroke={COLORS[cat]} fillOpacity={highlightCat && highlightCat !== cat ? 0.1 : 0.7}
                                        strokeWidth={highlightCat === cat ? 2 : 0}
                                    />
                                ))}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Matrix View */}
                {activeView === "matrix" && (
                    <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            {periodPairs.map((pp) => (
                                <button
                                    key={pp}
                                    onClick={() => setSelectedPeriod(pp)}
                                    style={{
                                        background: selectedPeriod === pp ? "rgba(100,160,255,0.15)" : "rgba(255,255,255,0.04)",
                                        border: `1px solid ${selectedPeriod === pp ? "rgba(100,160,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                                        borderRadius: 8, padding: "7px 16px", color: selectedPeriod === pp ? "#8bc4ff" : "#888",
                                        fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {pp}
                                </button>
                            ))}
                        </div>
                        <ChangeMatrix periodPair={selectedPeriod} />
                        <div style={{ marginTop: 14, display: "flex", gap: 20, fontSize: 10, color: "#667" }}>
                            <span><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "rgba(100,200,255,0.4)", verticalAlign: "middle", marginRight: 6 }} />Persistence (same class)</span>
                            <span><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "rgba(255,160,60,0.4)", verticalAlign: "middle", marginRight: 6 }} />Conversion (class change)</span>
                        </div>
                    </div>
                )}

                {/* Category Trends */}
                {activeView === "bars" && (
                    <div>
                        <h3 style={{ color: "#aaa", fontSize: 13, fontWeight: 500, margin: "0 0 14px" }}>Category Trends Across Periods</h3>
                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart data={stackedData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                                <XAxis dataKey="period" stroke="#555" tick={{ fill: "#888", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} />
                                <YAxis stroke="#555" tick={{ fill: "#888", fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    formatter={(v) => <span style={{ color: "#aaa", fontSize: 11 }}>{LABELS[v]}</span>}
                                    wrapperStyle={{ paddingTop: 10 }}
                                />
                                {CATEGORIES.map((cat) => (
                                    <Bar
                                        key={cat} dataKey={cat} fill={COLORS[cat]}
                                        opacity={highlightCat && highlightCat !== cat ? 0.15 : 0.85}
                                        radius={[4, 4, 0, 0]}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Key Insights */}
            <div style={{ marginTop: 20 }}>
                <div style={{
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12, padding: "18px 22px",
                }}>
                    <h3 style={{ color: "#aaa", fontSize: 12, fontWeight: 600, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Key Findings</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, fontSize: 12, color: "#889" }}>
                        <div>
                            <span style={{ color: COLORS.BuiltUp, fontWeight: 600 }}>Urbanization: </span>
                            Built-up area surged from 145 km² to 929 km² — a 542% increase over 30 years.
                        </div>
                        <div>
                            <span style={{ color: COLORS.Croplands, fontWeight: 600 }}>Agricultural Decline: </span>
                            Croplands dropped from 1,946 km² in 1995 to 796 km² by 2005, partially recovering by 2025.
                        </div>
                        <div>
                            <span style={{ color: COLORS.OpenFields, fontWeight: 600 }}>Open Fields Fluctuation: </span>
                            Nearly doubled by 2005 before declining, serving as transitional land.
                        </div>
                        <div>
                            <span style={{ color: COLORS.SandySoil, fontWeight: 600 }}>Sandy Soil Decline: </span>
                            Reduced by 65% — from 422 km² to 147 km², converting to open fields and water.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
