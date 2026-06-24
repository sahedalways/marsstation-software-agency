// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from './config/site';
import { PreloaderProvider } from './contexts/PreloaderContext';
import { Preloader } from './components/common/Preloader';
import { JsonLd } from './components/seo/JsonLd';

// ==========================================
// VIEWPORT (Next.js 14+ separate export)
// ==========================================
export const viewport: Viewport = {
    themeColor: [
        {
            media: '(prefers-color-scheme: light)',
            color: '#732AEB',
        },
        {
            media: '(prefers-color-scheme: dark)',
            color: '#5A1EC8',
        },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    colorScheme: 'dark light',
};

// ==========================================
// METADATA — Full SEO + Social Share
// ==========================================
export const metadata: Metadata = {
    // === Basic ===
    title: {
        default: `${siteConfig.name} — ${siteConfig.tagline}`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,

    // === Favicon & Icons ===
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
        shortcut: '/favicon.ico',
    },

    manifest: '/site.webmanifest',

    metadataBase: new URL(siteConfig.url),
    alternates: {
        canonical: '/',
        languages: {
            'en-US': '/en',
        },
    },

    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: `${siteConfig.name} — ${siteConfig.tagline}`,
        description: siteConfig.description,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} — ${siteConfig.tagline}`,
                type: 'image/jpeg',
            },
            {
                url: `${siteConfig.url}/og-image-square.jpg`,
                width: 600,
                height: 600,
                alt: `${siteConfig.name} Logo`,
                type: 'image/jpeg',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: `${siteConfig.name} — ${siteConfig.tagline}`,
        description: siteConfig.description,
        images: {
            url: siteConfig.ogImage,
            alt: `${siteConfig.name} — ${siteConfig.tagline}`,
            width: 1200,
            height: 630,
        },
    },

    // === Robots & Indexing ===
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // === Verification Tags ===
    verification: {
        google: 'YOUR_GOOGLE_VERIFICATION_CODE',
        yandex: 'YOUR_YANDEX_CODE',

        other: {
            'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
            'facebook-domain-verification': 'YOUR_FB_DOMAIN_CODE',
        },
    },

    // === App Info ===
    applicationName: siteConfig.name,
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',

    // === Category ===
    category: 'technology',

    other: {
        'google-site-verification': 'YOUR_GOOGLE_CODE',
        'format-detection': 'telephone=no',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        'apple-mobile-web-app-title': siteConfig.name,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
            <head>
                {/* Preconnect to external domains for performance */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* DNS Prefetch for third-party services */}
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

                {/* Structured Data (JSON-LD) */}
                <JsonLd />
            </head>
            <body className="antialiased">
                <PreloaderProvider>
                    <Preloader />

                    <main id="main-content">{children}</main>
                </PreloaderProvider>
            </body>
        </html>
    );
}
