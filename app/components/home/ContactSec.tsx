'use client';
import { useEffect, useRef, useState } from 'react';
import { InputField } from '../common/InputField';
import { Lbl } from '../common/Lbl';
import { validateField } from '../../utils/validation';
import { CountryCode } from '../common/CountryCode';
import { getCountryCallingCode } from 'react-phone-number-input';
import { ToastMsgModal } from '../common/ToastMsgModal';

interface Props {
    phase: string;
    contactIn: boolean;
    mob: boolean;
    agreed: boolean;
    setAgreed: (v: boolean) => void;
}

export function ContactSec({ phase, contactIn, mob, agreed, setAgreed }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [failedModal, setFailedModal] = useState(false);
    const [country, setCountry] = useState('GB');
    const globeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        phone: `+${getCountryCallingCode(country as any)} `,
        agreed: false,
    });

    const [errors, setErrors] = useState<any>({});

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }));
    };

    // 🌐 Globe Canvas
    useEffect(() => {
        if (!contactIn) return;
        const canvas = globeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let raf = 0,
            rotation = 0;
        const size = mob ? 280 : 560;
        canvas.width = Math.floor(size * dpr);
        canvas.height = Math.floor(size * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const project = (x: number, y: number, z: number, cx: number, cy: number) => {
            const s = 500 / (500 + z);
            return { x: cx + x * s, y: cy + y * s };
        };

        const drawGlobe = () => {
            ctx.clearRect(0, 0, size, size);
            const cx = size / 2,
                cy = size / 2,
                radius = size * 0.42,
                tiltX = -0.35;

            // Latitudes
            for (let i = 1; i < 8; i++) {
                const lat = (i / 8) * Math.PI - Math.PI / 2;
                const rr = Math.cos(lat) * radius,
                    ry = Math.sin(lat) * radius;
                ctx.beginPath();
                for (let j = 0; j <= 80; j++) {
                    const a = (j / 80) * Math.PI * 2;
                    let x = Math.cos(a) * rr,
                        y = ry,
                        z = Math.sin(a) * rr;
                    const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
                    const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
                    const p = project(x, y2, z2, cx, cy);
                    if (j === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = 'rgba(180,130,255,0.4)';
                ctx.stroke();
            }

            // Longitudes
            for (let i = 0; i < 12; i++) {
                const lon = (i / 12) * Math.PI * 2 + rotation;
                ctx.beginPath();
                for (let j = 0; j <= 80; j++) {
                    const lat = (j / 80) * Math.PI - Math.PI / 2;
                    let x = Math.cos(lat) * Math.cos(lon) * radius;
                    let y = Math.sin(lat) * radius;
                    let z = Math.cos(lat) * Math.sin(lon) * radius;
                    const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
                    const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
                    const p = project(x, y2, z2, cx, cy);
                    if (j === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.lineWidth = 0.8;
                ctx.strokeStyle = 'rgba(170,110,255,0.45)';
                ctx.stroke();
            }

            // Outer ring
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(200,150,255,0.65)';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 18;
            ctx.shadowColor = 'rgba(140,80,240,0.7)';
            ctx.stroke();
            ctx.shadowBlur = 0;

            rotation += 0.003;
            raf = requestAnimationFrame(drawGlobe);
        };

        drawGlobe();
        return () => cancelAnimationFrame(raf);
    }, [contactIn, mob]);

    const handleSubmit = async () => {
        const newErrors: any = {};

        const rules = {
            name: { min: 2, max: 30 },
            surname: { min: 2, max: 30 },
            email: { min: 5, max: 50 },
            phone: { min: 8, max: 15 },
            agreed: {
                required: true,
            },
        };

        newErrors.name = validateField('Name', form.name, rules.name);

        newErrors.surname = validateField('Surname', form.surname, rules.surname);

        newErrors.email = validateField('E-mail', form.email, rules.email);

        newErrors.phone = validateField('Phone', form.phone, rules.phone);

        newErrors.agreed = validateField('Privacy Policy', form.agreed);

        Object.keys(newErrors).forEach((key) => {
            if (!newErrors[key]) delete newErrors[key];
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            setSubmitting(true);

            const res = await fetch('/api/contact', {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                setSuccessModal(true);

                setForm({
                    name: '',
                    surname: '',
                    email: '',
                    phone: `+${getCountryCallingCode(country as any)} `,
                    agreed: false,
                });
            } else {
                setFailedModal(true);
            }
        } catch (error) {
            setFailedModal(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
            @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
            @keyframes contactGlobeDrop {
                from {
                    opacity: 0;
                    transform: translate(-80px, -140px) scale(0.72) rotate(-0deg);
                }
                to {
                    opacity: 1;
                    transform: translate(0, 0) scale(1) rotate(-25deg);
                }
            }

            @keyframes riseUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes dropDown {
                from {
                    opacity: 0;
                    transform: translateY(-40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

        .submit-btn {
            background: linear-gradient(
                90deg,
                #a855f7 0%,
                #6366f1 50%,
                #3b82f6 100%
            );
            transition: background .3s ease, box-shadow .3s ease;
        }

        .submit-btn:hover {
            background: linear-gradient(
                90deg,
                #b565ff 0%,
                #7c7cff 50%,
                #4f9cff 100%
            );

            box-shadow:
                0 14px 40px rgba(99,102,241,.45),
                0 0 70px rgba(168,85,247,.3);
        }
        `}</style>

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                {/* 🌐 Globe — Top Left */}
                <div
                    style={{
                        position: 'absolute',
                        top: mob ? '-50px' : '-100px',
                        left: mob ? '-110px' : '-100px',
                        width: mob ? '300px' : '620px',
                        height: mob ? '300px' : '620px',
                        pointerEvents: 'none',
                        zIndex: 1,
                        opacity: contactIn ? 1 : 0,
                        animation: contactIn
                            ? 'contactGlobeDrop 1.15s cubic-bezier(.22,.68,0,1.2) both'
                            : 'none',
                    }}
                >
                    <canvas
                        ref={globeCanvasRef}
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                </div>

                {/* Form — Centered */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingTop: mob ? '60px' : '80px',
                        padding: mob ? '50px 18px 20px' : '70px 48px 80px',
                    }}
                >
                    <div
                        style={{
                            width: mob ? '100%' : '650px',
                            maxWidth: '100%',
                        }}
                    >
                        {/* ─── Heading texts (rise from bottom) ─── */}
                        <p
                            style={{
                                fontSize: mob ? '9.5px' : '11px',
                                color: 'rgba(255,255,255,0.36)',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                marginBottom: mob ? '8px' : '12px',
                                textAlign: 'center',
                                opacity: contactIn ? 1 : 0,
                                animation: contactIn
                                    ? 'riseUp 0.9s cubic-bezier(.16,1,.3,1) 0.3s both'
                                    : 'none',
                            }}
                        >
                            Get in touch
                        </p>

                        <h2
                            style={{
                                fontSize: mob
                                    ? 'clamp(16px, 4.5vw, 22px)'
                                    : 'clamp(20px, 2.6vw, 34px)',
                                fontWeight: 300,
                                color: '#fff',
                                lineHeight: 1.28,
                                letterSpacing: '-0.02em',
                                marginBottom: mob ? '18px' : '30px',
                                textAlign: 'center',
                                opacity: contactIn ? 1 : 0,
                                animation: contactIn
                                    ? 'riseUp 1s cubic-bezier(.16,1,.3,1) 0.45s both'
                                    : 'none',
                            }}
                        >
                            Your Partner in Law:
                            <br />
                            Reliable Legal Support for Your Business
                        </h2>

                        {/* ─── Form InputFields (drop from top) ─── */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: mob ? '14px' : '16px',
                            }}
                        >
                            {/* Row 1 */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
                                    gap: mob ? '12px' : '14px',
                                    opacity: contactIn ? 1 : 0,
                                    animation: contactIn
                                        ? 'dropDown 0.85s cubic-bezier(.16,1,.3,1) 0.65s both'
                                        : 'none',
                                }}
                            >
                                <InputField
                                    label="Name"
                                    placeholder="Your name"
                                    mob={mob}
                                    value={form.name}
                                    error={errors.name}
                                    onChange={(v) => updateField('name', v)}
                                />

                                <InputField
                                    label="Surname"
                                    placeholder="Your surname"
                                    mob={mob}
                                    value={form.surname}
                                    error={errors.surname}
                                    onChange={(v) => updateField('surname', v)}
                                />
                            </div>

                            {/* Row 2 */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
                                    gap: mob ? '12px' : '14px',
                                    opacity: contactIn ? 1 : 0,
                                    animation: contactIn
                                        ? 'dropDown 0.85s cubic-bezier(.16,1,.3,1) 0.78s both'
                                        : 'none',
                                }}
                            >
                                <InputField
                                    label="E-mail"
                                    placeholder="hello@example.com"
                                    type="email"
                                    mob={mob}
                                    value={form.email}
                                    error={errors.email}
                                    onChange={(v) => updateField('email', v)}
                                />

                                <div>
                                    <Lbl
                                        mob={mob}
                                        style={{
                                            fontSize: mob ? '9.5px' : '11px',
                                            fontWeight: 500,
                                            color: 'rgba(255,255,255,.55)',
                                        }}
                                    >
                                        Phone
                                    </Lbl>

                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '8px',
                                        }}
                                    >
                                        <CountryCode
                                            value={country}
                                            mob={mob}
                                            onChange={(newCountry) => {
                                                setCountry(newCountry);

                                                const code = `+${getCountryCallingCode(newCountry as any)} `;

                                                setForm((prev) => ({
                                                    ...prev,
                                                    phone: code,
                                                }));
                                            }}
                                        />

                                        <div
                                            style={{
                                                position: 'relative',
                                                flex: 1,
                                            }}
                                        >
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) => {
                                                    const code = `+${getCountryCallingCode(country as any)} `;

                                                    let value = e.target.value;

                                                    if (!value.startsWith(code)) {
                                                        value = code;
                                                    }

                                                    const number = value
                                                        .slice(code.length)
                                                        .replace(/\D/g, '');

                                                    setForm((prev) => ({
                                                        ...prev,
                                                        phone: code + number,
                                                    }));

                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        phone: '',
                                                    }));
                                                }}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255,255,255,.04)',
                                                    border: `1px solid ${
                                                        errors.phone
                                                            ? '#ff4d4d'
                                                            : 'rgba(255,255,255,.10)'
                                                    }`,
                                                    borderRadius: '8px',
                                                    padding: mob
                                                        ? '6px 35px 6px 10px'
                                                        : '9px 35px 9px 13px',
                                                    color: '#fff',
                                                    fontSize: mob ? '11px' : '12px',

                                                    outline: 'none',
                                                }}
                                            />

                                            {errors.phone && (
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        right: mob ? '10px' : '12px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        color: '#ff4d4d',
                                                        fontSize: mob ? '13px' : '15px',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    ⚠
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {errors.phone && (
                                        <p
                                            style={{
                                                color: '#ff4d4d',
                                                fontSize: '11px',
                                                marginTop: '5px',
                                            }}
                                        >
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Checkbox (drops down) */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    const value = !form.agreed;

                                    setForm((prev) => ({
                                        ...prev,
                                        agreed: value,
                                    }));

                                    setErrors((prev) => ({
                                        ...prev,
                                        agreed: '',
                                    }));
                                }}
                            >
                                <div
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        borderRadius: '4px',

                                        border: errors.agreed
                                            ? '1px solid #ff4d4d'
                                            : form.agreed
                                              ? '1px solid rgba(110,65,220,.8)'
                                              : '1px solid rgba(255,255,255,.28)',

                                        background: form.agreed
                                            ? 'rgba(90,40,210,.85)'
                                            : 'transparent',

                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {form.agreed && '✓'}
                                </div>

                                <span
                                    style={{
                                        fontSize: mob ? '11px' : '14px',
                                    }}
                                >
                                    I agree to the Privacy Policy
                                </span>
                            </div>

                            {errors.agreed && (
                                <p
                                    style={{
                                        color: '#ff4d4d',
                                        fontSize: '11px',
                                        marginTop: '5px',
                                    }}
                                >
                                    {errors.agreed}
                                </p>
                            )}

                            {/* Button (rises up) */}
                            <button
                                disabled={submitting}
                                onClick={handleSubmit}
                                className="submit-btn"
                                style={{
                                    width: '100%',
                                    padding: mob ? '12px' : '13px',
                                    border: '1px solid rgba(180,120,255,.4)',
                                    borderRadius: '9px',
                                    color: '#fff',
                                    fontSize: mob ? '12px' : '13px',
                                    fontWeight: 600,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.7 : 1,
                                    transition: '.3s',
                                    boxShadow:
                                        '0 10px 30px rgba(99,102,241,.35), 0 0 50px rgba(168,85,247,.2)',
                                }}
                            >
                                {submitting ? (
                                    <span
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: '14px',
                                                height: '14px',
                                                border: '2px solid rgba(255,255,255,.4)',
                                                borderTop: '2px solid #fff',
                                                borderRadius: '50%',
                                                animation: 'spin .8s linear infinite',
                                            }}
                                        />
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Request'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {successModal && (
                    <ToastMsgModal
                        open={successModal}
                        mob={mob}
                        type="success"
                        title="Request Sent Successfully"
                        message="Thank you for contacting us. Our legal team will contact you shortly."
                        onClose={() => setSuccessModal(false)}
                    />
                )}

                {failedModal && (
                    <ToastMsgModal
                        open={failedModal}
                        mob={mob}
                        type="error"
                        title="Something Went Wrong"
                        message="Your request could not be sent. Please try again later."
                        onClose={() => setFailedModal(false)}
                    />
                )}
            </div>
        </>
    );
}
