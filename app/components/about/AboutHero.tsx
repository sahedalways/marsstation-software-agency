// AboutHero.tsx - Updated with no gap and visible background
'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { siteConfig } from '../../config/site';

interface AboutHeroProps {
    mob: boolean;
    show: boolean;
}

const stagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
};

const AboutHero = ({ mob, show }: AboutHeroProps) => {
    const compnayName = siteConfig?.name;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let animFrame: number;
        let mouseX = 0.5;
        let mouseY = 0.5;
        let targetMouseX = 0.5;
        let targetMouseY = 0.5;

        let particles: any[] = [];
        let connections: any[] = [];
        let w = 0,
            h = 0;

        const colors = ['#a855f7', '#9333ea', '#6366f1', '#e11d48', '#f43f5e'];

        const resize = () => {
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            connections = [];
            const count = mob ? 30 : 60;
            const centerX = w * 0.5;
            const centerY = h * 0.5;

            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 6;
                const radius = (i / count) * Math.min(w, h) * 0.35 + 50;
                particles.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius * 0.5,
                    baseX: centerX + Math.cos(angle) * radius,
                    baseY: centerY + Math.sin(angle) * radius * 0.5,
                    radius: Math.random() * 2 + 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    pulseOffset: Math.random() * Math.PI * 2,
                });
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].baseX - particles[j].baseX;
                    const dy = particles[i].baseY - particles[j].baseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < (mob ? 100 : 160) && Math.random() < 0.3) {
                        connections.push({ from: i, to: j, opacity: 1 - dist / (mob ? 100 : 160) });
                    }
                }
            }
        };

        const onMouse = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseX = (e.clientX - rect.left) / rect.width;
            targetMouseY = (e.clientY - rect.top) / rect.height;
        };

        const draw = (time: number) => {
            const t = time * 0.001;
            ctx.clearRect(0, 0, w, h);

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Draw connections
            connections.forEach((conn) => {
                const a = particles[conn.from];
                const b = particles[conn.to];
                const pulse = Math.sin(t * 2 + conn.pulsePhase) * 0.5 + 0.5;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(168, 85, 247, ${conn.opacity * 0.15 * pulse})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });

            // Draw particles
            particles.forEach((p) => {
                p.x = p.baseX + Math.sin(t * 0.5 + p.pulseOffset) * 10 + (mouseX - 0.5) * 30;
                p.y = p.baseY + Math.cos(t * 0.4 + p.pulseOffset) * 8 + (mouseY - 0.5) * 20;

                const pulse = Math.sin(t * 2 + p.pulseOffset) * 0.3 + 0.7;

                // Glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
                gradient.addColorStop(0, `rgba(168, 85, 247, ${0.2 * pulse})`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.8 * pulse;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            animFrame = requestAnimationFrame(draw);
        };

        resize();
        animFrame = requestAnimationFrame(draw);
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouse);
        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouse);
        };
    }, [mob]);

    return (
        <>
            <style>{`
                @keyframes slowZoom {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .about-gradient-text {
                    background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            <section
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: mob ? '70vh' : 'calc(100vh - 72px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    // Stronger background gradients so it's visible
                    background: `
                        radial-gradient(ellipse 120% 80% at 50% 0%, rgba(88,28,135,0.4) 0%, transparent 60%),
                        radial-gradient(ellipse 80% 60% at 80% 80%, rgba(225,29,72,0.15) 0%, transparent 50%),
                        radial-gradient(ellipse 80% 60% at 20% 80%, rgba(99,102,241,0.12) 0%, transparent 50%),
                        linear-gradient(180deg, rgba(6,3,15,0.9) 0%, rgba(15,5,40,0.95) 100%)
                    `,
                }}
            >
                {/* Animated Canvas Overlay */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        opacity: show ? 1 : 0,
                        transition: 'opacity 1.5s ease',
                        pointerEvents: 'none',
                    }}
                />

                {/* Mars Image Background */}
                <div
                    style={{
                        position: 'absolute',
                        right: mob ? '-10%' : '5%',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: mob ? '300px' : '500px',
                        height: mob ? '300px' : '500px',
                        opacity: 0.15,
                        zIndex: 0,
                    }}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg"
                        alt=""
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            animation: 'slowZoom 20s ease-in-out infinite',
                            filter: 'blur(1px)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            background:
                                'radial-gradient(circle at 30% 30%, transparent 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)',
                        }}
                    />
                </div>

                {/* Decorative Rings */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: mob ? '350px' : '600px',
                        height: mob ? '350px' : '600px',
                        borderRadius: '50%',
                        border: '1px solid rgba(168,85,247,0.1)',
                        zIndex: 0,
                    }}
                />

                {/* Content */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate={show ? 'show' : 'hidden'}
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        maxWidth: mob ? '92%' : '800px',
                        padding: mob ? '20px' : '40px',
                    }}
                >
                    {/* Badge */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 20px',
                            borderRadius: '999px',
                            border: '1px solid rgba(168,85,247,0.3)',
                            background: 'rgba(168,85,247,0.08)',
                            backdropFilter: 'blur(10px)',
                            marginBottom: mob ? '24px' : '32px',
                        }}
                    >
                        <span style={{ color: '#a855f7', fontSize: '12px' }}>✦</span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.8)',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                            }}
                        >
                            About {compnayName}
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        variants={fadeUp}
                        style={{
                            fontSize: mob ? 'clamp(32px, 9vw, 48px)' : 'clamp(48px, 6vw, 72px)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                            color: '#fff',
                            marginBottom: mob ? '16px' : '24px',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        Discover
                        <br />
                        <span className="about-gradient-text">Who We Are</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={fadeUp}
                        style={{
                            fontSize: mob ? '12px' : '15px',
                            color: 'rgba(255,255,255,0.55)',
                            lineHeight: 1.7,
                            maxWidth: mob ? '300px' : '480px',
                            margin: `0 auto ${mob ? '24px' : '34px'}`,
                            marginBottom: mob ? '32px' : '40px',
                        }}
                    >
                        Professional websites and mobile apps designed for
                        <br />
                        businesses, startups, and entrepreneurs.
                    </motion.p>

                    {/* Feature Grid */}
                    <motion.div
                        variants={fadeUp}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
                            gap: mob ? '12px' : '16px',
                            width: '100%',
                            maxWidth: '600px',
                        }}
                    >
                        {[
                            {
                                icon: '🚀',
                                title: 'Who We Are',
                                desc: 'Passionate team building digital experiences',
                            },
                            {
                                icon: '💡',
                                title: 'What We Do',
                                desc: 'Websites, apps & smart business solutions',
                            },
                            {
                                icon: '🤝',
                                title: 'How We Work',
                                desc: 'Collaboration, clarity & long-term support',
                            },
                            {
                                icon: '🌍',
                                title: 'Why Choose Us',
                                desc: 'Focused on growth, impact & real results',
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: mob ? '16px' : '20px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    background: 'rgba(255,255,255,0.03)',
                                    backdropFilter: 'blur(10px)',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'default',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                                    e.currentTarget.style.background = 'rgba(168,85,247,0.08)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ fontSize: '20px', lineHeight: 1 }}>{item.icon}</div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            color: '#fff',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '13px',
                                            color: 'rgba(255,255,255,0.5)',
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>
        </>
    );
};

export default AboutHero;
