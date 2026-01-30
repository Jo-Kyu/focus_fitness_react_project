import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./assets/scss/all.scss";
import "bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
