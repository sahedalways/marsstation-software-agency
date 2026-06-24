'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { siteConfig } from '../../config/site';

interface PrivacyContentProps {
    mob: boolean;
}

const sections = [
    { id: 'intro', title: 'Introduction', icon: '📋' },
    { id: 'collect', title: 'Information We Collect', icon: '📥' },
    { id: 'use', title: 'How We Use Information', icon: '⚙️' },
    { id: 'legal', title: 'Legal Basis', icon: '⚖️' },
    { id: 'cookies', title: 'Cookies', icon: '🍪' },
    { id: 'sharing', title: 'Data Sharing', icon: '🤝' },
    { id: 'international', title: 'International Transfers', icon: '🌍' },
    { id: 'security', title: 'Data Security', icon: '🔒' },
    { id: 'retention', title: 'Data Retention', icon: '⏱️' },
    { id: 'rights', title: 'Your Rights', icon: '✋' },
    { id: 'complaints', title: 'Complaints', icon: '📢' },
    { id: 'third-party', title: 'Third-Party Links', icon: '🔗' },
    { id: 'children', title: "Children's Privacy", icon: '👶' },
    { id: 'changes', title: 'Changes to Policy', icon: '📝' },
    { id: 'contact', title: 'Contact Us', icon: '📧' },
];

