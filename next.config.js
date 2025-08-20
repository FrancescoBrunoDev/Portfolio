/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      new URL("https://pb-pf.francesco-bruno.com/api/files/**"),
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
      },
      {
        source: '/slash-page',
        destination: '/',
        permanent: true
      }
    ];
  },
};

module.exports = nextConfig;