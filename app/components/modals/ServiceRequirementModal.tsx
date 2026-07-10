// components/modals/ServiceRequirementModal.tsx
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    mob: boolean;
}

type ServiceType = 'website' | 'mobile' | 'ai';

interface OptionItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}

interface StepConfig {
    badge: string;
    badgeIcon: React.ReactNode;
    title: string;
    subtitle: string;
    helper: string;
    options: OptionItem[];
    multi?: boolean;
    skippable?: boolean;
    dependsOn?: ServiceType[];
}

interface ProjectEstimate {
    minPrice: number;
    maxPrice: number;
    weeks: number;
    summary: string;
    techStack: string[];
}

interface ContactInfo {
    name: string;
    email: string;
    phone: string;
    company: string;
    preferredContact: 'email' | 'phone' | 'whatsapp' | 'meeting';
    notes: string;
}

const CONTACT_STEP = 8;

export function ServiceRequirementModal({ open, onClose, mob }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [services, setServices] = useState<ServiceType[]>([]);
    const [answers, setAnswers] = useState<Record<number, string[]>>({});
    const [showEstimate, setShowEstimate] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const [contact, setContact] = useState<ContactInfo>({
        name: '',
        email: '',
        phone: '',
        company: '',
        preferredContact: 'email',
        notes: '',
    });
    const [contactErrors, setContactErrors] = useState<Partial<Record<keyof ContactInfo, string>>>(
        {}
    );

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            setCurrentStep(1);
            setServices([]);
            setAnswers({});
            setShowEstimate(false);
            setCalculating(false);
            setEstimate(null);
            setSubmitted(false);
            setSubmitError(null);
            setContact({
                name: '',
                email: '',
                phone: '',
                company: '',
                preferredContact: 'email',
                notes: '',
            });
            setContactErrors({});
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    /* ─── Steps configuration (8 total) ─── */
    const steps: Record<number, StepConfig> = {
        2: {
            badge: 'Website Development',
            badgeIcon: webIconSmall,
            title: 'Select Website Type',
            subtitle: 'Choose the type of website you need.',
            helper: 'You can pick multiple types.',
            multi: true,
            skippable: true,
            dependsOn: ['website'],
            options: [
                {
                    id: 'wordpress',
                    title: 'WordPress Website',
                    description: 'Business, blog, portfolio or simple e-commerce.',
                    iconBg: '#dbeafe',
                    iconColor: '#1d4ed8',
                    icon: (
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#1d4ed8' }}>W</span>
                    ),
                },
                {
                    id: 'fullstack',
                    title: 'Full Stack Web App',
                    description: 'Custom apps with React, Next.js, Node.js, Laravel.',
                    iconBg: '#e0e7ff',
                    iconColor: '#6366f1',
                    icon: <CodeIcon color="#6366f1" />,
                },
                {
                    id: 'ecommerce',
                    title: 'E-Commerce Store',
                    description: 'WooCommerce, Shopify or custom e-commerce.',
                    iconBg: '#fce7f3',
                    iconColor: '#db2777',
                    icon: <CartIcon color="#db2777" />,
                },
                {
                    id: 'saas',
                    title: 'SaaS Platform',
                    description: 'Multi-tenant, subscription-based platform.',
                    iconBg: '#dcfce7',
                    iconColor: '#16a34a',
                    icon: <CloudIcon color="#16a34a" />,
                },
                {
                    id: 'erp',
                    title: 'ERP / HRM System',
                    description: 'Business management, HR, or inventory systems.',
                    iconBg: '#fef3c7',
                    iconColor: '#d97706',
                    icon: <BriefcaseIcon color="#d97706" />,
                },
                {
                    id: 'maintenance',
                    title: 'Maintenance & Enhancement',
                    description: 'Improve performance, fix issues, add new features.',
                    iconBg: '#fed7aa',
                    iconColor: '#ea580c',
                    icon: <GearIcon color="#ea580c" />,
                },
            ],
        },
        3: {
            badge: 'Mobile App Development',
            badgeIcon: phoneIconSmall,
            title: 'Select Mobile Platforms',
            subtitle: 'Choose the platforms for your mobile app.',
            helper: 'You can pick multiple platforms.',
            multi: true,
            skippable: true,
            dependsOn: ['mobile'],
            options: [
                {
                    id: 'android',
                    title: 'Android (Native)',
                    description: 'Native Android apps with Kotlin / Java.',
                    iconBg: '#dcfce7',
                    iconColor: '#16a34a',
                    icon: <AndroidIcon color="#16a34a" />,
                },
                {
                    id: 'ios',
                    title: 'iOS (Native)',
                    description: 'Native iOS apps with Swift / SwiftUI.',
                    iconBg: '#f1f5f9',
                    iconColor: '#475569',
                    icon: <AppleIcon color="#475569" />,
                },
                {
                    id: 'cross',
                    title: 'Cross-Platform (RN / Flutter)',
                    description: 'Single codebase for Android & iOS.',
                    iconBg: '#dbeafe',
                    iconColor: '#1d4ed8',
                    icon: <LayersIcon color="#1d4ed8" />,
                },
                {
                    id: 'nfc',
                    title: 'NFC / Hardware Integration',
                    description: 'NFC card sharing, Bluetooth, sensors.',
                    iconBg: '#fce7f3',
                    iconColor: '#db2777',
                    icon: <BoltIcon color="#db2777" />,
                },
            ],
        },
        4: {
            badge: 'AI / Automation',
            badgeIcon: aiIconSmall,
            title: 'AI / Automation Type',
            subtitle: 'What kind of AI or automation do you need?',
            helper: 'Pick multiple if you need a combined system.',
            multi: true,
            skippable: true,
            dependsOn: ['ai'],
            options: [
                {
                    id: 'chatbot',
                    title: 'AI Chatbot',
                    description: 'Custom chatbot for support / sales.',
                    iconBg: '#e9d5ff',
                    iconColor: '#7c3aed',
                    icon: <ChatIcon color="#7c3aed" />,
                },
                {
                    id: 'whatsapp',
                    title: 'WhatsApp Automation',
                    description: 'Auto-reply, broadcast, bot integration.',
                    iconBg: '#d1fae5',
                    iconColor: '#059669',
                    icon: <BoltIcon color="#059669" />,
                },
                {
                    id: 'workflow',
                    title: 'Workflow Automation',
                    description: 'Automate manual repetitive business tasks.',
                    iconBg: '#dcfce7',
                    iconColor: '#16a34a',
                    icon: <GearIcon color="#16a34a" />,
                },
                {
                    id: 'ml',
                    title: 'Custom ML / Predictions',
                    description: 'Predictions, recommendations, classifications.',
                    iconBg: '#fce7f3',
                    iconColor: '#db2777',
                    icon: <ChartIcon color="#db2777" />,
                },
            ],
        },
        5: {
            badge: 'Core Features',
            badgeIcon: starIconSmall,
            title: 'Which Features Do You Need?',
            subtitle: 'Select all key features required for your project.',
            helper: 'You can pick multiple features.',
            multi: true,
            skippable: true,
            options: [
                {
                    id: 'auth',
                    title: 'User Authentication',
                    description: 'Login, register, social login, password reset.',
                    iconBg: '#dbeafe',
                    iconColor: '#1d4ed8',
                    icon: <UserIcon color="#1d4ed8" />,
                },
                {
                    id: 'payment',
                    title: 'Payment Integration',
                    description: 'Stripe, PayPal, bKash, SSLCommerz.',
                    iconBg: '#dcfce7',
                    iconColor: '#16a34a',
                    icon: <CardIcon color="#16a34a" />,
                },
                {
                    id: 'dashboard',
                    title: 'Admin Dashboard',
                    description: 'Manage users, content, orders, analytics.',
                    iconBg: '#e9d5ff',
                    iconColor: '#7c3aed',
                    icon: <ChartIcon color="#7c3aed" />,
                },
                {
                    id: 'chat',
                    title: 'Real-time Chat / Messaging',
                    description: 'Live messaging, notifications, presence.',
                    iconBg: '#fce7f3',
                    iconColor: '#db2777',
                    icon: <ChatIcon color="#db2777" />,
                },
                {
                    id: 'notif',
                    title: 'Push / Email / SMS Notifications',
                    description: 'Multi-channel notification system.',
                    iconBg: '#fed7aa',
                    iconColor: '#ea580c',
                    icon: <BellIcon color="#ea580c" />,
                },
                {
                    id: 'multilang',
                    title: 'Multi-language (i18n)',
                    description: 'Translations and localization support.',
                    iconBg: '#d1fae5',
                    iconColor: '#059669',
                    icon: <GlobeIcon color="#059669" />,
                },
                {
                    id: 'api',
                    title: 'Third-party API Integration',
                    description: 'Any external service or REST API.',
                    iconBg: '#fef3c7',
                    iconColor: '#d97706',
                    icon: <PlugIcon color="#d97706" />,
                },
                {
                    id: 'analytics',
                    title: 'Analytics & Reports',
                    description: 'Track activity, charts, downloadable reports.',
                    iconBg: '#dbeafe',
                    iconColor: '#1d4ed8',
                    icon: <ChartIcon color="#1d4ed8" />,
                },
            ],
        },
        6: {
            badge: 'Project Scale',
            badgeIcon: scaleIconSmall,
            title: 'Expected User Scale & Design',
            subtitle: 'How big do you expect your project to be?',
            helper: 'This affects infrastructure and design depth.',
            skippable: true,
            options: [
                {
                    id: 'small-modern',
                    title: 'Small + Modern Design',
                    description: '< 1k users, clean modern minimal UI.',
                    iconBg: '#dcfce7',
                    iconColor: '#16a34a',
                    icon: <StarIcon color="#16a34a" />,
                },
                {
                    id: 'medium-creative',
                    title: 'Medium + Creative Design',
                    description: '1k-50k users, bold colorful UI.',
                    iconBg: '#dbeafe',
                    iconColor: '#1d4ed8',
                    icon: <SparkleIcon color="#1d4ed8" />,
                },
                {
                    id: 'large-premium',
                    title: 'Large + Premium Dark Theme',
                    description: '50k-500k users, premium glass dark UI.',
                    iconBg: '#1e293b',
                    iconColor: '#a78bfa',
                    icon: <MoonIcon color="#a78bfa" />,
                },
                {
                    id: 'enterprise-custom',
                    title: 'Enterprise + Fully Custom',
                    description: '500k+ users, fully custom brand identity.',
                    iconBg: '#fed7aa',
                    iconColor: '#ea580c',
                    icon: <PenIcon color="#ea580c" />,
                },
            ],
        },
        7: {
            badge: 'Timeline & Budget',
            badgeIcon: clockIconSmall,
            title: 'Your Timeline & Budget',
            subtitle: 'Pick the option that fits your situation best.',
            helper: 'This helps us plan the right scope for you.',
            skippable: true,
            options: [
                {
                    id: 'urgent-low',
                    title: 'Urgent (1-2 wks) • Under £5K',
                    description: 'ASAP delivery, smaller scope.',
                    iconBg: '#fee2e2',
                    iconColor: '#dc2626',
                    icon: <BoltIcon color="#dc2626" />,
                },
                {
                    id: 'short-mid',
                    title: '1 Month • £5K-£15K',
                    description: 'Standard rapid build for medium budget.',
                    iconBg: '#fed7aa',
                    iconColor: '#ea580c',
                    icon: <ClockIcon color="#ea580c" />,
                },
                {
                    id: 'normal-mid',
                    title: '2-3 Months • £15K-£50K',
                    description: 'Comfortable pace, advanced platform.',
                    iconBg: '#dcfce7',
                    iconColor: '#16a34a',
                    icon: <CalendarIcon color="#16a34a" />,
                },
                {
                    id: 'long-high',
                    title: '3-6+ Months • £50K+',
                    description: 'Long-term enterprise / SaaS.',
                    iconBg: '#e9d5ff',
                    iconColor: '#7c3aed',
                    icon: <DollarIcon color="#7c3aed" />,
                },
                {
                    id: 'flex',
                    title: 'Flexible / Discuss Later',
                    description: 'Not sure yet — quality first.',
                    iconBg: '#dbeafe',
                    iconColor: '#1d4ed8',
                    icon: <ClockIcon color="#1d4ed8" />,
                },
            ],
        },
        // Step 8 = Contact (special — no options, handled in JSX)
        [CONTACT_STEP]: {
            badge: 'Contact Information',
            badgeIcon: mailIconSmall,
            title: 'How Can We Reach You?',
            subtitle: 'Share your contact details so we can send the proposal.',
            helper: 'We respect your privacy and never share your data.',
            skippable: false,
            options: [],
        },
    };

    const orderedSteps = useMemo(() => {
        const list = [1];
        for (let i = 2; i <= 8; i++) {
            const s = steps[i];
            if (s?.dependsOn && !s.dependsOn.some((dep) => services.includes(dep))) {
                continue;
            }
            list.push(i);
        }
        return list;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [services]);

    if (!open) return null;

    const currentIndex = orderedSteps.indexOf(currentStep);
    const currentLabel = `Step ${currentIndex + 1} of ${orderedSteps.length}`;
    const cfg = steps[currentStep];
    const isContactStep = currentStep === CONTACT_STEP;
    const isLastStep = currentIndex === orderedSteps.length - 1;

    /* ─── Validation ─── */
    const validateContact = (): boolean => {
        const errs: Partial<Record<keyof ContactInfo, string>> = {};

        if (!contact.name.trim()) errs.name = 'Name is required';
        else if (contact.name.trim().length < 2) errs.name = 'Name is too short';

        if (!contact.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
            errs.email = 'Please enter a valid email';

        if (!contact.phone.trim()) errs.phone = 'Phone is required';
        else if (contact.phone.replace(/\D/g, '').length < 7)
            errs.phone = 'Please enter a valid phone number';

        if (!contact.preferredContact) errs.preferredContact = 'Please pick one';

        setContactErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const updateContact = (field: keyof ContactInfo, value: string) => {
        setContact((p) => ({ ...p, [field]: value }));
        setContactErrors((p) => ({ ...p, [field]: undefined }));
    };

    /* ─── Build AI prompt ─── */
    const buildAIPrompt = () => {
        const parts: string[] = [];
        parts.push(`Services selected: ${services.join(', ') || 'none'}`);
        Object.entries(answers).forEach(([stepIdx, ids]) => {
            const stp = steps[Number(stepIdx)];
            if (!stp) return;
            const titles = ids
                .map((id) => stp.options.find((o) => o.id === id)?.title)
                .filter(Boolean);
            if (titles.length) parts.push(`${stp.badge}: ${titles.join(', ')}`);
        });
        return parts.join(' | ');
    };

    /* ─── Call AI ─── */
    const fetchEstimate = async (): Promise<ProjectEstimate> => {
        const userSummary = buildAIPrompt();
        const promptMessage = `Based on these client requirements for a software project:

${userSummary}

Provide a realistic project estimate in JSON format ONLY (no markdown, no explanation). Use this exact structure:
{
  "minPrice": <number in GBP>,
  "maxPrice": <number in GBP>,
  "weeks": <estimated weeks>,
  "summary": "<2-sentence honest summary about scope and approach>",
  "techStack": ["<tech1>", "<tech2>", "<tech3>", "<tech4>"]
}

Pricing guide (GBP):
- Simple WordPress: £1900-3500
- Standard website / basic app: £1900-5000
- Full stack web app / e-commerce: £5000-15000
- SaaS / ERP / large platform: £15000-50000
- Enterprise / AI heavy: £50000+
Add 20-30% for urgent timelines. Be realistic.`;

        try {
            setCalculating(true);
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: promptMessage, history: [] }),
            });
            const data = await res.json();
            const reply: string = data?.reply || '';
            const jsonMatch = reply.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON in reply');

            const parsed = JSON.parse(jsonMatch[0]);
            const est: ProjectEstimate = {
                minPrice: Number(parsed.minPrice) || 1900,
                maxPrice: Number(parsed.maxPrice) || 5000,
                weeks: Number(parsed.weeks) || 6,
                summary:
                    parsed.summary ||
                    'A tailored solution that fits your needs with modern tech stack and clean architecture.',
                techStack: Array.isArray(parsed.techStack)
                    ? parsed.techStack
                    : ['Next.js', 'Node.js', 'mySQL', 'TailwindCSS', 'Laravel'],
            };
            setEstimate(est);
            return est;
        } catch (err) {
            console.error('Estimate failed:', err);
            const fallback = computeFallbackEstimate(services, answers);
            setEstimate(fallback);
            return fallback;
        } finally {
            setCalculating(false);
            setShowEstimate(true);
        }
    };

    /* ─── Submit final email ─── */
    const handleFinalSubmit = async () => {
        if (!validateContact()) return;
        setSubmitting(true);
        setSubmitError(null);

        try {
            setSubmitting(true);

            const selectionsSummary = buildAIPrompt();

            const computedEstimate = await fetchEstimate();
            const minPrice = computedEstimate.minPrice;
            const maxPrice = computedEstimate.maxPrice;
            const weeks = computedEstimate.weeks;
            const techStack = computedEstimate.techStack.join(', ');

            const fd = new FormData();

            fd.append('fullName', contact.name || '');
            fd.append('email', contact.email || '');
            fd.append('phone', contact.phone || '');
            fd.append('orderNumber', contact.company || 'N/A');

            fd.append('estimate', `£${minPrice} - £${maxPrice}`);

            fd.append('requestType', 'query');

            fd.append('contactMethod', contact.preferredContact || 'email');

            fd.append(
                'description',
                `
=== PROJECT REQUIREMENTS ===

${selectionsSummary || 'No selection'}

=== ESTIMATE ===

Price: £${minPrice} - £${maxPrice}
Timeline: ~${weeks} weeks
Tech Stack: ${techStack}

=== ADDITIONAL NOTES ===

${contact.notes || 'None'}
        `.trim()
            );

            const res = await fetch('/api/service-request', {
                method: 'POST',
                body: fd,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Failed to submit request');
            }

            setSubmitted(true);
        } catch (err) {
            console.error('Service request error:', err);

            setSubmitError(err instanceof Error ? err.message : 'Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    /* ─── Navigation ─── */
    const next = () => {
        if (isContactStep) {
            handleFinalSubmit();
            return;
        }
        const ni = currentIndex + 1;
        if (ni >= orderedSteps.length) return;
        setCurrentStep(orderedSteps[ni]);
    };
    const skip = () => {
        if (isContactStep) return;
        const ni = currentIndex + 1;
        if (ni >= orderedSteps.length) return;
        setCurrentStep(orderedSteps[ni]);
    };
    const back = () => {
        const pi = currentIndex - 1;
        if (pi < 0) return;
        setCurrentStep(orderedSteps[pi]);
    };

    const toggleService = (s: ServiceType) => {
        setServices((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
    };
    const toggleAnswer = (stepIdx: number, optId: string, multi: boolean) => {
        setAnswers((prev) => {
            const cur = prev[stepIdx] || [];
            if (multi) {
                return {
                    ...prev,
                    [stepIdx]: cur.includes(optId)
                        ? cur.filter((x) => x !== optId)
                        : [...cur, optId],
                };
            }
            return { ...prev, [stepIdx]: cur.includes(optId) ? [] : [optId] };
        });
    };

    const canProceed = (() => {
        if (currentStep === 1) return services.length > 0;
        if (isContactStep) {
            return (
                contact.name.trim().length >= 2 &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
                contact.phone.replace(/\D/g, '').length >= 7
            );
        }
        const sel = answers[currentStep] || [];
        return sel.length > 0;
    })();

    const fmt = (n: number) => '£' + n.toLocaleString();

    return (
        <>
            <style>{`
                @keyframes srmOverlayIn { from { opacity:0; } to { opacity:1; } }
                @keyframes srmModalIn {
                    from { opacity:0; transform: translateY(40px) scale(0.96); }
                    to { opacity:1; transform: translateY(0) scale(1); }
                }
                @keyframes srmStepFade {
                    from { opacity:0; transform: translateX(20px); }
                    to { opacity:1; transform: translateX(0); }
                }
                @keyframes srmPulse {
                    0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139,92,246,0.5); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(139,92,246,0); }
                }
                @keyframes srmSpin {
                    from { transform: rotate(0); } to { transform: rotate(360deg); }
                }
                @keyframes srmCountUp {
                    from { opacity:0; transform: translateY(12px); }
                    to { opacity:1; transform: translateY(0); }
                }
                    .srm-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(5, 5, 15, 0.78);
                        backdrop-filter: blur(10px);

                        z-index: 999999999 !important;

                        overflow-y: auto;
                        display: flex;
                    align-items: center;
                    justify-content: center;

                        padding: 6px;

                        isolation: isolate;

                        animation: srmOverlayIn 0.3s ease both;
                    }
                                    .srm-modal {
                                        position:relative;
    z-index:1000000000;
    pointer-events:auto;
                    width: 100%;
                    max-width: 580px;
                    max-height: 92vh;
                    overflow-y: auto;
                    background: linear-gradient(180deg, #0f0a2e 0%, #1a0f3a 50%, #2a1758 100%);
                    border: 1px solid rgba(139,92,246,0.35);
                    border-radius: 22px;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 80px rgba(139,92,246,0.18);
                    animation: srmModalIn 0.45s cubic-bezier(.16,1,.3,1) both;
                    display: flex; flex-direction: column;
                    color: #fff;
                }
                .srm-modal::-webkit-scrollbar { width: 8px; }
                .srm-modal::-webkit-scrollbar-track { background: transparent; }
                .srm-modal::-webkit-scrollbar-thumb {
                    background: rgba(139,92,246,0.4);
                    border-radius: 4px;
                }
                .srm-body { animation: srmStepFade 0.4s cubic-bezier(.16,1,.3,1) both; }
                .srm-card {
                    transition: all 0.25s ease;
                    cursor: pointer;
                }
                .srm-card:hover {
                    transform: translateY(-3px);
                    border-color: rgba(168,85,247,0.6) !important;
                    box-shadow: 0 12px 30px rgba(99,102,241,0.25);
                }
                .srm-next-btn {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .srm-next-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 14px 40px rgba(168,85,247,0.5), 0 0 70px rgba(99,102,241,0.3);
                }
                .srm-skip-btn { transition: all 0.25s ease; }
                .srm-skip-btn:hover {
                    background: rgba(255,255,255,0.05) !important;
                    border-color: rgba(255,255,255,0.3) !important;
                }
                .srm-count-up { animation: srmCountUp 0.6s ease both; }

                .srm-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 10px;
                    padding: 11px 14px;
                    color: #fff;
                    font-size: 13px;
                    outline: none;
                    transition: border-color 0.2s ease, background 0.2s ease;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .srm-input:focus {
                    border-color: rgba(168,85,247,0.7);
                    background: rgba(168,85,247,0.06);
                }
                .srm-input.error {
                    border-color: rgba(239,68,68,0.7);
                }
                .srm-input::placeholder { color: rgba(255,255,255,0.35); }
                .srm-label {
                    display: block;
                    font-size: 12px;
                    color: rgba(255,255,255,0.75);
                    margin-bottom: 6px;
                    font-weight: 500;
                }
                .srm-err-msg {
                    color: #fca5a5;
                    font-size: 11px;
                    margin-top: 4px;
                }
            `}</style>

            {/* ⚠ Don't close on overlay click */}
            <div className="srm-overlay">
                <div className="srm-modal" onClick={(e) => e.stopPropagation()}>
                    {/* HEADER */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: mob ? '14px 16px' : '18px 22px',
                            borderBottom: '1px solid rgba(139,92,246,0.18)',
                        }}
                    >
                        {/* Logo */}
                        <Image
                            src="/images/logo.png"
                            alt="MarsStation"
                            width={mob ? 90 : 120}
                            height={mob ? 28 : 36}
                            style={{
                                width: 'auto',
                                height: mob ? '28px' : '36px',
                                objectFit: 'contain',
                            }}
                            priority
                        />

                        {/* Right side: step badge + close button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {!showEstimate && !calculating && (
                                <div
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '999px',
                                        background: 'rgba(139,92,246,0.18)',
                                        border: '1px solid rgba(139,92,246,0.4)',
                                        fontSize: '11px',
                                        color: '#c4b5fd',
                                        fontWeight: 500,
                                    }}
                                >
                                    {currentLabel}
                                </div>
                            )}

                            {/* ✕ CLOSE BUTTON */}
                            <button
                                type="button"
                                onClick={() => setShowCloseConfirm(true)}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#cbd5e1',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease',
                                    padding: 0,
                                    lineHeight: 1,
                                    zIndex: 10,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
                                    e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)';
                                    e.currentTarget.style.color = '#fca5a5';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                    e.currentTarget.style.color = '#cbd5e1';
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* MAIN */}
                    {calculating ? (
                        <CalculatingScreen mob={mob} />
                    ) : showEstimate && estimate ? (
                        <EstimateScreen
                            mob={mob}
                            estimate={estimate}
                            services={services}
                            answers={answers}
                            steps={steps}
                            fmt={fmt}
                            submitted={submitted}
                            onClose={onClose}
                        />
                    ) : (
                        <>
                            {/* STEPPER */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: mob ? '16px 16px 8px' : '22px 28px 12px',
                                }}
                            >
                                {orderedSteps.map((sNum, i) => {
                                    const isCompleted = i < currentIndex;
                                    const isActive = i === currentIndex;
                                    return (
                                        <div
                                            key={sNum}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                flex: i === orderedSteps.length - 1 ? 'none' : 1,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: mob ? '22px' : '26px',
                                                    height: mob ? '22px' : '26px',
                                                    borderRadius: '50%',
                                                    background:
                                                        isCompleted || isActive
                                                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                                            : 'rgba(255,255,255,0.08)',
                                                    color:
                                                        isActive || isCompleted
                                                            ? '#fff'
                                                            : 'rgba(255,255,255,0.5)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: mob ? '10px' : '11px',
                                                    fontWeight: 600,
                                                    border: isActive
                                                        ? '2px solid rgba(139,92,246,0.5)'
                                                        : 'none',
                                                    boxShadow: isActive
                                                        ? '0 0 0 4px rgba(139,92,246,0.18)'
                                                        : 'none',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {isCompleted ? '✓' : i + 1}
                                            </div>
                                            {i !== orderedSteps.length - 1 && (
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        height: '2px',
                                                        background: isCompleted
                                                            ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                                                            : 'rgba(255,255,255,0.08)',
                                                        margin: '0 4px',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* BODY */}
                            <div
                                key={currentStep}
                                className="srm-body"
                                style={{
                                    padding: mob ? '14px 18px 18px' : '18px 28px 24px',
                                    flex: 1,
                                }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '5px 14px',
                                            borderRadius: '999px',
                                            background: 'rgba(139,92,246,0.18)',
                                            border: '1px solid rgba(139,92,246,0.35)',
                                            color: '#c4b5fd',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {currentStep === 1 ? sparkleIconSmall : cfg?.badgeIcon}
                                        {currentStep === 1 ? "Let's Get Started" : cfg?.badge}
                                    </span>
                                </div>

                                <h2
                                    style={{
                                        fontSize: mob ? '20px' : '24px',
                                        fontWeight: 700,
                                        color: '#fff',
                                        textAlign: 'center',
                                        margin: '0 0 8px',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {currentStep === 1 ? 'What Service Do You Need?' : cfg?.title}
                                </h2>
                                <p
                                    style={{
                                        fontSize: mob ? '12px' : '13px',
                                        color: 'rgba(255,255,255,0.6)',
                                        textAlign: 'center',
                                        margin: '0 0 22px',
                                    }}
                                >
                                    {currentStep === 1
                                        ? 'Please select one or more services you are interested in.'
                                        : cfg?.subtitle}
                                </p>

                                {/* STEP 1: Services */}
                                {currentStep === 1 && (
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px',
                                        }}
                                    >
                                        <ServiceVisualCard
                                            selected={services.includes('website')}
                                            onClick={() => toggleService('website')}
                                            illustration={<WebsiteIllustration />}
                                            smallIcon={<GlobeIcon color="#c4b5fd" />}
                                            title="Website Development"
                                            subtitle="WordPress, Full Stack, E-commerce, SaaS, ERP."
                                        />
                                        <ServiceVisualCard
                                            selected={services.includes('mobile')}
                                            onClick={() => toggleService('mobile')}
                                            illustration={<MobileIllustration />}
                                            smallIcon={<PhoneIcon color="#c4b5fd" />}
                                            title="Mobile App"
                                            subtitle="Android, iOS, Cross-Platform, NFC apps."
                                        />

                                        <ServiceVisualCard
                                            selected={services.includes('ai')}
                                            onClick={() => toggleService('ai')}
                                            illustration={<AIIllustration />}
                                            smallIcon={<SparkleIcon color="#c4b5fd" />}
                                            title="AI / Automation"
                                            subtitle="Chatbots, ML, WhatsApp automation."
                                        />
                                    </div>
                                )}

                                {/* STEP 2-7: Options */}
                                {currentStep > 1 && !isContactStep && cfg && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                        }}
                                    >
                                        {cfg.options.map((opt) => {
                                            const sel = (answers[currentStep] || []).includes(
                                                opt.id
                                            );
                                            return (
                                                <OptionRow
                                                    key={opt.id}
                                                    opt={opt}
                                                    selected={sel}
                                                    onClick={() =>
                                                        toggleAnswer(
                                                            currentStep,
                                                            opt.id,
                                                            cfg.multi ?? false
                                                        )
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                {/* STEP 8: Contact Form */}
                                {isContactStep && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '14px',
                                        }}
                                    >
                                        <div>
                                            <label className="srm-label">
                                                Full Name{' '}
                                                <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`srm-input ${contactErrors.name ? 'error' : ''}`}
                                                placeholder="John Doe"
                                                value={contact.name}
                                                onChange={(e) =>
                                                    updateContact('name', e.target.value)
                                                }
                                            />
                                            {contactErrors.name && (
                                                <div className="srm-err-msg">
                                                    {contactErrors.name}
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: mob ? '1fr' : '1fr 1fr',
                                                gap: '12px',
                                            }}
                                        >
                                            <div>
                                                <label className="srm-label">
                                                    Email{' '}
                                                    <span style={{ color: '#ef4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`srm-input ${contactErrors.email ? 'error' : ''}`}
                                                    placeholder="you@example.com"
                                                    value={contact.email}
                                                    onChange={(e) =>
                                                        updateContact('email', e.target.value)
                                                    }
                                                />
                                                {contactErrors.email && (
                                                    <div className="srm-err-msg">
                                                        {contactErrors.email}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="srm-label">
                                                    Phone{' '}
                                                    <span style={{ color: '#ef4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    className={`srm-input ${contactErrors.phone ? 'error' : ''}`}
                                                    placeholder="+880 1XXX XXXXXX"
                                                    value={contact.phone}
                                                    onChange={(e) =>
                                                        updateContact('phone', e.target.value)
                                                    }
                                                />
                                                {contactErrors.phone && (
                                                    <div className="srm-err-msg">
                                                        {contactErrors.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="srm-label">
                                                Company / Organization (optional)
                                            </label>
                                            <input
                                                type="text"
                                                className="srm-input"
                                                placeholder="Acme Inc."
                                                value={contact.company}
                                                onChange={(e) =>
                                                    updateContact('company', e.target.value)
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className="srm-label">
                                                Preferred Contact Method{' '}
                                                <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: mob
                                                        ? '1fr 1fr'
                                                        : 'repeat(4, 1fr)',
                                                    gap: '8px',
                                                }}
                                            >
                                                {(
                                                    [
                                                        {
                                                            id: 'email',
                                                            label: 'Email',
                                                            icon: <MailIcon color="currentColor" />,
                                                        },
                                                        {
                                                            id: 'phone',
                                                            label: 'Phone',
                                                            icon: (
                                                                <PhoneIcon color="currentColor" />
                                                            ),
                                                        },
                                                        {
                                                            id: 'whatsapp',
                                                            label: 'WhatsApp',
                                                            icon: <ChatIcon color="currentColor" />,
                                                        },
                                                        {
                                                            id: 'meeting',
                                                            label: 'Meeting',
                                                            icon: (
                                                                <VideoIcon color="currentColor" />
                                                            ),
                                                        },
                                                    ] as const
                                                ).map((m) => {
                                                    const active =
                                                        contact.preferredContact === m.id;
                                                    return (
                                                        <button
                                                            key={m.id}
                                                            type="button"
                                                            onClick={() =>
                                                                updateContact(
                                                                    'preferredContact',
                                                                    m.id
                                                                )
                                                            }
                                                            style={{
                                                                padding: '10px 8px',
                                                                borderRadius: '10px',
                                                                background: active
                                                                    ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2))'
                                                                    : 'rgba(255,255,255,0.04)',
                                                                border: active
                                                                    ? '1.5px solid rgba(168,85,247,0.7)'
                                                                    : '1px solid rgba(255,255,255,0.12)',
                                                                color: active
                                                                    ? '#fff'
                                                                    : 'rgba(255,255,255,0.65)',
                                                                cursor: 'pointer',
                                                                fontSize: '11.5px',
                                                                fontWeight: 600,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                transition: 'all 0.25s ease',
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    display: 'flex',
                                                                }}
                                                            >
                                                                <svg
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                >
                                                                    {m.id === 'email' && (
                                                                        <>
                                                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                                            <polyline points="22,6 12,13 2,6" />
                                                                        </>
                                                                    )}
                                                                    {m.id === 'phone' && (
                                                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                                    )}
                                                                    {m.id === 'whatsapp' && (
                                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                                    )}
                                                                    {m.id === 'meeting' && (
                                                                        <>
                                                                            <polygon points="23 7 16 12 23 17 23 7" />
                                                                            <rect
                                                                                x="1"
                                                                                y="5"
                                                                                width="15"
                                                                                height="14"
                                                                                rx="2"
                                                                                ry="2"
                                                                            />
                                                                        </>
                                                                    )}
                                                                </svg>
                                                            </span>
                                                            {m.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="srm-label">
                                                Additional Notes (optional)
                                            </label>
                                            <textarea
                                                className="srm-input"
                                                rows={3}
                                                placeholder="Anything else we should know?"
                                                value={contact.notes}
                                                onChange={(e) =>
                                                    updateContact('notes', e.target.value)
                                                }
                                                style={{ resize: 'vertical', minHeight: 70 }}
                                            />
                                        </div>

                                        {submitError && (
                                            <div
                                                style={{
                                                    padding: '10px 14px',
                                                    background: 'rgba(239,68,68,0.1)',
                                                    border: '1px solid rgba(239,68,68,0.35)',
                                                    color: '#fca5a5',
                                                    borderRadius: '8px',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                ⚠ {submitError}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Helper bar */}
                                <div
                                    style={{
                                        marginTop: '18px',
                                        padding: '12px 14px',
                                        background: 'rgba(139,92,246,0.1)',
                                        border: '1px solid rgba(139,92,246,0.25)',
                                        color: 'rgba(255,255,255,0.75)',
                                        borderRadius: '10px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '26px',
                                            height: '26px',
                                            borderRadius: '50%',
                                            background: 'rgba(139,92,246,0.25)',
                                            color: '#a78bfa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {currentStep === 1 ? sparkleIconSmall : infoIconSmall}
                                    </div>
                                    {currentStep === 1
                                        ? 'Select multiple services if you need them combined. You can modify selections in next steps.'
                                        : cfg?.helper}
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div
                                style={{
                                    padding: mob ? '14px 18px 18px' : '18px 28px 24px',
                                    display: 'flex',
                                    gap: '12px',
                                    borderTop: '1px solid rgba(139,92,246,0.18)',
                                    background: 'rgba(0,0,0,0.18)',
                                }}
                            >
                                {currentIndex > 0 && (
                                    <button
                                        onClick={back}
                                        className="srm-skip-btn"
                                        disabled={submitting}
                                        style={{
                                            padding: mob ? '12px 16px' : '14px 20px',
                                            borderRadius: '999px',
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.18)',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontWeight: 500,
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                            fontSize: mob ? '12px' : '13px',
                                            opacity: submitting ? 0.5 : 1,
                                        }}
                                    >
                                        ← Back
                                    </button>
                                )}
                                {cfg?.skippable && currentStep > 1 && !isContactStep && (
                                    <button
                                        onClick={skip}
                                        className="srm-skip-btn"
                                        style={{
                                            flex: 1,
                                            padding: mob ? '12px' : '14px',
                                            borderRadius: '999px',
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.18)',
                                            color: 'rgba(255,255,255,0.7)',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            fontSize: mob ? '13px' : '14px',
                                        }}
                                    >
                                        Skip
                                    </button>
                                )}
                                <button
                                    onClick={next}
                                    disabled={!canProceed || submitting}
                                    className="srm-next-btn"
                                    style={{
                                        flex:
                                            cfg?.skippable && currentStep > 1 && !isContactStep
                                                ? 2
                                                : 1,
                                        padding: mob ? '12px 24px' : '14px 32px',
                                        borderRadius: '999px',
                                        border: '1px solid rgba(168,85,247,0.5)',
                                        background:
                                            canProceed && !submitting
                                                ? 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #6366f1 100%)'
                                                : 'rgba(255,255,255,0.06)',
                                        color: '#fff',
                                        fontWeight: 600,
                                        cursor:
                                            canProceed && !submitting ? 'pointer' : 'not-allowed',
                                        fontSize: mob ? '13px' : '15px',
                                        letterSpacing: '0.02em',
                                        opacity: canProceed && !submitting ? 1 : 0.5,
                                        boxShadow:
                                            canProceed && !submitting
                                                ? '0 10px 30px rgba(168,85,247,0.35), 0 0 50px rgba(99,102,241,0.2)'
                                                : 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <span
                                                style={{
                                                    width: 14,
                                                    height: 14,
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    borderTop: '2px solid #fff',
                                                    borderRadius: '50%',
                                                    animation: 'srmSpin 0.8s linear infinite',
                                                }}
                                            />
                                            Submitting...
                                        </>
                                    ) : isContactStep ? (
                                        <>
                                            Get Estimate
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                                <polyline points="12 5 19 12 12 19" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showCloseConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,.65)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999999999,
                        padding: '20px',
                    }}
                    onClick={() => setShowCloseConfirm(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: mob ? '90%' : '400px',
                            padding: '35px 30px',
                            borderRadius: '20px',
                            textAlign: 'center',
                            background: 'linear-gradient(145deg,#ffffff,#eef0ff)',
                            boxShadow: '0 30px 80px rgba(90,40,200,.35)',
                            animation: 'srmCloseConfirmScale .35s ease',
                        }}
                    >
                        <div
                            style={{
                                width: '65px',
                                height: '65px',
                                margin: '0 auto 20px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                color: '#fff',
                                background: 'linear-gradient(135deg, #732aeb, #5a1ec8)',
                                boxShadow: '0 10px 30px rgba(115,42,235,.35)',
                            }}
                        >
                            ?
                        </div>

                        <h3
                            style={{
                                color: '#10162f',
                                fontSize: mob ? '20px' : '22px',
                                marginBottom: '10px',
                                fontWeight: 600,
                            }}
                        >
                            Close?
                        </h3>

                        <p
                            style={{
                                color: '#4b5563',
                                fontSize: '14px',
                                lineHeight: 1.6,
                                marginBottom: '25px',
                            }}
                        >
                            Are you sure you want to close? Your progress will be lost.
                        </p>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                onClick={() => setShowCloseConfirm(false)}
                                style={{
                                    flex: 1,
                                    padding: '11px 0',
                                    borderRadius: '10px',
                                    border: '1px solid #d1d5db',
                                    background: '#fff',
                                    color: '#374151',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    transition: '.25s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f9fafb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#fff';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowCloseConfirm(false);
                                    onClose();
                                }}
                                style={{
                                    flex: 1,
                                    padding: '11px 0',
                                    borderRadius: '10px',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #732aeb, #5a1ec8)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    fontFamily: 'inherit',
                                    transition: '.25s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Yes, Close
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes srmCloseConfirmScale {
                            from { opacity:0; transform:scale(.85); }
                            to { opacity:1; transform:scale(1); }
                        }
                    `}</style>
                </div>
            )}
        </>
    );
}

/* ─── Fallback estimate ─── */
function computeFallbackEstimate(
    services: ServiceType[],
    answers: Record<number, string[]>
): ProjectEstimate {
    const base: Record<ServiceType, number> = {
        website: 2000,
        mobile: 4000,

        ai: 5500,
    };
    let total = services.reduce((sum, s) => sum + base[s], 0);
    const featuresCount = (answers[5] || []).length;
    total += featuresCount * 800;
    const weeks = services.length * 4 + featuresCount;
    return {
        minPrice: Math.round(total * 0.85),
        maxPrice: Math.round(total * 1.3),
        weeks,
        summary:
            'A tailored solution that fits your budget and goals with modern technologies, clean architecture, and a smooth user experience.',
        techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    };
}

/* ───────── Calculating Screen ───────── */
function CalculatingScreen({ mob }: { mob: boolean }) {
    return (
        <div
            style={{
                minHeight: mob ? '70vh' : '65vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                textAlign: 'center',
            }}
        >
            <div
                style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'srmPulse 1.4s ease-in-out infinite',
                    boxShadow: '0 0 40px rgba(139,92,246,0.5)',
                }}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="#fff"
                    style={{ animation: 'srmSpin 1.6s linear infinite' }}
                >
                    <path d="M12 2L9.5 9 2 12l7.5 3L12 22l2.5-7L22 12l-7.5-3L12 2z" />
                </svg>
            </div>

            <h3 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>
                Preparing your estimate...
            </h3>

            <p
                style={{
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    fontSize: '13px',
                    maxWidth: '320px',
                    lineHeight: 1.6,
                }}
            >
                Calculating estimated cost, timeline, and the best tech stack for your project.
            </p>
        </div>
    );
}

/* ───────── Estimate Screen ───────── */
function EstimateScreen({
    mob,
    estimate,
    services,
    answers,
    steps,
    fmt,
    submitted,
    onClose,
}: {
    mob: boolean;
    estimate: ProjectEstimate;
    services: ServiceType[];
    answers: Record<number, string[]>;
    steps: Record<number, StepConfig>;
    fmt: (n: number) => string;
    submitted: boolean;
    onClose: () => void;
}) {
    return (
        <div
            className="srm-count-up"
            style={{ padding: mob ? '22px 18px 24px' : '30px 28px 28px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div
                    style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(139,92,246,0.5)',
                    }}
                >
                    {submitted ? (
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                            <path d="M12 2L9.5 9 2 12l7.5 3L12 22l2.5-7L22 12l-7.5-3L12 2z" />
                        </svg>
                    )}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 14px',
                        borderRadius: '999px',
                        background: submitted ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.18)',
                        border: submitted
                            ? '1px solid rgba(34,197,94,0.4)'
                            : '1px solid rgba(139,92,246,0.35)',
                        color: submitted ? '#86efac' : '#c4b5fd',
                        fontSize: '11px',
                        fontWeight: 600,
                        marginBottom: '12px',
                    }}
                >
                    {submitted ? '✓ Request Submitted' : '✨ Project Estimate'}
                </span>
                <h2
                    style={{
                        fontSize: mob ? '22px' : '26px',
                        fontWeight: 700,
                        color: '#fff',
                        margin: '0 0 8px',
                    }}
                >
                    {submitted ? 'Thank You!' : 'Your Estimated Project Cost'}
                </h2>
                <p
                    style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '13px',
                        margin: 0,
                        lineHeight: 1.6,
                    }}
                >
                    {submitted
                        ? 'We have received your request and will contact you within 24 hours.'
                        : 'Based on your requirements, here is a smart estimate.'}
                </p>
            </div>

            {/* Cost */}
            <div
                style={{
                    padding: mob ? '20px' : '26px',
                    borderRadius: '16px',
                    background:
                        'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(99,102,241,0.12))',
                    border: '1px solid rgba(139,92,246,0.4)',
                    textAlign: 'center',
                    marginBottom: '14px',
                    boxShadow: 'inset 0 0 30px rgba(139,92,246,0.08)',
                }}
            >
                <div
                    style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                    }}
                >
                    Estimated Range
                </div>
                <div
                    style={{
                        fontSize: mob ? '26px' : '34px',
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #e9d5ff, #a78bfa, #818cf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.5px',
                    }}
                >
                    {fmt(estimate.minPrice)} - {fmt(estimate.maxPrice)}
                </div>
                <div
                    style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '12px',
                        marginTop: '10px',
                    }}
                >
                    ⏱ Estimated timeline: <b style={{ color: '#fff' }}>~{estimate.weeks} weeks</b>
                </div>
            </div>

            {/* Project Analysis */}
            <div
                style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    marginBottom: '14px',
                }}
            >
                <div
                    style={{
                        color: '#c4b5fd',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        fontWeight: 600,
                        marginBottom: '8px',
                    }}
                >
                    Project Analysis
                </div>
                <p
                    style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '12.5px',
                        margin: 0,
                        lineHeight: 1.6,
                    }}
                >
                    {estimate.summary}
                </p>
            </div>

            {/* Tech stack */}
            <div
                style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '14px',
                }}
            >
                <div
                    style={{
                        color: '#c4b5fd',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        fontWeight: 600,
                        marginBottom: '10px',
                    }}
                >
                    Recommended Tech Stack
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {estimate.techStack.map((t, i) => (
                        <span
                            key={i}
                            style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background:
                                    'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.15))',
                                border: '1px solid rgba(139,92,246,0.3)',
                                color: '#e9d5ff',
                                fontSize: '11px',
                                fontWeight: 600,
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Selections */}
            <div
                style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '14px',
                }}
            >
                <div
                    style={{
                        color: '#c4b5fd',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        fontWeight: 600,
                        marginBottom: '10px',
                    }}
                >
                    Your Selections
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {services.map((s) => (
                        <span
                            key={s}
                            style={{
                                padding: '4px 10px',
                                borderRadius: '999px',
                                background: 'rgba(139,92,246,0.2)',
                                border: '1px solid rgba(139,92,246,0.4)',
                                color: '#e9d5ff',
                                fontSize: '11px',
                                fontWeight: 500,
                                textTransform: 'capitalize',
                            }}
                        >
                            {s}
                        </span>
                    ))}
                    {Object.entries(answers).map(([sIdx, ids]) =>
                        ids.map((id) => {
                            const stp = steps[Number(sIdx)];
                            const opt = stp?.options.find((o) => o.id === id);
                            if (!opt) return null;
                            return (
                                <span
                                    key={`${sIdx}-${id}`}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '999px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {opt.title}
                                </span>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Disclaimer */}
            <div
                style={{
                    padding: '12px 14px',
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    color: 'rgba(255,255,255,0.75)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    lineHeight: 1.6,
                    marginBottom: '18px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                }}
            >
                <span style={{ color: '#fbbf24', flexShrink: 0 }}>⚠</span>
                <div>
                    This is a rough estimate. Actual pricing depends on detailed requirements and
                    final scope. We will share the exact quote shortly.
                </div>
            </div>

            <button
                onClick={onClose}
                className="srm-next-btn"
                style={{
                    width: '100%',
                    padding: mob ? '12px' : '14px',
                    borderRadius: '999px',
                    border: '1px solid rgba(168,85,247,0.5)',
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #6366f1 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: mob ? '13px' : '15px',
                    letterSpacing: '0.02em',
                    boxShadow: '0 10px 30px rgba(168,85,247,0.35), 0 0 50px rgba(99,102,241,0.2)',
                }}
            >
                Close
            </button>
        </div>
    );
}

/* ───────── Sub-components ───────── */
function ServiceVisualCard({
    selected,
    onClick,
    illustration,
    smallIcon,
    title,
    subtitle,
}: {
    selected: boolean;
    onClick: () => void;
    illustration: React.ReactNode;
    smallIcon: React.ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div
            onClick={onClick}
            className="srm-card"
            style={{
                position: 'relative',
                background: selected
                    ? 'linear-gradient(180deg, rgba(139,92,246,0.25), rgba(99,102,241,0.18))'
                    : 'rgba(255,255,255,0.04)',
                border: selected
                    ? '2px solid rgba(168,85,247,0.7)'
                    : '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '16px 12px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                boxShadow: selected
                    ? '0 10px 28px rgba(139,92,246,0.35), inset 0 0 20px rgba(139,92,246,0.08)'
                    : 'none',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    background: selected
                        ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                        : 'rgba(255,255,255,0.06)',
                    border: selected ? '2px solid #a78bfa' : '1.5px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                }}
            >
                {selected && (
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>
            <div
                style={{
                    marginTop: '6px',
                    height: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {illustration}
            </div>
            <div
                style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(139,92,246,0.18)',
                    border: '1px solid rgba(139,92,246,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px',
                }}
            >
                {smallIcon}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                {title}
            </div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>
                {subtitle}
            </div>
        </div>
    );
}

function OptionRow({
    opt,
    selected,
    onClick,
}: {
    opt: OptionItem;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="srm-card"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: selected
                    ? 'linear-gradient(180deg, rgba(139,92,246,0.18), rgba(99,102,241,0.1))'
                    : 'rgba(255,255,255,0.04)',
                border: selected
                    ? '1.5px solid rgba(168,85,247,0.6)'
                    : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: selected ? '0 8px 20px rgba(139,92,246,0.22)' : 'none',
            }}
        >
            <div
                style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: opt.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: opt.iconColor,
                    flexShrink: 0,
                }}
            >
                {opt.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: '2px',
                    }}
                >
                    {opt.title}
                </div>
                <div
                    style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}
                >
                    {opt.description}
                </div>
            </div>
            <div
                style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    background: selected
                        ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                        : 'rgba(255,255,255,0.05)',
                    border: selected ? '2px solid #a78bfa' : '1.5px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.25s ease',
                }}
            >
                {selected && (
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>
        </div>
    );
}

/* ───────── ICONS ───────── */
function CodeIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    );
}
function GearIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}
function AndroidIcon({ color }: { color: string }) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
            <path d="M17.6 9.48l1.84-3.18a.36.36 0 0 0-.13-.49.36.36 0 0 0-.49.13l-1.86 3.22a11.43 11.43 0 0 0-9.92 0L5.18 5.94a.36.36 0 0 0-.49-.13.36.36 0 0 0-.13.49l1.84 3.18A10.66 10.66 0 0 0 1 17.61h22a10.66 10.66 0 0 0-5.4-8.13zM7 14.25a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm10 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" />
        </svg>
    );
}
function AppleIcon({ color }: { color: string }) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
            <path d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
    );
}
function LayersIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    );
}
function DollarIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
}
function ClockIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
function CalendarIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}
function BoltIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={color}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
}
function UserIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
function CardIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    );
}
function ChartIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
}
function ChatIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}
function MailIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}
function GlobeIcon({ color }: { color: string }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}
function MonitorIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    );
}
function PhoneIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
    );
}
function StarIcon({ color }: { color: string }) {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={color}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
function BriefcaseIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}
function SparkleIcon({ color }: { color: string }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
        </svg>
    );
}
function MoonIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}
function PenIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        </svg>
    );
}
function CartIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    );
}
function CloudIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17.5 19a4.5 4.5 0 1 0-1.36-8.79A6 6 0 0 0 6 12.5a4.5 4.5 0 0 0 0 9h11.5z" />
        </svg>
    );
}
function BellIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
function PlugIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 16.59L13.41 12 18 7.41 16.59 6 12 10.59 7.41 6 6 7.41 10.59 12 6 16.59 7.41 18 12 13.41 16.59 18z" />
        </svg>
    );
}
function VideoIcon({ color }: { color: string }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    );
}

/* ───────── Mini badge icons ───────── */
const sparkleIconSmall = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
    </svg>
);
const webIconSmall = (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
);
const phoneIconSmall = (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="5" y="2" width="14" height="20" rx="2" />
    </svg>
);
const clockIconSmall = (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
const starIconSmall = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);
const mailIconSmall = (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);
const infoIconSmall = (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
const aiIconSmall = (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
    </svg>
);
const scaleIconSmall = (
    <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

/* ───────── Illustrations ───────── */
function WebsiteIllustration() {
    return (
        <svg width="90" height="70" viewBox="0 0 200 160" fill="none">
            <rect
                x="40"
                y="20"
                width="130"
                height="90"
                rx="6"
                fill="rgba(139,92,246,0.18)"
                stroke="#a78bfa"
                strokeWidth="2"
            />
            <rect x="50" y="32" width="110" height="68" rx="3" fill="rgba(255,255,255,0.08)" />
            <rect x="95" y="110" width="20" height="12" fill="#7c3aed" />
            <rect x="80" y="122" width="50" height="4" rx="2" fill="#7c3aed" />
            <rect x="58" y="40" width="50" height="8" rx="2" fill="#a78bfa" />
            <rect x="58" y="54" width="80" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="58" y="62" width="60" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="58" y="74" width="40" height="16" rx="3" fill="#8b5cf6" />
        </svg>
    );
}
function MobileIllustration() {
    return (
        <svg width="60" height="80" viewBox="0 0 100 130" fill="none">
            <rect
                x="20"
                y="5"
                width="60"
                height="120"
                rx="10"
                fill="rgba(139,92,246,0.25)"
                stroke="#a78bfa"
                strokeWidth="2"
            />
            <rect x="24" y="14" width="52" height="100" rx="3" fill="rgba(255,255,255,0.08)" />
            <rect x="42" y="9" width="16" height="3" rx="1.5" fill="#1e1238" />
            <circle cx="50" cy="36" r="8" fill="#a78bfa" />
            <rect x="32" y="52" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
            <rect x="32" y="60" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
            <rect x="32" y="73" width="36" height="20" rx="3" fill="rgba(255,255,255,0.1)" />
            <rect x="32" y="98" width="36" height="10" rx="2" fill="#6366f1" />
        </svg>
    );
}

function AIIllustration() {
    return (
        <svg width="90" height="80" viewBox="0 0 140 130" fill="none">
            <circle
                cx="70"
                cy="65"
                r="40"
                fill="rgba(139,92,246,0.15)"
                stroke="#a78bfa"
                strokeWidth="2"
            />
            <circle cx="70" cy="65" r="22" fill="rgba(139,92,246,0.25)" />
            <path d="M70 50 L74 60 L84 64 L74 68 L70 78 L66 68 L56 64 L66 60 Z" fill="#e9d5ff" />
            <circle cx="20" cy="30" r="6" fill="#8b5cf6" />
            <circle cx="120" cy="40" r="5" fill="#6366f1" />
            <circle cx="115" cy="100" r="7" fill="#a855f7" />
            <circle cx="25" cy="105" r="4" fill="#c084fc" />
            <path d="M28 32 L52 56" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
            <path d="M115 44 L88 60" stroke="#6366f1" strokeWidth="1" opacity="0.5" />
            <path d="M110 96 L88 78" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
            <path d="M30 102 L52 80" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
        </svg>
    );
}