export default function PrivacyContent({ mob }: PrivacyContentProps) {
    const supportEmail = siteConfig?.supportEmail;
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

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

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Set initial active section
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
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
            {/* Table of Contents - Sticky Sidebar */}
            {!mob && (
                <div style={{ width: '260px', flexShrink: 0 }}>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <h3
                            style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.15em',
                                color: '#22d3ee',
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
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    style={{
                                        textAlign: 'left',
                                        padding: '10px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background:
                                            activeSection === section.id
                                                ? 'rgba(34,211,238,0.1)'
                                                : 'transparent',
                                        color:
                                            activeSection === section.id
                                                ? '#22d3ee'
                                                : 'rgba(255,255,255,0.5)',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        borderLeft:
                                            activeSection === section.id
                                                ? '3px solid #22d3ee'
                                                : '3px solid transparent',
                                        fontWeight: activeSection === section.id ? 600 : 400,
                                    }}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div style={{ flex: 1, maxWidth: '800px' }}>
                {/* Company Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(34,211,238,0.05) 100%)',
                        border: '1px solid rgba(168,85,247,0.2)',
                        borderRadius: '16px',
                        padding: '28px',
                        marginBottom: '48px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '20px',
                        }}
                    >
                        <span style={{ fontSize: '28px' }}>🏢</span>
                        <div>
                            <h2
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#fff',
                                    margin: 0,
                                }}
                            >
                                Company Information
                            </h2>
                            <p style={{ margin: '4px 0 0 0', color: '#a855f7', fontSize: '13px' }}>
                                Registered in England & Wales
                            </p>
                        </div>
                    </div>

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
                            <span
                                style={{
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    textAlign: 'right',
                                }}
                            >
                                ATMOSPHERE+ LTD
                                <br />
                                <span style={{ color: '#a855f7', fontSize: '12px' }}>
                                    Trading as MARS STATION
                                </span>
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
                            }}
                        >
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                                Registered Address
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
                    </div>

                    <div
                        style={{
                            marginTop: '20px',
                            padding: '12px',
                            background: 'rgba(34,211,238,0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <span style={{ color: '#22d3ee' }}>✓</span>
                        <span style={{ color: '#22d3ee', fontSize: '13px', fontWeight: 600 }}>
                            Registered with UK Information Commissioner's Office (ICO)
                        </span>
                    </div>
                </motion.div>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                    {/* 1. Introduction */}
                    <Section id="intro" title="1. Introduction" icon="📋">
                        <p
                            style={{
                                fontSize: '16px',
                                lineHeight: 1.8,
                                color: 'rgba(255,255,255,0.8)',
                            }}
                        >
                            MARS STATION is committed to protecting and respecting your privacy.
                            This Privacy Policy explains how we collect, use, store, and protect
                            your personal information when you visit our website, submit service
                            requests, contact us, or use any of our services.
                        </p>
                        <p style={{ marginTop: '16px' }}>
                            We process personal data in accordance with:
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                marginTop: '12px',
                            }}
                        >
                            {[
                                'UK General Data Protection Regulation (UK GDPR)',
                                'Data Protection Act 2018',
                                'Privacy and Electronic Communications Regulations (PECR)',
                            ].map((law, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 16px',
                                        background: 'rgba(168,85,247,0.08)',
                                        borderRadius: '6px',
                                        borderLeft: '3px solid #a855f7',
                                    }}
                                >
                                    <span style={{ color: '#a855f7' }}>⚖️</span>
                                    <span style={{ color: '#fff', fontSize: '14px' }}>{law}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* 2. Information We Collect */}
                    <Section id="collect" title="2. Information We Collect" icon="📥">
                        <p>We may collect the following categories of information:</p>

                        <h4
                            style={{
                                color: '#22d3ee',
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginTop: '28px',
                                marginBottom: '16px',
                                fontWeight: 700,
                            }}
                        >
                            Personal Information
                        </h4>
                        <GridItems
                            items={[
                                'Full Name',
                                'Email Address',
                                'Telephone Number',
                                'WhatsApp Number',
                                'Country Code',
                                'Billing Information',
                            ]}
                        />

                        <h4
                            style={{
                                color: '#22d3ee',
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginTop: '28px',
                                marginBottom: '16px',
                                fontWeight: 700,
                            }}
                        >
                            Business & Project Data
                        </h4>
                        <GridItems
                            items={[
                                'Website Requirements',
                                'Mobile App Requirements',
                                'Service Requests',
                                'Uploaded Documents',
                                'Uploaded Media',
                                'Feedback & Reviews',
                            ]}
                        />

                        <h4
                            style={{
                                color: '#22d3ee',
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginTop: '28px',
                                marginBottom: '16px',
                                fontWeight: 700,
                            }}
                        >
                            Technical Information
                        </h4>
                        <GridItems
                            items={[
                                'IP Address',
                                'Browser Type',
                                'Device Information',
                                'Operating System',
                                'Website Usage Data',
                                'Cookies & Analytics',
                            ]}
                        />
                    </Section>

                    {/* 3. How We Use */}
                    <Section id="use" title="3. How We Use Your Information" icon="⚙️">
                        <p>We use your information for the following purposes:</p>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '20px 0 0 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                            }}
                        >
                            {[
                                { icon: '💬', text: 'Respond to enquiries and service requests' },
                                { icon: '📄', text: 'Provide quotations and proposals' },
                                { icon: '🚀', text: 'Deliver our services effectively' },
                                { icon: '👥', text: 'Manage customer accounts and communications' },
                                { icon: '🎧', text: 'Process complaints and support requests' },
                                { icon: '📈', text: 'Improve our website and services' },
                                { icon: '🛡️', text: 'Maintain website security' },
                                { icon: '⚖️', text: 'Meet legal and regulatory obligations' },
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <span>{item.icon}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.9)' }}>
                                        {item.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div
                            style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                borderLeft: '4px solid #a855f7',
                                color: 'rgba(255,255,255,0.9)',
                                fontStyle: 'italic',
                            }}
                        >
                            We will only process your personal information where we have a lawful
                            basis to do so.
                        </div>
                    </Section>

                    {/* 4. Legal Basis */}
                    <Section id="legal" title="4. Legal Basis for Processing" icon="⚖️">
                        <p>Under UK GDPR, we rely on one or more of the following lawful bases:</p>
                        <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
                            {[
                                {
                                    title: 'Your Consent',
                                    desc: 'When you have given clear permission for us to process your data for a specific purpose',
                                    color: '#22d3ee',
                                },
                                {
                                    title: 'Contract Performance',
                                    desc: 'Processing necessary to fulfill our service agreement with you',
                                    color: '#a855f7',
                                },
                                {
                                    title: 'Legal Obligation',
                                    desc: 'When processing is required to comply with the law',
                                    color: '#f472b6',
                                },
                                {
                                    title: 'Legitimate Interests',
                                    desc: 'Processing necessary for our legitimate business interests or those of a third party',
                                    color: '#fb923c',
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '20px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        border: `1px solid ${item.color}30`,
                                        borderLeft: `4px solid ${item.color}`,
                                    }}
                                >
                                    <h5
                                        style={{
                                            color: item.color,
                                            margin: '0 0 8px 0',
                                            fontSize: '15px',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {item.title}
                                    </h5>
                                    <p
                                        style={{
                                            margin: 0,
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '14px',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* 5. Cookies */}
                    <Section id="cookies" title="5. Cookies" icon="🍪">
                        <p>
                            Our website uses cookies and similar technologies to improve user
                            experience and analyse website performance.
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
                                    name: 'Essential',
                                    desc: 'Website functionality',
                                    required: true,
                                },
                                {
                                    name: 'Analytics',
                                    desc: 'Performance monitoring',
                                    required: false,
                                },
                                {
                                    name: 'Security',
                                    desc: 'Protection & fraud prevention',
                                    required: true,
                                },
                                { name: 'Preferences', desc: 'User settings', required: false },
                            ].map((cookie, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {cookie.required && (
                                        <span
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                fontSize: '10px',
                                                color: '#22d3ee',
                                                background: 'rgba(34,211,238,0.1)',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            Required
                                        </span>
                                    )}
                                    <h6
                                        style={{
                                            margin: '0 0 4px 0',
                                            color: '#fff',
                                            fontSize: '14px',
                                        }}
                                    >
                                        {cookie.name}
                                    </h6>
                                    <p
                                        style={{
                                            margin: 0,
                                            color: 'rgba(255,255,255,0.5)',
                                            fontSize: '13px',
                                        }}
                                    >
                                        {cookie.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p
                            style={{
                                marginTop: '20px',
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.6)',
                            }}
                        >
                            You can control cookie settings through your browser. We obtain consent
                            before placing non-essential cookies.
                        </p>
                    </Section>

                    {/* 6. Data Sharing */}
                    <Section id="sharing" title="6. Data Sharing" icon="🤝">
                        <div
                            style={{
                                padding: '20px',
                                background: 'rgba(34,211,238,0.1)',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                border: '1px solid rgba(34,211,238,0.3)',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 700 }}>
                                🚫 We do not sell, rent, or trade your personal information.
                            </span>
                        </div>
                        <p>
                            We may share information with trusted third-party providers where
                            necessary:
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginTop: '16px',
                            }}
                        >
                            {[
                                'Website Hosting',
                                'Email Services',
                                'Cloud Storage',
                                'Payment Processors',
                                'Legal Advisers',
                                'Regulatory Authorities',
                            ].map((item, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '8px 16px',
                                        background: 'rgba(168,85,247,0.1)',
                                        color: '#a855f7',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        border: '1px solid rgba(168,85,247,0.2)',
                                    }}
                                >
                                    {item}
                                </span>
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
                            All third parties are contractually required to maintain appropriate
                            security and confidentiality measures.
                        </p>
                    </Section>

                    {/* 7. International Transfers */}
                    <Section id="international" title="7. International Transfers" icon="🌍">
                        <p>
                            Where personal information is transferred outside the United Kingdom, we
                            will ensure appropriate safeguards are in place in accordance with UK
                            GDPR requirements, including:
                        </p>
                        <ul style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                            <li>Adequacy decisions by the UK Government</li>
                            <li>Standard contractual clauses (SCCs)</li>
                            <li>Binding corporate rules (for group transfers)</li>
                        </ul>
                    </Section>

                    {/* 8. Security */}
                    <Section id="security" title="8. Data Security" icon="🔒">
                        <p>
                            We implement reasonable technical and organisational measures to protect
                            your information:
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                                gap: '12px',
                                marginTop: '20px',
                            }}
                        >
                            {[
                                { icon: '🔐', label: 'Encryption' },
                                { icon: '🛡️', label: 'Firewalls' },
                                { icon: '🔑', label: 'Access Controls' },
                                { icon: '✅', label: 'Regular Audits' },
                                { icon: '📋', label: 'Staff Training' },
                                { icon: '🔄', label: 'Secure Backups' },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        textAlign: 'center',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.06)',
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
                        <div
                            style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: 'rgba(225,29,72,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #f472b6',
                                color: '#fda4af',
                                fontSize: '14px',
                            }}
                        >
                            <strong>Important:</strong> No internet transmission or storage system
                            can be guaranteed to be completely secure.
                        </div>
                    </Section>

                    {/* 9. Retention */}
                    <Section id="retention" title="9. Data Retention" icon="⏱️">
                        <p>We retain personal information only for as long as necessary to:</p>
                        <ul style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                            <li>Provide our services</li>
                            <li>Comply with legal obligations</li>
                            <li>Resolve disputes</li>
                            <li>Enforce agreements</li>
                        </ul>
                        <p style={{ marginTop: '16px' }}>
                            When information is no longer required, it will be securely deleted or
                            anonymised.
                        </p>
                    </Section>

                    {/* 10. Your Rights */}
                    <Section id="rights" title="10. Your Rights" icon="✋">
                        <p>Under UK GDPR, you have the following rights:</p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '20px',
                            }}
                        >
                            {[
                                { right: 'Access', desc: 'Request a copy of your personal data' },
                                { right: 'Rectification', desc: 'Correct inaccurate information' },
                                { right: 'Erasure', desc: 'Request deletion of your data' },
                                { right: 'Restriction', desc: 'Limit how we process your data' },
                                {
                                    right: 'Objection',
                                    desc: 'Object to certain processing activities',
                                },
                                {
                                    right: 'Portability',
                                    desc: 'Receive data in a machine-readable format',
                                },
                                { right: 'Withdraw Consent', desc: 'Remove consent at any time' },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '14px 16px',
                                        background: 'rgba(34,211,238,0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(34,211,238,0.1)',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'rgba(34,211,238,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#22d3ee',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                color: '#fff',
                                                fontWeight: 600,
                                                fontSize: '14px',
                                            }}
                                        >
                                            {item.right}
                                        </div>
                                        <div
                                            style={{
                                                color: 'rgba(255,255,255,0.6)',
                                                fontSize: '13px',
                                            }}
                                        >
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                            }}
                        >
                            <p style={{ margin: '0 0 8px 0', color: '#fff' }}>
                                To exercise your rights, contact:
                            </p>
                            <a
                                href={`mailto:${supportEmail}`}
                                style={{
                                    color: '#22d3ee',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                {supportEmail}
                            </a>
                        </div>
                    </Section>

                    {/* 11. Complaints */}
                    <Section id="complaints" title="11. Complaints" icon="📢">
                        <p>
                            If you have concerns about how we handle your personal information,
                            please contact us first so we can resolve the issue.
                        </p>
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '20px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <h5 style={{ margin: '0 0 12px 0', color: '#fff' }}>
                                Contact Us First
                            </h5>
                            <a
                                href={`mailto:${supportEmail}`}
                                style={{
                                    color: '#22d3ee',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                }}
                            >
                                {supportEmail}
                            </a>
                        </div>
                        <div style={{ marginTop: '24px' }}>
                            <p>
                                You also have the right to lodge a complaint with the Information
                                Commissioner's Office (ICO):
                            </p>
                            <a
                                href="https://www.ico.org.uk"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '12px',
                                    padding: '12px 20px',
                                    background: 'rgba(168,85,247,0.1)',
                                    color: '#a855f7',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(168,85,247,0.3)',
                                    fontWeight: 600,
                                }}
                            >
                                Visit ICO Website →
                            </a>
                        </div>
                    </Section>

                    {/* 12. Third Party Links */}
                    <Section id="third-party" title="12. Third-Party Links" icon="🔗">
                        <p>
                            Our website may contain links to third-party websites. We are not
                            responsible for the privacy practices or content of external websites.
                        </p>
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '16px',
                                background: 'rgba(251,146,60,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #fb923c',
                                color: '#fdba74',
                            }}
                        >
                            We encourage users to review the privacy policies of any third-party
                            websites they visit.
                        </div>
                    </Section>

                    {/* 13. Children */}
                    <Section id="children" title="13. Children's Privacy" icon="👶">
                        <div
                            style={{
                                padding: '24px',
                                background: 'rgba(225,29,72,0.1)',
                                border: '1px solid rgba(225,29,72,0.3)',
                                borderRadius: '12px',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚫</div>
                            <h4 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>
                                Age Restriction
                            </h4>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>
                                Our services are not intended for individuals under the age of 18.
                                We do not knowingly collect personal information from children.
                            </p>
                        </div>
                    </Section>

                    {/* 14. Changes */}
                    <Section id="changes" title="14. Changes to This Privacy Policy" icon="📝">
                        <p>
                            We may update this Privacy Policy from time to time to reflect changes
                            in our practices or for legal, operational, or regulatory reasons.
                        </p>
                        <p style={{ marginTop: '16px' }}>
                            Any updates will be published on this page together with the revised
                            effective date. We encourage you to review this page periodically.
                        </p>
                    </Section>

                    {/* 15. Contact */}
                    <Section id="contact" title="15. Contact Us" icon="📧">
                        <p>
                            If you have any questions regarding this Privacy Policy or how we
                            process personal information, please contact us:
                        </p>

                        <div
                            style={{
                                marginTop: '24px',
                                padding: '32px',
                                background:
                                    'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(34,211,238,0.1) 100%)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '24px' }}>
                                MARS STATION
                            </h3>
                            <p style={{ margin: '0 0 24px 0', color: '#a855f7', fontSize: '14px' }}>
                                Part of ATMOSPHERE+ LTD
                            </p>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
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
                                        href="https://www.marsstation.dev"
                                        style={{
                                            color: '#a855f7',
                                            textDecoration: 'none',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <span>🌐</span> www.marsstation.dev
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Back to Top */}
                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                        marginTop: '80px',
                        padding: '14px 28px',
                        background: 'rgba(34,211,238,0.1)',
                        border: '1px solid rgba(34,211,238,0.3)',
                        borderRadius: '8px',
                        color: '#22d3ee',
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
                        e.currentTarget.style.background = 'rgba(34,211,238,0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(34,211,238,0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    ↑ Back to Top
                </motion.button>
            </div>
        </div>
    );
}

// Helper Components
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

function GridItems({ items }: { items: string[] }) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '10px',
            }}
        >
            {items.map((item, idx) => (
                <div
                    key={idx}
                    style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span style={{ color: '#22d3ee', fontSize: '10px' }}>●</span>
                    {item}
                </div>
            ))}
        </div>
    );
}
