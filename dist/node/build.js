"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.renderPage = exports.bundle = void 0;
const vite_1 = require("vite");
const constants_1 = require("./constants");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = require("path");
const fs = __importStar(require("fs-extra"));
async function bundle(root) {
    const resolveViteConfig = (isServer) => ({
        mode: "production",
        root,
        // NOTE: this plugin will inject 'import React from 'react' automatically
        // to avoid React is not defined
        plugins: [(0, plugin_react_1.default)()],
        build: {
            ssr: isServer,
            outDir: isServer ? ".temp" : "build",
            rollupOptions: {
                input: isServer ? constants_1.SERVER_ENTRY_PATH : constants_1.CLIENT_ENTRY_PATH,
                output: {
                    format: isServer ? "cjs" : "esm",
                },
            },
        },
    });
    console.log(`Building client + server bundles...`);
    try {
        const [clientBundle, serverBundle] = await Promise.all([
            (0, vite_1.build)(resolveViteConfig(false)),
            (0, vite_1.build)(resolveViteConfig(true)),
        ]);
        return [clientBundle, serverBundle];
    }
    catch (e) {
        console.log(e);
    }
}
exports.bundle = bundle;
async function renderPage(render, root, clientBundle) {
    console.log("clientBunde", clientBundle);
    const clientChunk = clientBundle.output.find((chunk) => chunk.type === "chunk" && chunk.isEntry);
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
    await fs.ensureDir((0, path_1.join)(root, "build"));
    await fs.writeFile((0, path_1.join)(root, "build/index.html"), html);
    // await fs.remove(join(root, ".temp"));
    console.log("Finish build server");
}
exports.renderPage = renderPage;
async function build(root = process.cwd()) {
    const [clientBundle, serverBundle] = (await bundle(root)) || [];
    const serverEntryPath = (0, path_1.join)(root, ".temp", "ssr-entry.js");
    const { render } = require(serverEntryPath);
    await renderPage(render, root, clientBundle);
}
exports.build = build;
