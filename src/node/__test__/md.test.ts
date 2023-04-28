import shiki from "shiki";
import { rehypePluginShiki } from "./../plugin-mdx/rehypePlugins/shiki";
import { unified } from "unified";
import { describe, test, expect } from "vitest";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { rehypePluginPreWrapper } from "../plugin-mdx/rehypePlugins/preWrapper";
import remarkMdx from "remark-mdx";
import { remarkPluginToc } from "../plugin-mdx/remarkPlugins/toc";
import remarkStringify from "remark-stringify";

describe("Markdown compile cases", async () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypePluginPreWrapper)
    .use(rehypePluginShiki, {
      highlighter: await shiki.getHighlighter({ theme: "nord" }),
    });
  test("Compile title", async () => {
    const mdContent = "# 123";
    const result = processor.processSync(mdContent);
    // eslint-disable-next-line
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"');
  });

  test("Compile code", async () => {
    const mdContent = "I am using `Island.js`";
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(
      // eslint-disable-next-line
      '"<p>I am using <code>Island.js</code></p>"',
    );
  });
  test.only("Compile code block", async () => {
    const mdContent = "```js\nconsole.log(123);\n```";
    const result = processor.processSync(mdContent);
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\" tabindex=\\"0\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #B48EAD\\">123</span><span style=\\"color: #D8DEE9FF\\">)</span><span style=\\"color: #81A1C1\\">;</span></span>
      <span class=\\"line\\"></span></code></pre></div>"
    `);
  });
  test("Compile TOC", async () => {
    const mdContent = `# h1

## h2 \`code\`

### h3 [link](https://islandjs.dev)

#### h4

##### h5
`;
    const remarkProcessor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkPluginToc)
      .use(remarkStringify);

    const result = remarkProcessor.processSync(mdContent);
    expect(result.value.toString().replace(mdContent, ""))
      .toMatchInlineSnapshot(`
      "
      export const toc = [
        {
          \\"id\\": \\"h2-code\\",
          \\"text\\": \\"h2 code\\",
          \\"depth\\": 2
        },
        {
          \\"id\\": \\"h3-link\\",
          \\"text\\": \\"h3 link\\",
          \\"depth\\": 3
        },
        {
          \\"id\\": \\"h4\\",
          \\"text\\": \\"h4\\",
          \\"depth\\": 4
        }
      ];
      "
    `);
  });
});
