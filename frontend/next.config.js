/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*', // Let Next.js handle NextAuth locally
      },
      {
        source: '/api/:path*',
        destination: 'https://odamsroyal.onrender.com/api/:path*', // Render backend
      },
    ];
  },
};

module.exports = nextConfig;
