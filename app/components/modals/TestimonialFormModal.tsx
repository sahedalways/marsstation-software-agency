'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ToastMsgModal } from '../common/ToastMsgModal';

interface Props {
    open: boolean;
    onClose: () => void;
    mob: boolean;
}

export function TestimonialFormModal({ open, onClose, mob }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; photo?: string; text?: string }>({});
    const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handlePhoto = useCallback((file: File | null) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            setErrors(prev => ({ ...prev, photo: 'Only JPG, PNG, WebP, GIF allowed' }));
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, photo: 'Photo must be under 2MB' }));
            return;
        }
        setErrors(prev => ({ ...prev, photo: undefined }));
        setPhoto(file);
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }, []);

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
        setErrors(prev => ({ ...prev, photo: undefined }));
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handlePhoto(file);
        },
        [handlePhoto]
    );

    if (!open) return null;

    const handleSubmit = async () => {
        if (!name.trim() || !text.trim() || !photo) return;
        setSubmitting(true);
        setErrors({});
        try {
            const fd = new FormData();
            fd.append('name', name.trim());
            fd.append('position', position.trim());
            fd.append('company', company.trim());
            fd.append('text', text.trim());
            fd.append('rating', String(rating));
            if (photo) fd.append('photo', photo);

            const res = await fetch('/api/testimonials', {
                method: 'POST',
                body: fd,
            });
            const data = await res.json();
            if (data.success) {
                setToast({
                    type: 'success',
                    title: 'Testimonial Submitted Successfully',
                    message: 'Thank you for sharing your experience! Your feedback helps us grow.',
                });
                setName('');
                setEmail('');
                setPosition('');
                setCompany('');
                setRating(5);
                setText('');
                setHoverRating(0);
                setPhoto(null);
                setPhotoPreview(null);
            } else {
                setToast({
                    type: 'error',
                    title: 'Submission Failed',
                    message: data.message || 'Please try again later.',
                });
            }
        } catch {
            setToast({
                type: 'error',
                title: 'Submission Failed',
                message: 'Please try again later.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return createPortal(
        <>
            <style>{`
                @keyframes tfmOverlay { from { opacity:0; } to { opacity:1; } }
                @keyframes tfmModal { from { opacity:0; transform:scale(0.92) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
            `}</style>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(2,1,8,0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: mob ? '16px' : '24px',
                    animation: 'tfmOverlay 0.3s ease',
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        width: '100%',
                        maxWidth: mob ? '100%' : '540px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        background: 'linear-gradient(180deg, rgba(20,15,40,0.98), rgba(10,5,22,0.98))',
                        border: '1px solid rgba(168,85,247,0.35)',
                        borderRadius: '24px',
                        padding: mob ? '24px 20px' : '36px',
                        animation: 'tfmModal 0.4s cubic-bezier(.16,1,.3,1)',
                        boxShadow: '0 0 80px rgba(168,85,247,0.15), 0 30px 60px rgba(0,0,0,0.6)',
                    }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                    Share Your Experience
                                </span>
                            </div>
                            <h2 style={{ fontSize: mob ? '20px' : '24px', fontWeight: 700, color: '#fff', margin: 0 }}>
                                Leave a Review
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.6)',
                                cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                                Full Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                style={{
                                    width: '100%', padding: mob ? '10px 12px' : '12px 14px',
                                    background: 'rgba(15,10,30,0.7)',
                                    border: '1px solid rgba(105,62,205,0.3)',
                                    borderRadius: '10px', color: '#fff', fontSize: '14px',
                                    outline: 'none', fontFamily: 'inherit',
                                }}
                            />
                            {errors.name && (
                                <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px' }}>{errors.name}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                                Email Address
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                style={{
                                    width: '100%', padding: mob ? '10px 12px' : '12px 14px',
                                    background: 'rgba(15,10,30,0.7)',
                                    border: '1px solid rgba(105,62,205,0.3)',
                                    borderRadius: '10px', color: '#fff', fontSize: '14px',
                                    outline: 'none', fontFamily: 'inherit',
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                                    Position
                                </label>
                                <input
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    placeholder="CEO"
                                    style={{
                                        width: '100%', padding: mob ? '10px 12px' : '12px 14px',
                                        background: 'rgba(15,10,30,0.7)',
                                        border: '1px solid rgba(105,62,205,0.3)',
                                        borderRadius: '10px', color: '#fff', fontSize: '14px',
                                        outline: 'none', fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                                    Company
                                </label>
                                <input
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="Company Inc."
                                    style={{
                                        width: '100%', padding: mob ? '10px 12px' : '12px 14px',
                                        background: 'rgba(15,10,30,0.7)',
                                        border: '1px solid rgba(105,62,205,0.3)',
                                        borderRadius: '10px', color: '#fff', fontSize: '14px',
                                        outline: 'none', fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                                Rating <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = star <= (hoverRating || rating);
                                    return (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                padding: '4px', transition: 'transform 0.15s',
                                                transform: active ? 'scale(1.1)' : 'scale(1)',
                                            }}
                                        >
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? '#fbbf24' : 'rgba(255,255,255,0.15)'} stroke={active ? '#fbbf24' : 'rgba(255,255,255,0.2)'} strokeWidth="1" strokeLinejoin="round">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                                Your Photo <span style={{ color: '#ef4444' }}>*</span>
                            </label>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={(e) => handlePhoto(e.target.files?.[0] || null)}
                                style={{ display: 'none' }}
                            />

                            {photoPreview ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '14px 16px',
                                        background: 'rgba(168,85,247,0.08)',
                                        border: '1px solid rgba(168,85,247,0.35)',
                                        borderRadius: '14px',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '50%',
                                            background: `url(${photoPreview}) center/cover`,
                                            border: '2px solid rgba(168,85,247,0.6)',
                                            boxShadow: '0 0 15px rgba(168,85,247,0.3)',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                color: '#fff',
                                                fontWeight: 600,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {photo?.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '11px',
                                                color: 'rgba(255,255,255,0.45)',
                                                marginTop: '2px',
                                            }}
                                        >
                                            {photo
                                                ? photo.size < 1024 * 1024
                                                    ? `${(photo.size / 1024).toFixed(1)} KB`
                                                    : `${(photo.size / 1024 / 1024).toFixed(2)} MB`
                                                : ''}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removePhoto}
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            background: 'rgba(239,68,68,0.15)',
                                            border: '1px solid rgba(239,68,68,0.4)',
                                            color: '#fca5a5',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            flexShrink: 0,
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={handleDrop}
                                    style={{
                                        padding: '24px',
                                        borderRadius: '14px',
                                        border: `2px dashed ${dragging ? 'rgba(168,85,247,0.7)' : 'rgba(168,85,247,0.25)'}`,
                                        background: dragging ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.02)',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: 'rgba(168,85,247,0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 12px',
                                        }}
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 4px' }}>
                                        <span style={{ color: '#c084fc', fontWeight: 600 }}>Click to upload</span> or drag & drop
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>
                                        JPG, PNG, WebP · Max 2MB
                                    </p>
                                </div>
                            )}
                            {errors.photo && (
                                <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px' }}>{errors.photo}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                                Your Testimonial <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Share your experience working with us..."
                                rows={4}
                                style={{
                                    width: '100%', padding: mob ? '10px 12px' : '12px 14px',
                                    background: 'rgba(15,10,30,0.7)',
                                    border: '1px solid rgba(105,62,205,0.3)',
                                    borderRadius: '10px', color: '#fff', fontSize: '14px',
                                    outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                                }}
                            />
                            {errors.text && (
                                <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px' }}>{errors.text}</div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: mob ? '10px 20px' : '12px 24px',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '10px', background: 'transparent',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '13px', fontWeight: 500,
                                cursor: 'pointer', fontFamily: 'inherit',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !name.trim() || !text.trim() || !photo}
                            style={{
                                padding: mob ? '10px 24px' : '12px 28px',
                                border: 'none', borderRadius: '10px',
                                background: !name.trim() || !text.trim() || !photo
                                    ? 'rgba(168,85,247,0.3)'
                                    : 'linear-gradient(90deg, #a855f7 0%, #6366f1 50%, #3b82f6 100%)',
                                color: '#fff', fontSize: '13px', fontWeight: 600,
                                cursor: !name.trim() || !text.trim() || !photo || submitting ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', opacity: submitting ? 0.7 : 1,
                                display: 'flex', alignItems: 'center', gap: '8px',
                                boxShadow: !name.trim() || !text.trim() || !photo ? 'none' : '0 10px 30px rgba(99,102,241,.4), 0 0 60px rgba(168,85,247,.25)',
                                transition: 'all 0.3s',
                            }}
                        >
                            {submitting ? (
                                <>
                                    <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Submit Testimonial
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <ToastMsgModal
                open={!!toast}
                mob={mob}
                type={toast?.type || 'success'}
                title={toast?.title || ''}
                message={toast?.message || ''}
                onClose={() => { setToast(null); onClose(); }}
            />
        </>,
        document.body
    );
}
