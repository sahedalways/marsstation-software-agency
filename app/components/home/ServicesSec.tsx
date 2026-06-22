'use client';
import { useEffect, useRef } from 'react';

interface Props {
    cardsIn: boolean;
    mob: boolean;
}

export function ServicesSec({ cardsIn, mob }: Props) {
    const globeCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!cardsIn) return;
        const canvas = globeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0,
            rotation = 0;
        const size = mob ? 280 : 560;
        canvas.width = Math.floor(size * dpr);
        canvas.height = Math.floor(size * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const project = (x: number, y: number, z: number, cx: number, cy: number) => {
            const s = 500 / (500 + z);
            return { x: cx + x * s, y: cy + y * s };
        };
        const drawGlobe = () => {
            ctx.clearRect(0, 0, size, size);
            const cx = size / 2,
                cy = size / 2,
                radius = size * 0.42,
                tiltX = -0.35;
            for (let i = 1; i < 8; i++) {
                const lat = (i / 8) * Math.PI - Math.PI / 2;
                const rr = Math.cos(lat) * radius,
                    ry = Math.sin(lat) * radius;
                ctx.beginPath();
                for (let j = 0; j <= 80; j++) {
                    const a = (j / 80) * Math.PI * 2;
                    let x = Math.cos(a) * rr,
                        y = ry,
                        z = Math.sin(a) * rr;
                    const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
                    const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
                    const p = project(x, y2, z2, cx, cy);
                    if (j === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = 'rgba(180,130,255,0.4)';
                ctx.stroke();
            }
            for (let i = 0; i < 12; i++) {
                const lon = (i / 12) * Math.PI * 2 + rotation;
                ctx.beginPath();
                for (let j = 0; j <= 80; j++) {
                    const lat = (j / 80) * Math.PI - Math.PI / 2;
                    let x = Math.cos(lat) * Math.cos(lon) * radius,
                        y = Math.sin(lat) * radius,
                        z = Math.cos(lat) * Math.sin(lon) * radius;
                    const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
                    const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
                    const p = project(x, y2, z2, cx, cy);
                    if (j === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = 'rgba(170,110,255,0.45)';
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(200,150,255,0.65)';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 18;
            ctx.shadowColor = 'rgba(140,80,240,0.7)';
            ctx.stroke();
            ctx.shadowBlur = 0;
            rotation += 0.003;
            raf = requestAnimationFrame(drawGlobe);
        };
        drawGlobe();
        return () => cancelAnimationFrame(raf);
    }, [cardsIn, mob]);

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
                @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
                @keyframes flyLeft { from { opacity:0; translate:-80px 0; } to { opacity:1; translate:0 0; } }
                @keyframes flyBottom { from { opacity:0; translate:0 80px; } to { opacity:1; translate:0 0; } }
                @keyframes flyRight { from { opacity:0; translate:80px 0; } to { opacity:1; translate:0 0; } }
                @keyframes globeDrop { from { opacity:0; transform:translateY(-180px) scale(0.7); } to { opacity:1; transform:translateY(0) scale(1); } }
                .svc-card-0 { transform: rotate(8deg) translateY(40px); }
                .svc-card-1 { transform: rotate(-6deg) translateY(0px); }
                .svc-card-2 { transform: rotate(8deg) translateY(40px); }
            `}</style>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: mob ? '40px 16px' : '60px 48px',
                    overflow: 'hidden',
                    opacity: cardsIn ? 1 : 0,
                    transition: 'opacity 0.01s',
                }}
            >
                {/* Globe */}
                {/* <div
                    style={{
                        position: 'absolute',
                        top: mob ? '-50px' : '-100px',
                        right: mob ? '-110px' : '-100px',
                        width: mob ? '280px' : '560px',
                        height: mob ? '280px' : '560px',
                        pointerEvents: 'none',
                        zIndex: 1,
                        opacity: cardsIn ? 1 : 0,
                        animation: cardsIn
                            ? 'globeDrop 1.2s cubic-bezier(.22,.68,0,1.2) both'
                            : 'none',
                    }}
                >
                    <canvas
                        ref={globeCanvasRef}
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                </div> */}
                {/* Heading */}
                <div
                    style={{
                        width: '100%',
                        maxWidth: '900px',
                        textAlign: 'center',
                        marginBottom: mob ? '14px' : '20px',
                        marginTop: mob ? '24px' : '40px',
                        zIndex: 2,
                    }}
                >
                    <h2
                        style={{
                            fontSize: mob ? 'clamp(16px, 4.5vw, 22px)' : 'clamp(20px, 2.6vw, 34px)',
                            fontWeight: 300,
                            lineHeight: 1.25,
                            color: '#fff',
                            letterSpacing: '-0.02em',
                            marginBottom: mob ? '10px' : '16px',
                            opacity: cardsIn ? 1 : 0,
                            animation: cardsIn ? 'fadeUp 0.75s ease-out 0.15s both' : 'none',
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
                            opacity: cardsIn ? 1 : 0,
                            animation: cardsIn ? 'fadeUp 0.75s ease-out 0.3s both' : 'none',
                        }}
                    >
                        We take into account the specifics of the activities of IT companies and
                        help our clients minimize risks and protect them from possible legal
                        problems.
                    </p>
                </div>
                {/* Cards */}
                <>
                    <style>{`
        .svc-card-wrap {
            transition: transform 0.5s cubic-bezier(.16,1,.3,1);
            will-change: transform;
        }
        .svc-card-wrap:hover {
            transform: translateY(-8px);
        }
        .svc-card-inner {
            transition: border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
        }
        .svc-card-wrap:hover .svc-card-inner {
            border-color: rgba(170,115,255,0.85) !important;
            box-shadow:
                0 0 30px rgba(140,75,250,0.3),
                0 18px 50px rgba(0,0,0,0.95),
                inset 0 0 22px rgba(120,55,235,0.08) !important;
            background: rgb(10,5,22) !important;
        }
        .svc-glow {
            transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;
        }
        .svc-card-wrap:hover .svc-glow {
            filter: blur(55px);
            transform: scale(1.1);
        }
        .svc-card-btn {
            transition: background 0.3s ease, border-color 0.3s ease;
        }
        .svc-card-wrap:hover .svc-card-btn {
            background: rgba(140,75,250,0.18) !important;
            border-color: rgba(170,115,255,0.55) !important;
        }
        .svc-card-title {
            transition: transform 0.4s cubic-bezier(.16,1,.3,1);
        }
        .svc-card-wrap:hover .svc-card-title {
            transform: translateY(-2px);
        }
    `}</style>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: mob ? '8px' : '24px',
                            width: '100%',
                            maxWidth: '1150px',
                            flexWrap: 'nowrap',
                            zIndex: 2,
                            paddingBottom: mob ? '40px' : '60px',
                            paddingTop: mob ? '12px' : '20px',
                            paddingLeft: mob ? '10px' : '0',
                            paddingRight: mob ? '10px' : '0',
                            boxSizing: 'border-box',
                        }}
                    >
                        {cards.map((c, i) => (
                            <div
                                key={i}
                                className={`svc-card-wrap svc-card-${i}`}
                                style={{
                                    width: mob ? '33.33%' : '350px',
                                    height: mob ? '200px' : '370px',
                                    zIndex: c.zIdx,
                                    flexShrink: 0,
                                    opacity: cardsIn ? 1 : 0,
                                    animation: cardsIn
                                        ? `${['flyLeft', 'flyBottom', 'flyRight'][i]} 1s cubic-bezier(.16,1,.3,1) ${[0, 0.12, 0.24][i]}s both`
                                        : 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                <div
                                    className="svc-card-inner"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: mob ? '12px' : '20px',
                                        padding: mob ? '12px' : '28px',
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
                                            className="svc-glow"
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
                                            className="svc-glow"
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
                                            className="svc-glow"
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
                                        className="svc-card-btn"
                                        style={{
                                            padding: mob ? '5px 10px' : '8px 18px',
                                            fontSize: mob ? '8px' : '12px',
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
                                            className="svc-card-title"
                                            style={{
                                                fontSize: mob ? '11px' : '22px',
                                                fontWeight: 400,
                                                color: '#fff',
                                                lineHeight: 1.25,
                                                marginBottom: mob ? '6px' : '12px',
                                                letterSpacing: '-0.01em',
                                            }}
                                        >
                                            {c.label}
                                        </h3>
                                        <p
                                            style={
                                                {
                                                    fontSize: mob ? '8px' : '13px',
                                                    color: 'rgba(255,255,255,0.5)',
                                                    lineHeight: 1.55,
                                                    fontWeight: 300,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: mob ? 5 : 4,
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
                </>
            </div>
        </>
    );
}
