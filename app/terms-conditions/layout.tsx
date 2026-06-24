import type { Metadata } from 'next';
import { siteConfig } from '../config/site';

const title = 'Terms & Conditions';
const description = 'Review the Terms and Conditions governing the use of Mars Station website and services, including your rights and responsibilities.';

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: `${siteConfig.url}/terms-conditions`,
    },
    twitter: {
        title: `${title} | ${siteConfig.name}`,
        description,
    },
    alternates: {
        canonical: '/terms-conditions',
    },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
