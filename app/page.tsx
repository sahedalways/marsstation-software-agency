'use client';
import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSec } from './components/home/HeroSec';
import { ServicesSec } from './components/home/ServicesSec';
import { ContactSec } from './components/home/ContactSec';
import { useCanvasAnimation } from './hooks/useCanvasAnimation';
import { Footer } from './components/common/Footer';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
type Phase = 'hero' | 'services' | 'contact';

export default function IUSPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const scrollRef = useRef(0);
    const smoothRef = useRef(0);
    const rafRef = useRef(0);

    const heroRef = useRef<HTMLDivElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    const [phase, setPhase] = useState<Phase>('hero');
    const [agreed, setAgreed] = useState(false);
    const [mob, setMob] = useState(false);

    // ✅ Once true, never false
    const [cardsIn, setCardsIn] = useState(false);
    const [contactIn, setContactIn] = useState(false);

    useEffect(() => {
        if (phase === 'services') setCardsIn(true);
        if (phase === 'contact') setContactIn(true);
    }, [phase]);

    useEffect(() => {
        const fn = () => setMob(window.innerWidth < 768);
        fn();
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    useEffect(() => {
        const fn = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            scrollRef.current = clamp(window.scrollY / total, 0, 1);

            const y = window.scrollY + window.innerHeight * 0.7;
            const servicesTop = servicesRef.current?.offsetTop ?? 0;
            const contactTop = contactRef.current?.offsetTop ?? 0;

            if (y >= contactTop) setPhase('contact');
            else if (y >= servicesTop) setPhase('services');
            else setPhase('hero');
        };
        window.addEventListener('scroll', fn, { passive: true });
        fn();
        return () => window.removeEventListener('scroll', fn);
    }, []);

    useCanvasAnimation({ canvasRef, btnRef, scrollRef, smoothRef, rafRef });

    // Stars
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = bgCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0;
        let stars: { x: number; y: number; r: number; o: number; speed: number; color: string }[] =
            [];
        let shootingStars: {
            x: number;
            y: number;
            length: number;
            speed: number;
            angle: number;
            opacity: number;
            decay: number;
            thickness: number;
            active: boolean;
        }[] = [];

        const getW = () => window.innerWidth;
        const getH = () => document.documentElement.scrollHeight;

        const createStars = () => {
            stars = [];
            const w = getW(),
                h = getH();
            for (let i = 0; i < (mob ? 400 : 800); i++) {
                const rand = Math.random();
                const radius = rand > 0.8 ? Math.random() * 1.2 + 0.5 : Math.random() * 0.6 + 0.2;
                const colors = ['#ffffff', '#ffffff', '#e0f2ff', '#fff4e0', '#f0faff'];
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: radius,
                    o: Math.random(),
                    speed: Math.random() * 0.015 + 0.005,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        };

        const createShootingStar = () => {
            shootingStars.push({
                x: Math.random() * getW() * 0.8,
                y: window.scrollY + Math.random() * window.innerHeight * 0.4,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 8 + 12,
                angle: Math.PI / 4 + (Math.random() * 0.3 - 0.15),
                opacity: 1,
                decay: Math.random() * 0.015 + 0.01,
                thickness: Math.random() * 1.5 + 1,
                active: true,
            });
        };

        const interval = setInterval(() => {
            if (Math.random() < 0.4) createShootingStar();
        }, 2000);

        const resizeCanvas = () => {
            canvas.width = Math.max(1, Math.floor(getW() * dpr));
            canvas.height = Math.max(1, Math.floor(getH() * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            createStars();
        };

        const draw = () => {
            const w = getW(),
                h = getH();
            ctx.fillStyle = '#020108';
            ctx.fillRect(0, 0, w, h);
            const g = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, w * 0.8);
            g.addColorStop(0, 'rgba(30,15,80,0.15)');
            g.addColorStop(0.5, 'rgba(10,5,40,0.05)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
            stars.forEach((s) => {
                s.o += s.speed;
                const op = Math.sin(s.o) * 0.4 + 0.6;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                if (s.r > 1.0) {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = s.color;
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.globalAlpha = op;
                ctx.fillStyle = s.color;
                ctx.fill();
            });
            ctx.shadowBlur = 0;
            shootingStars.forEach((m) => {
                if (!m.active) return;
                m.x += Math.cos(m.angle) * m.speed;
                m.y += Math.sin(m.angle) * m.speed;
                m.opacity -= m.decay;
                if (m.opacity <= 0 || m.x > w || m.y > h + 200) {
                    m.active = false;
                    return;
                }
                const tx = m.x - Math.cos(m.angle) * m.length;
                const ty = m.y - Math.sin(m.angle) * m.length;
                const tg = ctx.createLinearGradient(tx, ty, m.x, m.y);
                tg.addColorStop(0, 'rgba(255,255,255,0)');
                tg.addColorStop(0.3, `rgba(200,220,255,${m.opacity * 0.3})`);
                tg.addColorStop(0.7, `rgba(255,255,255,${m.opacity * 0.7})`);
                tg.addColorStop(1, `rgba(255,255,255,${m.opacity})`);
                ctx.beginPath();
                ctx.moveTo(tx, ty);
                ctx.lineTo(m.x, m.y);
                ctx.strokeStyle = tg;
                ctx.lineWidth = m.thickness;
                ctx.lineCap = 'round';
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.thickness + 0.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${m.opacity})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#ffffff';
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            shootingStars = shootingStars.filter((m) => m.active);
            ctx.globalAlpha = 1.0;
            raf = requestAnimationFrame(draw);
        };

        resizeCanvas();
        draw();
        window.addEventListener('resize', resizeCanvas);
        return () => {
            cancelAnimationFrame(raf);
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [mob]);

    return (
        <>
            <style>{`
        @keyframes flyFromLeft { from { opacity:0; transform:translateX(-140px) translateY(50px); } to { opacity:1; transform:translateX(0) translateY(0); } }
        @keyframes flyFromBottom { from { opacity:0; transform:translateY(150px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flyFromRight { from { opacity:0; transform:translateX(140px) translateY(50px); } to { opacity:1; transform:translateX(0) translateY(0); } }
        .ius-btn { border:1px solid rgba(255,255,255,0.26); border-radius:9999px; background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.90); cursor:pointer; font-family:inherit; letter-spacing:0.02em; transition:background 0.22s, border-color 0.22s; }
        .ius-btn:hover { background:rgba(255,255,255,0.10); border-color:rgba(255,255,255,0.44); }
        input:focus { border-color:rgba(110,65,220,0.80)!important; }
      `}</style>

            <canvas
                ref={bgCanvasRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    background: '#020108',
                }}
            />

            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <Navbar mob={mob} />
            </div>

            <main style={{ position: 'relative', zIndex: 1, background: 'transparent' }}>
                <section
                    ref={heroRef}
                    style={{
                        minHeight: mob ? '60vh' : '100vh',
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        paddingTop: mob ? '12vh' : '15vh',
                    }}
                >
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
                    <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                        <HeroSec phase={phase} mob={mob} btnRef={btnRef} />
                    </div>
                </section>

                <section ref={servicesRef} style={{ width: '100%', position: 'relative' }}>
                    <ServicesSec cardsIn={cardsIn} mob={mob} />
                </section>

                <section
                    ref={contactRef}
                    style={{
                        minHeight: 'auto',
                        width: '100%',
                        position: 'relative',
                        display: 'block',
                    }}
                >
                    <ContactSec
                        phase={phase}
                        contactIn={contactIn}
                        mob={mob}
                        agreed={agreed}
                        setAgreed={setAgreed}
                    />
                </section>

                {/* ─── Footer ─── */}
                <Footer mob={mob} />
            </main>
        </>
    );
}
