'use client';
import { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSec } from './components/home/HeroSec';
import { ServicesSec } from './components/home/ServicesSec';
import { ContactSec } from './components/home/ContactSec';

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
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let globeRot = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        // Stars
        const stars = Array.from({ length: 130 }, () => ({
            x: Math.random(),
            y: Math.random() * 0.85,
            r: Math.random() * 1.3 + 0.2,
            a: Math.random() * 0.6 + 0.1,
            sp: Math.random() * 0.005 + 0.001,
        }));

        let t = 0;

        // Draws a rocket centered at (cx,cy), sized ~size px, tilted nose-up-left
        const drawRocket = (
            c: CanvasRenderingContext2D,
            cx: number,
            cy: number,
            size: number,
            alpha: number,
            time: number
        ) => {
            c.save();
            c.globalAlpha = alpha;

            // Float animation
            const floatY = Math.sin(time * 0.8) * 3.5;
            const floatX = Math.cos(time * 0.5) * 1.8;
            c.translate(cx + floatX, cy + floatY);

            // Rotate -42deg: nose pointing upper-left
            c.rotate(-0.74);

            const s = size;

            // ── Engine exhaust glow (bottom of rocket) ──────────────────────────
            const exGlow = c.createRadialGradient(0, s * 0.55, 0, 0, s * 0.55, s * 0.55);
            exGlow.addColorStop(0, `rgba(120,180,255,${0.55 * alpha})`);
            exGlow.addColorStop(0.4, `rgba(80,120,255,${0.22 * alpha})`);
            exGlow.addColorStop(1, 'rgba(40,60,200,0)');
            c.fillStyle = exGlow;
            c.beginPath();
            c.ellipse(0, s * 0.55, s * 0.28, s * 0.55, 0, 0, Math.PI * 2);
            c.fill();

            // ── Main body ───────────────────────────────────────────────────────
            // Fuselage: tall rounded rect
            const bodyGrad = c.createLinearGradient(-s * 0.18, -s * 0.5, s * 0.18, -s * 0.5);
            bodyGrad.addColorStop(0, 'rgba(200,210,230,0.95)');
            bodyGrad.addColorStop(0.35, 'rgba(230,235,245,0.98)');
            bodyGrad.addColorStop(0.65, 'rgba(200,210,228,0.95)');
            bodyGrad.addColorStop(1, 'rgba(160,175,200,0.90)');
            c.fillStyle = bodyGrad;
            c.beginPath();
            c.roundRect(-s * 0.17, -s * 0.46, s * 0.34, s * 0.8, s * 0.17);
            c.fill();

            // Body edge shadow
            c.strokeStyle = 'rgba(140,155,180,0.60)';
            c.lineWidth = 0.8;
            c.beginPath();
            c.roundRect(-s * 0.17, -s * 0.46, s * 0.34, s * 0.8, s * 0.17);
            c.stroke();

            // ── Nose cone ───────────────────────────────────────────────────────
            const noseGrad = c.createLinearGradient(-s * 0.12, -s * 0.88, s * 0.12, -s * 0.88);
            noseGrad.addColorStop(0, 'rgba(180,195,220,0.90)');
            noseGrad.addColorStop(0.5, 'rgba(220,228,242,0.96)');
            noseGrad.addColorStop(1, 'rgba(170,185,210,0.88)');
            c.fillStyle = noseGrad;
            c.beginPath();
            c.moveTo(-s * 0.17, -s * 0.44);
            c.bezierCurveTo(-s * 0.17, -s * 0.7, -s * 0.06, -s * 0.9, 0, -s * 0.92);
            c.bezierCurveTo(s * 0.06, -s * 0.9, s * 0.17, -s * 0.7, s * 0.17, -s * 0.44);
            c.closePath();
            c.fill();

            // Nose tip glow
            const tipGlow = c.createRadialGradient(0, -s * 0.88, 0, 0, -s * 0.88, s * 0.12);
            tipGlow.addColorStop(0, 'rgba(200,220,255,0.90)');
            tipGlow.addColorStop(1, 'rgba(160,185,230,0)');
            c.fillStyle = tipGlow;
            c.beginPath();
            c.arc(0, -s * 0.88, s * 0.12, 0, Math.PI * 2);
            c.fill();

            // ── Window ──────────────────────────────────────────────────────────
            const winGrad = c.createRadialGradient(-s * 0.03, -s * 0.16, 0, 0, -s * 0.12, s * 0.11);
            winGrad.addColorStop(0, 'rgba(180,210,255,0.95)');
            winGrad.addColorStop(0.5, 'rgba(100,150,230,0.80)');
            winGrad.addColorStop(1, 'rgba(40,80,180,0.70)');
            c.fillStyle = winGrad;
            c.beginPath();
            c.arc(0, -s * 0.12, s * 0.1, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = 'rgba(160,190,240,0.70)';
            c.lineWidth = 1.0;
            c.beginPath();
            c.arc(0, -s * 0.12, s * 0.1, 0, Math.PI * 2);
            c.stroke();
            // Window glint
            c.fillStyle = 'rgba(255,255,255,0.70)';
            c.beginPath();
            c.arc(-s * 0.03, -s * 0.16, s * 0.03, 0, Math.PI * 2);
            c.fill();

            // ── Side fins ───────────────────────────────────────────────────────
            const finGrad = c.createLinearGradient(-s * 0.4, s * 0.22, 0, s * 0.22);
            finGrad.addColorStop(0, 'rgba(160,175,205,0.80)');
            finGrad.addColorStop(1, 'rgba(210,218,235,0.92)');
            c.fillStyle = finGrad;
            // Left fin
            c.beginPath();
            c.moveTo(-s * 0.17, s * 0.18);
            c.lineTo(-s * 0.42, s * 0.38);
            c.lineTo(-s * 0.32, s * 0.34);
            c.lineTo(-s * 0.17, s * 0.34);
            c.closePath();
            c.fill();
            // Right fin
            const finGrad2 = c.createLinearGradient(0, s * 0.22, s * 0.4, s * 0.22);
            finGrad2.addColorStop(0, 'rgba(210,218,235,0.92)');
            finGrad2.addColorStop(1, 'rgba(160,175,205,0.78)');
            c.fillStyle = finGrad2;
            c.beginPath();
            c.moveTo(s * 0.17, s * 0.18);
            c.lineTo(s * 0.42, s * 0.38);
            c.lineTo(s * 0.32, s * 0.34);
            c.lineTo(s * 0.17, s * 0.34);
            c.closePath();
            c.fill();

            // ── Engine nozzle ───────────────────────────────────────────────────
            const nozGrad = c.createLinearGradient(-s * 0.14, s * 0.32, s * 0.14, s * 0.32);
            nozGrad.addColorStop(0, 'rgba(140,155,185,0.90)');
            nozGrad.addColorStop(0.5, 'rgba(190,200,220,0.96)');
            nozGrad.addColorStop(1, 'rgba(130,145,175,0.88)');
            c.fillStyle = nozGrad;
            c.beginPath();
            c.moveTo(-s * 0.13, s * 0.33);
            c.lineTo(-s * 0.17, s * 0.5);
            c.lineTo(s * 0.17, s * 0.5);
            c.lineTo(s * 0.13, s * 0.33);
            c.closePath();
            c.fill();

            // ── Flame ───────────────────────────────────────────────────────────
            const flicker = 0.85 + 0.15 * Math.sin(time * 18);
            const fh = s * 0.42 * flicker;
            const flameGrad = c.createLinearGradient(0, s * 0.5, 0, s * 0.5 + fh);
            flameGrad.addColorStop(0, `rgba(200,230,255,${0.95 * alpha})`);
            flameGrad.addColorStop(0.25, `rgba(140,190,255,${0.8 * alpha})`);
            flameGrad.addColorStop(0.6, `rgba(80,120,255,${0.55 * alpha})`);
            flameGrad.addColorStop(1, 'rgba(40,60,200,0)');
            c.fillStyle = flameGrad;
            c.beginPath();
            c.moveTo(-s * 0.14, s * 0.5);
            c.bezierCurveTo(
                -s * 0.1,
                s * 0.5 + fh * 0.5,
                -s * 0.06,
                s * 0.5 + fh * 0.85,
                0,
                s * 0.5 + fh
            );
            c.bezierCurveTo(
                s * 0.06,
                s * 0.5 + fh * 0.85,
                s * 0.1,
                s * 0.5 + fh * 0.5,
                s * 0.14,
                s * 0.5
            );
            c.closePath();
            c.fill();

            // Body panel lines
            c.strokeStyle = 'rgba(170,185,215,0.35)';
            c.lineWidth = 0.7;
            [-s * 0.02, s * 0.06, s * 0.16].forEach((yy) => {
                c.beginPath();
                c.moveTo(-s * 0.15, yy);
                c.lineTo(s * 0.15, yy);
                c.stroke();
            });

            c.restore();
        };

        const drawPlanet = (cx: number, cy: number, r: number, alpha: number) => {
            if (alpha < 0.01) return;
            ctx.save();
            ctx.globalAlpha = alpha;

            // Atmosphere
            const atm = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.4);
            atm.addColorStop(0, 'rgba(100,55,210,0.18)');
            atm.addColorStop(0.5, 'rgba(55,15,140,0.07)');
            atm.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = atm;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
            ctx.fill();

            // Planet body (clipped)
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.clip();

            const body = ctx.createRadialGradient(
                cx - r * 0.28,
                cy - r * 0.22,
                r * 0.02,
                cx + r * 0.1,
                cy + r * 0.1,
                r * 1.1
            );
            body.addColorStop(0, '#ffffff');
            body.addColorStop(0.12, '#e8e8e8');
            body.addColorStop(0.35, '#c0c0c0');
            body.addColorStop(0.6, '#909090');
            body.addColorStop(1, '#404040');
            ctx.fillStyle = body;
            ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

            // Surface craters/patches
            [
                { x: cx - r * 0.08, y: cy - r * 0.18, rx: r * 0.32, ry: r * 0.21, a: 0.18 },
                { x: cx + r * 0.28, y: cy + r * 0.1, rx: r * 0.22, ry: r * 0.16, a: 0.14 },
                { x: cx - r * 0.32, y: cy + r * 0.26, rx: r * 0.18, ry: r * 0.13, a: 0.11 },
                { x: cx + r * 0.06, y: cy + r * 0.3, rx: r * 0.25, ry: r * 0.11, a: 0.12 },
                { x: cx - r * 0.2, y: cy - r * 0.36, rx: r * 0.15, ry: r * 0.09, a: 0.08 },
            ].forEach((p) => {
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rx);
                g.addColorStop(0, `rgba(200,200,200,${p.a})`);
                g.addColorStop(1, 'rgba(140,140,140,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.rx, p.ry, 0.4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Dark side shadow
            const dark = ctx.createRadialGradient(
                cx + r * 0.5,
                cy + r * 0.3,
                r * 0.05,
                cx + r * 0.5,
                cy + r * 0.3,
                r * 1.2
            );
            dark.addColorStop(0, 'rgba(0,0,10,0.78)');
            dark.addColorStop(0.35, 'rgba(0,0,10,0.48)');
            dark.addColorStop(1, 'rgba(0,0,10,0)');
            ctx.fillStyle = dark;
            ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
            ctx.restore();

            // Rim light
            const rim = ctx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.08);
            rim.addColorStop(0, 'rgba(180,150,255,0.22)');
            rim.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rim;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const drawGlobe = (cx: number, cy: number, r: number, alpha: number) => {
            if (alpha < 0.01) return;
            ctx.save();
            ctx.globalAlpha = alpha;

            // Outer glow ring
            const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.35);
            glow.addColorStop(0, `rgba(140,90,255,${0.18 * alpha})`);
            glow.addColorStop(0.6, `rgba(80,30,200,${0.05 * alpha})`);
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
            ctx.fill();

            // Equator circle
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${0.2 * alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();

            // Meridians
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI + globeRot;
                const xScale = Math.cos(angle);
                const front = xScale > 0;
                ctx.beginPath();
                ctx.strokeStyle = front
                    ? `rgba(255,255,255,${0.26 * alpha})`
                    : `rgba(255,255,255,${0.06 * alpha})`;
                ctx.lineWidth = front ? 0.85 : 0.45;
                for (let s = 0; s <= 64; s++) {
                    const tt = -Math.PI / 2 + (Math.PI / 64) * s;
                    const x = cx + r * xScale * Math.cos(tt);
                    const y = cy + r * Math.sin(tt);
                    s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Parallels
            [-0.65, -0.38, 0, 0.38, 0.65].forEach((lat) => {
                const py = cy + r * lat;
                const pr = r * Math.sqrt(1 - lat * lat);
                if (pr < 3) return;
                ctx.beginPath();
                ctx.strokeStyle =
                    lat === 0
                        ? `rgba(255,255,255,${0.32 * alpha})`
                        : `rgba(255,255,255,${0.11 * alpha})`;
                ctx.lineWidth = lat === 0 ? 1.0 : 0.55;
                ctx.ellipse(cx, py, pr, pr * 0.13, 0, 0, Math.PI * 2);
                ctx.stroke();
            });

            ctx.restore();
        };

        const frame = () => {
            const p = (smoothRef.current += (scrollRef.current - smoothRef.current) * 0.072);
            const W = window.innerWidth;
            const H = window.innerHeight;
            const isMob = W < 768;

            ctx.clearRect(0, 0, W, H);
            t += 0.016;
            globeRot += 0.004;

            // BG
            ctx.fillStyle = '#07070f';
            ctx.fillRect(0, 0, W, H);

            // Section glows
            const hGA = 1 - inv(p, 0.2, 0.42);
            if (hGA > 0) {
                const g = ctx.createRadialGradient(
                    W * 0.5,
                    H * 1.05,
                    0,
                    W * 0.5,
                    H * 1.05,
                    H * 0.95
                );
                g.addColorStop(0, `rgba(60,10,155,${0.7 * hGA})`);
                g.addColorStop(0.45, `rgba(35,6,100,${0.24 * hGA})`);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }
            const sGA = inv(p, 0.38, 0.52) * (1 - inv(p, 0.65, 0.76));
            if (sGA > 0) {
                const g = ctx.createRadialGradient(
                    W * 0.5,
                    H * 0.75,
                    0,
                    W * 0.5,
                    H * 0.75,
                    H * 0.65
                );
                g.addColorStop(0, `rgba(70,15,175,${0.5 * sGA})`);
                g.addColorStop(0.45, `rgba(38,7,110,${0.14 * sGA})`);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }
            const cGA = inv(p, 0.72, 0.9);
            if (cGA > 0) {
                const g = ctx.createRadialGradient(
                    W * 0.5,
                    H * 1.08,
                    0,
                    W * 0.5,
                    H * 1.08,
                    H * 0.95
                );
                g.addColorStop(0, `rgba(88,15,215,${0.78 * cGA})`);
                g.addColorStop(0.42, `rgba(50,8,145,${0.32 * cGA})`);
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }

            // Stars
            for (const s of stars) {
                const a = s.a * (0.4 + 0.6 * Math.sin(t * s.sp * 55 + s.x * 10));
                ctx.beginPath();
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${a})`;
                ctx.fill();
            }

            // ── Globe/Planet positioning ──────────────────────────────────────────
            const morph = ease(inv(p, 0.25, 0.52));

            // Responsive base radius
            const baseR = isMob ? Math.min(W, H) * 0.28 : Math.min(W, H) * 0.43;

            // Hero keyframe — moon center is button bottom + 96px (≈1 inch)
            const hcx = W * 0.5;
            const btnBottom = btnRef.current
                ? btnRef.current.getBoundingClientRect().bottom + 96
                : H * 0.62;
            const hcy = btnBottom + baseR * 0.5;
            const hgr = baseR;

            // Services keyframe
            const scx = isMob ? W * 0.75 : W * 0.77;
            const scy = isMob ? H * 0.28 : H * 0.33;
            const sgr = baseR * (isMob ? 0.5 : 0.52);

            // Contact keyframe
            const ccx = isMob ? W * 0.22 : W * 0.21;
            const ccy = isMob ? H * 0.43 : H * 0.48;
            const cgr = baseR * (isMob ? 0.65 : 0.68);

            let gcx: number, gcy: number, gr: number;

            if (p < 0.28) {
                gcx = hcx;
                gcy = hcy;
                gr = hgr;
            } else if (p < 0.52) {
                const e = ease(inv(p, 0.28, 0.52));
                gcx = lerp(hcx, scx, e);
                gcy = lerp(hcy, scy, e);
                gr = lerp(hgr, sgr, e);
            } else if (p < 0.68) {
                gcx = scx;
                gcy = scy;
                gr = sgr;
            } else if (p < 0.84) {
                const e = ease(inv(p, 0.68, 0.84));
                gcx = lerp(scx, ccx, e);
                gcy = lerp(scy, ccy, e);
                gr = lerp(sgr, cgr, e);
            } else {
                gcx = ccx;
                gcy = ccy;
                gr = cgr;
            }

            drawPlanet(gcx, gcy, gr, 1 - morph);
            drawGlobe(gcx, gcy, gr, morph);

            // Rocket right side of moon, vertically centered, nose upper-left
            const rocketAlpha = 1 - inv(p, 0.22, 0.38);
            if (rocketAlpha > 0.01) {
                const rSize = gr * (isMob ? 0.5 : 0.46);
                const rx = gcx + gr * 1.35; // further right of moon
                const ry = gcy - gr * 0.1; // vertically near center
                drawRocket(ctx, rx, ry, rSize, rocketAlpha, t);
            }

            const np: Phase = p < 0.4 ? 'hero' : p < 0.72 ? 'services' : 'contact';
            setPhase((prev) => (prev !== np ? np : prev));
            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

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

// ─── Section transition wrapper ───────────────────────────────────────────────
function Section({ visible, children }: { visible: boolean; children: React.ReactNode }) {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : 'translateY(24px)',
                transition:
                    'opacity 0.55s cubic-bezier(.4,0,.2,1), transform 0.55s cubic-bezier(.4,0,.2,1)',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            {children}
        </div>
    );
}

// ─── Form label ───────────────────────────────────────────────────────────────
function Lbl({ children, mob }: { children: React.ReactNode; mob: boolean }) {
    return (
        <label
            style={{
                display: 'block',
                fontSize: mob ? '9.5px' : '11px',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: mob ? '4px' : '6px',
                letterSpacing: '0.03em',
            }}
        >
            {children}
        </label>
    );
}

// ─── Form field ───────────────────────────────────────────────────────────────
function Field({
    label,
    placeholder,
    type = 'text',
    mob,
}: {
    label: string;
    placeholder: string;
    type?: string;
    mob: boolean;
}) {
    return (
        <div>
            <Lbl mob={mob}>{label}</Lbl>
            <input
                type={type}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '8px',
                    padding: mob ? '6px 10px' : '9px 13px',
                    color: '#fff',
                    fontSize: mob ? '11px' : '12px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(110,65,220,0.80)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
        </div>
    );
}
