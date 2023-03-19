import { createServer as createViteDevServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import { pluginConfig } from "./plugin-island/config";

import pluginReact from "@vitejs/plugin-react";
import { resolveConfig } from "./config";
export async function createDevServer(
  root = process.cwd(),
  restartServer: () => Promise<void>,
) {
  const config = await resolveConfig(root, "serve", "development");
  return createViteDevServer({
    root,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer),
    ],
  });
}
