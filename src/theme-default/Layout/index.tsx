import "uno.css";
import { usePageData } from "../../runtime";

export function Layout() {
  const pageData = usePageData();
  const { pageType } = pageData;
  const getContent = () => {
    if (pageType === "home") {
      return <div>Home </div>;
    } else if (pageType === "doc") {
      return <div>Content</div>;
    } else {
      return <div>404 </div>;
    }
  };
  return <div>{getContent()}</div>;
}
