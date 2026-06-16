// components/common/ChatButton.tsx
'use client';
import { useState } from 'react';

interface ChatButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

export const ChatButton = ({ onClick, isOpen }: ChatButtonProps) => {
    const [hovered, setHovered] = useState(false);

    if (isOpen) return null;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Open chat"
            style={{
                position: 'fixed',
                bottom: 90,
                right: 28,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: hovered ? 10 : 0,
                border: '1px solid rgba(110, 65, 220, 0.5)',
                borderRadius: 9999,
                background: 'rgba(110, 65, 220, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: '#fff',
                cursor: 'pointer',
                padding: hovered ? '14px 24px 14px 18px' : '14px',
                fontFamily: 'inherit',
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: '0.02em',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hovered
                    ? '0 0 24px rgba(110, 65, 220, 0.4), 0 4px 16px rgba(0,0,0,0.3)'
                    : '0 0 12px rgba(110, 65, 220, 0.2), 0 2px 8px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
            }}
        >
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                    flexShrink: 0,
                    filter: hovered ? 'drop-shadow(0 0 6px rgba(110,65,220,0.6))' : 'none',
                    transition: 'filter 0.3s ease',
                }}
            >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>

            <span
                style={{
                    maxWidth: hovered ? 120 : 0,
                    opacity: hovered ? 1 : 0,
                    transition: 'max-width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
                    overflow: 'hidden',
                    display: 'inline-block',
                }}
            >
                Chat with us
            </span>
        </button>
    );
};
