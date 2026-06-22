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

                        borderRadius: '12px',

                        border: '1px solid rgba(255,255,255,0.25)',

                        background: 'transparent',

                        backdropFilter: 'blur(8px)',

                        transition: 'all .35s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            'linear-gradient(135deg, rgba(255,255,255,.15), rgba(255,255,255,.05))';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(115,42,235,.35)';
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,.25)';
                    }}
                >
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={mob ? 80 : 105}
                        height={mob ? 26 : 34}
                        style={{
                            width: 'auto',
                            height: mob ? '26px' : '34px',
                            objectFit: 'contain',
                            transition: 'all .35s ease',
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
