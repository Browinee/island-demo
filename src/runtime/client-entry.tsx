import { App } from "./app";
import { createRoot } from "react-dom/client";
import siteData from "island:site-data";

function renderInBrowser() {
  const containerEl = document.querySelector("#root");
  if (!containerEl) {
    throw new Error("#root element not found");
  }
  createRoot(containerEl).render(<App />);
}
console.log(siteData);

renderInBrowser();
