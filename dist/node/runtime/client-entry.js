"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const App_1 = require("./App");
const client_1 = require("react-dom/client");
function renderInBrowser() {
    const containerEl = document.querySelector("#root");
    if (!containerEl) {
        throw new Error("#root element not found");
    }
    (0, client_1.createRoot)(containerEl).render((0, jsx_runtime_1.jsx)(App_1.App, {}));
}
renderInBrowser();
