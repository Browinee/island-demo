import { Plugin } from "vite";
import { pluginMdxRollup } from "./pluginMdxRollup";
import { pluginMdxHMR } from "./pluginMdxHmr";

export function createPluginMdx(): Plugin[] {
  return [pluginMdxRollup(), pluginMdxHMR()];
}
