"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var __getOwnPropNames = Object.getOwnPropertyNames;
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

// src/node/cli.ts
var _cac = require('cac');
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

// src/node/dev.ts
var _vite = require('vite');

// src/node/constants/index.ts

var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_HTML_PATH = _path.join.call(void 0, PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, 
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = _path.join.call(void 0, 
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-island/indexHtml.ts
var _promises = require('fs/promises');
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
          let html = await _promises.readFile.call(void 0, DEFAULT_HTML_PATH, "utf-8");
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
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
async function createDevServer(root = process.cwd()) {
  return _vite.createServer.call(void 0, {
    root,
    plugins: [pluginIndexHtml(), _pluginreact2.default.call(void 0, )]
  });
}

// src/node/build.ts



var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _ora = require('ora'); var _ora2 = _interopRequireDefault(_ora);
var _url = require('url');
async function bundle(root) {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    // NOTE: this plugin will inject 'import React from 'react' automatically
    // to avoid React is not defined
    plugins: [_pluginreact2.default.call(void 0, )],
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
  const spinner = _ora2.default.call(void 0, );
  spinner.start("Building client + server bundles...");
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      _vite.build.call(void 0, resolveViteConfig(false)),
      _vite.build.call(void 0, resolveViteConfig(true))
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
    <script type="module" src="/${_optionalChain([clientChunk, 'optionalAccess', _ => _.fileName])}"></script>
  </body>
</html>`.trim();
  await _fsextra2.default.ensureDir(_path.join.call(void 0, root, "build"));
  await _fsextra2.default.writeFile(_path.join.call(void 0, root, "build/index.html"), html);
  console.log("Finish build server");
}
async function build(root = process.cwd()) {
  const [clientBundle, serverBundle] = await bundle(root) || [];
  const serverEntryPath = _path.join.call(void 0, root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => require(_url.pathToFileURL.call(void 0, serverEntryPath).toString()));
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts

var version = require_package().version;
var cli = _cac.cac.call(void 0, "island").version(version).help();
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  root = root ? _path2.default.resolve(root) : process.cwd();
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build in production").action(async (root) => {
  try {
    root = _path.resolve.call(void 0, root);
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
