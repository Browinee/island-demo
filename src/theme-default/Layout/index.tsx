import { usePageData } from "../../runtime";
import { Nav } from "../components/Nav";
import "../styles/base.css";
import "../styles/vars.css";
import "../styles/doc.css";
import "uno.css";
import { HomeLayout } from "./HomeLayout/index";
import { DocLayout } from "./DocLayout";
import { NotFoundLayout } from "./NotFoundLayout";

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;
  const getContent = () => {
    if (pageType === "home") {
      return <HomeLayout />;
    } else if (pageType === "doc") {
      return <DocLayout />;
    } else {
      return <NotFoundLayout />;
    }
  };
  return (
    <div>
      <Nav />
      <section
        style={{
          paddingTop: "var(--island-nav-height)",
        }}
      >
        {getContent()}
      </section>
    </div>
  );
}
