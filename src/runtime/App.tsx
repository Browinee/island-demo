import { routes } from "island:routes";
import { matchRoutes } from "react-router-dom";
import { PageData } from "shared/types";
import { Layout } from "../theme-default";
import siteData from "island:site-data";

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath);
  console.log("matched", { routes, matched, siteData });

  if (matched) {
    const moduleInfo = await matched[0].route.preload();
    console.log(moduleInfo);
    return {
      pageType: "doc",
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
    };
  }
  return {
    pageType: "404",
    siteData,
    pagePath: routePath,
    frontmatter: {},
  };
}

export function App() {
  return <Layout />;
}
