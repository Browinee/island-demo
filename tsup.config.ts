import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/node/cli.ts"],
  bundle: true,
  splitting: true,
  outDir: "dist",
  minify: process.env.NODE_ENV === "production",
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
});
