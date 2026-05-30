/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // basePath removed — site is deployed at root on Vercel (foxlite-forensics-production)
}

export default nextConfig