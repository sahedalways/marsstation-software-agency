'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
    contactIn: boolean;
    mob: boolean;
    agreed: boolean;
    setAgreed: (v: boolean) => void;
}

export function ContactSec({ contactIn, mob, agreed, setAgreed }: Props) {
    const globeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [agreedLocal, setAgreedLocal] = useState(agreed);

    const handleAgree = () => {
        const v = !agreedLocal;
        setAgreedLocal(v);
        setAgreed(v);
    };

    // 🌐 Globe Canvas
    useEffect(() => {
        if (!contactIn) return;
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

            // Latitudes
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

            // Longitudes
            for (let i = 0; i < 12; i++) {
                const lon = (i / 12) * Math.PI * 2 + rotation;
                ctx.beginPath();
                for (let j = 0; j <= 80; j++) {
                    const lat = (j / 80) * Math.PI - Math.PI / 2;
                    let x = Math.cos(lat) * Math.cos(lon) * radius;
                    let y = Math.sin(lat) * radius;
                    let z = Math.cos(lat) * Math.sin(lon) * radius;
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

            // Outer ring
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
    }, [contactIn, mob]);

    return (
        <>
            <style>{`
       @keyframes contactGlobeDrop {
    from {
        opacity: 0;
        transform: translate(-80px, -140px) scale(0.72) rotate(-25deg);
    }
    to {
        opacity: 1;
        transform: translate(0, 0) scale(1) rotate(-25deg);
    }
}
            `}</style>

            <div
                style={{
                    position: 'relative',
                    width: '100%',

                    overflow: 'hidden',
                }}
            >
                {/* 🌐 Globe — Top Left */}
                <div
                    style={{
                        position: 'absolute',
                        top: mob ? '-50px' : '-100px',
                        left: mob ? '-110px' : '-100px',
                        width: mob ? '300px' : '620px',
                        height: mob ? '300px' : '620px',
                        pointerEvents: 'none',
                        zIndex: 1,
                        opacity: contactIn ? 1 : 0,
                        animation: contactIn
                            ? 'contactGlobeDrop 1.15s cubic-bezier(.22,.68,0,1.2) both'
                            : 'none',
                    }}
                >
                    <canvas
                        ref={globeCanvasRef}
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                </div>

                {/* Form — Centered */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '100%',

                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingTop: mob ? '60px' : '80px',
                        padding: mob ? '50px 18px 20px' : '70px 48px 80px',
                        opacity: contactIn ? 1 : 0,
                        animation: contactIn ? 'contactFadeUp 0.7s ease-out 0.1s both' : 'none',
                    }}
                >
                    <div
                        style={{
                            width: mob ? '100%' : '650px',
                            maxWidth: '100%',
                        }}
                    >
                        <p
                            style={{
                                fontSize: mob ? '9.5px' : '11px',
                                color: 'rgba(255,255,255,0.36)',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                marginBottom: mob ? '8px' : '12px',
                                textAlign: 'center',
                            }}
                        >
                            Get in touch
                        </p>

                        <h2
                            style={{
                                fontSize: mob
                                    ? 'clamp(16px, 4.5vw, 22px)'
                                    : 'clamp(20px, 2.6vw, 34px)',
                                fontWeight: 300,
                                color: '#fff',
                                lineHeight: 1.28,
                                letterSpacing: '-0.02em',
                                marginBottom: mob ? '18px' : '30px',
                                textAlign: 'center',
                            }}
                        >
                            Your Partner in Law:
                            <br />
                            Reliable Legal Support for Your Business
                        </h2>

                        {/* Form */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: mob ? '9px' : '13px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: mob ? '7px' : '11px',
                                }}
                            >
                                <Field label="Name" placeholder="Your name" mob={mob} />
                                <Field label="Surname" placeholder="Your surname" mob={mob} />
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: mob ? '7px' : '11px',
                                }}
                            >
                                <Field
                                    label="E-mail"
                                    placeholder="hello@example.com"
                                    type="email"
                                    mob={mob}
                                />
                                <div>
                                    <Lbl mob={mob}>Phone</Lbl>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <div
                                            style={{
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.10)',
                                                borderRadius: '8px',
                                                padding: mob ? '6px 7px' : '9px 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '3px',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <span style={{ fontSize: mob ? '11px' : '13px' }}>
                                                🇺🇦
                                            </span>
                                            <span
                                                style={{
                                                    color: 'rgba(255,255,255,0.28)',
                                                    fontSize: '8px',
                                                }}
                                            >
                                                ▾
                                            </span>
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="+380"
                                            style={{
                                                flex: 1,
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.10)',
                                                borderRadius: '8px',
                                                padding: mob ? '6px 10px' : '9px 12px',
                                                color: '#fff',
                                                fontSize: mob ? '11px' : '12px',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) =>
                                                (e.target.style.borderColor =
                                                    'rgba(110,65,220,0.80)')
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor =
                                                    'rgba(255,255,255,0.10)')
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleAgree}
                            >
                                <div
                                    style={{
                                        width: mob ? '13px' : '15px',
                                        height: mob ? '13px' : '15px',
                                        borderRadius: '4px',
                                        flexShrink: 0,
                                        border: agreedLocal
                                            ? '1px solid rgba(110,65,220,0.80)'
                                            : '1px solid rgba(255,255,255,0.28)',
                                        background: agreedLocal
                                            ? 'rgba(90,40,210,0.85)'
                                            : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.18s',
                                    }}
                                >
                                    {agreedLocal && (
                                        <span
                                            style={{
                                                color: '#fff',
                                                fontSize: mob ? '8px' : '9px',
                                                lineHeight: 1,
                                            }}
                                        >
                                            ✓
                                        </span>
                                    )}
                                </div>
                                <span
                                    style={{
                                        fontSize: mob ? '10px' : '11px',
                                        color: 'rgba(255,255,255,0.38)',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    I agree to the{' '}
                                    <span
                                        style={{
                                            color: 'rgba(140,100,250,0.95)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Privacy Policy
                                    </span>
                                </span>
                            </div>

                            <button
                                style={{
                                    width: '100%',
                                    padding: mob ? '11px' : '13px',
                                    background: 'linear-gradient(135deg, #5a28b8 0%, #3e18a0 100%)',
                                    border: '1px solid rgba(120,70,240,0.40)',
                                    borderRadius: '9px',
                                    color: '#fff',
                                    fontSize: mob ? '12px' : '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    letterSpacing: '0.03em',
                                    transition: 'opacity 0.2s, transform 0.15s',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '0.88';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Lbl({ children, mob }: { children: React.ReactNode; mob: boolean }) {
    return (
        <label
            style={{
                display: 'block',
                fontSize: mob ? '9.5px' : '11px',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: mob ? '4px' : '6px',
                letterSpacing: '0.03em',
            }}
        >
            {children}
        </label>
    );
}

function Field({
    label,
    placeholder,
    type = 'text',
    mob,
}: {
    label: string;
    placeholder: string;
    type?: string;
    mob: boolean;
}) {
    return (
        <div>
            <Lbl mob={mob}>{label}</Lbl>
            <input
                type={type}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '8px',
                    padding: mob ? '6px 10px' : '9px 13px',
                    color: '#fff',
                    fontSize: mob ? '11px' : '12px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(110,65,220,0.80)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
        </div>
    );
}
