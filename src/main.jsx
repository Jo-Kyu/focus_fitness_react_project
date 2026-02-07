import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./assets/scss/all.scss";
import "bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 全域 Toast 掛載 */}
    <Toaster position="top-right" />
    <App />
  </StrictMode>
);
