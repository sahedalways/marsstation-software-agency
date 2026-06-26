// TermsContent.tsx - Terms and Conditions Content UI (Purple/Cyan Theme)
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { siteConfig } from '../../config/site';
import { toCamelCase } from '../../utils/textUtils';
import { useLenis } from '../../contexts/SmoothScrollContext';

interface TermsContentProps {
    mob: boolean;
}

const sections = [
    { id: 'company', title: 'Company Information', icon: '🏢' },
    { id: 'intro', title: 'Introduction', icon: '👋' },
    { id: 'services', title: 'Our Services', icon: '🛠️' },
    { id: 'requests', title: 'Service Requests', icon: '📝' },
    { id: 'quotations', title: 'Quotations', icon: '💰' },
    { id: 'responsibilities', title: 'Client Responsibilities', icon: '✅' },
    { id: 'payments', title: 'Payments', icon: '💳' },
    { id: 'refunds', title: 'Refunds', icon: '↩️' },
    { id: 'ip', title: 'Intellectual Property', icon: '©️' },
    { id: 'portfolio', title: 'Portfolio Rights', icon: '🎨' },
    { id: 'third-party', title: 'Third-Party Services', icon: '🔗' },
    { id: 'domain', title: 'Domain & Hosting', icon: '🌐' },
    { id: 'support', title: 'Maintenance & Support', icon: '🎧' },
    { id: 'liability', title: 'Limitation of Liability', icon: '⚖️' },
    { id: 'availability', title: 'Website Availability', icon: '📡' },
    { id: 'prohibited', title: 'Prohibited Use', icon: '🚫' },
    { id: 'privacy', title: 'Privacy', icon: '🔒' },
    { id: 'complaints', title: 'Complaints', icon: '📢' },
    { id: 'changes', title: 'Changes to Terms', icon: '📝' },
    { id: 'governing', title: 'Governing Law', icon: '⚖️' },
    { id: 'contact', title: 'Contact Information', icon: '📧' },
];

