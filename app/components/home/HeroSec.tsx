// components/home/HeroSec.tsx
'use client';

import { RefObject } from 'react';

interface HeroSecProps {
    phase: string;
    mob: boolean;
    btnRef: RefObject<HTMLButtonElement | null>;
}

export function HeroSec({ phase, mob, btnRef }: HeroSecProps) {
    if (phase !== 'hero') return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: mob ? '13%' : '16%',
                left: 0,
                right: 0,
                textAlign: 'center',
                padding: mob ? '0 28px' : '0 48px',
                zIndex: 10,
            }}
        >
            <p
                style={{
                    fontSize: mob ? '10px' : '11px',
                    color: 'rgba(255,255,255,0.40)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: mob ? '10px' : '14px',
                }}
            >
                Digital Legal Services
            </p>

            <h1
                style={{
                    fontSize: mob ? 'clamp(26px, 7.5vw, 38px)' : 'clamp(32px, 5vw, 62px)',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.08,
                    color: '#fff',
                    marginBottom: mob ? '14px' : '18px',
                }}
            >
                Digital Law on your side
            </h1>

            <p
                style={{
                    fontSize: mob ? '12px' : '14px',
                    color: 'rgba(255,255,255,0.44)',
                    lineHeight: 1.8,
                    marginBottom: mob ? '22px' : '30px',
                    maxWidth: mob ? '290px' : '440px',
                    margin: `0 auto ${mob ? '22px' : '30px'}`,
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
                }}
            >
                Get services
            </button>
        </div>
    );
}
