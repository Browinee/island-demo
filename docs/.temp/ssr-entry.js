"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const react = require("react");
const jsxRuntime = require("react/jsx-runtime");
const server = require("react-dom/server");
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const jsxRuntime__namespace = /* @__PURE__ */ _interopNamespace(jsxRuntime);
const jsx = jsxRuntime__namespace.jsx;
const jsxs = jsxRuntime__namespace.jsxs;
function Layout() {
  const [count, setCount] = react.useState(0);
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx("h1", {
      children: "This is Layout Component"
    }), /* @__PURE__ */ jsxs("div", {
      children: [count, /* @__PURE__ */ jsx("button", {
        onClick: () => setCount(count + 1),
        children: "Add Count"
      })]
    })]
  });
}
function App() {
  return /* @__PURE__ */ jsx(Layout, {});
}
function render() {
  return server.renderToString(/* @__PURE__ */ jsx(App, {}));
}
exports.render = render;
