// hooks/useCanvasAnimation.ts
import { useEffect, useRef, MutableRefObject } from 'react';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const inv = (v: number, lo: number, hi: number) => clamp((v - lo) / (hi - lo), 0, 1);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

type Phase = 'hero' | 'services' | 'contact';

interface UseCanvasAnimationProps {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    btnRef: MutableRefObject<HTMLButtonElement | null>;
    scrollRef: MutableRefObject<number>;
    smoothRef: MutableRefObject<number>;
    rafRef: MutableRefObject<number>;
}

const initRoundRect = () => {
    if (typeof window === 'undefined') return;
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (
            x: number,
            y: number,
            w: number,
            h: number,
            r: number
        ) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.moveTo(x + r, y);
            this.lineTo(x + w - r, y);
            this.quadraticCurveTo(x + w, y, x + w, y + r);
            this.lineTo(x + w, y + h - r);
            this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            this.lineTo(x + r, y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r);
            this.lineTo(x, y + r);
            this.quadraticCurveTo(x, y, x + r, y);
            return this;
        };
    }
};

// Seeded random for stable crater/continent generation
const seededRand = (seed: number) => {
    let s = seed;
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
};

export function useCanvasAnimation({
    canvasRef,
    btnRef,
    scrollRef,
    smoothRef,
    rafRef,
}: UseCanvasAnimationProps) {
    useEffect(() => {
        initRoundRect();

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const stars = Array.from({ length: 130 }, () => ({
            x: Math.random(),
            y: Math.random() * 0.85,
            r: Math.random() * 1.3 + 0.2,
            a: Math.random() * 0.6 + 0.1,
            sp: Math.random() * 0.005 + 0.001,
        }));

        // Pre-generate stable surface features for the moon
        const rand = seededRand(42);
        const surfaceFeatures = Array.from({ length: 60 }, () => ({
            // spherical coords (lon, lat)
            lon: rand() * Math.PI * 2,
            lat: (rand() - 0.5) * Math.PI * 0.9,
            size: rand() * 0.18 + 0.04, // relative to r
            darkness: rand() * 0.35 + 0.1,
            type: rand() > 0.55 ? 'continent' : 'crater',
        }));

        // Smaller craters for surface texture
        const smallCraters = Array.from({ length: 120 }, () => ({
            lon: rand() * Math.PI * 2,
            lat: (rand() - 0.5) * Math.PI * 0.95,
            size: rand() * 0.04 + 0.008,
            darkness: rand() * 0.25 + 0.08,
        }));

        let t = 0;
        let moonRot = 0; // moon surface rotation
        let orbitAngle = 0; // satellite orbit angle

        // ── Satellite (Soyuz / Progress-style) ──────────────────────────────────
        const drawSatellite = (
            c: CanvasRenderingContext2D,
            cx: number,
            cy: number,
            size: number,
            alpha: number,
            time: number,
            rotation: number
        ) => {
            c.save();
            c.globalAlpha = alpha;
            c.translate(cx, cy);
            c.rotate(rotation);

            const s = size;

            // ── Soft halo around satellite (atmospheric scatter) ──────────────────
            const halo = c.createRadialGradient(0, 0, 0, 0, 0, s * 1.4);
            halo.addColorStop(0, `rgba(160,190,240,${0.12 * alpha})`);
            halo.addColorStop(0.5, `rgba(100,130,200,${0.05 * alpha})`);
            halo.addColorStop(1, 'rgba(0,0,0,0)');
            c.fillStyle = halo;
            c.beginPath();
            c.arc(0, 0, s * 1.4, 0, Math.PI * 2);
            c.fill();

            // ═══════════════════════════════════════════════════════════════════════
            // SOLAR PANELS (large detailed wings with realistic cells)
            // ═══════════════════════════════════════════════════════════════════════
            const panelW = s * 1.05;
            const panelH = s * 0.38;
            const armLen = s * 0.1;

            const drawPanel = (dir: 1 | -1) => {
                // Connecting arm/truss (3D look with shading)
                const armX = dir === 1 ? s * 0.19 : -s * 0.19 - armLen;
                const armGrad = c.createLinearGradient(armX, -s * 0.025, armX, s * 0.025);
                armGrad.addColorStop(0, 'rgba(180,185,195,0.95)');
                armGrad.addColorStop(0.5, 'rgba(220,225,235,1)');
                armGrad.addColorStop(1, 'rgba(120,128,140,0.95)');
                c.fillStyle = armGrad;
                c.fillRect(armX, -s * 0.025, armLen, s * 0.05);
                c.strokeStyle = 'rgba(80,88,100,0.8)';
                c.lineWidth = 0.6;
                c.strokeRect(armX, -s * 0.025, armLen, s * 0.05);

                const px = dir === 1 ? s * 0.19 + armLen : -s * 0.19 - armLen - panelW;
                const py = -panelH / 2;

                // Panel back frame (darker border)
                c.fillStyle = 'rgba(70,75,90,0.95)';
                c.fillRect(px - 1, py - 1, panelW + 2, panelH + 2);

                // Main solar cell surface (deep blue-purple base)
                const panelGrad = c.createLinearGradient(px, py, px, py + panelH);
                panelGrad.addColorStop(0, 'rgba(25,40,90,1)');
                panelGrad.addColorStop(0.3, 'rgba(40,65,135,1)');
                panelGrad.addColorStop(0.5, 'rgba(55,85,160,1)');
                panelGrad.addColorStop(0.7, 'rgba(40,65,135,1)');
                panelGrad.addColorStop(1, 'rgba(20,35,80,1)');
                c.fillStyle = panelGrad;
                c.fillRect(px, py, panelW, panelH);

                // Individual solar cells grid (realistic cell pattern)
                const cols = 10;
                const rows = 3;
                const cellW = panelW / cols;
                const cellH = panelH / rows;

                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cx2 = px + col * cellW;
                        const cy2 = py + row * cellH;

                        // Cell highlight (subtle iridescence)
                        const cellGrad = c.createLinearGradient(cx2, cy2, cx2 + cellW, cy2 + cellH);
                        cellGrad.addColorStop(0, 'rgba(80,120,200,0.25)');
                        cellGrad.addColorStop(0.5, 'rgba(120,160,230,0.15)');
                        cellGrad.addColorStop(1, 'rgba(30,50,110,0.3)');
                        c.fillStyle = cellGrad;
                        c.fillRect(cx2 + 0.5, cy2 + 0.5, cellW - 1, cellH - 1);

                        // Cell corner contact points (tiny dots)
                        c.fillStyle = 'rgba(200,210,230,0.5)';
                        c.fillRect(cx2 + 1, cy2 + 1, 0.8, 0.8);
                        c.fillRect(cx2 + cellW - 2, cy2 + cellH - 2, 0.8, 0.8);
                    }
                }

                // Grid lines (cell separators)
                c.strokeStyle = 'rgba(15,25,55,0.9)';
                c.lineWidth = 0.7;
                for (let i = 1; i < cols; i++) {
                    const xx = px + cellW * i;
                    c.beginPath();
                    c.moveTo(xx, py);
                    c.lineTo(xx, py + panelH);
                    c.stroke();
                }
                for (let i = 1; i < rows; i++) {
                    const yy = py + cellH * i;
                    c.beginPath();
                    c.moveTo(px, yy);
                    c.lineTo(px + panelW, yy);
                    c.stroke();
                }

                // Animated sunlight reflection sweep
                const sweep = ((time * 0.3) % 2.5) - 0.5;
                const sweepX = px + panelW * sweep;
                if (sweepX > px - panelW * 0.3 && sweepX < px + panelW * 1.3) {
                    const sweepGrad = c.createLinearGradient(
                        sweepX - panelW * 0.2,
                        0,
                        sweepX + panelW * 0.2,
                        0
                    );
                    sweepGrad.addColorStop(0, 'rgba(255,255,255,0)');
                    sweepGrad.addColorStop(0.5, `rgba(180,210,255,${0.22 * alpha})`);
                    sweepGrad.addColorStop(1, 'rgba(255,255,255,0)');
                    c.fillStyle = sweepGrad;
                    c.fillRect(px, py, panelW, panelH);
                }

                // Outer panel frame edge (silver border)
                c.strokeStyle = 'rgba(200,210,225,0.85)';
                c.lineWidth = 0.9;
                c.strokeRect(px, py, panelW, panelH);

                // Inner shadow on bottom edge
                c.strokeStyle = 'rgba(0,0,0,0.4)';
                c.lineWidth = 0.5;
                c.beginPath();
                c.moveTo(px, py + panelH);
                c.lineTo(px + panelW, py + panelH);
                c.stroke();
            };

            drawPanel(-1);
            drawPanel(1);

            // ═══════════════════════════════════════════════════════════════════════
            // MAIN BODY (cylindrical bus with gold MLI thermal blanket)
            // ═══════════════════════════════════════════════════════════════════════
            const bodyW = s * 0.4;
            const bodyH = s * 0.3;

            // Body shadow under (depth)
            c.fillStyle = 'rgba(0,0,0,0.35)';
            c.beginPath();
            c.ellipse(0, bodyH * 0.55, bodyW * 0.55, bodyH * 0.12, 0, 0, Math.PI * 2);
            c.fill();

            // Main body with gold thermal foil look (MLI - multi-layer insulation)
            const bodyGrad = c.createLinearGradient(0, -bodyH / 2, 0, bodyH / 2);
            bodyGrad.addColorStop(0, 'rgba(255,215,130,0.98)'); // bright gold top
            bodyGrad.addColorStop(0.25, 'rgba(230,180,90,1)'); // mid gold
            bodyGrad.addColorStop(0.5, 'rgba(200,150,60,1)'); // deep gold
            bodyGrad.addColorStop(0.75, 'rgba(160,115,40,1)'); // shadowed gold
            bodyGrad.addColorStop(1, 'rgba(100,70,25,0.95)'); // dark bottom
            c.fillStyle = bodyGrad;
            c.beginPath();
            c.roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, bodyH * 0.28);
            c.fill();

            // MLI foil wrinkle/texture lines (horizontal)
            c.strokeStyle = 'rgba(120,80,20,0.4)';
            c.lineWidth = 0.4;
            for (let i = 1; i < 8; i++) {
                const yy = -bodyH / 2 + (bodyH / 8) * i;
                c.beginPath();
                c.moveTo(-bodyW / 2 + 2, yy);
                c.lineTo(bodyW / 2 - 2, yy);
                c.stroke();
            }

            // Foil highlight (sheen)
            const foilSheen = c.createLinearGradient(-bodyW / 2, -bodyH / 2, bodyW / 2, bodyH / 2);
            foilSheen.addColorStop(0, 'rgba(255,240,200,0.25)');
            foilSheen.addColorStop(0.5, 'rgba(255,255,255,0)');
            foilSheen.addColorStop(1, 'rgba(0,0,0,0.15)');
            c.fillStyle = foilSheen;
            c.beginPath();
            c.roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, bodyH * 0.28);
            c.fill();

            // Body outline
            c.strokeStyle = 'rgba(80,55,20,0.85)';
            c.lineWidth = 0.9;
            c.beginPath();
            c.roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, bodyH * 0.28);
            c.stroke();

            // Vertical structural rib (darker band)
            c.fillStyle = 'rgba(70,50,15,0.55)';
            c.fillRect(-bodyW * 0.03, -bodyH / 2 + 1, bodyW * 0.06, bodyH - 2);

            // Equipment patches (instrument panels on the body)
            // Patch 1 - white sensor
            c.fillStyle = 'rgba(230,235,245,0.95)';
            c.fillRect(-bodyW * 0.32, -bodyH * 0.15, bodyW * 0.18, bodyH * 0.3);
            c.strokeStyle = 'rgba(100,110,130,0.8)';
            c.lineWidth = 0.5;
            c.strokeRect(-bodyW * 0.32, -bodyH * 0.15, bodyW * 0.18, bodyH * 0.3);
            // sensor detail
            c.fillStyle = 'rgba(40,50,70,0.9)';
            c.fillRect(-bodyW * 0.29, -bodyH * 0.1, bodyW * 0.12, bodyH * 0.08);

            // Patch 2 - dark radiator
            c.fillStyle = 'rgba(30,35,45,0.9)';
            c.fillRect(bodyW * 0.12, -bodyH * 0.2, bodyW * 0.2, bodyH * 0.4);
            // radiator fins
            c.strokeStyle = 'rgba(80,90,110,0.6)';
            c.lineWidth = 0.4;
            for (let i = 1; i < 6; i++) {
                const xx = bodyW * 0.12 + ((bodyW * 0.2) / 6) * i;
                c.beginPath();
                c.moveTo(xx, -bodyH * 0.2);
                c.lineTo(xx, bodyH * 0.2);
                c.stroke();
            }

            // ═══════════════════════════════════════════════════════════════════════
            // FORWARD MODULE / DOCKING SECTION (right side)
            // ═══════════════════════════════════════════════════════════════════════
            const noseW = s * 0.16;
            const noseH = s * 0.2;
            const noseX = bodyW / 2 - 1;

            // Nose module body (silver-white)
            const noseGrad = c.createLinearGradient(noseX, -noseH / 2, noseX, noseH / 2);
            noseGrad.addColorStop(0, 'rgba(240,245,252,1)');
            noseGrad.addColorStop(0.5, 'rgba(210,218,232,1)');
            noseGrad.addColorStop(1, 'rgba(140,150,170,0.95)');
            c.fillStyle = noseGrad;
            c.beginPath();
            c.roundRect(noseX, -noseH / 2, noseW, noseH, noseH * 0.3);
            c.fill();
            c.strokeStyle = 'rgba(90,100,120,0.85)';
            c.lineWidth = 0.7;
            c.stroke();

            // Nose band ring
            c.fillStyle = 'rgba(100,110,130,0.7)';
            c.fillRect(noseX + noseW * 0.7, -noseH / 2, noseW * 0.08, noseH);

            // Docking port (circular)
            c.fillStyle = 'rgba(60,70,90,0.95)';
            c.beginPath();
            c.arc(noseX + noseW, 0, noseH * 0.18, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = 'rgba(180,190,210,0.8)';
            c.lineWidth = 0.6;
            c.stroke();
            // inner port
            c.fillStyle = 'rgba(20,25,35,1)';
            c.beginPath();
            c.arc(noseX + noseW, 0, noseH * 0.1, 0, Math.PI * 2);
            c.fill();

            // ═══════════════════════════════════════════════════════════════════════
            // REAR ENGINE / PROPULSION (left side)
            // ═══════════════════════════════════════════════════════════════════════
            const engineW = s * 0.1;
            const engineX = -bodyW / 2;

            // Engine housing
            const engineGrad = c.createLinearGradient(engineX, -bodyH * 0.3, engineX, bodyH * 0.3);
            engineGrad.addColorStop(0, 'rgba(140,150,170,0.95)');
            engineGrad.addColorStop(0.5, 'rgba(180,190,210,1)');
            engineGrad.addColorStop(1, 'rgba(90,100,120,0.95)');
            c.fillStyle = engineGrad;
            c.beginPath();
            c.moveTo(engineX, -bodyH * 0.3);
            c.lineTo(engineX - engineW, -bodyH * 0.2);
            c.lineTo(engineX - engineW, bodyH * 0.2);
            c.lineTo(engineX, bodyH * 0.3);
            c.closePath();
            c.fill();
            c.strokeStyle = 'rgba(60,70,90,0.85)';
            c.lineWidth = 0.7;
            c.stroke();

            // Engine nozzle (dark interior)
            c.fillStyle = 'rgba(20,25,35,1)';
            c.fillRect(engineX - engineW - 2, -bodyH * 0.15, 3, bodyH * 0.3);

            // Subtle exhaust glow
            const exhaustFlicker = 0.7 + 0.3 * Math.sin(time * 8);
            const exhaust = c.createRadialGradient(
                engineX - engineW - 2,
                0,
                0,
                engineX - engineW - 2,
                0,
                s * 0.15
            );
            exhaust.addColorStop(0, `rgba(150,200,255,${0.4 * exhaustFlicker * alpha})`);
            exhaust.addColorStop(0.5, `rgba(80,140,230,${0.15 * exhaustFlicker * alpha})`);
            exhaust.addColorStop(1, 'rgba(0,0,0,0)');
            c.fillStyle = exhaust;
            c.beginPath();
            c.arc(engineX - engineW - 2, 0, s * 0.15, 0, Math.PI * 2);
            c.fill();

            // ═══════════════════════════════════════════════════════════════════════
            // HIGH-GAIN ANTENNA DISH (top of body)
            // ═══════════════════════════════════════════════════════════════════════
            const dishX = bodyW * 0.05;
            const dishY = -bodyH / 2 - s * 0.05;
            const dishR = s * 0.08;

            // Antenna mast
            c.strokeStyle = 'rgba(160,170,190,0.9)';
            c.lineWidth = 1.2;
            c.beginPath();
            c.moveTo(dishX, -bodyH / 2);
            c.lineTo(dishX, dishY);
            c.stroke();

            // Dish (parabolic)
            const dishGrad = c.createRadialGradient(dishX, dishY, 0, dishX, dishY, dishR);
            dishGrad.addColorStop(0, 'rgba(245,248,255,1)');
            dishGrad.addColorStop(0.7, 'rgba(190,200,220,1)');
            dishGrad.addColorStop(1, 'rgba(120,130,150,0.95)');
            c.fillStyle = dishGrad;
            c.beginPath();
            c.ellipse(dishX, dishY, dishR, dishR * 0.5, 0, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = 'rgba(80,90,110,0.85)';
            c.lineWidth = 0.6;
            c.stroke();

            // Dish feed horn (small dot in center)
            c.fillStyle = 'rgba(60,65,80,0.95)';
            c.beginPath();
            c.arc(dishX, dishY, dishR * 0.15, 0, Math.PI * 2);
            c.fill();

            // ═══════════════════════════════════════════════════════════════════════
            // SMALL ANTENNAS (bottom)
            // ═══════════════════════════════════════════════════════════════════════
            c.strokeStyle = 'rgba(190,200,220,0.85)';
            c.lineWidth = 0.8;
            c.beginPath();
            c.moveTo(-bodyW * 0.15, bodyH / 2);
            c.lineTo(-bodyW * 0.15, bodyH / 2 + s * 0.1);
            c.moveTo(bodyW * 0.18, bodyH / 2);
            c.lineTo(bodyW * 0.18, bodyH / 2 + s * 0.08);
            c.stroke();
            // antenna tips
            c.fillStyle = 'rgba(230,235,245,0.95)';
            c.beginPath();
            c.arc(-bodyW * 0.15, bodyH / 2 + s * 0.1, s * 0.012, 0, Math.PI * 2);
            c.arc(bodyW * 0.18, bodyH / 2 + s * 0.08, s * 0.012, 0, Math.PI * 2);
            c.fill();

            // ═══════════════════════════════════════════════════════════════════════
            // STATUS LIGHTS (blinking)
            // ═══════════════════════════════════════════════════════════════════════
            const blinkRed = 0.5 + 0.5 * Math.sin(time * 4);
            const blinkGreen = 0.5 + 0.5 * Math.sin(time * 4 + Math.PI);

            // Red status light
            c.fillStyle = `rgba(255,80,80,${0.9 * blinkRed * alpha})`;
            c.beginPath();
            c.arc(-bodyW * 0.05, -bodyH * 0.05, s * 0.018, 0, Math.PI * 2);
            c.fill();
            // Red glow
            const redGlow = c.createRadialGradient(
                -bodyW * 0.05,
                -bodyH * 0.05,
                0,
                -bodyW * 0.05,
                -bodyH * 0.05,
                s * 0.05
            );
            redGlow.addColorStop(0, `rgba(255,100,100,${0.5 * blinkRed * alpha})`);
            redGlow.addColorStop(1, 'rgba(255,100,100,0)');
            c.fillStyle = redGlow;
            c.beginPath();
            c.arc(-bodyW * 0.05, -bodyH * 0.05, s * 0.05, 0, Math.PI * 2);
            c.fill();

            // Green status light
            c.fillStyle = `rgba(80,255,120,${0.9 * blinkGreen * alpha})`;
            c.beginPath();
            c.arc(bodyW * 0.05, bodyH * 0.08, s * 0.015, 0, Math.PI * 2);
            c.fill();
            const greenGlow = c.createRadialGradient(
                bodyW * 0.05,
                bodyH * 0.08,
                0,
                bodyW * 0.05,
                bodyH * 0.08,
                s * 0.04
            );
            greenGlow.addColorStop(0, `rgba(100,255,140,${0.4 * blinkGreen * alpha})`);
            greenGlow.addColorStop(1, 'rgba(100,255,140,0)');
            c.fillStyle = greenGlow;
            c.beginPath();
            c.arc(bodyW * 0.05, bodyH * 0.08, s * 0.04, 0, Math.PI * 2);
            c.fill();

            c.restore();
        };

        const noiseR = seededRand(7);

        // Fine surface grain - reduced count for cleaner look
        const noiseGrains = Array.from({ length: 900 }, () => ({
            lon: noiseR() * Math.PI * 2,
            lat: (noiseR() - 0.5) * Math.PI * 0.95,
            size: noiseR() * 0.9 + 0.2,
            brightness: noiseR() * 0.12 + 0.03,
            isDark: noiseR() > 0.5,
        }));

        // Lunar maria (dark "seas") - bigger and softer
        const mariaPatches = Array.from({ length: 18 }, () => ({
            lon: noiseR() * Math.PI * 2,
            lat: (noiseR() - 0.5) * Math.PI * 0.7,
            size: noiseR() * 0.3 + 0.18,
            darkness: noiseR() * 0.3 + 0.25,
            aspect: noiseR() * 0.5 + 0.6,
            angle: noiseR() * Math.PI,
        }));

        // Bright impact craters with ray systems
        const brightCraters = Array.from({ length: 4 }, () => ({
            lon: noiseR() * Math.PI * 2,
            lat: (noiseR() - 0.5) * Math.PI * 0.8,
            size: noiseR() * 0.04 + 0.025,
            rayCount: Math.floor(noiseR() * 5) + 9,
        }));

        // ── Realistic Moon / Planet (matches reference image) ───────────────────
        const drawPlanet = (cx: number, cy: number, r: number, alpha: number) => {
            if (alpha < 0.01) return;
            ctx.save();
            ctx.globalAlpha = alpha;

            // Outer purple atmosphere glow
            const atm = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.45);
            atm.addColorStop(0, 'rgba(140,90,230,0.28)');
            atm.addColorStop(0.4, 'rgba(80,30,170,0.14)');
            atm.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = atm;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.45, 0, Math.PI * 2);
            ctx.fill();

            // Clip to planet circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.clip();

            // Base sphere shading (bright top-left → dark bottom-right)
            const body = ctx.createRadialGradient(
                cx - r * 0.35,
                cy - r * 0.3,
                r * 0.05,
                cx + r * 0.15,
                cy + r * 0.2,
                r * 1.15
            );
            body.addColorStop(0, '#f5f5f7');
            body.addColorStop(0.15, '#e0e0e3');
            body.addColorStop(0.4, '#b8b8bd');
            body.addColorStop(0.7, '#6e6e75');
            body.addColorStop(1, '#2a2a30');
            ctx.fillStyle = body;
            ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

            // ── Project spherical surface features onto 2D disc ──
            const projectAndDraw = (
                lon: number,
                lat: number,
                fSize: number,
                darkness: number,
                isContinent: boolean
            ) => {
                const adjLon = lon + moonRot;
                const cosLat = Math.cos(lat);
                const x3 = cosLat * Math.sin(adjLon);
                const z3 = cosLat * Math.cos(adjLon);
                const y3 = Math.sin(lat);

                // Only draw if on the visible side (z3 > 0)
                if (z3 < 0.05) return;

                // Project to 2D
                const px = cx + x3 * r;
                const py = cy + y3 * r;

                // Foreshortening near edges
                const fore = Math.max(0.3, z3);
                const drawR = r * fSize * fore;

                if (isContinent) {
                    // Irregular landmass-like blob
                    const g = ctx.createRadialGradient(px, py, 0, px, py, drawR);
                    g.addColorStop(0, `rgba(60,60,68,${darkness * fore})`);
                    g.addColorStop(0.6, `rgba(80,80,88,${darkness * 0.6 * fore})`);
                    g.addColorStop(1, 'rgba(100,100,110,0)');
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.ellipse(
                        px,
                        py,
                        drawR,
                        drawR * (0.5 + ((lon * 13) % 1) * 0.6),
                        lon,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                } else {
                    // Crater: dark center + bright rim
                    const g = ctx.createRadialGradient(px, py, 0, px, py, drawR);
                    g.addColorStop(0, `rgba(40,40,48,${darkness * 1.2 * fore})`);
                    g.addColorStop(0.7, `rgba(70,70,78,${darkness * 0.5 * fore})`);
                    g.addColorStop(0.95, `rgba(220,220,225,${0.18 * fore})`);
                    g.addColorStop(1, 'rgba(180,180,190,0)');
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(px, py, drawR, 0, Math.PI * 2);
                    ctx.fill();
                }
            };

            // Draw large features (continents/craters)
            surfaceFeatures.forEach((f) => {
                projectAndDraw(f.lon, f.lat, f.size, f.darkness, f.type === 'continent');
            });

            // Draw small craters for texture detail
            smallCraters.forEach((f) => {
                projectAndDraw(f.lon, f.lat, f.size, f.darkness, false);
            });

            // Dark side terminator shadow
            const dark = ctx.createRadialGradient(
                cx + r * 0.55,
                cy + r * 0.35,
                r * 0.1,
                cx + r * 0.55,
                cy + r * 0.35,
                r * 1.3
            );
            dark.addColorStop(0, 'rgba(0,0,8,0.85)');
            dark.addColorStop(0.4, 'rgba(0,0,8,0.55)');
            dark.addColorStop(0.8, 'rgba(0,0,8,0.15)');
            dark.addColorStop(1, 'rgba(0,0,8,0)');
            ctx.fillStyle = dark;
            ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

            // Bright limb highlight on the lit side
            const litRim = ctx.createRadialGradient(
                cx - r * 0.45,
                cy - r * 0.4,
                r * 0.1,
                cx - r * 0.45,
                cy - r * 0.4,
                r * 0.8
            );
            litRim.addColorStop(0, 'rgba(255,255,255,0.18)');
            litRim.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = litRim;
            ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

            ctx.restore();

            // Outer rim purple glow (atmosphere edge)
            const rim = ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.1);
            rim.addColorStop(0, 'rgba(180,130,255,0.30)');
            rim.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = rim;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        // Keep drawGlobe identical to drawPlanet (so we don't morph to wireframe)
        const drawGlobe = drawPlanet;

        const frame = () => {
            const p = (smoothRef.current += (scrollRef.current - smoothRef.current) * 0.072);
            const rect = canvas.getBoundingClientRect();
            const W = rect.width;
            const H = rect.height;
            const isMob = W < 768;

            ctx.clearRect(0, 0, W, H);
            t += 0.016;
            moonRot += 0.0015; // slow moon rotation
            orbitAngle += 0.008; // satellite orbit speed

            ctx.fillStyle = '#07070f';
            ctx.fillRect(0, 0, W, H);

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

            for (const s of stars) {
                const a = s.a * (0.4 + 0.6 * Math.sin(t * s.sp * 55 + s.x * 10));
                ctx.beginPath();
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${a})`;
                ctx.fill();
            }

            const baseR = isMob ? Math.min(W, H) * 0.3 : Math.min(W, H) * 0.43;

            const hcx = W * 0.5;
            const hcy = isMob ? H * 0.92 : H - baseR * 0.3;
            const hgr = baseR;

            const scx = isMob ? W * 0.72 : W * 0.77;
            const scy = isMob ? H * 0.22 : H * 0.33;
            const sgr = baseR * (isMob ? 0.42 : 0.52);

            const ccx = isMob ? W * 0.2 : W * 0.21;
            const ccy = isMob ? H * 0.35 : H * 0.48;
            const cgr = baseR * (isMob ? 0.55 : 0.68);

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

            // Draw the realistic moon
            drawPlanet(gcx, gcy, gr, 1);

            const satAlpha = 1 - inv(p, 0.55, 0.75);
            if (satAlpha > 0.01) {
                const orbitR = gr * 1.15;

                const sx = gcx + Math.cos(orbitAngle) * orbitR;
                const sy = gcy + Math.sin(orbitAngle) * orbitR;

                const tangent = orbitAngle + Math.PI / 2;

                const sSize = gr * (isMob ? 0.15 : 0.14);
                drawSatellite(ctx, sx, sy, sSize, satAlpha, t, tangent);
            }

            const np: Phase = p < 0.4 ? 'hero' : p < 0.72 ? 'services' : 'contact';

            rafRef.current = requestAnimationFrame(frame);
        };

        rafRef.current = requestAnimationFrame(frame);
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
            ro.disconnect();
        };
    }, [canvasRef, btnRef, scrollRef, smoothRef, rafRef]);
}
