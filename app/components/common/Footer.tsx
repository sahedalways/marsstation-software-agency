// components/common/Footer.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../../config/site';

interface FooterProps {
    mob: boolean;
}

export function Footer({ mob }: FooterProps) {
    const supportEmail = siteConfig?.supportEmail;
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'MARSSTATION';
    const parentCompany = process.env.NEXT_PUBLIC_PARENT_COMPANY || 'ATMOSPHERE+ LTD';
    const currentYear = new Date().getFullYear();

    const linkHover = (e: React.MouseEvent<HTMLElement>, hover: boolean) => {
        e.currentTarget.style.color = hover ? '#ffffff' : 'rgba(255,255,255,0.6)';
    };

    return (
        <section
            style={{
                marginTop: mob ? '50px' : '70px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: '#0a0e27',
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
                    opacity: 0.25,
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
                    opacity: 0.25,
                    pointerEvents: 'none',
                }}
            />

            {/* Main Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: mob ? '32px 20px' : '48px 60px',
                    display: 'grid',
                    gridTemplateColumns: mob
                        ? '1fr'
                        : 'minmax(200px, 1.2fr) minmax(220px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr) minmax(240px, 1.2fr)',
                    gap: mob ? '32px' : '40px',
                    alignItems: 'flex-start',
                }}
            >
                {/* Brand Column */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',

                        gap: '16px',
                        alignItems: 'flex-start',
                    }}
                >
                    <Link href="/" style={{ textDecoration: 'none', marginLeft: '-12px' }}>
                        <Image
                            src="/images/secondary-logo.png"
                            alt={appName}
                            width={mob ? 170 : 210}
                            height={mob ? 46 : 58}
                            style={{
                                width: 'auto',
                                height: mob ? '46px' : '58px',
                                objectFit: 'contain',
                            }}
                            priority
                        />
                    </Link>

                    <p
                        style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.6,
                            fontWeight: 400,
                            margin: 0,
                        }}
                    >
                        Building Digital Solutions
                        <br />
                        for a Smarter Future.
                    </p>
                </div>

                {/* Contact Us Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4
                        style={{
                            fontSize: '15px',
                            color: '#ffffff',
                            fontWeight: 600,
                            margin: 0,
                            marginBottom: '4px',
                        }}
                    >
                        Contact Us
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0, marginTop: '2px' }}
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span
                            style={{
                                fontSize: '13px',
                                color: 'rgba(255,255,255,0.6)',
                                lineHeight: 1.5,
                            }}
                        >
                            13B Vallance Road, E1 5HS,
                            <br />
                            London, United Kingdom
                        </span>
                    </div>

                    <a
                        href={`mailto:${supportEmail}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textDecoration: 'none',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '13px',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => linkHover(e, true)}
                        onMouseLeave={(e) => linkHover(e, false)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0 }}
                        >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        {supportEmail}
                    </a>
                </div>

                {/* Quick Links Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4
                        style={{
                            fontSize: '15px',
                            color: '#ffffff',
                            fontWeight: 600,
                            margin: 0,
                            marginBottom: '4px',
                        }}
                    >
                        Quick Links
                    </h4>

                    {[
                        { label: 'About Us', href: '/about' },
                        { label: 'Privacy Policy', href: '/privacy-policy' },
                        { label: 'Terms & Conditions', href: '/terms-conditions' },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                textDecoration: 'none',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '13px',
                                transition: 'color 0.2s',
                                maxWidth: '180px',
                            }}
                            onMouseEnter={(e) => linkHover(e, true)}
                            onMouseLeave={(e) => linkHover(e, false)}
                        >
                            <span>{link.label}</span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </Link>
                    ))}
                </div>

                {/* Follow Us Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4
                        style={{
                            fontSize: '15px',
                            color: '#ffffff',
                            fontWeight: 600,
                            margin: 0,
                            marginBottom: '4px',
                        }}
                    >
                        Follow Us
                    </h4>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {/* Facebook */}
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: '#1877F2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = 'translateY(-2px)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = 'translateY(0)')
                            }
                            aria-label="Facebook"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background:
                                    'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = 'translateY(-2px)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = 'translateY(0)')
                            }
                            aria-label="Instagram"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: '#FF0000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = 'translateY(-2px)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = 'translateY(0)')
                            }
                            aria-label="YouTube"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>

                        {/* TikTok */}
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: '#000000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = 'translateY(-2px)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = 'translateY(0)')
                            }
                            aria-label="TikTok"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Company Information Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4
                        style={{
                            fontSize: '15px',
                            color: '#ffffff',
                            fontWeight: 600,
                            margin: 0,
                            marginBottom: '4px',
                        }}
                    >
                        Company Information
                    </h4>

                    <p
                        style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.6)',
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        Companies House Number: 16096592
                    </p>
                    <p
                        style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.6)',
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        Company type: Private limited Company
                    </p>
                    <p
                        style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.6)',
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        Nature of business (SIC): 46510
                    </p>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: mob ? '16px 20px' : '20px 60px',
                    textAlign: 'center',
                }}
            >
                <p
                    style={{
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.5)',
                        margin: 0,
                        fontWeight: 400,
                    }}
                >
                    © {currentYear} {appName} / We are part of {parentCompany}
                </p>
            </div>
        </section>
    );
}
