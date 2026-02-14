import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "./components/WishlistProvider";
import { LoginAuthProvider } from "./components/LoginAuthProvider";

import App from "./App";

import "./assets/scss/all.scss";
import "bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 全域 Toast 掛載 */}
    <Toaster position="top-right" />
      <LoginAuthProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
      </LoginAuthProvider>
  </StrictMode>,
);
