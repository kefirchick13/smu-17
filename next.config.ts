import type { NextConfig } from "next";

/** Netlify — serverless; standalone для Docker / свой хост. */
const useStandalone =
  process.env.NETLIFY !== "true" && process.env.VERCEL !== "1";

const nextConfig: NextConfig = {
  ...(useStandalone ? { output: "standalone" as const } : {}),
  serverExternalPackages: [
    "pg",
    "pg-pool",
    "pg-connection-string",
    "pgpass",
    "pg-protocol",
    "pg-types",
    "nodemailer",
  ],
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
