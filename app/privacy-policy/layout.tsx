import type { Metadata } from 'next';
import { siteConfig } from '../config/site';

const title = 'Privacy Policy';
const description = 'Read our Privacy Policy to understand how Mars Station collects, uses, and protects your personal data in compliance with UK GDPR.';

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: `${siteConfig.url}/privacy-policy`,
    },
    twitter: {
        title: `${title} | ${siteConfig.name}`,
        description,
    },
    alternates: {
        canonical: '/privacy-policy',
    },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
