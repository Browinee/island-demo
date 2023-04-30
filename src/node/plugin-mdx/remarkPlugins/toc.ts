import type { Plugin } from "unified";
import Slugger from "github-slugger";
import { visit } from "unist-util-visit";
import { Root } from "mdast";
import type { MdxjsEsm, Program } from "mdast-util-mdxjs-esm";
import { parse } from "acorn";

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: "link" | "text" | "inlineCode";
  value: string;
  children?: ChildNode[];
}

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = [];
    const slugger = new Slugger();
    visit(tree, "heading", (node) => {
      if (!node.depth || !node.children) {
        return;
      }
      // h2 ~ h4
      if (node.depth > 1 && node.depth < 5) {
        // node.children is array
        // 1. text node，如 '## title'
        // x
        // {
        //   type: 'text',
        //   value: 'title'
        // }
        // 2. link node '## [title](/path)'
        //
        // {
        //   type: 'link',
        //     {
        //       type: 'text',
        //       value: 'title'
        //     }
        //   ]
        // }
        // 3. code， '## `title`'
        // {
        //   type: 'inlineCode',
        //   value: 'title'
        // }
        const originText = (node.children as ChildNode[])
          .map((child) => {
            switch (child.type) {
              case "link":
                return child.children?.map((c) => c.value).join("") || "";
              default:
                return child.value;
            }
          })
          .join("");

        const id = slugger.slug(originText);
        console.log("id", id);
        toc.push({
          id,
          text: originText,
          depth: node.depth,
        });
      }
    });
    console.log("toc", toc);

    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)};`;

    tree.children.push({
      type: "mdxjsEsm",
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: "module",
        }) as unknown as Program,
      },
    } as MdxjsEsm);
  };
};
