'use client';

import { useEffect, useRef, useState } from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ChatButton } from '../components/common/ChatButton';
import { ChatWindow } from '../components/chat/ChatWindow';
import { BackToTopButton } from '../components/common/BackToTopButton';
import PandRHero from '../components/payment-and-refund/PandRHero';
import PandRContent from '../components/payment-and-refund/PandRContent';

export default function PandRPage() {
    const [chatOpen, setChatOpen] = useState(false);
    const [mob, setMob] = useState(false);

    useEffect(() => {
        const fn = () => setMob(window.innerWidth < 768);
        fn();
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

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

        const getW = () => window.innerWidth;
        const getH = () => window.innerHeight;

        const createStars = () => {
            stars = [];
            const w = getW(),
                h = getH();
            for (let i = 0; i < (mob ? 300 : 600); i++) {
                const radius =
                    Math.random() > 0.8 ? Math.random() * 1.2 + 0.5 : Math.random() * 0.6 + 0.2;
                const colors = ['#ffffff', '#e0f2ff', '#fff4e0', '#f0faff'];
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

        const resizeCanvas = () => {
            canvas.width = Math.floor(getW() * dpr);
            canvas.height = Math.floor(getH() * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            createStars();
        };

        const draw = () => {
            const w = getW(),
                h = getH();
            ctx.clearRect(0, 0, w, h);
            stars.forEach((s) => {
                s.o += s.speed;
                const op = Math.sin(s.o) * 0.4 + 0.6;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.globalAlpha = op * 0.8;
                ctx.fillStyle = s.color;
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;
            raf = requestAnimationFrame(draw);
        };

        resizeCanvas();
        draw();
        window.addEventListener('resize', resizeCanvas);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [mob]);

    return (
        <>
            <canvas
                ref={bgCanvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    background: 'transparent',
                }}
            />
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
                <Navbar mob={mob} setChatOpen={setChatOpen} />
            </div>
            <main
                style={{
                    width: '100%',
                    minHeight: '100vh',
                    position: 'relative',
                    zIndex: 1,
                    background: 'transparent',
                }}
            >
                <PandRHero mob={mob} />
                <PandRContent mob={mob} />
            </main>
            <Footer mob={mob} />
            <ChatButton onClick={() => setChatOpen(true)} isOpen={chatOpen} />
            <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />
            <BackToTopButton />
        </>
    );
}
