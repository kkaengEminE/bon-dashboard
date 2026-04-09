import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env/.env.prod 파일에서 환경변수 로드 (GitHub Actions에서는 secrets로 주입)
dotenv.config({ path: path.resolve(__dirname, ".env/.env.prod") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/bon-dashboard",
  assetPrefix: "/bon-dashboard",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
