import { useEffect, useRef, useState, useCallback } from 'react';

export default function ImageZoomModal({ src, onClose }) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    const MIN_SCALE = 0.5;
    const MAX_SCALE = 8;
    const ZOOM_STEP = 0.15;

    // Keyboard escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    // Scroll-to-zoom (centered on cursor position)
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const cursorX = e.clientX - rect.left - rect.width / 2;
        const cursorY = e.clientY - rect.top - rect.height / 2;

        const direction = e.deltaY < 0 ? 1 : -1;
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (1 + direction * ZOOM_STEP)));
        const ratio = newScale / scale;

        setScale(newScale);
        setPosition((prev) => ({
            x: cursorX - ratio * (cursorX - prev.x),
            y: cursorY - ratio * (cursorY - prev.y),
        }));
    }, [scale]);

    // Attach wheel with passive: false to allow preventDefault
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [handleWheel]);

    // Drag-to-pan
    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    }, [isDragging, dragStart]);

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove]);

    // Double-click to reset
    const handleDoubleClick = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Zoom controls
    const zoomIn = (e) => {
        e.stopPropagation();
        setScale((s) => Math.min(MAX_SCALE, s * 1.4));
    };
    const zoomOut = (e) => {
        e.stopPropagation();
        setScale((s) => Math.max(MIN_SCALE, s / 1.4));
    };
    const zoomReset = (e) => {
        e.stopPropagation();
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const zoomPercent = Math.round(scale * 100);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(4, 12, 24, 0.94)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'zoom-in'),
                animation: 'fadeIn 0.2s ease',
                userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
        >
            {/* Zoomed Image */}
            <img
                ref={imgRef}
                src={src}
                alt="Zoomed map view"
                draggable={false}
                style={{
                    maxWidth: '88vw',
                    maxHeight: '85vh',
                    borderRadius: '6px',
                    background: '#ffffff',
                    boxShadow: '0 16px 60px rgba(0,0,0,0.6)',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                    pointerEvents: 'none',
                }}
            />

            {/* Top bar — close + instructions */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                background: 'linear-gradient(180deg, rgba(4,12,24,0.8) 0%, transparent 100%)',
                pointerEvents: 'none',
            }}>
                <span style={{
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    Scroll to zoom · Drag to pan · Double-click to reset
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '4px',
                        width: 34,
                        height: 34,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.18)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                >
                    ✕
                </button>
            </div>

            {/* Bottom zoom controls */}
            <div style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(10, 20, 38, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 229, 255, 0.12)',
                borderRadius: '6px',
                padding: '4px 6px',
                pointerEvents: 'auto',
            }}>
                <ZoomBtn onClick={zoomOut} label="−" />
                <div style={{
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#00e5ff',
                    minWidth: 52,
                    textAlign: 'center',
                    fontWeight: 600,
                    userSelect: 'none',
                }}>
                    {zoomPercent}%
                </div>
                <ZoomBtn onClick={zoomIn} label="+" />
                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
                <ZoomBtn onClick={zoomReset} label="⟲" title="Reset zoom" />
            </div>
        </div>
    );
}

function ZoomBtn({ onClick, label, title }) {
    return (
        <button
            onClick={onClick}
            title={title || label}
            style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ecf0f6',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 229, 255, 0.12)';
                e.target.style.borderColor = 'rgba(0, 229, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.06)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
        >
            {label}
        </button>
    );
}
