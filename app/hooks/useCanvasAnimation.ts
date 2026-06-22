// hooks/useCanvasAnimation.ts
import { useEffect, useRef, MutableRefObject } from 'react';
import * as THREE from 'three';

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

// ─── Three.js Scene Setup with Real Moon Texture ────────────────────────────
interface PlanetScene {
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.OrthographicCamera | null;
    planet: THREE.Mesh | null;
    dispose: () => void;
}

function createPlanetScene(): PlanetScene {
    try {
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(512, 512);
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.NoToneMapping;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        camera.position.z = 5;

        const textureLoader = new THREE.TextureLoader();

        const moonTextureUrl =
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg';

        const diffuseTex = textureLoader.load(moonTextureUrl);
        const bumpTex = textureLoader.load(moonTextureUrl);

        const geometry = new THREE.SphereGeometry(0.7, 196, 196);
        const material = new THREE.MeshStandardMaterial({
            map: diffuseTex,
            bumpMap: bumpTex,
            bumpScale: 0.04,
            roughness: 0.95,
            metalness: 0.0,
        });

        const planet = new THREE.Mesh(geometry, material);
        scene.add(planet);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
        keyLight.position.set(-2.5, 3.5, 4);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x8899aa, 0.2);
        fillLight.position.set(2, -1, 2);
        scene.add(fillLight);

        const ambient = new THREE.AmbientLight(0x050510, 0.3);
        scene.add(ambient);

        const dispose = () => {
            geometry.dispose();
            material.dispose();
            diffuseTex.dispose();
            bumpTex.dispose();
            renderer.dispose();
        };

        return { renderer, scene, camera, planet, dispose };
    } catch (error) {
        console.warn('WebGL initialization failed, falling back to 2D rendering:', error);
        return { renderer: null, scene: null, camera: null, planet: null, dispose: () => {} };
    }
}

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

        const planetScene = createPlanetScene();
        const {
            renderer: threeRenderer,
            scene: threeScene,
            camera: threeCamera,
            planet: planetMesh,
        } = planetScene;

        const hasWebGL = threeRenderer !== null && threeCamera !== null;

        if (hasWebGL && threeCamera) {
            const frustum = 0.75;
            threeCamera.left = -frustum;
            threeCamera.right = frustum;
            threeCamera.top = frustum;
            threeCamera.bottom = -frustum;
            threeCamera.updateProjectionMatrix();
        }

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

        let t = 0;
        let orbitAngle = 0;

        // ── Satellite (Unchanged) ──
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
            const halo = c.createRadialGradient(0, 0, 0, 0, 0, s * 1.4);
            halo.addColorStop(0, `rgba(160,190,240,${0.12 * alpha})`);
            halo.addColorStop(0.5, `rgba(100,130,200,${0.05 * alpha})`);
            halo.addColorStop(1, 'rgba(0,0,0,0)');
            c.fillStyle = halo;
            c.beginPath();
            c.arc(0, 0, s * 1.4, 0, Math.PI * 2);
            c.fill();

            const panelW = s * 1.05,
                panelH = s * 0.38,
                armLen = s * 0.1;
            const drawPanel = (dir: 1 | -1) => {
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
                c.fillStyle = 'rgba(70,75,90,0.95)';
                c.fillRect(px - 1, py - 1, panelW + 2, panelH + 2);
                const panelGrad = c.createLinearGradient(px, py, px, py + panelH);
                panelGrad.addColorStop(0, 'rgba(25,40,90,1)');
                panelGrad.addColorStop(0.3, 'rgba(40,65,135,1)');
                panelGrad.addColorStop(0.5, 'rgba(55,85,160,1)');
                panelGrad.addColorStop(0.7, 'rgba(40,65,135,1)');
                panelGrad.addColorStop(1, 'rgba(20,35,80,1)');
                c.fillStyle = panelGrad;
                c.fillRect(px, py, panelW, panelH);

                const cols = 10,
                    rows = 3,
                    cellW = panelW / cols,
                    cellH = panelH / rows;
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cx2 = px + col * cellW,
                            cy2 = py + row * cellH;
                        const cellGrad = c.createLinearGradient(cx2, cy2, cx2 + cellW, cy2 + cellH);
                        cellGrad.addColorStop(0, 'rgba(80,120,200,0.25)');
                        cellGrad.addColorStop(0.5, 'rgba(120,160,230,0.15)');
                        cellGrad.addColorStop(1, 'rgba(30,50,110,0.3)');
                        c.fillStyle = cellGrad;
                        c.fillRect(cx2 + 0.5, cy2 + 0.5, cellW - 1, cellH - 1);
                        c.fillStyle = 'rgba(200,210,230,0.5)';
                        c.fillRect(cx2 + 1, cy2 + 1, 0.8, 0.8);
                        c.fillRect(cx2 + cellW - 2, cy2 + cellH - 2, 0.8, 0.8);
                    }
                }
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
                c.strokeStyle = 'rgba(200,210,225,0.85)';
                c.lineWidth = 0.9;
                c.strokeRect(px, py, panelW, panelH);
                c.strokeStyle = 'rgba(0,0,0,0.4)';
                c.lineWidth = 0.5;
                c.beginPath();
                c.moveTo(px, py + panelH);
                c.lineTo(px + panelW, py + panelH);
                c.stroke();
            };
            drawPanel(-1);
            drawPanel(1);

            const bodyW = s * 0.4,
                bodyH = s * 0.3;
            c.fillStyle = 'rgba(0,0,0,0.35)';
            c.beginPath();
            c.ellipse(0, bodyH * 0.55, bodyW * 0.55, bodyH * 0.12, 0, 0, Math.PI * 2);
            c.fill();
            const bodyGrad = c.createLinearGradient(0, -bodyH / 2, 0, bodyH / 2);
            bodyGrad.addColorStop(0, 'rgba(255,215,130,0.98)');
            bodyGrad.addColorStop(0.25, 'rgba(230,180,90,1)');
            bodyGrad.addColorStop(0.5, 'rgba(200,150,60,1)');
            bodyGrad.addColorStop(0.75, 'rgba(160,115,40,1)');
            bodyGrad.addColorStop(1, 'rgba(100,70,25,0.95)');
            c.fillStyle = bodyGrad;
            c.beginPath();
            (c as any).roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, bodyH * 0.28);
            c.fill();
            c.strokeStyle = 'rgba(120,80,20,0.4)';
            c.lineWidth = 0.4;
            for (let i = 1; i < 8; i++) {
                const yy = -bodyH / 2 + (bodyH / 8) * i;
                c.beginPath();
                c.moveTo(-bodyW / 2 + 2, yy);
                c.lineTo(bodyW / 2 - 2, yy);
                c.stroke();
            }
            const foilSheen = c.createLinearGradient(-bodyW / 2, -bodyH / 2, bodyW / 2, bodyH / 2);
            foilSheen.addColorStop(0, 'rgba(255,240,200,0.25)');
            foilSheen.addColorStop(0.5, 'rgba(255,255,255,0)');
            foilSheen.addColorStop(1, 'rgba(0,0,0,0.15)');
            c.fillStyle = foilSheen;
            c.beginPath();
            (c as any).roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, bodyH * 0.28);
            c.fill();
            c.strokeStyle = 'rgba(80,55,20,0.85)';
            c.lineWidth = 0.9;
            c.beginPath();
            (c as any).roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, bodyH * 0.28);
            c.stroke();
            c.fillStyle = 'rgba(70,50,15,0.55)';
            c.fillRect(-bodyW * 0.03, -bodyH / 2 + 1, bodyW * 0.06, bodyH - 2);
            c.fillStyle = 'rgba(230,235,245,0.95)';
            c.fillRect(-bodyW * 0.32, -bodyH * 0.15, bodyW * 0.18, bodyH * 0.3);
            c.strokeStyle = 'rgba(100,110,130,0.8)';
            c.lineWidth = 0.5;
            c.strokeRect(-bodyW * 0.32, -bodyH * 0.15, bodyW * 0.18, bodyH * 0.3);
            c.fillStyle = 'rgba(40,50,70,0.9)';
            c.fillRect(-bodyW * 0.29, -bodyH * 0.1, bodyW * 0.12, bodyH * 0.08);
            c.fillStyle = 'rgba(30,35,45,0.9)';
            c.fillRect(bodyW * 0.12, -bodyH * 0.2, bodyW * 0.2, bodyH * 0.4);
            c.strokeStyle = 'rgba(80,90,110,0.6)';
            c.lineWidth = 0.4;
            for (let i = 1; i < 6; i++) {
                const xx = bodyW * 0.12 + ((bodyW * 0.2) / 6) * i;
                c.beginPath();
                c.moveTo(xx, -bodyH * 0.2);
                c.lineTo(xx, bodyH * 0.2);
                c.stroke();
            }

            const noseW = s * 0.16,
                noseH = s * 0.2,
                noseX = bodyW / 2 - 1;
            const noseGrad = c.createLinearGradient(noseX, -noseH / 2, noseX, noseH / 2);
            noseGrad.addColorStop(0, 'rgba(240,245,252,1)');
            noseGrad.addColorStop(0.5, 'rgba(210,218,232,1)');
            noseGrad.addColorStop(1, 'rgba(140,150,170,0.95)');
            c.fillStyle = noseGrad;
            c.beginPath();
            (c as any).roundRect(noseX, -noseH / 2, noseW, noseH, noseH * 0.3);
            c.fill();
            c.strokeStyle = 'rgba(90,100,120,0.85)';
            c.lineWidth = 0.7;
            c.stroke();
            c.fillStyle = 'rgba(100,110,130,0.7)';
            c.fillRect(noseX + noseW * 0.7, -noseH / 2, noseW * 0.08, noseH);
            c.fillStyle = 'rgba(60,70,90,0.95)';
            c.beginPath();
            c.arc(noseX + noseW, 0, noseH * 0.18, 0, Math.PI * 2);
            c.fill();
            c.strokeStyle = 'rgba(180,190,210,0.8)';
            c.lineWidth = 0.6;
            c.stroke();
            c.fillStyle = 'rgba(20,25,35,1)';
            c.beginPath();
            c.arc(noseX + noseW, 0, noseH * 0.1, 0, Math.PI * 2);
            c.fill();

            const engineW = s * 0.1,
                engineX = -bodyW / 2;
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
            c.fillStyle = 'rgba(20,25,35,1)';
            c.fillRect(engineX - engineW - 2, -bodyH * 0.15, 3, bodyH * 0.3);
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

            const dishX = bodyW * 0.05,
                dishY = -bodyH / 2 - s * 0.05,
                dishR = s * 0.08;
            c.strokeStyle = 'rgba(160,170,190,0.9)';
            c.lineWidth = 1.2;
            c.beginPath();
            c.moveTo(dishX, -bodyH / 2);
            c.lineTo(dishX, dishY);
            c.stroke();
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
            c.fillStyle = 'rgba(60,65,80,0.95)';
            c.beginPath();
            c.arc(dishX, dishY, dishR * 0.15, 0, Math.PI * 2);
            c.fill();

            c.strokeStyle = 'rgba(190,200,220,0.85)';
            c.lineWidth = 0.8;
            c.beginPath();
            c.moveTo(-bodyW * 0.15, bodyH / 2);
            c.lineTo(-bodyW * 0.15, bodyH / 2 + s * 0.1);
            c.moveTo(bodyW * 0.18, bodyH / 2);
            c.lineTo(bodyW * 0.18, bodyH / 2 + s * 0.08);
            c.stroke();
            c.fillStyle = 'rgba(230,235,245,0.95)';
            c.beginPath();
            c.arc(-bodyW * 0.15, bodyH / 2 + s * 0.1, s * 0.012, 0, Math.PI * 2);
            c.arc(bodyW * 0.18, bodyH / 2 + s * 0.08, s * 0.012, 0, Math.PI * 2);
            c.fill();

            const blinkRed = 0.5 + 0.5 * Math.sin(time * 4),
                blinkGreen = 0.5 + 0.5 * Math.sin(time * 4 + Math.PI);
            c.fillStyle = `rgba(255,80,80,${0.9 * blinkRed * alpha})`;
            c.beginPath();
            c.arc(-bodyW * 0.05, -bodyH * 0.05, s * 0.018, 0, Math.PI * 2);
            c.fill();
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

        const drawAtmosphericGlow = (cx: number, cy: number, r: number) => {
            ctx.save();
            const limb = ctx.createRadialGradient(cx, cy, r * 0.97, cx, cy, r * 1.12);
            limb.addColorStop(0, 'rgba(255,255,255,0.6)');
            limb.addColorStop(0.3, 'rgba(220,230,255,0.25)');
            limb.addColorStop(0.7, 'rgba(180,200,255,0.08)');
            limb.addColorStop(1, 'rgba(150,170,255,0)');
            ctx.fillStyle = limb;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
            ctx.fill();

            const outer = ctx.createRadialGradient(cx, cy, r * 1.05, cx, cy, r * 1.4);
            outer.addColorStop(0, 'rgba(200,210,255,0.12)');
            outer.addColorStop(1, 'rgba(150,170,255,0)');
            ctx.fillStyle = outer;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        const drawFallbackPlanet = (cx: number, cy: number, r: number) => {
            ctx.save();
            const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r);
            grad.addColorStop(0, 'rgba(200,180,140,0.8)');
            grad.addColorStop(0.5, 'rgba(150,130,90,0.95)');
            grad.addColorStop(1, 'rgba(60,50,30,1)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        };

        const renderPlanetToCanvas = (gcx: number, gcy: number, gr: number) => {
            if (!hasWebGL || !threeRenderer || !threeCamera || !planetMesh) {
                drawFallbackPlanet(gcx, gcy, gr);
                return;
            }

            const renderSize = 512;
            const margin = 1.15;
            threeRenderer.setSize(renderSize, renderSize);
            const frustum = 0.72 * margin;
            threeCamera.left = -frustum;
            threeCamera.right = frustum;
            threeCamera.top = frustum;
            threeCamera.bottom = -frustum;
            threeCamera.updateProjectionMatrix();

            planetMesh.rotation.y += 0.0008;
            planetMesh.rotation.x = 0.18;

            threeRenderer.render(threeScene, threeCamera);

            const dx = gcx - gr * margin;
            const dy = gcy - gr * margin;
            const dSize = gr * 2 * margin;
            ctx.drawImage(threeRenderer.domElement, dx, dy, dSize, dSize);
        };

        const frame = () => {
            const p = (smoothRef.current += (scrollRef.current - smoothRef.current) * 0.072);
            const rect = canvas.getBoundingClientRect();
            const W = rect.width;
            const H = rect.height;
            const isMob = W < 768;

            ctx.clearRect(0, 0, W, H);
            t += 0.016;
            orbitAngle += 0.004;

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
            const hcx = W * 0.5,
                hcy = isMob ? H * 0.95 : H - baseR * 0.2,
                hgr = baseR;
            const scx = isMob ? W * 0.72 : W * 0.77,
                scy = isMob ? H * 0.22 : H * 0.33,
                sgr = baseR * (isMob ? 0.42 : 0.52);
            const ccx = isMob ? W * 0.2 : W * 0.21,
                ccy = isMob ? H * 0.35 : H * 0.48,
                cgr = baseR * (isMob ? 0.55 : 0.68);

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

            drawAtmosphericGlow(gcx, gcy, gr);
            renderPlanetToCanvas(gcx, gcy, gr);

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
            planetScene.dispose();
        };
    }, [canvasRef, btnRef, scrollRef, smoothRef, rafRef]);
}
