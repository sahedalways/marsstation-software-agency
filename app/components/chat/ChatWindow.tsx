// components/chat/ChatWindow.tsx
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatUserForm } from './ChatUserForm';
import { ChatMessages, Message } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface SupportAgent {
    name: string;
    gender: 'male' | 'female';
}

const SUPPORT_AGENTS: SupportAgent[] = [
    { name: 'Sarah Mitchell', gender: 'female' },
    { name: 'Emma Johnson', gender: 'female' },
    { name: 'Priya Sharma', gender: 'female' },
    { name: 'Sophia Chen', gender: 'female' },
    { name: 'Fatima Al-Hassan', gender: 'female' },
    { name: 'Isabella Garcia', gender: 'female' },
    { name: 'Aisha Rahman', gender: 'female' },
    { name: 'Olivia Taylor', gender: 'female' },
    { name: 'James Wilson', gender: 'male' },
    { name: 'David Park', gender: 'male' },
    { name: 'Alex Thompson', gender: 'male' },
    { name: 'Ryan Cooper', gender: 'male' },
    { name: 'Ahmed Khan', gender: 'male' },
    { name: 'Daniel Rivera', gender: 'male' },
    { name: 'Marcus Brown', gender: 'male' },
    { name: 'Chris Anderson', gender: 'male' },
];

const getRandomAgent = (): SupportAgent =>
    SUPPORT_AGENTS[Math.floor(Math.random() * SUPPORT_AGENTS.length)];

// ── Human-like delay calculator ──
const calculateHumanDelay = (
    userMsgLength: number,
    replyLength: number
): {
    seenDelay: number;
    typingDelay: number;
} => {
    const baseSeenDelay =
        userMsgLength < 30
            ? 800 + Math.random() * 1200
            : userMsgLength < 100
              ? 1500 + Math.random() * 2500
              : 3000 + Math.random() * 4000;

    // Add random "human distraction" factor (sometimes people take longer)
    const distractionChance = Math.random();
    const seenDelay =
        distractionChance > 0.85 ? baseSeenDelay + 2000 + Math.random() * 3000 : baseSeenDelay;

    const charsPerSecond = 4 + Math.random() * 3;
    const baseTypingDelay = (replyLength / charsPerSecond) * 1000;

    // Minimum typing: 1.5s, Maximum: 12s (even for long replies)
    const typingDelay = Math.max(1500, Math.min(12000, baseTypingDelay));

    return { seenDelay, typingDelay };
};

const fetchAIReply = async (
    message: string,
    conversationHistory: { role: string; content: string }[]
): Promise<string> => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                history: conversationHistory.slice(-10),
            }),
        });

        if (!response.ok) throw new Error('Network error');

        const data = await response.json();
        return data.reply || 'Sorry, could you say that again?';
    } catch {
        return "I'm having a connection issue right now. Please try again in a moment, or reach us via WhatsApp at +8801616516753 😊";
    }
};

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

