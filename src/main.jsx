import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// import ProductDetail from "./pages/ProductDetail";
import CartStepThree from "./pages/ CartStepThree";
import "./assets/scss/all.scss";
import "bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ProductDetail /> */}
    <CartStepThree />
  </StrictMode>,
);
