// components/Navbar.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
    mob: boolean;
}

export function Navbar({ mob }: NavbarProps) {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Mars Station';

    return (
        <nav
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: mob ? '18px 22px' : '24px 48px',
            }}
        >
            <Link href="/" style={{ textDecoration: 'none' }}>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',

                        padding: mob ? '2px 5px' : '3px 6px',

                        borderRadius: '7px',

                        background: 'rgba(255,255,255,0.82)',

                        border: '1px solid rgba(255,255,255,0.35)',

                        boxShadow: '0 4px 14px rgba(255,255,255,0.08)',

                        transition: 'all .25s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(115,42,235,.35)';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.82)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,255,255,0.08)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                >
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={mob ? 70 : 100}
                        height={mob ? 24 : 34}
                        style={{
                            width: 'auto',
                            height: mob ? '24px' : '34px',
                            objectFit: 'contain',
                        }}
                        priority
                    />
                </span>
            </Link>
            <button
                className="ius-btn"
                style={{
                    padding: mob ? '6px 16px' : '8px 22px',
                    fontSize: mob ? '11px' : '12px',
                }}
            >
                Consultation
            </button>
        </nav>
    );
}
