// components/home/sections/ExperienceSection.tsx
'use client';

import { SectionHeading } from '../../common/SectionHeading';

type ColorTheme = 'purple' | 'blue';

interface ExperienceSectionProps {
    cardsIn: boolean;
    mob: boolean;
}

interface StatCard {
    number: string;
    title: string;
    description: string;
    theme: ColorTheme;
    icon: React.ReactNode;
}

interface FeatureItem {
    title: string;
    description: string;
    theme: ColorTheme;
    icon: React.ReactNode;
}

export function ExperienceSection({ cardsIn, mob }: ExperienceSectionProps) {
    const themes: Record<ColorTheme, any> = {
        purple: {
            border: 'rgba(168, 85, 247, 0.35)',
            borderHover: 'rgba(168, 85, 247, 0.6)',
            bg: 'linear-gradient(135deg, rgba(88, 28, 135, 0.25) 0%, rgba(20, 10, 40, 0.4) 100%)',
            iconBg: 'rgba(168, 85, 247, 0.12)',
            iconBorder: 'rgba(168, 85, 247, 0.4)',
            iconColor: '#c084fc',
            numberGradient: 'linear-gradient(180deg, #e9d5ff 0%, #a855f7 100%)',
            glow: 'rgba(168, 85, 247, 0.25)',
            divider: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)',
        },
        blue: {
            border: 'rgba(59, 130, 246, 0.35)',
            borderHover: 'rgba(59, 130, 246, 0.6)',
            bg: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(10, 15, 40, 0.4) 100%)',
            iconBg: 'rgba(59, 130, 246, 0.12)',
            iconBorder: 'rgba(59, 130, 246, 0.4)',
            iconColor: '#60a5fa',
            numberGradient: 'linear-gradient(180deg, #dbeafe 0%, #3b82f6 100%)',
            glow: 'rgba(59, 130, 246, 0.25)',
            divider: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)',
        },
    };

    const stats: StatCard[] = [
        {
            number: '1500+',
            title: 'Websites Delivered',
            description: 'Custom websites built with modern technologies and powerful features.',
            theme: 'purple',
            icon: (
                <svg
                    width={mob ? 32 : 40}
                    height={mob ? 32 : 40}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <polyline points="9 8 7 10 9 12" />
                    <polyline points="15 8 17 10 15 12" />
                    <line x1="13" y1="7" x2="11" y2="13" />
                </svg>
            ),
        },
        {
            number: '450+',
            title: 'Mobile Apps Delivered',
            description: 'High-performance mobile apps for iOS, Android & Cross-Platform.',
            theme: 'blue',
            icon: (
                <svg
                    width={mob ? 32 : 40}
                    height={mob ? 32 : 40}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="6" y="2" width="12" height="20" rx="2.5" />
                    <polyline points="10 7 8.5 8.5 10 10" />
                    <polyline points="14 7 15.5 8.5 14 10" />
                    <line x1="13" y1="6.5" x2="11" y2="10.5" />
                    <line x1="11" y1="19" x2="13" y2="19" />
                </svg>
            ),
        },
    ];

    const features: FeatureItem[] = [
        {
            title: 'Fast Delivery',
            description: 'On-time delivery with agile development.',
            theme: 'purple',
            icon: (
                <svg
                    width={mob ? 22 : 26}
                    height={mob ? 22 : 26}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
            ),
        },
        {
            title: 'Quality Assured',
            description: 'We ensure 100% quality in every project.',
            theme: 'blue',
            icon: (
                <svg
                    width={mob ? 22 : 26}
                    height={mob ? 22 : 26}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
        },
        {
            title: 'Expert Support',
            description: 'Dedicated support whenever you need.',
            theme: 'purple',
            icon: (
                <svg
                    width={mob ? 22 : 26}
                    height={mob ? 22 : 26}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z" />
                </svg>
            ),
        },
        {
            title: 'Global Clients',
            description: 'Serving clients from different countries.',
            theme: 'blue',
            icon: (
                <svg
                    width={mob ? 22 : 26}
                    height={mob ? 22 : 26}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            ),
        },
    ];

    const statAnims = ['flyLeft', 'flyRight'];
    const featureAnims = ['flyLeft', 'flyBottom', 'flyBottom', 'flyRight'];

    return (
        <>
            <style>{`
                @keyframes flyLeft { from { opacity:0; translate:-80px 0; } to { opacity:1; translate:0 0; } }
                @keyframes flyBottom { from { opacity:0; translate:0 80px; } to { opacity:1; translate:0 0; } }
                @keyframes flyRight { from { opacity:0; translate:80px 0; } to { opacity:1; translate:0 0; } }

                .exp-stat-wrap {
                    transition: transform 0.5s cubic-bezier(.16,1,.3,1);
                    will-change: transform;
                }
                .exp-stat-wrap:hover { transform: translateY(-6px); }

                .exp-stat-inner {
                    transition: border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
                }

                .exp-feat-wrap {
                    transition: transform 0.4s cubic-bezier(.16,1,.3,1);
                    will-change: transform;
                }
                .exp-feat-wrap:hover { transform: translateY(-3px); }

                .exp-feat-icon { transition: box-shadow 0.3s ease; }
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
                    {/* ─── Global Heading Component ─── */}
                    <SectionHeading
                        badge="OUR EXPERIENCE"
                        title="Experience That Delivers Results"
                        highlight="Delivers Results"
                        subtitle="We take pride in delivering high-quality digital solutions that help businesses grow, scale and succeed worldwide."
                        mob={mob}
                        cardsIn={cardsIn}
                    />

                    {/* Top Stat Cards */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
                            gap: mob ? '16px' : '24px',
                            marginTop: mob ? '-8px' : '-12px',
                        }}
                    >
                        {stats.map((stat, idx) => {
                            const t = themes[stat.theme];

                            return (
                                <div
                                    key={idx}
                                    className="exp-stat-wrap"
                                    style={{
                                        opacity: cardsIn ? 1 : 0,
                                        animation: cardsIn
                                            ? `${statAnims[idx]} 1s cubic-bezier(.16,1,.3,1) ${0.45 + idx * 0.15}s both`
                                            : 'none',
                                    }}
                                >
                                    <div
                                        className="exp-stat-inner"
                                        style={{
                                            position: 'relative',
                                            borderRadius: '16px',
                                            border: `1px solid ${t.border}`,
                                            background: t.bg,
                                            padding: mob ? '16px' : '24px 28px',
                                            overflow: 'hidden',
                                            boxShadow: `0 0 20px ${t.glow}, inset 0 0 15px rgba(255,255,255,0.01)`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = t.borderHover;
                                            e.currentTarget.style.boxShadow = `0 0 35px ${t.glow}, inset 0 0 25px rgba(255,255,255,0.02)`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = t.border;
                                            e.currentTarget.style.boxShadow = `0 0 20px ${t.glow}, inset 0 0 15px rgba(255,255,255,0.01)`;
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: mob ? '12px' : '18px',
                                            }}
                                        >
                                            {/* Icon */}
                                            <div
                                                style={{
                                                    width: mob ? '52px' : '72px',
                                                    height: mob ? '52px' : '72px',
                                                    borderRadius: '50%',
                                                    background: t.iconBg,
                                                    border: `1.5px solid ${t.iconBorder}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: t.iconColor,
                                                    flexShrink: 0,
                                                    boxShadow: `inset 0 0 15px ${t.glow}`,
                                                }}
                                            >
                                                {stat.icon}
                                            </div>

                                            {/* Number + Title */}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '2px',
                                                }}
                                            >
                                                <h2
                                                    style={{
                                                        fontSize: mob ? '24px' : '40px',
                                                        fontWeight: 700,
                                                        margin: 0,
                                                        lineHeight: 1,
                                                        background: t.numberGradient,
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        backgroundClip: 'text',
                                                        letterSpacing: '-1px',
                                                    }}
                                                >
                                                    {stat.number}
                                                </h2>

                                                <h3
                                                    style={{
                                                        fontSize: mob ? '13px' : '17px',
                                                        fontWeight: 500,
                                                        color: '#ffffff',
                                                        margin: 0,
                                                        marginTop: '3px',
                                                    }}
                                                >
                                                    {stat.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '1px',
                                                background: t.divider,
                                                margin: mob ? '12px 0' : '18px 0 16px',
                                            }}
                                        />

                                        {/* Description */}
                                        <p
                                            style={{
                                                fontSize: mob ? '11px' : '13px',
                                                color: 'rgba(255,255,255,0.65)',
                                                lineHeight: 1.6,
                                                margin: 0,
                                                fontWeight: 400,
                                            }}
                                        >
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom Feature Items */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4, 1fr)',
                            gap: mob ? '20px 16px' : '24px',
                        }}
                    >
                        {features.map((feat, idx) => {
                            const t = themes[feat.theme];

                            return (
                                <div
                                    key={idx}
                                    className="exp-feat-wrap"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: mob ? '10px' : '14px',
                                        opacity: cardsIn ? 1 : 0,
                                        animation: cardsIn
                                            ? `${featureAnims[idx]} 0.9s cubic-bezier(.16,1,.3,1) ${0.75 + idx * 0.1}s both`
                                            : 'none',
                                    }}
                                >
                                    <div
                                        className="exp-feat-icon"
                                        style={{
                                            width: mob ? '36px' : '46px',
                                            height: mob ? '36px' : '46px',
                                            borderRadius: '50%',
                                            background: t.iconBg,
                                            border: `1px solid ${t.iconBorder}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: t.iconColor,
                                            flexShrink: 0,
                                            boxShadow: `inset 0 0 10px ${t.glow}`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = `0 0 16px ${t.glow}, inset 0 0 12px ${t.glow}`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = `inset 0 0 10px ${t.glow}`;
                                        }}
                                    >
                                        {feat.icon}
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '3px',
                                        }}
                                    >
                                        <h4
                                            style={{
                                                fontSize: mob ? '11px' : '15px',
                                                fontWeight: 600,
                                                color: '#ffffff',
                                                margin: 0,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {feat.title}
                                        </h4>

                                        <p
                                            style={{
                                                fontSize: mob ? '11px' : '12px',
                                                color: 'rgba(255,255,255,0.6)',
                                                margin: 0,
                                                lineHeight: 1.45,
                                                fontWeight: 400,
                                            }}
                                        >
                                            {feat.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
