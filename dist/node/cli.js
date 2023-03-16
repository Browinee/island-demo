"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const path_1 = __importDefault(require("path"));
const dev_1 = require("./dev");
const build_1 = require("./build");
const path_2 = require("path");
const version = require("../../package.json").version;
const cli = (0, cac_1.cac)("island").version(version).help();
cli
    .command("[root]", "start dev server")
    .alias("dev")
    .action(async (root) => {
    root = root ? path_1.default.resolve(root) : process.cwd();
    const server = await (0, dev_1.createDevServer)(root);
    await server.listen();
    server.printUrls();
});
cli
    .command("build [root]", "build in production")
    .action(async (root) => {
    try {
        root = (0, path_2.resolve)(root);
        await (0, build_1.build)(root);
    }
    catch (e) {
        console.log(e);
    }
});
cli.parse();
