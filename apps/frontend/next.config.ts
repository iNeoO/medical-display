import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URI || "http://localhost:4000/api/"}:path*`,
      },
    ];
  },
};

export default nextConfig;
