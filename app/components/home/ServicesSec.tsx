'use client';

interface ServicesSectionProps {
    phase: string;
    mob: boolean;
    cardsIn: boolean;
}

export function ServicesSec({ phase, mob, cardsIn }: ServicesSectionProps) {
    if (phase !== 'services') return null;

    const cards = [
        {
            label: 'Clear and automated documentation',
            body: "You don't have to understand terminology — structured documents are ready for you.",
            btn: 'Learn more',
            rotate: -8,
            zIdx: 1,
            left: mob ? '0%' : '0%',
            w: mob ? '44%' : '37%',
            accent: false,
        },
        {
            label: 'Guaranteed answer to your question',
            body: 'No need to search for solutions — our clients have expert answers available instantly.',
            btn: 'Learn more',
            rotate: 1,
            zIdx: 3,
            left: mob ? '28%' : '31.5%',
            w: mob ? '44%' : '37%',
            accent: true,
        },
        {
            label: 'Making profitable decisions',
            body: 'Never miss an opportunity to save money, gain benefits and make the right legal choice.',
            btn: 'Learn more',
            rotate: 7,
            zIdx: 2,
            left: mob ? '56%' : '63%',
            w: mob ? '44%' : '37%',
            accent: false,
        },
    ];

    const animations = ['flyFromLeft', 'flyFromBottom', 'flyFromRight'];
    const delays = ['0s', '0.10s', '0.20s'];
    const rotates = [-8, 1, 7];

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: mob ? '0 12px 40px' : '0 48px 56px',
                zIndex: 10,
            }}
        >
            {/* Heading */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '860px',
                    textAlign: 'center',
                    marginBottom: mob ? '16px' : '44px',
                }}
            >
                <h2
                    style={{
                        fontSize: mob ? 'clamp(14px, 3.8vw, 20px)' : 'clamp(22px, 3.2vw, 42px)',
                        fontWeight: 300,
                        lineHeight: 1.2,
                        color: '#fff',
                        letterSpacing: '-0.02em',
                        marginBottom: mob ? '6px' : '14px',
                    }}
                >
                    Legal support for IT:
                    <br />
                    protecting your business in the digital sphere
                </h2>
                <p
                    style={{
                        fontSize: mob ? '11px' : '13px',
                        color: 'rgba(255,255,255,0.38)',
                        lineHeight: 1.75,
                        maxWidth: mob ? '300px' : '460px',
                        margin: '0 auto',
                    }}
                >
                    We account for the specifics of IT companies and help clients minimize risks and
                    avoid legal problems.
                </p>
            </div>

            {/* Cards — overlapping fan */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '860px',
                    height: mob ? '150px' : '260px',
                    overflow: 'visible',
                }}
            >
                {cards.map((c, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: c.left,
                            width: c.w,
                            height: mob ? '130px' : '232px',
                            zIndex: c.zIdx,
                            animation: cardsIn
                                ? `${animations[i]} 0.60s cubic-bezier(.22,.68,0,1.2) ${delays[i]} both`
                                : 'none',
                            visibility: cardsIn ? 'visible' : 'hidden',
                            transform: `rotate(${rotates[i]}deg)`,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: mob ? '14px' : '20px',
                                padding: mob ? '11px 12px 14px' : '20px 20px 22px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                background: c.accent
                                    ? 'linear-gradient(148deg, rgba(68,22,165,0.88) 0%, rgba(38,10,110,0.95) 100%)'
                                    : 'linear-gradient(148deg, rgba(255,255,255,0.05) 0%, rgba(48,18,100,0.25) 100%)',
                                border: c.accent
                                    ? '1px solid rgba(110,65,210,0.55)'
                                    : '1px solid rgba(255,255,255,0.09)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                boxShadow: c.accent
                                    ? '0 8px 32px rgba(80,20,200,0.25)'
                                    : '0 4px 20px rgba(0,0,0,0.30)',
                            }}
                        >
                            <button
                                className="ius-btn"
                                style={{
                                    padding: mob ? '3px 9px' : '5px 14px',
                                    fontSize: mob ? '8.5px' : '11px',
                                    alignSelf: 'flex-start',
                                }}
                            >
                                {c.btn}
                            </button>
                            <div>
                                <h3
                                    style={{
                                        fontSize: mob ? '11px' : '16px',
                                        fontWeight: 500,
                                        color: '#fff',
                                        lineHeight: 1.25,
                                        marginBottom: mob ? '4px' : '7px',
                                    }}
                                >
                                    {c.label}
                                </h3>
                                <p
                                    style={
                                        {
                                            fontSize: mob ? '8.5px' : '11px',
                                            color: 'rgba(255,255,255,0.36)',
                                            lineHeight: 1.55,
                                            display: '-webkit-box',
                                            WebkitLineClamp: mob ? 2 : 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        } as React.CSSProperties
                                    }
                                >
                                    {c.body}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
