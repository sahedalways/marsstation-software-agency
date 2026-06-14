// components/home/HeroSec.tsx
'use client';

import { RefObject } from 'react';

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
`}</style>
            <div
                style={{
                    position: 'absolute',
                    top: mob ? '6%' : '16%',
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
                <p
                    style={{
                        fontSize: mob ? '10px' : '11px',
                        color: 'rgba(255,255,255,0.40)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        marginBottom: mob ? '10px' : '30px',
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    Digital Legal Services
                </p>

                <h1
                    style={{
                        fontSize: mob ? 'clamp(22px, 7vw, 32px)' : 'clamp(32px, 5vw, 62px)',
                        fontWeight: 300,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.08,
                        color: '#fff',
                        marginBottom: mob ? '10px' : '18px',
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    Digital Law on your side
                </h1>

                <p
                    style={{
                        fontSize: mob ? '11px' : '14px',
                        color: 'rgba(255,255,255,0.44)',
                        lineHeight: 1.8,
                        marginBottom: mob ? '16px' : '30px',
                        maxWidth: mob ? '260px' : '440px',
                        margin: `0 auto ${mob ? '22px' : '30px'}`,
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    Obtaining IT benefits, business support,
                    <br />
                    program registration, development of complex contracts
                </p>

                <button
                    ref={btnRef}
                    className="ius-btn"
                    style={{
                        padding: mob ? '9px 24px' : '10px 28px',
                        fontSize: mob ? '12px' : '13px',
                        opacity: phase === 'hero' ? 1 : 0,
                        animation:
                            phase === 'hero'
                                ? 'dropFromTop 1.6s cubic-bezier(.16,1,.3,1) 0.35s both'
                                : 'none',
                    }}
                >
                    Get services
                </button>
            </div>
        </>
    );
}
