'use client';

import { RefObject } from 'react';

interface GlobalButtonProps {
    title: string;
    phase?: string;
    mob?: boolean;
    disabled?: boolean;
    btnRef?: RefObject<HTMLButtonElement | null>;
    onGetServices?: () => void;
}

export function GlobalButton({
    title,
    phase = 'hero',
    mob = false,
    btnRef,
    disabled,
    onGetServices,
}: GlobalButtonProps) {
    return (
        <>
            <style>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
.hero-cta-btn {
    background: linear-gradient(
        90deg,
        #a855f7 0%,
        #6366f1 50%,
        #3b82f6 100%
    );
    color: #fff;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    box-shadow:
        0 10px 30px rgba(99,102,241,.4),
        0 0 60px rgba(168,85,247,.25);

    transition: all .3s ease;
}
                .hero-cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 14px 40px rgba(99,102,241,.55),
                        0 0 80px rgba(168,85,247,.35);
                }
            `}</style>

            <button
                onClick={onGetServices}
                disabled={disabled}
                ref={btnRef}
                className="hero-cta-btn"
                style={{
                    padding: mob ? '12px 32px' : '14px 44px',
                    fontSize: mob ? '13px' : '15px',
                    opacity: phase === 'hero' ? 1 : 0,
                }}
            >
                {title}
                <span style={{ fontSize: mob ? '14px' : '16px' }}>→</span>
            </button>
        </>
    );
}
