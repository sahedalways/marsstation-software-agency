// components/home/sections/TestimonialSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { SectionHeading } from '../../common/SectionHeading';

interface Props {
    cardsIn: boolean;
    mob: boolean;
}

interface Testimonial {
    name: string;
    role: string;
    avatar: string;
    text: string;
    rating: number;
}

export function TestimonialSection({ cardsIn, mob }: Props) {
    const testimonials: Testimonial[] = [
        {
            name: 'Sarah Johnson',
            role: 'CEO, BrightWave',
            avatar: 'https://i.pravatar.cc/150?img=47',
            text: 'MarsStation completely transformed our online presence. The team was professional, responsive, and delivered beyond our expectations.',
            rating: 5,
        },
        {
            name: 'Mike Thompson',
            role: 'CEO, TechSolutions Inc.',
            avatar: 'https://i.pravatar.cc/150?img=33',
            text: 'Outstanding experience from start to finish. Our new website has significantly increased our conversions and customer engagement.',
            rating: 5,
        },
        {
            name: 'Emily Rodriguez',
            role: 'Founder, Bloom & Co.',
            avatar: 'https://i.pravatar.cc/150?img=45',
            text: 'The mobile app they developed for us is incredible. Clean design, smooth performance, and our users absolutely love it!',
            rating: 5,
        },
        {
            name: 'David Kim',
            role: 'CTO, InnovateLab',
            avatar: 'https://i.pravatar.cc/150?img=12',
            text: 'Highly skilled team with excellent communication. They delivered our project on time and within budget. Highly recommended!',
            rating: 5,
        },
        {
            name: 'Lisa Chen',
            role: 'Marketing Manager',
            avatar: 'https://i.pravatar.cc/150?img=44',
            text: 'Working with MarsStation has been a game-changer for our business. Their attention to detail and creativity sets them apart.',
            rating: 5,
        },
        {
            name: 'James Wilson',
            role: 'Founder, NexaTech',
            avatar: 'https://i.pravatar.cc/150?img=51',
            text: 'Exceptional service and top-notch quality. The MarsStation team understood our vision and brought it to life beautifully.',
            rating: 5,
        },
        {
            name: 'Ana Martínez',
            role: 'Director, PixelPro',
            avatar: 'https://i.pravatar.cc/150?img=49',
            text: 'A truly talented team. From design to deployment, they handled everything seamlessly. We are extremely happy with the results.',
            rating: 5,
        },
    ];

    const [activeIdx, setActiveIdx] = useState(2);
    const total = testimonials.length;
    const autoRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-rotate
    useEffect(() => {
        if (!cardsIn) return;
        if (autoRef.current) clearInterval(autoRef.current);
        autoRef.current = setInterval(() => {
            setActiveIdx((p) => (p + 1) % total);
        }, 5000);
        return () => {
            if (autoRef.current) clearInterval(autoRef.current);
        };
    }, [cardsIn, total]);

    const restartAuto = () => {
        if (autoRef.current) clearInterval(autoRef.current);
        autoRef.current = setInterval(() => {
            setActiveIdx((p) => (p + 1) % total);
        }, 5000);
    };

    const goPrev = () => {
        setActiveIdx((p) => (p - 1 + total) % total);
        restartAuto();
    };
    const goNext = () => {
        setActiveIdx((p) => (p + 1) % total);
        restartAuto();
    };

    const renderStars = (count: number) => (
        <div style={{ display: 'inline-flex', gap: '3px' }}>
            {Array.from({ length: count }).map((_, i) => (
                <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="#fbbf24"
                    stroke="#fbbf24"
                    strokeWidth="1"
                    strokeLinejoin="round"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );

    const groupIcon = (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c084fc"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );

    // Sizing
    const cardWidth = mob ? 230 : 300;
    const cardHeight = mob ? 320 : 380;
    const gap = mob ? 14 : 28;
    const sideVisible = mob ? 1 : 2;

    // Get shortest circular offset
    const getOffset = (i: number) => {
        const raw = i - activeIdx;
        const half = total / 2;
        if (raw > half) return raw - total;
        if (raw < -half) return raw + total;
        return raw;
    };

    return (
        <>
            <style>{`
                /* === Same keyframes as ExperienceSection === */
                @keyframes tstFlyLeft { from { opacity:0; translate:-80px 0; } to { opacity:1; translate:0 0; } }
                @keyframes tstFlyRight { from { opacity:0; translate:80px 0; } to { opacity:1; translate:0 0; } }
                @keyframes tstFlyBottom { from { opacity:0; translate:0 80px; } to { opacity:1; translate:0 0; } }
                @keyframes tstFlyTop { from { opacity:0; translate:0 -40px; } to { opacity:1; translate:0 0; } }
                @keyframes tstFloat { 0%,100% { transform:translate(-50%, 0); } 50% { transform:translate(-50%, -6px); } }

                .tst-arrow {
                    transition: all 0.3s ease;
                }
                .tst-arrow:hover {
                    background: rgba(168,85,247,0.3) !important;
                    border-color: rgba(168,85,247,0.7) !important;
                    transform: translateY(-50%) scale(1.08);
                    box-shadow: 0 0 25px rgba(168,85,247,0.45);
                }

                /* Smooth card movement during slide change */
                .tst-card {
                    transition:
                        transform 0.7s cubic-bezier(.22,1,.36,1),
                        opacity 0.6s cubic-bezier(.22,1,.36,1),
                        border-color 0.5s ease,
                        box-shadow 0.6s ease,
                        filter 0.6s ease;
                    will-change: transform, opacity;
                }
            `}</style>

            <section
                style={{
                    width: '100%',
                    position: 'relative',
                    padding: mob ? '24px 16px 40px' : '40px 60px 60px',
                    opacity: cardsIn ? 1 : 0,
                    transition: 'opacity 0.01s',
                }}
            >
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: mob ? '24px' : '40px',
                    }}
                >
                    {/* ─── Heading (handled internally by SectionHeading) ─── */}
                    <SectionHeading
                        badge="CLIENT IMPRESSIONS"
                        badgeIcon={groupIcon}
                        title="What Our Clients Say"
                        highlight="Clients Say"
                        subtitle="Real feedback from businesses and entrepreneurs who trust us to deliver exceptional digital solutions."
                        mob={mob}
                        cardsIn={cardsIn}
                    />

                    {/* ─── Slider Wrapper ─── */}
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: cardsIn ? 1 : 0,
                            animation: cardsIn
                                ? `tstFlyBottom 1s cubic-bezier(.16,1,.3,1) 0.45s both`
                                : 'none',
                        }}
                    >
                        {/* Left Arrow */}
                        <button
                            onClick={goPrev}
                            className="tst-arrow"
                            aria-label="Previous"
                            style={{
                                position: 'absolute',
                                left: '0px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: mob ? '38px' : '48px',
                                height: mob ? '38px' : '48px',
                                borderRadius: '50%',
                                background: 'rgba(20,15,40,0.7)',
                                border: '1px solid rgba(105,62,205,0.45)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                zIndex: 20,
                                opacity: cardsIn ? 1 : 0,
                                animation: cardsIn
                                    ? `tstFlyLeft 1s cubic-bezier(.16,1,.3,1) 0.75s both`
                                    : 'none',
                            }}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                        </button>

                        {/* ─── Cards Track ─── */}
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: `${cardHeight + 60}px`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                                maskImage:
                                    'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
                                WebkitMaskImage:
                                    'linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)',
                            }}
                        >
                            {testimonials.map((t, i) => {
                                const offset = getOffset(i);
                                const absOffset = Math.abs(offset);
                                const isActive = offset === 0;
                                const isInRange = absOffset <= sideVisible + 1;

                                if (!isInRange) return null;

                                const baseX = offset * (cardWidth + gap);
                                const scale =
                                    absOffset === 0
                                        ? 1
                                        : absOffset === 1
                                          ? 0.92
                                          : absOffset === 2
                                            ? 0.82
                                            : 0.7;

                                const opacity =
                                    absOffset === 0
                                        ? 1
                                        : absOffset === 1
                                          ? 0.85
                                          : absOffset === 2
                                            ? 0.35
                                            : 0;

                                // ─── Stagger entrance animation for cards (only during initial section arrival) ───
                                // Each card flies in from its offset direction
                                const cardAnimDirection =
                                    offset < 0
                                        ? 'tstFlyLeft'
                                        : offset > 0
                                          ? 'tstFlyRight'
                                          : 'tstFlyBottom';
                                const cardAnimDelay = 0.6 + absOffset * 0.12;

                                return (
                                    <div
                                        key={i}
                                        className="tst-card"
                                        style={{
                                            position: 'absolute',
                                            left: '50%',
                                            top: '50%',
                                            width: `${cardWidth}px`,
                                            height: `${cardHeight}px`,
                                            transform: `translate(-50%, -50%) translateX(${baseX}px) scale(${scale})`,
                                            opacity,
                                            zIndex: 20 - absOffset,
                                            borderRadius: '20px',
                                            padding: mob ? '20px 18px' : '26px 24px',
                                            background: isActive
                                                ? 'linear-gradient(180deg, rgba(60,25,120,0.4) 0%, rgba(20,10,40,0.6) 100%)'
                                                : 'rgba(15,10,30,0.55)',
                                            border: isActive
                                                ? '1.5px solid rgba(168,85,247,0.7)'
                                                : '1px solid rgba(105,62,205,0.35)',
                                            boxShadow: isActive
                                                ? '0 0 50px rgba(168,85,247,0.35), 0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(168,85,247,0.05)'
                                                : '0 10px 30px rgba(0,0,0,0.4)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: mob ? '12px' : '16px',
                                            pointerEvents: isActive ? 'auto' : 'none',
                                            filter: isActive ? 'none' : 'saturate(0.85)',
                                            // ─── Entrance: animate-in once on section arrival ───
                                            animation: cardsIn
                                                ? `${cardAnimDirection} 1s cubic-bezier(.16,1,.3,1) ${cardAnimDelay}s both`
                                                : 'none',
                                        }}
                                    >
                                        {/* Top: Quote + Stars */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <svg
                                                width={mob ? 26 : 32}
                                                height={mob ? 26 : 32}
                                                viewBox="0 0 24 24"
                                                fill={isActive ? '#c084fc' : '#7c3aed'}
                                            >
                                                <path d="M9.5 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2H8v.5a2.5 2.5 0 0 1-2.5 2.5H5v2h.5a4.5 4.5 0 0 0 4.5-4.5V9a2 2 0 0 0-.5-2zm9 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2H17v.5a2.5 2.5 0 0 1-2.5 2.5H14v2h.5a4.5 4.5 0 0 0 4.5-4.5V9a2 2 0 0 0-.5-2z" />
                                            </svg>
                                            {renderStars(t.rating)}
                                        </div>

                                        {/* Avatar */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                marginTop: mob ? '4px' : '8px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: mob ? '60px' : '74px',
                                                    height: mob ? '60px' : '74px',
                                                    borderRadius: '50%',
                                                    background: `url(${t.avatar}) center/cover`,
                                                    border: isActive
                                                        ? '2px solid rgba(168,85,247,0.7)'
                                                        : '2px solid rgba(105,62,205,0.4)',
                                                    boxShadow: isActive
                                                        ? '0 0 20px rgba(168,85,247,0.4)'
                                                        : 'none',
                                                    transition: 'all 0.5s ease',
                                                }}
                                            />
                                        </div>

                                        {/* Name + Role */}
                                        <div style={{ textAlign: 'center' }}>
                                            <div
                                                style={{
                                                    fontSize: mob ? '15px' : '17px',
                                                    fontWeight: 600,
                                                    color: '#fff',
                                                    marginBottom: '2px',
                                                }}
                                            >
                                                {t.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: mob ? '11px' : '12px',
                                                    color: '#c084fc',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {t.role}
                                            </div>
                                        </div>

                                        {/* Quote */}
                                        <p
                                            style={{
                                                fontSize: mob ? '12px' : '13.5px',
                                                color: 'rgba(255,255,255,0.75)',
                                                lineHeight: 1.6,
                                                textAlign: 'center',
                                                margin: 0,
                                                fontWeight: 400,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 5,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {t.text}
                                        </p>

                                        {/* Floating quote button */}
                                        {isActive && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-22px',
                                                    left: '50%',
                                                    width: mob ? '38px' : '44px',
                                                    height: mob ? '38px' : '44px',
                                                    borderRadius: '50%',
                                                    background:
                                                        'linear-gradient(135deg, #8b5cf6, #a855f7)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow:
                                                        '0 8px 22px rgba(168,85,247,0.55), 0 0 20px rgba(168,85,247,0.4)',
                                                    animation: 'tstFloat 2.6s ease-in-out infinite',
                                                }}
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="#fff"
                                                >
                                                    <path d="M9.5 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2H8v.5a2.5 2.5 0 0 1-2.5 2.5H5v2h.5a4.5 4.5 0 0 0 4.5-4.5V9a2 2 0 0 0-.5-2zm9 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2H17v.5a2.5 2.5 0 0 1-2.5 2.5H14v2h.5a4.5 4.5 0 0 0 4.5-4.5V9a2 2 0 0 0-.5-2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={goNext}
                            className="tst-arrow"
                            aria-label="Next"
                            style={{
                                position: 'absolute',
                                right: '0px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: mob ? '38px' : '48px',
                                height: mob ? '38px' : '48px',
                                borderRadius: '50%',
                                background: 'rgba(20,15,40,0.7)',
                                border: '1px solid rgba(105,62,205,0.45)',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                zIndex: 20,
                                opacity: cardsIn ? 1 : 0,
                                animation: cardsIn
                                    ? `tstFlyRight 1s cubic-bezier(.16,1,.3,1) 0.75s both`
                                    : 'none',
                            }}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>

                    {/* ─── Pagination Dots ─── */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: cardsIn ? 1 : 0,
                            animation: cardsIn
                                ? `tstFlyBottom 0.9s cubic-bezier(.16,1,.3,1) 1.1s both`
                                : 'none',
                        }}
                    >
                        {testimonials.map((_, i) => {
                            const isActive = i === activeIdx;
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setActiveIdx(i);
                                        restartAuto();
                                    }}
                                    aria-label={`Go to slide ${i + 1}`}
                                    style={{
                                        width: isActive ? '24px' : '8px',
                                        height: '8px',
                                        borderRadius: '999px',
                                        background: isActive
                                            ? 'linear-gradient(90deg, #8b5cf6, #c084fc)'
                                            : 'rgba(168,85,247,0.3)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s ease',
                                        padding: 0,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
