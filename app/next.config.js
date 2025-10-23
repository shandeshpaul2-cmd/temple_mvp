/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  allowedDevOrigins: [
    'http://106.51.129.224:3000',
    'http://192.168.0.149:3000',
  ],
}

module.exports = nextConfig
