'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface PandRHeroProps {
    mob: boolean;
}

const stagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.3 },
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

const PandRHero = ({ mob }: PandRHeroProps) => {
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

        interface Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            vx: number;
            vy: number;
            radius: number;
            color: string;
            pulseSpeed: number;
            pulseOffset: number;
            layer: number;
        }
        interface Connection {
            from: number;
            to: number;
            opacity: number;
            pulsePhase: number;
        }
        interface FloatingOrb {
            x: number;
            y: number;
            radius: number;
            speedX: number;
            speedY: number;
            color1: string;
            color2: string;
            phase: number;
        }
        interface EnergyWave {
            centerX: number;
            centerY: number;
            radius: number;
            maxRadius: number;
            opacity: number;
            color: string;
            speed: number;
            active: boolean;
        }

        let particles: Particle[] = [];
        let connections: Connection[] = [];
        let floatingOrbs: FloatingOrb[] = [];
        let energyWaves: EnergyWave[] = [];
        let w = 0,
            h = 0;

        const colors = {
            purple: ['#a855f7', '#9333ea', '#7c3aed', '#c084fc'],
            amber: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d'],
            orange: ['#f97316', '#ea580c', '#fb923c', '#fdba74'],
        };

        const hexToRgba = (hex: string, alpha: number): string => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r},${g},${b},${alpha})`;
        };

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
            floatingOrbs = [];
            const particleCount = mob ? 25 : 55;
            const centerX = w * 0.5,
                centerY = h * 0.5;

            for (let i = 0; i < particleCount; i++) {
                const layer = i < particleCount * 0.2 ? 0 : i < particleCount * 0.6 ? 1 : 2;
                const radiusBase = layer === 0 ? 2.5 : layer === 1 ? 1.8 : 1.0;
                const allColors = [...colors.purple, ...colors.amber, ...colors.orange];
                const angle = (i / particleCount) * Math.PI * 6;
                const spiralR = (i / particleCount) * Math.min(w, h) * 0.4 + 40;
                const bx = centerX + Math.cos(angle) * spiralR + (Math.random() - 0.5) * 80;
                const by = centerY + Math.sin(angle) * spiralR * 0.5 + (Math.random() - 0.5) * 60;
                particles.push({
                    x: bx,
                    y: by,
                    baseX: bx,
                    baseY: by,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: radiusBase + Math.random() * 1.5,
                    color: allColors[Math.floor(Math.random() * allColors.length)],
                    pulseSpeed: 0.02 + Math.random() * 0.03,
                    pulseOffset: Math.random() * Math.PI * 2,
                    layer,
                });
            }

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].baseX - particles[j].baseX;
                    const dy = particles[i].baseY - particles[j].baseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = mob ? 80 : 130;
                    if (dist < maxDist && Math.random() < 0.35) {
                        connections.push({
                            from: i,
                            to: j,
                            opacity: 1 - dist / maxDist,
                            pulsePhase: Math.random() * Math.PI * 2,
                        });
                    }
                }
            }

            for (let i = 0; i < (mob ? 2 : 4); i++) {
                floatingOrbs.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    radius: 70 + Math.random() * 100,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.2,
                    color1: colors.purple[Math.floor(Math.random() * colors.purple.length)],
                    color2: colors.amber[Math.floor(Math.random() * colors.amber.length)],
                    phase: Math.random() * Math.PI * 2,
                });
            }
        };

        const spawnEnergyWave = () => {
            if (energyWaves.length > 2) return;
            const waveCols = [...colors.purple, ...colors.amber];
            energyWaves.push({
                centerX: w * 0.5,
                centerY: h * 0.5,
                radius: mob ? 50 : 120,
                maxRadius: mob ? 200 : 400,
                opacity: 0.2,
                color: waveCols[Math.floor(Math.random() * waveCols.length)],
                speed: 0.5 + Math.random() * 0.8,
                active: true,
            });
        };

        let waveTimer = 0;

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

            floatingOrbs.forEach((orb) => {
                orb.x += orb.speedX;
                orb.y += orb.speedY;
                orb.phase += 0.008;
                if (orb.x < -orb.radius) orb.x = w + orb.radius;
                if (orb.x > w + orb.radius) orb.x = -orb.radius;
                if (orb.y < -orb.radius) orb.y = h + orb.radius;
                if (orb.y > h + orb.radius) orb.y = -orb.radius;
                const breathe = Math.sin(orb.phase) * 0.2 + 0.8;
                const grad = ctx.createRadialGradient(
                    orb.x,
                    orb.y,
                    0,
                    orb.x,
                    orb.y,
                    orb.radius * breathe
                );
                grad.addColorStop(0, hexToRgba(orb.color1, 0.06));
                grad.addColorStop(0.6, hexToRgba(orb.color2, 0.02));
                grad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grad;
                ctx.fillRect(
                    orb.x - orb.radius * 2,
                    orb.y - orb.radius * 2,
                    orb.radius * 4,
                    orb.radius * 4
                );
            });

            waveTimer++;
            if (waveTimer % 280 === 0) spawnEnergyWave();
            energyWaves.forEach((wave) => {
                if (!wave.active) return;
                wave.radius += wave.speed;
                wave.opacity *= 0.99;
                if (wave.radius > wave.maxRadius || wave.opacity < 0.01) {
                    wave.active = false;
                    return;
                }
                ctx.beginPath();
                ctx.arc(wave.centerX, wave.centerY, wave.radius, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(wave.color, wave.opacity);
                ctx.lineWidth = 1.2;
                ctx.stroke();
            });
            energyWaves = energyWaves.filter((w) => w.active);

            connections.forEach((conn) => {
                const a = particles[conn.from],
                    b = particles[conn.to];
                const pulse = Math.sin(t * 2 + conn.pulsePhase) * 0.5 + 0.5;
                const baseOp = conn.opacity * 0.12 * pulse;
                const flowT = Math.sin(t * 1.2 + conn.pulsePhase) * 0.5 + 0.5;
                const flowX = a.x + (b.x - a.x) * flowT;
                const flowY = a.y + (b.y - a.y) * flowT;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                const lineGrad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                lineGrad.addColorStop(0, hexToRgba(a.color, baseOp));
                lineGrad.addColorStop(1, hexToRgba(b.color, baseOp));
                ctx.strokeStyle = lineGrad;
                ctx.lineWidth = 0.4;
                ctx.stroke();
                if (pulse > 0.65) {
                    ctx.beginPath();
                    ctx.arc(flowX, flowY, 1.0, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgba('#ffffff', baseOp * 2);
                    ctx.fill();
                }
            });

            const parallaxStrength = 12;
            particles.forEach((p) => {
                p.x =
                    p.baseX +
                    Math.sin(t * 0.4 + p.pulseOffset) * 6 +
                    (mouseX - 0.5) * parallaxStrength * (3 - p.layer);
                p.y =
                    p.baseY +
                    Math.cos(t * 0.3 + p.pulseOffset * 1.2) * 5 +
                    (mouseY - 0.5) * parallaxStrength * (3 - p.layer) * 0.5;
                const pulse = Math.sin(t * p.pulseSpeed * 50 + p.pulseOffset) * 0.3 + 0.7;
                const r = p.radius * pulse;
                if (p.layer < 2) {
                    const glowR = r * 3.5;
                    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
                    glow.addColorStop(0, hexToRgba(p.color, 0.12 * pulse));
                    glow.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba(
                    p.color,
                    p.layer === 0 ? 0.85 : p.layer === 1 ? 0.55 : 0.3
                );
                ctx.fill();
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
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1); }
                }
                @keyframes floatText {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes glowPulse {
                    0%, 100% { text-shadow: 0 0 20px rgba(168,85,247,0.4), 0 0 40px rgba(99,102,241,0.2), 0 0 80px rgba(245,158,11,0.15); }
                    50% { text-shadow: 0 0 30px rgba(168,85,247,0.6), 0 0 60px rgba(99,102,241,0.35), 0 0 100px rgba(245,158,11,0.25); }
                }
            .pandp-gradient-text {
    background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline;
}
                .pandp-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 16px;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,0.10);
                    background: rgba(255,255,255,0.03);
                    backdrop-filter: blur(8px);
                }
                .pandp-divider {
                    display: inline-block;
                    width: 28px;
                    height: 1px;
                    background: rgba(255,255,255,0.30);
                    vertical-align: middle;
                }
                .pandp-coin-container {
                    position: relative;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .pandp-coin-container svg {
                    animation: slowZoom 20s ease-in-out infinite;
                }
            `}</style>

            <section
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: mob ? 'calc(100vh - 80px)' : 'calc(100vh - 100px)',
                    padding: mob ? '70px 0 0' : '80px 0 0',
                    zIndex: 1,
                    background: `
                        radial-gradient(ellipse 100% 70% at 50% 20%, rgba(88,28,135,0.5) 0%, transparent 70%),
                        radial-gradient(ellipse 60% 50% at 30% 80%, rgba(245,158,11,0.12) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 50% at 70% 80%, rgba(99,102,241,0.1) 0%, transparent 50%),
                        radial-gradient(ellipse 80% 80% at 50% 50%, rgba(15,5,40,0.6) 0%, transparent 100%),
                        #06030f
                    `,
                }}
            >
                {/* Canvas Background */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />

                {/* Coin Icon - Background Decorative Element */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1,
                        opacity: mob ? 0.06 : 0.1,
                        pointerEvents: 'none',
                    }}
                >
                    <div
                        className="pandp-coin-container"
                        style={{
                            width: mob ? '260px' : '420px',
                            height: mob ? '260px' : '420px',
                            position: 'relative',
                            filter: 'blur(2px)',
                        }}
                    >
                        <svg
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'block',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="url(#coinGrad)"
                                stroke="rgba(168,85,247,0.3)"
                                strokeWidth="2"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="35"
                                fill="none"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="0.5"
                            />
                            <text
                                x="50"
                                y="46"
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.7)"
                                fontSize="24"
                                fontWeight="bold"
                                fontFamily="sans-serif"
                            >
                                $
                            </text>
                            <text
                                x="50"
                                y="65"
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.35)"
                                fontSize="10"
                                fontFamily="sans-serif"
                                letterSpacing="2"
                            >
                                PAYMENT
                            </text>
                            <circle
                                cx="50"
                                cy="50"
                                r="44"
                                fill="none"
                                stroke="rgba(245,158,11,0.15)"
                                strokeWidth="0.5"
                                strokeDasharray="4 6"
                            />
                            <defs>
                                <linearGradient
                                    id="coinGrad"
                                    x1="50"
                                    y1="8"
                                    x2="50"
                                    y2="92"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="50%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                background:
                                    'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 80%)',
                                zIndex: 2,
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                background:
                                    'radial-gradient(circle at 60% 60%, rgba(147,51,234,0.15) 0%, rgba(245,158,11,0.08) 50%, transparent 80%)',
                                zIndex: 3,
                                mixBlendMode: 'screen',
                            }}
                        />
                    </div>
                </div>

                {/* Orbiting ring decorations */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: mob ? '380px' : '580px',
                        height: mob ? '380px' : '580px',
                        borderRadius: '50%',
                        border: '1px solid rgba(168,85,247,0.06)',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: mob ? '460px' : '700px',
                        height: mob ? '460px' : '700px',
                        borderRadius: '50%',
                        border: '1px dashed rgba(245,158,11,0.04)',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />

                {/* Content Layer - Centered */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: mob ? '0 20px' : '0 48px',
                    }}
                >
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            maxWidth: mob ? '100%' : '700px',
                            width: '100%',
                        }}
                    >
                        {/* Top pill badge */}
                        <motion.div
                            variants={fadeUp}
                            className="pandp-pill"
                            style={{ marginBottom: mob ? '14px' : '22px' }}
                        >
                            <span style={{ color: '#f59e0b', fontSize: mob ? '10px' : '12px' }}>
                                💰
                            </span>
                            <span
                                style={{
                                    fontSize: mob ? '9px' : '11px',
                                    color: 'rgba(255,255,255,0.65)',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    fontWeight: 500,
                                }}
                            >
                                Payment & Refund
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            variants={fadeUp}
                            style={{
                                fontSize: mob
                                    ? 'clamp(28px, 8vw, 40px)'
                                    : 'clamp(48px, 5.5vw, 80px)',
                                fontWeight: 700,
                                letterSpacing: '-0.03em',
                                lineHeight: 1.05,
                                color: '#fff',
                                marginBottom: mob ? '12px' : '18px',
                                textShadow: '0 4px 30px rgba(0,0,0,0.45)',
                            }}
                        >
                            Transparent{' '}
                            <span className="pandp-gradient-text">Transaction Experience</span>
                        </motion.h1>

                        {/* Divider line text */}
                        <motion.div
                            variants={fadeUp}
                            style={{
                                marginBottom: mob ? '12px' : '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '14px',
                            }}
                        >
                            <span className="pandp-divider" />
                            <span
                                style={{
                                    fontSize: mob ? '13px' : '17px',
                                    color: 'rgba(255,255,255,0.85)',
                                    fontWeight: 400,
                                }}
                            >
                                Secure &{' '}
                                <span style={{ color: '#fff', fontWeight: 700 }}>Transparent</span>
                            </span>
                            <span className="pandp-divider" />
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            variants={fadeUp}
                            style={{
                                fontSize: mob ? '13px' : '15px',
                                color: 'rgba(255,255,255,0.55)',
                                lineHeight: 1.7,
                                maxWidth: mob ? '100%' : '550px',
                                margin: '0 auto 24px',
                            }}
                        >
                            Understand our payment terms, pricing structure, and refund policy
                            before engaging our services.
                        </motion.p>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default PandRHero;
