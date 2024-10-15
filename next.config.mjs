/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sthotelsmalta.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgproxy.valpas.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
