import type { Metadata } from 'next';
import { siteConfig } from '../config/site';

const title = 'Payment & Refund Policy';
const description = 'Understand our payment terms, pricing structure, and refund policy before engaging our services. Transparent and fair.';

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: `${siteConfig.url}/payment-and-refund`,
    },
    twitter: {
        title: `${title} | ${siteConfig.name}`,
        description,
    },
    alternates: {
        canonical: '/payment-and-refund',
    },
};

export default function PandRLayout({ children }: { children: React.ReactNode }) {
    return children;
}
