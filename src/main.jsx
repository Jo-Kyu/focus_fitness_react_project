import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import App from "./App";
import Home from "./pages/Home";
import "./assets/scss/all.scss";
import "bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster possition="top-right" />
    <Home />
  </StrictMode>,
);
