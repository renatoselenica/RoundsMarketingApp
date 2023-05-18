/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:4000/:path*", // Proxy to Backend
      basePath: false,
    },
    {
      source: "/apps/api/:path*",
      destination: "http://localhost:4000/:path*", // Proxy to Backend
      basePath: false,
    },
    {
      source: "/screenshots/:path*",
      destination: "http://localhost:4000/screenshots/:path*", // Proxy to Backend
      basePath: false,
    },
  ],
};

module.exports = nextConfig;
