// components/home/sections/TestimonialForm.tsx
'use client';

import { useState, useRef, useCallback } from 'react';

interface Props {
    mob: boolean;
    cardsIn?: boolean;
}

export function TestimonialForm({ mob, cardsIn = true }: Props) {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [company, setCompany] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handlePhoto = useCallback((file: File | null) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            setError('Only JPG, PNG, WebP, GIF allowed');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('Photo must be under 2MB');
            return;
        }
        setError(null);
        setPhoto(file);
        const reader = new FileReader();
        reader.onload = (e) => setPhotoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    }, []);

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
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

    const canSubmit =
        name.trim().length >= 2 &&
        text.trim().length >= 10 &&
        text.trim().length <= 500 &&
        rating >= 1;

    const handleSubmit = async () => {
        if (!canSubmit || submitting) return;
        setSubmitting(true);
        setError(null);

        try {
            const fd = new FormData();
            fd.append('name', name.trim());
            fd.append('position', position.trim());
            fd.append('company', company.trim());
            fd.append('text', text.trim());
            fd.append('rating', String(rating));
            if (photo) fd.append('photo', photo);

            const res = await fetch('/api/testimonial', {
                method: 'POST',
                body: fd,
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to submit');
            }

            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const activeStars = hoverRating || rating;

    /* ─── Success State ─── */
    if (submitted) {
        return (
            <>
                <style>{`
                    @keyframes tfrSuccessPop {
                        from { opacity:0; transform:scale(0.8) translateY(20px); }
                        to   { opacity:1; transform:scale(1) translateY(0); }
                    }
                    @keyframes tfrCheckDraw {
                        from { stroke-dashoffset:30; }
                        to   { stroke-dashoffset:0; }
                    }
                    @keyframes tfrConfetti {
                        0%   { transform:translateY(0) rotate(0); opacity:1; }
                        100% { transform:translateY(-60px) rotate(720deg); opacity:0; }
                    }
                `}</style>
                <div
                    style={{
                        maxWidth: '480px',
                        margin: '0 auto',
                        padding: mob ? '40px 20px' : '60px 40px',
                        borderRadius: '24px',
                        background:
                            'linear-gradient(180deg, rgba(60,25,120,0.3) 0%, rgba(15,10,30,0.6) 100%)',
                        border: '1px solid rgba(168,85,247,0.4)',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(168,85,247,0.15)',
                        textAlign: 'center',
                        animation: 'tfrSuccessPop 0.6s cubic-bezier(.16,1,.3,1) both',
                    }}
                >
                    {/* Confetti dots */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: [
                                    '#a855f7',
                                    '#6366f1',
                                    '#c084fc',
                                    '#fbbf24',
                                    '#34d399',
                                    '#f472b6',
                                ][i],
                                left: `${20 + i * 12}%`,
                                top: '40%',
                                animation: `tfrConfetti 1.2s ease-out ${0.1 * i}s both`,
                            }}
                        />
                    ))}

                    {/* Check circle */}
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 0 40px rgba(168,85,247,0.5)',
                        }}
                    >
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: 30,
                                animation: 'tfrCheckDraw 0.5s ease 0.3s both',
                            }}
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h3
                        style={{
                            fontSize: mob ? '22px' : '26px',
                            fontWeight: 700,
                            color: '#fff',
                            margin: '0 0 12px',
                        }}
                    >
                        Thank You! 🎉
                    </h3>
                    <p
                        style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.7)',
                            lineHeight: 1.7,
                            margin: '0 0 8px',
                        }}
                    >
                        Your review has been submitted successfully.
                    </p>
                    <p
                        style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.6,
                            margin: 0,
                        }}
                    >
                        It will appear on our website after approval.
                    </p>
                </div>
            </>
        );
    }

    /* ─── Form ─── */
    return (
        <>
            <style>{`
                @keyframes tfrFadeIn {
                    from { opacity:0; transform:translateY(30px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .tfr-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(168,85,247,0.25);
                    border-radius: 12px;
                    padding: 13px 16px;
                    color: #fff;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .tfr-input:focus {
                    border-color: rgba(168,85,247,0.7);
                    background: rgba(168,85,247,0.06);
                    box-shadow: 0 0 0 3px rgba(168,85,247,0.12);
                }
                .tfr-input::placeholder { color: rgba(255,255,255,0.3); }
                .tfr-input.error { border-color: rgba(239,68,68,0.6); }
                .tfr-label {
                    display: block;
                    font-size: 12.5px;
                    color: rgba(255,255,255,0.75);
                    margin-bottom: 7px;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                }
                .tfr-star {
                    cursor: pointer;
                    transition: transform 0.2s ease, filter 0.2s ease;
                }
                .tfr-star:hover { transform: scale(1.25); }
                .tfr-submit {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .tfr-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 40px rgba(168,85,247,0.5), 0 0 60px rgba(99,102,241,0.25) !important;
                }
                .tfr-drop-zone {
                    transition: all 0.3s ease;
                }
                .tfr-drop-zone:hover {
                    border-color: rgba(168,85,247,0.6) !important;
                    background: rgba(168,85,247,0.06) !important;
                }
                @keyframes tfrSpin {
                    from { transform: rotate(0); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div
                style={{
                    maxWidth: '520px',
                    margin: '0 auto',
                    padding: mob ? '28px 20px 32px' : '36px 36px 40px',
                    borderRadius: '24px',
                    background:
                        'linear-gradient(180deg, rgba(60,25,120,0.25) 0%, rgba(15,10,30,0.55) 100%)',
                    border: '1px solid rgba(168,85,247,0.35)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(168,85,247,0.12)',
                    animation: cardsIn
                        ? 'tfrFadeIn 0.8s cubic-bezier(.16,1,.3,1) 0.2s both'
                        : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Glow accent */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-60px',
                        right: '-60px',
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        background: 'rgba(168,85,247,0.08)',
                        filter: 'blur(50px)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 14px',
                            borderRadius: '999px',
                            background: 'rgba(168,85,247,0.18)',
                            border: '1px solid rgba(168,85,247,0.4)',
                            color: '#c084fc',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                            marginBottom: '14px',
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Share Your Experience
                    </span>

                    <h3
                        style={{
                            fontSize: mob ? '22px' : '26px',
                            fontWeight: 700,
                            color: '#fff',
                            margin: '0 0 8px',
                            lineHeight: 1.3,
                        }}
                    >
                        Leave a{' '}
                        <span
                            style={{
                                background: 'linear-gradient(90deg, #a855f7, #6366f1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Review
                        </span>
                    </h3>
                    <p
                        style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.5)',
                            margin: 0,
                            lineHeight: 1.6,
                        }}
                    >
                        Your feedback helps us improve and inspires others.
                    </p>
                </div>

                {/* ── Star Rating ── */}
                <div style={{ marginBottom: '22px' }}>
                    <label className="tfr-label">
                        Your Rating <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div
                        style={{
                            display: 'flex',
                            gap: mob ? '6px' : '8px',
                            padding: '10px 16px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: `1px solid ${
                                rating > 0 ? 'rgba(251,191,36,0.35)' : 'rgba(168,85,247,0.2)'
                            }`,
                            width: 'fit-content',
                        }}
                    >
                        {[1, 2, 3, 4, 5].map((star) => {
                            const filled = star <= activeStars;
                            return (
                                <svg
                                    key={star}
                                    className="tfr-star"
                                    width={mob ? '28' : '34'}
                                    height={mob ? '28' : '34'}
                                    viewBox="0 0 24 24"
                                    fill={filled ? '#fbbf24' : 'transparent'}
                                    stroke={filled ? '#fbbf24' : 'rgba(255,255,255,0.25)'}
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        filter: filled
                                            ? 'drop-shadow(0 0 6px rgba(251,191,36,0.5))'
                                            : 'none',
                                    }}
                                >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            );
                        })}
                        {rating > 0 && (
                            <span
                                style={{
                                    marginLeft: '8px',
                                    color: '#fbbf24',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    alignSelf: 'center',
                                }}
                            >
                                {rating}/5
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Photo Upload ── */}
                <div style={{ marginBottom: '20px' }}>
                    <label className="tfr-label">Your Photo (optional)</label>

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
                            className="tfr-drop-zone"
                            onClick={() => fileRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            style={{
                                padding: '24px',
                                borderRadius: '14px',
                                border: `2px dashed ${
                                    dragging ? 'rgba(168,85,247,0.7)' : 'rgba(168,85,247,0.25)'
                                }`,
                                background: dragging
                                    ? 'rgba(168,85,247,0.08)'
                                    : 'rgba(255,255,255,0.02)',
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
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '13px',
                                    margin: '0 0 4px',
                                }}
                            >
                                <span style={{ color: '#c084fc', fontWeight: 600 }}>
                                    Click to upload
                                </span>{' '}
                                or drag & drop
                            </p>
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.35)',
                                    fontSize: '11px',
                                    margin: 0,
                                }}
                            >
                                JPG, PNG, WebP · Max 2MB
                            </p>
                        </div>
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        style={{ display: 'none' }}
                        onChange={(e) => handlePhoto(e.target.files?.[0] || null)}
                    />
                </div>

                {/* ── Full Name ── */}
                <div style={{ marginBottom: '16px' }}>
                    <label className="tfr-label">
                        Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        type="text"
                        className="tfr-input"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={80}
                    />
                </div>

                {/* ── Position + Company ── */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
                        gap: '14px',
                        marginBottom: '16px',
                    }}
                >
                    <div>
                        <label className="tfr-label">Position / Title</label>
                        <input
                            type="text"
                            className="tfr-input"
                            placeholder="CEO, Developer..."
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            maxLength={60}
                        />
                    </div>
                    <div>
                        <label className="tfr-label">Company Name</label>
                        <input
                            type="text"
                            className="tfr-input"
                            placeholder="Acme Inc."
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            maxLength={60}
                        />
                    </div>
                </div>

                {/* ── Review Text ── */}
                <div style={{ marginBottom: '22px' }}>
                    <label className="tfr-label">
                        Your Review <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                        className="tfr-input"
                        rows={4}
                        placeholder="Share your experience working with us..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={500}
                        style={{ resize: 'vertical', minHeight: '100px' }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '6px',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '11px',
                                color:
                                    text.length > 450
                                        ? '#fbbf24'
                                        : text.length >= 500
                                          ? '#ef4444'
                                          : 'rgba(255,255,255,0.35)',
                                fontWeight: 500,
                            }}
                        >
                            {text.length}/500
                        </span>
                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div
                        style={{
                            padding: '10px 14px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.35)',
                            color: '#fca5a5',
                            borderRadius: '10px',
                            fontSize: '12px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <span>⚠</span> {error}
                    </div>
                )}

                {/* ── Submit Button ── */}
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    className="tfr-submit"
                    style={{
                        width: '100%',
                        padding: mob ? '14px' : '16px',
                        borderRadius: '14px',
                        border: '1px solid rgba(168,85,247,0.5)',
                        background:
                            canSubmit && !submitting
                                ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #6366f1 100%)'
                                : 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        fontWeight: 700,
                        cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed',
                        fontSize: mob ? '14px' : '15px',
                        letterSpacing: '0.03em',
                        opacity: canSubmit && !submitting ? 1 : 0.5,
                        boxShadow:
                            canSubmit && !submitting
                                ? '0 10px 35px rgba(168,85,247,0.4), 0 0 50px rgba(99,102,241,0.15)'
                                : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                    }}
                >
                    {submitting ? (
                        <>
                            <span
                                style={{
                                    width: 16,
                                    height: 16,
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTop: '2px solid #fff',
                                    borderRadius: '50%',
                                    animation: 'tfrSpin 0.8s linear infinite',
                                }}
                            />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                            Submit Review
                        </>
                    )}
                </button>

                {/* Privacy note */}
                <p
                    style={{
                        textAlign: 'center',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.35)',
                        marginTop: '14px',
                        lineHeight: 1.5,
                    }}
                >
                    🔒 Your review will be published after approval. We never share your personal
                    data.
                </p>
            </div>
        </>
    );
}
