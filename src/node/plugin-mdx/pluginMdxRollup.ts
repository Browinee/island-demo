import pluginMdx from "@mdx-js/rollup";
import type { Plugin } from "vite";
import remarkPluginGFM from "remark-gfm";
import rehypePluginAutolinkHeadings from "rehype-autolink-headings";
import rehypePluginSlug from "rehype-slug";
import remarkPluginMDXFrontMatter from "remark-mdx-frontmatter";
import remarkPluginFrontmatter from "remark-frontmatter";
import { remarkPluginToc } from "./remarkPlugins/toc";
import { rehypePluginShiki } from "./rehypePlugins/shiki";
import shiki from "shiki";

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontMatter, { name: "frontmatter" }],
      remarkPluginToc,
      rehypePluginShiki,
      { highlighter: await shiki.getHighlighter({ theme: "nord" }) },
    ],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: "header-anchor",
          },
          content: {
            type: "text",
            value: "#",
          },
        },
      ],
    ],
  }) as unknown as Plugin;
}
