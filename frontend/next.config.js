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
        destination: 'http://localhost:5000/api/:path*', 
      },      
      // {
      //   source: '/api/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      // },
    ];
  },
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com',],
  },
};

module.exports = nextConfig;