import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import moment from "moment";
import "moment/dist/locale/id";

moment.updateLocale("id", {
  relativeTime: {
    future: "%s",
    past: "%s",
    s: "baru",
    ss: "%d dtk",
    m: "1 mnt",
    mm: "%d mnt",
    h: "1 jam",
    hh: "%d jam",
    d: "1 hr",
    dd: "%d hr",
    M: "1 bln",
    MM: "%d bln",
    y: "1 th",
    yy: "%d th",
  },
});

moment.locale("id");

createRoot(document.getElementById("root")!).render(<App />);
