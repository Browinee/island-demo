import { Nav } from "../components/Nav";
import { usePageData } from "../../runtime";
import "uno.css";
import "../styles/base.css";
import "../styles/vars.css";

// export function Layout() {
//   const pageData = usePageData();
//   const { pageType } = pageData;
//   const getContent = () => {
//     if (pageType === "home") {
//       return <div>Home </div>;
//     } else if (pageType === "doc") {
//       return <div>Content</div>;
//     } else {
//       return <div>404 </div>;
//     }
//   };
//   return <div>{getContent()}</div>;
// }

export function Layout() {
  return (
    <div>
      <Nav />
    </div>
  );
}
