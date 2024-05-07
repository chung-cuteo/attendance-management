/** @type {import('next').NextConfig} */
import { format } from "date-fns";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: `/${format(new Date(), "yyyy-MM")}`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
