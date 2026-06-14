'use client';

import { useEffect, useRef, useState } from 'react';

interface ServicesSectionProps {
    phase: string;
    mob: boolean;
    cardsIn: boolean;
}

export function ServicesSec({ phase, mob, cardsIn }: ServicesSectionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const globeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [globeIn, setGlobeIn] = useState(false);

    // Globe drop-in trigger
    useEffect(() => {
        if (phase === 'services') {
            setGlobeIn(false);
            const id = setTimeout(() => setGlobeIn(true), 50);
            return () => clearTimeout(id);
        } else {
            setGlobeIn(false);
        }
    }, [phase]);

    // 🌐 Wireframe Globe Canvas
    useEffect(() => {
        if (phase !== 'services') return;

        const canvas = globeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0;
        let rotation = 0;

        const size = mob ? 280 : 560;

        const resize = () => {
            canvas.width = Math.floor(size * dpr);
            canvas.height = Math.floor(size * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // 3D point → 2D projection
        const project = (x: number, y: number, z: number, cx: number, cy: number) => {
            const perspective = 500;
            const scale = perspective / (perspective + z);
            return {
                x: cx + x * scale,
                y: cy + y * scale,
                scale,
                z,
            };
        };

        const drawGlobe = () => {
            ctx.clearRect(0, 0, size, size);

            const cx = size / 2;
            const cy = size / 2;
            const radius = size * 0.42;

            // Slight tilt (like image)
            const tiltX = -0.35;

            // ===== Latitudes (horizontal rings) =====
            const latCount = 8;
            for (let i = 1; i < latCount; i++) {
                const lat = (i / latCount) * Math.PI - Math.PI / 2;
                const ringRadius = Math.cos(lat) * radius;
                const ringY = Math.sin(lat) * radius;

                ctx.beginPath();
                const segments = 80;
                for (let j = 0; j <= segments; j++) {
                    const angle = (j / segments) * Math.PI * 2;
                    let x = Math.cos(angle) * ringRadius;
                    let y = ringY;
                    let z = Math.sin(angle) * ringRadius;

                    // Apply X tilt
                    const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
                    const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);

                    const p = project(x, y2, z2, cx, cy);

                    // Visibility based on z (back side fade)
                    const alpha = z2 > 0 ? 0.15 : 0.55;
                    ctx.strokeStyle = `rgba(180, 130, 255, ${alpha})`;

                    if (j === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = 'rgba(180, 130, 255, 0.4)';
                ctx.stroke();
            }

            // ===== Longitudes (vertical rings) — rotating =====
            const lonCount = 12;
            for (let i = 0; i < lonCount; i++) {
                const lon = (i / lonCount) * Math.PI * 2 + rotation;

                ctx.beginPath();
                const segments = 80;
                for (let j = 0; j <= segments; j++) {
                    const lat = (j / segments) * Math.PI - Math.PI / 2;
                    let x = Math.cos(lat) * Math.cos(lon) * radius;
                    let y = Math.sin(lat) * radius;
                    let z = Math.cos(lat) * Math.sin(lon) * radius;

                    // Apply X tilt
                    const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
                    const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);

                    const p = project(x, y2, z2, cx, cy);

                    if (j === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = 'rgba(170, 110, 255, 0.45)';
                ctx.stroke();
            }

            // ===== Outer glow ring =====
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(200, 150, 255, 0.65)';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 18;
            ctx.shadowColor = 'rgba(140, 80, 240, 0.7)';
            ctx.stroke();
            ctx.shadowBlur = 0;

            rotation += 0.003; // slow rotation
            raf = requestAnimationFrame(drawGlobe);
        };

        resize();
        drawGlobe();

        return () => {
            cancelAnimationFrame(raf);
        };
    }, [phase, mob]);

    const cards = [
        {
            label: 'Clear and automated documentation',
            body: "You don't have to understand terminology and complex formulations—structured documents are ready for you.",
            btn: 'To learn more',
            zIdx: 1,
            accent: false,
            glowPos: 'right',
        },
        {
            label: 'Guaranteed answer to your question',
            body: 'There is no need to look for solutions on your own — our clients have already received expert answers.',
            btn: 'To learn more',
            zIdx: 3,
            accent: true,
            glowPos: 'top-left',
        },
        {
            label: 'Making profitable decisions',
            body: 'You will never miss an opportunity to save money, get additional benefits and choose the right path.',
            btn: 'To learn more',
            zIdx: 2,
            accent: false,
            glowPos: 'bottom',
        },
    ];

    return (
        <>
            <style>{`
                @keyframes flyFromLeft {
                    from { opacity: 0; translate: -80px 0; }
                    to   { opacity: 1; translate: 0 0; }
                }
                @keyframes flyFromBottom {
                    from { opacity: 0; translate: 0 80px; }
                    to   { opacity: 1; translate: 0 0; }
                }
                @keyframes flyFromRight {
                    from { opacity: 0; translate: 80px 0; }
                    to   { opacity: 1; translate: 0 0; }
                }
                @keyframes globeDropIn {
                    from {
                        opacity: 0;
                        transform: translateY(-180px) scale(0.7);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes paragraphFadeUp {
                from {
                    opacity: 0;
                    transform: translateY(24px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
                .svc-card-0 { transform: rotate(8deg) translateY(40px); }
                .svc-card-1 { transform: rotate(-6deg) translateY(0px); }
                .svc-card-2 { transform: rotate(8deg) translateY(40px); }
            `}</style>

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: mob ? '48px 16px 40px' : '70px 48px 60px',
                    zIndex: 10,
                    overflow: 'hidden',
                }}
            >
                {/* 🌐 Wireframe Globe (Top Right) */}
                <div
                    style={{
                        position: 'absolute',
                        top: mob ? '-60px' : '-120px',
                        right: mob ? '-60px' : '-120px',
                        width: mob ? '280px' : '560px',
                        height: mob ? '280px' : '560px',
                        pointerEvents: 'none',
                        zIndex: 1,
                        opacity: globeIn ? 1 : 0,
                        animation: globeIn
                            ? 'globeDropIn 1.2s cubic-bezier(.22,.68,0,1.2) both'
                            : 'none',
                    }}
                >
                    <canvas
                        ref={globeCanvasRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                        }}
                    />
                </div>

                {/* Heading */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '900px',
                        textAlign: 'center',
                        marginBottom: mob ? '14px' : '20px',
                        position: 'relative',
                        marginTop: mob ? '24px' : '40px',
                        zIndex: 2,
                    }}
                >
                    <h2
                        style={{
                            fontSize: mob ? 'clamp(18px, 4.5vw, 24px)' : 'clamp(28px, 3.4vw, 44px)',
                            fontWeight: 300,
                            lineHeight: 1.25,
                            color: '#fff',
                            letterSpacing: '-0.02em',
                            marginBottom: mob ? '10px' : '16px',
                            opacity: phase === 'services' ? 1 : 0,
                            animation:
                                phase === 'services'
                                    ? 'paragraphFadeUp 0.75s ease-out 0.25s both'
                                    : 'none',
                        }}
                    >
                        Legal support for IT: protecting your
                        <br />
                        business in the digital sphere
                    </h2>
                    <p
                        style={{
                            fontSize: mob ? '12px' : '14px',
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.7,
                            maxWidth: mob ? '320px' : '480px',
                            margin: '0 auto',
                            fontWeight: 300,
                            opacity: phase === 'services' ? 1 : 0,
                            animation:
                                phase === 'services'
                                    ? 'paragraphFadeUp 0.75s ease-out 0.25s both'
                                    : 'none',
                        }}
                    >
                        We take into account the specifics of the activities of IT companies and
                        help our clients minimize risks and protect them from possible legal
                        problems.
                    </p>
                </div>

                {/* Cards Container */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: mob ? '10px' : '24px',
                        width: '100%',
                        maxWidth: '1150px',
                        flexWrap: 'nowrap',
                        position: 'relative',
                        zIndex: 2,
                        paddingBottom: mob ? '50px' : '80px',
                        paddingTop: mob ? '12px' : '20px',
                    }}
                >
                    {cards.map((c, i) => (
                        <div
                            key={i}
                            className={`svc-card-${i}`}
                            style={{
                                width: mob ? '33%' : '350px',
                                height: mob ? '220px' : '370px',
                                zIndex: c.zIdx,
                                flexShrink: 0,
                                animation: cardsIn
                                    ? `${['flyFromLeft', 'flyFromBottom', 'flyFromRight'][i]} 1.2s cubic-bezier(.16,1,.3,1) ${['0s', '0.18s', '0.36s'][i]} both`
                                    : 'none',
                                visibility: cardsIn ? 'visible' : 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: mob ? '14px' : '20px',
                                    padding: mob ? '16px' : '28px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: 'rgb(6,3,14)',
                                    border: c.accent
                                        ? '1px solid rgba(150,95,250,0.75)'
                                        : '1px solid rgba(105,62,205,0.38)',
                                    boxShadow: c.accent
                                        ? '0 0 20px rgba(130,70,250,0.1), 0 12px 40px rgba(0,0,0,0.9)'
                                        : '0 12px 38px rgba(0,0,0,0.9)',
                                }}
                            >
                                {c.glowPos === 'top-left' && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '-18%',
                                            left: '-18%',
                                            width: '80%',
                                            height: '80%',
                                            background:
                                                'radial-gradient(circle at 25% 25%, rgba(120,48,240,0.75) 0%, rgba(75,18,170,0.38) 35%, transparent 65%)',
                                            filter: 'blur(48px)',
                                            pointerEvents: 'none',
                                            zIndex: 0,
                                        }}
                                    />
                                )}

                                {c.glowPos === 'right' && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '10%',
                                            right: '-18%',
                                            width: '62%',
                                            height: '68%',
                                            background:
                                                'radial-gradient(circle at 85% 48%, rgba(105,38,225,0.7) 0%, rgba(58,14,135,0.3) 42%, transparent 70%)',
                                            filter: 'blur(40px)',
                                            pointerEvents: 'none',
                                            zIndex: 0,
                                        }}
                                    />
                                )}

                                {c.glowPos === 'bottom' && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '-18%',
                                            left: '5%',
                                            width: '88%',
                                            height: '62%',
                                            background:
                                                'radial-gradient(ellipse at 50% 88%, rgba(115,42,235,0.68) 0%, rgba(62,16,148,0.28) 38%, transparent 68%)',
                                            filter: 'blur(42px)',
                                            pointerEvents: 'none',
                                            zIndex: 0,
                                        }}
                                    />
                                )}

                                <button
                                    style={{
                                        padding: mob ? '6px 14px' : '8px 18px',
                                        fontSize: mob ? '9px' : '12px',
                                        alignSelf: 'flex-start',
                                        borderRadius: '999px',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.18)',
                                        color: '#fff',
                                        fontWeight: 400,
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        letterSpacing: '0.01em',
                                        position: 'relative',
                                        zIndex: 2,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {c.btn}
                                </button>

                                <div style={{ position: 'relative', zIndex: 2 }}>
                                    <h3
                                        style={{
                                            fontSize: mob ? '13px' : '22px',
                                            fontWeight: 400,
                                            color: '#fff',
                                            lineHeight: 1.25,
                                            marginBottom: mob ? '8px' : '12px',
                                            letterSpacing: '-0.01em',
                                        }}
                                    >
                                        {c.label}
                                    </h3>
                                    <p
                                        style={
                                            {
                                                fontSize: mob ? '9px' : '13px',
                                                color: 'rgba(255,255,255,0.5)',
                                                lineHeight: 1.6,
                                                fontWeight: 300,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 4,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            } as React.CSSProperties
                                        }
                                    >
                                        {c.body}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
