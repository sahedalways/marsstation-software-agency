// components/Navbar.tsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
    mob: boolean;
}

export function Navbar({ mob }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // 50px scroll করলেই background দেখাবে
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Inline keyframes for the fade-in effect */}
            <style>{`
                @keyframes navBgFadeIn {
                    from {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                        -webkit-backdrop-filter: blur(0px);
                    }
                    to {
                        opacity: 1;
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                    }
                }
                .ius-btn {
                    border: 1px solid rgba(255,255,255,0.26);
                    border-radius: 9999px;
                    background: rgba(255,255,255,0.05);
                    color: rgba(255,255,255,0.90);
                    cursor: pointer;
                    font-family: inherit;
                    letter-spacing: 0.02em;
                    transition: background 0.22s, border-color 0.22s;
                }
                .ius-btn:hover {
                    background: rgba(255,255,255,0.10);
                    border-color: rgba(255,255,255,0.44);
                }
            `}</style>

            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: mob ? '14px 22px' : '18px 48px',
                    transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',

                    // ─── Scroll-based background ───
                    // Deep purple center, fading to transparent on edges
                    background: scrolled
                        ? 'linear-gradient(90deg, rgba(15, 5, 40, 0.0) 0%, rgba(30, 10, 70, 0.65) 15%, rgba(45, 15, 90, 0.85) 35%, rgba(55, 18, 110, 0.92) 50%, rgba(45, 15, 90, 0.85) 65%, rgba(30, 10, 70, 0.65) 85%, rgba(15, 5, 40, 0.0) 100%)'
                        : 'transparent',

                    backdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'blur(0px)',
                    WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.6)' : 'blur(0px)',

                    // Subtle bottom border glow when scrolled
                    borderBottom: scrolled
                        ? '1px solid rgba(130, 60, 255, 0.18)'
                        : '1px solid transparent',

                    // Soft purple shadow underneath
                    boxShadow: scrolled
                        ? '0 4px 30px rgba(80, 20, 180, 0.25), 0 1px 8px rgba(60, 15, 140, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                        : 'none',
                }}
            >
                {/* ─── Left: Logo ─── */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: mob ? '4px 8px' : '6px 12px',
                            borderRadius: '12px',
                            transition: 'box-shadow 0.35s ease, transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                                '0 10px 30px rgba(115, 42, 235, 0.45)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={mob ? 110 : 150}
                            height={mob ? 36 : 48}
                            style={{
                                width: 'auto',
                                height: mob ? '36px' : '48px',
                                objectFit: 'contain',
                            }}
                            priority
                        />
                    </span>
                </Link>

                {/* ─── Right: CTA Button ─── */}
                <button
                    className="ius-btn"
                    style={{
                        padding: mob ? '6px 16px' : '8px 22px',
                        fontSize: mob ? '11px' : '12px',
                        transition:
                            'background 0.22s, border-color 0.22s, box-shadow 0.3s, transform 0.3s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(130, 60, 255, 0.35)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Consultation
                </button>
            </nav>
        </>
    );
}
