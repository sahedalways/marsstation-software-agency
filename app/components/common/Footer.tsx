// components/common/Footer.tsx
'use client';

import Link from 'next/link';

interface FooterProps {
    mob: boolean;
}

export function Footer({ mob }: FooterProps) {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Mars Station';

    return (
        <section
            style={{
                marginTop: '70px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: '#020108',
                borderTop: '1px solid rgba(90,40,184,0.2)',
            }}
        >
            {/* Left Glow */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '-60px',
                    width: '200px',
                    height: '200px',
                    background: '#5a28b8',
                    filter: 'blur(100px)',
                    opacity: 0.35,
                    pointerEvents: 'none',
                }}
            />

            {/* Right Glow */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-40px',
                    right: '-60px',
                    width: '200px',
                    height: '200px',
                    background: '#5a28b8',
                    filter: 'blur(100px)',
                    opacity: 0.35,
                    pointerEvents: 'none',
                }}
            />

            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: mob ? '24px 16px' : '32px 48px',
                    gap: mob ? '8px' : '12px',
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <div
                        style={{
                            fontSize: mob ? '18px' : '22px',
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: '0.02em',
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            display: 'inline-block',
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                'linear-gradient(135deg, rgba(90,40,184,0.25), rgba(255,255,255,0.05))';
                            e.currentTarget.style.backdropFilter = 'blur(10px)';
                            e.currentTarget.style.boxShadow = '0 0 25px rgba(90,40,184,0.4)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.backdropFilter = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {appName}
                    </div>
                </Link>

                {/* Divider */}
                <div
                    style={{
                        width: '40px',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #5a28b8, transparent)',
                        borderRadius: '1px',
                    }}
                />

                {/* Copyright */}
                <p
                    style={{
                        fontSize: mob ? '10px' : '11px',
                        color: 'rgba(255,255,255,0.35)',
                        textAlign: 'center',
                        lineHeight: 1.6,
                        fontWeight: 300,
                    }}
                >
                    © {new Date().getFullYear()} {appName}. All rights reserved.
                </p>

                {/* Links */}
                <div
                    style={{
                        display: 'flex',
                        gap: mob ? '16px' : '24px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <span
                        style={{
                            fontSize: mob ? '10px' : '11px',
                            color: 'rgba(255,255,255,0.4)',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#5a28b8')}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')
                        }
                    >
                        Privacy Policy
                    </span>

                    <span
                        style={{
                            fontSize: mob ? '10px' : '11px',
                            color: 'rgba(255,255,255,0.4)',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#5a28b8')}
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')
                        }
                    >
                        Terms of Service
                    </span>
                </div>
            </div>
        </section>
    );
}
