import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from './config/site';
import { PreloaderProvider } from './contexts/PreloaderContext';
import { Preloader } from './components/common/Preloader';

export const metadata: Metadata = {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <PreloaderProvider>
                    <Preloader />
                    {children}
                </PreloaderProvider>
            </body>
        </html>
    );
}
