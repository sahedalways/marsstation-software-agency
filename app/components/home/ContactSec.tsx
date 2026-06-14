'use client';
import { useState } from 'react';

interface Props {
    contactIn: boolean;
    mob: boolean;
    agreed: boolean;
    setAgreed: (v: boolean) => void;
}

export function ContactSec({ contactIn, mob, agreed, setAgreed }: Props) {
    const [agreedLocal, setAgreedLocal] = useState(agreed);
    const handleAgree = () => {
        const v = !agreedLocal;
        setAgreedLocal(v);
        setAgreed(v);
    };

    return (
        <>
            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: mob ? 'center' : 'flex-end',
                    padding: mob ? '40px 18px' : '40px 56px 40px 0',
                    opacity: contactIn ? 1 : 0,
                    transition: 'opacity 0.01s',
                }}
            >
                <div
                    style={{
                        width: mob ? '100%' : '52%',
                        maxWidth: mob ? '100%' : '480px',
                        opacity: contactIn ? 1 : 0,
                        animation: contactIn ? 'fadeUp 0.7s ease-out 0.1s both' : 'none',
                    }}
                >
                    <p
                        style={{
                            fontSize: mob ? '9.5px' : '11px',
                            color: 'rgba(255,255,255,0.36)',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            marginBottom: mob ? '8px' : '12px',
                            textAlign: mob ? 'center' : 'left',
                        }}
                    >
                        Get in touch
                    </p>
                    <h2
                        style={{
                            fontSize: mob ? 'clamp(16px, 4.5vw, 22px)' : 'clamp(20px, 2.6vw, 34px)',
                            fontWeight: 300,
                            color: '#fff',
                            lineHeight: 1.28,
                            letterSpacing: '-0.02em',
                            marginBottom: mob ? '18px' : '30px',
                            textAlign: mob ? 'center' : 'left',
                        }}
                    >
                        Your Partner in Law:
                        <br />
                        Reliable Legal Support
                        <br />
                        for Your Business
                    </h2>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: mob ? '9px' : '13px',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: mob ? '7px' : '11px',
                            }}
                        >
                            <Field label="Name" placeholder="Your name" mob={mob} />
                            <Field label="Surname" placeholder="Your surname" mob={mob} />
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: mob ? '7px' : '11px',
                            }}
                        >
                            <Field
                                label="E-mail"
                                placeholder="hello@example.com"
                                type="email"
                                mob={mob}
                            />
                            <div>
                                <Lbl mob={mob}>Phone</Lbl>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <div
                                        style={{
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.10)',
                                            borderRadius: '8px',
                                            padding: mob ? '6px 7px' : '9px 10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '3px',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span style={{ fontSize: mob ? '11px' : '13px' }}>🇺🇦</span>
                                        <span
                                            style={{
                                                color: 'rgba(255,255,255,0.28)',
                                                fontSize: '8px',
                                            }}
                                        >
                                            ▾
                                        </span>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="+380"
                                        style={{
                                            flex: 1,
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid rgba(255,255,255,0.10)',
                                            borderRadius: '8px',
                                            padding: mob ? '6px 10px' : '9px 12px',
                                            color: '#fff',
                                            fontSize: mob ? '11px' : '12px',
                                            outline: 'none',
                                            transition: 'border-color 0.2s',
                                        }}
                                        onFocus={(e) =>
                                            (e.target.style.borderColor = 'rgba(110,65,220,0.80)')
                                        }
                                        onBlur={(e) =>
                                            (e.target.style.borderColor = 'rgba(255,255,255,0.10)')
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                            }}
                            onClick={handleAgree}
                        >
                            <div
                                style={{
                                    width: mob ? '13px' : '15px',
                                    height: mob ? '13px' : '15px',
                                    borderRadius: '4px',
                                    flexShrink: 0,
                                    border: agreedLocal
                                        ? '1px solid rgba(110,65,220,0.80)'
                                        : '1px solid rgba(255,255,255,0.28)',
                                    background: agreedLocal
                                        ? 'rgba(90,40,210,0.85)'
                                        : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.18s',
                                }}
                            >
                                {agreedLocal && (
                                    <span
                                        style={{
                                            color: '#fff',
                                            fontSize: mob ? '8px' : '9px',
                                            lineHeight: 1,
                                        }}
                                    >
                                        ✓
                                    </span>
                                )}
                            </div>
                            <span
                                style={{
                                    fontSize: mob ? '10px' : '11px',
                                    color: 'rgba(255,255,255,0.38)',
                                    lineHeight: 1.4,
                                }}
                            >
                                I agree to the{' '}
                                <span
                                    style={{ color: 'rgba(140,100,250,0.95)', cursor: 'pointer' }}
                                >
                                    Privacy Policy
                                </span>
                            </span>
                        </div>
                        <button
                            style={{
                                width: '100%',
                                padding: mob ? '11px' : '13px',
                                background: 'linear-gradient(135deg, #5a28b8 0%, #3e18a0 100%)',
                                border: '1px solid rgba(120,70,240,0.40)',
                                borderRadius: '9px',
                                color: '#fff',
                                fontSize: mob ? '12px' : '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                letterSpacing: '0.03em',
                                transition: 'opacity 0.2s, transform 0.15s',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '0.88';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Send Request
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function Lbl({ children, mob }: { children: React.ReactNode; mob: boolean }) {
    return (
        <label
            style={{
                display: 'block',
                fontSize: mob ? '9.5px' : '11px',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: mob ? '4px' : '6px',
                letterSpacing: '0.03em',
            }}
        >
            {children}
        </label>
    );
}

function Field({
    label,
    placeholder,
    type = 'text',
    mob,
}: {
    label: string;
    placeholder: string;
    type?: string;
    mob: boolean;
}) {
    return (
        <div>
            <Lbl mob={mob}>{label}</Lbl>
            <input
                type={type}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '8px',
                    padding: mob ? '6px 10px' : '9px 13px',
                    color: '#fff',
                    fontSize: mob ? '11px' : '12px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(110,65,220,0.80)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
        </div>
    );
}
