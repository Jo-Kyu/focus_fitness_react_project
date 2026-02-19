import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { WishlistProvider } from "./components/WishlistProvider";
import { LoginAuthProvider } from "./components/LoginAuthProvider";

import router from "./router/router.jsx";
import "./assets/scss/all.scss";
import "bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      {/* 全域 Toast 掛載 */}
      <Toaster position="top-right" />
        <LoginAuthProvider>
          <WishlistProvider>
            <RouterProvider router={router} />
          </WishlistProvider>
        </LoginAuthProvider>
  </StrictMode>
);
