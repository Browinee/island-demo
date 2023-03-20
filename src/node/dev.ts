import { createServer as createViteDevServer } from "vite";
import { pluginIndexHtml } from "./plugin-island/indexHtml";
import { pluginConfig } from "./plugin-island/config";
import { PACKAGE_ROOT } from "./constants";

import pluginReact from "@vitejs/plugin-react";
import { resolveConfig } from "./config";
export async function createDevServer(
  root = process.cwd(),
  restartServer: () => Promise<void>,
) {
  const config = await resolveConfig(root, "serve", "development");
  return createViteDevServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer),
    ],
  });
}
