import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // הסרנו את ה-eslint שגרם לשגיאה בתמונה
};

export default nextConfig;