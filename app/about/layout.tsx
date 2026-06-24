import type { Metadata } from 'next';
import { siteConfig } from '../config/site';

const title = 'About Us';
const description = 'Learn about Mars Station — our team, mission, and the values that drive us to deliver exceptional digital solutions.';

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title: `${title} | ${siteConfig.name}`,
        description,
        url: `${siteConfig.url}/about`,
    },
    twitter: {
        title: `${title} | ${siteConfig.name}`,
        description,
    },
    alternates: {
        canonical: '/about',
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
