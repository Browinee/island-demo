import { Plugin } from "vite";
import { RouteService } from "./routeService";
import { PageModule } from "shared/types";

export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
  preload: () => Promise<PageModule>;
}

interface PluginOptions {
  root: string;
  isSSR: boolean;
}

export const CONVENTIONAL_ROUTE_ID = "island:routes";

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root);

  return {
    name: CONVENTIONAL_ROUTE_ID,
    async configResolved(config) {
      // ex:  config.plugins.push(myOtherPlugin());
      await routeService.init();
    },
    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return "\0" + id;
      }
    },

    load(id: string) {
      if (id === "\0" + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRoutesCode(options.isSSR || false);
      }
    },
  };
}
