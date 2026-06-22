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
                        padding: mob ? '4px 8px' : '6px 12px',
                        transition: 'box-shadow .35s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(115,42,235,.45)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
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
