'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { siteConfig } from '../../config/site';
import { toCamelCase } from '../../utils/textUtils';
import { useLenis } from '../../contexts/SmoothScrollContext';

interface PaymentContentProps {
    mob: boolean;
}

const sections = [
    { id: 'intro', title: 'Introduction', icon: '📋' },
    { id: 'no-upfront', title: 'No Upfront Payment', icon: '🚫' },
    { id: 'agreement', title: 'Project Agreement', icon: '📝' },
    { id: 'methods', title: 'Payment Methods', icon: '💳' },
    { id: 'terms', title: 'Payment Terms', icon: '⚖️' },
    { id: 'refund', title: 'Refund Policy', icon: '↩️' },
    { id: 'cancellation', title: 'Cancellation', icon: '❌' },
    { id: 'non-refundable', title: 'Non-Refundable Services', icon: '🚫' },
    { id: 'delays', title: 'Delayed Projects', icon: '⏱️' },
    { id: 'chargebacks', title: 'Chargebacks', icon: '⚠️' },
    { id: 'processing', title: 'Processing Time', icon: '⏳' },
    { id: 'changes', title: 'Changes to Policy', icon: '📝' },
    { id: 'contact', title: 'Contact Information', icon: '📧' },
];

export default function PandRContent({ mob }: PaymentContentProps) {
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
                {/* Key Highlight Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background:
                            'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(168,85,247,0.05) 100%)',
                        border: '1px solid rgba(34,211,238,0.3)',
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
                            marginBottom: '16px',
                        }}
                    >
                        <span style={{ fontSize: '28px' }}>✨</span>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
                            Key Principle
                        </h2>
                    </div>
                    <p style={{ margin: 0, color: '#22d3ee', fontSize: '16px', lineHeight: 1.6 }}>
                        <strong>
                            No payment is required before a formal agreement is reached.
                        </strong>{' '}
                        We only request payment after project scope, pricing, and terms have been
                        mutually agreed upon.
                    </p>
                </motion.div>

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                    <Section id="intro" title="1. Introduction" icon="📋">
                        <p>
                            This Payment & Refund Policy explains how payments, deposits, refunds,
                            and project cancellations are handled by{' '}
                            <strong> {toCamelCase(compnayName)}</strong>.
                        </p>
                        <p style={{ marginTop: '16px' }}>
                            By engaging our services, you agree to this Policy and any
                            project-specific agreement entered into between{' '}
                            {toCamelCase(compnayName)} and the Client.
                        </p>
                    </Section>

                    <Section
                        id="no-upfront"
                        title="2. No Upfront Payment Before Agreement"
                        icon="🚫"
                    >
                        <div
                            style={{
                                padding: '20px',
                                background: 'rgba(34,211,238,0.1)',
                                border: '1px solid rgba(34,211,238,0.3)',
                                borderRadius: '12px',
                                marginBottom: '20px',
                            }}
                        >
                            <h4 style={{ color: '#22d3ee', margin: '0 0 12px 0' }}>
                                Our Commitment
                            </h4>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                                {toCamelCase(compnayName)} does <strong>not</strong> require payment
                                simply for submitting a service request or making an enquiry.
                            </p>
                        </div>

                        <p>Before any payment is requested:</p>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '16px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                        >
                            {[
                                'Project requirements will be reviewed',
                                `Discussions will take place between ${toCamelCase(compnayName)} and the Client`,
                                'A quotation and project proposal may be provided',
                                'Both parties must reach an agreement regarding scope, pricing, timelines, and payment terms',
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <span style={{ color: '#22d3ee' }}>✓</span>
                                    <span style={{ color: 'rgba(255,255,255,0.9)' }}>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div
                            style={{
                                padding: '14px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #a855f7',
                                color: '#c084fc',
                                fontSize: '14px',
                            }}
                        >
                            <strong>
                                No contract exists and no payment obligation arises until a formal
                                agreement has been reached.
                            </strong>
                        </div>
                    </Section>

                    <Section id="agreement" title="3. Project Agreement" icon="📝">
                        <p>
                            Once both parties agree to proceed, {toCamelCase(compnayName)} may
                            issue:
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                                gap: '10px',
                                margin: '20px 0',
                            }}
                        >
                            {['Project Proposal', 'Service Agreement', 'Quotation', 'Invoice'].map(
                                (doc, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            textAlign: 'center',
                                            padding: '16px',
                                            background: 'rgba(168,85,247,0.1)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(168,85,247,0.2)',
                                            color: '#fff',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {doc}
                                    </div>
                                )
                            )}
                        </div>

                        <p>The agreed document will outline:</p>
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                                marginTop: '12px',
                            }}
                        >
                            {[
                                'Project scope',
                                'Deliverables',
                                'Pricing',
                                'Payment schedule',
                                'Project timeline',
                                'Revision terms',
                                'Refund eligibility',
                            ].map((item, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '6px 14px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '20px',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: '13px',
                                    }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                        <p style={{ marginTop: '20px', color: '#22d3ee' }}>
                            The project will commence only after the agreed payment requirements
                            have been satisfied.
                        </p>
                    </Section>

                    <Section id="methods" title="4. Payment Methods" icon="💳">
                        <p>Payments may be accepted through approved payment methods including:</p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
                                gap: '16px',
                                marginTop: '20px',
                            }}
                        >
                            <div
                                style={{
                                    padding: '20px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏦</div>
                                <div
                                    style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}
                                >
                                    Bank Transfer
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                                    Direct bank deposit
                                </div>
                            </div>
                            <div
                                style={{
                                    padding: '20px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
                                <div
                                    style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}
                                >
                                    Card Payment
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                                    Debit / Credit Card
                                </div>
                            </div>
                        </div>
                        <p
                            style={{
                                marginTop: '20px',
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.6)',
                                fontStyle: 'italic',
                            }}
                        >
                            Payment instructions will be provided directly by{' '}
                            {toCamelCase(compnayName)}.
                        </p>
                    </Section>

                    <Section id="terms" title="5. Payment Terms" icon="⚖️">
                        <p>
                            Payment terms may vary depending on the nature and size of the project.
                            Examples include:
                        </p>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                marginTop: '20px',
                            }}
                        >
                            {[
                                {
                                    type: 'Full Payment',
                                    desc: '100% before commencement',
                                    color: '#a855f7',
                                },
                                {
                                    type: 'Deposit + Staged',
                                    desc: 'Initial deposit with milestone payments',
                                    color: '#22d3ee',
                                },
                                {
                                    type: 'Milestone-Based',
                                    desc: 'Payment upon completion of specific deliverables',
                                    color: '#6366f1',
                                },
                                {
                                    type: 'Monthly',
                                    desc: 'Recurring maintenance payments',
                                    color: '#f472b6',
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderLeft: `4px solid ${item.color}`,
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '8px 16px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '6px',
                                            color: item.color,
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            minWidth: '140px',
                                        }}
                                    >
                                        {item.type}
                                    </div>
                                    <div
                                        style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                                    >
                                        {item.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '14px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                color: '#c084fc',
                                fontSize: '14px',
                            }}
                        >
                            Specific payment terms will always be confirmed within the project
                            agreement.
                        </div>
                    </Section>

                    <Section id="refund" title="6. Refund Policy" icon="↩️">
                        <p>
                            Refund requests are reviewed and processed in accordance with the
                            specific agreement made between {toCamelCase(compnayName)} and the
                            Client.
                        </p>

                        <h4
                            style={{
                                color: '#22d3ee',
                                fontSize: '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginTop: '24px',
                                marginBottom: '16px',
                                fontWeight: 700,
                            }}
                        >
                            Refund eligibility depends on:
                        </h4>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            {[
                                'The stage of project completion',
                                'Work already performed',
                                'Resources allocated to the project',
                                'Deliverables already provided',
                                'Terms agreed before project commencement',
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '6px',
                                        color: 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    <span style={{ color: '#a855f7' }}>•</span>
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: 'rgba(34,211,238,0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(34,211,238,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}
                        >
                            <span style={{ fontSize: '24px' }}>📧</span>
                            <div>
                                <div
                                    style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '13px',
                                        marginBottom: '4px',
                                    }}
                                >
                                    Submit refund requests to:
                                </div>
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
                        </div>
                    </Section>

                    <Section id="cancellation" title="7. Cancellation Requests" icon="❌">
                        <p>Clients may request project cancellation at any time by contacting:</p>
                        <div
                            style={{
                                margin: '16px 0',
                                padding: '14px',
                                background: 'rgba(168,85,247,0.1)',
                                borderRadius: '8px',
                                textAlign: 'center',
                            }}
                        >
                            <a
                                href={`mailto:${supportEmail}`}
                                style={{
                                    color: '#a855f7',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                {supportEmail}
                            </a>
                        </div>

                        <p>
                            Where work has already commenced, {toCamelCase(compnayName)} reserves
                            the right to:
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
                                'Retain payment for completed work',
                                'Deduct costs associated with work performed',
                                'Charge for resources already allocated',
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
                                    <span>⚠️</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <p
                            style={{
                                marginTop: '16px',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '14px',
                            }}
                        >
                            Any applicable refund will be determined according to the agreed project
                            terms.
                        </p>
                    </Section>

                    <Section id="non-refundable" title="8. Non-Refundable Services" icon="🚫">
                        <div
                            style={{
                                padding: '20px',
                                background: 'rgba(225,29,72,0.1)',
                                border: '1px solid rgba(225,29,72,0.3)',
                                borderRadius: '12px',
                                marginBottom: '20px',
                            }}
                        >
                            <h4 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>
                                Non-Refundable Items
                            </h4>
                            <p
                                style={{
                                    margin: 0,
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '14px',
                                }}
                            >
                                Unless otherwise stated within the project agreement, the following
                                are generally non-refundable:
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: mob ? '1fr' : 'repeat(2, 1fr)',
                                gap: '10px',
                            }}
                        >
                            {[
                                'Domain Registrations',
                                'Hosting Services',
                                'Third-Party Software Licences',
                                'API Fees',
                                'Paid Advertising Costs',
                                'Completed Design Work',
                                'Completed Development Work',
                                'Third-Party Service Fees',
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '12px 16px',
                                        background: 'rgba(225,29,72,0.05)',
                                        borderRadius: '8px',
                                        color: '#fda4af',
                                        border: '1px solid rgba(225,29,72,0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <span style={{ color: '#f43f5e' }}>✕</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section id="delays" title="9. Delayed Projects" icon="⏱️">
                        <p>
                            If project delays occur due to the Client's failure to provide required
                            information, approvals, content, or feedback, {toCamelCase(compnayName)}{' '}
                            reserves the right to:
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
                                { action: 'Pause the project', icon: '⏸️' },
                                { action: 'Adjust timelines', icon: '📅' },
                                { action: 'Invoice completed work', icon: '📄' },
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '14px',
                                        background: 'rgba(251,146,60,0.08)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(251,146,60,0.2)',
                                        color: '#fdba74',
                                    }}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.action}</span>
                                </li>
                            ))}
                        </ul>
                        <div
                            style={{
                                padding: '14px',
                                background: 'rgba(251,146,60,0.1)',
                                borderRadius: '8px',
                                borderLeft: '3px solid #fb923c',
                                color: '#fdba74',
                                fontSize: '14px',
                            }}
                        >
                            Such delays do not automatically qualify for refunds.
                        </div>
                    </Section>

                    <Section id="chargebacks" title="10. Chargebacks" icon="⚠️">
                        <div
                            style={{
                                padding: '20px',
                                background: 'rgba(234,179,8,0.1)',
                                border: '1px solid rgba(234,179,8,0.3)',
                                borderRadius: '12px',
                                marginBottom: '20px',
                            }}
                        >
                            <h4 style={{ color: '#eab308', margin: '0 0 12px 0' }}>
                                Important Notice
                            </h4>
                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>
                                Clients are encouraged to contact {toCamelCase(compnayName)}{' '}
                                directly to resolve any payment concerns{' '}
                                <strong>before initiating a chargeback</strong> or payment dispute.
                            </p>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                            Unauthorised chargebacks relating to validly delivered services may be
                            disputed with supporting project records and communications.
                        </p>
                    </Section>

                    <Section id="processing" title="11. Refund Processing Time" icon="⏳">
                        <div
                            style={{
                                padding: '24px',
                                background:
                                    'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(168,85,247,0.1) 100%)',
                                borderRadius: '12px',
                                border: '1px solid rgba(34,211,238,0.2)',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
                            <div
                                style={{
                                    color: '#22d3ee',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    marginBottom: '8px',
                                }}
                            >
                                7–14 Business Days
                            </div>
                            <p
                                style={{
                                    margin: 0,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '14px',
                                }}
                            >
                                Where a refund is approved, refunds are typically processed within
                                7–14 business days. Processing times may vary depending on the
                                payment provider or financial institution.
                            </p>
                        </div>
                    </Section>

                    <Section id="changes" title="12. Changes to This Policy" icon="📝">
                        <p>
                            {toCamelCase(compnayName)} reserves the right to update this Payment &
                            Refund Policy at any time.
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
                            Any updates will be published on this page with a revised effective
                            date.
                        </div>
                    </Section>

                    <Section id="contact" title="13. Contact Information" icon="📧">
                        <p>
                            For payment, billing, cancellation, or refund enquiries, please contact:
                        </p>

                        <div
                            style={{
                                marginTop: '24px',
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
                    onClick={() => lenis?.scrollTo(0, { duration: 1.5 })}
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
