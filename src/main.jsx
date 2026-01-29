import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ProductDetail from "./pages/ProductDetail";
import CartStepThree from "./pages/ CartStepThree";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./assets/scss/all.scss";
import "bootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProductDetail />
    {/* <CartStepThree /> */}
    {/* <Header /> */}
    {/* <Footer /> */}
  </StrictMode>
);
