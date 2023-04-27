import { Content } from "../../runtime/Content";
import "uno.css";

export function Layout() {
  return (
    <div>
      <h1 p="2" m="5">
        Common Content
      </h1>
      <h1>Doc Content</h1>
      <Content />
    </div>
  );
}
