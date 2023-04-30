import { defineConfig } from "../dist";

export default defineConfig({
  title: "xxx",
  themeConfig: {
    nav: [
      { text: "Main", link: "/" },
      { text: "Guide", link: "/guide/" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Tutorial",
          items: [
            {
              text: "Quick Start",
              link: "/guide/a",
            },
            {
              text: "Install",
              link: "/guide/b",
            },
          ],
        },
      ],
    },
  },
});
