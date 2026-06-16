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
};

export default nextConfig;
