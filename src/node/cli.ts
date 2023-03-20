import cac from "cac";
import { resolve } from "path";
import { build } from "./build";
import { createDevServer } from "./dev";
import { resolveConfig } from "./config";

const cli = cac("island").version("0.0.1").help();

cli.command("dev [root]", "start dev server").action(async (root: string) => {
  const createServer = async () => {
    const { createDevServer } = await import("./dev.js");
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});

cli
  .command("build [root]", "build in production")
  .action(async (root: string) => {
    try {
      root = resolve(root);
      const config = await resolveConfig(root, "build", "production");
      await build(root, config);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
