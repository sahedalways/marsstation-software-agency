// components/Navbar.tsx
'use client';

interface NavbarProps {
    mob: boolean;
}

export function Navbar({ mob }: NavbarProps) {
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
            <span
                style={{
                    fontSize: mob ? '15px' : '17px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#fff',
                }}
            >
                IUS
            </span>
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
