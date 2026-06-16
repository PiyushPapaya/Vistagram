import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Absolute path to THIS project directory (no trailing separator). `__dirname`
// is empty in Next's ESM-compiled TS config, so derive it from import.meta.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Pin the workspace root. A stray lockfile in a parent folder can otherwise
  // make Next infer the wrong root, which panics Turbopack's HMR in dev and can
  // break file tracing on deploy.
  turbopack: {
    root: projectRoot,
  },
  // Cache all locally-served media aggressively. The feed/explore repeat the
  // same clips as you scroll (cycles) and on revisits — with an immutable
  // year-long cache every repeat is served from disk/memory with zero network,
  // so scrolling back or auto-advancing never re-downloads a byte.
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/reels/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
