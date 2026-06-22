// components/home/HeroSec.tsx
'use client';

import { RefObject } from 'react';
import { GlobalButton } from '../common/GlobalButton';

interface HeroSecProps {
    phase: string;
    mob: boolean;
    btnRef: RefObject<HTMLButtonElement | null>;
}

export function HeroSec({ phase, mob, btnRef }: HeroSecProps) {
    const isActive = phase === 'hero';

    return (
        <>
            <style>{`
@keyframes dropFromTop {
    from {
        opacity: 0;
        transform: translateY(-24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.hero-gradient-text {
    background: linear-gradient(
        90deg,
        #a855f7 0%,
        #6366f1 50%,
        #3b82f6 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}


.hero-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(8px);
}

.hero-divider {
    display: inline-block;
    width: 28px;
    height: 1px;
    background: rgba(255,255,255,0.30);
    vertical-align: middle;
}
`}</style>
            <div
                style={{
                    position: 'absolute',
                    top: mob ? '6%' : '10%',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    padding: mob ? '0 20px' : '0 48px',
                    zIndex: 10,
                    opacity: phase === 'hero' ? 1 : 0,
                    animation:
                        phase === 'hero'
                            ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                            : 'none',
                }}
            >
                {/* Top pill badge */}
                <div
                    className="hero-pill"
                    style={{
                        marginBottom: mob ? '18px' : '26px',
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    <span style={{ color: '#6366f1', fontSize: mob ? '10px' : '12px' }}>✦</span>
                    <span
                        style={{
                            fontSize: mob ? '9px' : '11px',
                            color: 'rgba(255,255,255,0.65)',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                        }}
                    >
                        Digital Solutions That Drive Growth
                    </span>
                </div>

                {/* Main Heading */}
                <h1
                    style={{
                        fontSize: mob ? 'clamp(28px, 9vw, 42px)' : 'clamp(44px, 6vw, 78px)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                        color: '#fff',
                        marginBottom: mob ? '14px' : '20px',
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    Turn Your Vision
                    <br />
                    <span className="hero-gradient-text">Into Digital Reality</span>
                </h1>

                {/* Starting From */}
                <div
                    style={{
                        marginBottom: mob ? '14px' : '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    <span className="hero-divider" />
                    <span
                        style={{
                            fontSize: mob ? '14px' : '18px',
                            color: 'rgba(255,255,255,0.85)',
                            fontWeight: 400,
                        }}
                    >
                        Starting From <span style={{ color: '#fff', fontWeight: 700 }}>£190</span>
                    </span>
                    <span className="hero-divider" />
                </div>

                {/* Description */}
                <p
                    style={{
                        fontSize: mob ? '12px' : '15px',
                        color: 'rgba(255,255,255,0.55)',
                        lineHeight: 1.7,
                        maxWidth: mob ? '300px' : '480px',
                        margin: `0 auto ${mob ? '24px' : '34px'}`,
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    Professional websites and mobile apps designed for
                    <br />
                    businesses, startups, and entrepreneurs.
                </p>

                {/* CTA Button */}
                <GlobalButton title="Get Services" phase={phase} mob={mob} btnRef={btnRef} />

                {/* Feature Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                        gap: mob ? '8px' : '12px',
                        maxWidth: mob ? '340px' : '780px',

                        margin: mob ? '20px auto 0' : '30px auto 0',
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.5s both'
                                : 'none',
                    }}
                >
                    {[
                        { icon: '🛡️', title: 'Modern & Secure', desc: 'Built with best practices' },
                        { icon: '⚡', title: 'Fast & Optimized', desc: 'Speed that converts' },
                        { icon: '📱', title: 'Responsive Design', desc: 'Perfect on every device' },
                        { icon: '🎧', title: 'Expert Support', desc: "We're here for you" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                padding: mob ? '10px 8px' : '14px 12px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.06)',
                                background: 'rgba(255,255,255,0.02)',
                                backdropFilter: 'blur(8px)',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: mob ? '8px' : '10px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: mob ? '14px' : '16px',
                                    color: '#a855f7',
                                    flexShrink: 0,
                                }}
                            >
                                {item.icon}
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: mob ? '10px' : '12px',
                                        fontWeight: 600,
                                        color: '#fff',
                                        marginBottom: '2px',
                                    }}
                                >
                                    {item.title}
                                </div>
                                <div
                                    style={{
                                        fontSize: mob ? '8px' : '10px',
                                        color: 'rgba(255,255,255,0.45)',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {item.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
