// components/chat/ChatUserForm.tsx
'use client';
import { useState } from 'react';

interface ChatUserFormProps {
    onSubmit: (name: string, email: string) => void;
}

export const ChatUserForm = ({ onSubmit }: ChatUserFormProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const validate = () => {
        const newErrors: { name?: string; email?: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (!email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
            newErrors.email = 'Please enter a valid email';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onSubmit(name.trim(), email.trim());
    };

    const inputStyle = (field: string, hasError: boolean): React.CSSProperties => ({
        width: '100%',
        padding: '12px 14px',
        border: `1px solid ${
            hasError
                ? 'rgba(255, 80, 80, 0.6)'
                : focusedField === field
                  ? 'rgba(110, 65, 220, 0.8)'
                  : 'rgba(255,255,255,0.15)'
        }`,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.05)',
        color: '#fff',
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow:
            focusedField === field
                ? '0 0 12px rgba(110, 65, 220, 0.15)'
                : hasError
                  ? '0 0 8px rgba(255, 80, 80, 0.1)'
                  : 'none',
        boxSizing: 'border-box' as const,
    });

    return (
        <div
            style={{
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                flex: 1,
            }}
        >
            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background:
                        'linear-gradient(135deg, rgba(110,65,220,0.3), rgba(60,30,150,0.2))',
                    border: '1px solid rgba(110,65,220,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(180,160,255,0.9)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            </div>

            <h3
                style={{
                    color: '#fff',
                    fontSize: 17,
                    fontWeight: 600,
                    margin: 0,
                    letterSpacing: '0.01em',
                }}
            >
                Welcome!
            </h3>
            <p
                style={{
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: 13,
                    margin: 0,
                    textAlign: 'center',
                    lineHeight: 1.5,
                    marginBottom: 8,
                }}
            >
                Please introduce yourself to start chatting
            </p>

            <form
                onSubmit={handleSubmit}
                style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
                <div>
                    <label
                        style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 12,
                            fontWeight: 500,
                            marginBottom: 6,
                            letterSpacing: '0.03em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Your Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                        }}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        style={inputStyle('name', !!errors.name)}
                    />
                    {errors.name && (
                        <p
                            style={{
                                color: 'rgba(255,100,100,0.9)',
                                fontSize: 11,
                                margin: '4px 0 0 2px',
                            }}
                        >
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: 12,
                            fontWeight: 500,
                            marginBottom: 6,
                            letterSpacing: '0.03em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Your Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                        }}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="john@example.com"
                        style={inputStyle('email', !!errors.email)}
                    />
                    {errors.email && (
                        <p
                            style={{
                                color: 'rgba(255,100,100,0.9)',
                                fontSize: 11,
                                margin: '4px 0 0 2px',
                            }}
                        >
                            {errors.email}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: 'none',
                        borderRadius: 10,
                        background:
                            'linear-gradient(135deg, rgba(110,65,220,0.8), rgba(80,40,180,0.9))',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        letterSpacing: '0.02em',
                        transition: 'all 0.25s ease',
                        marginTop: 4,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            'linear-gradient(135deg, rgba(130,80,240,0.9), rgba(100,55,200,1))';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(110,65,220,0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                            'linear-gradient(135deg, rgba(110,65,220,0.8), rgba(80,40,180,0.9))';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    Start Chatting
                </button>
            </form>
        </div>
    );
};
