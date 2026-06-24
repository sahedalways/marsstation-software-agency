import React from 'react';
import { siteConfig } from '../../config/site';
import { toCamelCase } from '../../utils/textUtils';

interface AboutBrandSectionProps {
    mob: boolean;
    show: boolean;
}

const ClosingBrandBanner = ({ mob, show }: AboutBrandSectionProps) => {
    const compnayName = siteConfig?.name;
    return (
        <section
            style={{
                maxWidth: '900px',
                margin: '0 auto',
                marginTop: mob ? '50px' : '80px',
                padding: mob ? '0 20px 70px' : '0 48px 100px',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    borderRadius: '24px',
                    padding: mob ? '36px 24px' : '56px 40px',
                    textAlign: 'center',
                    overflow: 'hidden',
                    border: '1px solid rgba(168,85,247,0.3)',
                    background:
                        'linear-gradient(135deg, rgba(88,28,135,0.4) 0%, rgba(40,15,80,0.3) 50%, rgba(30,30,90,0.3) 100%)',
                    boxShadow: '0 20px 60px rgba(88,28,135,0.25)',
                    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 30px 80px rgba(88,28,135,0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(88,28,135,0.25)';
                }}
            >
                {/* Glow Accent */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-40%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '120%',
                        background:
                            'radial-gradient(ellipse, rgba(168,85,247,0.25), transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <h2
                    style={{
                        position: 'relative',
                        fontSize: mob ? '28px' : '46px',
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        color: '#fff',
                        margin: 0,
                        opacity: show ? 1 : 0,
                        animation: show
                            ? 'aboutFadeUp 0.8s cubic-bezier(.16,1,.3,1) 0.3s both'
                            : 'none',
                    }}
                >
                    {toCamelCase(compnayName)}
                </h2>

                <p
                    className="about-gradient-text"
                    style={{
                        position: 'relative',
                        fontSize: mob ? '14px' : '20px',
                        fontWeight: 600,
                        marginTop: mob ? '8px' : '12px',
                        opacity: show ? 1 : 0,
                        animation: show
                            ? 'aboutFadeUp 0.8s cubic-bezier(.16,1,.3,1) 0.45s both'
                            : 'none',
                    }}
                >
                    Turning Vision Into Digital Reality
                </p>
            </div>
        </section>
    );
};

export default ClosingBrandBanner;
