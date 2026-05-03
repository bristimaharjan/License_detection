/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure we don't try to optimize images dynamically
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
