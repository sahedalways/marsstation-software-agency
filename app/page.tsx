'use client';
import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSec } from './components/home/HeroSec';
import { ServicesSec } from './components/home/ServicesSec';
import { ContactSec } from './components/home/ContactSec';
import { useCanvasAnimation } from './hooks/useCanvasAnimation';

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
    const [cardsIn, setCardsIn] = useState(false);

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

    useEffect(() => {
        const fn = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const p = clamp(window.scrollY / total, 0, 1);
            scrollRef.current = p;

            const y = window.scrollY + window.innerHeight / 2;
            const heroTop = heroRef.current?.offsetTop ?? 0;
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

    useCanvasAnimation({
        canvasRef,
        btnRef,
        scrollRef,
        smoothRef,
        rafRef,
        setPhase,
    });

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

            {/* Fixed navbar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <Navbar mob={mob} />
            </div>

            <main style={{ position: 'relative', zIndex: 1, background: '#07070f' }}>
                <section
                    ref={heroRef}
                    style={{
                        minHeight: '100vh',
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        paddingTop: '15vh',
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

                <section
                    ref={servicesRef}
                    style={{
                        minHeight: '100vh',
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#07070f',
                    }}
                >
                    <ServicesSec phase={phase} mob={mob} cardsIn={cardsIn} />
                </section>

                {/* CONTACT SECTION */}
                <section
                    ref={contactRef}
                    style={{
                        minHeight: '100vh',
                        width: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#07070f',
                    }}
                >
                    <ContactSec phase={phase} mob={mob} agreed={agreed} setAgreed={setAgreed} />
                </section>
            </main>
        </>
    );
}
