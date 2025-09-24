/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    // three-mesh-bvh 를 아예 비활성화 (Bvh 안 쓰는 경우)
    config.resolve.alias["three-mesh-bvh"] = false;
    return config;
  },
};

module.exports = nextConfig;