export default function TermsContent({ mob }: TermsContentProps) {
    const { lenis } = useLenis();
    const compnayName = siteConfig?.name;
    const companyUrl = siteConfig?.url;
    const supportEmail = siteConfig?.supportEmail;
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        if (!lenis) return;

        const handleScroll = () => {
            const scrollPosition = lenis.scroll + 150;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (
                    element &&
                    element.offsetTop <= scrollPosition &&
                    element.offsetTop + element.offsetHeight > scrollPosition
                ) {
                    setActiveSection(section.id);
                }
            }
        };
        lenis.on('scroll', handleScroll);
        handleScroll();
        return () => lenis.off('scroll', handleScroll);
    }, [lenis]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) lenis?.scrollTo(element, { duration: 1.2 });
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: mob ? 'column' : 'row',
                gap: mob ? '24px' : '60px',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: mob ? '20px' : '80px 40px',
                position: 'relative',
                zIndex: 2,
            }}
        >
            {!mob && (
                <div style={{ width: '260px', flexShrink: 0 }}>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <h3
                            style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                color: '#a855f7',
                                marginBottom: '20px',
                                fontWeight: 700,
                            }}
                        >
                            Contents
                        </h3>
                        <nav
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                maxHeight: 'calc(100vh - 200px)',
                                overflowY: 'auto',
                                paddingRight: '10px',
                            }}
                        >
                            {sections.map((section) => {
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => scrollToSection(section.id)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            border: isActive
                                                ? '1.5px solid rgba(168,85,247,0.8)'
                                                : '1px solid rgba(105,62,205,0.2)',
                                            background: isActive
                                                ? 'linear-gradient(180deg, rgba(88,28,135,0.6), rgba(40,15,80,0.4))'
                                                : 'rgba(20,15,40,0.5)',
                                            color: isActive ? '#a855f7' : 'rgba(255,255,255,0.5)',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            borderLeft: isActive
                                                ? '3px solid #a855f7'
                                                : '3px solid transparent',
                                            fontWeight: isActive ? 600 : 400,
                                            boxShadow: isActive
                                                ? '0 0 25px rgba(168,85,247,0.35), inset 0 0 20px rgba(168,85,247,0.1)'
                                                : 'none',
                                        }}
                                    >
                                        {section.title}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            <div style={{ flex: 1, maxWidth: '800px' }}>
                <Section id="company" title="1. Company Information" icon="🏢">
                    <div
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(88,28,135,0.4) 0%, rgba(40,15,80,0.2) 100%)',
                            border: '1px solid rgba(168,85,247,0.3)',
                            borderRadius: '16px',
                            padding: '28px',
                        }}
                    >
                        <p style={{ margin: '0 0 8px 0', color: '#a855f7', fontSize: '13px' }}>
                            ATMOSPHERE+ LTD
                        </p>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                                    Legal Entity
                                </span>
                                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                                    ATMOSPHERE+ LTD
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                                    Company Number
                                </span>
                                <span
                                    style={{
                                        color: '#22d3ee',
                                        fontSize: '14px',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    16096592
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                }}
                            >
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                                    Address
                                </span>
                                <span
                                    style={{
                                        color: '#fff',
                                        fontSize: '14px',
                                        textAlign: 'right',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    13B Vallance Road,
                                    <br />
                                    London, E1 5HS,
                                    <br />
                                    United Kingdom
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                }}
                            >
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                                    Contact
                                </span>
                                <a
                                    href={`mailto:${supportEmail}`}
                                    style={{
                                        color: '#22d3ee',
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                    }}
                                >
                                    {supportEmail}
                                </a>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Sections */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '60px',
                        marginTop: '40px',
                    }}
                >
                    <Section id="intro" title="2. Introduction" icon="👋">
                        <p>
                            Welcome to <strong>{toCamelCase(compnayName)}</strong>. These Terms and
                            Conditions govern your use of our website and services. By accessing our
                            website or submitting a service request, you agree to comply with and be
                            bound by these Terms.
                        </p>
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '16px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                borderLeft: '4px solid #a855f7',
                                color: '#c084fc',
                            }}
                        >
                            <strong>Important:</strong> If you do not agree with any part of these
                            Terms, please do not use our website or services.
                        </div>
                    </Section>

                    <Section id="services" title="3. Our Services" icon="🛠️">
                        <p>
                            {toCamelCase(compnayName)} provides comprehensive digital services
                            including:
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
                                gap: '10px',
                                marginTop: '20px',
                            }}
                        >
                            {[
                                'Website Development',
                                'WordPress Development',
                                'Full Stack Web Development',
                                'E-Commerce Solutions',
                                'Mobile App Development',
                                'Android & iOS Development',
                                'Cross-Platform Apps',
                                'Maintenance & Support',
                                'Logo & Branding Design',
                                'Digital Consultancy',
                                'AI Automation',
                                'ML Development',
                            ].map((service, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '12px 16px',
                                        background: 'rgba(88,28,135,0.2)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        color: '#fff',
                                        border: '1px solid rgba(168,85,247,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <span style={{ color: '#a855f7' }}>▸</span>
                                    {service}
                                </div>
                            ))}
                        </div>
                        <p
                            style={{
                                marginTop: '20px',
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.6)',
                                fontStyle: 'italic',
                            }}
                        >
                            All services are subject to availability and acceptance.
                        </p>
                    </Section>

                    <Section id="requests" title="4. Service Requests" icon="📝">
                        <p>
                            Submitting a request through our website{' '}
                            <strong>does not create a binding contract</strong>. A contract will
                            only be formed after:
                        </p>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '20px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                            }}
                        >
                            {[
                                'Project requirements have been reviewed',
                                'Pricing has been agreed',
                                'Payment terms have been accepted',
                                'Written confirmation has been issued by {toCamelCase(compnayName)}',
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '14px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: 'rgba(168,85,247,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#a855f7',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {idx + 1}
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.9)' }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div
                            style={{
                                padding: '14px',
                                background: 'rgba(225,29,72,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #f43f5e',
                                color: '#fda4af',
                                fontSize: '14px',
                            }}
                        >
                            We reserve the right to decline any project request at our discretion.
                        </div>
                    </Section>

                    <Section id="quotations" title="5. Quotations" icon="💰">
                        <p>All quotations provided by {toCamelCase(compnayName)}:</p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                marginTop: '16px',
                            }}
                        >
                            {[
                                {
                                    label: 'Validity',
                                    value: 'Valid for 30 days unless otherwise stated',
                                },
                                {
                                    label: 'Basis',
                                    value: 'Based on information supplied by the client',
                                },
                                {
                                    label: 'Revisions',
                                    value: 'May be revised if requirements change',
                                },
                                {
                                    label: 'Additional Work',
                                    value: 'Additional work outside scope may incur extra charges',
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        gap: '16px',
                                        padding: '12px 16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <span
                                        style={{
                                            color: '#a855f7',
                                            fontWeight: 600,
                                            minWidth: '120px',
                                        }}
                                    >
                                        {item.label}:
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section id="responsibilities" title="6. Client Responsibilities" icon="✅">
                        <p>Clients agree to:</p>
                        <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
                            {[
                                'Provide accurate and complete project requirements',
                                'Supply content, images, and materials required for the project',
                                'Respond to requests for feedback within a reasonable timeframe (typically 3-5 business days)',
                                'Ensure they have legal rights to any content supplied (licenses, copyrights, trademarks)',
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        padding: '12px',
                                        background: 'rgba(34,211,238,0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(34,211,238,0.1)',
                                    }}
                                >
                                    <span style={{ color: '#22d3ee', fontSize: '18px' }}>✓</span>
                                    <span
                                        style={{
                                            color: 'rgba(255,255,255,0.85)',
                                            fontSize: '14px',
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '14px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #a855f7',
                                color: '#c084fc',
                                fontSize: '14px',
                            }}
                        >
                            <strong>Note:</strong> Delays caused by missing information or approvals
                            may affect project timelines and may result in additional costs.
                        </div>
                    </Section>

                    <Section id="payments" title="7. Payments" icon="💳">
                        <p>
                            Payment terms will be agreed before project commencement. Unless
                            otherwise specified:
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
                                gap: '12px',
                                marginTop: '20px',
                            }}
                        >
                            {[
                                {
                                    icon: '💰',
                                    title: 'Deposits',
                                    desc: 'May be required before work begins',
                                },
                                {
                                    icon: '📦',
                                    title: 'Final Delivery',
                                    desc: 'Withheld until full payment received',
                                },
                                {
                                    icon: '⏰',
                                    title: 'Late Payments',
                                    desc: 'May result in service suspension',
                                },
                                {
                                    icon: '💷',
                                    title: 'Currency',
                                    desc: 'All fees in GBP (£) unless specified',
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                                        {item.icon}
                                    </div>
                                    <div
                                        style={{
                                            color: '#a855f7',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}
                                    >
                                        {item.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section id="refunds" title="8. Refunds" icon="↩️">
                        <div
                            style={{
                                padding: '20px',
                                background: 'rgba(225,29,72,0.1)',
                                border: '1px solid rgba(225,29,72,0.3)',
                                borderRadius: '12px',
                                marginBottom: '20px',
                            }}
                        >
                            <h4 style={{ color: '#f43f5e', margin: '0 0 12px 0' }}>
                                Refund Policy
                            </h4>
                            <p
                                style={{
                                    margin: 0,
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '14px',
                                }}
                            >
                                Due to the nature of digital services, refunds are considered on a
                                case-by-case basis.
                            </p>
                        </div>

                        <p style={{ color: '#f472b6', fontWeight: 600, marginBottom: '12px' }}>
                            Refunds will generally NOT be provided for:
                        </p>
                        <ul
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
                                gap: '8px',
                                padding: 0,
                                listStyle: 'none',
                            }}
                        >
                            {[
                                'Completed work',
                                'Approved designs',
                                'Delivered digital products',
                                'Work already performed',
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        padding: '10px 14px',
                                        background: 'rgba(225,29,72,0.05)',
                                        borderRadius: '6px',
                                        color: '#fda4af',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <span>✕</span> {item}
                                </li>
                            ))}
                        </ul>
                        <p
                            style={{
                                marginTop: '16px',
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.6)',
                            }}
                        >
                            Where a refund is approved, any completed work may remain the property
                            of {toCamelCase(compnayName)}.
                        </p>
                    </Section>

                    <Section id="ip" title="9. Intellectual Property" icon="©️">
                        <div
                            style={{
                                padding: '20px',
                                background: 'rgba(88,28,135,0.2)',
                                borderRadius: '12px',
                                border: '1px solid rgba(168,85,247,0.3)',
                                marginBottom: '20px',
                            }}
                        >
                            <h4 style={{ color: '#a855f7', margin: '0 0 8px 0' }}>
                                Ownership Transfer
                            </h4>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                                Upon full payment, ownership of final approved deliverables will
                                transfer to the client unless otherwise agreed in writing.
                            </p>
                        </div>

                        <p style={{ marginBottom: '12px' }}>
                            {toCamelCase(compnayName)} retains ownership of:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                                'Internal development tools',
                                'Frameworks',
                                'Source components',
                                'Methodologies',
                                'Pre-existing IP',
                            ].map((item, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '6px 14px',
                                        background: 'rgba(168,85,247,0.1)',
                                        color: '#c084fc',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        border: '1px solid rgba(168,85,247,0.2)',
                                    }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '14px',
                                background: 'rgba(34,211,238,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #22d3ee',
                                color: '#67e8f9',
                                fontSize: '14px',
                            }}
                        >
                            <strong>Client Warranty:</strong> Clients must ensure that any content
                            they provide does not infringe the rights of third parties.
                        </div>
                    </Section>

                    <Section id="portfolio" title="10. Portfolio Rights" icon="🎨">
                        <p>
                            Unless otherwise agreed in writing, {toCamelCase(compnayName)} reserves
                            the right to display completed projects within:
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                                gap: '10px',
                                marginTop: '20px',
                            }}
                        >
                            {[
                                { icon: '💼', label: 'Portfolio' },
                                { icon: '📢', label: 'Marketing' },
                                { icon: '📱', label: 'Social Media' },
                                { icon: '📊', label: 'Case Studies' },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        textAlign: 'center',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                                        {item.icon}
                                    </div>
                                    <div
                                        style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                                    >
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '16px', fontSize: '14px', color: '#22d3ee' }}>
                            Clients may request confidentiality before project commencement.
                        </p>
                    </Section>

                    <Section id="third-party" title="11. Third-Party Services" icon="🔗">
                        <p>Projects may involve third-party services including:</p>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                margin: '16px 0',
                            }}
                        >
                            {[
                                'Domain Registrars',
                                'Hosting Providers',
                                'Payment Gateways',
                                'APIs',
                                'Cloud Services',
                            ].map((service, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '13px',
                                    }}
                                >
                                    {service}
                                </span>
                            ))}
                        </div>
                        <div
                            style={{
                                padding: '16px',
                                background: 'rgba(225,29,72,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #f43f5e',
                                color: '#fda4af',
                                fontSize: '14px',
                            }}
                        >
                            <strong>Disclaimer:</strong> {toCamelCase(compnayName)} is not
                            responsible for the availability, policies, pricing, or performance of
                            third-party services. Any fees charged by third-party providers remain
                            the responsibility of the client.
                        </div>
                    </Section>

                    <Section id="domain" title="12. Domain Names & Hosting" icon="🌐">
                        <ul
                            style={{
                                color: 'rgba(255,255,255,0.8)',
                                lineHeight: 1.8,
                                paddingLeft: '20px',
                            }}
                        >
                            <li>Ownership remains with the client where applicable</li>
                            <li>
                                Renewal fees remain the client's responsibility unless otherwise
                                agreed
                            </li>
                            <li>
                                Failure to renew services may result in suspension or loss of
                                service
                            </li>
                        </ul>
                    </Section>

                    <Section id="support" title="13. Maintenance & Support" icon="🎧">
                        <div
                            style={{
                                padding: '16px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #a855f7',
                                marginBottom: '16px',
                            }}
                        >
                            <p style={{ margin: 0, color: '#c084fc' }}>
                                Support and maintenance services are only provided where included
                                within an active support agreement.
                            </p>
                        </div>
                        <p>Response times may vary depending on:</p>
                        <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                            <li>Issue severity</li>
                            <li>Service level agreement (SLA)</li>
                            <li>Business hours (Mon-Fri, 9AM-6PM GMT)</li>
                        </ul>
                    </Section>

                    <Section id="liability" title="14. Limitation of Liability" icon="⚖️">
                        <div
                            style={{
                                padding: '20px',
                                background: 'rgba(225,29,72,0.1)',
                                border: '1px solid rgba(225,29,72,0.2)',
                                borderRadius: '12px',
                                marginBottom: '20px',
                            }}
                        >
                            <h4 style={{ color: '#f43f5e', margin: '0 0 12px 0' }}>
                                Limitation of Liability
                            </h4>
                            <p
                                style={{
                                    margin: 0,
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '14px',
                                }}
                            >
                                To the maximum extent permitted by law, {toCamelCase(compnayName)}{' '}
                                shall not be liable for:
                            </p>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                marginBottom: '20px',
                            }}
                        >
                            {[
                                'Loss of profits',
                                'Loss of business opportunities',
                                'Loss of data',
                                'Indirect or consequential damages',
                                'Downtime caused by third-party services',
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '10px 16px',
                                        background: 'rgba(225,29,72,0.05)',
                                        borderRadius: '6px',
                                        color: '#fda4af',
                                        borderLeft: '2px solid rgba(244,63,94,0.3)',
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                padding: '16px',
                                background: 'rgba(88,28,135,0.2)',
                                borderRadius: '8px',
                                border: '1px solid rgba(168,85,247,0.2)',
                                color: '#c084fc',
                            }}
                        >
                            <strong>Cap on Liability:</strong> Our total liability shall not exceed
                            the amount paid by the client for the specific service giving rise to
                            the claim. Nothing in these Terms excludes liability that cannot legally
                            be excluded under UK law.
                        </div>
                    </Section>

                    <Section id="availability" title="15. Website Availability" icon="📡">
                        <p>
                            We aim to keep our website available at all times but do not guarantee
                            uninterrupted access. We may:
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '16px',
                            }}
                        >
                            {[
                                'Update content',
                                'Modify features',
                                'Perform maintenance',
                                'Suspend access where necessary',
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    <span style={{ color: '#a855f7' }}>•</span>
                                    {item}{' '}
                                    <span
                                        style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}
                                    >
                                        (without prior notice)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section id="prohibited" title="16. Prohibited Use" icon="🚫">
                        <p>Users must not:</p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
                                gap: '10px',
                                marginTop: '16px',
                            }}
                        >
                            {[
                                'Use the website unlawfully',
                                'Upload malicious software',
                                'Attempt unauthorised access',
                                'Interfere with website security',
                                'Submit false or misleading information',
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '12px',
                                        background: 'rgba(225,29,72,0.08)',
                                        borderRadius: '8px',
                                        color: '#fda4af',
                                        border: '1px solid rgba(225,29,72,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <span>🚫</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '16px', color: '#f472b6' }}>
                            We reserve the right to restrict access where misuse is suspected.
                        </p>
                    </Section>

                    <Section id="privacy" title="17. Privacy" icon="🔒">
                        <p>Your use of our website is also governed by our Privacy Policy.</p>
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: 'rgba(34,211,238,0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(34,211,238,0.2)',
                                textAlign: 'center',
                            }}
                        >
                            <p style={{ margin: '0 0 12px 0', color: 'rgba(255,255,255,0.8)' }}>
                                Please review our Privacy Policy for information regarding how
                                personal data is collected and processed.
                            </p>
                            <a
                                href="/privacy-policy"
                                style={{
                                    color: '#22d3ee',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    padding: '8px 20px',
                                    background: 'rgba(34,211,238,0.1)',
                                    borderRadius: '6px',
                                    display: 'inline-block',
                                    border: '1px solid rgba(34,211,238,0.3)',
                                }}
                            >
                                View Privacy Policy →
                            </a>
                        </div>
                    </Section>

                    <Section id="complaints" title="18. Complaints" icon="📢">
                        <p>If you have a complaint regarding our services, please contact:</p>
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '20px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '12px',
                                border: '1px solid rgba(168,85,247,0.2)',
                                textAlign: 'center',
                            }}
                        >
                            <a
                                href={`mailto:${supportEmail}`}
                                style={{
                                    color: '#a855f7',
                                    textDecoration: 'none',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                }}
                            >
                                {supportEmail}
                            </a>
                            <p
                                style={{
                                    margin: '12px 0 0 0',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '14px',
                                }}
                            >
                                We aim to respond to complaints within 3 working days.
                            </p>
                        </div>
                    </Section>

                    <Section id="changes" title="19. Changes to These Terms" icon="📝">
                        <p>
                            {toCamelCase(compnayName)} may update these Terms and Conditions from
                            time to time.
                        </p>
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #a855f7',
                                color: '#c084fc',
                            }}
                        >
                            Updated versions will be published on this page with a revised effective
                            date. Continued use of our website following updates constitutes
                            acceptance of the revised Terms.
                        </div>
                    </Section>

                    <Section id="governing" title="20. Governing Law" icon="⚖️">
                        <div
                            style={{
                                padding: '24px',
                                background:
                                    'linear-gradient(135deg, rgba(88,28,135,0.3) 0%, rgba(40,15,80,0.2) 100%)',
                                borderRadius: '12px',
                                border: '1px solid rgba(168,85,247,0.2)',
                                textAlign: 'center',
                            }}
                        >
                            <p
                                style={{
                                    margin: '0 0 8px 0',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                }}
                            >
                                Governing Law: England and Wales
                            </p>
                            <p
                                style={{
                                    margin: 0,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '14px',
                                }}
                            >
                                These Terms shall be governed by and interpreted in accordance with
                                the laws of England and Wales. Any disputes shall be subject to the
                                exclusive jurisdiction of the courts of England and Wales.
                            </p>
                        </div>
                    </Section>

                    <Section id="contact" title="21. Contact Information" icon="📧">
                        <div
                            style={{
                                padding: '32px',
                                background:
                                    'linear-gradient(135deg, rgba(88,28,135,0.3) 0%, rgba(40,15,80,0.2) 100%)',
                                borderRadius: '16px',
                                border: '1px solid rgba(168,85,247,0.3)',
                                textAlign: 'center',
                            }}
                        >
                            <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '24px' }}>
                                {toCamelCase(compnayName)}
                            </h3>
                            <p style={{ margin: '0 0 24px 0', color: '#a855f7', fontSize: '14px' }}>
                                Part of ATMOSPHERE+ LTD
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    alignItems: 'center',
                                }}
                            >
                                <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                                    13B Vallance Road
                                    <br />
                                    London, E1 5HS
                                    <br />
                                    United Kingdom
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        marginTop: '8px',
                                    }}
                                >
                                    <a
                                        href={`mailto:${supportEmail}`}
                                        style={{
                                            color: '#22d3ee',
                                            textDecoration: 'none',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <span>✉️</span> {supportEmail}
                                    </a>
                                    <a
                                        href={companyUrl}
                                        style={{
                                            color: '#a855f7',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <span>🌐</span> {companyUrl}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>

                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        marginTop: '80px',
                        padding: '14px 28px',
                        background: 'rgba(168,85,247,0.1)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        borderRadius: '8px',
                        color: '#a855f7',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(168,85,247,0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(168,85,247,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    ↑ Back to Top
                </motion.button>
            </div>
        </div>
    );
}

function Section({
    id,
    title,
    icon,
    children,
}: {
    id: string;
    title: string;
    icon: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            style={{ scrollMarginTop: '100px' }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <span style={{ fontSize: '28px' }}>{icon}</span>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {title}
                </h2>
            </div>
            <div
                style={{
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.8,
                    fontSize: '15px',
                    letterSpacing: '0.01em',
                }}
            >
                {children}
            </div>
        </motion.div>
    );
}
