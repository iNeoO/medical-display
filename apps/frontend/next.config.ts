import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  rewrites: async () => {
    const backendUri = process.env.BACKEND_URI ?? "http://localhost:4000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUri}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
