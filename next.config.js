/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        port: "",
        pathname: "/books/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/ffc/:path",
        destination: "https://www.freecodecamp.org/certification/fcc1f21e1cd-ef52-48f7-8fe5-b48b50dd9066/:path",
        permanent: false
      },
      {
        source: "/udemy/:path",
        destination: "https://www.udemy.com/certificate/:path",
        permanent: false
      }
    ];
  },
};

module.exports = nextConfig;