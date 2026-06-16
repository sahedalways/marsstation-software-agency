'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCountries } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import { getEmojiFlag } from 'countries-list';

interface Props {
    value: string;
    onChange: (value: string) => void;
    mob: boolean;
}

export function CountryCode({ value, onChange, mob }: Props) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const countries = getCountries();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;

            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);

    const toggleDropdown = () => {
        if (!open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();

            setPosition({
                top: rect.bottom + 8,
                left: rect.left,
            });
        }

        setOpen((prev) => !prev);
    };

    return (
        <div ref={wrapperRef}>
            {/* Button */}
            <div
                ref={buttonRef}
                onClick={toggleDropdown}
                style={{
                    background:
                        'linear-gradient(135deg, rgba(115,42,235,.95), rgba(90,30,200,.75))',
                    border: '1px solid rgba(180,120,255,.35)',
                    borderRadius: '10px',
                    padding: mob ? '7px 10px' : '9px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    color: '#fff',
                    userSelect: 'none',
                    minWidth: mob ? '55px' : '65px',
                }}
            >
                <span
                    style={{
                        fontSize: mob ? '15px' : '17px',
                    }}
                >
                    {getEmojiFlag(value as any)}
                </span>

                <span
                    style={{
                        fontSize: '10px',
                        opacity: 0.7,
                    }}
                >
                    ▾
                </span>
            </div>

            {/* Dropdown */}
            {mounted &&
                open &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            zIndex: 999999999,

                            width: '280px',
                            maxHeight: '320px',
                            overflowY: 'auto',

                            background:
                                'linear-gradient(180deg,rgba(25,15,45,.98),rgba(10,8,20,.98))',

                            border: '1px solid rgba(160,100,255,.35)',

                            borderRadius: '12px',

                            padding: '6px',

                            boxShadow: '0 20px 50px rgba(0,0,0,.55)',
                        }}
                    >
                        {countries.map((country) => (
                            <div
                                key={country}
                                onClick={(e) => {
                                    e.stopPropagation();

                                    onChange(country);

                                    setOpen(false);
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(115,42,235,.35)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        value === country ? 'rgba(115,42,235,.35)' : 'transparent';
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',

                                    padding: '9px 10px',

                                    borderRadius: '8px',

                                    cursor: 'pointer',

                                    color: '#fff',

                                    fontSize: '12px',

                                    background:
                                        value === country ? 'rgba(115,42,235,.35)' : 'transparent',

                                    transition: 'all .2s',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '18px',
                                    }}
                                >
                                    {getEmojiFlag(country as any)}
                                </span>

                                <span
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    {en[country]}
                                </span>
                            </div>
                        ))}
                    </div>,

                    document.body
                )}
        </div>
    );
}
