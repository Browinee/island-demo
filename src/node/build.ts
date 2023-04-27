import fs from "fs-extra";
import ora from "ora";
import path, { join, dirname } from "path";
import type { RollupOutput } from "rollup";
import { SiteConfig } from "shared/types";
import { InlineConfig, build as viteBuild } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";
import { createVitePlugins } from "./vitePlugins";
import { Route } from "./plugin-routes";

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean,
  ): Promise<InlineConfig> => ({
    mode: "production",
    root,
    // NOTE: this plugin will inject 'import React from 'react' automatically
    // to avoid React is not defined
    plugins: await createVitePlugins(config, undefined, isServer),
    ssr: {
      noExternal: ["react-router-dom"],
    },
    build: {
      ssr: isServer,
      outDir: isServer ? path.join(root, ".temp") : path.join(root, "build"),
      // outDir: isServer ? path.join(root, ".temp") : "build",
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
      viteBuild(await resolveViteConfig(false)),
      viteBuild(await resolveViteConfig(true)),
    ]);

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log(e);
  } finally {
    spinner.stop();
  }
}
export async function renderPage(
  render: (url: string) => string,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput,
) {
  console.log("Rendering page in server side...");

  const clientChunk = clientBundle.output.find(
    (chunk: any) => chunk.type === "chunk" && chunk.isEntry,
  );
  return Promise.all(
    routes.map(async (route) => {
      const routePath = route.path;
      const appHtml = render(routePath);
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
      const fileName = routePath.endsWith("/")
        ? `${routePath}index.html`
        : `${routePath}.html`;
      await fs.ensureDir(join(root, "build", dirname(fileName)));
      await fs.writeFile(join(root, "build", fileName), html);
    }),
  );
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  const [clientBundle, serverBundle] = (await bundle(root, config)) || [];
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  // NOTE: this file is generated when building, so we can't use static import
  // ESM can't require file, so we need to use await import here
  // const { render } = require(serverEntryPath);
  // const { render } = await import(pathToFileURL(serverEntryPath).toString());
  const { render, routes } = await import(serverEntryPath);

  try {
    await renderPage(render, routes, root, clientBundle!);
  } catch (e) {
    console.log("Render page error.\n", e);
  }
}
