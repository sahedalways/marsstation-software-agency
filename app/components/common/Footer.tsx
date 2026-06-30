// components/common/Footer.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '../../config/site';
import { usePathname } from 'next/navigation';

interface FooterProps {
    mob: boolean;
}

export function Footer({ mob }: FooterProps) {
    const pathname = usePathname();
    const supportEmail = siteConfig?.supportEmail;
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'MARSSTATION';
    const parentCompany = process.env.NEXT_PUBLIC_PARENT_COMPANY || 'ATMOSPHERE+ LTD';
    const currentYear = new Date().getFullYear();

    const linkHover = (e: React.MouseEvent<HTMLElement>, hover: boolean) => {
        e.currentTarget.style.color = hover ? '#ffffff' : 'rgba(255,255,255,0.6)';
    };

    return (
        <footer
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
                        : 'minmax(200px, 1.2fr) minmax(220px, 1fr) minmax(180px, 1fr) minmax(250px, 1.2fr) minmax(240px, 1.2fr)',
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
                            src="/images/Mars%20Station%20-%20Turning%20Vision%20Into%20Digital%20Reality.png"
                            alt={appName}
                            width={mob ? 220 : 280}
                            height={mob ? 60 : 78}
                            style={{
                                width: 'auto',
                                height: mob ? '60px' : '78px',
                                objectFit: 'contain',
                            }}
                            priority
                        />
                    </Link>

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
                        { label: 'Payment & Refund', href: '/payment-and-refund' },
                    ].map((link) => {
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    color: isActive ? '#a855f7' : 'rgba(255,255,255,0.6)',
                                    fontSize: '13px',
                                    transition: 'color 0.2s',
                                    maxWidth: '180px',
                                    fontWeight: isActive ? 600 : 400,
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
                        );
                    })}
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
                            href="https://www.facebook.com/marsstation.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
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
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/marsstation.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background:
                                    'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.2s ease, opacity 0.2s ease',
                                cursor: 'pointer',
                            }}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="2" y="2" width="20" height="20" rx="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>

                        {/* TikTok */}
                        <a
                            href="https://www.tiktok.com/@marsstation.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
                            </svg>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/447599599444"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: '#25D366',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.95 11.95 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.24-6.2-3.48-8.52z" />
                            </svg>
                        </a>

                        {/* YouTube */}
                        <a
                            href={siteConfig.social.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: '#FF0000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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
        </footer>
    );
}
