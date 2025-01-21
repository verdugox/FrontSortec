import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.externals = config.externals || {}; // Asegurar que externals sea un objeto

    if (typeof config.externals === "object") {
      Object.assign(config.externals, { jquery: "jQuery" });
    }

    return config;
  },
};

export default nextConfig;
