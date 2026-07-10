// components/chat/ChatWindow.tsx
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatUserForm } from './ChatUserForm';
import { ChatMessages, Message } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { isLead, submitLead } from '../../utils/lead';

interface SupportAgent {
    name: string;
    gender: 'male' | 'female';
    avatar: string;
}

const SUPPORT_AGENTS: SupportAgent[] = [
    {
        name: 'Sarah Mitchell',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
        name: 'Emma Johnson',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
        name: 'Priya Sharma',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
        name: 'Sophia Chen',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
        name: 'Fatima Al-Hassan',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    {
        name: 'Isabella Garcia',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
        name: 'Aisha Rahman',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    },
    {
        name: 'Olivia Taylor',
        gender: 'female',
        avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    },
    {
        name: 'James Wilson',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        name: 'David Park',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
        name: 'Alex Thompson',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
        name: 'Ryan Cooper',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
        name: 'Ahmed Khan',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
        name: 'Daniel Rivera',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    {
        name: 'Marcus Brown',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
        name: 'Chris Anderson',
        gender: 'male',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    },
];

const getRandomAgent = (): SupportAgent =>
    SUPPORT_AGENTS[Math.floor(Math.random() * SUPPORT_AGENTS.length)];

// ══════════════════════════════════════════════
//  HUMAN BEHAVIOR ENGINE
// ══════════════════════════════════════════════

// Count meaningful lines in a message
const countLines = (text: string): number => {
    const lines = text.split(/\n/).filter((l) => l.trim().length > 0);
    // Also count long sentences as separate "lines" to read
    let extraLines = 0;
    lines.forEach((line) => {
        // Every ~80 chars counts as an extra reading line
        if (line.length > 80) extraLines += Math.floor(line.length / 80);
    });
    return lines.length + extraLines;
};

// Human reading speed: 200-300 WPM = ~4-5 words/sec
// But on chat, people skim: ~6-8 words/sec for short msgs
const calculateReadingTime = (text: string): number => {
    const lines = countLines(text);
    const wordCount = text.split(/\s+/).length;

    // Base: per-line reading (humans read line by line)
    const perLineTime = lines * (400 + Math.random() * 300); // 400-700ms per line

    // Word-based component (longer words = slower)
    const avgWordLength = text.length / Math.max(wordCount, 1);
    const wordFactor = avgWordLength > 5 ? 1.3 : 1.0; // complex words slow reading

    // Short msg (< 5 words): quick glance
    if (wordCount <= 5) {
        return 600 + Math.random() * 800; // 0.6-1.4s
    }

    // Medium msg (5-20 words): normal read
    if (wordCount <= 20) {
        return perLineTime * wordFactor;
    }

    // Long msg (20+ words): line-by-line reading
    return perLineTime * wordFactor * (0.9 + Math.random() * 0.3);
};

// Human mood/behavior randomizer
// Sometimes people are quick, sometimes distracted
const getHumanMood = (): 'focused' | 'normal' | 'distracted' | 'busy' => {
    const r = Math.random();
    if (r < 0.15) return 'focused'; // 15% - super quick responses
    if (r < 0.55) return 'normal'; // 40% - normal pace
    if (r < 0.85) return 'distracted'; // 30% - slightly slow
    return 'busy'; // 15% - noticeably delayed
};

const getMoodMultiplier = (mood: ReturnType<typeof getHumanMood>): number => {
    switch (mood) {
        case 'focused':
            return 0.5 + Math.random() * 0.3; // 0.5-0.8x
        case 'normal':
            return 0.9 + Math.random() * 0.3; // 0.9-1.2x
        case 'distracted':
            return 1.3 + Math.random() * 0.7; // 1.3-2.0x
        case 'busy':
            return 2.0 + Math.random() * 2.0; // 2.0-4.0x
    }
};

// Typing speed simulation
// Real human: 40-70 WPM = 3.3-5.8 chars/sec
// Support agent (practiced): 50-80 WPM = 4.2-6.7 chars/sec
const calculateTypingTime = (replyText: string, mood: ReturnType<typeof getHumanMood>): number => {
    const lines = replyText.split(/\n/).filter((l) => l.trim().length > 0);
    const totalChars = replyText.length;

    // Base typing speed (chars per second)
    const baseSpeed = 4.5 + Math.random() * 2.5; // 4.5-7 chars/sec

    // Per-line pause: humans pause between lines/thoughts
    // Short pause between related lines, longer for new thoughts
    let totalPauseTime = 0;
    lines.forEach((line, i) => {
        if (i === 0) return;
        // Pause between lines: 300-1200ms
        totalPauseTime += 300 + Math.random() * 900;

        // Extra pause if line starts with emoji or new topic indicator
        if (/^[•\-\d📌✅❌🔹]/.test(line.trim())) {
            totalPauseTime += 200 + Math.random() * 400;
        }
    });

    // Base typing time
    const rawTypingTime = (totalChars / baseSpeed) * 1000;

    // Apply mood
    const moodMultiplier = getMoodMultiplier(mood);

    // Sometimes agent types, deletes, retypes (5% chance adds 1-3s)
    const retypeDelay = Math.random() < 0.05 ? 1000 + Math.random() * 2000 : 0;

    const total = (rawTypingTime + totalPauseTime + retypeDelay) * moodMultiplier;

    // Clamp: min 1.2s (even for "ok"), max 15s (even for essays)
    return Math.max(1200, Math.min(15000, total));
};

// Gap between "seen" and "start typing"
// Sometimes instant, sometimes they read then think
const calculateThinkingGap = (
    userMsgLength: number,
    mood: ReturnType<typeof getHumanMood>
): number => {
    const wordCount = userMsgLength; // approximate

    // Simple greeting/thanks: minimal thinking
    if (wordCount < 20) {
        const base = 300 + Math.random() * 600;
        return base * getMoodMultiplier(mood);
    }

    // Question: need to think about answer
    if (wordCount < 80) {
        const base = 600 + Math.random() * 1500;
        return base * getMoodMultiplier(mood);
    }

    // Complex/long message: read carefully, think, then type
    const base = 1000 + Math.random() * 2500;
    return base * getMoodMultiplier(mood);
};

// "Seen" delay: when does agent notice the message?
const calculateSeenDelay = (mood: ReturnType<typeof getHumanMood>): number => {
    switch (mood) {
        case 'focused':
            // Already looking at chat
            return 400 + Math.random() * 600; // 0.4-1.0s
        case 'normal':
            // Switches to chat tab
            return 800 + Math.random() * 1500; // 0.8-2.3s
        case 'distracted':
            // Doing something else, comes back
            return 2000 + Math.random() * 3000; // 2-5s
        case 'busy':
            // Really occupied, takes a while
            return 4000 + Math.random() * 6000; // 4-10s
    }
};

// Delivered delay: network simulation
const calculateDeliveredDelay = (): number => {
    // Most of the time instant-ish
    if (Math.random() < 0.7) return 200 + Math.random() * 400; // 0.2-0.6s
    // Sometimes slight network lag
    return 500 + Math.random() * 1000; // 0.5-1.5s
};

// Sometimes agent goes "seen" then comes back later to type (realistic!)
// 10% chance of "double seen" — seen, pause, then type
const shouldDoubleSeen = (): boolean => Math.random() < 0.1;

// ══════════════════════════════════════════════

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
    onServiceRequest?: () => void;
}

const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000;
const MIN_MSGS_FOR_PROMPT = 3;

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
    avatar,
    size = 34,
    showOnline = false,
}: {
    avatar: string;
    size?: number;
    showOnline?: boolean;
}) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
        }}
    >
        <img
            src={avatar}
            alt="Support Agent"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
        />

        {showOnline && (
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '2px solid #080418',
                }}
            />
        )}
    </div>
);

