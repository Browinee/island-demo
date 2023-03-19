import { defineConfig } from "tsup";

export default defineConfig({
  bundle: true,
  splitting: true,
  outDir: "dist",
  minify: process.env.NODE_ENV === "production",
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
  entryPoints: {
    cli: "./src/node/cli.ts",
    index: "./src/node/index.ts",
    dev: "./src/node/dev.ts",
  },
  clean: true,
});
