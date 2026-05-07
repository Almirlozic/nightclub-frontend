/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nightclub-api-dhqe.onrender.com",
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;
