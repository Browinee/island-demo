import fs from "fs-extra";
import { loadConfigFromFile } from "vite";
import { SiteConfig, UserConfig } from "../shared/types";
import { resolve } from "path";
function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ["config.ts", "config.js"];
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
}
type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

export async function resolveUserConfig(
  root: string,
  command: "serve" | "build",
  mode: "development" | "production",
) {
  const configPath = getUserConfigPath(root);
  const result = await loadConfigFromFile(
    {
      command,
      mode,
    },
    configPath,
    root,
  );

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = await (typeof rawConfig === "function"
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}
export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || "Island.js",
    description: userConfig.description || "SSG Framework",
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {},
  };
}

export async function resolveConfig(
  root: string,
  command: "serve" | "build",
  mode: "development" | "production",
): Promise<SiteConfig> {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  const siteConfig: SiteConfig = {
    root,
    configPath: configPath || "",
    siteData: resolveSiteData(userConfig as UserConfig),
  };
  return siteConfig;
}
export function defineConfig(config: UserConfig) {
  return config;
}
