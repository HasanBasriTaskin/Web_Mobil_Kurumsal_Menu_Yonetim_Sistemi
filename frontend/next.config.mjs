import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  distDir: '.next',
  // Turbopack root dizinini belirt (Next.js 16 için doğru format)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
