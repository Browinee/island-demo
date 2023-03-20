import { InlineConfig, build as viteBuild } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";
import pluginReact from "@vitejs/plugin-react";
import type { RollupOutput } from "rollup";
import { join } from "path";
import fs from "fs-extra";
import ora from "ora";
import { pathToFileURL } from "url";
import { SiteConfig } from "shared/types";
import { pluginConfig } from "./plugin-island/config";

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: "production",
    root,
    // NOTE: this plugin will inject 'import React from 'react' automatically
    // to avoid React is not defined
    plugins: [pluginReact(), pluginConfig(config)],
    ssr: {
      noExternal: ["react-router-dom"],
    },
    build: {
      ssr: isServer,
      outDir: isServer ? ".temp" : "build",
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm",
        },
      },
    },
  });
  const spinner = ora();
  spinner.start("Building client + server bundles...");
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true)),
    ]);

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log(e);
  } finally {
    spinner.stop();
  }
}
export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput,
) {
  console.log("clientBundle", clientBundle);

  const clientChunk = clientBundle.output.find(
    (chunk: any) => chunk.type === "chunk" && chunk.isEntry,
  );
  console.log("Rendering page in server side...");
  const appHtml = render();
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();
  await fs.ensureDir(join(root, "build"));
  await fs.writeFile(join(root, "build/index.html"), html);
  await fs.remove(join(root, ".temp"));
  console.log("Finish build server");
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  const [clientBundle, serverBundle] = (await bundle(root, config)) || [];
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  // NOTE: this file is generated when building, so we can't use static import
  // ESM can't require file, so we need to use await import here
  // const { render } = require(serverEntryPath);
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  try {
    await renderPage(render, root, clientBundle!);
  } catch (e) {
    console.log("Render page error.\n", e);
  }
}
