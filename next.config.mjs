/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/repo-test-1-a/bon-dashboard",
  assetPrefix: "/repo-test-1-a/bon-dashboard",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
