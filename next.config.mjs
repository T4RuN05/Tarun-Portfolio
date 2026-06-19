import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.0.110:3000"],
    },
  },
  allowedDevOrigins: ["192.168.0.110"],
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
};

export default nextConfig;
