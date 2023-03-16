var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "island-demo",
      version: "1.0.0",
      description: "",
      main: "index.js",
      bin: {
        island: "bin/island.js"
      },
      scripts: {
        dev: "tsup --watch",
        build: "tsup",
        preview: "cd build && serve ."
      },
      keywords: [],
      author: "justin",
      license: "ISC",
      devDependencies: {
        "@types/fs-extra": "^11.0.1",
        "@types/node": "^18.11.9",
        "@types/react": "^18.0.25",
        "@types/react-dom": "^18.0.9",
        "@types/rollup": "^0.54.0",
        tsup: "^6.6.3",
        typescript: "^4.9.3"
      },
      dependencies: {
        "@vitejs/plugin-react": "^2.2.0",
        ora: "^6.1.2",
        cac: "^6.7.14",
        "fs-extra": "^11.1.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        rollup: "^3.19.1",
        serve: "^14.2.0",
        vite: "3.2.1"
      }
    };
  }
});

// node_modules/.pnpm/tsup@6.6.3_typescript@4.9.3/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/node/cli.ts
import { cac } from "cac";
import path2 from "path";

// src/node/dev.ts
import { createServer as createViteDevServer } from "vite";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_HTML_PATH = join(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-island/indexHtml.ts
import { readFile } from "fs/promises";
function pluginIndexHtml() {
  return {
    name: "island:index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/dev.ts
import pluginReact from "@vitejs/plugin-react";
async function createDevServer(root = process.cwd()) {
  return createViteDevServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  });
}

// src/node/build.ts
import { build as viteBuild } from "vite";
import pluginReact2 from "@vitejs/plugin-react";
import { join as join2 } from "path";
import fs from "fs-extra";
import ora from "ora";
import { pathToFileURL } from "url";
async function bundle(root) {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    // NOTE: this plugin will inject 'import React from 'react' automatically
    // to avoid React is not defined
    plugins: [pluginReact2()],
    build: {
      ssr: isServer,
      outDir: isServer ? ".temp" : "build",
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm"
        }
      }
    }
  });
  const spinner = ora();
  spinner.start("Building client + server bundles...");
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  } finally {
    spinner.stop();
  }
}
async function renderPage(render, root, clientBundle) {
  console.log("clientBunde", clientBundle);
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  console.log(`Rendering page in server side...`);
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
  await fs.ensureDir(join2(root, "build"));
  await fs.writeFile(join2(root, "build/index.html"), html);
  console.log("Finish build server");
}
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root) || [];
  const serverEntryPath = join2(root, ".temp", "ssr-entry.js");
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts
import { resolve } from "path";
var version = require_package().version;
var cli = cac("island").version(version).help();
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  root = root ? path2.resolve(root) : process.cwd();
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build in production").action(async (root) => {
  try {
    root = resolve(root);
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
