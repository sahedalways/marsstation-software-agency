// components/chat/ChatMessages.tsx
'use client';
import { useEffect, useRef } from 'react';
import { SupportAvatar } from './ChatWindow';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
    status?: 'sent' | 'delivered' | 'seen';
}

interface ChatMessagesProps {
    messages: Message[];
    userName: string;
    agentName: string;
    agentGender: 'male' | 'female';
    isTyping: boolean;
}

// ── Message Status Icons ──
const StatusIcon = ({ status }: { status?: string }) => {
    if (!status) return null;

    if (status === 'sent') {
        return (
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginLeft: 4, verticalAlign: 'middle' }}
            >
                <path
                    d="M5 12l5 5L20 7"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    if (status === 'delivered') {
        return (
            <svg
                width="18"
                height="14"
                viewBox="0 0 28 24"
                fill="none"
                style={{ marginLeft: 4, verticalAlign: 'middle' }}
            >
                <path
                    d="M2 12l5 5L17 7"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M9 12l5 5L24 7"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    if (status === 'seen') {
        return (
            <svg
                width="18"
                height="14"
                viewBox="0 0 28 24"
                fill="none"
                style={{ marginLeft: 4, verticalAlign: 'middle' }}
            >
                <path
                    d="M2 12l5 5L17 7"
                    stroke="rgba(100,180,255,0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M9 12l5 5L24 7"
                    stroke="rgba(100,180,255,0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    return null;
};

export const ChatMessages = ({
    messages,
    userName,
    agentName,
    agentGender,
    isTyping,
}: ChatMessagesProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const formatTime = (d: Date) =>
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(110,65,220,0.3) transparent',
            }}
        >
            {/* Empty state */}
            {messages.length === 0 && !isTyping && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '30px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <SupportAvatar gender={agentGender} size={52} />
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 13,
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        Hi <strong style={{ color: 'rgba(180,160,255,0.9)' }}>{userName}</strong>!
                        <br />
                        <span style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {agentName} is connecting...
                        </span>
                    </p>
                </div>
            )}

            {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                    <div
                        key={msg.id}
                        style={{
                            display: 'flex',
                            justifyContent: isUser ? 'flex-end' : 'flex-start',
                            animation: 'chatMsgIn 0.3s ease forwards',
                        }}
                    >
                        {!isUser && (
                            <div style={{ marginRight: 8, marginTop: 2 }}>
                                <SupportAvatar gender={agentGender} size={28} />
                            </div>
                        )}

                        <div style={{ maxWidth: '78%' }}>
                            {!isUser && (
                                <p
                                    style={{
                                        color: 'rgba(180,160,255,0.6)',
                                        fontSize: 10,
                                        margin: '0 0 3px 4px',
                                        fontWeight: 600,
                                        letterSpacing: '0.03em',
                                    }}
                                >
                                    {agentName}
                                </p>
                            )}
                            <div
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: isUser
                                        ? '14px 14px 4px 14px'
                                        : '14px 14px 14px 4px',
                                    background: isUser
                                        ? 'linear-gradient(135deg, rgba(110,65,220,0.5), rgba(80,40,180,0.4))'
                                        : 'rgba(255,255,255,0.07)',
                                    border: `1px solid ${isUser ? 'rgba(110,65,220,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: 13,
                                    lineHeight: 1.5,
                                    wordBreak: 'break-word',
                                }}
                            >
                                {msg.text}
                            </div>

                            {/* Time + Status */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                                    margin: '4px 4px 0',
                                    gap: 2,
                                }}
                            >
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                                    {formatTime(msg.timestamp)}
                                </span>
                                {isUser && <StatusIcon status={msg.status} />}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* ── Typing indicator ── */}
            {isTyping && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 8,
                        animation: 'chatMsgIn 0.3s ease forwards',
                    }}
                >
                    <SupportAvatar gender={agentGender} size={28} />
                    <div
                        style={{
                            padding: '12px 18px',
                            borderRadius: '14px 14px 14px 4px',
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            gap: 5,
                            alignItems: 'center',
                        }}
                    >
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: '50%',
                                    background: 'rgba(180,160,255,0.6)',
                                    display: 'inline-block',
                                    animation: 'typingBounce 1.2s ease-in-out infinite',
                                    animationDelay: `${i * 0.2}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
};
