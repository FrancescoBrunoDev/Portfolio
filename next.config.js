/** @type {import('next').NextConfig} */
const pocketBaseUrl = new URL(
  process.env.POCKETBASE_URL || "https://pb-pf.francesco-bruno.com/",
);

const nextConfig = {
  output: "standalone", // Required for Docker build
  // trailingSlash: true, // Disabled: conflicts with intercepting routes in Next.js 16
  images: {
    remotePatterns: [
      {
        protocol: pocketBaseUrl.protocol.replace(":", ""),
        hostname: pocketBaseUrl.hostname,
        pathname: "/api/files/**",
      },
    ],
  },
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS
    ? process.env.ALLOWED_DEV_ORIGINS.split(",")
    : [],
  async redirects() {
    return [
      {
        source: "/ffc/:path",
        destination:
          "https://www.freecodecamp.org/certification/fcc1f21e1cd-ef52-48f7-8fe5-b48b50dd9066/:path",
        permanent: false,
      },
      {
        source: "/udemy/:path",
        destination: "https://www.udemy.com/certificate/:path",
        permanent: false,
      },
      {
        source: "/slash-page",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
