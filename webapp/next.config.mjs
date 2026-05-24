/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Genera un bundle minimal en .next/standalone con server.js y solo las deps
  // estrictamente necesarias. Imprescindible para Docker / Container Apps.
  output: "standalone",
};
export default nextConfig;
