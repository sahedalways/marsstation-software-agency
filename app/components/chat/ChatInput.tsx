// components/chat/ChatInput.tsx
'use client';
import { useState, useRef } from 'react';

interface ChatInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
    const [text, setText] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setText('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const hasText = text.trim().length > 0;

    return (
        <div
            style={{
                padding: '12px 14px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(0,0,0,0.2)',
            }}
        >
            <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={disabled ? `Waiting for reply...` : 'Type a message...'}
                disabled={disabled}
                style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: `1px solid ${focused ? 'rgba(110,65,220,0.6)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.25s ease, opacity 0.25s ease',
                    boxSizing: 'border-box' as const,
                    opacity: disabled ? 0.5 : 1,
                }}
            />

            <button
                onClick={handleSend}
                disabled={!hasText || disabled}
                style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: 'none',
                    background:
                        hasText && !disabled
                            ? 'linear-gradient(135deg, rgba(110,65,220,0.8), rgba(80,40,180,0.9))'
                            : 'rgba(255,255,255,0.06)',
                    color: hasText && !disabled ? '#fff' : 'rgba(255,255,255,0.25)',
                    cursor: hasText && !disabled ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.25s ease',
                    boxShadow: hasText && !disabled ? '0 2px 12px rgba(110,65,220,0.35)' : 'none',
                }}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ transform: 'rotate(-30deg)', marginLeft: 2 }}
                >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
            </button>
        </div>
    );
};
