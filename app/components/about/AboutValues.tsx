import React from 'react';

interface ValueItem {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

interface AboutValuesProps {
    mob: boolean;
    show: boolean;
    values: ValueItem[];
}

const AboutValues = ({ mob, show, values }: AboutValuesProps) => {
    return (
        <section
            style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: mob ? '0 16px 50px' : '0 48px 80px',
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    marginBottom: mob ? '24px' : '40px',
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
                        Our Core Values
                    </span>
                </div>

                <h2
                    style={{
                        fontSize: mob ? '22px' : '34px',
                        fontWeight: 700,
                        color: '#fff',
                        margin: '10px 0 0',
                    }}
                >
                    What Drives <span className="about-gradient-text">Us Forward</span>
                </h2>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: mob ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                    gap: mob ? '12px' : '20px',
                }}
            >
                {values.map((v, i) => (
                    <div
                        key={i}
                        className="about-value-card"
                        style={{
                            padding: mob ? '18px 14px' : '26px 20px',
                            borderRadius: '18px',
                            border: '1px solid rgba(105,62,205,0.25)',
                            background:
                                'linear-gradient(180deg, rgba(15,10,35,0.7) 0%, rgba(10,5,22,0.6) 100%)',
                            textAlign: 'center',
                            opacity: show ? 1 : 0,
                            animation: show
                                ? `aboutFadeUp 0.7s cubic-bezier(.16,1,.3,1) ${0.6 + i * 0.15}s both`
                                : 'none',
                            transition:
                                'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'default',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(88,28,135,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'rgba(105,62,205,0.25)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div
                            style={{
                                fontSize: mob ? '26px' : '32px',
                                marginBottom: mob ? '10px' : '14px',
                            }}
                        >
                            {v.icon}
                        </div>

                        <h4
                            style={{
                                fontSize: mob ? '13px' : '16px',
                                fontWeight: 600,
                                color: '#fff',
                            }}
                        >
                            {v.title}
                        </h4>

                        <p
                            style={{
                                fontSize: mob ? '10px' : '12px',
                                color: 'rgba(255,255,255,0.5)',
                                lineHeight: 1.6,
                            }}
                        >
                            {v.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutValues;
