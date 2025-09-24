import "../src/css/App.css";
import "../src/css/dom.css";
import "../src/css/domContents.css";
import "../src/css/form.css";
import "../src/css/index.css";
import { RecoilRoot } from "recoil";

export default function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
