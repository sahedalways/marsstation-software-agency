// AboutMain.tsx - Updated
'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import AboutContent from '../components/about/AboutContent';
import AboutHero from '../components/about/AboutHero';
import AboutValues from '../components/about/AboutValues';
import ClosingBrandBanner from '../components/about/ClosingBrandBanner';
import { ChatWindow } from '../components/chat/ChatWindow';
import { BackToTopButton } from '../components/common/BackToTopButton';
import { ChatButton } from '../components/common/ChatButton';
import { Footer } from '../components/common/Footer';
import { Navbar } from '../components/common/Navbar';

export default function AboutMain() {
    const [chatOpen, setChatOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [mob, setMob] = useState(false);

    useEffect(() => {
        const fn = () => setMob(window.innerWidth < 768);
        fn();
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    useEffect(() => {
        setShow(true);
    }, []);

    // Stars canvas ref
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
        let shootingStars: any[] = [];

        const getW = () => window.innerWidth;
        const getH = () => window.innerHeight; // Use viewport height, not scroll height

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

            // Draw stars
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

    const focusAreas = [
        'Custom Website Development',
        'WordPress Development',
        'Full Stack Web Applications',
        'E-Commerce Solutions',
        'Android App Development',
        'iPhone (iOS) App Development',
        'Cross-Platform Mobile Applications',
        'Logo & Brand Identity Design',
        'Banner & Marketing Design',
        'Artificial Intelligence Solutions',
        'AI Automation & Intelligent Systems',
        'Machine Learning & Data Analytics Solutions',
    ];

    const values = [
        {
            icon: '🎯',
            title: 'Professionalism',
            desc: 'Every project handled with expertise and dedication.',
        },
        {
            icon: '🔍',
            title: 'Transparency',
            desc: 'Clear communication at every step of the journey.',
        },
        { icon: '✨', title: 'Innovation', desc: 'Cutting-edge solutions built for the future.' },
        { icon: '🤝', title: 'Client Satisfaction', desc: 'Your success is our ultimate measure.' },
    ];

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
                <AboutHero mob={mob} show={show} />

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <ClosingBrandBanner mob={mob} show={show} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <AboutContent mob={mob} show={show} focusAreas={focusAreas} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <AboutValues mob={mob} show={show} values={values} />
                </motion.div>
            </main>

            <Footer mob={mob} />
            <ChatButton onClick={() => setChatOpen(true)} isOpen={chatOpen} />
            <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />
            <BackToTopButton />
        </>
    );
}
