"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const path_1 = __importDefault(require("path"));
const dev_1 = require("./dev");
const version = require("../../package.json").version;
const cli = (0, cac_1.cac)("island").version(version).help();
cli
    .command("[root]", "start dev server")
    .alias("dev")
    .action(async (root) => {
    root = root ? path_1.default.resolve(root) : process.cwd();
    console.log("process", { process: process.cwd() });
    const server = await (0, dev_1.createDevServer)(root);
    await server.listen();
    server.printUrls();
    console.log("dev", root);
});
cli
    .command("build [root]", "build for production")
    .action(async (root) => {
    console.log("build", root);
});
cli.parse();
