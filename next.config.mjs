/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'placekitten.com', 'placehold.co','example.com',"i.imgur.com","www.instagram.com","encrypted-tbn0.gstatic.com"],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
