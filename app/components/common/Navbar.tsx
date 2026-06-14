// components/Navbar.tsx
'use client';
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
                        fontSize: mob ? '15px' : '19px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#fff',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        transition: 'all 0.25s ease',
                        display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            'linear-gradient(135deg, rgba(90,40,184,0.25), rgba(255,255,255,0.06))';
                        e.currentTarget.style.backdropFilter = 'blur(8px)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(90,40,184,0.35)';
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
