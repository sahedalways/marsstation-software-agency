/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    },

    output: 'export',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
