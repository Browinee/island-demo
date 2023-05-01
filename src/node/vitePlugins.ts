import { pluginIndexHtml } from "./plugin-island/indexHtml";
import pluginReact from "@vitejs/plugin-react";
import { pluginConfig } from "./plugin-island/config";
import { pluginRoutes } from "./plugin-routes";
import { SiteConfig } from "shared/types";
import { createPluginMdx } from "./plugin-mdx";
import pluginUnocss from "unocss/vite";
import unocssOptions from "./unocssOptions";
import { PACKAGE_ROOT } from "./constants";
import path from "path";
import babelPluginIsland from "./babel-plugin-island";

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR = false,
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact({
      // NOTE: classic =>
      // 1. use React.createElement(xxx)
      // 2.need to import React from "react" manually
      //
      jsxRuntime: "automatic",
      jsxImportSource: isSSR
        ? path.join(PACKAGE_ROOT, "src", "runtime")
        : "react",
      babel: {
        plugins: [babelPluginIsland],
      },
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR: false,
    }),
    await createPluginMdx(),
  ];
}