export const ChatWindow = ({ isOpen, onClose, onServiceRequest }: ChatWindowProps) => {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [agent, setAgent] = useState<SupportAgent>(getRandomAgent);
    const [statusText, setStatusText] = useState<'online' | 'seen' | 'typing'>('online');
    const [inputDisabled, setInputDisabled] = useState(false);
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const conversationRef = useRef<{ role: string; content: string }[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const msgCountRef = useRef(0);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const servicePromptShownRef = useRef(false);

    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            clearInactivityTimer();
        };
    }, []);

    const addTimeout = (fn: () => void, ms: number) => {
        const t = setTimeout(fn, ms);
        timeoutsRef.current.push(t);
        return t;
    };

    const clearInactivityTimer = () => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
        }
    };

    const showServicePrompt = () => {
        if (servicePromptShownRef.current) return;
        servicePromptShownRef.current = true;
        clearInactivityTimer();

        const promptMsg: Message = {
            id: `service-prompt-${Date.now()}`,
            text: "You can get a clear quote based on your project requirements if you'd like.",
            sender: 'support',
            timestamp: new Date(),
            status: 'delivered',
            buttonLabel: 'Get Services',
        };
        setStatusText('typing');
        addTimeout(() => {
            setMessages((prev) => [...prev, promptMsg]);
            setStatusText('online');
            setInputDisabled(false);
        }, 1200 + Math.random() * 800);
    };

    // Show service prompt immediately after AI replies to the 3rd user message
    useEffect(() => {
        if (!user) return;
        if (servicePromptShownRef.current) return;
        if (msgCountRef.current < MIN_MSGS_FOR_PROMPT) return;

        const lastMsg = messages[messages.length - 1];
        if (!lastMsg || lastMsg.sender !== 'support' || lastMsg.buttonLabel) return;

        showServicePrompt();
    }, [messages, user]);

    // Inactivity detection: after the agent sends a response and user doesn't reply
    useEffect(() => {
        if (!user) return;
        if (servicePromptShownRef.current) return;
        if (msgCountRef.current < MIN_MSGS_FOR_PROMPT) return;

        const lastMsg = messages[messages.length - 1];
        if (!lastMsg || lastMsg.sender === 'user' || lastMsg.buttonLabel) return;

        clearInactivityTimer();
        inactivityTimerRef.current = setTimeout(() => {
            showServicePrompt();
        }, INACTIVITY_TIMEOUT_MS);

        return () => {
            clearInactivityTimer();
        };
    }, [messages, user]);

    useEffect(() => {
        if (isOpen && !user) {
            setAgent(getRandomAgent());
        }
    }, [isOpen, user]);

    const handleUserSubmit = useCallback(
        (name: string, email: string) => {
            if (isLead(msgCountRef.current)) {
                const existingLead = localStorage.getItem(`ms_lead_${email}`);

                if (!existingLead) {
                    submitLead({
                        name,
                        email,
                    });

                    localStorage.setItem(`ms_lead_${email}`, 'true');
                }
            }

            setUser({ name, email });
            setInputDisabled(true);
            msgCountRef.current = 0;

            const mood = getHumanMood();
            const welcomeMsg = `Hi ${name}! 👋 I'm ${agent.name}. Welcome! How can I help you today?`;

            // Agent notices new chat
            const noticeDelay = calculateSeenDelay(mood);
            addTimeout(() => {
                setStatusText('seen');
            }, noticeDelay);

            // Gap before typing
            const thinkGap = 400 + Math.random() * 800;
            addTimeout(() => {
                setStatusText('typing');
            }, noticeDelay + thinkGap);

            // Send welcome
            const typingTime = calculateTypingTime(welcomeMsg, mood);
            addTimeout(
                () => {
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
                },
                noticeDelay + thinkGap + typingTime
            );
        },
        [agent]
    );

    const handleSend = useCallback(async (text: string) => {
        msgCountRef.current++;
        const mood = getHumanMood();

        // ── 1. Add user message (sent) ──
        const userMsg: Message = {
            id: `user-${Date.now()}-${msgCountRef.current}`,
            text,
            sender: 'user',
            timestamp: new Date(),
            status: 'sent',
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputDisabled(true);

        conversationRef.current.push({ role: 'user', content: text });

        // ── 2. Delivered tick ──
        const deliveredDelay = calculateDeliveredDelay();
        addTimeout(() => {
            setMessages((prev) =>
                prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'delivered' } : m))
            );
        }, deliveredDelay);

        // ── 3. Fetch AI reply (happens in parallel) ──
        const aiReplyPromise = fetchAIReply(text, conversationRef.current);

        // ── 4. Seen delay (based on mood + user msg reading time) ──
        const baseSeenDelay = calculateSeenDelay(mood);
        const readingTime = calculateReadingTime(text);
        const seenDelay = baseSeenDelay + readingTime;

        addTimeout(() => {
            setMessages((prev) =>
                prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'seen' } : m))
            );
            setStatusText('seen');
        }, seenDelay);

        // ── 5. Wait for AI reply ──
        const aiReply = await aiReplyPromise;

        // ── 6. Double-seen behavior (sometimes seen → goes away → comes back) ──
        const doubleSeen = shouldDoubleSeen();
        let extraDoubleSeenDelay = 0;

        if (doubleSeen) {
            // Agent sees it, goes away briefly, comes back
            extraDoubleSeenDelay = 2000 + Math.random() * 4000;
            addTimeout(() => {
                setStatusText('online'); // "went away"
            }, seenDelay + 500);

            addTimeout(
                () => {
                    setStatusText('seen'); // "came back"
                },
                seenDelay + 500 + extraDoubleSeenDelay
            );
        }

        // ── 7. Thinking gap (seen → typing) ──
        const thinkingGap = calculateThinkingGap(text.length, mood);
        const typingStartTime = seenDelay + extraDoubleSeenDelay + thinkingGap;

        addTimeout(() => {
            setStatusText('typing');
        }, typingStartTime);

        // ── 8. Typing duration (line-based) ──
        const typingDuration = calculateTypingTime(aiReply, mood);

        // ── 9. Sometimes typing stops briefly then resumes (thinking mid-type) ──
        // 8% chance
        if (Math.random() < 0.08 && typingDuration > 3000) {
            const pauseAt = typingStartTime + typingDuration * (0.3 + Math.random() * 0.3);
            const pauseDuration = 800 + Math.random() * 1500;

            addTimeout(() => {
                setStatusText('seen'); // stopped typing
            }, pauseAt);

            addTimeout(() => {
                setStatusText('typing'); // resumed typing
            }, pauseAt + pauseDuration);

            // Adjust final send time
            addTimeout(
                () => {
                    const supportMsg: Message = {
                        id: `support-${Date.now()}-${msgCountRef.current}`,
                        text: aiReply,
                        sender: 'support',
                        timestamp: new Date(),
                        status: 'delivered',
                    };
                    setMessages((prev) => [...prev, supportMsg]);
                    setStatusText('online');
                    setInputDisabled(false);
                    conversationRef.current.push({ role: 'assistant', content: aiReply });
                },
                typingStartTime + typingDuration + pauseDuration
            );
        } else {
            // Normal flow: typing → send
            addTimeout(() => {
                const supportMsg: Message = {
                    id: `support-${Date.now()}-${msgCountRef.current}`,
                    text: aiReply,
                    sender: 'support',
                    timestamp: new Date(),
                    status: 'delivered',
                };
                setMessages((prev) => [...prev, supportMsg]);
                setStatusText('online');
                setInputDisabled(false);
                conversationRef.current.push({ role: 'assistant', content: aiReply });
            }, typingStartTime + typingDuration);
        }
    }, []);

    const handleClose = () => onClose();

    const confirmEndChat = () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        clearInactivityTimer();
        setUser(null);
        setMessages([]);
        setStatusText('online');
        setInputDisabled(false);
        conversationRef.current = [];
        msgCountRef.current = 0;
        servicePromptShownRef.current = false;
        setAgent(getRandomAgent());
        setShowEndConfirm(false);
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
                        <SupportAvatar avatar={agent.avatar} size={38} showOnline />
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
                                onClick={() => setShowEndConfirm(true)}
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
                            title="Minimize"
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
                                <line x1="5" y1="12" x2="19" y2="12" />
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
                                agentAvatar={agent.avatar}
                                onServiceClick={onServiceRequest}
                            />
                        </div>
                        <ChatInput onSend={handleSend} disabled={inputDisabled} />
                    </>
                )}
            </div>
        {showEndConfirm && (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}
                onClick={() => setShowEndConfirm(false)}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'linear-gradient(135deg, #1a1040, #0f0a2e)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        borderRadius: 16,
                        padding: '28px 32px',
                        maxWidth: 360,
                        width: '90%',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'rgba(255,100,100,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff6464" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: 17, fontWeight: 700 }}>
                        End Chat?
                    </h3>
                    <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.5 }}>
                        Are you sure you want to end this conversation? This will clear all messages.
                    </p>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={() => setShowEndConfirm(false)}
                            style={{
                                flex: 1,
                                padding: '11px 0',
                                borderRadius: 10,
                                border: '1px solid rgba(255,255,255,0.15)',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmEndChat}
                            style={{
                                flex: 1,
                                padding: '11px 0',
                                borderRadius: 10,
                                border: 'none',
                                background: '#dc2626',
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            Yes, End Chat
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
