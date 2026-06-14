// components/common/Footer.tsx
'use client';

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
                <div
                    style={{
                        fontSize: mob ? '18px' : '22px',
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '0.02em',
                    }}
                >
                    {appName}
                </div>

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
