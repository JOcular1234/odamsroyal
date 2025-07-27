/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://odamsroyal.onrender.com/api/:path*', // Render backend
      },
    ];
  },
};

module.exports = nextConfig;
