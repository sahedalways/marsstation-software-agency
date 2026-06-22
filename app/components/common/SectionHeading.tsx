'use client';

import React from 'react';

interface SectionHeadingProps {
    badge?: string;
    badgeIcon?: React.ReactNode;
    title: string;
    highlight?: string;
    subtitle?: string;
    mob: boolean;
    cardsIn?: boolean;
    align?: 'center' | 'left';
}

export function SectionHeading({
    badge,
    badgeIcon,
    title,
    highlight,
    subtitle,
    mob,
    cardsIn = true,
    align = 'center',
}: SectionHeadingProps) {
    // Split title to inject highlight span
    const renderTitle = () => {
        if (!highlight) return title;
        const idx = title.indexOf(highlight);
        if (idx === -1) return title;
        const before = title.slice(0, idx);
        const after = title.slice(idx + highlight.length);
        return (
            <>
                {before}
                <span
                    style={{
                        background: 'linear-gradient(90deg, #c084fc 0%, #a855f7 50%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {highlight}
                </span>
                {after}
            </>
        );
    };

    const defaultStar = (
        <svg
            width={mob ? 12 : 14}
            height={mob ? 12 : 14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );

    return (
        <>
            <style>{`
                @keyframes shFadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div
                style={{
                    width: '100%',
                    maxWidth: '900px',
                    margin: '0 auto',
                    textAlign: align,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: align === 'center' ? 'center' : 'flex-start',
                    gap: mob ? '14px' : '20px',
                    marginBottom: mob ? '28px' : '48px',
                }}
            >
                {/* Badge */}
                {badge && (
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: mob ? '5px 12px' : '6px 15px',
                            borderRadius: '999px',
                            border: '1px solid rgba(168, 85, 247, 0.35)',
                            background: 'rgba(88, 28, 135, 0.12)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            opacity: cardsIn ? 1 : 0,
                            animation: cardsIn ? 'shFadeUp 0.7s ease-out 0s both' : 'none',
                            boxShadow: '0 0 16px rgba(168, 85, 247, 0.12)',
                        }}
                    >
                        {badgeIcon ?? defaultStar}

                        <span
                            style={{
                                fontSize: mob ? '9px' : '11px',
                                fontWeight: 600,
                                color: '#c084fc',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {badge}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h2
                    style={{
                        fontSize: mob ? 'clamp(18px, 4.8vw, 24px)' : 'clamp(26px, 3.2vw, 40px)',
                        fontWeight: 700,
                        lineHeight: 1.15,
                        color: '#ffffff',
                        letterSpacing: '-0.02em',
                        margin: 0,
                        opacity: cardsIn ? 1 : 0,
                        animation: cardsIn ? 'shFadeUp 0.75s ease-out 0.15s both' : 'none',
                    }}
                >
                    {renderTitle()}
                </h2>
                {/* Subtitle */}
                {subtitle && (
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
                        {subtitle}
                    </p>
                )}
            </div>
        </>
    );
}
