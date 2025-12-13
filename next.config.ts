
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warnung: Dies erlaubt den Build, auch wenn ESLint-Fehler vorhanden sind.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warnung: Dies erlaubt den Build, auch wenn TypeScript-Fehler vorhanden sind.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;