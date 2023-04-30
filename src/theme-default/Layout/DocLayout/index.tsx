import { usePageData } from "@runtime";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar/index";

export function DocLayout() {
  const { siteData } = usePageData();
  const sidebarData = siteData.themeConfig?.sidebar || {};
  const { pathname } = useLocation();
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    return pathname.startsWith(key);
  });

  const matchedSidebar =
    (matchedSidebarKey && sidebarData[matchedSidebarKey]) || [];

  return (
    <div>
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
    </div>
  );
}
