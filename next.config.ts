import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "true";
const githubPagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export" as const,
        images: {
          unoptimized: true,
        },
        ...(githubPagesBasePath
          ? {
              basePath: githubPagesBasePath,
              assetPrefix: `${githubPagesBasePath}/`,
            }
          : {}),
      }
    : {}),
};

export default nextConfig;
