import React from 'react';
import { siteConfig } from '../../config/site';
import { toCamelCase } from '../../utils/textUtils';

interface AboutContentProps {
    mob: boolean;
    show: boolean;
    focusAreas: string[];
}

const AboutContent = ({ mob, show, focusAreas }: AboutContentProps) => {
    const compnayName = siteConfig?.name;
    return (
        <section
            style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: mob ? '0 20px 50px' : '0 48px 80px',
            }}
        >
            {/* Who We Are */}
            <div
                style={{
                    textAlign: 'center',
                    marginBottom: mob ? '28px' : '44px',
                    opacity: show ? 1 : 0,
                    animation: show ? 'aboutFadeUp 0.8s ease 0.7s both' : 'none',
                }}
            >
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: mob ? '5px 12px' : '6px 15px',
                        borderRadius: '999px',
                        border: '1px solid rgba(168, 85, 247, 0.35)',
                        background: 'rgba(88, 28, 135, 0.12)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        opacity: show ? 1 : 0,
                        animation: show ? 'shFadeUp 0.7s ease-out 0s both' : 'none',
                        boxShadow: '0 0 16px rgba(168, 85, 247, 0.12)',
                    }}
                >
                    <span
                        style={{
                            color: '#c084fc',
                            fontSize: mob ? '10px' : '12px',
                        }}
                    >
                        ✦
                    </span>

                    <span
                        style={{
                            fontSize: mob ? '9px' : '11px',
                            fontWeight: 600,
                            color: '#c084fc',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Who We Are
                    </span>
                </div>

                <h2
                    style={{
                        fontSize: mob ? '24px' : '38px',
                        fontWeight: 700,
                        color: '#fff',
                        margin: '10px 0 0',
                    }}
                >
                    About <span className="about-gradient-text">{toCamelCase(compnayName)}</span>
                </h2>
            </div>

            {/* Body */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: mob ? '18px' : '22px',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                {[
                    `At ${toCamelCase(compnayName)}, we believe every great business deserves a powerful digital presence...`,

                    'We specialize in Website Development, Mobile App Development, Branding, and Digital Design...',

                    'Since our journey began, we have successfully delivered more than 1,500 websites and 450 mobile applications...',
                ].map((para, i) => (
                    <p
                        key={i}
                        style={{
                            fontSize: mob ? '13px' : '15.5px',
                            color: 'rgba(255,255,255,0.62)',
                            lineHeight: 1.85,
                            margin: 0,
                            maxWidth: '800px',
                        }}
                    >
                        {para}
                    </p>
                ))}
            </div>

            {/* Focus Areas */}
            <div
                style={{
                    marginTop: mob ? '36px' : '54px',
                }}
            >
                <h3
                    style={{
                        fontSize: mob ? '18px' : '24px',
                        fontWeight: 700,
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: mob ? '18px' : '26px',
                    }}
                >
                    What We <span className="about-gradient-text">Focus On</span>
                </h3>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: mob ? '1fr' : 'repeat(3,1fr)',
                        gap: mob ? '10px' : '14px',
                    }}
                >
                    {focusAreas.map((area, i) => (
                        <div
                            key={i}
                            className="about-focus-card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: mob ? '12px 14px' : '14px 16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(105,62,205,0.22)',
                                background: 'rgba(15,10,35,0.5)',
                            }}
                        >
                            <span style={{ color: '#c084fc' }}>✓</span>
                            <span
                                style={{
                                    fontSize: mob ? '12.5px' : '13.5px',
                                    color: 'rgba(255,255,255,0.82)',
                                }}
                            >
                                {area}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutContent;
