'use client';

import { usePathname } from 'next/navigation';
import { siteConfig } from '../../config/site';

const pageNames: Record<string, string> = {
    '/': 'Home',
    '/about': 'About Us',
    '/privacy-policy': 'Privacy Policy',
    '/terms-conditions': 'Terms & Conditions',
    '/payment-and-refund': 'Payment & Refund Policy',
};

export function JsonLd() {
    const pathname = usePathname();
    const fullUrl = `${siteConfig.url}${pathname}`;

    // Organization Schema
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/images/logo.png`,
            width: 512,
            height: 512,
        },
        image: `${siteConfig.url}/images/logo.png`,
        description: siteConfig.description,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        foundingDate: `${siteConfig.foundingYear}`,
        founder: {
            '@type': 'Person',
            name: siteConfig.founder,
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            postalCode: siteConfig.address.zip,
            addressCountry: siteConfig.address.country,
        },
        sameAs: Object.values(siteConfig.social),
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: siteConfig.phone,
                contactType: 'customer service',
                email: siteConfig.email,
                availableLanguage: ['English', 'Bengali'],
            },
        ],
    };

    // Website Schema
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
            '@id': `${siteConfig.url}/#organization`,
        },
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    // ProfessionalService Schema
    const professionalServiceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${siteConfig.url}/#service`,
        name: siteConfig.name,
        url: siteConfig.url,
        image: `${siteConfig.url}/images/logo.png`,
        description: siteConfig.description,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: siteConfig.address.street,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            postalCode: siteConfig.address.zip,
            addressCountry: siteConfig.address.country,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: siteConfig.geo.latitude,
            longitude: siteConfig.geo.longitude,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
            },
        ],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Software Development Services',
            itemListElement: siteConfig.services.map((service, index) => ({
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: service,
                },
                position: index + 1,
            })),
        },
    };

    // Dynamic BreadcrumbList Schema
    const breadcrumbItems = [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteConfig.url,
        },
    ];

    if (pathname !== '/') {
        const pageName = pageNames[pathname] || pathname.slice(1).replace(/-/g, ' ');
        breadcrumbItems.push({
            '@type': 'ListItem',
            position: 2,
            name: pageName,
            item: fullUrl,
        });
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(professionalServiceSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
        </>
    );
}
