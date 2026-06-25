// components/home/sections/ContactSec.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { getCountryCallingCode } from 'react-phone-number-input';
import { CountryCode } from '../../common/CountryCode';
import { SectionHeading } from '../../common/SectionHeading';
import { ToastMsgModal } from '../../common/ToastMsgModal';
import { siteConfig } from '../../../config/site';

interface Props {
    phase: string;
    contactIn: boolean;
    mob: boolean;
    agreed: boolean;
    setAgreed: (v: boolean) => void;
}

type RequestType = 'complaint' | 'query';
type ContactMethod = 'mobile' | 'email' | 'whatsapp';

export function ContactSec({ contactIn, mob }: Props) {
    const supportEmail = siteConfig?.supportEmail;
    const [submitting, setSubmitting] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [failedModal, setFailedModal] = useState(false);
    const [country, setCountry] = useState('GB');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const globeCanvasRef = useRef<HTMLCanvasElement>(null);

    const [requestType, setRequestType] = useState<RequestType>('complaint');
    const [contactMethod, setContactMethod] = useState<ContactMethod>('mobile');
    const [methodOpen, setMethodOpen] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [dragOver, setDragOver] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: `+${getCountryCallingCode(country as any)} `,

        description: '',
    });

    const [errors, setErrors] = useState<any>({});

    const updateField = (field: string, value: string) => {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p: any) => ({ ...p, [field]: '' }));
    };

    const handleFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const arr = Array.from(incoming).slice(0, 5 - files.length);
        setFiles((p) => [...p, ...arr].slice(0, 5));
    };

    const removeFile = (idx: number) => {
        setFiles((p) => p.filter((_, i) => i !== idx));
    };

    // 🌐 Globe Canvas (same as before)
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

        if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        if (!form.phone.replace(/\D/g, '').slice(2)) newErrors.phone = 'Phone is required';

        if (!form.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            setSubmitting(true);

            const formData = new FormData();

            formData.append('fullName', form.fullName);
            formData.append('email', form.email);
            formData.append('phone', form.phone);
            formData.append('description', form.description);
            formData.append('requestType', requestType);
            formData.append('contactMethod', contactMethod);

            // multiple files
            files.forEach((file) => {
                formData.append('attachments', file);
            });

            const res = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setSuccessModal(true);

                setForm({
                    fullName: '',
                    email: '',
                    phone: `+${getCountryCallingCode(country as any)} `,
                    description: '',
                });

                setFiles([]);
            } else {
                setFailedModal(true);
            }
        } catch (error) {
            setFailedModal(true);
        } finally {
            setSubmitting(false);
        }
    };

    const heartIcon = (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#ec4899"
            stroke="#ec4899"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );

    const contactMethodOptions: { value: ContactMethod; label: string }[] = [
        { value: 'mobile', label: 'Mobile' },
        { value: 'email', label: 'Email' },
        { value: 'whatsapp', label: 'WhatsApp' },
    ];

    const fileTypeChips = [
        { ext: 'JPG', color: '#22c55e' },
        { ext: 'PNG', color: '#3b82f6' },
        { ext: 'MP4', color: '#ec4899' },
        { ext: 'PDF', color: '#ef4444' },
        { ext: 'DOC', color: '#3b82f6' },
    ];

    return (
        <>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes cFlyLeft { from { opacity:0; translate:-80px 0; } to { opacity:1; translate:0 0; } }
                @keyframes cFlyRight { from { opacity:0; translate:80px 0; } to { opacity:1; translate:0 0; } }
                @keyframes cFlyBottom { from { opacity:0; translate:0 60px; } to { opacity:1; translate:0 0; } }
                @keyframes cFadeIn { from { opacity:0; } to { opacity:1; } }

                @keyframes contactGlobeDrop {
                    from {
                        opacity: 0;
                        transform: translate(-80px, -140px) scale(0.72) rotate(0deg);
                    }
                    to {
                        opacity: 1;
                        transform: translate(0, 0) scale(1) rotate(-25deg);
                    }
                }

                .c-input { transition: border-color 0.25s ease, background 0.25s ease; }
                .c-input:focus-within {
                    border-color: rgba(168,85,247,0.7) !important;
                    background: rgba(168,85,247,0.04) !important;
                }
                .c-tab { transition: all 0.3s ease; }
                .c-tab:hover { background: rgba(168,85,247,0.1) !important; }
                .c-method-dropdown { transition: all 0.3s ease; }
                .c-method-dropdown:hover { border-color: rgba(168,85,247,0.5) !important; }


                .hero-cta-btn {
    background: linear-gradient(
        90deg,
        #a855f7 0%,
        #6366f1 50%,
        #3b82f6 100%
    );
    color: #fff;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    box-shadow:
        0 10px 30px rgba(99,102,241,.4),
        0 0 60px rgba(168,85,247,.25);

    transition: all .3s ease;
}
                .hero-cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 14px 40px rgba(99,102,241,.55),
                        0 0 80px rgba(168,85,247,.35);
                }



                .c-info-card { transition: transform 0.3s ease, border-color 0.3s ease; }
                .c-info-card:hover {
                    transform: translateY(-2px);
                    border-color: rgba(168,85,247,0.5) !important;
                }
                .c-file-chip { transition: transform 0.2s ease; }
                .c-file-chip:hover { transform: translateY(-2px); }

                  .c-submit-btn {
        transition: all .3s ease;
    }

    .c-submit-btn:hover:not(:disabled) {
        background: linear-gradient(
            90deg,
            #b565ff 0%,
            #7c7cff 50%,
            #4f9cff 100%
        ) !important;

        box-shadow:
            0 14px 40px rgba(99,102,241,.55),
            0 0 80px rgba(168,85,247,.35) !important;
    }
            `}</style>

            <section
                style={{
                    width: '100%',
                    position: 'relative',
                    padding: mob ? '24px 16px 40px' : '40px 60px 60px',
                    opacity: contactIn ? 1 : 0,
                    transition: 'opacity 0.01s',
                    overflow: 'hidden',
                }}
            >
                {/* 🌐 Globe — Top Left (behind content) */}
                <div
                    style={{
                        position: 'absolute',
                        top: mob ? '-60px' : '-120px',
                        left: mob ? '-110px' : '-140px',
                        width: mob ? '300px' : '620px',
                        height: mob ? '300px' : '620px',
                        pointerEvents: 'none',
                        zIndex: 0,
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

                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: mob ? '24px' : '36px',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    {/* ─── Heading ─── */}
                    <SectionHeading
                        badge="WE CARE ABOUT YOU"
                        badgeIcon={heartIcon}
                        title="Complaints & Queries"
                        highlight="Queries"
                        subtitle="Have a concern, complaint, or general question? Our support team is here to help. Submit your request below and we will respond within 3 working days."
                        mob={mob}
                        cardsIn={contactIn}
                    />

                    {/* ─── 2-Column Layout ─── */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: mob ? '1fr' : '300px 1fr',
                            gap: mob ? '20px' : '24px',
                        }}
                    >
                        {/* ═══ LEFT SIDEBAR ═══ */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                opacity: contactIn ? 1 : 0,
                                animation: contactIn
                                    ? 'cFlyLeft 0.9s cubic-bezier(.16,1,.3,1) 0.45s both'
                                    : 'none',
                            }}
                        >
                            {/* Main intro card */}
                            <div
                                style={{
                                    background:
                                        'linear-gradient(180deg, rgba(30,15,60,0.5), rgba(15,10,30,0.6))',
                                    border: '1px solid rgba(105,62,205,0.3)',
                                    borderRadius: '16px',
                                    padding: mob ? '20px' : '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    gap: '12px',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background:
                                            'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(168,85,247,0.1))',
                                        border: '1px solid rgba(168,85,247,0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 20px rgba(168,85,247,0.3)',
                                    }}
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#c084fc"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <h4
                                    style={{
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#fff',
                                        margin: 0,
                                    }}
                                >
                                    We're Here to Help
                                </h4>
                                <p
                                    style={{
                                        fontSize: '12px',
                                        color: 'rgba(255,255,255,0.6)',
                                        lineHeight: 1.6,
                                        margin: 0,
                                    }}
                                >
                                    Your satisfaction is our priority. We ensure every request is
                                    handled with care and responded within{' '}
                                    <span style={{ color: '#60a5fa', fontWeight: 600 }}>
                                        3 working days.
                                    </span>
                                </p>
                            </div>

                            {/* Info cards */}
                            {[
                                {
                                    title: 'Secure & Confidential',
                                    desc: 'Your information is safe with us. We never share your data.',
                                    color: '#a855f7',
                                    icon: (
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    ),
                                },
                                {
                                    title: 'Quick Response',
                                    desc: 'We aim to respond to all complaints and queries within 3 working days.',
                                    color: '#3b82f6',
                                    icon: (
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    ),
                                },
                                {
                                    title: supportEmail,
                                    desc: "We'll reply to this email.",
                                    color: '#ec4899',
                                    icon: (
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    ),
                                },
                            ].map((c, i) => (
                                <div
                                    key={i}
                                    className="c-info-card"
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'flex-start',
                                        background: 'rgba(15,10,30,0.5)',
                                        border: '1px solid rgba(105,62,205,0.25)',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        backdropFilter: 'blur(8px)',
                                        WebkitBackdropFilter: 'blur(8px)',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            background: `${c.color}1A`,
                                            border: `1px solid ${c.color}55`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: c.color,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {c.icon}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '3px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: '#fff',
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {c.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '11px',
                                                color: 'rgba(255,255,255,0.55)',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {c.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ═══ RIGHT FORM ═══ */}
                        <div
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(20,15,40,0.75), rgba(10,5,22,0.85))',
                                border: '1px solid rgba(105,62,205,0.3)',
                                borderRadius: '20px',
                                padding: mob ? '20px' : '28px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                opacity: contactIn ? 1 : 0,
                                animation: contactIn
                                    ? 'cFlyRight 0.9s cubic-bezier(.16,1,.3,1) 0.6s both'
                                    : 'none',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                            }}
                        >
                            {/* 1. Request Type */}
                            <div>
                                <FieldLabel n="1" label="Request Type" required mob={mob} />
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0',
                                        background: 'rgba(15,10,30,0.6)',
                                        border: '1px solid rgba(105,62,205,0.25)',
                                        borderRadius: '10px',
                                        padding: '4px',
                                        marginTop: '8px',
                                    }}
                                >
                                    {(['complaint', 'query'] as RequestType[]).map((rt) => {
                                        const isActive = requestType === rt;
                                        return (
                                            <button
                                                key={rt}
                                                onClick={() => setRequestType(rt)}
                                                className="c-tab"
                                                style={{
                                                    padding: mob ? '8px' : '10px',
                                                    border: isActive
                                                        ? '1px solid rgba(168,85,247,0.6)'
                                                        : '1px solid transparent',
                                                    borderRadius: '8px',
                                                    background: isActive
                                                        ? 'linear-gradient(180deg, rgba(168,85,247,0.25), rgba(99,102,241,0.15))'
                                                        : 'transparent',
                                                    color: isActive
                                                        ? '#fff'
                                                        : 'rgba(255,255,255,0.6)',
                                                    fontSize: mob ? '12px' : '13px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    boxShadow: isActive
                                                        ? '0 0 20px rgba(168,85,247,0.2)'
                                                        : 'none',
                                                }}
                                            >
                                                {rt === 'complaint' ? (
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="12" y1="8" x2="12" y2="12" />
                                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                                    </svg>
                                                )}
                                                {rt === 'complaint' ? 'Complaint' : 'Query'}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2, 3, 4 Row */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: mob ? '1fr' : '1fr 1fr 1fr',
                                    gap: '14px',
                                }}
                            >
                                <FormField
                                    n="2"
                                    label="Full Name"
                                    required
                                    mob={mob}
                                    icon={
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    }
                                    placeholder="Enter your full name"
                                    value={form.fullName}
                                    error={errors.fullName}
                                    onChange={(v) => updateField('fullName', v)}
                                />
                                <FormField
                                    n="3"
                                    label="Email Address"
                                    required
                                    mob={mob}
                                    type="email"
                                    icon={
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    }
                                    placeholder="Enter your email address"
                                    value={form.email}
                                    error={errors.email}
                                    onChange={(v) => updateField('email', v)}
                                />
                                {/* Preferred Contact Method dropdown */}
                                <div>
                                    <FieldLabel
                                        n="4"
                                        label="Preferred Contact Method"
                                        required
                                        mob={mob}
                                    />
                                    <div style={{ position: 'relative', marginTop: '8px' }}>
                                        <button
                                            onClick={() => setMethodOpen((p) => !p)}
                                            className="c-method-dropdown"
                                            style={{
                                                width: '100%',
                                                background: 'rgba(15,10,30,0.6)',
                                                border: '1px solid rgba(105,62,205,0.3)',
                                                borderRadius: '8px',
                                                padding: mob ? '8px 10px' : '10px 12px',
                                                color: '#fff',
                                                fontSize: mob ? '12px' : '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                                {
                                                    contactMethodOptions.find(
                                                        (o) => o.value === contactMethod
                                                    )?.label
                                                }
                                            </span>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                style={{
                                                    transform: methodOpen
                                                        ? 'rotate(180deg)'
                                                        : 'rotate(0)',
                                                    transition: 'transform 0.25s',
                                                }}
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>
                                        {methodOpen && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 'calc(100% + 4px)',
                                                    left: 0,
                                                    right: 0,
                                                    background: 'rgba(20,15,40,0.95)',
                                                    border: '1px solid rgba(105,62,205,0.4)',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    zIndex: 10,
                                                    backdropFilter: 'blur(10px)',
                                                }}
                                            >
                                                {contactMethodOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => {
                                                            setContactMethod(opt.value);
                                                            setMethodOpen(false);
                                                        }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px 12px',
                                                            background:
                                                                contactMethod === opt.value
                                                                    ? 'rgba(168,85,247,0.2)'
                                                                    : 'transparent',
                                                            border: 'none',
                                                            color: '#fff',
                                                            fontSize: mob ? '12px' : '13px',
                                                            textAlign: 'left',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Phone (country code + number) */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '110px 1fr',
                                    gap: '8px',
                                }}
                            >
                                <CountryCode
                                    value={country}
                                    mob={mob}
                                    onChange={(nc) => {
                                        setCountry(nc);
                                        const code = `+${getCountryCallingCode(nc as any)} `;
                                        setForm((p) => ({ ...p, phone: code }));
                                    }}
                                />
                                <div
                                    className="c-input"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(15,10,30,0.6)',
                                        border: errors.phone
                                            ? '1px solid #ff4d4d'
                                            : '1px solid rgba(105,62,205,0.3)',
                                        borderRadius: '8px',
                                        padding: mob ? '8px 10px' : '10px 12px',
                                    }}
                                >
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.5)"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => {
                                            const code = `+${getCountryCallingCode(country as any)} `;
                                            let v = e.target.value;
                                            if (!v.startsWith(code)) v = code;
                                            const number = v.slice(code.length).replace(/\D/g, '');
                                            setForm((p) => ({ ...p, phone: code + number }));
                                            setErrors((p: any) => ({ ...p, phone: '' }));
                                        }}
                                        placeholder="Enter your mobile number"
                                        style={{
                                            flex: 1,
                                            background: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            color: '#fff',
                                            fontSize: mob ? '12px' : '13px',
                                        }}
                                    />
                                </div>
                                {errors.phone && (
                                    <p
                                        style={{
                                            color: '#ff4d4d',
                                            fontSize: '11px',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* 5 + 6 highlighted bordered box */}
                            <div
                                style={{
                                    border: '1px solid rgba(168,85,247,0.35)',
                                    borderRadius: '14px',
                                    padding: mob ? '14px' : '18px',
                                    display: 'grid',
                                    gridTemplateColumns: mob ? '1fr' : '1fr 1.6fr',
                                    gap: '14px',
                                    background:
                                        'linear-gradient(180deg, rgba(168,85,247,0.05), rgba(15,10,30,0.4))',
                                }}
                            >
                                <div
                                    style={{
                                        gridColumn: '1 / -1',
                                    }}
                                >
                                    <FieldLabel
                                        n="6"
                                        label={requestType === 'complaint' ? 'Complaint Description' : 'Query Description'}
                                        required
                                        mob={mob}
                                        labelIconColor="#c084fc"
                                    />
                                    <div
                                        className="c-input"
                                        style={{
                                            display: 'flex',
                                            gap: '8px',
                                            background: 'rgba(15,10,30,0.6)',
                                            border: errors.description
                                                ? '1px solid #ff4d4d'
                                                : '1px solid rgba(105,62,205,0.3)',
                                            borderRadius: '8px',
                                            padding: mob ? '8px 10px' : '10px 12px',
                                            marginTop: '8px',
                                        }}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.5)"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ marginTop: '4px', flexShrink: 0 }}
                                        >
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <line x1="3" y1="12" x2="21" y2="12" />
                                            <line x1="3" y1="18" x2="15" y2="18" />
                                        </svg>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) =>
                                                updateField('description', e.target.value)
                                            }
                                            placeholder={requestType === 'complaint' ? 'Please provide detailed information regarding your complaint.' : 'Please provide detailed information regarding your query.'}
                                            rows={2}
                                            style={{
                                                flex: 1,
                                                background: 'transparent',
                                                border: 'none',
                                                outline: 'none',
                                                color: '#fff',
                                                fontSize: mob ? '12px' : '13px',
                                                resize: 'vertical',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                    </div>

                                    {errors.description && (
                                        <p
                                            style={{
                                                color: '#ff4d4d',
                                                fontSize: '11px',
                                                marginTop: '4px',
                                            }}
                                        >
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 7. Attachments */}
                            <div>
                                <FieldLabel n="7" label="Attachments" optional mob={mob} />
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setDragOver(true);
                                    }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setDragOver(false);
                                        handleFiles(e.dataTransfer.files);
                                    }}
                                    style={{
                                        marginTop: '8px',
                                        border: dragOver
                                            ? '1.5px dashed rgba(168,85,247,0.7)'
                                            : '1.5px dashed rgba(105,62,205,0.4)',
                                        background: dragOver
                                            ? 'rgba(168,85,247,0.08)'
                                            : 'rgba(15,10,30,0.4)',
                                        borderRadius: '12px',
                                        padding: mob ? '14px' : '18px',
                                        display: 'flex',
                                        flexDirection: mob ? 'column' : 'row',
                                        alignItems: 'center',
                                        gap: '14px',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.25s ease',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            flex: 1,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'rgba(168,85,247,0.15)',
                                                border: '1px solid rgba(168,85,247,0.35)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#c084fc',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: mob ? '12px' : '13px',
                                                    color: 'rgba(255,255,255,0.85)',
                                                }}
                                            >
                                                Drag & drop files here or{' '}
                                                <span
                                                    onClick={() => fileInputRef.current?.click()}
                                                    style={{
                                                        color: '#60a5fa',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline',
                                                    }}
                                                >
                                                    click to browse
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '11px',
                                                    color: 'rgba(255,255,255,0.5)',
                                                    marginTop: '3px',
                                                }}
                                            >
                                                Max 5 files • Max total size 24 MB
                                                <br />
                                                Supported: JPG, PNG, WEBP, MP4, MOV, PDF, DOC, DOCX
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            hidden
                                            onChange={(e) => handleFiles(e.target.files)}
                                        />
                                    </div>

                                    {/* File type chips */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: mob ? 'center' : 'flex-end',
                                            gap: '6px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '6px',
                                                flexWrap: 'wrap',
                                                justifyContent: mob ? 'center' : 'flex-end',
                                            }}
                                        >
                                            {fileTypeChips.map((c, i) => (
                                                <div
                                                    key={i}
                                                    className="c-file-chip"
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        background: `${c.color}22`,
                                                        border: `1px solid ${c.color}55`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '9px',
                                                        fontWeight: 700,
                                                        color: c.color,
                                                    }}
                                                >
                                                    {c.ext}
                                                </div>
                                            ))}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '10px',
                                                color: 'rgba(255,255,255,0.5)',
                                            }}
                                        >
                                            +5 Files Max
                                        </div>
                                    </div>
                                </div>

                                {/* Uploaded file list */}
                                {files.length > 0 && (
                                    <div
                                        style={{
                                            marginTop: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '6px',
                                        }}
                                    >
                                        {files.map((f, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '6px 10px',
                                                    background: 'rgba(168,85,247,0.08)',
                                                    border: '1px solid rgba(168,85,247,0.25)',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    color: '#fff',
                                                }}
                                            >
                                                <span>{f.name}</span>
                                                <button
                                                    onClick={() => removeFile(i)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4d4d',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer row: reCAPTCHA + Submit */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: mob ? 'column' : 'row',
                                    alignItems: mob ? 'stretch' : 'center',
                                    justifyContent: 'space-between',
                                    gap: '14px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        alignItems: 'center',
                                        padding: '10px 14px',
                                        background: 'rgba(15,10,30,0.5)',
                                        border: '1px solid rgba(105,62,205,0.25)',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '6px',
                                            background: 'rgba(59,130,246,0.15)',
                                            border: '1px solid rgba(59,130,246,0.4)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#60a5fa',
                                        }}
                                    >
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: '11px',
                                                color: '#fff',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Protected by reCAPTCHA
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '10px',
                                                color: 'rgba(255,255,255,0.5)',
                                            }}
                                        >
                                            Privacy • Terms
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="c-submit-btn"
                                    style={{
                                        padding: mob ? '12px 24px' : '12px 32px',
                                        border: 'none',
                                        borderRadius: '10px',
                                        background:
                                            'linear-gradient(90deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
                                        color: '#fff',
                                        fontSize: mob ? '13px' : '14px',
                                        fontWeight: 600,
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        opacity: submitting ? 0.7 : 1,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow:
                                            '0 10px 30px rgba(99,102,241,.4), 0 0 60px rgba(168,85,247,.25)',
                                        transition: 'all .3s ease',
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <span
                                                style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    border: '2px solid rgba(255,255,255,0.4)',
                                                    borderTop: '2px solid #fff',
                                                    borderRadius: '50%',
                                                    animation: 'spin .8s linear infinite',
                                                }}
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Submit{' '}
                                            {requestType === 'complaint' ? 'Complaint' : 'Query'}
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="22" y1="2" x2="11" y2="13" />
                                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Bottom Strip ─── */}
                    <div
                        style={{
                            background: 'rgba(15,10,30,0.5)',
                            border: '1px solid rgba(105,62,205,0.25)',
                            borderRadius: '14px',
                            padding: mob ? '16px' : '18px 24px',
                            display: 'flex',
                            flexDirection: mob ? 'column' : 'row',
                            alignItems: mob ? 'flex-start' : 'center',
                            justifyContent: 'space-between',
                            gap: '14px',
                            opacity: contactIn ? 1 : 0,
                            animation: contactIn
                                ? 'cFlyBottom 0.9s cubic-bezier(.16,1,.3,1) 0.95s both'
                                : 'none',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(59,130,246,0.15)',
                                    border: '1px solid rgba(59,130,246,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#60a5fa',
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontSize: mob ? '12px' : '13px', color: '#fff' }}>
                                    After submission, you will receive a confirmation email.
                                </div>
                                <div
                                    style={{
                                        fontSize: mob ? '11px' : '12px',
                                        color: 'rgba(255,255,255,0.6)',
                                        marginTop: '3px',
                                    }}
                                >
                                    Our team will review your request and respond within{' '}
                                    <span style={{ color: '#60a5fa', fontWeight: 600 }}>
                                        3 working days.
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(15,10,30,0.6)',
                                    border: '1px solid rgba(105,62,205,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#cbd5e1',
                                    flexShrink: 0,
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <div>
                                <a
                                    href={`mailto:${supportEmail}`}
                                    style={{
                                        fontSize: mob ? '13px' : '14px',
                                        color: '#60a5fa',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                    }}
                                >
                                    {supportEmail}
                                </a>
                                <div
                                    style={{
                                        fontSize: mob ? '11px' : '12px',
                                        color: 'rgba(255,255,255,0.55)',
                                        marginTop: '2px',
                                    }}
                                >
                                    For any urgent matters
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {successModal && (
                <ToastMsgModal
                    open={successModal}
                    mob={mob}
                    type="success"
                    title="Request Submitted Successfully"
                    message="Thank you. Our team will respond within 3 working days."
                    onClose={() => setSuccessModal(false)}
                />
            )}
            {failedModal && (
                <ToastMsgModal
                    open={failedModal}
                    mob={mob}
                    type="error"
                    title="Submission Failed"
                    message="Please try again later."
                    onClose={() => setFailedModal(false)}
                />
            )}
        </>
    );
}

/* ───────── Helper components ───────── */

function FieldLabel({
    n,
    label,
    required,
    optional,
    mob,
    labelIconColor,
}: {
    n: string;
    label: string;
    required?: boolean;
    optional?: boolean;
    mob: boolean;
    labelIconColor?: string;
}) {
    return (
        <div
            style={{
                fontSize: mob ? '11px' : '12px',
                color: labelIconColor ?? 'rgba(255,255,255,0.85)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }}
        >
            <span style={{ color: labelIconColor ?? '#c084fc', fontWeight: 600 }}>{n}.</span>
            {label}
            {required && <span style={{ color: '#ef4444' }}>*</span>}
            {optional && (
                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>(Optional)</span>
            )}
        </div>
    );
}

function FormField({
    n,
    label,
    required,
    mob,
    type = 'text',
    icon,
    placeholder,
    value,
    error,
    onChange,
    iconColor,
    labelIconColor,
}: {
    n: string;
    label: string;
    required?: boolean;
    mob: boolean;
    type?: string;
    icon?: React.ReactNode;
    placeholder?: string;
    value: string;
    error?: string;
    onChange: (v: string) => void;
    iconColor?: string;
    labelIconColor?: string;
}) {
    return (
        <div>
            <FieldLabel
                n={n}
                label={label}
                required={required}
                mob={mob}
                labelIconColor={labelIconColor}
            />
            <div
                className="c-input"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(15,10,30,0.6)',
                    border: error ? '1px solid #ff4d4d' : '1px solid rgba(105,62,205,0.3)',
                    borderRadius: '8px',
                    padding: mob ? '8px 10px' : '10px 12px',
                    marginTop: '8px',
                }}
            >
                {icon && (
                    <span style={{ color: iconColor ?? 'rgba(255,255,255,0.5)', display: 'flex' }}>
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#fff',
                        fontSize: mob ? '12px' : '13px',
                    }}
                />
            </div>
            {error && (
                <p style={{ color: '#ff4d4d', fontSize: '11px', marginTop: '4px' }}>{error}</p>
            )}
        </div>
    );
}
