'use client';
import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSec } from './components/home/HeroSec';
import { ServicesSec } from './components/home/ServicesSec';
import { ContactSec } from './components/home/ContactSec';
import { useCanvasAnimation } from './hooks/useCanvasAnimation';

// ─── Math utils ───────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const inv = (v: number, lo: number, hi: number) => clamp((v - lo) / (hi - lo), 0, 1);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'hero' | 'services' | 'contact';

export default function IUSPage() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const scrollRef = useRef(0);
    const smoothRef = useRef(0);
    const rafRef = useRef(0);

    const [phase, setPhase] = useState<Phase>('hero');
    const [agreed, setAgreed] = useState(false);
    const [mob, setMob] = useState(false);
    const [cardsIn, setCardsIn] = useState(false);

    // Trigger card fly-in when services phase becomes active
    useEffect(() => {
        if (phase === 'services') {
            setCardsIn(false);
            const id = setTimeout(() => setCardsIn(true), 100);
            return () => clearTimeout(id);
        } else {
            setCardsIn(false);
        }
    }, [phase]);
    useEffect(() => {
        const fn = () => setMob(window.innerWidth < 768);
        fn();
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    // Scroll tracking
    useEffect(() => {
        const fn = () => {
            const el = wrapRef.current;
            if (!el) return;
            scrollRef.current = clamp(
                window.scrollY / (el.scrollHeight - window.innerHeight),
                0,
                1
            );
        };
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    // Canvas animation
    useCanvasAnimation({
        canvasRef,
        btnRef,
        scrollRef,
        smoothRef,
        rafRef,
        setPhase,
    });

    // ── JSX ───────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{`
        @keyframes satFloat {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          33%      { transform: translate(4px,-8px) rotate(1.5deg); }
          66%      { transform: translate(-3px,7px) rotate(-1.2deg); }
        }
        @keyframes flyFromLeft {
          from { opacity:0; transform: translateX(-140px) translateY(50px); }
          to   { opacity:1; transform: translateX(0) translateY(0); }
        }
        @keyframes flyFromBottom {
          from { opacity:0; transform: translateY(150px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes flyFromRight {
          from { opacity:0; transform: translateX(140px) translateY(50px); }
          to   { opacity:1; transform: translateX(0) translateY(0); }
        }
        .ius-btn {
          border: 1px solid rgba(255,255,255,0.26);
          border-radius: 9999px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.90);
          cursor: pointer;
          font-family: inherit;
          letter-spacing: 0.02em;
          transition: background 0.22s, border-color 0.22s;
        }
        .ius-btn:hover {
          background: rgba(255,255,255,0.10);
          border-color: rgba(255,255,255,0.44);
        }
        .card-wrap { position:relative; }
        .card-wrap:hover { z-index:20!important; }
        .card-inner {
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2);
        }
        .card-inner:hover {
          transform: scale(1.04) rotate(0deg)!important;
        }
        input:focus { border-color: rgba(110,65,220,0.80)!important; }
      `}</style>

            <div ref={wrapRef} style={{ height: '500vh', background: '#07070f' }}>
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        width: '100%',
                        height: '100vh',
                        overflow: 'hidden',
                    }}
                >
                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 0,
                        }}
                    />

                    <Navbar mob={mob} />

                    <HeroSec phase={phase} mob={mob} btnRef={btnRef} />

                    <ServicesSec phase={phase} mob={mob} cardsIn={cardsIn} />

                    <ContactSec phase={phase} mob={mob} agreed={agreed} setAgreed={setAgreed} />
                </div>
            </div>
        </>
    );
}