// ── Female Avatar ──
const FemaleAvatar = ({ size = 34 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="28" rx="20" ry="22" fill="#4A3728" />
        <path d="M12 28 C12 28 10 42 14 52 C14 52 16 42 16 34" fill="#4A3728" />
        <path d="M52 28 C52 28 54 42 50 52 C50 52 48 42 48 34" fill="#4A3728" />
        <ellipse cx="32" cy="30" rx="14" ry="16" fill="#F5D0B0" />
        <path
            d="M18 24 C18 14 26 8 32 8 C38 8 46 14 46 24 C46 20 42 16 38 15 C36 18 28 18 26 15 C22 16 18 20 18 24Z"
            fill="#5C3D2E"
        />
        <ellipse cx="25" cy="30" rx="2.2" ry="2.5" fill="#3D2314" />
        <ellipse cx="39" cy="30" rx="2.2" ry="2.5" fill="#3D2314" />
        <circle cx="25.8" cy="29.2" r="0.8" fill="#fff" />
        <circle cx="39.8" cy="29.2" r="0.8" fill="#fff" />
        <path d="M22 28 C22.5 26.5 24 26 25 26.5" stroke="#3D2314" strokeWidth="0.6" fill="none" />
        <path d="M42 28 C41.5 26.5 40 26 39 26.5" stroke="#3D2314" strokeWidth="0.6" fill="none" />
        <path
            d="M22 26 C23 24.5 27 24.5 28 26"
            stroke="#5C3D2E"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
        />
        <path
            d="M36 26 C37 24.5 41 24.5 42 26"
            stroke="#5C3D2E"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
        />
        <path
            d="M31 33 C31 33 30.5 35 32 35.5 C33.5 35 33 33 33 33"
            stroke="#D4A990"
            strokeWidth="0.8"
            fill="none"
        />
        <path
            d="M28 38 C29 37 31 36.5 32 37 C33 36.5 35 37 36 38"
            stroke="#E07070"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
        />
        <path
            d="M28 38 C30 40 34 40 36 38"
            stroke="#D06060"
            strokeWidth="0.8"
            fill="#E8A0A0"
            strokeLinecap="round"
        />
        <ellipse cx="22" cy="35" rx="3" ry="1.5" fill="rgba(240,140,140,0.25)" />
        <ellipse cx="42" cy="35" rx="3" ry="1.5" fill="rgba(240,140,140,0.25)" />
        <rect x="28" y="44" width="8" height="6" rx="2" fill="#F5D0B0" />
        <path d="M20 54 C20 48 26 46 32 46 C38 46 44 48 44 54 L44 58 L20 58Z" fill="#7C5CB8" />
        <path
            d="M28 47 L32 50 L36 47"
            stroke="#9B7DD4"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
        />
    </svg>
);

// ── Male Avatar ──
const MaleAvatar = ({ size = 34 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <path
            d="M16 26 C16 14 24 8 32 8 C40 8 48 14 48 26 C48 22 46 16 40 14 C38 16 26 16 24 14 C18 16 16 22 16 26Z"
            fill="#2C1A0E"
        />
        <ellipse cx="32" cy="30" rx="14" ry="16" fill="#E8C49A" />
        <path
            d="M18 24 C18 16 24 10 32 10 C40 10 46 16 46 24 C46 20 44 14 32 14 C20 14 18 20 18 24Z"
            fill="#3A2415"
        />
        <ellipse cx="25" cy="30" rx="2" ry="2.2" fill="#2C1A0E" />
        <ellipse cx="39" cy="30" rx="2" ry="2.2" fill="#2C1A0E" />
        <circle cx="25.7" cy="29.3" r="0.7" fill="#fff" />
        <circle cx="39.7" cy="29.3" r="0.7" fill="#fff" />
        <path
            d="M22 25.5 C23.5 24 27 24 28.5 25.5"
            stroke="#2C1A0E"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
        />
        <path
            d="M35.5 25.5 C37 24 40.5 24 42 25.5"
            stroke="#2C1A0E"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
        />
        <path
            d="M31 32 C31 32 30 35 32 35.5 C34 35 33 32 33 32"
            stroke="#CBA882"
            strokeWidth="1"
            fill="none"
        />
        <path
            d="M28 39 C30 40.5 34 40.5 36 39"
            stroke="#B8866E"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
        />
        <rect x="27" y="44" width="10" height="6" rx="2" fill="#E8C49A" />
        <path d="M18 54 C18 48 24 46 32 46 C40 46 46 48 46 54 L46 58 L18 58Z" fill="#4A6FA5" />
        <path
            d="M28 47 L32 51 L36 47"
            stroke="#5A82B8"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
        />
    </svg>
);

// ── Support Avatar ──
export const SupportAvatar = ({
    gender,
    size = 34,
    showOnline = false,
}: {
    gender: 'male' | 'female';
    size?: number;
    showOnline?: boolean;
}) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background:
                gender === 'female'
                    ? 'linear-gradient(135deg, rgba(180,120,220,0.25), rgba(120,60,180,0.15))'
                    : 'linear-gradient(135deg, rgba(74,111,165,0.25), rgba(40,70,130,0.15))',
            border: `1px solid ${gender === 'female' ? 'rgba(180,120,220,0.3)' : 'rgba(74,111,165,0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
        }}
    >
        {gender === 'female' ? <FemaleAvatar size={size} /> : <MaleAvatar size={size} />}
        {showOnline && (
            <div
                style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: Math.max(8, size * 0.26),
                    height: Math.max(8, size * 0.26),
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '2px solid rgba(8,4,24,0.95)',
                }}
            />
        )}
    </div>
);

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [agent, setAgent] = useState<SupportAgent>(getRandomAgent);
    const [statusText, setStatusText] = useState<'online' | 'seen' | 'typing'>('online');
    const [inputDisabled, setInputDisabled] = useState(false);
    const conversationRef = useRef<{ role: string; content: string }[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
        };
    }, []);

    const addTimeout = (fn: () => void, ms: number) => {
        const t = setTimeout(fn, ms);
        timeoutsRef.current.push(t);
        return t;
    };

    useEffect(() => {
        if (isOpen && !user) {
            setAgent(getRandomAgent());
        }
    }, [isOpen, user]);

    const handleUserSubmit = useCallback(
        (name: string, email: string) => {
            setUser({ name, email });
            setInputDisabled(true);

            // Step 1: "seen" after a small delay (agent notices new user)
            addTimeout(() => {
                setStatusText('seen');
            }, 600);

            // Step 2: Start "typing"
            addTimeout(() => {
                setStatusText('typing');
            }, 1500);

            // Step 3: Send welcome message
            const welcomeMsg = `Hi ${name}! 👋 I'm ${agent.name}. Welcome! How can I help you today?`;
            const typingTime = 1800 + Math.random() * 1200;

            addTimeout(() => {
                setMessages([
                    {
                        id: 'welcome-1',
                        text: welcomeMsg,
                        sender: 'support',
                        timestamp: new Date(),
                        status: 'delivered',
                    },
                ]);
                setStatusText('online');
                setInputDisabled(false);
                conversationRef.current.push({ role: 'assistant', content: welcomeMsg });
            }, 1500 + typingTime);
        },
        [agent]
    );

    const handleSend = useCallback(async (text: string) => {
        // Add user message
        const userMsg: Message = {
            id: `user-${Date.now()}`,
            text,
            sender: 'user',
            timestamp: new Date(),
            status: 'sent',
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputDisabled(true);

        // Update conversation history
        conversationRef.current.push({ role: 'user', content: text });

        // Mark as "delivered" after small delay
        addTimeout(
            () => {
                setMessages((prev) =>
                    prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'delivered' } : m))
                );
            },
            300 + Math.random() * 500
        );

        // Fetch AI reply in background while simulating human behavior
        const aiReplyPromise = fetchAIReply(text, conversationRef.current);

        // Step 1: "Seen" delay — depends on user message length
        const userMsgLength = text.length;

        // Preliminary delay estimates (we'll adjust typing after we get the reply)
        const seenBase =
            userMsgLength < 30
                ? 800 + Math.random() * 1200
                : userMsgLength < 100
                  ? 1500 + Math.random() * 2500
                  : 2500 + Math.random() * 4000;

        // Random distraction (15% chance of extra delay)
        const seenDelay = Math.random() > 0.85 ? seenBase + 1500 + Math.random() * 3000 : seenBase;

        // Mark as "seen"
        addTimeout(() => {
            setMessages((prev) =>
                prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'seen' } : m))
            );
            setStatusText('seen');
        }, seenDelay);

        // Wait for AI reply
        const aiReply = await aiReplyPromise;
        const replyLength = aiReply.length;

        // Calculate typing delay based on reply length
        const charsPerSecond = 4 + Math.random() * 3;
        const typingBase = (replyLength / charsPerSecond) * 1000;
        const typingDelay = Math.max(1500, Math.min(12000, typingBase));

        // Step 2: Start typing (after seen delay completes)
        const typingStartDelay = seenDelay + 500 + Math.random() * 1000;

        addTimeout(() => {
            setStatusText('typing');
        }, typingStartDelay);

        // Step 3: Send the reply
        addTimeout(() => {
            const supportMsg: Message = {
                id: `support-${Date.now()}`,
                text: aiReply,
                sender: 'support',
                timestamp: new Date(),
                status: 'delivered',
            };
            setMessages((prev) => [...prev, supportMsg]);
            setStatusText('online');
            setInputDisabled(false);
            conversationRef.current.push({ role: 'assistant', content: aiReply });
        }, typingStartDelay + typingDelay);
    }, []);

    const handleClose = () => onClose();

    const handleEndChat = () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        setUser(null);
        setMessages([]);
        setStatusText('online');
        setInputDisabled(false);
        conversationRef.current = [];
        setAgent(getRandomAgent());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <style>{`
                @keyframes chatWindowIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes chatMsgIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-4px); }
                }
                @keyframes seenPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                .chat-window-scrollbar::-webkit-scrollbar { width: 4px; }
                .chat-window-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .chat-window-scrollbar::-webkit-scrollbar-thumb { background: rgba(110,65,220,0.3); border-radius: 4px; }
            `}</style>

            <div
                style={{
                    position: 'fixed',
                    bottom: 90,
                    right: 28,
                    width: 370,
                    maxWidth: 'calc(100vw - 32px)',
                    height: 520,
                    maxHeight: 'calc(100vh - 120px)',
                    zIndex: 1001,
                    borderRadius: 18,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(8, 4, 24, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(110, 65, 220, 0.25)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(110,65,220,0.15)',
                    animation: 'chatWindowIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background:
                            'linear-gradient(135deg, rgba(110,65,220,0.12), rgba(30,15,60,0.3))',
                        flexShrink: 0,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <SupportAvatar gender={agent.gender} size={38} showOnline />
                        <div>
                            <p
                                style={{
                                    color: '#fff',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    margin: 0,
                                    letterSpacing: '0.01em',
                                }}
                            >
                                {agent.name}
                            </p>
                            <p
                                style={{
                                    fontSize: 11,
                                    margin: 0,
                                    fontWeight: 500,
                                    transition: 'color 0.3s ease',
                                    color:
                                        statusText === 'typing'
                                            ? 'rgba(180,160,255,0.8)'
                                            : statusText === 'seen'
                                              ? 'rgba(100,180,255,0.7)'
                                              : 'rgba(34, 197, 94, 0.8)',
                                }}
                            >
                                {statusText === 'typing'
                                    ? 'typing...'
                                    : statusText === 'seen'
                                      ? 'online'
                                      : '● Online'}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {user && (
                            <button
                                onClick={handleEndChat}
                                title="End chat"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    color: 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    padding: '6px 10px',
                                    fontSize: 11,
                                    fontFamily: 'inherit',
                                    transition: 'all 0.2s ease',
                                    marginRight: 4,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = 'rgba(255,100,100,0.8)';
                                    e.currentTarget.style.borderColor = 'rgba(255,100,100,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                }}
                            >
                                End
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                padding: 6,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                e.currentTarget.style.background = 'none';
                            }}
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                {!user ? (
                    <ChatUserForm onSubmit={handleUserSubmit} />
                ) : (
                    <>
                        <div
                            className="chat-window-scrollbar"
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            <ChatMessages
                                messages={messages}
                                userName={user.name}
                                agentName={agent.name}
                                agentGender={agent.gender}
                                isTyping={statusText === 'typing'}
                            />
                        </div>
                        <ChatInput onSend={handleSend} disabled={inputDisabled} />
                    </>
                )}
            </div>
        </>
    );
};
