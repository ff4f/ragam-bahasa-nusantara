import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import moment from "moment";
import "moment/dist/locale/id";

moment.locale("id");

createRoot(document.getElementById("root")!).render(<App />);
