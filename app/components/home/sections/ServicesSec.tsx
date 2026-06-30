// components/home/ServicesSec.tsx
'use client';

import { useState } from 'react';
import { SectionHeading } from '../../common/SectionHeading';

interface Props {
    cardsIn: boolean;
    mob: boolean;
    onGetStarted?: () => void;
}

interface ServiceTab {
    id: number;
    title: string;
    tech: string;
    techColor: string;
    icon: React.ReactNode;
    iconColor: string;
    description: string;
    features: string[];
    projects: { name: string; type: string; img: string; link: string }[];
}

export function ServicesSec({ cardsIn, mob, onGetStarted }: Props) {
    const [activeTab, setActiveTab] = useState(1);

    const services: ServiceTab[] = [
        {
            id: 1,
            title: 'Business Websites',
            tech: 'WordPress',
            techColor: '#3b82f6',
            iconColor: '#60a5fa',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
            ),
            description:
                'We craft professional business websites that reflect your brand identity, attract clients and drive growth using modern WordPress technology.',
            features: [
                'Custom WordPress Development',
                'Responsive Design',
                'SEO Optimized',
                'Lightning Fast Performance',
                'Easy Content Management',
                'Premium Support',
            ],
            projects: [
                {
                    name: 'Sterling and Reeve',
                    type: 'WordPress Site',
                    img: '/images/Sterling%20and%20Reeve.png',
                    link: 'https://sterlingandreeve.co.uk/',
                },
                {
                    name: 'AgencyHub',
                    type: 'Corporate Site',
                    img: '/images/AgencyHub.png',
                    link: 'https://agencyhub.com/',
                },
                {
                    name: 'StartUpify',
                    type: 'Landing Page',
                    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
                    link: 'https://startupify.club/',
                },
            ],
        },
        {
            id: 2,
            title: 'E-Commerce Websites',
            tech: 'WordPress',
            techColor: '#3b82f6',
            iconColor: '#c084fc',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
            ),
            description:
                'We build powerful, secure and user-friendly e-commerce websites using WordPress and WooCommerce that help you sell more and manage everything effortlessly.',
            features: [
                'Custom WooCommerce Development',
                'Payment Gateway Integration',
                'Product Management System',
                'Shipping & Tax Configuration',
                'SEO Optimized & Mobile Friendly',
                'Speed Optimization',
            ],
            projects: [
                {
                    name: 'ShopLux',
                    type: 'WooCommerce Store',
                    img: '/images/ShopLux.png',
                    link: 'https://shoplux-ng.netlify.app/',
                },
                {
                    name: 'FurniCasa',
                    type: 'WooCommerce Store',
                    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
                    link: 'https://furnicasa.store/',
                },
                {
                    name: 'BookNest',
                    type: 'WooCommerce Store',
                    img: '/images/BookNest.png',
                    link: 'https://booknest.app/',
                },
            ],
        },
        {
            id: 3,
            title: 'AI Automation',
            tech: 'AI / ML',
            techColor: '#f43f5e',
            iconColor: '#fb7185',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                    <path d="M16 14h.01" />
                    <path d="M8 14h.01" />
                    <path d="M12 16v2" />
                    <path d="M6 10H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1" />
                    <path d="M18 10h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" />
                    <rect x="5" y="10" width="14" height="10" rx="3" />
                </svg>
            ),
            description:
                'We build intelligent AI-powered automation solutions that streamline your business workflows, reduce manual tasks and boost productivity with cutting-edge machine learning technology.',
            features: [
                'AI Chatbot Development',
                'Workflow Automation',
                'Predictive Analytics',
                'Natural Language Processing',
                'Custom AI Model Training',
                'API & System Integration',
            ],
            projects: [
                {
                    name: 'Clip Forge AI',
                    type: 'AI Automation',
                    img: 'https://lgaomkiqqxmfzlmbwzag.supabase.co/storage/v1/object/public/portfolio-images/Project40.png',
                    link: 'https://clip-forge-ai-frontend-91gz97irp-sahed44.vercel.app/',
                },
                {
                    name: 'SmartBot',
                    type: 'AI Chatbot',
                    img: '/images/SmartBot-AI.png',
                    link: 'https://play.google.com/store/apps/details?id=com.yogeshj.chatbot&pcampaignid=web_share',
                },
                {
                    name: 'DataMind',
                    type: 'ML Platform',
                    img: '/images/DataMind.png',
                    link: 'https://aidata-mind.com/',
                },
            ],
        },
        {
            id: 4,
            title: 'SaaS Website',
            tech: 'Full Stack',
            techColor: '#22c55e',
            iconColor: '#4ade80',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M17.5 19a4.5 4.5 0 1 0-1.36-8.79A6 6 0 0 0 6 12.5a4.5 4.5 0 0 0 0 9h11.5z" />
                </svg>
            ),
            description:
                'Modern SaaS platforms built with cutting-edge full-stack technologies for scalability, performance, and growth.',
            features: [
                'Multi-tenant Architecture',
                'Subscription Management',
                'Real-time Analytics',
                'API Integration',
                'Cloud Deployment',
                'Enterprise Security',
            ],
            projects: [
                {
                    name: 'Sisfarma POS',
                    type: 'SaaS Platform',
                    img: '/images/Sisfarma%20POS.png',
                    link: 'http://erp.blesslifeltd.com/',
                },
                {
                    name: 'BookingXpert',
                    type: 'SaaS Platform',
                    img: '/images/BookingXpert.png',
                    link: 'https://bookingxpert.org/',
                },
                {
                    name: 'Crypto Luxor',
                    type: 'SaaS Platform',
                    img: '/images/Crypto%20Luxor.png',
                    link: 'https://cryptoluxor.com/',
                },
            ],
        },
        {
            id: 5,
            title: 'Custom Website',
            tech: 'Full Stack',
            techColor: '#f97316',
            iconColor: '#fb923c',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
            ),
            description:
                'Tailor-made custom web applications built from the ground up with the latest technologies to fit your unique requirements.',
            features: [
                'Custom UI/UX Design',
                'Modern Tech Stack (React/Next.js)',
                'Scalable Backend',
                'Database Architecture',
                'Third-party Integrations',
                'Continuous Support',
            ],
            projects: [
                {
                    name: 'AmazCart',
                    type: 'Custom App',
                    img: '/images/AmazCart.png',
                    link: 'https://amazcart.ischooll.com',
                },
                {
                    name: 'Lotus PMC',
                    type: 'Custom App',
                    img: 'https://lgaomkiqqxmfzlmbwzag.supabase.co/storage/v1/object/public/portfolio-images/Project37.png',
                    link: 'https://lotus-pmc-web-frontend-mw9f8gxv0-sahed44.vercel.app/',
                },
                {
                    name: 'Kahad HR',
                    type: 'Custom App',
                    img: '/images/KahadHR.png',
                    link: 'https://kahadhr.com',
                },
            ],
        },
        {
            id: 6,
            title: 'E-Commerce Solutions',
            tech: 'Full Stack',
            techColor: '#f97316',
            iconColor: '#fbbf24',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            ),
            description:
                'Enterprise-grade custom e-commerce solutions with complete control over features, integrations, and user experience.',
            features: [
                'Headless Commerce',
                'Multi-channel Selling',
                'Inventory Management',
                'Advanced Analytics',
                'Multiple Payment Methods',
                'Global Shipping Support',
            ],
            projects: [
                {
                    name: 'AmazCart',
                    type: 'Custom App',
                    img: '/images/AmazCart.png',
                    link: 'https://amazcart.ischooll.com',
                },
                {
                    name: 'Saheds Food',
                    type: 'Custom Store',
                    img: '/images/Saheds%20Food.png',
                    link: 'https://saheds-food.netlify.app/',
                },
                {
                    name: 'TrendBox',
                    type: 'Custom Store',
                    img: '/images/TrendBox.png',
                    link: 'https://trendbox.co.in/',
                },
            ],
        },
        {
            id: 7,
            title: 'Android App',
            tech: 'Android',
            techColor: '#22c55e',
            iconColor: '#4ade80',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
            ),
            description:
                'Native Android applications built with Kotlin/Java that deliver smooth, fast and engaging user experiences.',
            features: [
                'Native Kotlin/Java Development',
                'Material Design UI',
                'Play Store Deployment',
                'Push Notifications',
                'Offline Support',
                'Performance Optimization',
            ],
            projects: [
                {
                    name: 'Kleancor',
                    type: 'Android App',
                    img: '/images/Kleancor.png',
                    link: 'https://play.google.com/store/apps/details?id=com.kleancor.kleancorapp&pcampaignid=web_share',
                },
                {
                    name: 'Foodi - Food Delivery',
                    type: 'Android App',
                    img: '/images/Foodi%20-%20Food%20Delivery.png',
                    link: 'https://play.google.com/store/apps/details?id=com.foodiBd&pcampaignid=web_share',
                },
                {
                    name: 'Taskeen',
                    type: 'Android App',
                    img: '/images/Taskeen.png',
                    link: 'https://play.google.com/store/apps/details?id=taskeenaloula.realtor&pcampaignid=web_share',
                },
            ],
        },
        {
            id: 8,
            title: 'iPhone (iOS) App',
            tech: 'iOS',
            techColor: '#94a3b8',
            iconColor: '#cbd5e1',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.86-3.08.41-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.41C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
            ),
            description:
                'Premium iOS applications built with Swift/SwiftUI for iPhone and iPad with native performance and Apple guidelines compliance.',
            features: [
                'Native Swift/SwiftUI',
                'Human Interface Design',
                'App Store Deployment',
                'iCloud Integration',
                'Apple Pay Support',
                'iPad Optimization',
            ],
            projects: [
                {
                    name: 'Kleancor',
                    type: 'iOS App',
                    img: '/images/Kleancor.png',
                    link: 'https://play.google.com/store/apps/details?id=com.kleancor.kleancorapp&pcampaignid=web_share',
                },
                {
                    name: 'TravelLog',
                    type: 'iOS App',
                    img: '/images/Travelog%20-%20Travel%20Map%20Tracker.png',
                    link: 'https://play.google.com/store/apps/details?id=com.ahnlee.jidoapp&pcampaignid=web_share',
                },
                {
                    name: 'MusicVibe',
                    type: 'iOS App',
                    img: '/images/Musivibe%20-%20Enjoy%20Various%20Music.png',
                    link: 'https://play.google.com/store/apps/details?id=com.musivibe.player.allmusic&pcampaignid=web_share',
                },
            ],
        },
        {
            id: 9,
            title: 'Cross-Platform App',
            tech: 'Android + iPhone',
            techColor: '#3b82f6',
            iconColor: '#60a5fa',
            icon: (
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            ),
            description:
                'Cross-platform mobile applications using Flutter & React Native that work seamlessly on both iOS and Android.',
            features: [
                'Single Codebase',
                'Flutter / React Native',
                'Native Performance',
                'Faster Time to Market',
                'Cost Effective',
                'Easy Maintenance',
            ],
            projects: [
                {
                    name: 'Kleancor',
                    type: 'React Native',
                    img: '/images/Kleancor.png',
                    link: 'https://play.google.com/store/apps/details?id=com.kleancor.kleancorapp&pcampaignid=web_share',
                },
                {
                    name: 'ShopHub',
                    type: 'React Native',
                    img: '/images/ShopHub.png',
                    link: 'https://play.google.com/store/apps/details?id=com.zpqv.shophub.shopper&pcampaignid=web_share',
                },
                {
                    name: 'EduLearn',
                    type: 'React Native',
                    img: '/images/EduLearn.png',
                    link: 'https://play.google.com/store/apps/details?id=com.edulearn.classes.app&pcampaignid=web_share',
                },
            ],
        },
    ];

    const active = services[activeTab];

    const bottomFeatures = [
        {
            title: 'Secure & Reliable',
            desc: 'Security is our top priority for every e-commerce website.',
            color: '#a855f7',
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
        },
        {
            title: 'High Performance',
            desc: 'Optimized for speed to ensure better user experience.',
            color: '#3b82f6',
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            title: 'Boost Sales',
            desc: 'Conversion-focused design that helps you sell more.',
            color: '#22c55e',
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
        },
        {
            title: 'Dedicated Support',
            desc: 'We are always here to support you at every step.',
            color: '#a855f7',
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <style>{`
                @keyframes svcFadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
                @keyframes svcFlyLeft { from { opacity:0; transform:translateX(-60px); } to { opacity:1; transform:translateX(0); } }
                @keyframes svcFlyRight { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
                @keyframes svcTabPop { from { opacity:0; transform:translateY(20px) scale(0.9); } to { opacity:1; transform:translateY(0) scale(1); } }

                .svc-tab {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .svc-tab:hover {
                    transform: translateY(-3px);
                    border-color: rgba(168,85,247,0.5) !important;
                }
                .svc-project-card {
                    transition: transform 0.4s cubic-bezier(.16,1,.3,1);
                }
                .svc-project-card:hover {
                    transform: translateY(-6px);
                }
                .svc-cta-btn {
                    transition: all 0.3s ease;
                }
                .svc-cta-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 30px rgba(168,85,247,0.4) !important;
                }
                .svc-bottom-feat {
                    transition: transform 0.3s ease;
                }
                .svc-bottom-feat:hover {
                    transform: translateY(-2px);
                }
                .svc-arrow-link {
                    transition: gap 0.3s ease, color 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .svc-arrow-link:hover {
                    gap: 12px;
                    color: #c084fc !important;
                }
            `}</style>

            <section
                style={{
                    width: '100%',
                    position: 'relative',
                    padding: mob ? '40px 16px' : '60px 48px',
                    opacity: cardsIn ? 1 : 0,
                    transition: 'opacity 0.01s',
                }}
            >
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: mob ? '24px' : '36px',
                    }}
                >
                    {/* ─── Heading ─── */}
                    <SectionHeading
                        badge="OUR SERVICES"
                        title="Powerful Digital Solutions Built For Your Success"
                        highlight="Your Success"
                        subtitle="We build high-performance websites and mobile apps that help businesses grow, engage and scale effortlessly."
                        mob={mob}
                        cardsIn={cardsIn}
                    />

                    {/* ─── Service Tabs (9 cards row) ─── */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: mob ? 'repeat(4, 1fr)' : 'repeat(9, 1fr)',
                            gap: mob ? '8px' : '12px',
                            position: 'relative',
                        }}
                    >
                        {services.map((svc, idx) => {
                            const isActive = idx === activeTab;
                            return (
                                <div
                                    key={svc.id}
                                    className="svc-tab"
                                    onClick={() => setActiveTab(idx)}
                                    style={{
                                        padding: mob ? '10px 6px' : '16px 10px',
                                        borderRadius: '14px',
                                        background: isActive
                                            ? 'linear-gradient(180deg, rgba(88,28,135,0.6), rgba(40,15,80,0.4))'
                                            : 'rgba(20,15,40,0.5)',
                                        border: isActive
                                            ? '1.5px solid rgba(168,85,247,0.8)'
                                            : '1px solid rgba(105,62,205,0.2)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        textAlign: 'center',
                                        position: 'relative',
                                        boxShadow: isActive
                                            ? '0 0 25px rgba(168,85,247,0.35), inset 0 0 20px rgba(168,85,247,0.1)'
                                            : 'none',
                                        opacity: cardsIn ? 1 : 0,
                                        animation: cardsIn
                                            ? `svcTabPop 0.5s cubic-bezier(.16,1,.3,1) ${0.4 + idx * 0.06}s both`
                                            : 'none',
                                    }}
                                >
                                    {/* Number Circle */}
                                    <div
                                        style={{
                                            width: mob ? '20px' : '26px',
                                            height: mob ? '20px' : '26px',
                                            borderRadius: '50%',
                                            background: 'rgba(10,5,22,0.8)',
                                            border: `1px solid ${svc.iconColor}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: mob ? '10px' : '12px',
                                            color: svc.iconColor,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {svc.id}
                                    </div>
                                    {/* Icon */}
                                    <div
                                        style={{
                                            color: svc.iconColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {svc.icon}
                                    </div>
                                    {/* Title */}
                                    <div
                                        style={{
                                            fontSize: mob ? '9px' : '12px',
                                            color: '#fff',
                                            fontWeight: 500,
                                            lineHeight: 1.2,
                                            marginTop: '4px',
                                        }}
                                    >
                                        {svc.title}
                                    </div>
                                    {/* Tech label */}
                                    <div
                                        style={{
                                            fontSize: mob ? '8px' : '11px',
                                            color: svc.techColor,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {svc.tech}
                                    </div>

                                    {/* Active arrow caret */}
                                    {isActive && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '-9px',
                                                left: '50%',
                                                transform: 'translateX(-50%) rotate(45deg)',
                                                width: '14px',
                                                height: '14px',
                                                background: 'rgba(88,28,135,0.6)',
                                                borderRight: '1.5px solid rgba(168,85,247,0.8)',
                                                borderBottom: '1.5px solid rgba(168,85,247,0.8)',
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ─── Active Service Detail Panel ─── */}
                    <div
                        key={activeTab}
                        style={{
                            background:
                                'linear-gradient(180deg, rgba(15,10,35,0.7) 0%, rgba(10,5,22,0.8) 100%)',
                            border: '1px solid rgba(105,62,205,0.3)',
                            borderRadius: '24px',
                            padding: mob ? '20px' : '36px',
                            display: 'grid',
                            gridTemplateColumns: mob ? '1fr' : '1fr 1.4fr',
                            gap: mob ? '24px' : '40px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            animation: 'svcFadeUp 0.6s cubic-bezier(.16,1,.3,1) both',
                        }}
                    >
                        {/* LEFT: Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Number badge */}
                            <div
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: mob ? '32px' : '40px',
                                    height: mob ? '32px' : '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(168,85,247,0.18)',
                                    border: '1px solid rgba(168,85,247,0.4)',
                                    color: '#c084fc',
                                    fontWeight: 600,
                                    fontSize: mob ? '13px' : '15px',
                                }}
                            >
                                {String(active.id).padStart(2, '0')}
                            </div>

                            {/* Title */}
                            <div>
                                <h3
                                    style={{
                                        fontSize: mob ? '24px' : '32px',
                                        fontWeight: 700,
                                        color: '#fff',
                                        margin: 0,
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {active.title}
                                </h3>
                                <div
                                    style={{
                                        fontSize: mob ? '18px' : '24px',
                                        fontWeight: 600,
                                        color: active.techColor,
                                        marginTop: '4px',
                                    }}
                                >
                                    {active.tech}
                                </div>
                            </div>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: mob ? '13px' : '14px',
                                    color: 'rgba(255,255,255,0.6)',
                                    lineHeight: 1.7,
                                    margin: 0,
                                }}
                            >
                                {active.description}
                            </p>

                            {/* Feature bullets */}
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                {active.features.map((f, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontSize: mob ? '12px' : '14px',
                                            color: 'rgba(255,255,255,0.8)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                borderRadius: '50%',
                                                background: 'rgba(168,85,247,0.2)',
                                                border: '1px solid rgba(168,85,247,0.5)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <svg
                                                width="10"
                                                height="10"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#c084fc"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Row */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px',
                                    marginTop: '12px',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <button
                                    className="svc-cta-btn"
                                    onClick={() => onGetStarted?.()}
                                    style={{
                                        padding: mob ? '10px 20px' : '12px 26px',
                                        borderRadius: '999px',
                                        background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                                        border: 'none',
                                        color: '#fff',
                                        fontSize: mob ? '12px' : '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 20px rgba(168,85,247,0.25)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    Get Started
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
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: Recent Work */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Header */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <h4
                                    style={{
                                        fontSize: mob ? '15px' : '17px',
                                        fontWeight: 600,
                                        color: '#fff',
                                        margin: 0,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: '#c084fc',
                                            boxShadow: '0 0 8px #a855f7',
                                        }}
                                    />
                                    Our Recent Work
                                </h4>
                            </div>

                            {/* Project Cards Grid */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: mob ? '1fr' : 'repeat(3, 1fr)',
                                    gap: mob ? '12px' : '14px',
                                }}
                            >
                                {active.projects.map((proj, i) => (
                                    <div
                                        key={i}
                                        className="svc-project-card"
                                        style={{
                                            borderRadius: '14px',
                                            background: 'rgba(10,5,22,0.6)',
                                            border: '1px solid rgba(105,62,205,0.25)',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                aspectRatio: '4 / 3',
                                                background: `url(${proj.img}) center/cover`,
                                                borderBottom: '1px solid rgba(105,62,205,0.25)',
                                            }}
                                        />
                                        <div
                                            style={{
                                                padding: mob ? '10px' : '12px 14px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '4px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: mob ? '13px' : '14px',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {proj.name}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: mob ? '10px' : '11px',
                                                    color: 'rgba(255,255,255,0.5)',
                                                }}
                                            >
                                                {proj.type}
                                            </div>
                                            <a
                                                href={proj.link}
                                                className="svc-arrow-link"
                                                style={{
                                                    fontSize: mob ? '10px' : '11px',
                                                    color: '#c084fc',
                                                    textDecoration: 'none',
                                                    marginTop: '6px',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                View Project
                                                <svg
                                                    width="10"
                                                    height="10"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                    <polyline points="12 5 19 12 12 19" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── Bottom Feature Strip ─── */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(4, 1fr)',
                            gap: mob ? '14px' : '20px',
                            padding: mob ? '16px' : '24px 28px',
                            borderRadius: '20px',
                            background:
                                'linear-gradient(180deg, rgba(15,10,35,0.6) 0%, rgba(10,5,22,0.7) 100%)',
                            border: '1px solid rgba(105,62,205,0.25)',
                        }}
                    >
                        {bottomFeatures.map((f, idx) => (
                            <div
                                key={idx}
                                className="svc-bottom-feat"
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    opacity: cardsIn ? 1 : 0,
                                    animation: cardsIn
                                        ? `svcFadeUp 0.7s ease ${1.1 + idx * 0.1}s both`
                                        : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        width: mob ? '36px' : '44px',
                                        height: mob ? '36px' : '44px',
                                        borderRadius: '10px',
                                        background: `${f.color}1A`,
                                        border: `1px solid ${f.color}55`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: f.color,
                                        flexShrink: 0,
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <div
                                    style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
                                >
                                    <h5
                                        style={{
                                            fontSize: mob ? '13px' : '14px',
                                            color: '#fff',
                                            fontWeight: 600,
                                            margin: 0,
                                        }}
                                    >
                                        {f.title}
                                    </h5>
                                    <p
                                        style={{
                                            fontSize: mob ? '11px' : '12px',
                                            color: 'rgba(255,255,255,0.55)',
                                            margin: 0,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {f.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
