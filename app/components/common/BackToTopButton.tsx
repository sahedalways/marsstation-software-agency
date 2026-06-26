'use client';

import { useEffect, useState } from 'react';
import { useLenis } from '../../contexts/SmoothScrollContext';

export function BackToTopButton() {
    const { lenis } = useLenis();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!lenis) return;

        const onScroll = () => {
            setShow(lenis.scroll > 300);
        };

        lenis.on('scroll', onScroll);
        onScroll();

        return () => lenis.off('scroll', onScroll);
    }, [lenis]);

    const scrollToTop = () => {
        lenis?.scrollTo(0, { duration: 1.5 });
    };

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: 'fixed',
                bottom: '22px',
                right: '22px',
                width: show ? '52px' : '0px',
                height: show ? '52px' : '0px',
                opacity: show ? 1 : 0,
                transform: show ? 'scale(1)' : 'scale(0.6)',
                transition: 'all 0.25s cubic-bezier(.16,1,.3,1)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(115,42,235,0.95), rgba(90,30,200,0.75))',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                boxShadow: '0 10px 25px rgba(115,42,235,0.35), 0 6px 12px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.12) translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 14px 30px rgba(115,42,235,0.45)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow =
                    '0 10px 25px rgba(115,42,235,0.35), 0 6px 12px rgba(0,0,0,0.35)';
            }}
        >
            {/* arrow icon */}
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}
